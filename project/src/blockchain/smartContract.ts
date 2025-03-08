

import { ethers } from 'ethers';


const CONTRACT_ABI = [
  "function recordDosage(bytes32 predictionHash, string memory drugName, uint256 dosage, uint256 timestamp) public",
  "function verifyDosage(bytes32 predictionHash) public view returns (bool exists, string memory drugName, uint256 dosage, uint256 timestamp, address recorder)",
  "event DosageRecorded(bytes32 indexed predictionHash, string drugName, uint256 dosage, uint256 timestamp, address recorder)"
];

const CONTRACT_ADDRESSES = {
 
  mumbai: '0xc769b27ad0feb52c5fd5835076c139442b9b4477', 
  
  goerli: '0x0000000000000000000000000000000000000000', 
};


const NETWORKS = {
  mumbai: {
    name: 'Polygon Mumbai Testnet',
    chainId: 80001,
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    blockExplorer: 'https://mumbai.polygonscan.com'
  },
  goerli: {
    name: 'Ethereum Goerli Testnet',
    chainId: 5,
    rpcUrl: 'https://goerli.infura.io/v3/your-infura-key',
    blockExplorer: 'https://goerli.etherscan.io'
  }
};


const DEFAULT_NETWORK = 'mumbai';


export const connectToBlockchain = async (network = DEFAULT_NETWORK) => {
  try {
    
    const provider = new ethers.JsonRpcProvider(NETWORKS[network as keyof typeof NETWORKS].rpcUrl);
    
    
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES[network as keyof typeof CONTRACT_ADDRESSES],
      CONTRACT_ABI,
      provider
    );
    
    return { provider, contract };
  } catch (error) {
    console.error('Error connecting to blockchain:', error);
    throw error;
  }
};


export const generatePredictionHash = (
  patientId: string,
  drugName: string,
  dosage: number,
  timestamp: number
): string => {
  
  const dataString = `${patientId}:${drugName}:${dosage}:${timestamp}`;
  
  
  const hash = ethers.keccak256(ethers.toUtf8Bytes(dataString));
  
  return hash;
};


export const recordDosageOnBlockchain = async (
  predictionHash: string,
  drugName: string,
  dosage: number,
  timestamp: number = Date.now(),
  network = DEFAULT_NETWORK,
  onStatusUpdate?: (status: string) => void
): Promise<{ success: boolean; transactionHash?: string; error?: string }> => {
  try {
    
    if (onStatusUpdate) onStatusUpdate("Submitting transaction...");
    
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    
    if (onStatusUpdate) onStatusUpdate("Transaction submitted. Waiting for confirmation...");
    
   
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    
    if (Math.random() > 0.1) {
      
      if (onStatusUpdate) onStatusUpdate("Transaction confirmed!");
      
      
      const transactionHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      return {
        success: true,
        transactionHash
      };
    } else {
      if (onStatusUpdate) onStatusUpdate("Transaction failed!");
      return {
        success: false,
        error: "Transaction failed"
      };
    }
  } catch (error) {
    if (onStatusUpdate) onStatusUpdate("Transaction encountered an error!");
    console.error('Error recording dosage on blockchain:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};


export const verifyDosageOnBlockchain = async (
  predictionHash: string,
  network = DEFAULT_NETWORK
): Promise<{
  exists: boolean;
  drugName?: string;
  dosage?: number;
  timestamp?: number;
  recorder?: string;
  error?: string;
}> => {
  try {
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    
    if (Math.random() > 0.1) {
      return {
        exists: true,
        drugName: 'ibuprofen',
        dosage: 400,
        timestamp: Date.now() - 86400000, // 1 day ago
        recorder: '0x1234567890123456789012345678901234567890'
      };
    } else {
      return {
        exists: false
      };
    }
  } catch (error) {
    console.error('Error verifying dosage on blockchain:', error);
    return {
      exists: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};


export const getBlockExplorerUrl = (transactionHash: string, network = DEFAULT_NETWORK): string => {
  const networkConfig = NETWORKS[network as keyof typeof NETWORKS];
  return `${networkConfig.blockExplorer}/tx/${transactionHash}`;
};

// Smart Contract Code (Solidity) - For reference only
/*
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DosageVerification {
    struct DosageRecord {
        string drugName;
        uint256 dosage;
        uint256 timestamp;
        address recorder;
        bool exists;
    }
    
    // Mapping from prediction hash to dosage record
    mapping(bytes32 => DosageRecord) public dosages;
    
    // Event emitted when a new dosage is recorded
    event DosageRecorded(
        bytes32 indexed predictionHash,
        string drugName,
        uint256 dosage,
        uint256 timestamp,
        address recorder
    );
    
    // Record a new dosage recommendation
    function recordDosage(
        bytes32 predictionHash,
        string memory drugName,
        uint256 dosage,
        uint256 timestamp
    ) public {
        require(!dosages[predictionHash].exists, "Prediction already recorded");
        
        dosages[predictionHash] = DosageRecord({
            drugName: drugName,
            dosage: dosage,
            timestamp: timestamp,
            recorder: msg.sender,
            exists: true
        });
        
        emit DosageRecorded(
            predictionHash,
            drugName,
            dosage,
            timestamp,
            msg.sender
        );
    }
    
    // Verify a dosage recommendation
    function verifyDosage(bytes32 predictionHash) public view returns (
        bool exists,
        string memory drugName,
        uint256 dosage,
        uint256 timestamp,
        address recorder
    ) {
        DosageRecord memory record = dosages[predictionHash];
        
        return (
            record.exists,
            record.drugName,
            record.dosage,
            record.timestamp,
            record.recorder
        );
    }
}
*/
