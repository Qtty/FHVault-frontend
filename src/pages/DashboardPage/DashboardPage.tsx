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
        <Sidebar />
        <div className='mainContent'>
            <div className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-menu">
                    <div className="navbar-end">
                    <div className="navbar-item">
                        <button className="button is-primary mr-3" onClick={() => setCreateVaultModalOpen(true)}>Create Vault</button> {/* Example create button */}
                        <button className="button is-link" onClick={() => setCreateItemModalOpen(true)}>Create Item</button> {/* Additional example create button */}
                    </div>
                    </div>
                </div>
            </div>
            <div className="contentArea">
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
    </div>

  );
};

export default DashboardPage;
