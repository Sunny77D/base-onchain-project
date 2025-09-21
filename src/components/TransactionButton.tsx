'use client'

import { useState } from 'react'
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'

/**
 * TransactionButton Component
 *
 * This component demonstrates:
 * - Sending ETH transactions using wagmi hooks
 * - Transaction state management
 * - Integration with Privy authentication
 *
 * The component uses:
 * - useSendTransaction: To initiate transactions
 * - useWaitForTransactionReceipt: To track confirmation
 * - useAccount: To check wallet connection status
 */
export function TransactionButton() {
  // Authentication and wallet state
  const { authenticated } = usePrivy()
  const { address, isConnected, chain } = useAccount()

  // Transaction hooks from wagmi
  const { sendTransaction, data: hash, isPending, error } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Form state
  const [recipientAddress, setRecipientAddress] = useState('')
  const [amount, setAmount] = useState('0.0001')

  /**
   * Handle sending a transaction
   * Validates inputs and initiates the transaction
   */
  const handleSendTransaction = () => {
    // Validate recipient address
    if (!recipientAddress || !recipientAddress.startsWith('0x')) {
      alert('Please enter a valid recipient address')
      return
    }

    // Validate amount
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount')
      return
    }

    // Send the transaction
    sendTransaction({
      to: recipientAddress as `0x${string}`,
      value: parseEther(amount),
    })
  }

  // Don't show if not authenticated
  if (!authenticated || !isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Send Transaction</CardTitle>
          <CardDescription>
            Connect your wallet to send transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please connect your wallet first to send transactions.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Transaction</CardTitle>
        <CardDescription>
          Send ETH on {chain?.name || 'Base'} network
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recipient Address Input */}
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            type="text"
            placeholder="0x..."
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            disabled={isPending || isConfirming}
          />
          <p className="text-xs text-muted-foreground">
            Enter the wallet address to send ETH to
          </p>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (ETH)</Label>
          <Input
            id="amount"
            type="number"
            step="0.0001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isPending || isConfirming}
          />
          <p className="text-xs text-muted-foreground">
            Amount of ETH to send (gas fees will be added)
          </p>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSendTransaction}
          disabled={isPending || isConfirming || !recipientAddress || !amount}
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirm in Wallet...
            </>
          ) : isConfirming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Waiting for Confirmation...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Transaction
            </>
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">Transaction Failed</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {error.message.split('.')[0]}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Status */}
        {hash && (
          <div className="space-y-2">
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm font-medium">Transaction Submitted</p>
              <p className="text-xs font-mono text-muted-foreground mt-1 break-all">
                {hash}
              </p>
            </div>

            {isSuccess && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <p className="text-sm font-medium text-green-500">
                    Transaction Confirmed!
                  </p>
                </div>
                <a
                  href={`https://${chain?.id === 8453 ? '' : 'sepolia.'}basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline mt-1 inline-block"
                >
                  View on BaseScan →
                </a>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}