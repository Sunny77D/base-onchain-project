import { WalletConnect } from '@/components/WalletConnect'
import { TransactionButton } from '@/components/TransactionButton'
import { ContractInteraction } from '@/components/ContractInteraction'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Onchain Base Project
          </h1>
          <p className="text-muted-foreground">
            A modern Web3 application built on Base with Privy authentication
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column - Authentication */}
          <div className="space-y-6">
            <WalletConnect />
            <TransactionButton />
          </div>

          {/* Right Column - Contract Interaction */}
          <div className="space-y-6">
            <ContractInteraction />
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-muted-foreground space-y-2 pt-8 border-t">
          <p>
            Built with Next.js, shadcn/ui, Privy, and Wagmi
          </p>
          <p>
            Configure your RPC endpoints in <code className="text-xs bg-muted px-1 py-0.5 rounded">/.env.local</code>
          </p>
        </div>
      </div>
    </main>
  )
}