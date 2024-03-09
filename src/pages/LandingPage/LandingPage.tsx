import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import './LandingPage.css'; // Ensure you have this CSS file for styling
import { useAppContext, Vault } from '../../context/AppContext';

const LandingPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { contract, setContract, setVaults, setUserAddress } = useAppContext();
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
        // Instantiate the contract
        const contractInstance = new ethers.Contract(contract.address, contract.abi, signer);
        setContract({ ...contract, instance: contractInstance });

        // Call the getVaults method from your contract
        const [vaultIds, vaultNames] = await contractInstance.getVaults();
        
        // Format the vaults combining the ids and names into objects
        const formattedVaults: Vault[] = vaultIds.map((id: any, index: number) => ({
          id: id.toString(), // Convert id to string if necessary
          name: vaultNames[index],
        }));

        setVaults(formattedVaults);

        // After successfully fetching vaults, navigate to the dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('An error occurred:', error);
        setLoading(false);
      }
    };

    init();
  }, []);

  // Loading and error feedback
  return (
    <div className="landingPage">
      {loading ? 'Loading, please wait...' : 'MetaMask not detected. Please install MetaMask to use this application.'}
    </div>
  );
};

export default LandingPage;
