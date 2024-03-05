import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext'; // Adjust import path as necessary

// Assuming the Item type is defined somewhere
interface Item {
  id: string;
  title: string;
  // other properties
}

const ItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const { contract, currentVault } = useAppContext();

  useEffect(() => {
    const fetchItems = async () => {
        if (!contract.instance) {
            console.error('Contract instance is not available');
            return;
        }
        // Here, use the contract to call the getItemsOfVault method
        // using the selectedVault. This is just a placeholder example:
        const [itemIds, titles] = await contract.instance.getItemsOfVault(currentVault.id);

        const fetchedItems: Item[] = itemIds.map((id: number, index: number) => ({
            id: id, // Assuming the id needs to be converted to a string
            title: titles[index], // Corresponding title from the titles array
        }));
        console.log(fetchedItems)
        setItems(fetchedItems);

    };

    fetchItems();
  }, [currentVault]);

  return (
    <div className="itemList">
      {items.length > 0 ? (
        items.map((item) => (
          <div key={item.id}>{item.title}</div> // Make sure to use the correct property for title
        ))
      ) : (
        <p>Vault is empty.</p> // Displayed when there are no items
      )}
    </div>
  );
};

export default ItemList;
