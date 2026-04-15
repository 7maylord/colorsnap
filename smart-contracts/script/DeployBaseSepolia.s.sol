// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {ColorSnap} from "../src/Colorsnap.sol";

contract DeployBaseSepoliaScript is Script {
    ColorSnap public colorsnap;

    function setUp() public {}

    function run() public {
        // Get deployment parameters from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        address owner = vm.addr(deployerPrivateKey);

        console2.log("=== BASE SEPOLIA DEPLOYMENT CONFIGURATION ===");
        console2.log("Owner address:", owner);
        console2.log("Chain ID: 84532");
        console2.log("RPC URL: https://sepolia.base.org");
        console2.log("==============================================");

        console2.log("Deploying ColorSnap contract to Base Sepolia...");

        vm.startBroadcast(deployerPrivateKey);

        colorsnap = new ColorSnap(owner);

        console2.log("SUCCESS: ColorSnap deployed to:", address(colorsnap));

        vm.stopBroadcast();
    }
}
