import { useState, useCallback } from 'react';
import { PatientData } from '../ml/syntheticData';
import { makePrediction, PredictionResult, savePrediction } from '../services/PredictionService';

interface UsePredictionReturn {
  loading: boolean;
  error: string | null;
  prediction: PredictionResult | null;
  generatePrediction: (patient: PatientData, drugName: string) => Promise<PredictionResult>;
}

export const usePrediction = (): UsePredictionReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const generatePrediction = useCallback(async (patient: PatientData, drugName: string): Promise<PredictionResult> => {
    setLoading(true);
    setError(null);
    
    try {
      // Generate prediction
      const result = await makePrediction(patient, drugName);
      
      // Save prediction to store
      savePrediction(result);
      
      // Update state
      setPrediction(result);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    prediction,
    generatePrediction
  };
};