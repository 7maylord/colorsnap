import { useEffect, useRef } from 'react';
import { useReadContract } from 'wagmi';
import colorSnapAbi from '../abi/color_snap.json';

export function useGameCompletedListener({
  contractAddress,
  playerAddress,
  gameId,
  onCompleted,
  pollInterval = 3000,
}: {
  contractAddress: string;
  playerAddress: string | undefined;
  gameId: string | null;
  onCompleted: (event: any) => void;
  pollInterval?: number;
}) {
  const lastCompletedGameId = useRef<string | null>(null);

  // Poll for game state changes
  const { data: gameState, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: colorSnapAbi,
    functionName: 'getGameState',
    args: gameId ? [BigInt(gameId)] : undefined,
    query: {
      enabled: !!gameId,
      refetchInterval: pollInterval,
    },
  });

  useEffect(() => {
    if (!gameState || !gameId) return;
    
    // Type assertion for gameState as array
    const gameStateArray = gameState as [string, number[], number[], number, boolean];
    const isActive = gameStateArray[4]; // isActive field
    if (!isActive && gameId && lastCompletedGameId.current !== gameId) {
      lastCompletedGameId.current = gameId;
      onCompleted(gameState);
    }
  }, [gameState, gameId, onCompleted]);

  return { refetch };
} 