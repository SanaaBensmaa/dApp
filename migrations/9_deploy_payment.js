const Payment = artifacts.require("Payment");

module.exports = async function (deployer, network, accounts) {
  const recipient = accounts[0]; // L'adresse du destinataire, généralement le premier compte de Ganache
  await deployer.deploy(Payment, recipient);
};