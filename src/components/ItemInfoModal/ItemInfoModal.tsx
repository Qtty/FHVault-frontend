import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal'; // Adjust the import path as necessary
import { useAppContext, Item } from '../../context/AppContext'; // Adjust import path as necessary
import { decryptPassword } from '../common/Utils';
import { getSignature } from '../../fhevmjs';

interface ItemInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: number;
}

const ItemInfoModal: React.FC<ItemInfoModalProps> = ({ isOpen, onClose, itemId }) => {
  const { contract, userAddress } = useAppContext();
  const [plainPassword, setPlainPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [item, setItem] = useState<Item>({title: '', description: '', vault: 0, password: ''});

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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="content">
        <h2 className="title is-4">{item.title}</h2>
        {item.description && <p>{item.description}</p>}
        <button className={`button is-info ${isLoading ? 'is-loading' : ''}`} onClick={handleShowPassword} disabled={isLoading}>
          Show Password
        </button>
        {plainPassword && <p>Plain Password: {plainPassword}</p>}
      </div>
    </Modal>
  );
};

export default ItemInfoModal;
