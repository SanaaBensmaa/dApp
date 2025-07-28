import React, { useState, useEffect } from "react";
import Web3 from "web3";
import GestionNombresContract from "./contracts/GestionNombres.json";
import BlockchainInfo from "./components/BlockchainInfo";
import TransactionInfo from "./components/TransactionInfo";
import { Link } from "react-router-dom";

const Exercice6 = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [network, setNetwork] = useState({});
  const [latestBlock, setLatestBlock] = useState({});
  const [txDetails, setTxDetails] = useState(null);

  const [nombre, setNombre] = useState("");
  const [tableau, setTableau] = useState([]);
  const [somme, setSomme] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = new Web3(Web3.givenProvider || "http://localhost:7545");
        setWeb3(web3Instance);

        const accs = await web3Instance.eth.getAccounts();
        setAccounts(accs);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = GestionNombresContract.networks[networkId];

        if (!deployedNetwork) {
          alert("Contrat GestionNombres non déployé sur ce réseau !");
          return;
        }

        const instance = new web3Instance.eth.Contract(
          GestionNombresContract.abi,
          deployedNetwork.address
        );
        setContract(instance);

        const net = await web3Instance.eth.getChainId();
        const block = await web3Instance.eth.getBlock("latest");
        setNetwork({ chainId: net, url: web3Instance.currentProvider.host || "Ganache" });
        setLatestBlock(block);
      } catch (error) {
        console.error("Erreur Web3 :", error);
      }
    };

    init();
  }, []);

  const ajouterNombre = async (e) => {
    e.preventDefault();
    if (!contract || nombre === "") return;

    try {
      const receipt = await contract.methods.ajouterNombre(parseInt(nombre)).send({ from: accounts[0] });

      setTxDetails(receipt);
      setNombre("");
      fetchTableau();

      const latest = await web3.eth.getBlock("latest");
      setLatestBlock(latest);
    } catch (error) {
      console.error("Erreur ajout nombre :", error);
    }
  };

  const fetchTableau = async () => {
    if (!contract) return;
    const result = await contract.methods.afficheTableau().call();
    setTableau(result);
  };

  const calculerSomme = async () => {
    if (!contract) return;
    const total = await contract.methods.calculerSomme().call();
    setSomme(total);
  };

  return (
    <div className="container">
      <h2>Exercice 6 : Tableau de nombres</h2>

      <div className="input-group">
        <input
          type="number"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Entrez un nombre"
        />
        <button onClick={ajouterNombre} className="button">
        Ajouter
        </button>
      </div>

      

      <div className="button-group">
        <button onClick={fetchTableau} className="button">
          Afficher le tableau
        </button>
        <button onClick={calculerSomme} className="button">
          Calculer la somme
        </button>
      </div>

      {tableau.length > 0 && (
        <div className="result">
          <h4>Éléments du tableau :</h4>
          <ul>
            {tableau.map((val, idx) => (
              <li key={idx}>Index {idx} : {val}</li>
            ))}
          </ul>
        </div>
      )}

      {somme !== null && (
        <div className="result">Somme totale : {somme}</div>
      )}

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

export default Exercice6;