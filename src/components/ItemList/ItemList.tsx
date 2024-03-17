import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext'; // Adjust import path as necessary
import ItemInfoModal from '../ItemInfoModal/ItemInfoModal'; // Adjust import path as necessary

interface Item {
  id: number;
  title: string;
  description: string;
  // Add any other necessary item properties
}

const ItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const { contract, currentVault } = useAppContext();

  useEffect(() => {
    const fetchItems = async () => {
      if (!contract.instance) {
        console.error('Contract instance is not available');
        return;
      }
      try {
        const [itemIds, titles] = await contract.instance.getItemsOfVault(currentVault.id);
        const fetchedItems: Item[] = itemIds.map((id: number, index: number) => ({
          id: id, // Converting id to string if necessary
          title: titles[index],
          description: "test"
        }));
        setItems(fetchedItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, [currentVault, contract.instance]);

  const handleItemClick = (itemId: number) => {
    setSelectedItemId(itemId);
  };

  return (
    // Assuming you have 'bulma' installed and its CSS file imported in your project
    <div className="itemList">
      {items.map((item) => (
        <div key={item.id} className="box custom-box-margin" style={{ marginRight: "10px", marginTop: "10px", marginLeft: "10px" }} onClick={() => handleItemClick(item.id)}>
          <div className="content has-text-left">
            <p className="title is-5">{item.title}</p>
            <p className="subtilte is-6">{item.description}</p>
          </div>
        </div>
      ))}
      {items.length === 0 && <p className="has-text-centered">Vault is empty.</p>}
      {selectedItemId && (
        <ItemInfoModal
          isOpen={!!selectedItemId}
          onClose={() => setSelectedItemId(null)}
          itemId={selectedItemId}
        />
      )}
    </div>
  );
};

export default ItemList;
