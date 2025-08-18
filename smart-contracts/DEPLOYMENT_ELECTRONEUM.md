# ColorSnap Deployment Guide for Electroneum Testnet

This guide explains how to deploy the ColorSnap smart contract to Electroneum testnet.

## Prerequisites

1. **Foundry installed** - [Install Foundry](https://book.getfoundry.sh/getting-started/installation)
2. **Private key** - Your wallet's private key for deployment
3. **Electroneum Testnet RPC** - Electroneum testnet RPC endpoint
4. **Electroneum Explorer API key** (optional) - For contract verification

## Environment Setup

Create or update your `.env` file in the `smart-contracts` directory with Electroneum-specific variables:

```bash
# Required for deployment
PRIVATE_KEY=your_private_key_here
ETN_RPC_URL=https://testnet.electroneum.com  # Replace with actual Electroneum testnet RPC
ETN_CHAIN_ID=52014 # Replace with actual Electroneum testnet chain ID

# Optional - for contract verification if supported
ETN_EXPLORER_API_KEY=leave empty
```

## Deployment Steps

1. **Install Dependencies**
```bash
forge install
```

2. **Build the Contract**
```bash
forge build
```

3. **Deploy to Electroneum Testnet**
```bash
forge script script/ColorSnapElectroneum.s.sol --rpc-url $ETN_RPC_URL --broadcast
```

4. **Verify Contract**
Make sure to have set the `ETN_EXPLORER_API_KEY` as empty, the script will attempt verification automatically. If verification fails or is not supported, you'll need to verify manually through the Electroneum explorer interface.

## Testing the Deployment

After deployment:

1. Copy the deployed contract address from the deployment output
2. Update your frontend `.env` file with:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_ETN_RPC_URL=your_electroneum_testnet_rpc
```

## Playing the Game

1. Connect your wallet to Electroneum testnet
2. Register a player name
3. Start playing by matching the colors in the bottles
4. Track your progress on the leaderboard

## Contract Interaction

You can interact with the deployed contract using the following methods:

- `setPlayerName(string memory name)`: Register or update your player name
- `startGame()`: Start a new game
- `moveColor(uint256 gameId, uint8 fromBottle, uint8 toBottle)`: Make a move
- `getPlayerStats(address player)`: View player statistics

## Troubleshooting

1. **RPC Issues**
   - Ensure you're using the correct Electroneum testnet RPC URL
   - Check your network connection

2. **Transaction Failures**
   - Make sure you have enough ETN testnet tokens for gas
   - Verify the network settings in your wallet

3. **Contract Verification Issues**
   - If automatic verification fails, use the manual verification command provided in the deployment output
   - Double-check your explorer API key if provided

## Support

For issues or questions:
1. Check the Electroneum documentation for network-specific details
2. Review the contract code for game mechanics
3. Check gas prices and network status on Electroneum testnet
