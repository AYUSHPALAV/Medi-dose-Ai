
import * as tf from '@tensorflow/tfjs';
import { PatientData } from '../ml/syntheticData';
import { predictDosage, loadModel } from '../ml/modelTraining';
import { generatePredictionHash, recordDosageOnBlockchain } from '../blockchain/smartContract';


export interface PredictionResult {
  id: string;
  patientId: string;
  drugName: string;
  recommendedDosage: number;
  confidence: number;
  alternativeMedications: { name: string; dosage: number }[];
  blockchainHash: string;
  blockchainTxHash?: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
}


const modelCache: Record<string, tf.LayersModel> = {};


const generateAlternatives = (
  patient: PatientData,
  drugName: string
): { name: string; dosage: number }[] => {
 
  const alternativeMap: Record<string, string[]> = {
    'ibuprofen': ['naproxen', 'acetaminophen'],
    'acetaminophen': ['ibuprofen', 'aspirin'],
    'amoxicillin': ['azithromycin', 'doxycycline'],
    'lisinopril': ['losartan', 'enalapril'],
    'metformin': ['glipizide', 'sitagliptin'],
    'atorvastatin': ['simvastatin', 'rosuvastatin'],
    'levothyroxine': ['liothyronine', 'levothyroxine']
  };
  
 
  const baseDosages: Record<string, number> = {
    'naproxen': 250,
    'acetaminophen': 500,
    'aspirin': 325,
    'azithromycin': 250,
    'doxycycline': 100,
    'losartan': 50,
    'enalapril': 10,
    'glipizide': 5,
    'sitagliptin': 100,
    'simvastatin': 20,
    'rosuvastatin': 10,
    'liothyronine': 25
  };
  
  
  const alternatives = alternativeMap[drugName] || [];
  
  
  return alternatives.map(altDrug => {
    
    const baseDosage = baseDosages[altDrug] || 100;
    
   
    const weightFactor = patient.weight / 70; 
    const ageFactor = patient.age > 65 ? 0.8 : (patient.age < 18 ? 0.7 : 1);
    
    
    let adjustedDosage = baseDosage * weightFactor * ageFactor;
    
    
    const roundedDosage = Math.round(adjustedDosage / 5) * 5;
    
    return {
      name: altDrug,
      dosage: roundedDosage
    };
  });
};


const generatePredictionId = (): string => {
  return `pred_${Math.random().toString(36).substring(2, 15)}`;
};

/**
 * Make a dosage prediction.
 * @param patient The patient data.
 * @param drugName The drug to be prescribed.
 * @param onTxStatusUpdate Optional callback for blockchain transaction status updates.
 * @returns PredictionResult containing prediction details.
 */
export const makePrediction = async (
  patient: PatientData,
  drugName: string,
  onTxStatusUpdate?: (status: string) => void
): Promise<PredictionResult> => {
  try {
    
    const predictionId = generatePredictionId();
    
   
    const timestamp = Date.now();
    
    
    if (!modelCache[drugName]) {
      const loadedModel = await loadModel(drugName);
      
      if (loadedModel) {
        modelCache[drugName] = loadedModel;
      } else {
        
        const fallbackDosage = calculateFallbackDosage(patient, drugName);
        
       
        const blockchainHash = generatePredictionHash(
          patient.id,
          drugName,
          fallbackDosage,
          timestamp
        );
        
        
        const blockchainResult = await recordDosageOnBlockchain(
          blockchainHash,
          drugName,
          fallbackDosage,
          timestamp,
          undefined,
          onTxStatusUpdate
        );
        
        return {
          id: predictionId,
          patientId: patient.id,
          drugName,
          recommendedDosage: fallbackDosage,
          confidence: 0.7, 
          alternativeMedications: generateAlternatives(patient, drugName),
          blockchainHash,
          blockchainTxHash: blockchainResult.transactionHash,
          timestamp,
          status: blockchainResult.success ? 'completed' : 'failed'
        };
      }
    }
    
    
    const { dosage, confidence } = await predictDosage(
      patient,
      drugName,
      modelCache[drugName]
    );
    
    
    const blockchainHash = generatePredictionHash(
      patient.id,
      drugName,
      dosage,
      timestamp
    );
    
    
    const blockchainResult = await recordDosageOnBlockchain(
      blockchainHash,
      drugName,
      dosage,
      timestamp,
      undefined,
      onTxStatusUpdate
    );
    
    
    const alternatives = generateAlternatives(patient, drugName);
    
    
    return {
      id: predictionId,
      patientId: patient.id,
      drugName,
      recommendedDosage: dosage,
      confidence,
      alternativeMedications: alternatives,
      blockchainHash,
      blockchainTxHash: blockchainResult.transactionHash,
      timestamp,
      status: blockchainResult.success ? 'completed' : 'failed'
    };
  } catch (error) {
    console.error('Error making prediction:', error);
    throw error;
  }
};


const calculateFallbackDosage = (patient: PatientData, drugName: string): number => {
 
  const baseDosages: Record<string, number> = {
    'ibuprofen': 400,
    'acetaminophen': 500,
    'amoxicillin': 250,
    'lisinopril': 10,
    'metformin': 500,
    'atorvastatin': 20,
    'levothyroxine': 100
  };
  
  const baseDosage = baseDosages[drugName] || 100;
  
  
  const weightFactor = patient.weight / 70; // normalize to 70kg
  
  
  const ageFactor = patient.age > 65 ? 0.8 : (patient.age < 18 ? 0.7 : 1);
  
  
  const geneticFactor = patient.geneticMarkers.includes('CYP2D6 - Poor Metabolizer') ? 0.7 : 
                       (patient.geneticMarkers.includes('CYP2D6 - Rapid Metabolizer') ? 1.3 : 1);
  
  
  const medicalFactor = patient.medicalHistory.includes('Liver Disease') ? 0.7 : 
                       (patient.medicalHistory.includes('Chronic Kidney Disease') ? 0.8 : 1);
  
 
  let finalDosage = baseDosage * weightFactor * ageFactor * geneticFactor * medicalFactor;
  
 
  return Math.round(finalDosage / 5) * 5;
};


const predictionStore: Record<string, PredictionResult> = {};


export const savePrediction = (prediction: PredictionResult): void => {
  predictionStore[prediction.id] = prediction;
};


export const getPrediction = (id: string): PredictionResult | null => {
  return predictionStore[id] || null;
};


export const getAllPredictions = (): PredictionResult[] => {
  return Object.values(predictionStore);
};
