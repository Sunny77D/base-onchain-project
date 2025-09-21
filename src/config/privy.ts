/**
 * Privy Configuration
 *
 * This file sets up Privy authentication with support for:
 * - Email login
 * - Social logins (Google, Discord, Twitter)
 * - Multiple wallet connections
 * - SMS authentication
 *
 * Privy handles all the complexity of wallet connections and auth
 */

import { base, baseSepolia } from 'viem/chains'

// Configuration for Privy authentication
export const privyConfig = {
  // Appearance customization
  appearance: {
    theme: 'dark' as const,
    accentColor: '#0052ff',
    logo: '/logo.png', // Add your logo to public folder
  },

  // Login methods - Privy supports many options
  loginMethods: [
    'email',           // Email magic links
    'wallet',          // Direct wallet connection
    'google',          // Google OAuth
    'discord',         // Discord OAuth
    'twitter',         // Twitter OAuth
    'sms',            // SMS verification
  ],

  // Supported chains for wallet connections
  defaultChain: baseSepolia, // Default to testnet
  supportedChains: [base, baseSepolia],

  // Embedded wallets configuration
  embeddedWallets: {
    createOnLogin: 'users-without-wallets', // Auto-create wallets for new users
  },

  // Wallet connection options
  walletConnectCloudProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
}