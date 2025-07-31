# ColorSnap Deployment Guide

This guide explains how to deploy the ColorSnap smart contract to Somnia Testnet testnet.

## Prerequisites

1. **Foundry installed** - [Install Foundry](https://book.getfoundry.sh/getting-started/installation)
2. **Private key** - Your wallet's private key for deployment
3. **RPC URL** - Somnia Testnet RPC endpoint
4. **Etherscan API key** - For contract verification

## Environment Variables

Create a `.env` file in the `smart-contracts` directory:

```bash
# Required for deployment
PRIVATE_KEY=your_private_key_here
RPC_URL=https://dream-rpc.somnia.network
CHAIN_ID=50312

# Required for verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### Getting RPC URLs

**Somnia Testnet RPC URLs:**
- **Public RPC**: `https://dream-rpc.somnia.network`
- or use your ANKR RPC url 

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
forge verify-contract CONTRACT_ADDRESS src/Colorsnap.sol:ColorSnap --chain 84532 --constructor-args OWNER_ADDRESS --etherscan-api-key $ETHERSCAN_API_KEY
```

### 4. Deploy with automatic verification
```bash
forge script script/Colorsnap.s.sol --rpc-url $RPC_URL --broadcast --verify --fork-url $RPC_URL
```

## Example Deployment

```bash
# Set environment variables
export PRIVATE_KEY="0x1234567890abcdef..."
export RPC_URL="https://dream-rpc.somnia.network"
export CHAIN_ID="50312"
export ETHERSCAN_API_KEY="YourEtherscanAPIKey"

# Option 1: Deploy only
forge script script/Colorsnap.s.sol --rpc-url $RPC_URL --broadcast

# Option 2: Deploy with automatic verification
forge script script/Colorsnap.s.sol --rpc-url $RPC_URL --broadcast --verify --fork-url $RPC_URL
```

## Troubleshooting

### Common Issues

1. **"Insufficient funds"** - Make sure your wallet has STT tokens for gas
2. **"Invalid RPC URL"** - Check your RPC URL is correct and accessible
3. **"Verification failed"** - Check your Etherscan API key is valid
4. **"Chain ID not supported"** - Make sure you're using chain ID 50312 for Somnia Testnet
5. **"--fork-url required"** - Use `--fork-url $RPC_URL` when using `--verify`

### Getting Somnia Testnet Testnet Tokens

1. Visit [Somnia Testnet Faucet](https://docs.somnia.network/get-started/request-stt-tokens-and-try-sending-tokens-to-a-random-address)
2. Request testnet ETH tokens

## Contract Address

After successful deployment, save your contract address. You'll need it to:
- Update frontend configuration
- Interact with the contract
- Share with users

## Next Steps

1. **Update Frontend**: Add the deployed contract address to your frontend configuration
2. **Test the Game**: Play a few rounds to ensure everything works
3. **Monitor**: Check the block explorer for contract interactions 