// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {ColorSnap} from "../src/Colorsnap.sol";

contract ColorSnapScript is Script {
    ColorSnap public colorsnap;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address owner = vm.addr(deployerPrivateKey);
        
        console.log("Deploying ColorSnap contract with owner:", owner);
        
        vm.startBroadcast(deployerPrivateKey);

        colorsnap = new ColorSnap(owner);
        
        console.log("ColorSnap deployed to:", address(colorsnap));

        vm.stopBroadcast();
    }
}
