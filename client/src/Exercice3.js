import React, { useEffect, useState } from "react";
import Web3 from "web3";
import GestionChaines from "./contracts/GestionChaines.json";
import BlockchainInfo from "./components/BlockchainInfo";
import TransactionInfo from "./components/TransactionInfo";
import { Link } from "react-router-dom";

const Exercice3 = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [network, setNetwork] = useState({});
  const [latestBlock, setLatestBlock] = useState({});
  const [txDetails, setTxDetails] = useState(null);

  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [chaineA, setChaineA] = useState("");
  const [chaineB, setChaineB] = useState("");
  const [concatResult, setConcatResult] = useState("");
  const [lengthInput, setLengthInput] = useState("");
  const [lengthResult, setLengthResult] = useState(null);
  const [compareA, setCompareA] = useState("");
  const [compareB, setCompareB] = useState("");
  const [compareResult, setCompareResult] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = new Web3(Web3.givenProvider || "http://localhost:7545");
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = GestionChaines.networks[networkId];

        if (!deployedNetwork) {
          alert("Contrat GestionChaines non déployé sur ce réseau !");
          return;
        }

        const instance = new web3Instance.eth.Contract(
          GestionChaines.abi,
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

  const refreshBlockAndTx = async (txHash = null) => {
    const latest = await web3.eth.getBlock("latest");
    setLatestBlock(latest);

    if (txHash && txHash !== "call") {
      const tx = await web3.eth.getTransaction(txHash);
      setTxDetails(tx);
    } else {
      setTxDetails({
        hash: txHash || "SimulationCall-no-tx",
        from: accounts[0],
        to: contract?.options?.address,
      });
    }
  };

  const handleSetMessage = async () => {
    const tx = await contract.methods.setMessage(newMessage).send({ from: accounts[0] });
    await refreshBlockAndTx(tx.transactionHash);
  };

  const handleGetMessage = async () => {
    const result = await contract.methods.getMessage().call();
    setMessage(result);
    await refreshBlockAndTx("call");
  };

  const handleConcat = async () => {
    const result = await contract.methods.concatener(chaineA, chaineB).call();
    setConcatResult(result);
    await refreshBlockAndTx("call");
  };

  const handleLength = async () => {
    const result = await contract.methods.longueur(lengthInput).call();
    setLengthResult(result);
    await refreshBlockAndTx("call");
  };

  const handleCompare = async () => {
    const result = await contract.methods.comparer(compareA, compareB).call();
    setCompareResult(result);
    await refreshBlockAndTx("call");
  };

  return (
    <div className="container">
      <h2>Exercice 3 : Gestion des chaînes</h2>

      <div className="input-group">
        <input
          type="text"
          placeholder="Nouveau message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSetMessage} className="button">Modifier le message</button>
      </div>

      <div className="input-group">
        <button onClick={handleGetMessage} className="button">Afficher message</button>
        <div className="result">Message : {message}</div>
      </div>

      <div className="input-group">
        <input
          type="text"
          placeholder="Chaîne A"
          value={chaineA}
          onChange={(e) => setChaineA(e.target.value)}
        />
        <input
          type="text"
          placeholder="Chaîne B"
          value={chaineB}
          onChange={(e) => setChaineB(e.target.value)}
        />
        <button onClick={handleConcat} className="button">Concaténer</button>
        <div className="result">Résultat : {concatResult}</div>
      </div>

      <div className="input-group">
        <input
          type="text"
          placeholder="Chaîne à mesurer"
          value={lengthInput}
          onChange={(e) => setLengthInput(e.target.value)}
        />
        <button onClick={handleLength} className="button">Longueur</button>
        <div className="result">Résultat : {lengthResult}</div>
      </div>

      <div className="input-group">
        <input
          type="text"
          placeholder="Chaîne A"
          value={compareA}
          onChange={(e) => setCompareA(e.target.value)}
        />
        <input
          type="text"
          placeholder="Chaîne B"
          value={compareB}
          onChange={(e) => setCompareB(e.target.value)}
        />
        <button onClick={handleCompare} className="button">Comparer</button>
        <div className="result">
          Résultat :{" "}
          {compareResult === null ? "" : compareResult ? "Identiques" : "Différentes"}
        </div>
      </div>

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

export default Exercice3;