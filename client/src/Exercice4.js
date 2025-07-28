import React, { useState, useEffect } from "react";
import Web3 from "web3";
import EstPositif from "./contracts/EstPositif.json";
import BlockchainInfo from "./components/BlockchainInfo";
import TransactionInfo from "./components/TransactionInfo";
import { Link } from "react-router-dom";

const Exercice4 = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState(null);
  const [network, setNetwork] = useState({});
  const [latestBlock, setLatestBlock] = useState({});
  const [txDetails, setTxDetails] = useState({});

  useEffect(() => {
    const init = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      setWeb3(web3);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EstPositif.networks[networkId];

      if (!deployedNetwork) {
        alert("Contrat EstPositif non déployé !");
        return;
      }

      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const instance = new web3.eth.Contract(
        EstPositif.abi,
        deployedNetwork.address
      );
      setContract(instance);

      const net = await web3.eth.getChainId();
      const providerUrl = web3.currentProvider.host || "Ganache Local";
      setNetwork({ chainId: net, url: providerUrl });

      const block = await web3.eth.getBlock("latest");
      setLatestBlock(block);
    };

    init();
  }, []);

  const checkPositif = async () => {
    try {
      const res = await contract.methods.estPositif(inputValue).call();
      setResult(res ? "Positif" : "Négatif");
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  return (
    <div className="container">
      <h2>Exercice 4 : Vérification de positivité</h2>

      <div className="input-group">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Entrez un nombre"
        />
        <button onClick={checkPositif} className="button">
          Vérifier
        </button>
        <div className="result">Résultat : {result}</div>

        
      </div>

      <Link to="/" className="back-link">
        ← Retour au sommaire
      </Link>

      {/* 🔽 Infos blockchain + transaction */}
      <div className="info-section">
        <div className="block">
          <h4>Informations Blockchain</h4>
          <BlockchainInfo
            network={network}
            contractAddress={contract?.options.address}
            account={account}
            latestBlock={latestBlock}
          />
        </div>

        <div className="transaction">
          <h4>Détails de la dernière transaction</h4>
          <TransactionInfo txDetails={txDetails} />
        </div>
      </div>
    </div>
  );
};

export default Exercice4;