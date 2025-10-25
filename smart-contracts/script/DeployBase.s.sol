// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {ColorSnap} from "../src/Colorsnap.sol";

contract DeployBaseScript is Script {
    ColorSnap public colorsnap;

    function setUp() public {}

    function run() public {
        // Get deployment parameters from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory rpcUrl = vm.envString("RPC_URL");
        string memory chainId = vm.envString("CHAIN_ID");

        address owner = vm.addr(deployerPrivateKey);

        console2.log("=== BASE MAINNET DEPLOYMENT CONFIGURATION ===");
        console2.log("Owner address:", owner);
        console2.log("Chain ID:", chainId);
        console2.log("RPC URL:", rpcUrl);
        console2.log("=============================================");

        console2.log("Deploying ColorSnap contract to Base mainnet...");

        vm.startBroadcast(deployerPrivateKey);

        colorsnap = new ColorSnap(owner);

        console2.log("SUCCESS: ColorSnap deployed to:", address(colorsnap));

        vm.stopBroadcast();

        // Automatically verify the contract
        verifyContract();
    }

    function verifyContract() internal {
        string memory chainId = vm.envString("CHAIN_ID");
        string memory apiKey = vm.envString("ETHERSCAN_API_KEY");

        console2.log("Starting contract verification on BaseScan...");
        console2.log("Chain ID:", chainId);

        if (bytes(apiKey).length == 0) {
            console2.log("WARNING: ETHERSCAN_API_KEY not provided, skipping verification");
            logVerificationCommand();
            return;
        }

        // Get owner address for constructor args
        address owner = vm.addr(vm.envUint("PRIVATE_KEY"));

        // Build verification command for Base mainnet
        string[] memory inputs = new string[](10);
        inputs[0] = "forge";
        inputs[1] = "verify-contract";
        inputs[2] = vm.toString(address(colorsnap));
        inputs[3] = "src/Colorsnap.sol:ColorSnap";
        inputs[4] = "--chain-id";
        inputs[5] = chainId;
        inputs[6] = "--constructor-args";
        inputs[7] = vm.toString(owner);
        inputs[8] = "--etherscan-api-key";
        inputs[9] = apiKey;

        try vm.ffi(inputs) {
            console2.log("SUCCESS: Contract verified successfully on BaseScan!");
            logExplorerUrl();
        } catch Error(string memory reason) {
            console2.log("ERROR: Verification failed:", reason);
            console2.log("You can manually verify using the command below:");
            logVerificationCommand();
        } catch {
            console2.log("ERROR: Verification failed with unknown error");
            console2.log("You can manually verify using the command below:");
            logVerificationCommand();
        }
    }

    function logVerificationCommand() internal view {
        string memory chainId = vm.envString("CHAIN_ID");
        address owner = vm.addr(vm.envUint("PRIVATE_KEY"));

        console2.log("");
        console2.log("=== MANUAL VERIFICATION COMMAND ===");
        console2.log("Contract Address:", address(colorsnap));
        console2.log("Contract Path: src/Colorsnap.sol:ColorSnap");
        console2.log("Chain ID:", chainId);
        console2.log("Constructor Args:", vm.toString(owner));
        console2.log("API Key: $ETHERSCAN_API_KEY");
        console2.log("");
        console2.log("Manual verification command:");
        console2.log(
            "forge verify-contract [CONTRACT_ADDRESS] src/Colorsnap.sol:ColorSnap --chain-id [CHAIN_ID] --constructor-args [OWNER_ADDRESS] --etherscan-api-key [API_KEY]"
        );
        console2.log("===================================");
    }

    function logExplorerUrl() internal view {
        string memory chainId = vm.envString("CHAIN_ID");
        string memory explorerUrl;

        if (keccak256(abi.encodePacked(chainId)) == keccak256(abi.encodePacked("8453"))) {
            // Base Mainnet
            explorerUrl = "https://basescan.org";
        } else if (keccak256(abi.encodePacked(chainId)) == keccak256(abi.encodePacked("84532"))) {
            // Base Sepolia
            explorerUrl = "https://sepolia.basescan.org";
        } else {
            explorerUrl = "https://basescan.org";
        }

        console2.log("View contract on:", explorerUrl, "/address/", address(colorsnap));
    }
}
