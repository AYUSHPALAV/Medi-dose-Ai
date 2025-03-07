
export interface PatientData {
  id: string;
  age: number;
  weight: number; // in kg
  height: number; // in cm
  gender: 'male' | 'female' | 'other';
  geneticMarkers: string[];
  medicalHistory: string[];
  currentMedications: string[];
}


export interface DosageData {
  patientId: string;
  drugName: string;
  optimalDosage: number; // in mg
  actualEffectiveness: number; // 0-1 scale
}


const geneticMarkerOptions = [
  'CYP2D6 - Normal Metabolizer',
  'CYP2D6 - Poor Metabolizer',
  'CYP2D6 - Rapid Metabolizer',
  'CYP2C19 - Normal Metabolizer',
  'CYP2C19 - Poor Metabolizer',
  'CYP3A4 - Normal Expression',
  'CYP3A4 - Low Expression'
];

const medicalConditionOptions = [
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


const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomFloat = (min: number, max: number, decimals: number = 1): number => {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
};

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomElements = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};


export const generateSyntheticPatient = (id?: string): PatientData => {
  const patientId = id || `P${getRandomInt(1000, 9999)}`;
  const age = getRandomInt(18, 85);
  const gender = getRandomElement(['male', 'female', 'other']) as 'male' | 'female' | 'other';
  

  let weightMin = 50;
  let weightMax = 100;
  
  if (age > 65) {
    weightMin -= 5;
    weightMax -= 10;
  }
  
  if (gender === 'female') {
    weightMin -= 10;
    weightMax -= 15;
  }
  
  const weight = getRandomFloat(weightMin, weightMax);
  
  
  let heightMin = 150;
  let heightMax = 190;
  
  if (gender === 'female') {
    heightMin -= 10;
    heightMax -= 15;
  }
  
  const height = getRandomInt(heightMin, heightMax);
  
  
  const geneticMarkers = getRandomElements(geneticMarkerOptions, getRandomInt(0, 2));
  
  
  const medicalHistory = getRandomElements(medicalConditionOptions, getRandomInt(0, 3));
  
  
  const currentMedications = getRandomElements(medicationOptions, getRandomInt(0, 3));
  
  return {
    id: patientId,
    age,
    weight,
    height,
    gender,
    geneticMarkers,
    medicalHistory,
    currentMedications
  };
};


export const calculateOptimalDosage = (patient: PatientData, drugName: string): number => {
  
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
  
  
  const weightFactor = patient.weight / 70; 
  
  
  const ageFactor = patient.age > 65 ? 0.8 : (patient.age < 25 ? 0.9 : 1);
  
  
  let geneticFactor = 1;
  if (patient.geneticMarkers.includes('CYP2D6 - Poor Metabolizer')) {
    geneticFactor = 0.7; 
  } else if (patient.geneticMarkers.includes('CYP2D6 - Rapid Metabolizer')) {
    geneticFactor = 1.3; 
  }
  
  
  let medicalFactor = 1;
  if (patient.medicalHistory.includes('Liver Disease')) {
    medicalFactor *= 0.7; 
  }
  if (patient.medicalHistory.includes('Chronic Kidney Disease')) {
    medicalFactor *= 0.8; 
  }
  
  
  const randomVariation = getRandomFloat(0.9, 1.1);
  let finalDosage = baseDosage * weightFactor * ageFactor * geneticFactor * medicalFactor * randomVariation;
  
  
  return Math.round(finalDosage / 5) * 5;
};

export const generateSyntheticDataset = (count: number): { patients: PatientData[], dosages: DosageData[] } => {
  const patients: PatientData[] = [];
  const dosages: DosageData[] = [];
  
  for (let i = 0; i < count; i++) {
    const patient = generateSyntheticPatient();
    patients.push(patient);
    
    
    const numDrugs = getRandomInt(1, 3);
    const selectedDrugs = getRandomElements(drugOptions, numDrugs);
    
    for (const drug of selectedDrugs) {
      const optimalDosage = calculateOptimalDosage(patient, drug);
      
      
      const effectiveness = getRandomFloat(0.75, 0.98);
      
      dosages.push({
        patientId: patient.id,
        drugName: drug,
        optimalDosage,
        actualEffectiveness: effectiveness
      });
    }
  }
  
  return { patients, dosages };
};


export const syntheticTrainingData = generateSyntheticDataset(1000);