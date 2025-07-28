import React, { useEffect, useState } from "react";
import Web3 from "web3";
import ConversionContract from "./contracts/Conversion.json";
import BlockchainInfo from "./components/BlockchainInfo";
import TransactionInfo from "./components/TransactionInfo";
import { Link } from "react-router-dom";
// import "./index.css";

const Exercice2 = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [network, setNetwork] = useState({});
  const [latestBlock, setLatestBlock] = useState({});
  const [txDetails, setTxDetails] = useState(null);

  const [ether, setEther] = useState("");
  const [wei, setWei] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = new Web3(Web3.givenProvider || "http://localhost:7545");
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = ConversionContract.networks[networkId];

        if (!deployedNetwork) {
          alert("Contrat Conversion non déployé sur ce réseau !");
          return;
        }

        const instance = new web3Instance.eth.Contract(
          ConversionContract.abi,
          deployedNetwork.address
        );
        setContract(instance);

        const net = await web3Instance.eth.getChainId();
        const block = await web3Instance.eth.getBlock("latest");
        setNetwork({ chainId: net, url: web3Instance.currentProvider.host || "Ganache" });
        setLatestBlock(block);
      } catch (error) {
        console.error("Erreur d'initialisation Web3 :", error);
      }
    };

    init();
  }, []);

  const handleEtherToWei = async () => {
    if (!contract || ether === "") return;
    try {
      const res = await contract.methods.etherEnWei(ether).call();
      setResult(`${ether} ETH = ${res} WEI`);

      const block = await web3.eth.getBlock("latest");
      setLatestBlock(block);

      setTxDetails({
        hash: "SimulationCall-no-tx",
        from: accounts[0],
        to: contract.options.address,
        value: ether,
        type: "ETH → WEI",
      });
    } catch (err) {
      console.error("Erreur Ether -> Wei :", err);
    }
  };

  const handleWeiToEther = async () => {
    if (!contract || wei === "") return;
    try {
      const res = await contract.methods.weiEnEther(wei).call();
      setResult(`${wei} WEI = ${res} ETH`);

      const block = await web3.eth.getBlock("latest");
      setLatestBlock(block);

      setTxDetails({
        hash: "SimulationCall-no-tx",
        from: accounts[0],
        to: contract.options.address,
        value: wei,
        type: "WEI → ETH",
      });
    } catch (err) {
      console.error("Erreur Wei -> Ether :", err);
    }
  };

  return (
    <div className="container">
      <h2>Exercice 2 : Conversion ETH ⇄ WEI</h2>

      <div className="input-group">
        <input
          type="number"
          value={ether}
          onChange={(e) => setEther(e.target.value)}
          placeholder="Entrez un montant en Ether"
        />
        <button onClick={handleEtherToWei} className="button">
          Convertir en Wei
        </button>
      </div>

      <div className="input-group">
        <input
          type="number"
          value={wei}
          onChange={(e) => setWei(e.target.value)}
          placeholder="Entrez un montant en Wei"
        />
        <button onClick={handleWeiToEther} className="button">
          Convertir en Ether
        </button>
      </div>

      {result && <div className="result">Résultat : {result}</div>}

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

export default Exercice2;