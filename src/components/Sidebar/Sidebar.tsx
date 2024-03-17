import React, { useEffect } from 'react';
import { useAppContext, Vault } from '../../context/AppContext'; // Adjust the import path as necessary
import './Sidebar.css'; // Ensure you have this CSS for styling
import fhvault from '../../../public/fhvault.png';
import { useNavigate } from 'react-router-dom';


const Sidebar: React.FC = () => {
  const { contract, setVaults, vaults, setCurrentVault } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVaults = async () => {
      if (!contract.instance) {
        console.error('Contract instance is not available');
        navigate('/');
        return;
      }
      try {
        // Assuming getVaults is a contract method that returns an array of vaults
        const [vaultIds, vaultNames] = await contract.instance.getVaults();
        
        // Format the vaults combining the ids and names into objects
        const formattedVaults: Vault[] = vaultIds.map((id: any, index: number) => ({
          id: id, // Convert id to string if necessary
          name: vaultNames[index],
        }));

        setVaults(formattedVaults);
        //setVaults(formattedVaults);
      } catch (error) {
        console.error('Failed to fetch vaults:', error);
      }
    };

    fetchVaults();
  }, [vaults]); // Dependency array to ensure effect runs when the contract instance is available or changes

  return (
    <div className="sidebar">
      <h1 className="sidebar-title">FhVault</h1>
      <ul>
      {vaults.map((vault) => (
        <li key={vault.id} onClick={() => setCurrentVault(vault)}>
          <img src={fhvault} alt="Logo" className="vault-logo" />
          {vault.name}
        </li>
      ))}

      </ul>
    </div>
  );
};

export default Sidebar;
