# Onchain Base Project

A modern Web3 application skeleton built on Base network with Privy authentication, shadcn/ui components, and smart contract interaction capabilities.

## Features

- **Privy Authentication**: Support for email, social logins (Google, Discord, Twitter), SMS, and direct wallet connections
- **Multi-Wallet Support**: MetaMask, Coinbase Wallet, Rainbow, and embedded wallets
- **Base Network Integration**: Configured for Base mainnet and Base Sepolia testnet
- **Smart Contract Interactions**: Read and write to contracts with example implementations
- **API Routes**: Server-side contract interactions using Next.js API routes
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── contract/
│   │       ├── read/         # API route for reading contracts
│   │       └── write/        # API route for writing to contracts
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Main application page
│   └── globals.css          # Global styles and Tailwind
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── WalletConnect.tsx    # Privy authentication component
│   ├── TransactionButton.tsx # Send ETH transactions
│   └── ContractInteraction.tsx # Smart contract example
├── config/
│   └── privy.ts             # Privy configuration
├── lib/
│   ├── utils.ts             # Utility functions
│   └── contracts.ts         # Contract ABIs and helpers
└── providers/
    └── PrivyProvider.tsx    # Web3 and auth provider
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Privy Configuration (Required)
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here

# RPC URLs (Required - Choose one provider)
# Option 1: Alchemy (recommended)
NEXT_PUBLIC_BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# Option 2: QuickNode
NEXT_PUBLIC_BASE_RPC_URL=https://your-quicknode-endpoint.quiknode.pro/YOUR_KEY/
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://your-sepolia-endpoint.quiknode.pro/YOUR_KEY/

# Optional: For server-side transactions only
PRIVATE_KEY=your_private_key_here
```

### 3. Get Your API Keys

#### Privy Setup
1. Go to [https://dashboard.privy.io](https://dashboard.privy.io)
2. Create a new app or select existing
3. Copy your App ID
4. Configure allowed domains (add `http://localhost:3000` for development)
5. Enable desired login methods (email, social, wallets)

#### RPC Provider Setup

**Alchemy (Recommended):**
1. Sign up at [https://www.alchemy.com](https://www.alchemy.com)
2. Create a new app for Base and Base Sepolia
3. Copy the API keys from your dashboard

**QuickNode:**
1. Sign up at [https://www.quicknode.com](https://www.quicknode.com)
2. Create endpoints for Base and Base Sepolia
3. Copy the endpoint URLs

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## How It Works

### Authentication Flow
1. User clicks "Connect Wallet or Login"
2. Privy modal opens with multiple options:
   - Email magic link
   - Social logins (Google, Discord, Twitter)
   - SMS verification
   - Direct wallet connection
3. Once authenticated, user can perform transactions

### Transaction Flow
1. User enters recipient address and amount
2. Clicks "Send Transaction"
3. Wallet prompts for confirmation
4. Transaction is broadcast to the network
5. UI shows transaction status and hash

### Smart Contract Interaction
The app includes examples for:
- **Reading contract data**: Using wagmi hooks or API routes
- **Writing to contracts**: Sending transactions that modify state
- **API Route integration**: Server-side contract calls using private keys

## Customization Guide

### Adding New Smart Contracts

1. Add your contract ABI to `src/lib/contracts.ts`:
```typescript
export const MY_CONTRACT_ABI = [
  // Your ABI here
] as const

export const MY_CONTRACT_ADDRESS = '0x...'
```

2. Create a new component or modify `ContractInteraction.tsx`

### Adding New Login Methods

Edit `src/config/privy.ts`:
```typescript
loginMethods: [
  'email',
  'wallet',
  'google',
  'discord',
  'twitter',
  'sms',
  'github',  // Add more providers
  'linkedin',
]
```

### Changing Networks

To add support for other networks, update `src/providers/PrivyProvider.tsx`:
```typescript
import { mainnet, polygon, optimism } from 'viem/chains'

const wagmiConfig = createConfig({
  chains: [mainnet, polygon, optimism],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_MAINNET_RPC),
    // Add more networks
  },
})
```

## API Routes Documentation

### Read Contract
```typescript
POST /api/contract/read
{
  contractAddress: "0x...",
  abi: [...],
  functionName: "balanceOf",
  args: ["0xUserAddress"],
  chainId: 84532
}
```

### Write Contract (Server-side)
```typescript
POST /api/contract/write
{
  contractAddress: "0x...",
  abi: [...],
  functionName: "transfer",
  args: ["0xRecipient", "1000000000000000000"],
  chainId: 84532
}
```

## Security Considerations

- **Never expose private keys in client code**
- **Use environment variables for sensitive data**
- **Validate all user inputs**
- **Use server-side API routes for sensitive operations**
- **Implement proper error handling**
- **Add rate limiting to API routes in production**

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The app works with any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted

## Resources

- [Privy Documentation](https://docs.privy.io)
- [Base Documentation](https://docs.base.org)
- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT