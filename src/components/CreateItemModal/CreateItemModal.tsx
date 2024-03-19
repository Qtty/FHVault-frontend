import React, { useState } from 'react';
import Modal from '../common/Modal'; // Adjust the import path as necessary
import { useAppContext } from '../../context/AppContext';
import { generateSecurePassword, encryptPassword } from "../common/Utils";
import { toast } from 'bulma-toast';

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateItemModal: React.FC<CreateItemModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [vault, setVault] = useState(0);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { contract, setCurrentVault, currentVault, vaults } = useAppContext();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!contract.instance) {
        setMessage("Initializing error");
        setIsLoading(false);
        return;
    }

    let final_password = password;
    if (final_password == "") {
        final_password = generateSecurePassword();
    }

    try {
        // Call the contract method to create the item
        const tx = await contract.instance.createItem(title, description, vault, encryptPassword(final_password));
        await tx.wait();

        setCurrentVault(currentVault); // To force an update of the items list in case the item belongs to the current vault
        onClose();
        toast({
            message: 'Item Created Succesfully!',
            type: 'is-success',
            dismissible: true,
            position: 'top-center',
            animate: { in: 'fadeIn', out: 'fadeOut' },
          });
    } catch (error) {
        toast({
            message: 'Error creating item. Please try again.',
            type: 'is-danger',
            dismissible: true,
            position: 'top-center',
            animate: { in: 'fadeIn', out: 'fadeOut' },
        });
        console.error('Error creating item:', error);
    }
    setIsLoading(false);
  };

  return (
        <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit}>
            <h2 className="title is-2">Create Item</h2>
            <div className="field">
            <label className="label">Title</label>
            <div className="control">
                <input
                className="input"
                type="text"
                placeholder="Item Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                />
            </div>
            </div>
            <div className="field">
            <label className="label">Description</label>
            <div className="control">
                <textarea
                className="textarea"
                placeholder="Item Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            </div>
            <div className="field">
            <label className="label">Vault</label>
            <div className="control">
                <div className="select">
                <select value={vault} onChange={(e) => setVault(Number(e.target.value) || 0)}>
                    <option value="">Select Vault</option>
                    {vaults.map((vaultItem) => (
                    <option key={vaultItem.id} value={vaultItem.id}>
                        {vaultItem.name}
                    </option>
                    ))}
                </select>
                </div>
            </div>
            </div>
            <div className="field">
            <label className="label">Password</label>
            <div className="control">
                <input
                className="input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
  );
};

export default CreateItemModal;
