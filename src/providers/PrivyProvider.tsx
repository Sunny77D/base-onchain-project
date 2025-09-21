'use client'

import { PrivyProvider as Privy } from '@privy-io/react-auth'
import { WagmiProvider } from '@privy-io/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { base, baseSepolia } from 'viem/chains'
import { createConfig } from '@privy-io/wagmi'
import { http } from 'viem'

/**
 * Wagmi Configuration with Privy
 *
 * This creates a wagmi config that works with Privy's wallet management
 * Privy handles all the wallet connections, we just need to provide chains and transports
 */
const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  transports: {
    // Use environment variables for RPC URLs
    // These can be from Alchemy, QuickNode, Infura, etc.
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'),
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'),
  },
})

const queryClient = new QueryClient()

/**
 * PrivyProvider Component
 *
 * This wraps your entire app and provides:
 * - Authentication context (usePrivy hook)
 * - Wallet management (useWallets hook)
 * - Wagmi integration for blockchain interactions
 *
 * IMPORTANT: Email login must be enabled in your Privy dashboard!
 * Go to https://dashboard.privy.io -> Your App -> Login Methods -> Enable Email
 *
 * @param children - React components to wrap
 */
export function PrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <Privy
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        // Appearance settings
        appearance: {
          theme: 'dark',
          accentColor: '#0052ff',
        },

        // Login methods configuration
        // IMPORTANT: These must also be enabled in your Privy dashboard!
        loginMethods: ['email', 'wallet'], // Start with just email and wallet

        // Chain configuration
        defaultChain: baseSepolia,
        supportedChains: [base, baseSepolia],

        // Embedded wallets - creates wallets for email/social users
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          noPromptOnSignature: false, // Show signature prompts for security
        },

        // Legal compliance (optional but recommended)
        legal: {
          termsAndConditionsUrl: '', // Add your T&C URL
          privacyPolicyUrl: '', // Add your privacy policy URL
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </Privy>
  )
}