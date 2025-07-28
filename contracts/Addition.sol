// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract Addition {
    uint public a = 5;
    uint public b = 7;

    function addition1() public view returns (uint) {
        return a + b;
    }

    function addition2(uint x, uint y) public pure returns (uint) {
        return x + y;
    }
}