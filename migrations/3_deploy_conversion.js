const Conversion = artifacts.require("Conversion");

module.exports = function (deployer) {
  deployer.deploy(Conversion);
};