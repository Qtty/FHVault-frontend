import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAppContext, Vault } from '../../context/AppContext';
import { toast } from 'bulma-toast';

interface CreateVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateVaultModal: React.FC<CreateVaultModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

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
        toast({
          message: 'Vault Created!',
          type: 'is-success',
          dismissible: true,
          position: 'top-center',
          animate: { in: 'fadeIn', out: 'fadeOut' },
        });
    } catch (error) {
      toast({
        message: 'Error creating vault. Please try again.',
        type: 'is-success',
        dismissible: true,
        position: 'top-center',
        animate: { in: 'fadeIn', out: 'fadeOut' },
      });
        console.error('Error creating vault:', error);
    }
    setIsLoading(false);
  };

  return (
    <div>
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
