import { NextRequest, NextResponse } from 'next/server'
import { createWalletClient, createPublicClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base, baseSepolia } from 'viem/chains'

/**
 * API Route: Write to Smart Contract (Server-side)
 *
 * This route demonstrates server-side contract interactions
 * It uses a private key stored in environment variables
 *
 * WARNING: This is for server-side transactions only!
 * Never expose private keys in client code
 *
 * Example usage:
 * POST /api/contract/write
 * Body: {
 *   contractAddress: "0x...",
 *   abi: [...],
 *   functionName: "transfer",
 *   args: ["0xRecipient", "1000000000000000000"],
 *   chainId: 84531
 * }
 */

export async function POST(request: NextRequest) {
  try {
    // Check if private key is configured
    if (!process.env.PRIVATE_KEY) {
      return NextResponse.json(
        {
          error: 'Server not configured for transactions',
          hint: 'Set PRIVATE_KEY in environment variables for server-side transactions'
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { contractAddress, abi, functionName, args = [], chainId } = body

    // Validate required fields
    if (!contractAddress || !abi || !functionName) {
      return NextResponse.json(
        { error: 'Missing required fields: contractAddress, abi, functionName' },
        { status: 400 }
      )
    }

    // Select the correct chain and RPC URL
    const chain = chainId === base.id ? base : baseSepolia
    const rpcUrl = chainId === base.id
      ? process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'
      : process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'

    // Create account from private key
    const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)

    // Create wallet client for writing to blockchain
    const walletClient = createWalletClient({
      account,
      chain,
      transport: http(rpcUrl),
    })

    // Create public client for gas estimation
    const publicClient = createPublicClient({
      chain,
      transport: http(rpcUrl),
    })

    // Simulate the transaction first (optional but recommended)
    const { request: simulatedRequest } = await publicClient.simulateContract({
      account,
      address: contractAddress as `0x${string}`,
      abi,
      functionName,
      args,
    })

    // Execute the transaction
    const hash = await walletClient.writeContract(simulatedRequest)

    // Wait for transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      confirmations: 2, // Wait for 2 confirmations
    })

    // Return transaction details
    return NextResponse.json({
      success: true,
      transactionHash: hash,
      blockNumber: receipt.blockNumber.toString(),
      status: receipt.status,
      gasUsed: receipt.gasUsed.toString(),
      chain: chain.name,
    })

  } catch (error) {
    console.error('Error writing to contract:', error)
    return NextResponse.json(
      {
        error: 'Failed to write to contract',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}