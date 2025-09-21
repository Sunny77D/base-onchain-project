/**
 * Smart Contract Utilities and Examples
 *
 * This file contains:
 * - Example contract ABIs
 * - Helper functions for contract interactions
 * - Common contract addresses on Base
 */

// Example ERC20 Token ABI (minimal)
export const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// Example Simple Storage Contract ABI
export const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    name: 'get',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'x', type: 'uint256' }],
    name: 'set',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

// Common contract addresses on Base
export const CONTRACT_ADDRESSES = {
  // Base Mainnet
  base: {
    // USDC on Base
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    // Add more mainnet contracts here
  },
  // Base Sepolia Testnet
  baseSepolia: {
    // Example test token (you'll need to deploy your own)
    TEST_TOKEN: '0x0000000000000000000000000000000000000000',
    // Add your deployed test contracts here
  },
} as const

/**
 * Helper function to get contract address by chain ID
 */
export function getContractAddress(
  chainId: number,
  contractName: keyof typeof CONTRACT_ADDRESSES.base
): string | undefined {
  if (chainId === 8453) {
    // Base Mainnet
    return CONTRACT_ADDRESSES.base[contractName]
  } else if (chainId === 84532) {
    // Base Sepolia
    return CONTRACT_ADDRESSES.baseSepolia[contractName as keyof typeof CONTRACT_ADDRESSES.baseSepolia]
  }
  return undefined
}

/**
 * Format token amount for display
 * @param amount - Raw token amount
 * @param decimals - Token decimals (default 18)
 * @returns Formatted string
 */
export function formatTokenAmount(amount: bigint, decimals: number = 18): string {
  const divisor = BigInt(10 ** decimals)
  const wholePart = amount / divisor
  const fractionalPart = amount % divisor

  const fractionalStr = fractionalPart.toString().padStart(decimals, '0')
  const trimmedFractional = fractionalStr.slice(0, 6).replace(/0+$/, '')

  if (trimmedFractional === '') {
    return wholePart.toString()
  }

  return `${wholePart}.${trimmedFractional}`
}