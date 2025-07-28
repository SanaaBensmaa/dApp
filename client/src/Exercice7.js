import React, { useEffect, useState } from "react";
import Web3 from "web3";
import RectangleContract from "./contracts/Rectangle.json";
import BlockchainInfo from "./components/BlockchainInfo";
import TransactionInfo from "./components/TransactionInfo";
import { Link } from "react-router-dom";

const Exercice7 = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState({});
  const [latestBlock, setLatestBlock] = useState({});
  const [txDetails, setTxDetails] = useState(null);

  const [coords, setCoords] = useState("");
  const [infos, setInfos] = useState("");
  const [surface, setSurface] = useState("");
  const [dimensions, setDimensions] = useState("");

  const [dx, setDx] = useState("");
  const [dy, setDy] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = new Web3(Web3.givenProvider || "http://localhost:7545");
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = RectangleContract.networks[networkId];

        if (!deployedNetwork) {
          alert("Le contrat Rectangle n’est pas déployé sur ce réseau.");
          return;
        }

        const instance = new web3Instance.eth.Contract(
          RectangleContract.abi,
          deployedNetwork.address
        );
        setContract(instance);

        const chainId = await web3Instance.eth.getChainId();
        const block = await web3Instance.eth.getBlock("latest");
        setNetwork({ chainId, url: web3Instance.currentProvider.host || "Ganache" });
        setLatestBlock(block);
      } catch (error) {
        console.error("Erreur lors de l'initialisation :", error);
      }
    };

    init();
  }, []);

  const getCoords = async () => {
    const x = await contract.methods.x().call();
    const y = await contract.methods.y().call();
    setCoords(`X = ${x}, Y = ${y}`);
  };

  const getInfos = async () => {
    const info = await contract.methods.afficheInfos().call();
    setInfos(info);
  };

  const getSurface = async () => {
    const s = await contract.methods.surface().call();
    setSurface(s);
  };

  const getDimensions = async () => {
    const d = await contract.methods.afficheLoLa().call();
    setDimensions(`Longueur = ${d[0]}, Largeur = ${d[1]}`);
  };

  const deplacer = async (e) => {
    e.preventDefault();
    try {
      const tx = await contract.methods.deplacerForme(dx, dy).send({ from: account });
      setTxDetails(tx);
      await getCoords();
      const block = await web3.eth.getBlock("latest");
      setLatestBlock(block);
    } catch (error) {
      console.error("Erreur lors du déplacement :", error);
      alert("Erreur lors du déplacement.");
    }
  };

  return (
    <div className="container">
      <h2>Exercice 7 : Programmation Orientée Objet avec Solidity</h2>

      <div className="button-group">
        <button onClick={getCoords} className="button">Afficher les coordonnées</button>
        {coords && <div className="result">Coordonnées : {coords}</div>}

        <button onClick={getInfos} className="button">Afficher les infos</button>
        {infos && <div className="result">Infos : {infos}</div>}

        <button onClick={getDimensions} className="button">Afficher Longueur & Largeur</button>
        {dimensions && <div className="result">Dimensions : {dimensions}</div>}

        <button onClick={getSurface} className="button">Calculer la surface</button>
        {surface && <div className="result">Surface : {surface}</div>}
      </div>

      <form onSubmit={deplacer} className="form">
        <h4>Déplacer la forme :</h4>
        <div className="input-group">
        <input
          type="number"
          placeholder="dx"
          value={dx}
          onChange={(e) => setDx(e.target.value)}
          required
        />
        </div>
        <div className="input-group">
        <input
          type="number"
          placeholder="dy"
          value={dy}
          onChange={(e) => setDy(e.target.value)}
          required
        />
        </div>
        <button type="submit" className="button">Déplacer</button>
      </form>

      <Link to="/" className="back-link">← Retour au sommaire</Link>

      <div className="info-section">
        <div className="block">
          <BlockchainInfo
            network={network}
            contractAddress={contract?.options?.address}
            account={account}
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

export default Exercice7;