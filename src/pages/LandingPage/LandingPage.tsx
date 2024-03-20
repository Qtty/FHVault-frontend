import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import './LandingPage.css'; // Ensure you have this CSS file for styling
import { useAppContext, Vault } from '../../context/AppContext';

const AUTHORIZED_CHAIN_ID = ['0x1f49', '0x1f4a', '0x1f4b', '0x2328'];

const LandingPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [hasInstance, setHasInstance] = useState(false);
  const [isValidNetwork, setIsValidNetwork] = useState(false);
  const { contract, setContract, setVaults, setUserAddress, factoryContract, setFactoryContract } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      // Check for Ethereum provider (e.g., MetaMask)
      if (!window.ethereum) {
        alert('Error: MetaMask is not installed. Please install MetaMask to use this application.');
        setLoading(false);
        return;
      }

      const isValidNetwork = await hasValidNetwork();
      if (!isValidNetwork) {
        setLoading(false);
        return;
      }
      setIsValidNetwork(true);
      try {
        // Create an instance of ethers provider
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // Request account access if necessary
        const signer = await provider.getSigner();
        const signer_address = await signer.address;
        setUserAddress(signer_address);

        if (!factoryContract.address) {
          alert("factoryContract not instanciated, failing");
          setLoading(false);
          return;
        }
        const factoryContractInstance = new ethers.Contract(factoryContract.address, factoryContract.abi, signer);
        // Assume `checkForInstance` is the method to check if a user has a password manager instance
        const contractAddress = await factoryContractInstance.hasPasswordManager();
        console.log('has instance: ' + contractAddress);
        const userHasInstance = (contractAddress != "0x0000000000000000000000000000000000000000");
        setHasInstance(userHasInstance);
        setFactoryContract({...factoryContract, instance: factoryContractInstance});

        if (userHasInstance) {
          const contractInstance = new ethers.Contract(contractAddress, contract.abi, signer);
          setContract({ ...contract, address: contractAddress, instance: contractInstance });

          // Call the getVaults method from your contract
          const [vaultIds, vaultNames] = await contractInstance.getVaults();
          
          // Format the vaults combining the ids and names into objects
          const formattedVaults: Vault[] = vaultIds.map((id: any, index: number) => ({
            id: id.toString(), // Convert id to string if necessary
            name: vaultNames[index],
          }));

          setVaults(formattedVaults);
          navigate('/dashboard');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('An error occurred:', error);
        setLoading(false);
      }
    };

    init();
  }, [contract, isValidNetwork]);

  const hasValidNetwork = async (): Promise<boolean> => {
    const currentChainId: string = await window.ethereum.request({ method: 'eth_chainId' });
    return AUTHORIZED_CHAIN_ID.includes(currentChainId.toLowerCase());
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AUTHORIZED_CHAIN_ID[0] }],
      });
    } catch (e) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: AUTHORIZED_CHAIN_ID[0],
            rpcUrls: ['https://devnet.zama.ai/'],
            chainName: 'Zama Devnet',
            nativeCurrency: {
              name: 'ZAMA',
              symbol: 'ZAMA',
              decimals: 18,
            },
            blockExplorerUrls: ['https://main.explorer.zama.ai'],
          },
        ],
      });
    }

    if (await hasValidNetwork()) {
      setIsValidNetwork(true);
    } else {
      setIsValidNetwork(false);
    }
  };

  const handleCreateInstance = async () => {
    // Assume `createPasswordManagerInstance` is your method to create a new instance
    setLoading(true);
    if (!factoryContract.instance) {
      alert("Initializing error");
      setLoading(false);
      return;
    }
    try {
      const tx = await factoryContract.instance.createPasswordManager();
      await tx.wait(); // Wait for the transaction to be mined
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create a new instance:', error);
      setLoading(false);
    }
  };

  return (
    <div className="landingPage">
      {loading && 'Loading, please wait...'}
      {!loading && !hasInstance && isValidNetwork && (
        <div>
          <p>You do not have a Password Manager instance.</p>
          <button onClick={handleCreateInstance}>Create Instance</button>
        </div>
      )}
      {!loading && !isValidNetwork && (
        <div>
          <p>You're not on the correct network</p>
          <p>
            <button className="Connect__button" onClick={switchNetwork}>
              Switch to Zama Devnet
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
