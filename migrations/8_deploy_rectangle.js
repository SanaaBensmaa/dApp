const Rectangle = artifacts.require("Rectangle");

module.exports = function (deployer) {
  // Déploiement avec les paramètres : x = 0, y = 0, longueur = 10, largeur = 5
  deployer.deploy(Rectangle, 0, 0, 10, 5);
};