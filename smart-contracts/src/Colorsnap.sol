// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ColorSnap is Ownable {
    // Enum for colors
    enum Color {
        Red,    // 0
        Blue,   // 1
        Green,  // 2
        Yellow, // 3
        Purple  // 4
    }

    // Struct for player data
    struct PlayerData {
        address playerAddress;
        string name;
        uint256 points;
        uint256 moves;
    }

    // Struct for game state
    struct Game {
        address player;
        uint8 moves;
        bool isActive;
        uint256 seed;
    }

    // Storage mappings
    mapping(uint256 => Game) public gameState;
    mapping(address => uint256) public playerGames;
    mapping(address => uint256) public playerPoints;
    mapping(address => string) public playerNames;
    mapping(uint256 => address) public players;
    mapping(address => uint256) public playerMoves;
    
    // Game-specific mappings
    mapping(uint256 => mapping(uint8 => Color)) public bottles;
    mapping(uint256 => mapping(uint8 => Color)) public target;

    uint256 public playerCount;
    uint256 public nextGameId;

    // Events
    event PlayerNameSet(address indexed player, string name);
    event GameStarted(
        address indexed player, 
        uint256 indexed gameId, 
        Color[5] startingBottles, 
        Color[5] targetBottles
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

    constructor(address _owner) Ownable(_owner) {
        nextGameId = 1;
        playerCount = 0;
    }

    // Set player name
    function setPlayerName(string memory name) external {
        address player = msg.sender;
        playerNames[player] = name;
        
        if (!isPlayerRegistered(player)) {
            players[playerCount] = player;
            playerCount++;
        }

        emit PlayerNameSet(player, name);
    }

    // Start a new game
    function startGame() external {
        address player = msg.sender;
        require(player != address(0), "Invalid player address");
        require(isPlayerRegistered(player), "Player not registered");
        require(!hasActiveGame(player), "Player already in game");
        
        uint256 gameId = nextGameId;
        
        // Generate seed using block properties and player address
        uint256 seed = uint256(keccak256(abi.encodePacked(
            block.timestamp, 
            block.prevrandao, 
            player, 
            gameId
        )));

        Color[5] memory colors = [Color.Red, Color.Blue, Color.Green, Color.Yellow, Color.Purple];
        
        Color[5] memory shuffledStarting = shuffleColors(colors, seed);
        Color[5] memory shuffledTarget = shuffleColors(colors, uint256(keccak256(abi.encodePacked(seed, "target"))));

        Game memory game = Game({
            player: player,
            moves: 0,
            isActive: true,
            seed: seed
        });

        // Store bottles and target configurations
        for (uint8 i = 0; i < 5; i++) {
            bottles[gameId][i] = shuffledStarting[i];
            target[gameId][i] = shuffledTarget[i];
        }

        gameState[gameId] = game;
        playerGames[player] = gameId;
        nextGameId++;

        emit GameStarted(player, gameId, shuffledStarting, shuffledTarget);
    }

    // Submit game result
    function submitResult(uint256 gameId, uint8[5] memory finalBottles, uint8 moves) external {
        address player = msg.sender;
        require(player != address(0), "Invalid player address");
        require(isPlayerRegistered(player), "Player not registered");
        require(gameId > 0 && gameId < nextGameId, "Invalid game ID");
        Game storage game = gameState[gameId];
        
        require(game.isActive, "Game not active");
        require(game.player == player, "Not your game");

        // Convert uint8 array to Color array for verification
        Color[5] memory finalColors;
        for (uint8 i = 0; i < 5; i++) {
            require(finalBottles[i] < 5, "Invalid color index");
            finalColors[i] = Color(finalBottles[i]);
        }

        // Get target configuration
        Color[5] memory targetColors;
        for (uint8 i = 0; i < 5; i++) {
            targetColors[i] = target[gameId][i];
        }

        // Verify completion
        require(verifyCompletion(targetColors, finalColors), "Final bottles do not match target");

        // Update game state
        game.moves = moves;
        game.isActive = false;
        playerGames[player] = 0;

        // Award points
        uint256 pointsEarned = 10;
        uint256 newTotalPoints = playerPoints[player] + pointsEarned;
        playerPoints[player] = newTotalPoints;

        // Update player total moves
        playerMoves[player] += moves;

        emit GameCompleted(player, gameId, moves, pointsEarned, newTotalPoints);
    }

    // End game without completion
    function endGame(uint256 gameId) external {
        address player = msg.sender;
        Game storage game = gameState[gameId];
        
        require(game.isActive, "Game not active");
        require(game.player == player, "Not your game");

        game.isActive = false;
        playerGames[player] = 0;

        emit GameEnded(player, gameId, game.moves, false);
    }

    // Get game state
    function getGameState(uint256 gameId) external view returns (
        address player,
        Color[5] memory gameBottles,
        Color[5] memory gameTarget,
        uint8 moves,
        bool isActive
    ) {
        Game memory game = gameState[gameId];
        
        for (uint8 i = 0; i < 5; i++) {
            gameBottles[i] = bottles[gameId][i];
            gameTarget[i] = target[gameId][i];
        }

        return (game.player, gameBottles, gameTarget, game.moves, game.isActive);
    }

    // Get number of correct bottles
    function getCorrectBottles(uint256 gameId) external view returns (uint8) {
        uint8 correct = 0;
        for (uint8 i = 0; i < 5; i++) {
            if (bottles[gameId][i] == target[gameId][i]) {
                correct++;
            }
        }
        return correct;
    }

    // Get player points
    function getPlayerPoints(address player) external view returns (uint256) {
        return playerPoints[player];
    }

    // Get player name
    function getPlayerName(address player) external view returns (string memory) {
        return playerNames[player];
    }

    // Get all player data
    function getAllPlayerPoints() external view returns (PlayerData[] memory) {
        PlayerData[] memory result = new PlayerData[](playerCount);
        
        for (uint256 i = 0; i < playerCount; i++) {
            address player = players[i];
            result[i] = PlayerData({
                playerAddress: player,
                name: playerNames[player],
                points: playerPoints[player],
                moves: playerMoves[player]
            });
        }
        
        return result;
    }

    // Get player's active game
    function getPlayerActiveGame(address player) external view returns (uint256) {
        return playerGames[player];
    }

    // Get next game ID
    function getNextGameId() external view returns (uint256) {
        return nextGameId;
    }

    // Check if player has active game
    function hasActiveGame(address player) public view returns (bool) {
        uint256 gameId = playerGames[player];
        if (gameId == 0) {
            return false;
        }
        Game memory game = gameState[gameId];
        return game.isActive;
    }

    // Get player's game history
    function getPlayerGameHistory(address player) external view returns (uint256[] memory) {
        // First pass: count games for this player
        uint256 count = 0;
        for (uint256 i = 1; i < nextGameId; i++) {
            if (gameState[i].player == player) {
                count++;
            }
        }

        // Second pass: collect game IDs
        uint256[] memory history = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i < nextGameId; i++) {
            if (gameState[i].player == player) {
                history[index] = i;
                index++;
            }
        }

        return history;
    }

    // Internal functions

    // Check if player is registered
    function isPlayerRegistered(address player) internal view returns (bool) {
        for (uint256 i = 0; i < playerCount; i++) {
            if (players[i] == player) {
                return true;
            }
        }
        return false;
    }

    // Shuffle colors array using Fisher-Yates algorithm
    function shuffleColors(Color[5] memory colors, uint256 seed) internal pure returns (Color[5] memory) {
        Color[5] memory shuffled = colors;
        uint256 currentSeed = seed;

        for (uint256 i = 4; i > 0; i--) {
            uint256 j = currentSeed % (i + 1);
            currentSeed = uint256(keccak256(abi.encodePacked(currentSeed)));
            
            // Swap elements
            Color temp = shuffled[i];
            shuffled[i] = shuffled[j];
            shuffled[j] = temp;
        }

        return shuffled;
    }

    // Verify if final bottles match target
    function verifyCompletion(Color[5] memory targetColors, Color[5] memory finalColors) internal pure returns (bool) {
        for (uint8 i = 0; i < 5; i++) {
            if (targetColors[i] != finalColors[i]) {
                return false;
            }
        }
        return true;
    }
}