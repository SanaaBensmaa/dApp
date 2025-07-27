// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract GestionNombres {
    uint[] public nombres;

    constructor() {
        // Optionnel : initialisation avec des valeurs
        nombres.push(1);
        nombres.push(2);
        nombres.push(3);
    }

    function ajouterNombre(uint nombre) public {
        nombres.push(nombre);
    }

    function getElement(uint index) public view returns (uint) {
        require(index < nombres.length, "Index invalide");
        return nombres[index];
    }

    function afficheTableau() public view returns (uint[] memory) {
        return nombres;
    }

    function calculerSomme() public view returns (uint) {
        uint somme = 0;
        for (uint i = 0; i < nombres.length; i++) {
            somme += nombres[i];
        }
        return somme;
    }
}