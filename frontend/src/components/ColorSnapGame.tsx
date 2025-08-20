import React, { useState, useEffect } from 'react';
import { Play, RotateCw, Eye, EyeOff } from 'lucide-react';
import BottlesBackground from "./BottlesBackground";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { useTargetRevealLockout } from "../hooks/useTargetRevealLockout";
import { useGameCompletedListener } from "../hooks/useGameCompletedListener";
import Bottle from "./Bottle";
import CongratsMessage from "./CongratsMessage";
import InstructionsModal from "./InstructionsModal";
import colorSnapAbi from "../abi/color_snap.json";
import { CONTRACT_ADDRESSES } from "../config";
import { CHAIN_IDS } from "../config/chains";

type BottleColor = 'Red' | 'Blue' | 'Green' | 'Yellow' | 'Purple';

const ColorSnapGame = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  
  // Get contract address based on current network
  const getContractAddress = (): `0x${string}` => {
    if (chainId === CHAIN_IDS.ELECTRONEUM) {
      return CONTRACT_ADDRESSES.ELECTRONEUM as `0x${string}`;
    }
    return CONTRACT_ADDRESSES.SOMNIA as `0x${string}`; // Default to Somnia
  };
  
  const contractAddress = getContractAddress();
  
  const [playerName, setPlayerName] = useState('');
  const [tempName, setTempName] = useState('');
  const [points, setPoints] = useState(0);
  
  const [selectedBottle, setSelectedBottle] = useState<number | null>(null);
  const [onchainGameId, setOnchainGameId] = useState<string | null>(null);
  const [loadingGame, setLoadingGame] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [nameTxStatus, setNameTxStatus] = useState<null | 'pending' | 'success' | 'error'>(null);
  const [nameTxError, setNameTxError] = useState<string | null>(null);
  const [startGameTxStatus, setStartGameTxStatus] = useState<null | 'pending' | 'success' | 'error'>(null);
  const [submitTxStatus, setSubmitTxStatus] = useState<null | 'pending' | 'success' | 'error'>(null);
  const [forfeitTxStatus, setForfeitTxStatus] = useState<null | 'pending' | 'success' | 'error'>(null);
  const [gameTxError, setGameTxError] = useState<string | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [_gameCompleted, setGameCompleted] = useState(false);
  const [lastTransactionType, setLastTransactionType] = useState<'submit' | 'end' | null>(null);
  const [bottles, setBottles] = useState<BottleColor[]>([]);
  const [target, setTarget] = useState<BottleColor[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const {
    showTarget,
    handleShowTarget,
    targetRevealLocked,
    targetRevealCountdown,
    resetTargetRevealLockout,
    canRevealTarget,
  } = useTargetRevealLockout(180000, 3000, moves);

  // Write contract hook
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  // Wait for transaction receipt
  const { isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
  });

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

  // Read player name from contract
  const { data: playerNameData, refetch: refetchPlayerName } = useReadContract({
    address: contractAddress,
    abi: colorSnapAbi,
    functionName: 'getPlayerName',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress && isConnected,
    },
  });

  // Read player points from contract
  const { data: playerPointsData, refetch: refetchPlayerPoints } = useReadContract({
    address: contractAddress,
    abi: colorSnapAbi,
    functionName: 'getPlayerPoints',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress && isConnected,
    },
  });

  // Read player's active game
  const { data: activeGameData, refetch: refetchActiveGame } = useReadContract({
    address: contractAddress,
    abi: colorSnapAbi,
    functionName: 'getPlayerActiveGame',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress && isConnected,
      refetchInterval: 3000,
    },
  });

  // Read game state
  const { data: gameStateData, refetch: refetchGameState } = useReadContract({
    address: contractAddress,
    abi: colorSnapAbi,
    functionName: 'getGameState',
    args: onchainGameId ? [BigInt(onchainGameId)] : undefined,
    query: {
      enabled: !!onchainGameId,
      refetchInterval: 3000,
    },
  });

  // Update player name and points from contract data
  useEffect(() => {
    if (!address) {
      setPlayerName("");
      setPoints(0);
      setFetchError(null);
      localStorage.removeItem("colorsnap_player_name");
      localStorage.removeItem("colorsnap_player_points");
      return;
    }

    // Handle player name
    if (playerNameData) {
      const name = playerNameData as string;
      if (name && name.trim() !== '') {
        setPlayerName(name);
        localStorage.setItem("colorsnap_player_name", name);
        setFetchError(null);
      } else {
        setPlayerName("");
        setFetchError("No name found. Please set your player name.");
      }
    } else {
      // Fallback to localStorage
      const storedName = localStorage.getItem("colorsnap_player_name");
      if (storedName) {
        setPlayerName(storedName);
        setFetchError(null);
      } else {
        setPlayerName("");
        setFetchError("No name found. Please set your player name.");
      }
    }

    // Handle player points
    if (playerPointsData !== undefined && playerPointsData !== null) {
      const pointsValue = Number(playerPointsData);
      setPoints(pointsValue);
      localStorage.setItem("colorsnap_player_points", pointsValue.toString());
    } else {
      const storedPoints = localStorage.getItem("colorsnap_player_points");
      if (storedPoints) {
        setPoints(Number(storedPoints));
      }
    }
  }, [address, playerNameData, playerPointsData]);

  // Handle active game data
  useEffect(() => {
    if (!address) {
      setOnchainGameId(null);
      localStorage.removeItem("colorsnap_active_game_id");
      return;
    }

    if (activeGameData) {
      const gameId = Number(activeGameData);
      
      if (gameId > 0) {
        setOnchainGameId(gameId.toString());
        localStorage.setItem("colorsnap_active_game_id", gameId.toString());
      } else {
        setOnchainGameId(null);
        localStorage.removeItem("colorsnap_active_game_id");
        setGameActive(false);
        setBottles([]);
        setTarget([]);
        setMoves(0);
      }
    }
  }, [address, activeGameData]);

  // Handle game state data
  useEffect(() => {
    if (gameStateData && onchainGameId) {
      const [player, gameBottles, gameTarget, , isActive] = gameStateData as [string, number[], number[], number, boolean];
      
      if (player.toLowerCase() === address?.toLowerCase()) {
        const parsedBottles = gameBottles.map(parseColor);
        const parsedTarget = gameTarget.map(parseColor);
        
        setBottles(parsedBottles);
        setTarget(parsedTarget);
        setMoves(0); // Reset local moves counter when fetching from chain
        setGameActive(isActive);
        
        if (!isActive) {
          // Game ended
          setOnchainGameId(null);
          setBottles([]);
          setTarget([]);
          setMoves(0);
          setGameCompleted(false);
          resetTargetRevealLockout();
          localStorage.removeItem("colorsnap_active_game_id");
          
          // Refetch points
          setTimeout(() => {
            refetchPlayerPoints();
          }, 1000);
        }
      }
    }
  }, [gameStateData, onchainGameId, address, resetTargetRevealLockout, refetchPlayerPoints]);

  // Set player name
  const handleSetPlayerName = async () => {
    if (!tempName.trim() || !address) return;
    
    setNameTxStatus('pending');
    setNameTxError(null);
    setFetchError(null);
    
    try {
      writeContract({
        address: contractAddress,
        abi: colorSnapAbi,
        functionName: 'setPlayerName',
        args: [tempName.trim()],
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setNameTxStatus('error');
      setNameTxError(errorMessage);
      setFetchError('Failed to set name on chain.');
    }
  };

  // Start game
  const startGame = async () => {
    if (!address) return;
    
    setLoadingGame(true);
    setStartGameTxStatus('pending');
    setGameTxError(null);
    
    try {
      writeContract({
        address: contractAddress,
        abi: colorSnapAbi,
        functionName: 'startGame',
        args: [],
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start game';
      setLoadingGame(false);
      setStartGameTxStatus('error');
      setGameTxError(errorMessage);
    }
  };

  // Handle bottle click
  const handleBottleClick = (index: number) => {
    if (!gameActive || isPending || loadingGame || submitTxStatus === 'pending' || forfeitTxStatus === 'pending') return;
    
    if (selectedBottle === null) {
      setSelectedBottle(index);
    } else if (selectedBottle === index) {
      setSelectedBottle(null);
    } else {
      // Swap bottles in local state
      setBottles((prev) => {
        const newArr = [...prev];
        [newArr[selectedBottle], newArr[index]] = [newArr[index], newArr[selectedBottle]];
        return newArr;
      });
      setMoves((m) => m + 1);
      setSelectedBottle(null);
    }
  };

  // Submit result
  const submitResult = async () => {
    if (!onchainGameId || !gameActive) return;
    
    setSubmitTxStatus('pending');
    setGameTxError(null);
    setLastTransactionType('submit');
    
    try {
      // Convert bottles to contract enum format
      const colorToEnum = (color: BottleColor) => {
        switch (color) {
          case 'Red': return 0;
          case 'Blue': return 1;
          case 'Green': return 2;
          case 'Yellow': return 3;
          case 'Purple': return 4;
          default: return 0;
        }
      };
      
      const bottleEnums = bottles.map(colorToEnum);
      
      writeContract({
        address: contractAddress,
        abi: colorSnapAbi,
        functionName: 'submitResult',
        args: [BigInt(onchainGameId), bottleEnums, moves],
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setSubmitTxStatus('error');
      setGameTxError(errorMessage);
    }
  };

  // End game
  const endGame = async () => {
    if (!onchainGameId || !gameActive) return;
    
    setForfeitTxStatus('pending');
    setGameTxError(null);
    setLastTransactionType('end');
    
    try {
      writeContract({
        address: contractAddress,
        abi: colorSnapAbi,
        functionName: 'endGame',
        args: [BigInt(onchainGameId)],
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setForfeitTxStatus('error');
      setGameTxError(errorMessage);
      console.error('Error ending game:', err);
    }
  };

  // Handle transaction success
  useEffect(() => {
    if (isSuccess && hash) {
      if (nameTxStatus === 'pending') {
        setNameTxStatus('success');
        setPlayerName(tempName);
        localStorage.setItem("colorsnap_player_name", tempName);
        setTempName('');
        
        // Refetch player data
        setTimeout(() => {
          refetchPlayerName();
          refetchPlayerPoints();
        }, 1000);
      } else if (startGameTxStatus === 'pending') {
        setStartGameTxStatus('success');
        setLoadingGame(false);
        
        // Refetch active game and game state
        setTimeout(() => {
          refetchActiveGame();
          refetchGameState();
        }, 2000);
      } else if (submitTxStatus === 'pending') {
        setSubmitTxStatus('success');
        setLoadingGame(false);
        
        // Refetch active game and game state
        setTimeout(() => {
          refetchActiveGame();
          refetchGameState();
        }, 2000);
      } else if (forfeitTxStatus === 'pending') {
        setForfeitTxStatus('success');
        setLoadingGame(false);
        
        // Refetch active game and game state
        setTimeout(() => {
          refetchActiveGame();
          refetchGameState();
        }, 2000);
      }
    }
  }, [isSuccess, hash, nameTxStatus, startGameTxStatus, submitTxStatus, forfeitTxStatus, tempName, refetchPlayerName, refetchPlayerPoints, refetchActiveGame, refetchGameState]);

  // Handle transaction error
  useEffect(() => {
    if (isError && error) {
      if (nameTxStatus === 'pending') {
        setNameTxStatus('error');
        setNameTxError(error.message || 'Transaction failed');
      } else if (startGameTxStatus === 'pending') {
        setStartGameTxStatus('error');
        setGameTxError(error.message || 'Transaction failed');
        setLoadingGame(false);
      } else if (submitTxStatus === 'pending') {
        setSubmitTxStatus('error');
        setGameTxError(error.message || 'Transaction failed');
        setLoadingGame(false);
      } else if (forfeitTxStatus === 'pending') {
        setForfeitTxStatus('error');
        setGameTxError(error.message || 'Transaction failed');
        setLoadingGame(false);
      }
    }
  }, [isError, error, nameTxStatus, startGameTxStatus, submitTxStatus, forfeitTxStatus]);

  // Auto-dismiss transaction status messages
  useEffect(() => {
    if (nameTxStatus && nameTxStatus !== 'pending') {
      const timer = setTimeout(() => {
        setNameTxStatus(null);
        setNameTxError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [nameTxStatus]);

  useEffect(() => {
    if (submitTxStatus && submitTxStatus !== 'pending') {
      const timer = setTimeout(() => {
        setSubmitTxStatus(null);
        setGameTxError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitTxStatus]);

  useEffect(() => {
    if (forfeitTxStatus && forfeitTxStatus !== 'pending') {
      const timer = setTimeout(() => {
        setForfeitTxStatus(null);
        setGameTxError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [forfeitTxStatus]);

  // Game completion listener
  useGameCompletedListener({
    contractAddress,
    playerAddress: address,
    gameId: onchainGameId,
    onCompleted: () => {
      // Only show congrats for successful submissions, not forfeits
      if (lastTransactionType === 'submit') {
        setShowCongrats(true);
        setTimeout(() => setShowCongrats(false), 3000);
      }
      setGameCompleted(true);
    },
  });

  // Reset target reveal lockout on new game or submission
  const isGameTxSuccess = submitTxStatus === 'success';
  useEffect(() => {
    resetTargetRevealLockout();
  }, [onchainGameId, isGameTxSuccess, resetTargetRevealLockout]);

  // Check if user is connected
  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-300 text-lg">Please connect your wallet to start playing ColorSnap!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {showInstructions && (
        <InstructionsModal open={showInstructions} onClose={() => setShowInstructions(false)} />
      )}
      {showCongrats && (
        <CongratsMessage points={10} />
      )}
      <BottlesBackground />
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 bg-clip-text text-transparent tracking-tight">Color</h1>
            <h1 className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 bg-clip-text text-transparent tracking-tight">Snap</h1>
            <span className="ml-2 animate-pulse text-yellow-300 text-2xl sm:text-3xl">✨</span>
          </div>
          <p className="text-lg sm:text-xl text-gray-300 text-center">🎯 Master the color puzzle, claim your victory! 🏆</p>
        </div>

        {/* Name Input */}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-gradient-to-br from-white/10 via-purple-200/10 to-blue-200/10 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-xl">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-lg font-semibold text-purple-200 mb-2">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                🎮 Name
              </label>
              <div className="flex gap-2 items-center w-full">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Enter your name"
                  className="flex-1 min-w-0 px-4 py-3 bg-white/70 bg-opacity-30 rounded-xl text-black placeholder-gray-400 border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg shadow-inner transition-all duration-200"
                  disabled={!address || nameTxStatus === 'pending' || isPending}
                  maxLength={31}
                />
                <button
                  onClick={handleSetPlayerName}
                  className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 hover:from-purple-500 hover:via-pink-400 hover:to-blue-500 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-400 whitespace-nowrap"
                  disabled={!address || nameTxStatus === 'pending' || isPending || !tempName.trim() || tempName.length > 31}
                >
                  {nameTxStatus === 'pending' || (isPending && nameTxStatus !== null) ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75" />
                      </svg> 
                      🚀 Registering...
                    </span>
                  ) : 'Register'}
                </button>
              </div>
              {tempName.length > 31 && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg> 
                  Name must be 31 characters or less.
                </p>
              )}
              {fetchError && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg> 
                  {fetchError}
                </p>
              )}
              {nameTxStatus === 'pending' && (
                <p className="text-yellow-400 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75" />
                  </svg> 
                  Transaction pending...
                </p>
              )}
              {nameTxStatus === 'success' && (
                <p className="text-green-400 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg> 
                  Name set on-chain!
                </p>
              )}
              {nameTxStatus === 'error' && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg> 
                  {nameTxError || 'Transaction failed'}
                </p>
              )}
              <div className="text-center mt-2">
                {playerName && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2 justify-center">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow">
                        {playerName[0]?.toUpperCase()}
                      </span>
                      <span className="text-lg text-white font-semibold">{playerName}</span>
                    </div>
                    <p className="text-sm text-gray-300">🏆 Score: {points} points</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Game Controls (only if playerName is set) */}
        {playerName && (
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-gray-100 bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
              <div className="flex gap-4">
                {!gameActive ? (
                  <button
                    onClick={startGame}
                    disabled={!playerName || loadingGame || startGameTxStatus === 'pending' || isPending}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingGame || startGameTxStatus === 'pending' || isPending ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75" />
                        </svg>
                        🚀 Launching Challenge...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        🎮 Start New Challenge
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={endGame}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    disabled={isPending || forfeitTxStatus === 'pending'}
                  >
                    {(isPending && lastTransactionType === 'end') || forfeitTxStatus === 'pending' ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75" />
                        </svg>
                        ⏳ Forfeiting...
                      </>
                    ) : (
                      <>
                        <RotateCw className="w-5 h-5" />
                        🏳️ Forfeit Challenge
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Game Board */}
        {gameActive && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gray-500 bg-opacity-10 backdrop-blur-sm rounded-xl p-8 border border-white border-opacity-20">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">🎯 ColorSnap Challenge #{onchainGameId}</h2>
                <div className="flex justify-center gap-6 text-sm">
                  <span className="font-semibold">🔄 Swaps: {moves}</span>
                  <span className="font-semibold">✅ Matched: {countCorrectBottles(bottles, target)}/{bottles.length}</span>
                  <button
                    onClick={handleShowTarget}
                    disabled={targetRevealLocked || !canRevealTarget || submitTxStatus === 'pending' || forfeitTxStatus === 'pending'}
                    className={
                      `flex items-center gap-1 transition-colors ` +
                      (targetRevealLocked || !canRevealTarget || submitTxStatus === 'pending' || forfeitTxStatus === 'pending'
                        ? 'text-red-600 cursor-not-allowed'
                        : 'text-green-600 hover:text-green-400')
                    }
                  >
                    {showTarget ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showTarget
                      ? '👁️ Hide Solution'
                      : !canRevealTarget
                        ? `🔒 Peek Solution (${5 - moves} swaps needed)`
                        : (targetRevealLocked)
                          ? `⏳ Peek Solution (${targetRevealCountdown}s)`
                          : '👁️ Peek Solution'}
                  </button>
                </div>
              </div>

              {/* Current Bottles */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-4">🧪 Your Color Mix</h3>
                <div className="flex justify-center">
                  {bottles.map((color, index) => (
                    <Bottle
                      key={index}
                      color={color as BottleColor}
                      index={index}
                      isSelected={selectedBottle === index}
                      onClick={() => handleBottleClick(index)}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-300 mt-2">🎯 Select two bottles to swap their positions</p>
                <button
                  onClick={submitResult}
                  disabled={isPending || !bottlesMatchTarget(bottles, target) || submitTxStatus === 'pending'}
                  className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition-colors disabled:opacity-50"
                >
                  {(isPending && lastTransactionType === 'submit') || submitTxStatus === 'pending' ? '🚀 Submitting...' : '🏆 Submit Solution'}
                </button>
                {!bottlesMatchTarget(bottles, target) && (
                  <p className="text-yellow-400 text-sm mt-2">⚠️ Arrange your bottles to match the target pattern!</p>
                )}
                {submitTxStatus === 'error' && (
                  <p className="text-red-400 text-sm mt-2">❌ {gameTxError || 'Transaction failed'}</p>
                )}
                {submitTxStatus === 'success' && !isPending && (
                  <p className="text-green-400 text-sm mt-2">🎉 Solution Verified!</p>
                )}
              </div>

              {/* Target Bottles */}
              {showTarget && (
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">🎯 Target Pattern</h3>
                  <div className="flex justify-center">
                    {target.map((color, index) => (
                      <Bottle
                        key={index}
                        color={color as BottleColor}
                        index={index}
                        isTarget={true}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-blue-300 mt-2">✨ Match this exact pattern to win!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorSnapGame;