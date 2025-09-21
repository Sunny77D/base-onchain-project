'use client'

import { usePrivy, useWallets } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, LogOut, User, Mail } from 'lucide-react'
import { useAccount } from 'wagmi'

/**
 * WalletConnect Component
 *
 * This component handles all authentication through Privy:
 * - Login with email, social accounts, or wallet
 * - Displays connected wallet information
 * - Manages logout functionality
 *
 * Privy provides:
 * - usePrivy(): Authentication state and methods
 * - useWallets(): Access to connected wallets
 */
export function WalletConnect() {
  // Privy hooks for authentication
  const { ready, authenticated, user, login, logout } = usePrivy()
  const { wallets } = useWallets()

  // Wagmi hook for current account (works with Privy's wallet management)
  const { address, chain } = useAccount()

  // Show loading state while Privy initializes
  if (!ready) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show login button if not authenticated
  if (!authenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect to Get Started</CardTitle>
          <CardDescription>
            Choose your preferred login method. You can use email, social accounts, or connect a wallet directly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={login}
            size="lg"
            className="w-full"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet or Login
          </Button>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Powered by Privy - Supporting MetaMask, Coinbase Wallet, Rainbow, and more
          </p>
        </CardContent>
      </Card>
    )
  }

  // Display user information when authenticated
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Account</CardTitle>
        <CardDescription>
          {chain ? `Connected to ${chain.name}` : 'Manage your connection'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Show user email if logged in with email */}
        {user?.email && (
          <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{user.email.address}</span>
          </div>
        )}

        {/* Show connected wallets */}
        {wallets.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Connected Wallets:</p>
            {wallets.map((wallet) => (
              <div
                key={wallet.address}
                className="flex items-center justify-between p-3 bg-secondary rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-mono">
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {wallet.walletClientType}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Show embedded wallet info if user has one */}
        {user?.wallet && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Embedded Wallet</p>
            <p className="text-sm font-mono">
              {user.wallet.address.slice(0, 6)}...{user.wallet.address.slice(-4)}
            </p>
          </div>
        )}

        {/* Logout button */}
        <Button
          onClick={logout}
          variant="outline"
          className="w-full"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </Button>
      </CardContent>
    </Card>
  )
}