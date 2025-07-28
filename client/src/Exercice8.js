import React, { useEffect, useState } from "react";
import Web3 from "web3";
import PaymentContract from "./contracts/Payment.json";
import BlockchainInfo from "./components/BlockchainInfo";
import TransactionInfo from "./components/TransactionInfo";
import { Link } from "react-router-dom";

const Exercice8 = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [network, setNetwork] = useState({});
  const [latestBlock, setLatestBlock] = useState({});
  const [txDetails, setTxDetails] = useState(null);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = new Web3(Web3.givenProvider || "http://localhost:7545");
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = PaymentContract.networks[networkId];

        if (!deployedNetwork) {
          alert("Contrat Payment non déployé sur ce réseau !");
          return;
        }

        const instance = new web3Instance.eth.Contract(
          PaymentContract.abi,
          deployedNetwork.address
        );
        setContract(instance);

        const net = await web3Instance.eth.getChainId();
        const block = await web3Instance.eth.getBlock("latest");

        setNetwork({ chainId: net, url: web3Instance.currentProvider.host || "Ganache" });
        setLatestBlock(block);

        const contractBalance = await instance.methods.getBalance().call();
        setBalance(web3Instance.utils.fromWei(contractBalance, "ether"));
      } catch (error) {
        console.error("Erreur d'initialisation :", error);
      }
    };

    init();
  }, []);

  const envoyerPaiement = async (e) => {
    e.preventDefault();
    try {
      const tx = await contract.methods.receivePayment().send({
        from: accounts[0],
        value: web3.utils.toWei(amount, "ether"),
      });

      setTxDetails(tx);

      const newBalance = await contract.methods.getBalance().call();
      setBalance(web3.utils.fromWei(newBalance, "ether"));
    } catch (err) {
      console.error(err);
      alert("Échec de l'envoi");
    }
  };

  const retirerPaiement = async () => {
    try {
      const tx = await contract.methods.withdraw().send({ from: accounts[0] });

      setTxDetails(tx);

      const newBalance = await contract.methods.getBalance().call();
      setBalance(web3.utils.fromWei(newBalance, "ether"));
    } catch (err) {
      console.error(err);
      alert("Retrait échoué");
    }
  };

  return (
    <div className="container">
      <h2>Exercice 8 : Gestion des paiements</h2>

      <form onSubmit={envoyerPaiement}>
        <div className="input-group">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Montant en Ether"
            required
          />
        </div>
        <button type="submit" className="button">Envoyer paiement</button>
      </form>

      <button onClick={retirerPaiement} className="button">Retirer les fonds</button>

      <div className="result">
        Solde du contrat : <strong>{balance} ETH</strong>
      </div>

      <Link to="/" className="back-link">← Retour au sommaire</Link>

      <div className="info-section">
        <div className="block">
          <BlockchainInfo
            network={network}
            contractAddress={contract?.options?.address}
            account={accounts[0]}
            latestBlock={latestBlock}
          />
        </div>

        <div className="transaction">
          <TransactionInfo tx={txDetails} />
        </div>
      </div>
    </div>
  );
};

export default Exercice8;