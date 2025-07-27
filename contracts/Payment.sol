// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract Payment {
    address public recipient;

    constructor(address _recipient) {
        recipient = _recipient;
    }

    function receivePayment() public payable {
        require(msg.value > 0, "Le montant doit etre superieur a 0");
        // Les fonds sont stockés dans le contrat
    }

    function withdraw() public {
        require(msg.sender == recipient, "Seul le destinataire peut retirer les fonds");
        payable(recipient).transfer(address(this).balance);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}