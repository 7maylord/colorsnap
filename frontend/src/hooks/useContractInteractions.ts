import {
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import { useState } from "react";
import colorSnapAbi from "../abi/color_snap.json";

export function useContractInteractions(contractAddress: string) {
  const [txHash, setTxHash] = useState<string | null>(null);

  const publicClient = usePublicClient();
  const { writeContract, writeContractAsync, isPending, error } =
    useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    isError,
  } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  const FALLBACK_GAS = BigInt(3000000);

  const estimateGas = async (
    functionName: string,
    args: unknown[],
  ): Promise<bigint> => {
    if (!publicClient) return FALLBACK_GAS;
    try {
      const gas = await publicClient.estimateContractGas({
        address: contractAddress as `0x${string}`,
        abi: colorSnapAbi,
        functionName,
        args,
      } as Parameters<typeof publicClient.estimateContractGas>[0]);
      // Guard against RPC returning 0 instead of throwing on simulation failure
      if (!gas || gas === BigInt(0)) return FALLBACK_GAS;
      // Add 20% buffer to avoid out-of-gas failures
      return (gas * BigInt(120)) / BigInt(100);
    } catch (err) {
      console.warn(
        `Gas estimation failed for ${functionName}, using fallback:`,
        err,
      );
      return FALLBACK_GAS;
    }
  };

  const setPlayerName = async (name: string) => {
    try {
      const gas = await estimateGas("setPlayerName", [name]);
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: colorSnapAbi,
        functionName: "setPlayerName",
        args: [name],
        gas,
      });
    } catch (err) {
      console.error("Error setting player name:", err);
      throw err;
    }
  };

  const startGame = async () => {
    try {
      const gas = await estimateGas("startGame", []);
      const result = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: colorSnapAbi,
        functionName: "startGame",
        args: [],
        gas,
      });
      if (typeof result === "string") {
        setTxHash(result);
        return result;
      }
      return null;
    } catch (err) {
      console.error("Error starting game:", err);
      throw err;
    }
  };

  const submitResult = async (
    gameId: string,
    finalBottles: number[],
    moves: number,
  ) => {
    try {
      const bottles = finalBottles as [number, number, number, number, number];
      const gas = await estimateGas("submitResult", [
        BigInt(gameId),
        bottles,
        moves,
      ]);
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: colorSnapAbi,
        functionName: "submitResult",
        args: [BigInt(gameId), bottles, moves],
        gas,
      });
    } catch (err) {
      console.error("Error submitting result:", err);
      throw err;
    }
  };

  const endGame = async (gameId: string) => {
    try {
      const gas = await estimateGas("endGame", [BigInt(gameId)]);
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: colorSnapAbi,
        functionName: "endGame",
        args: [BigInt(gameId)],
        gas,
      });
    } catch (err) {
      console.error("Error ending game:", err);
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
