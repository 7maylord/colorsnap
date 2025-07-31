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
  const { data: gameState } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: colorSnapAbi,
    functionName: 'getGameState',
    args: gameId ? [BigInt(gameId)] : undefined,
    query: {
      enabled: !!gameId && !!playerAddress,
      refetchInterval: pollInterval,
    },
  });

  useEffect(() => {
    if (!gameState || !gameId || !playerAddress) return;
    
    // Type assertion for gameState as array
    const gameStateArray = gameState as [string, number[], number[], number, boolean];
    const [player, gameBottles, gameTarget, moves, isActive] = gameStateArray;
    
    // Check if game is completed and belongs to the current player
    if (!isActive && 
        player.toLowerCase() === playerAddress.toLowerCase() && 
        gameId && 
        lastCompletedGameId.current !== gameId) {
      lastCompletedGameId.current = gameId;
      onCompleted(gameState);
    }
  }, [gameState, gameId, playerAddress, onCompleted]);

  // Reset when gameId changes
  useEffect(() => {
    if (gameId !== lastCompletedGameId.current) {
      lastCompletedGameId.current = null;
    }
  }, [gameId]);
}