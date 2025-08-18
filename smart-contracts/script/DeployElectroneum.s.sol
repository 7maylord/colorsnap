// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {ColorSnap} from "../src/Colorsnap.sol";

contract ColorSnapElectroneumScript is Script {
    ColorSnap public colorsnap;

    function setUp() public {}

    function run() public {
        // Get deployment parameters from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory rpcUrl = vm.envString("RPC_URL");
        string memory chainId = vm.envString("CHAIN_ID");

        address owner = vm.addr(deployerPrivateKey);

        console2.log("=== ELECTRONEUM DEPLOYMENT CONFIGURATION ===");
        console2.log("Owner address:", owner);
        console2.log("Chain ID:", chainId);
        console2.log("RPC URL:", rpcUrl);
        console2.log("=========================================");

        console2.log("Deploying ColorSnap contract to Electroneum testnet...");

        vm.startBroadcast(deployerPrivateKey);

        colorsnap = new ColorSnap(owner);

        console2.log("SUCCESS: ColorSnap deployed to:", address(colorsnap));

        vm.stopBroadcast();

        // Note: Electroneum may have a different verification process
        if (bytes(vm.envString("ETN_EXPLORER_API_KEY")).length > 0) {
            verifyContract();
        } else {
            console2.log("Skipping verification - No ETN_EXPLORER_API_KEY provided");
            logVerificationCommand();
        }
    }

    function verifyContract() internal {
        string memory chainId = vm.envString("CHAIN_ID");
        string memory apiKey = vm.envString("ETN_EXPLORER_API_KEY");

        console2.log("Starting contract verification on Electroneum explorer...");
        console2.log("Chain ID:", chainId);

        string[] memory args = new string[](8);
        args[0] = "forge";
        args[1] = "verify-contract";
        args[2] = vm.toString(address(colorsnap));  // Convert address to string
        args[3] = "ColorSnap";
        args[4] = "--chain-id";
        args[5] = chainId;
        args[6] = "--watch";
        args[7] = "--constructor-args";
        
        // Note: Adjust verification command based on Electroneum's explorer requirements
        try vm.ffi(args) returns (bytes memory) {
            console2.log("Contract verification submitted successfully");
        } catch {
            console2.log("Contract verification failed");
            logVerificationCommand();
        }
    }

    function logVerificationCommand() internal view {
        string memory contractAddress = vm.toString(address(colorsnap));
        string memory ownerAddress = vm.toString(vm.addr(vm.envUint("PRIVATE_KEY")));
        
        console2.log("To verify manually, run:");
        console2.log(
            string.concat(
                "forge verify-contract ",
                contractAddress,
                " ColorSnap --chain-id ",
                vm.envString("CHAIN_ID"),
                " --watch --constructor-args $(cast abi-encode \"constructor(address)\" ",
                ownerAddress,
                ")"
            )
        );
    }
}
