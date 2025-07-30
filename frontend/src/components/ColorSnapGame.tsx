import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCw, Square, Eye, EyeOff } from 'lucide-react';
import BottlesBackground from './BottlesBackground';
import { useAccount, useReadContract } from "wagmi";
import { useRouter } from "next/navigation";
import { useGameCompletedListener } from '../hooks/useGameCompletedListener';
import { useTargetRevealLockout } from "../hooks/useTargetRevealLockout";
import { useContractInteractions } from '../hooks/useContractInteractions';
import Bottle from "./Bottle";
import CongratsMessage from "./CongratsMessage";
import InstructionsModal from "./InstructionsModal";
import colorSnapAbi from "../abi/color_snap.json";

const colorMap = {
  Red: 'bg-red-500',
  Blue: 'bg-blue-500', 
  Green: 'bg-green-500',
  Yellow: 'bg-yellow-500',
  Purple: 'bg-purple-500'
};

type BottleColor = 'Red' | 'Blue' | 'Green' | 'Yellow' | 'Purple';

const ColorSnapGame = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
  const [playerName, setPlayerName] = useState('');
  const [tempName, setTempName] = useState('');
  const [points, setPoints] = useState(0);
  const {
    showTarget,
    handleShowTarget,
    targetRevealLocked,
    targetRevealCountdown,
    resetTargetRevealLockout,
  }: {
    showTarget: boolean;
    handleShowTarget: () => void;
    targetRevealLocked: boolean;
    targetRevealCountdown: number;
    resetTargetRevealLockout: () => void;
  } = useTargetRevealLockout();
  const [selectedBottle, setSelectedBottle] = useState<number | null>(null);
  const [onchainGameId, setOnchainGameId] = useState<string | null>(null);
  const [loadingGame, setLoadingGame] = useState<boolean>(false);
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [nameTxStatus, setNameTxStatus] = useState<null | 'pending' | 'success' | 'error'>(null);
  const [nameTxError, setNameTxError] = useState<string | null>(null);
  const [gameTxStatus, setGameTxStatus] = useState<null | 'pending' | 'success' | 'error'>(null);
  const [gameTxError, setGameTxError] = useState<string | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [bottles, setBottles] = useState<BottleColor[]>([]);
  const [target, setTarget] = useState<BottleColor[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Contract interactions hook
  const {
    setPlayerName: setPlayerNameOnChain,
    startGame: startGameOnChain,
    submitResult: submitResultOnChain,
    endGame: endGameOnChain,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
    txHash,
  } = useContractInteractions(contractAddress);

  // Helper function to parse Color enum from contract
  function parseColor(colorValue: number): BottleColor {
    switch (colorValue) {
      case 0: return 'Red';
      case 1: return 'Blue';
      case 2: return 'Green';
      case 3: return 'Yellow';
      case 4: return 'Purple';
      default: return 'Red';
    }
  }

  // Helper function to count bottles
  function countCorrectBottles(bottles: BottleColor[], target: BottleColor[]) {
    let correct = 0;
    for (let i = 0; i < bottles.length; i++) {
      if (bottles[i] === target[i]) correct++;
    }
    return correct;
  }

  // Helper function to check if bottles match the target
  function bottlesMatchTarget(bottles: BottleColor[], target: BottleColor[]) {
    if (bottles.length !== target.length) return false;
    for (let i = 0; i < bottles.length; i++) {
      if (bottles[i] !== target[i]) return false;
    }
    return true;
  }

  // Fetch player name and points
  const { data: playerNameData } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: colorSnapAbi,
    functionName: 'getPlayerName',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: playerPointsData } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: colorSnapAbi,
    functionName: 'getPlayerPoints',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Update local state when contract data changes
  useEffect(() => {
    if (playerNameData) {
      setPlayerName(playerNameData as string);
      localStorage.setItem("colorsnap_player_name", playerNameData as string);
    }
  }, [playerNameData]);

  useEffect(() => {
    if (playerPointsData !== undefined && playerPointsData !== null) {
      setPoints(Number(playerPointsData));
      localStorage.setItem("colorsnap_player_points", playerPointsData.toString());
    }
  }, [playerPointsData]);

  // Fetch onchain game state
  const { data: gameStateData } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: colorSnapAbi,
    functionName: 'getGameState',
    args: onchainGameId ? [BigInt(onchainGameId)] : undefined,
    query: {
      enabled: !!onchainGameId,
      refetchInterval: 3000,
    },
  });

  // Update game state when contract data changes
  useEffect(() => {
    if (gameStateData && onchainGameId) {
      const [player, gameBottles, gameTarget, moves, isActive] = gameStateData as [string, number[], number[], number, boolean];
      
      if (player === address) {
        setBottles(gameBottles.map(parseColor));
        setTarget(gameTarget.map(parseColor));
        setMoves(Number(moves));
        setGameActive(isActive);
        
        if (!isActive) {
          // Game completed
          setShowCongrats(true);
          resetTargetRevealLockout();
        }
      }
    }
  }, [gameStateData, onchainGameId, address, resetTargetRevealLockout]);

  // Handle game completion
  const handleGameCompleted = (event: any) => {
    setShowCongrats(true);
    resetTargetRevealLockout();
    // Refresh points
    window.location.reload();
  };

  // Use game completed listener
  useGameCompletedListener({
    contractAddress,
    playerAddress: address,
    gameId: onchainGameId,
    onCompleted: handleGameCompleted,
  });

  // Set player name
  const handleSetPlayerName = async () => {
    if (!tempName.trim()) return;
    
    setNameTxStatus('pending');
    setNameTxError(null);
    
    try {
      setPlayerNameOnChain(tempName.trim());
      setNameTxStatus('success');
      setTempName('');
    } catch (err) {
      setNameTxStatus('error');
      setNameTxError(err instanceof Error ? err.message : 'Failed to set player name');
    }
  };

  // Start new game
  const handleStartGame = async () => {
    if (!isConnected || !address) return;
    
    setGameTxStatus('pending');
    setGameTxError(null);
    setLoadingGame(true);
    
    try {
      startGameOnChain();
      setGameTxStatus('success');
      // Game ID will be updated via events or polling
    } catch (err) {
      setGameTxStatus('error');
      setGameTxError(err instanceof Error ? err.message : 'Failed to start game');
    } finally {
      setLoadingGame(false);
    }
  };

  // Handle bottle click
  const handleBottleClick = (index: number) => {
    if (!gameActive || selectedBottle === null) return;
    
    const newBottles = [...bottles];
    const temp = newBottles[selectedBottle];
    newBottles[selectedBottle] = newBottles[index];
    newBottles[index] = temp;
    
    setBottles(newBottles);
    setSelectedBottle(null);
    setMoves(moves + 1);
  };

  // Submit result
  const handleSubmitResult = async () => {
    if (!onchainGameId || !gameActive) return;
    
    setGameTxStatus('pending');
    setGameTxError(null);
    
    try {
      const colorToNumber = (color: BottleColor) => {
        switch (color) {
          case 'Red': return 0;
          case 'Blue': return 1;
          case 'Green': return 2;
          case 'Yellow': return 3;
          case 'Purple': return 4;
          default: return 0;
        }
      };
      
      const finalBottles = bottles.map(colorToNumber);
      submitResultOnChain(onchainGameId, finalBottles, moves);
      setGameTxStatus('success');
    } catch (err) {
      setGameTxStatus('error');
      setGameTxError(err instanceof Error ? err.message : 'Failed to submit result');
    }
  };

  // End game
  const handleEndGame = async () => {
    if (!onchainGameId || !gameActive) return;
    
    try {
      endGameOnChain(onchainGameId);
      setGameActive(false);
    } catch (err) {
      console.error('Error ending game:', err);
    }
  };

  // Reset game
  const handleResetGame = () => {
    setBottles([]);
    setTarget([]);
    setMoves(0);
    setGameActive(false);
    setOnchainGameId(null);
    setSelectedBottle(null);
    setShowCongrats(false);
    resetTargetRevealLockout();
    localStorage.removeItem("colorsnap_active_game_id");
  };

  // Check if user is connected
  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Please Connect Your Wallet</h2>
          <p className="text-gray-300">Connect your wallet to start playing ColorSnap!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      <BottlesBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-2">ColorSnap</h1>
          <p className="text-gray-300">Match the bottles to the target!</p>
        </div>

        {/* Player Info */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-300">Player</p>
              <p className="font-mono">{playerName || 'Anonymous'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-300">Points</p>
              <p className="font-bold text-xl">{points}</p>
            </div>
          </div>
        </div>

        {/* Set Player Name */}
        {!playerName && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 text-white">
            <h3 className="text-lg font-semibold mb-4">Set Your Player Name</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter your name"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={handleSetPlayerName}
                disabled={!tempName.trim() || nameTxStatus === 'pending'}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg font-medium transition-colors"
              >
                {nameTxStatus === 'pending' ? 'Setting...' : 'Set Name'}
              </button>
            </div>
            {nameTxError && (
              <p className="text-red-400 text-sm mt-2">{nameTxError}</p>
            )}
          </div>
        )}

        {/* Game Area */}
        {gameActive ? (
          <div className="space-y-8">
            {/* Target */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Target</h3>
                <button
                  onClick={handleShowTarget}
                  disabled={targetRevealLocked}
                  className="flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg text-sm transition-colors"
                >
                  {showTarget ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showTarget ? 'Hide' : 'Show'} Target
                  {targetRevealLocked && ` (${targetRevealCountdown}s)`}
                </button>
              </div>
              
              {showTarget && (
                <div className="flex justify-center gap-4 mb-4">
                  {target.map((color, index) => (
                    <Bottle
                      key={index}
                      color={color}
                      index={index}
                      isSelected={false}
                      isTarget={true}
                      onClick={() => {}}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Bottles */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Your Bottles</h3>
                <div className="text-sm text-gray-300">Moves: {moves}</div>
              </div>
              
              <div className="flex justify-center gap-4 mb-4">
                {bottles.map((color, index) => (
                  <Bottle
                    key={index}
                    color={color}
                    index={index}
                    isSelected={selectedBottle === index}
                    isTarget={false}
                    onClick={() => setSelectedBottle(selectedBottle === index ? null : index)}
                  />
                ))}
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleSubmitResult}
                  disabled={!bottlesMatchTarget(bottles, target)}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg font-medium transition-colors"
                >
                  Submit Solution
                </button>
                <button
                  onClick={handleEndGame}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                >
                  End Game
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Start Game */
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white text-center">
            <h3 className="text-lg font-semibold mb-4">Ready to Play?</h3>
            <button
              onClick={handleStartGame}
              disabled={loadingGame || gameTxStatus === 'pending'}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg font-medium text-lg transition-colors"
            >
              {loadingGame || gameTxStatus === 'pending' ? 'Starting Game...' : 'Start New Game'}
            </button>
          </div>
        )}

        {/* Transaction Status */}
        {(nameTxStatus === 'pending' || gameTxStatus === 'pending') && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-700">Processing transaction...</p>
            </div>
          </div>
        )}

        {/* Instructions Modal */}
        {showInstructions && (
          <InstructionsModal open={showInstructions} onClose={() => setShowInstructions(false)} />
        )}

        {/* Congrats Message */}
        {showCongrats && (
          <CongratsMessage points={10} />
        )}
      </div>
    </div>
  );
};

export default ColorSnapGame; 