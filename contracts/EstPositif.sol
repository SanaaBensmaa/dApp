// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract EstPositif {
    function estPositif(int x) public pure returns (bool) {
        return x >= 0;
    }
}