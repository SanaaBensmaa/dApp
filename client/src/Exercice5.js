import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import PariteContract from './contracts/Parite.json';
import BlockchainInfo from './components/BlockchainInfo';
import TransactionInfo from './components/TransactionInfo';
import { Link } from 'react-router-dom';

const Exercice5 = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [network, setNetwork] = useState({});
  const [latestBlock, setLatestBlock] = useState({});
  const [txDetails, setTxDetails] = useState(null);
  const [nombre, setNombre] = useState('');
  const [resultat, setResultat] = useState(null);

  useEffect(() => {
    const init = async () => {
      const web3Instance = new Web3(Web3.givenProvider || 'http://localhost:7545');
      setWeb3(web3Instance);

      const accounts = await web3Instance.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = await web3Instance.eth.net.getId();
      const networkData = PariteContract.networks[networkId];

      if (networkData) {
        const instance = new web3Instance.eth.Contract(PariteContract.abi, networkData.address);
        setContract(instance);

        const net = await web3Instance.eth.getChainId();
        const block = await web3Instance.eth.getBlock('latest');
        setNetwork({ chainId: net, url: web3Instance.currentProvider.host || 'Ganache' });
        setLatestBlock(block);
      } else {
        alert('Contrat non déployé sur ce réseau');
      }
    };

    init();
  }, []);

  const verifierParite = async (e) => {
    e.preventDefault();
    if (!contract || nombre === '') return;

    try {
      const estPair = await contract.methods.estPair(parseInt(nombre)).call({ from: account });
      setResultat(estPair ? 'Pair' : 'Impair');

      const latest = await web3.eth.getBlock('latest');
      setLatestBlock(latest);

      setTxDetails({
        from: account,
        to: contract._address,
        type: 'call',
        input: nombre,
        result: estPair ? 'Pair' : 'Impair',
      });
    } catch (err) {
      console.error('Erreur dans verifierParite :', err);
      alert('Erreur pendant l’exécution');
    }
  };

  return (
    <div className="container">
      <h2>Exercice 5 : Vérification de la parité</h2>

      <form onSubmit={verifierParite}>
        <div className="input-group">
          <input
            type="number"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Entrez un nombre"
            required
          />
        </div>

        <button type="submit" className="button">Vérifier la parité</button>
      </form>

      {resultat !== null && (
        <div className="result">Résultat : Le nombre est <strong>{resultat}</strong></div>
      )}

      <Link to="/" className="back-link">← Retour au sommaire</Link>

      {/* 🔽 Bloc infos blockchain + transaction */}
      <div className="info-section">
        <div className="block">
          <h4>Informations Blockchain</h4>
          {contract ? (
            <BlockchainInfo
              network={network}
              contractAddress={contract._address}
              account={account}
              latestBlock={latestBlock}
            />
          ) : (
            <p>Chargement des infos blockchain...</p>
          )}
        </div>

        <div className="transaction">
          <h4>Détails de la dernière transaction</h4>
          {txDetails ? (
            <TransactionInfo tx={txDetails} />
          ) : (
            <p>Aucune transaction encore effectuée.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exercice5;