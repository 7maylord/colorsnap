# ColorSnap Deployment Guide

This guide explains how to deploy the ColorSnap smart contract to Lisk Sepolia testnet.

## Prerequisites

1. **Foundry installed** - [Install Foundry](https://book.getfoundry.sh/getting-started/installation)
2. **Private key** - Your wallet's private key for deployment
3. **RPC URL** - Lisk Sepolia RPC endpoint
4. **Etherscan API key** - For contract verification

## Environment Variables

Create a `.env` file in the `smart-contracts` directory:

```bash
# Required for deployment
PRIVATE_KEY=your_private_key_here
RPC_URL=https://rpc.sepolia-api.lisk.com
CHAIN_ID=4202

# Required for verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### Getting RPC URLs

**Lisk Sepolia RPC URLs:**
- **Public RPC**: `https://rpc.sepolia-api.lisk.com`
- **Alchemy**: `https://lisk-sepolia.g.alchemy.com/v2/YOUR_API_KEY`
- **Infura**: `https://lisk-sepolia.infura.io/v3/YOUR_PROJECT_ID`

### Getting Etherscan API Key

1. Go to [Etherscan](https://etherscan.io/)
2. Create an account and log in
3. Go to your profile and get your API key
4. Add it to your `.env` file

## Deployment Commands

### 1. Build the contract
```bash
forge build
```

### 2. Deploy only (without verification)
```bash
forge script script/Colorsnap.s.sol --rpc-url $RPC_URL --broadcast
```

### 3. Deploy and verify (two-step process - RECOMMENDED)
```bash
# Step 1: Deploy
forge script script/Colorsnap.s.sol --rpc-url $RPC_URL --broadcast

# Step 2: Verify (after deployment)
forge verify-contract CONTRACT_ADDRESS src/Colorsnap.sol:ColorSnap --chain 4202 --constructor-args OWNER_ADDRESS --etherscan-api-key $ETHERSCAN_API_KEY
```

### 4. Deploy with automatic verification
```bash
forge script script/Colorsnap.s.sol --rpc-url $RPC_URL --broadcast --verify --fork-url $RPC_URL
```

## Example Deployment

```bash
# Set environment variables
export PRIVATE_KEY="0x1234567890abcdef..."
export RPC_URL="https://rpc.sepolia-api.lisk.com"
export CHAIN_ID="4202"
export ETHERSCAN_API_KEY="YourEtherscanAPIKey"

# Option 1: Deploy only
forge script script/Colorsnap.s.sol --rpc-url $RPC_URL --broadcast

# Option 2: Deploy with automatic verification
forge script script/Colorsnap.s.sol --rpc-url $RPC_URL --broadcast --verify --fork-url $RPC_URL
```

## Expected Output

```
=== DEPLOYMENT CONFIGURATION ===
Owner address: 0x...
Chain ID: 4202
RPC URL: https://rpc.sepolia-api.lisk.com
================================
Deploying ColorSnap contract...
SUCCESS: ColorSnap deployed to: 0x...
Starting contract verification...
Chain ID: 4202
SUCCESS: Contract verified successfully!
View contract on: https://sepolia-blockscout.lisk.com/address/0x...
```

## Troubleshooting

### Common Issues

1. **"Insufficient funds"** - Make sure your wallet has LSK tokens for gas
2. **"Invalid RPC URL"** - Check your RPC URL is correct and accessible
3. **"Verification failed"** - Check your Etherscan API key is valid
4. **"Chain ID not supported"** - Make sure you're using chain ID 4202 for Lisk Sepolia
5. **"--fork-url required"** - Use `--fork-url $RPC_URL` when using `--verify`

### Getting LSK Testnet Tokens

1. Visit [Lisk Sepolia Faucet](https://faucet.sepolia.lisk.com/)
2. Connect your wallet
3. Request testnet LSK tokens

## Contract Address

After successful deployment, save your contract address. You'll need it to:
- Update frontend configuration
- Interact with the contract
- Share with users

## Next Steps

1. **Update Frontend**: Add the deployed contract address to your frontend configuration
2. **Test the Game**: Play a few rounds to ensure everything works
3. **Monitor**: Check the block explorer for contract interactions 