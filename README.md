# ColorSnap Game

The ColorSnap Game is a decentralized, on-chain game built on Somnia, where players match colored bottles to a target configuration to earn points. Players connect their EVM compatible wallet, set a display name, start a game, swap bottles to match the target, and submit their solution to compete on a global leaderboard.

## Technology Stack

- **Smart Contracts**: Solidity with Foundry
- **Frontend**: Next.js 15 with TypeScript
- **Web3**: Wagmi + Reown AppKit
- **Styling**: Tailwind CSS
- **Network**: Somnia Testnet

## Features

- **Wallet Connection**: Connect any EVM-compatible wallet
- **Player Registration**: Set your name on-chain
- **Color Matching Game**: Match bottle configurations to earn points
- **Global Leaderboard**: Compete with players worldwide
- **Real-time Updates**: Live game state monitoring
- **Responsive Design**: Works on all devices

## Quick Start

1. **Deploy Smart Contract**:
   ```bash
   cd smart-contracts
   forge script script/Colorsnap.s.sol --rpc-url $RPC_URL --broadcast
   ```

2. **Setup Frontend**:
   ```bash
   cd frontend
   # Add contract address to .env.local
   yarn install
   yarn run dev
   ```

3. **Get Testnet ETH**: Visit [Somnia Faucet](https://docs.somnia.network/get-started/request-stt-tokens-and-try-sending-tokens-to-a-random-address)

## Project Structure

```
colorsnap/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── app/           # Next.js app router
│   │   └── abi/           # Contract ABI
│   └── README.md          # Frontend setup guide
├── smart-contracts/   # Solidity contracts
│   ├── src/              # Contract source
│   ├── script/           # Deployment scripts
│   └── README.md     # Smart Contract setup guide
└── README.md          # This file
```

## Game Instructions

1. **Connect Wallet**: Use any EVM-compatible wallet
2. **Set Player Name**: Register your name on the blockchain
3. **Start Game**: Begin a new color matching round
4. **Match Bottles**: Swap bottles to match the target configuration
5. **Submit Solution**: Complete the puzzle to earn points
6. **Compete**: Check the leaderboard to see your ranking

## Development

- **Contract Development**: Use Foundry for testing and deployment
- **Frontend Development**: Next.js with TypeScript and Tailwind
- **Web3 Integration**: Wagmi hooks for Ethereum interactions
- **State Management**: React hooks for local state

## Deployment

- **Smart Contract**: Deploy to Somnia using Foundry
- **Frontend**: Deploy to Vercel, Netlify, or any static hosting
- **Environment**: Set contract address and RPC URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

