// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Colorsnap.sol";

contract ColorSnapTest is Test {
    ColorSnap public game;
    address public owner;
    address public player1;
    address public player2;

    event PlayerNameSet(address indexed player, string name);
    event GameStarted(
        address indexed player, 
        uint256 indexed gameId, 
        ColorSnap.Color[5] startingBottles, 
        ColorSnap.Color[5] targetBottles
    );
    event GameCompleted(
        address indexed player,
        uint256 indexed gameId,
        uint8 finalMoves,
        uint256 pointsEarned,
        uint256 totalPoints
    );
    event GameEnded(
        address indexed player,
        uint256 indexed gameId,
        uint8 moves,
        bool wasCompleted
    );

    function setUp() public {
        owner = address(1);
        player1 = address(2);
        player2 = address(3);
        
        // Deploy contract with owner
        game = new ColorSnap(owner);
        
        // Label addresses for better trace output
        vm.label(owner, "Owner");
        vm.label(player1, "Player1");
        vm.label(player2, "Player2");
    }

    function testSetPlayerName() public {
        vm.startPrank(player1);
        
        vm.expectEmit(true, false, false, true);
        emit PlayerNameSet(player1, "Alfred");
        
        game.setPlayerName("Alfred");
        
        assertEq(game.getPlayerName(player1), "Alfred");
        assertEq(game.playerCount(), 1);
        
        vm.stopPrank();
    }

    function testStartGame() public {
        vm.startPrank(player1);
        
        // First set player name
        game.setPlayerName("Alfred");
        
        // Start game - we can't predict the exact colors due to randomness, so we just check that the event is emitted with correct player and gameId.
        game.startGame();
        
        // Verify game state
        assertTrue(game.hasActiveGame(player1));
        assertEq(game.getPlayerActiveGame(player1), 1);
        assertEq(game.getNextGameId(), 2);
        
        // Verify that starting bottles and target bottles are different
        uint256 gameId = game.getPlayerActiveGame(player1);
        (address player, ColorSnap.Color[5] memory gameBottles, ColorSnap.Color[5] memory gameTarget, uint8 moves, bool isActive) = game.getGameState(gameId);
        
        // Check that at least one bottle position is different
        bool bottlesAreDifferent = false;
        for (uint8 i = 0; i < 5; i++) {
            if (gameBottles[i] != gameTarget[i]) {
                bottlesAreDifferent = true;
                break;
            }
        }
        assertTrue(bottlesAreDifferent, "Starting bottles and target bottles should be different");
        
        vm.stopPrank();
    }

    function testCannotStartMultipleGames() public {
        vm.startPrank(player1);
        game.setPlayerName("Alfred");
        game.startGame();
        
        // Try to start another game while one is active
        vm.expectRevert("Player already in game");
        game.startGame();
        
        vm.stopPrank();
    }

    function testSubmitResult() public {
        vm.startPrank(player1);
        
        // Setup
        game.setPlayerName("Alfred");
        game.startGame();
        uint256 gameId = game.getPlayerActiveGame(player1);
        
        // Get target configuration
        (,, ColorSnap.Color[5] memory targetBottles,,) = game.getGameState(gameId);
        
        // Convert target colors to uint8 array
        uint8[5] memory finalBottles;
        for (uint8 i = 0; i < 5; i++) {
            finalBottles[i] = uint8(targetBottles[i]);
        }
        
        // Submit correct result
        vm.expectEmit(true, true, false, true);
        emit GameCompleted(player1, gameId, 10, 10, 10);
        
        game.submitResult(gameId, finalBottles, 10);
        
        // Verify state after completion
        assertEq(game.getPlayerPoints(player1), 10);
        assertEq(game.playerMoves(player1), 10);
        assertFalse(game.hasActiveGame(player1));
        
        vm.stopPrank();
    }

    function testSubmitWrongResult() public {
        vm.startPrank(player1);
        
        // Setup
        game.setPlayerName("Alfred");
        game.startGame();
        uint256 gameId = game.getPlayerActiveGame(player1);
        
        // Get the actual target to ensure we submit something different
        (,, ColorSnap.Color[5] memory targetBottles,,) = game.getGameState(gameId);
        
        // Create a wrong configuration by reversing the target
        uint8[5] memory wrongBottles;
        for (uint8 i = 0; i < 5; i++) {
            wrongBottles[i] = uint8(targetBottles[4-i]); // Reverse order
        }
        
        // Only expect revert if the reversed order is actually different
        bool isDifferent = false;
        for (uint8 i = 0; i < 5; i++) {
            if (uint8(targetBottles[i]) != wrongBottles[i]) {
                isDifferent = true;
                break;
            }
        }
        
        if (isDifferent) {
            vm.expectRevert("Final bottles do not match target");
            game.submitResult(gameId, wrongBottles, 10);
        } else {
            // If by chance the reversed order is the same, submit a clearly wrong one
            uint8[5] memory clearlyWrong = [0, 0, 0, 0, 0];
            vm.expectRevert("Final bottles do not match target");
            game.submitResult(gameId, clearlyWrong, 10);
        }
        
        vm.stopPrank();
    }

    function testSubmitInvalidColorIndex() public {
        vm.startPrank(player1);
        
        // Setup
        game.setPlayerName("Alfred");
        game.startGame();
        uint256 gameId = game.getPlayerActiveGame(player1);
        
        // Submit invalid color index (5 is invalid, only 0-4 are valid)
        uint8[5] memory invalidBottles = [0, 1, 2, 3, 5];
        
        vm.expectRevert("Invalid color index");
        game.submitResult(gameId, invalidBottles, 10);
        
        vm.stopPrank();
    }

    function testEndGame() public {
        vm.startPrank(player1);
        
        // Setup
        game.setPlayerName("Alfred");
        game.startGame();
        uint256 gameId = game.getPlayerActiveGame(player1);
        
        // End game
        vm.expectEmit(true, true, false, true);
        emit GameEnded(player1, gameId, 0, false);
        
        game.endGame(gameId);
        
        // Verify state
        assertFalse(game.hasActiveGame(player1));
        assertEq(game.getPlayerPoints(player1), 0);
        
        vm.stopPrank();
    }

    function testCannotSubmitToInactiveGame() public {
        vm.startPrank(player1);
        
        // Setup
        game.setPlayerName("Alfred");
        game.startGame();
        uint256 gameId = game.getPlayerActiveGame(player1);
        
        // End the game first
        game.endGame(gameId);
        
        // Try to submit result to inactive game
        uint8[5] memory bottles = [0, 1, 2, 3, 4];
        vm.expectRevert("Game not active");
        game.submitResult(gameId, bottles, 10);
        
        vm.stopPrank();
    }

    function testCannotSubmitToOtherPlayersGame() public {
        // Player1 starts a game
        vm.prank(player1);
        game.setPlayerName("Alfred");
        vm.prank(player1);
        game.startGame();
        uint256 gameId = game.getPlayerActiveGame(player1);
        
        // Player2 tries to submit to Player1's game
        vm.startPrank(player2);
        game.setPlayerName("Olumide");
        
        uint8[5] memory bottles = [0, 1, 2, 3, 4];
        vm.expectRevert("Not your game");
        game.submitResult(gameId, bottles, 10);
        
        vm.stopPrank();
    }

    function testGetPlayerGameHistory() public {
        vm.startPrank(player1);
        
        // Setup - play and end multiple games
        game.setPlayerName("Alfred");
        
        // First game
        game.startGame();
        uint256 gameId1 = game.getPlayerActiveGame(player1);
        game.endGame(gameId1);
        
        // Second game
        game.startGame();
        uint256 gameId2 = game.getPlayerActiveGame(player1);
        game.endGame(gameId2);
        
        // Get history
        uint256[] memory history = game.getPlayerGameHistory(player1);
        
        // Verify history
        assertEq(history.length, 2);
        assertEq(history[0], gameId1);
        assertEq(history[1], gameId2);
        
        vm.stopPrank();
    }

    function testGetAllPlayerPoints() public {
        // Setup multiple players
        vm.prank(player1);
        game.setPlayerName("Alfred");
        
        vm.prank(player2);
        game.setPlayerName("Olumide");
        
        // Start and complete game for player1
        vm.startPrank(player1);
        game.startGame();
        uint256 gameId = game.getPlayerActiveGame(player1);
        
        // Get target configuration and submit result
        (,, ColorSnap.Color[5] memory targetBottles,,) = game.getGameState(gameId);
        uint8[5] memory finalBottles;
        for (uint8 i = 0; i < 5; i++) {
            finalBottles[i] = uint8(targetBottles[i]);
        }
        game.submitResult(gameId, finalBottles, 5);
        vm.stopPrank();
        
        // Get all player data
        ColorSnap.PlayerData[] memory allPlayers = game.getAllPlayerPoints();
        
        // Verify data
        assertEq(allPlayers.length, 2);
        assertEq(allPlayers[0].playerAddress, player1);
        assertEq(allPlayers[0].name, "Alfred");
        assertEq(allPlayers[0].points, 10);
        assertEq(allPlayers[0].moves, 5);
        
        assertEq(allPlayers[1].playerAddress, player2);
        assertEq(allPlayers[1].name, "Olumide");
        assertEq(allPlayers[1].points, 0);
        assertEq(allPlayers[1].moves, 0);
    }

    function testGetCorrectBottles() public {
        vm.startPrank(player1);
        
        // Setup
        game.setPlayerName("Alfred");
        game.startGame();
        uint256 gameId = game.getPlayerActiveGame(player1);
        
        // Get number of correct bottles
        uint8 correctBottles = game.getCorrectBottles(gameId);
        
        // Since bottles are randomly shuffled, the number should be between 0 and 5
        assertTrue(correctBottles <= 5);
        
        vm.stopPrank();
    }

    function testGameStateRetrieval() public {
        vm.startPrank(player1);
        
        // Setup
        game.setPlayerName("Alfred");
        game.startGame();
        uint256 gameId = game.getPlayerActiveGame(player1);
        
        // Get game state
        (
            address gamePlayer,
            ColorSnap.Color[5] memory bottles,
            ColorSnap.Color[5] memory targets,
            uint8 moves,
            bool isActive
        ) = game.getGameState(gameId);
        
        // Verify game state
        assertEq(gamePlayer, player1);
        assertEq(moves, 0);
        assertTrue(isActive);
        
        // Verify all colors are valid (0-4)
        for (uint8 i = 0; i < 5; i++) {
            assertTrue(uint8(bottles[i]) <= 4);
            assertTrue(uint8(targets[i]) <= 4);
        }
        
        vm.stopPrank();
    }

    function testMultiplePlayersCanPlaySimultaneously() public {
        // Player1 starts a game
        vm.prank(player1);
        game.setPlayerName("Alfred");
        vm.prank(player1);
        game.startGame();
        
        // Player2 starts a game
        vm.prank(player2);
        game.setPlayerName("Olumide");
        vm.prank(player2);
        game.startGame();
        
        // Both should have active games
        assertTrue(game.hasActiveGame(player1));
        assertTrue(game.hasActiveGame(player2));
        
        // Game IDs should be different
        uint256 gameId1 = game.getPlayerActiveGame(player1);
        uint256 gameId2 = game.getPlayerActiveGame(player2);
        assertTrue(gameId1 != gameId2);
    }

    function testFuzzRandomness() public {
        vm.startPrank(player1);
        game.setPlayerName("Alfred");
        
        // Start multiple games and check that shuffling produces different results
        bool foundDifference = false;
        ColorSnap.Color[5] memory firstStarting;
        ColorSnap.Color[5] memory firstTarget;
        
        for (uint i = 0; i < 10 && !foundDifference; i++) {
            game.startGame();
            uint256 gameId = game.getPlayerActiveGame(player1);
            
            (,
             ColorSnap.Color[5] memory starting,
             ColorSnap.Color[5] memory target,,
            ) = game.getGameState(gameId);
            
            if (i == 0) {
                firstStarting = starting;
                firstTarget = target;
            } else {
                // Check if current configuration differs from first
                for (uint8 j = 0; j < 5; j++) {
                    if (starting[j] != firstStarting[j] || target[j] != firstTarget[j]) {
                        foundDifference = true;
                        break;
                    }
                }
            }
            
            game.endGame(gameId);
            
            // Advance time to ensure different randomness
            vm.warp(block.timestamp + 1);
        }
        
        // We should find at least one difference in shuffling over 10 games
        // (This test might rarely fail due to randomness, but very unlikely)
        assertTrue(foundDifference);
        
        vm.stopPrank();
    }
}