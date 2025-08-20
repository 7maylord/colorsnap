# ColorSnap Game

The ColorSnap Game is a decentralized multi-chain game, where players match colored bottles to a target configuration to earn points. Players connect their EVM compatible wallet, set a display name, start a game, swap bottles to match the target, and submit their solution to compete on a global leaderboard.

## Technology Stack

- **Smart Contracts**: Solidity with Foundry
- **Frontend**: Next.js 15 with TypeScript
- **Web3**: Wagmi + Reown AppKit
- **Styling**: Tailwind CSS
- **Network**: Somnia Testnet

## Deployed Contract

The ColorSnap smart contract is deployed at:

**Network**: Somnia Testnet
- **Contract Address**: `0xc2dc20E9F389114578F78a7f3C3B071db0b8e8dC`
- **Explorer**: [Somnia Explorer](https://shannon-explorer.somnia.network/address/0xc2dc20E9F389114578F78a7f3C3B071db0b8e8dC?tab=index)
- **Chain ID**: 50312

**Network**: Electroneum Testnet
- **Contract Address**: `0xEF7902FeE12ea3D3245eD721767FB048Afa38a2f`
- **Explorer**: [Electroneum Testnet Explorer](https://testnet-explorer.electroneum.com/address/0xEF7902FeE12ea3D3245eD721767FB048Afa38a2f)
- **Chain ID**: 5201420

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

## 🎮 How to Play ColorSnap

### **Getting Started**

1. **Connect Your Wallet** 🦊
   - Use any EVM-compatible wallet (MetaMask, WalletConnect, etc.)
   - Make sure you're connected to Somnia Testnet
   - Ensure you have some testnet ETH for transactions

2. **Register Your Champion Name** 🏆
   - Enter your display name (max 31 characters)
   - Click "🏆 Register Champion" to save it on-chain
   - This name will appear on the global leaderboard

3. **Start Your Challenge** 🚀
   - Click "🎮 Start New Challenge" to begin a new game
   - You'll receive 5 colored bottles in random positions
   - A hidden target configuration is generated for you to match

### **Gameplay Mechanics**

#### **🎯 The Objective**
Match your bottle arrangement to the target configuration exactly. Each bottle must be in the correct position and have the correct color.

#### **🧪 Available Colors**
- 🔴 **Red** - The fiery starter
- 🔵 **Blue** - The cool challenger  
- 🟢 **Green** - The nature warrior
- 🟡 **Yellow** - The bright contender
- 🟣 **Purple** - The royal challenger

#### **🔄 How to Swap Bottles**
1. **Select First Bottle**: Click on the first bottle you want to move
2. **Select Second Bottle**: Click on the second bottle to swap positions
3. **Confirm Swap**: The bottles will automatically swap positions
4. **Track Your Moves**: Each swap counts as one move

#### **👁️ Peek at the Solution**
- **Locked Until 5 Moves**: You must make at least 5 swaps before you can peek
- **3-Second Peek**: When unlocked, you can view the target for 3 seconds
- **3-Minute Cooldown**: After peeking, you must wait 3 minutes before peeking again
- **Strategic Use**: Use peeks wisely to guide your strategy

### **🎯 Game Rules**

#### **Scoring System**
- **10 Points**: Earned for each successfully completed puzzle
- **Move Efficiency**: Fewer moves = better strategy (though not required)
- **Global Ranking**: Compete on the worldwide leaderboard

#### **Game States**
- **Active Game**: You have bottles to arrange and a target to match
- **Completed Game**: Successfully matched the target configuration
- **Forfeited Game**: Gave up without completing the puzzle

#### **Transaction Types**
- **Submit Solution**: When your bottles match the target exactly
- **Forfeit Challenge**: Give up and end the current game
- **Start New Game**: Begin a fresh challenge

### **🏆 Winning Strategies**

#### **Beginner Tips**
1. **Start with the Ends**: Look for bottles that are already in correct end positions
2. **Work from Outside In**: Match the outer bottles first, then work inward
3. **Count Colors**: Make sure you have the right number of each color
4. **Use Peek Strategically**: Don't peek too early - try to solve it yourself first

#### **Advanced Strategies**
1. **Pattern Recognition**: Look for patterns in the target arrangement
2. **Move Planning**: Plan your swaps in advance to minimize moves
3. **Color Grouping**: Group similar colors together when possible
4. **Efficiency Focus**: Try to solve with fewer moves for bragging rights

#### **Pro Tips**
- **Study the Target**: When you peek, memorize the pattern quickly
- **Work Backwards**: Sometimes it's easier to work from the target backwards
- **Use the Matched Counter**: The "✅ Matched" counter shows how many bottles are correct
- **Don't Rush**: Take your time to plan your moves

### **🎉 Game Completion**

#### **Successful Submission**
- **Exact Match Required**: All bottles must be in the correct positions
- **Points Awarded**: Receive 10 points for completion
- **Congrats Message**: See a celebration animation
- **Leaderboard Update**: Your score is updated immediately

#### **Forfeiting a Game**
- **No Points Lost**: Forfeiting doesn't affect your existing points
- **No Penalty**: You can start a new game immediately
- **No Congrats**: No celebration for forfeits

### **📊 Tracking Progress**

#### **Game Statistics**
- **🔄 Swaps**: Number of bottle swaps made
- **✅ Matched**: How many bottles are in correct positions
- **🎯 Target Pattern**: The configuration you need to match

#### **Transaction Status**
- **🚀 Submitting...**: Your solution is being verified on-chain
- **⏳ Forfeiting...**: Your forfeit is being processed
- **🎉 Solution Verified!**: Your submission was successful
- **❌ Transaction failed**: Something went wrong, try again

### **🏅 Leaderboard Competition**

#### **Global Rankings**
- **Points Based**: Ranked by total points earned
- **Real-time Updates**: See your position change instantly
- **Player Names**: Display your registered champion name
- **Persistent Scores**: Your points are stored on-chain forever

#### **Competitive Play**
- **Multiple Games**: Play as many games as you want
- **Point Accumulation**: Points add up across all your games
- **Skill Development**: Improve your strategy over time
- **Community**: Compete with players worldwide

### **🔧 Troubleshooting**

#### **Common Issues**
- **Transaction Pending**: Wait for the blockchain to process your transaction
- **Wrong Network**: Make sure you're on Somnia Testnet
- **Insufficient Gas**: Ensure you have enough testnet ETH
- **Wallet Connection**: Reconnect your wallet if needed

#### **Getting Help**
- **Check Network**: Verify you're connected to the right network
- **Refresh Page**: Try refreshing if the game seems stuck
- **Clear Cache**: Clear browser cache if needed
- **Try Again**: Most issues resolve with a simple retry

### **🎮 Ready to Play?**

1. **Connect your wallet** to Somnia Testnet
2. **Register your champion name** on-chain
3. **Start your first challenge** and begin matching bottles
4. **Use the peek feature** strategically after 5 moves
5. **Submit your solution** when bottles match the target
6. **Check the leaderboard** to see how you rank
7. **Keep playing** to improve your skills and climb the ranks!

**Good luck, champion! May your color matching skills lead you to victory! 🏆✨**

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

