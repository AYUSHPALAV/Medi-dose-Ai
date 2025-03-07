

import * as tf from '@tensorflow/tfjs';
import { PatientData, syntheticTrainingData, calculateOptimalDosage } from './syntheticData';

const FEATURE_COLUMNS = [
  'age',
  'weight',
  'height',
  'bmi', 
  'genderMale',
  'genderFemale',
  'genderOther',
  'geneticCYP2D6Normal',
  'geneticCYP2D6Poor',
  'geneticCYP2D6Rapid',
  'geneticCYP2C19Normal',
  'geneticCYP2C19Poor',
  'geneticCYP3A4Normal',
  'geneticCYP3A4Low',
  'medicalHypertension',
  'medicalDiabetes',
  'medicalAsthma',
  'medicalKidneyDisease',
  'medicalLiverDisease',
  'medicalHeartFailure',
  'medicalCOPD',
  'medicationLisinopril',
  'medicationMetformin',
  'medicationAtorvastatin',
  'medicationLevothyroxine',
  'medicationAlbuterol',
  'medicationOmeprazole',
  'medicationAmlodipine'
];


const patientToFeatures = (patient: PatientData): number[] => {
  const features = [];
  
  features.push(patient.age / 100);       
  features.push(patient.weight / 150);      
  features.push(patient.height / 200);      
  
 
  const heightInMeters = patient.height / 100;
  const bmi = patient.weight / (heightInMeters * heightInMeters);
  features.push(bmi / 40);
 
  features.push(patient.gender === 'male' ? 1 : 0);
  features.push(patient.gender === 'female' ? 1 : 0);
  features.push(patient.gender === 'other' ? 1 : 0);
  
  
  features.push(patient.geneticMarkers.includes('CYP2D6 - Normal Metabolizer') ? 1 : 0);
  features.push(patient.geneticMarkers.includes('CYP2D6 - Poor Metabolizer') ? 1 : 0);
  features.push(patient.geneticMarkers.includes('CYP2D6 - Rapid Metabolizer') ? 1 : 0);
  features.push(patient.geneticMarkers.includes('CYP2C19 - Normal Metabolizer') ? 1 : 0);
  features.push(patient.geneticMarkers.includes('CYP2C19 - Poor Metabolizer') ? 1 : 0);
  features.push(patient.geneticMarkers.includes('CYP3A4 - Normal Expression') ? 1 : 0);
  features.push(patient.geneticMarkers.includes('CYP3A4 - Low Expression') ? 1 : 0);
  

  features.push(patient.medicalHistory.includes('Hypertension') ? 1 : 0);
  features.push(patient.medicalHistory.includes('Diabetes Type 2') ? 1 : 0);
  features.push(patient.medicalHistory.includes('Asthma') ? 1 : 0);
  features.push(patient.medicalHistory.includes('Chronic Kidney Disease') ? 1 : 0);
  features.push(patient.medicalHistory.includes('Liver Disease') ? 1 : 0);
  features.push(patient.medicalHistory.includes('Heart Failure') ? 1 : 0);
  features.push(patient.medicalHistory.includes('COPD') ? 1 : 0);
  
  
  features.push(patient.currentMedications.includes('Lisinopril') ? 1 : 0);
  features.push(patient.currentMedications.includes('Metformin') ? 1 : 0);
  features.push(patient.currentMedications.includes('Atorvastatin') ? 1 : 0);
  features.push(patient.currentMedications.includes('Levothyroxine') ? 1 : 0);
  features.push(patient.currentMedications.includes('Albuterol') ? 1 : 0);
  features.push(patient.currentMedications.includes('Omeprazole') ? 1 : 0);
  features.push(patient.currentMedications.includes('Amlodipine') ? 1 : 0);
  
  return features;
};


const prepareTrainingData = (drugName: string) => {
  const { patients, dosages } = syntheticTrainingData;
  
 
  const relevantDosages = dosages.filter(d => d.drugName === drugName);
  
  const features: number[][] = [];
  const labels: number[] = [];
  
  relevantDosages.forEach(dosage => {
    const patient = patients.find(p => p.id === dosage.patientId);
    if (patient) {
      features.push(patientToFeatures(patient));
      labels.push(dosage.optimalDosage / 1000); 
    }
  });
  
  return {
    features: tf.tensor2d(features),
    labels: tf.tensor1d(labels)
  };
};


class ReduceLROnPlateauCallback extends tf.CustomCallback {
  monitor: string;
  factor: number;
  patience: number;
  minLR: number;
  best: number;
  wait: number;
  constructor({ monitor = 'val_loss', factor = 0.5, patience = 2, minLR = 1e-6 } = {}) {
    super();
    this.monitor = monitor;
    this.factor = factor;
    this.patience = patience;
    this.minLR = minLR;
    this.best = Number.POSITIVE_INFINITY;
    this.wait = 0;
  }
  async onEpochEnd(epoch: number, logs?: tf.Logs) {
    const current = logs ? logs[this.monitor] : undefined;
    if (current === undefined) return;
    if (current < this.best) {
      this.best = current;
      this.wait = 0;
    } else {
      this.wait++;
      if (this.wait >= this.patience) {
        const oldLR = (this.model!.optimizer as tf.AdamOptimizer).learningRate as number;
        const newLR = Math.max(oldLR * this.factor, this.minLR);
        
        (this.model!.optimizer as tf.AdamOptimizer).learningRate = newLR;
        console.log(`Epoch ${epoch}: reducing learning rate from ${oldLR} to ${newLR}`);
        this.wait = 0;
      }
    }
  }
}


export const trainModelForDrug = async (drugName: string): Promise<tf.LayersModel> => {
  
  const { features, labels } = prepareTrainingData(drugName);
  

  const model = tf.sequential();
  
  
  model.add(tf.layers.dense({
    inputShape: [FEATURE_COLUMNS.length],
    units: 128,
    activation: 'relu',
    kernelRegularizer: tf.regularizers.l2({ l2: 0.001 })
  }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.dropout({ rate: 0.2 }));
  

  model.add(tf.layers.dense({
    units: 64,
    activation: 'relu',
    kernelRegularizer: tf.regularizers.l2({ l2: 0.001 })
  }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.dropout({ rate: 0.2 }));
  
  
  model.add(tf.layers.dense({
    units: 32,
    activation: 'relu',
    kernelRegularizer: tf.regularizers.l2({ l2: 0.001 })
  }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.dropout({ rate: 0.2 }));
  
 
  model.add(tf.layers.dense({
    units: 16,
    activation: 'relu',
    kernelRegularizer: tf.regularizers.l2({ l2: 0.001 })
  }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.dropout({ rate: 0.2 }));
  
  
  model.add(tf.layers.dense({
    units: 1,
    activation: 'linear'
  }));
  
  
  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'huberLoss',
    metrics: ['mse']
  });
  
 .
  const earlyStoppingCallback = tf.callbacks.earlyStopping({
    monitor: 'val_loss',
    patience: 5
  });
  const reduceLROnPlateauCallback = new ReduceLROnPlateauCallback({
    monitor: 'val_loss',
    factor: 0.5,
    patience: 2,
    minLR: 1e-6
  });
  
 
  await model.fit(features, labels, {
    epochs: 50,
    batchSize: 32,
    validationSplit: 0.2,
    callbacks: [
      earlyStoppingCallback,
      reduceLROnPlateauCallback,
      {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs?.loss}, mse = ${logs?.mse}`);
        }
      }
    ]
  });
  
  return model;
};

export const predictDosage = async (
  patient: PatientData,
  drugName: string,
  model: tf.LayersModel
): Promise<{ dosage: number; confidence: number }> => {
  const features = patientToFeatures(patient);
  const prediction = model.predict(tf.tensor2d([features])) as tf.Tensor;
  const dosageNormalized = await prediction.data();
  const predictedDosage = dosageNormalized[0] * 1000;
  const roundedDosage = Math.round(predictedDosage / 5) * 5;
  const optimalDosage = calculateOptimalDosage(patient, drugName);
  const percentDifference = Math.abs(roundedDosage - optimalDosage) / optimalDosage;
  const confidence = Math.max(0, 1 - percentDifference);
  
  return {
    dosage: roundedDosage,
    confidence: parseFloat(confidence.toFixed(2))
  };
};


export const trainAllModels = async (): Promise<Record<string, tf.LayersModel>> => {
  const drugModels: Record<string, tf.LayersModel> = {};
  
  const drugs = [
    'ibuprofen',
    'acetaminophen',
    'amoxicillin',
    'lisinopril',
    'metformin',
    'atorvastatin',
    'levothyroxine'
  ];
  
  for (const drug of drugs) {
    console.log(`Training model for ${drug}...`);
    drugModels[drug] = await trainModelForDrug(drug);
  }
  
  return drugModels;
};


export const saveModel = async (model: tf.LayersModel, drugName: string): Promise<void> => {
  try {
    await model.save(`localstorage://drug-dosage-model-${drugName}`);
    console.log(`Model for ${drugName} saved successfully`);
  } catch (error) {
    console.error(`Error saving model for ${drugName}:`, error);
  }
};


export const loadModel = async (drugName: string): Promise<tf.LayersModel | null> => {
  try {
    const model = await tf.loadLayersModel(`localstorage://drug-dosage-model-${drugName}`);
    console.log(`Model for ${drugName} loaded successfully`);
    return model;
  } catch (error) {
    console.error(`Error loading model for ${drugName}:`, error);
    return null;
  }
};

export { predictDosage, loadModel };
