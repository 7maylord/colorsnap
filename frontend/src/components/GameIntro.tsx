"use client";

import { useAccount, useReadContract } from "wagmi";
import WalletConnectButton from "./WalletConnectButton";
import Link from "next/link";
import { useEffect, useState } from "react";
import colorSnapAbi from "../abi/color_snap.json";

export default function GameIntro() {
  const { address, isConnected } = useAccount();
  const walletConnected = !!isConnected && !!address;
  const [playerName, setPlayerName] = useState<string>("");
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;

  // Fetch player name using Wagmi
  const { data: playerNameData, error: playerNameError } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: colorSnapAbi,
    functionName: 'getPlayerName',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress && isConnected,
    },
  });

  useEffect(() => {
    if (playerNameData) {
      setPlayerName(playerNameData as string);
      localStorage.setItem("colorsnap_player_name", playerNameData as string);
    } else if (address) {
      // Fallback to localStorage if contract call fails
      const storedName = localStorage.getItem("colorsnap_player_name");
      if (storedName) {
        setPlayerName(storedName);
      }
    }
  }, [playerNameData, playerNameError, address, contractAddress]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
      {/* Game Logo/Title */}
      <div className="mb-4 animate-fade-in w-full">
        <div className="flex flex-wrap items-center justify-center mb-6 w-full">
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent tracking-tight break-words text-center flex-1 min-w-[120px]">COLOR</h1>
          <div className="w-4 h-1 sm:w-8 sm:h-1 md:w-16 md:h-1 lg:w-32 lg:h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse transform rotate-[52deg] transition-all duration-300"></div>
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-blue-400 via-teal-500 to-green-500 bg-clip-text text-transparent tracking-tight break-words text-center flex-1 min-w-[120px]">SNAP</h1>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-6 animate-slide-up-delayed">
        {!walletConnected ? (
          <div className="space-y-4 flex flex-col items-center">
            <p className="flex justify-center text-gray-400 text-lg">Connect your Ethereum wallet to begin</p>
            <WalletConnectButton />
          </div>
        ) : (
          <div className="space-y-4 mb-4 mt-4flex flex-col items-center">
            {playerName && (
              <div className="text-lg text-white text-center font-semibold">Welcome, {playerName}!</div>
            )}
            <Link href="/game">
              <button
                className="
                  relative px-12 mb-4 py-4 text-2xl font-bold rounded-xl 
                  bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 
                  hover:from-purple-500 hover:via-pink-500 hover:to-red-500
                  text-white shadow-2xl border-2 border-white/20
                  transform transition-all duration-300 
                  scale-100 hover:scale-105 hover:shadow-purple-500/50
                "
              >
                <span className="relative z-10">GO TO GAME</span>
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Game Description */}
      <div className="mb-12 animate-slide-up text-center flex flex-col items-center">
        <p className="text-xl md:text-2xl text-gray-300 mb-6 leading-relaxed text-center">
          Master the art of <span className="text-purple-400 font-bold">color matching</span> in this mind-bending puzzle game
        </p>
        <p className="text-lg text-gray-400 mb-8 text-center">
          Built on Somnia • Play to Earn • Compete Globally
        </p>
        {/* Game Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-3xl mx-auto justify-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              🎯
            </div>
            <h3 className="text-white font-semibold mb-2">Pattern Matching</h3>
            <p className="text-gray-400 text-sm">Match bottle sequences to advance through challenging levels</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              🏆
            </div>
            <h3 className="text-white font-semibold mb-2">Global Rankings</h3>
            <p className="text-gray-400 text-sm">Compete with players worldwide on the leaderboard</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-green-500/50 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              💎
            </div>
            <h3 className="text-white font-semibold mb-2">On-Chain Rewards</h3>
            <p className="text-gray-400 text-sm">Earn points and achievements stored on Ethereum</p>
          </div>
        </div>
      </div>

      {/* How to Play */}
      <div className="w-full max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">How to Play</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-3">1. Connect Wallet</h4>
            <p className="text-gray-300">Connect your Ethereum wallet to start playing</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-3">2. Set Your Name</h4>
            <p className="text-gray-300">Register your player name on the blockchain</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-3">3. Start Game</h4>
            <p className="text-gray-300">Begin a new game and get your bottle configuration</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-3">4. Match Colors</h4>
            <p className="text-gray-300">Swap bottles to match the target configuration</p>
          </div>
        </div>
      </div>
    </div>
  );
} 