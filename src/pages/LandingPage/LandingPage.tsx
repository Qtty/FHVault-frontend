import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import './LandingPage.css'; // Ensure you have this CSS file for styling
import { useAppContext, Vault } from '../../context/AppContext';

const LandingPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [hasInstance, setHasInstance] = useState(false);
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

      try {
        // Create an instance of ethers provider
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // Request account access if necessary
        const signer = await provider.getSigner();
        const signer_address = await signer.address;
        setUserAddress(signer_address);

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
  }, [contract]);

  const handleCreateInstance = async () => {
    // Assume `createPasswordManagerInstance` is your method to create a new instance
    setLoading(true);
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
      {!loading && !hasInstance && (
        <div>
          <p>You do not have a Password Manager instance.</p>
          <button onClick={handleCreateInstance}>Create Instance</button>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
