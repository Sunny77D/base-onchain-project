'use client'

import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileCode2, Loader2, CheckCircle, AlertCircle, Database } from 'lucide-react'
import { SIMPLE_STORAGE_ABI } from '@/lib/contracts'
import { usePrivy } from '@privy-io/react-auth'

/**
 * ContractInteraction Component
 *
 * This component demonstrates how to interact with smart contracts:
 * - Reading data from contracts
 * - Writing data to contracts
 * - Using both client-side (wagmi) and server-side (API routes) approaches
 *
 * For this example, we use a simple storage contract that can:
 * - Store a number (set function)
 * - Retrieve the stored number (get function)
 */

// Example contract address - replace with your deployed contract
const EXAMPLE_CONTRACT = '0x0000000000000000000000000000000000000000'

export function ContractInteraction() {
  const { authenticated } = usePrivy()
  const { isConnected, chain } = useAccount()
  const [inputValue, setInputValue] = useState('')
  const [apiResult, setApiResult] = useState<any>(null)
  const [isApiLoading, setIsApiLoading] = useState(false)

  // Read contract state using wagmi
  const { data: storedValue, isLoading: isReading, refetch } = useReadContract({
    address: EXAMPLE_CONTRACT as `0x${string}`,
    abi: SIMPLE_STORAGE_ABI,
    functionName: 'get',
    chainId: chain?.id,
  })

  // Write to contract using wagmi
  const {
    writeContract,
    data: writeHash,
    isPending: isWriting,
    error: writeError,
  } = useWriteContract()

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: writeHash,
  })

  /**
   * Handle writing to the contract (client-side)
   * This uses the user's connected wallet to send the transaction
   */
  const handleWrite = () => {
    if (!inputValue) {
      alert('Please enter a value')
      return
    }

    writeContract({
      address: EXAMPLE_CONTRACT as `0x${string}`,
      abi: SIMPLE_STORAGE_ABI,
      functionName: 'set',
      args: [BigInt(inputValue)],
    })
  }

  /**
   * Example of using API route to read from contract
   * This demonstrates server-side contract reading
   */
  const handleApiRead = async () => {
    setIsApiLoading(true)
    try {
      const response = await fetch('/api/contract/read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractAddress: EXAMPLE_CONTRACT,
          abi: SIMPLE_STORAGE_ABI,
          functionName: 'get',
          args: [],
          chainId: chain?.id || 84532, // Default to Base Sepolia
        }),
      })

      const data = await response.json()
      setApiResult(data)
    } catch (error) {
      console.error('API call failed:', error)
      setApiResult({ error: 'Failed to read from contract via API' })
    } finally {
      setIsApiLoading(false)
    }
  }

  if (!authenticated || !isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Smart Contract Interaction</CardTitle>
          <CardDescription>
            Connect your wallet to interact with smart contracts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This example shows how to read and write data to smart contracts on Base.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Contract Interaction</CardTitle>
        <CardDescription>
          Example: Simple Storage Contract on {chain?.name || 'Base'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contract Address Display */}
        <div className="p-3 bg-secondary rounded-lg">
          <div className="flex items-center gap-2">
            <FileCode2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Contract Address:</span>
          </div>
          <p className="text-sm font-mono mt-1">{EXAMPLE_CONTRACT}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Note: Deploy your own contract and update this address
          </p>
        </div>

        {/* Read Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Read from Contract</h3>

          {/* Client-side read result */}
          <div className="p-3 bg-primary/5 border rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm">Stored Value (Client):</span>
              {isReading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="font-mono font-medium">
                  {storedValue?.toString() || '0'}
                </span>
              )}
            </div>
          </div>

          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="w-full"
            disabled={isReading}
          >
            <Database className="mr-2 h-4 w-4" />
            Refresh Value
          </Button>

          {/* API Route Example */}
          <div className="pt-3 border-t">
            <Button
              onClick={handleApiRead}
              variant="secondary"
              size="sm"
              className="w-full"
              disabled={isApiLoading}
            >
              {isApiLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reading via API...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Read via API Route
                </>
              )}
            </Button>

            {apiResult && (
              <div className="mt-2 p-2 bg-muted rounded text-xs font-mono">
                {JSON.stringify(apiResult, null, 2)}
              </div>
            )}
          </div>
        </div>

        {/* Write Section */}
        <div className="space-y-3 pt-3 border-t">
          <h3 className="text-sm font-medium">Write to Contract</h3>

          <div className="space-y-2">
            <Label htmlFor="value">New Value</Label>
            <Input
              id="value"
              type="number"
              placeholder="Enter a number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isWriting || isConfirming}
            />
          </div>

          <Button
            onClick={handleWrite}
            disabled={isWriting || isConfirming || !inputValue}
            className="w-full"
          >
            {isWriting ? (
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
                <FileCode2 className="mr-2 h-4 w-4" />
                Write to Contract
              </>
            )}
          </Button>

          {/* Write Error */}
          {writeError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive">Write Failed</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {writeError.message.split('.')[0]}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <p className="text-sm font-medium text-green-500">
                  Value Updated Successfully!
                </p>
              </div>
              <Button
                onClick={() => refetch()}
                variant="ghost"
                size="sm"
                className="mt-2 w-full"
              >
                Refresh to see new value
              </Button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-3 bg-muted rounded-lg space-y-2">
          <p className="text-xs font-medium">How this works:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Client-side reads use your connected wallet's RPC</li>
            <li>• API routes use server-configured RPC (Alchemy/QuickNode)</li>
            <li>• Writes always require wallet signature</li>
            <li>• Deploy your own contract to test this fully</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}