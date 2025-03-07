// src/context/PredictionContext.tsx
import React, { createContext, useContext, useState } from 'react';

export interface Prediction {
  id: string;
  patientId: string;
  drugName: string;
  dosage: string;
  timestamp: string;
  status: string;
  confidence: number;
  blockchainHash: string;
}

interface PredictionContextType {
  predictions: Prediction[];
  addPrediction: (prediction: Prediction) => void;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const PredictionProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize with your existing mock predictions
  const [predictions, setPredictions] = useState<Prediction[]>([
    {
      id: 'pred_1234567',
      patientId: 'P1001',
      drugName: 'Ibuprofen',
      dosage: '400 mg',
      timestamp: '2025-03-15T14:30:00Z',
      status: 'completed',
      confidence: 0.92,
      blockchainHash: '0x1a2b3c4d5e6f7g8h9i0j'
    },
    {
      id: 'pred_2345678',
      patientId: 'P1002',
      drugName: 'Metformin',
      dosage: '500 mg',
      timestamp: '2025-03-14T10:15:00Z',
      status: 'completed',
      confidence: 0.88,
      blockchainHash: '0x2b3c4d5e6f7g8h9i0j1'
    },
    {
      id: 'pred_3456789',
      patientId: 'P1003',
      drugName: 'Amoxicillin',
      dosage: '250 mg',
      timestamp: '2025-03-13T16:45:00Z',
      status: 'completed',
      confidence: 0.95,
      blockchainHash: '0x3c4d5e6f7g8h9i0j1k2'
    },
    {
      id: 'pred_4567890',
      patientId: 'P1004',
      drugName: 'Lisinopril',
      dosage: '10 mg',
      timestamp: '2025-03-12T09:20:00Z',
      status: 'completed',
      confidence: 0.87,
      blockchainHash: '0x4d5e6f7g8h9i0j1k2l3'
    },
    {
      id: 'pred_5678901',
      patientId: 'P1005',
      drugName: 'Atorvastatin',
      dosage: '20 mg',
      timestamp: '2025-03-11T13:10:00Z',
      status: 'completed',
      confidence: 0.91,
      blockchainHash: '0x5e6f7g8h9i0j1k2l3m4'
    }
  ]);

  const addPrediction = (prediction: Prediction) => {
    // Prepend new predictions so they appear first
    setPredictions(prev => [prediction, ...prev]);
  };

  return (
    <PredictionContext.Provider value={{ predictions, addPrediction }}>
      {children}
    </PredictionContext.Provider>
  );
};

export const usePredictionContext = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePredictionContext must be used within a PredictionProvider');
  }
  return context;
};
