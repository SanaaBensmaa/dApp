const EstPositif = artifacts.require("EstPositif");

module.exports = function (deployer) {
  deployer.deploy(EstPositif);
};