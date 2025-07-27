const GestionNombres = artifacts.require("GestionNombres");

module.exports = function (deployer) {
  deployer.deploy(GestionNombres);
};