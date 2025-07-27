// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract Parite {
    function estPair(int nombre) public pure returns (bool) {
        return nombre % 2 == 0;
    }
}