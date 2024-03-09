import { ethers } from 'ethers';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Contract {
  address: string;
  abi: any[];
  instance: ethers.Contract | null;
}

export interface Item {
    title: string;
    description: string;
    vault: number;
    // Assuming 'password' is a simplified representation
    password: string;
}

export interface Vault {
    id: number;
    name: string;
    // Add other properties as needed
}
  
interface AppState {
    vaults: Vault[];
    contract: Contract;
    currentVault: Vault;
    userAddress: string;
    // Add other state slices as needed
}
  
interface AppContextType extends AppState {
    setVaults: React.Dispatch<React.SetStateAction<Vault[]>>;
    setContract: React.Dispatch<React.SetStateAction<Contract>>;
    setCurrentVault: React.Dispatch<React.SetStateAction<Vault>>;
    setUserAddress: React.Dispatch<React.SetStateAction<string>>;
    // Add setters for other state slices as needed
}
const AppContext = createContext<AppContextType | undefined>(undefined);

const CONTRACT_ADDRESS = "0x5FB47332da35E7a54782c7b1EE944400fb14fba1";
const CONTRACT_ABI: any[] = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_admin",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "ECDSAInvalidSignature",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "length",
				"type": "uint256"
			}
		],
		"name": "ECDSAInvalidSignatureLength",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "ECDSAInvalidSignatureS",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidShortString",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "str",
				"type": "string"
			}
		],
		"name": "StringTooLong",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "EIP712DomainChanged",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "DESCRIPTION_LENGTH_LIMIT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "PASSWORD_LENGTH",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "TITLE_LENGTH_LIMIT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_vaultId",
				"type": "uint256"
			},
			{
				"internalType": "bytes[]",
				"name": "_password",
				"type": "bytes[]"
			}
		],
		"name": "createItem",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "createVault",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_itemId",
				"type": "uint256"
			}
		],
		"name": "deleteItem",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "destroy",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "eip712Domain",
		"outputs": [
			{
				"internalType": "bytes1",
				"name": "fields",
				"type": "bytes1"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "version",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "chainId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "verifyingContract",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "salt",
				"type": "bytes32"
			},
			{
				"internalType": "uint256[]",
				"name": "extensions",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "generateNewPassword",
		"outputs": [
			{
				"internalType": "euint32[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_itemId",
				"type": "uint256"
			}
		],
		"name": "getItem",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "vault",
						"type": "uint256"
					},
					{
						"internalType": "euint32[]",
						"name": "password",
						"type": "uint256[]"
					}
				],
				"internalType": "struct PasswordManager.Item",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_vaultId",
				"type": "uint256"
			}
		],
		"name": "getItemsOfVault",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_itemId",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "publicKey",
				"type": "bytes32"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "getPlainPassword",
		"outputs": [
			{
				"internalType": "bytes[]",
				"name": "",
				"type": "bytes[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getVaults",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_itemId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_vaultId",
				"type": "uint256"
			},
			{
				"internalType": "bytes[]",
				"name": "_newPassword",
				"type": "bytes[]"
			}
		],
		"name": "setItem",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [vaults, setVaults] = useState<Vault[]>([]);
    const [contract, setContract] = useState<Contract>({address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, instance: null});
    const [currentVault, setCurrentVault] = useState<Vault>({id: 0, name: "All"});
    const [userAddress, setUserAddress] = useState<string>('');

    const value = { vaults, setVaults, contract, setContract, currentVault, setCurrentVault, userAddress, setUserAddress };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
  
export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
      throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
    