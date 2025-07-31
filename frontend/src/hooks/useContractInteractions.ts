import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState } from 'react';
import colorSnapAbi from '../abi/color_snap.json';

export function useContractInteractions(contractAddress: string) {
  const [txHash, setTxHash] = useState<string | null>(null);
  
  const { writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess, isError } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  const setPlayerName = (name: string) => {
    try {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: colorSnapAbi,
        functionName: 'setPlayerName',
        args: [name],
      });
    } catch (err) {
      console.error('Error setting player name:', err);
      throw err;
    }
  };

  const startGame = async () => {
    try {
      const result = await writeContract({
        address: contractAddress as `0x${string}`,
        abi: colorSnapAbi,
        functionName: 'startGame',
        args: [],
      });
      if (typeof result === 'string') {
        setTxHash(result);
        return result;
      }
      return null;
    } catch (err) {
      console.error('Error starting game:', err);
      throw err;
    }
  };

  const submitResult = (gameId: string, finalBottles: number[], moves: number) => {
    try {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: colorSnapAbi,
        functionName: 'submitResult',
        args: [BigInt(gameId), finalBottles, moves],
      });
    } catch (err) {
      console.error('Error submitting result:', err);
      throw err;
    }
  };

  const endGame = (gameId: string) => {
    try {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: colorSnapAbi,
        functionName: 'endGame',
        args: [BigInt(gameId)],
      });
    } catch (err) {
      console.error('Error ending game:', err);
      throw err;
    }
  };

  return {
    setPlayerName,
    startGame,
    submitResult,
    endGame,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
    txHash,
    contractAbi: colorSnapAbi,
  };
} 