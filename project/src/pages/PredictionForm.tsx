import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { recordDosageOnBlockchain, generatePredictionHash } from '../blockchain/smartContract';


interface FormData {
  age: number;
  weight: number;
  height: number;
  gender: string;
  geneticMarkers: string[];
  medicalHistory: string[];
  currentMedications: string[];
  drugName: string;
}

const PredictionForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string>("");


  const [formData, setFormData] = useState<FormData>({
    age: 30,
    weight: 70,
    height: 170,
    gender: 'male',
    geneticMarkers: [],
    medicalHistory: [],
    currentMedications: [],
    drugName: 'ibuprofen'
  });

  const geneticMarkerOptions = [
    'CYP2D6 - Normal Metabolizer',
    'CYP2D6 - Poor Metabolizer',
    'CYP2D6 - Rapid Metabolizer',
    'CYP2C19 - Normal Metabolizer',
    'CYP2C19 - Poor Metabolizer',
    'CYP3A4 - Normal Expression',
    'CYP3A4 - Low Expression'
  ];

  const medicalHistoryOptions = [
    'Hypertension',
    'Diabetes Type 2',
    'Asthma',
    'Chronic Kidney Disease',
    'Liver Disease',
    'Heart Failure',
    'COPD',
    'None'
  ];

  const medicationOptions = [
    'Lisinopril',
    'Metformin',
    'Atorvastatin',
    'Levothyroxine',
    'Albuterol',
    'Omeprazole',
    'Amlodipine',
    'None'
  ];

  const drugOptions = [
    'ibuprofen',
    'acetaminophen',
    'amoxicillin',
    'lisinopril',
    'metformin',
    'atorvastatin',
    'levothyroxine'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

 
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, category: 'geneticMarkers' | 'medicalHistory' | 'currentMedications') => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFormData({
        ...formData,
        [category]: [...formData[category], value]
      });
    } else {
      setFormData({
        ...formData,
        [category]: formData[category].filter(item => item !== value)
      });
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTxStatus("");

    try {
     
      const recommendedDosage = calculateDosage(formData);
      const timestamp = Date.now();
      
      const patientId = "patient-" + Math.random().toString(36).substring(2, 15);
      
      const predictionHash = generatePredictionHash(patientId, formData.drugName, recommendedDosage, timestamp);
      
      
      const blockchainResult = await recordDosageOnBlockchain(
        predictionHash,
        formData.drugName,
        recommendedDosage,
        timestamp,
        undefined,
        setTxStatus
      );
      
      if (!blockchainResult.success) {
        setError(blockchainResult.error || "Blockchain transaction failed.");
        setLoading(false);
        return;
      }
      
      
      navigate(`/results/${predictionHash}`, { 
        state: { 
          formData,
          
          results: {
            recommendedDosage,
            confidence: 0.89,
            alternativeMedications: generateAlternatives(formData),
            blockchainHash: blockchainResult.transactionHash
          }
        } 
      });
    } catch (err) {
      setError('An error occurred while processing your request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  const calculateDosage = (data: FormData): number => {
    let baseDosage = 0;
    
    
    switch(data.drugName) {
      case 'ibuprofen':
        baseDosage = 400; // mg
        break;
      case 'acetaminophen':
        baseDosage = 500; // mg
        break;
      case 'amoxicillin':
        baseDosage = 250; // mg
        break;
      default:
        baseDosage = 100; // mg
    }
    
    
    const weightFactor = data.weight / 70; // normalize to 70kg
    
    
    const ageFactor = data.age > 65 ? 0.8 : (data.age < 18 ? 0.7 : 1);
    
    
    const geneticFactor = data.geneticMarkers.includes('CYP2D6 - Poor Metabolizer') ? 0.7 : 
                         (data.geneticMarkers.includes('CYP2D6 - Rapid Metabolizer') ? 1.3 : 1);
    
    
    const medicalFactor = data.medicalHistory.includes('Liver Disease') ? 0.7 : 
                         (data.medicalHistory.includes('Chronic Kidney Disease') ? 0.8 : 1);
    
   
    let finalDosage = baseDosage * weightFactor * ageFactor * geneticFactor * medicalFactor;
    
    
    return Math.round(finalDosage / 5) * 5;
  };

  
  const generateAlternatives = (data: FormData): {name: string, dosage: number}[] => {
    const alternatives = [];
    
    if (data.drugName === 'ibuprofen') {
      alternatives.push(
        { name: 'naproxen', dosage: 250 },
        { name: 'acetaminophen', dosage: 500 }
      );
    } else if (data.drugName === 'acetaminophen') {
      alternatives.push(
        { name: 'ibuprofen', dosage: 400 },
        { name: 'aspirin', dosage: 325 }
      );
    } else if (data.drugName === 'amoxicillin') {
      alternatives.push(
        { name: 'azithromycin', dosage: 250 },
        { name: 'doxycycline', dosage: 100 }
      );
    }
    
    return alternatives;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-indigo-700 px-6 py-4">
          <h1 className="text-white text-2xl font-bold">New Dosage Prediction</h1>
          <p className="text-indigo-100 mt-1">
            Enter patient information to receive a personalized dosage recommendation
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
              
              <div className="mb-4">
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age (years)
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  min="1"
                  max="300"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  min="50"
                  max="250"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="drugName" className="block text-sm font-medium text-gray-700 mb-1">
                  Drug to Prescribe
                </label>
                <select
                  id="drugName"
                  name="drugName"
                  value={formData.drugName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  {drugOptions.map(drug => (
                    <option key={drug} value={drug}>
                      {drug.charAt(0).toUpperCase() + drug.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Medical Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Medical Information</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genetic Markers
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md">
                  {geneticMarkerOptions.map(marker => (
                    <div key={marker} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`genetic-${marker}`}
                        value={marker}
                        checked={formData.geneticMarkers.includes(marker)}
                        onChange={(e) => handleCheckboxChange(e, 'geneticMarkers')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`genetic-${marker}`} className="ml-2 text-sm text-gray-700">
                        {marker}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical History
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md">
                  {medicalHistoryOptions.map(condition => (
                    <div key={condition} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`history-${condition}`}
                        value={condition}
                        checked={formData.medicalHistory.includes(condition)}
                        onChange={(e) => handleCheckboxChange(e, 'medicalHistory')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`history-${condition}`} className="ml-2 text-sm text-gray-700">
                        {condition}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Medications
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md">
                  {medicationOptions.map(medication => (
                    <div key={medication} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`med-${medication}`}
                        value={medication}
                        checked={formData.currentMedications.includes(medication)}
                        onChange={(e) => handleCheckboxChange(e, 'currentMedications')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`med-${medication}`} className="ml-2 text-sm text-gray-700">
                        {medication}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 bg-indigo-700 text-white rounded-md font-medium ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-800'
              }`}
            >
              {loading ? 'Processing...' : 'Generate Dosage Recommendation'}
            </button>
          </div>
          {txStatus && (
            <div className="mt-4 p-2 bg-gray-100 border rounded">
              <p className="text-sm text-gray-700">Blockchain Status: {txStatus}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PredictionForm;
