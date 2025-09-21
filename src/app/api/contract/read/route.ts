import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'

/**
 * API Route: Read from Smart Contract
 *
 * This route demonstrates how to read data from a smart contract
 * It uses viem to create a public client and call contract methods
 *
 * Example usage:
 * POST /api/contract/read
 * Body: {
 *   contractAddress: "0x...",
 *   abi: [...],
 *   functionName: "balanceOf",
 *   args: ["0xUserAddress"],
 *   chainId: 84531
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contractAddress, abi, functionName, args = [], chainId } = body

    // Validate required fields
    if (!contractAddress || !abi || !functionName) {
      return NextResponse.json(
        { error: 'Missing required fields: contractAddress, abi, functionName' },
        { status: 400 }
      )
    }

    // Select the correct chain and RPC URL based on chainId
    const chain = chainId === base.id ? base : baseSepolia
    const rpcUrl = chainId === base.id
      ? process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'
      : process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'

    // Create a public client for reading from the blockchain
    const publicClient = createPublicClient({
      chain,
      transport: http(rpcUrl),
    })

    // Read from the contract
    const data = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName,
      args,
    })

    // Return the data
    return NextResponse.json({
      success: true,
      data,
      chain: chain.name,
    })

  } catch (error) {
    console.error('Error reading contract:', error)
    return NextResponse.json(
      {
        error: 'Failed to read from contract',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}