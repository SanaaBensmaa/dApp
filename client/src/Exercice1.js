import React, { useEffect, useState } from "react";
import Web3 from "web3";
import AdditionContract from "./contracts/Addition.json";
import BlockchainInfo from "./components/BlockchainInfo";
import TransactionInfo from "./components/TransactionInfo";
import { Link } from "react-router-dom";
//import "./index.css";

const Addition = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [network, setNetwork] = useState({});
  const [latestBlock, setLatestBlock] = useState({});
  const [txDetails, setTxDetails] = useState(null);

  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = new Web3(Web3.givenProvider || "http://localhost:7545");
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = AdditionContract.networks[networkId];

        if (!deployedNetwork) {
          alert("Contrat Addition non déployé sur ce réseau !");
          return;
        }

        const instance = new web3Instance.eth.Contract(
          AdditionContract.abi,
          deployedNetwork.address
        );
        setContract(instance);

        const net = await web3Instance.eth.getChainId();
        const block = await web3Instance.eth.getBlock("latest");
        setNetwork({ chainId: net, url: web3Instance.currentProvider.host || "Ganache" });
        setLatestBlock(block);
      } catch (error) {
        console.error("Erreur de connexion Web3 ou contrat :", error);
      }
    };

    init();
  }, []);

  const handleAdd = async () => {
    if (!contract) {
      alert("Contrat non chargé !");
      return;
    }

    try {
      const res = await contract.methods.addition2(parseInt(a), parseInt(b)).call();
      setResult(res);

      const latest = await web3.eth.getBlock("latest");
      setLatestBlock(latest);

      // Simuler une transaction pour afficher un hash factice
      const simulatedTx = {
        hash: "SimulationCall-no-tx", // Juste pour l'affichage car `.call()` ne produit pas de vraie transaction
        from: accounts[0],
        to: contract.options.address,
        value: 0,
      };
      setTxDetails(simulatedTx);
    } catch (error) {
      console.error("Erreur lors de l'appel à addition2 :", error);
    }
  };

  return (
    <div className="container">
  <h2>Exercice 1 : Addition</h2>

  <div className="input-group">
    <input
      type="number"
      value={a}
      onChange={(e) => setA(e.target.value)}
      placeholder="Entrez a"
    />
  </div>

  <div className="input-group">
    <input
      type="number"
      value={b}
      onChange={(e) => setB(e.target.value)}
      placeholder="Entrez b"
    />
  </div>

  <button onClick={handleAdd} className="button">
    Additionner
  </button>

  {result !== null && (
    <div className="result">Résultat : {result}</div>
  )}
<div>
<Link to="/" className="back-link">← Retour au sommaire</Link>
</div>
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

export default Addition;