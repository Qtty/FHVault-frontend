import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal'; // Adjust the import path as necessary
import { useAppContext, Item } from '../../context/AppContext'; // Adjust import path as necessary
import { decryptPassword, encryptPassword } from '../common/Utils';
import { getSignature } from '../../fhevmjs';
import "./ItemInfoModal.css";
import { toast } from 'bulma-toast';

interface ItemInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: number;
}

const ItemInfoModal: React.FC<ItemInfoModalProps> = ({ isOpen, onClose, itemId }) => {
  const { contract, userAddress, vaults } = useAppContext();
  const [plainPassword, setPlainPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [item, setItem] = useState<Item>({title: '', description: '', vault: 0, password: ''});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchItemData = async () => {
      if (!contract.instance || !itemId) {
        console.error('Contract instance not available or itemId not specified');
        return;
      }
      setIsLoading(true);
      try {
        // Assuming your contract has a method getItemDetails that accepts an item ID
        const itemDetails = await contract.instance.getItem(itemId);
        setItem({
          title: itemDetails.title,
          description: itemDetails.description,
          vault: itemDetails.vault,
          password: ''
        });
      } catch (error) {
        console.error('Failed to fetch item details:', error);
        // Optionally, handle error
      }
      setIsLoading(false);
    };

    if (isOpen) {
        fetchItemData();
      }
    }, [isOpen, itemId]);

  const handleShowPassword = async () => {
    if (!contract.instance || !item) {
      console.error('Contract instance not available or item not specified');
      return;
    }
    setIsLoading(true);
    try {
      let signature = await getSignature(contract.address, userAddress);
      // Assuming your contract has a method getPassword that accepts an item ID
      const encrypted_password = await contract.instance.getPlainPassword(itemId, signature?.publicKey, signature?.signature);
      console.log('decrypted password: ' +  decryptPassword(encrypted_password, contract.address))
      setPlainPassword(decryptPassword(encrypted_password, contract.address));
    } catch (error) {
      console.error('Failed to retrieve password:', error);
      // Optionally, handle error (e.g., update UI to show an error message)
    }
    setIsLoading(false);
  };

  const handleEditChange = (e) => {
    // Update editableItem state when the user types in the form inputs
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmitChanges = async () => {
    setIsEditing(false);
    setIsLoading(true);
    try {
      // Call your smart contract method to update all the details at once
      const tx = await contract.instance.setItem(itemId, item.title, item.description, item.vault, encryptPassword(item.password));
      await tx.wait();
      // After updating, refresh your item details and close the modal or indicate success
      toast({
        message: 'Item Updated Succesfully',
        type: 'is-success',
        dismissible: true,
        position: 'top-center',
        animate: { in: 'fadeIn', out: 'fadeOut' },
      });
      onClose();
    } catch (error) {
      console.error('Failed to update item:', error);
      // Optionally, handle error
    }
    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="content">
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Title"
              name="title"
              value={item.title}
              onChange={handleEditChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Description</label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Description"
              name="description"
              value={item.description}
              onChange={handleEditChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="field">
            <label className="label">Vault</label>
            <div className="control">
                {isEditing ? (
                <div className="select">
                    <select value={item.vault} onChange={handleEditChange}>
                    <option value="">Select Vault</option>
                    {vaults.map((vaultItem) => (
                        <option key={vaultItem.id} value={vaultItem.id}>
                        {vaultItem.name}
                        </option>
                    ))}
                    </select>
                </div>
                ) : (
                    <div className="input is-static" style={{backgroundColor: '#e4e4e4', color: '#7a7a7a'}}>
                    {vaults.find(vaultItem => vaultItem.id === item.vault)?.name || "No Vault Selected"}
                  </div>
                )}
            </div>
        </div>

        <div className="field">
        <label className="label">Password</label>
        <div className="control">
            <input
            className="input"
            type={isEditing || plainPassword ? "text" : "password"}
            placeholder="Password"
            name="password"
            value={isEditing ? item.password : (plainPassword || "**********")}
            onChange={handleEditChange}
            disabled={!isEditing}
            />
        </div>
        </div>


        <button className={`button custom-button is-info ${isLoading ? 'is-loading' : ''}`} onClick={() => setIsEditing(true)}>
            Edit Item
        </button>

        <button className={`button custom-button is-info ${isLoading ? 'is-loading' : ''}`} onClick={handleShowPassword} disabled={isLoading}>
          Show Password
        </button>

        {isEditing && (
          <button className={`button custom-button is-primary ${isLoading ? 'is-loading' : ''}`} onClick={handleSubmitChanges} disabled={isLoading}>
            Save Changes
          </button>
        )}
      </div>
    </Modal>
  );

};

export default ItemInfoModal;
