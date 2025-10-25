# ColorSnap Base Mainnet Deployment Guide

This guide explains how to deploy the ColorSnap smart contract to Base mainnet.

## Prerequisites

1. **Foundry installed** - [Install Foundry](https://book.getfoundry.sh/getting-started/installation)
2. **Private key** - Your wallet's private key for deployment
3. **RPC URL** - Base mainnet RPC endpoint
4. **Etherscan API key** - For contract verification on BaseScan
5. **ETH for gas fees** - You'll need ETH on Base mainnet for deployment

## Environment Variables

Create a `.env` file in the `smart-contracts` directory:

```bash
# Required for deployment
PRIVATE_KEY=your_private_key_here
RPC_URL=https://mainnet.base.org
CHAIN_ID=8453

# Required for verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### Getting RPC URLs

**Base Mainnet RPC URLs:**
- **Public RPC**: `https://mainnet.base.org`
- **Alchemy**: `https://base-mainnet.g.alchemy.com/v2/YOUR_API_KEY`
- **Infura**: `https://base-mainnet.infura.io/v3/YOUR_PROJECT_ID`
- **QuickNode**: `https://YOUR_ENDPOINT.base-mainnet.quiknode.pro/YOUR_TOKEN/`

### Getting Etherscan API Key

1. Go to [Etherscan](https://etherscan.io/)
2. Create an account and log in
3. Go to your profile and get your API key
4. Add it to your `.env` file

**Note**: Base uses the same Etherscan API key as Ethereum mainnet.

## Deployment Commands

### 1. Build the contract
```bash
forge build
```

### 2. Deploy only (without verification)
```bash
forge script script/DeployBase.s.sol --rpc-url $RPC_URL --broadcast
```

### 3. Deploy and verify (two-step process - RECOMMENDED)
```bash
# Step 1: Deploy
forge script script/DeployBase.s.sol --rpc-url $RPC_URL --broadcast

# Step 2: Verify (after deployment)
forge verify-contract CONTRACT_ADDRESS src/Colorsnap.sol:ColorSnap --chain base --constructor-args OWNER_ADDRESS --etherscan-api-key $ETHERSCAN_API_KEY
```

### 4. Deploy with automatic verification
```bash
forge script script/DeployBase.s.sol --rpc-url $RPC_URL --broadcast --verify --fork-url $RPC_URL
```

## Example Deployment

```bash
# Set environment variables
export PRIVATE_KEY="0x1234567890abcdef..."
export RPC_URL="https://mainnet.base.org"
export CHAIN_ID="8453"
export ETHERSCAN_API_KEY="YourEtherscanAPIKey"

# Option 1: Deploy only
forge script script/DeployBase.s.sol --rpc-url $RPC_URL --broadcast

# Option 2: Deploy with automatic verification
forge script script/DeployBase.s.sol --rpc-url $RPC_URL --broadcast --verify --fork-url $RPC_URL
```

## Gas Optimization

Base mainnet has lower gas costs than Ethereum mainnet, but you should still:

1. **Estimate gas costs** before deployment:
   ```bash
   forge script script/DeployBase.s.sol --rpc-url $RPC_URL --dry-run
   ```

2. **Monitor gas prices** using [Base Gas Tracker](https://basescan.org/gastracker)

3. **Set appropriate gas limit** if needed:
   ```bash
   forge script script/DeployBase.s.sol --rpc-url $RPC_URL --broadcast --gas-limit 2000000
   ```

## Troubleshooting

### Common Issues

1. **"Insufficient funds"** - Make sure your wallet has ETH on Base mainnet for gas
2. **"Invalid RPC URL"** - Check your RPC URL is correct and accessible
3. **"Verification failed"** - Check your Etherscan API key is valid
4. **"Chain ID not supported"** - Make sure you're using chain ID 8453 for Base mainnet
5. **"--fork-url required"** - Use `--fork-url $RPC_URL` when using `--verify`

### Getting ETH on Base Mainnet

1. **Bridge from Ethereum**: Use [Base Bridge](https://bridge.base.org/)
2. **Buy directly**: Use exchanges that support Base mainnet
3. **Use faucets**: Some testnet faucets may provide small amounts

## Contract Address

After successful deployment, save your contract address. You'll need it to:
- Update frontend configuration
- Interact with the contract
- Share with users

## Base Mainnet Specifics

### Network Details
- **Chain ID**: 8453
- **Currency**: ETH
- **Block Explorer**: [BaseScan](https://basescan.org)
- **Gas Token**: ETH (same as Ethereum)

### Advantages of Base
- **Lower gas costs** compared to Ethereum mainnet
- **Faster transaction times**
- **Ethereum compatibility**
- **Growing ecosystem**

## Security Considerations

1. **Private Key Security**: Never commit your private key to version control
2. **Test First**: Deploy to Base Sepolia testnet first
3. **Verify Contract**: Always verify your contract on BaseScan
4. **Monitor Deployment**: Check the transaction on BaseScan

## Next Steps

1. **Update Frontend**: Add the deployed contract address to your frontend configuration
2. **Test the Game**: Play a few rounds to ensure everything works
3. **Monitor**: Check BaseScan for contract interactions
4. **Share**: Update your documentation with the new contract address

## Support

- **Base Documentation**: [docs.base.org](https://docs.base.org)
- **Base Discord**: [discord.gg/buildonbase](https://discord.gg/buildonbase)
- **BaseScan Support**: [basescan.org/support](https://basescan.org/support)
