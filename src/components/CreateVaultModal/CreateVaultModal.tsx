import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAppContext, Vault } from '../../context/AppContext';

interface CreateVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateVaultModal: React.FC<CreateVaultModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const { contract, setVaults } = useAppContext();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!contract.instance) {
        setMessage("Initializing error");
        setIsLoading(false);
        return;
    }

    try {
        // Call the contract method to create the item
        const tx = await contract.instance.createVault(title);
        await tx.wait();

        const [vaultIds, vaultNames] = await contract.instance.getVaults();
        
        // Format the vaults combining the ids and names into objects
        const formattedVaults: Vault[] = vaultIds.map((id: any, index: number) => ({
          id: id.toString(), // Convert id to string if necessary
          name: vaultNames[index],
        }));

        setVaults(formattedVaults);
        onClose();
        setShowNotification(true);
        setNotificationMessage('Vault created successfully!');
        // Hide notification after 5 seconds
        setTimeout(() => setShowNotification(false), 5000);
    } catch (error) {
        setMessage('Error creating vault. Please try again.');
        console.error('Error creating vault:', error);
    }
    setIsLoading(false);
  };

  return (
    <div>
        {showNotification && (
            <div className="notification is-success" style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)'}}>
            {notificationMessage}
            </div>
        )}
        <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit}>
            <h2 className="title is-2">Create Vault</h2>
            <div className="field">
            <label className="label">Vault Name</label>
            <div className="control">
                <input
                className="input"
                type="text"
                placeholder="Name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                />
            </div>
            </div>

            {message && <div className={`notification ${message.includes('successfully') ? 'is-success' : 'is-danger'}`}>{message}</div>}
            <div className="field is-grouped">
            <div className="control">
                <button className={`button is-link ${isLoading ? 'is-loading' : ''}`} type="submit" disabled={isLoading}>
                Submit
                </button>
            </div>
            </div>
        </form>
        </Modal>
    </div>
  );
};

export default CreateVaultModal;
