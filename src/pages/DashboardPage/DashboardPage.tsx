import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import ItemList from '../../components/ItemList/ItemList';
import { useAppContext } from '../../context/AppContext'; // Adjust import path as necessary
import './DashboardPage.css'; // Ensure you have this CSS for styling
import CreateItemModal from '../../components/CreateItemModal/CreateItemModal';
import CreateVaultModal from '../../components/CreateVaultModal/CreateVaultModal';

const DashboardPage: React.FC = () => {
  const { contract } = useAppContext();
  const [isCreateItemModalOpen, setCreateItemModalOpen] = useState(false);
  const [isCreateVaultModalOpen, setCreateVaultModalOpen] = useState(false);

  useEffect(() => {
    // Placeholder for any setup effect, e.g., fetching vault items if selectedVault changes
  }, [contract]);

  return (
    <div className="dashboardLayout">
        <div className="topBar">
            <button onClick={() => setCreateItemModalOpen(true)}>Create Item</button>
            <button onClick={() => setCreateVaultModalOpen(true)}>Create Vault</button>
        </div>
        <div className="contentArea">
            <Sidebar />
            <ItemList /> 
        </div>
        <CreateItemModal
            isOpen={isCreateItemModalOpen}
            onClose={() => setCreateItemModalOpen(false)}
         />
        <CreateVaultModal
           isOpen={isCreateVaultModalOpen}
           onClose={() => setCreateVaultModalOpen(false)}
        />
    </div>
  );
};

export default DashboardPage;
