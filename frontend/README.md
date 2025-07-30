# ColorSnap Frontend

This is the frontend for the ColorSnap game, built with Next.js, Wagmi, and Reown AppKit for Ethereum integration.

## Features

- **Wallet Connection**: Connect with any EVM-compatible wallet
- **Player Registration**: Set your player name on-chain
- **Game Play**: Match colored bottles to earn points
- **Real-time Updates**: Live game state and transaction monitoring
- **Responsive Design**: Works on all screen sizes

## Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
# Reown Cloud Project ID (get from https://cloud.reown.com)
NEXT_PUBLIC_PROJECT_ID=your_project_id_here

# Contract Address (deploy the contract first and add the address here)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# RPC URL for Base Sepolia (optional, will use default if not set)
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
```

### 3. Deploy the Smart Contract

First, deploy the smart contract to Base Sepolia:

```bash
cd ../smart-contracts
forge script script/Colorsnap.s.sol --rpc-url https://sepolia.base.org --broadcast
```

Copy the deployed contract address and add it to your `.env.local` file.

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Game Instructions

1. **Connect Wallet**: Click "Connect Wallet" to connect your EVM wallet
2. **Set Player Name**: Enter your player name and submit it to the blockchain
3. **Start Game**: Click "Start New Game" to begin a new round
4. **Match Bottles**: Click bottles to swap them and match the target configuration
5. **Submit Solution**: When your bottles match the target, click "Submit Solution"
6. **Earn Points**: Successfully completing games earns you points

## Technology Stack

- **Next.js 15**: React framework with App Router
- **Wagmi**: Ethereum hooks for React
- **Reown AppKit**: Wallet connection and Web3 features
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety
- **Base Sepolia**: L2 testnet for fast, cheap transactions

## Network Support

Currently configured for **Base Sepolia** testnet:
- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org

## Getting Testnet Tokens

Visit the [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet) to get testnet ETH for gas fees.

## Troubleshooting

### Common Issues

1. **"Contract not found"**: Make sure the contract address is correct and the contract is deployed
2. **"Insufficient funds"**: Get testnet ETH from the faucet
3. **"Transaction failed"**: Check your wallet has enough ETH for gas fees
4. **"Wallet not connected"**: Make sure your wallet is connected to Base Sepolia

### Development

- The app uses React hooks for state management
- Contract interactions are handled through Wagmi hooks
- Real-time updates via polling and event listening
- Responsive design with Tailwind CSS

## Building for Production

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
