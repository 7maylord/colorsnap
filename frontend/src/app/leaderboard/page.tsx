"use client";

import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { somniaTestnet, base } from "viem/chains";
import BottlesBackground from "../../components/BottlesBackground";
import { Trophy, Sparkles } from "lucide-react";
import colorSnapAbi from "../../abi/color_snap.json";
import { CONTRACT_ADDRESSES } from "../../config";
import { electroneum } from "../../config/chains";

// Helper to format contract address as 0x-prefixed hex string
function formatAddress(addr: string | bigint) {
  const hex = typeof addr === 'bigint'
    ? '0x' + addr.toString(16)
    : typeof addr === 'string' && !addr.startsWith('0x')
      ? '0x' + BigInt(addr).toString(16)
      : String(addr);
  return `${hex.slice(0, 8)}...${hex.slice(-6)}`;
}

// Helper to get medal emoji
function getMedal(index: number) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return null;
}

// Helper to get avatar color
function getAvatarColor(name: string) {
  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-400", "bg-purple-500"];
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return colors[sum % colors.length];
}

interface PlayerData {
  playerAddress: string;
  name: string;
  points: number;
  moves: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<PlayerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get all network configurations for aggregated leaderboard
  const getAllNetworkConfigs = () => {
    const configs = [];
    
    // Base Mainnet - always include with fallback
    configs.push({
      name: 'Base Mainnet',
      contractAddress: CONTRACT_ADDRESSES.BASE || "0x62dcaAdAd6D5E6CA4B594CEB636A147537aE7F8f",
      chain: base,
      rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'
    });
    
    // Somnia Testnet - only if configured
    if (CONTRACT_ADDRESSES.SOMNIA) {
      configs.push({
        name: 'Somnia Testnet',
        contractAddress: CONTRACT_ADDRESSES.SOMNIA,
        chain: somniaTestnet,
        rpcUrl: process.env.NEXT_PUBLIC_SOMNIA_RPC_URL || 'https://dream-rpc.somnia.network'
      });
    }
    
    // Electroneum Testnet - only if configured
    if (CONTRACT_ADDRESSES.ELECTRONEUM && process.env.NEXT_PUBLIC_ETN_RPC_URL) {
      configs.push({
        name: 'Electroneum Testnet',
        contractAddress: CONTRACT_ADDRESSES.ELECTRONEUM,
        chain: electroneum,
        rpcUrl: process.env.NEXT_PUBLIC_ETN_RPC_URL
      });
    }
    
    return configs;
  };
  
  const networkConfigs = getAllNetworkConfigs();

  // Fetch aggregated leaderboard data from all networks
  useEffect(() => {
    const fetchAggregatedLeaderboard = async () => {
      if (networkConfigs.length === 0) {
        setError('No network configurations available');
        setIsLoading(false);
        return;
      }

      try {
        const allPlayers = new Map<string, PlayerData>();
        
        // Fetch data from each network with timeout
        const fetchPromises = networkConfigs.map(async (config) => {
          try {
            const publicClient = createPublicClient({
              chain: config.chain,
              transport: http(config.rpcUrl, {
                timeout: 10000, // 10 second timeout
              }),
            });

            const data = await publicClient.readContract({
              address: config.contractAddress as `0x${string}`,
              abi: colorSnapAbi,
              functionName: 'getAllPlayerPoints',
            });

            return {
              config,
              data: data as Array<{
                playerAddress: string;
                name: string;
                points: bigint;
                moves: bigint;
              }>
            };
          } catch (networkError) {
            console.warn(`Failed to fetch from ${config.name}:`, networkError);
            return null;
          }
        });

        // Wait for all network requests with timeout
        const results = await Promise.allSettled(fetchPromises);
        
        // Process successful results
        results.forEach((result) => {
          if (result.status === 'fulfilled' && result.value) {
            const { data } = result.value;
            
            // Aggregate player data across networks
            data.forEach((player) => {
              const address = player.playerAddress.toLowerCase();
              const points = Number(player.points);
              const moves = Number(player.moves);
              const name = player.name || "";

              if (allPlayers.has(address)) {
                // Player exists, aggregate points and moves
                const existing = allPlayers.get(address)!;
                allPlayers.set(address, {
                  playerAddress: address,
                  name: existing.name || name, // Keep the first non-empty name
                  points: existing.points + points,
                  moves: existing.moves + moves,
                });
              } else {
                // New player
                allPlayers.set(address, {
                  playerAddress: address,
                  name: name,
                  points: points,
                  moves: moves,
                });
              }
            });
          }
        });

        // Convert map to array and sort
        const leaderboardData = Array.from(allPlayers.values());
        leaderboardData.sort((a, b) => b.points - a.points || a.moves - b.moves);
        
        // If no data from any network, show empty leaderboard
        if (leaderboardData.length === 0) {
          console.warn('No data received from any network');
          setLeaderboard([]);
          setError('No leaderboard data available. Please try again later.');
        } else {
          setLeaderboard(leaderboardData);
          setError(null);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load leaderboard';
        setError(errorMessage);
        console.error('Leaderboard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAggregatedLeaderboard();
  }, [networkConfigs]);

  // Find the top score for progress bars
  const topScore = leaderboard.length > 0 ? leaderboard[0].points : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      <BottlesBackground />
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 relative z-10">
        <div className="max-w-full sm:max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            {/* Row of tiny bottles */}
            <div className="flex gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={i} className={
                  ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-400", "bg-purple-500", "bg-pink-500", "bg-teal-400"][i % 7] +
                  " w-4 h-6 rounded-b-full border-2 border-white/30 shadow"
                } />
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-white/20 via-purple-200/20 to-blue-200/20 backdrop-blur-xl rounded-2xl p-2 sm:p-6 border border-white/30 shadow-xl ring-1 ring-purple-200/30">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 animate-pulse bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 animate-bounce" />
              Global Leaderboard
              <Sparkles className="w-5 h-5 text-pink-300 animate-spin-slow" />
            </h2>
            <p className="text-sm text-gray-300 mb-4 text-center">
              Combined scores across all supported networks
            </p>
            <div className="space-y-2 sm:space-y-3 overflow-x-auto">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
                  <p className="text-gray-300">Loading leaderboard...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-400 mb-2">Error loading leaderboard</p>
                  <p className="text-gray-300 text-sm">{error}</p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-300">No players found</p>
                  <p className="text-gray-400 text-sm">Be the first to play and earn points!</p>
                </div>
              ) : (
                <>
                  <div className="flex min-w-[340px] sm:min-w-0 items-center justify-between px-2 sm:px-3 pb-2 border-b border-white/20 text-xs sm:text-sm font-semibold">
                    <span className="w-6 sm:w-8 text-center">#</span>
                    <span className="w-10 sm:w-12 text-center mr-3 sm:mr-5">Avatar</span>
                    <span className="flex-1">Name</span>
                    <span className="w-20 sm:w-32 text-right">Points</span>
                    <span className="w-16 sm:w-24 text-right">Moves</span>
                  </div>
                  {leaderboard.map((player, index) => (
                    <div
                      key={String(player.playerAddress) + index}
                      className={
                        `flex min-w-[340px] sm:min-w-0 items-center justify-between p-2 sm:p-3 rounded-lg transition-all duration-200 group ` +
                        (index === 0 ? 'bg-gradient-to-r from-yellow-600 to-orange-600 shadow-lg' : 
                          index === 1 ? 'bg-gradient-to-r from-gray-500 to-gray-600 shadow' :
                          index === 2 ? 'bg-gradient-to-r from-amber-700 to-orange-700 shadow' :
                          'bg-gray-700 bg-opacity-10 hover:bg-gradient-to-r hover:from-purple-700/40 hover:to-blue-700/40') +
                        ' hover:scale-[1.025] hover:shadow-xl'
                      }
                    >
                      <span className="text-base sm:text-lg font-bold w-6 sm:w-8 text-center">
                        {getMedal(index) || index + 1}
                      </span>
                      {/* Avatar */}
                      <span className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 border-white/30 shadow ${getAvatarColor(player.name || player.playerAddress)} mr-3 sm:mr-5`}>
                        {player.name ? player.name[0].toUpperCase() : "?"}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold truncate max-w-[100px] sm:max-w-none">{player.name || 'Unnamed'}</p>
                        <p className="text-xs text-gray-300 truncate max-w-[100px] sm:max-w-none">{formatAddress(player.playerAddress)}</p>
                        {/* Progress bar */}
                        <div className="w-full h-2 bg-white/10 rounded-full mt-1">
                          <div
                            className={
                              `h-2 rounded-full transition-all duration-500 ` +
                              (index === 0 ? 'bg-yellow-400' :
                                index === 1 ? 'bg-gray-300' :
                                index === 2 ? 'bg-amber-700' :
                                'bg-gradient-to-r from-purple-400 via-blue-400 to-green-400')
                            }
                            style={{ width: `${Math.max(10, (player.points / topScore) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className="w-20 sm:w-32 text-right font-bold">{player.points}</span>
                      <span className="w-16 sm:w-24 text-right font-mono">{player.moves}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 