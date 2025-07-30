// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {ColorSnap} from "../src/Colorsnap.sol";

contract ColorSnapScript is Script {
    ColorSnap public colorsnap;

    function setUp() public {}

    function run() public {
        // Get deployment parameters from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory rpcUrl = vm.envString("RPC_URL");
        string memory chainId = vm.envString("CHAIN_ID");
        
        address owner = vm.addr(deployerPrivateKey);
        
        console.log("=== DEPLOYMENT CONFIGURATION ===");
        console.log("Owner address:", owner);
        console.log("Chain ID:", chainId);
        console.log("RPC URL:", rpcUrl);
        console.log("================================");
        
        console.log("Deploying ColorSnap contract...");
        
        vm.startBroadcast(deployerPrivateKey);

        colorsnap = new ColorSnap(owner);
        
        console.log("SUCCESS: ColorSnap deployed to:", address(colorsnap));

        vm.stopBroadcast();

        // Automatically verify the contract
        verifyContract();
    }

    function verifyContract() internal {
        string memory chainId = vm.envString("CHAIN_ID");
        string memory apiKey = vm.envString("ETHERSCAN_API_KEY");
        
        console.log("Starting contract verification...");
        console.log("Chain ID:", chainId);
        
        if (bytes(apiKey).length == 0) {
            console.log("WARNING: ETHERSCAN_API_KEY not provided, skipping verification");
            logVerificationCommand();
            return;
        }

        // Get owner address for constructor args
        address owner = vm.addr(vm.envUint("PRIVATE_KEY"));
        
        // Build verification command
        string[] memory inputs = new string[](8);
        inputs[0] = "forge";
        inputs[1] = "verify-contract";
        inputs[2] = vm.toString(address(colorsnap));
        inputs[3] = "src/Colorsnap.sol:ColorSnap";
        inputs[4] = "--chain-id";
        inputs[5] = chainId;
        inputs[6] = "--constructor-args";
        inputs[7] = vm.toString(owner);
        
        // Add API key if provided
        if (bytes(apiKey).length > 0) {
            string[] memory inputsWithKey = new string[](inputs.length + 2);
            for (uint i = 0; i < inputs.length; i++) {
                inputsWithKey[i] = inputs[i];
            }
            inputsWithKey[inputs.length] = "--etherscan-api-key";
            inputsWithKey[inputs.length + 1] = apiKey;
            inputs = inputsWithKey;
        }

        try vm.ffi(inputs) {
            console.log("SUCCESS: Contract verified successfully!");
            logExplorerUrl();
        } catch Error(string memory reason) {
            console.log("ERROR: Verification failed:", reason);
            console.log("You can manually verify using the command below:");
            logVerificationCommand();
        } catch {
            console.log("ERROR: Verification failed with unknown error");
            console.log("You can manually verify using the command below:");
            logVerificationCommand();
        }
    }

    function logVerificationCommand() internal view {
        string memory chainId = vm.envString("CHAIN_ID");
        address owner = vm.addr(vm.envUint("PRIVATE_KEY"));
        
        console.log("");
        console.log("=== MANUAL VERIFICATION COMMAND ===");
        console.log("Contract Address:", address(colorsnap));
        console.log("Contract Path: src/Colorsnap.sol:ColorSnap");
        console.log("Chain ID:", chainId);
        console.log("Constructor Args:", vm.toString(owner));
        console.log("API Key: $ETHERSCAN_API_KEY");
        console.log("");
        console.log("Manual verification command:");
        console.log("forge verify-contract [CONTRACT_ADDRESS] src/Colorsnap.sol:ColorSnap --chain-id [CHAIN_ID] --constructor-args [OWNER_ADDRESS] --etherscan-api-key [API_KEY]");
        console.log("===================================");
    }

    function logExplorerUrl() internal view {
        string memory chainId = vm.envString("CHAIN_ID");
        string memory explorerUrl;
        
        if (keccak256(abi.encodePacked(chainId)) == keccak256(abi.encodePacked("84532"))) {
            // Base Sepolia
            explorerUrl = "https://sepolia.basescan.org";
        } else if (keccak256(abi.encodePacked(chainId)) == keccak256(abi.encodePacked("4202"))) {
            // Lisk Sepolia
            explorerUrl = "https://sepolia-blockscout.lisk.com";
        } else {
            explorerUrl = "https://etherscan.io";
        }
        
        console.log("View contract on:", explorerUrl, "/address/", address(colorsnap));
    }
}
