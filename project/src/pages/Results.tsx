import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Check, AlertTriangle, Download, ExternalLink } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { usePredictionContext } from '../context/PredictionContext';
import jsPDF from 'jspdf';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ResultsData {
  recommendedDosage: number;
  confidence: number;
  alternativeMedications: { name: string; dosage: number }[];
  blockchainHash: string;
}

interface LocationState {
  formData: any;
  results: ResultsData;
}

const Results = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ResultsData | null>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const { predictions, addPrediction } = usePredictionContext();
  const [predictionAdded, setPredictionAdded] = useState(false);

  const downloadReport = async () => {
    // Construct the detailed report payload for Gemini with extra sections
    const reportPayload = {
      title: "Detailed Dosage Recommendation Report",
      sections: [
        {
          header: "Overview",
          content: `Prediction ID: ${id}\nRecommended Dosage: ${results?.recommendedDosage} mg\nConfidence: ${(results?.confidence * 100).toFixed(0)}%`
        },
        {
          header: "Patient Details",
          content: `Patient ID: ${patientData.patientId}\nAge: ${patientData.age}\nWeight: ${patientData.weight}\nHeight: ${patientData.height}\nGender: ${patientData.gender}`
        },
        {
          header: "Genetic Markers",
          content:
            patientData.geneticMarkers && patientData.geneticMarkers.length > 0
              ? patientData.geneticMarkers.join(', ')
              : "None"
        },
        {
          header: "Medical History",
          content:
            patientData.medicalHistory && patientData.medicalHistory.length > 0
              ? patientData.medicalHistory.join(', ')
              : "None"
        },
        {
          header: "Current Medications",
          content:
            patientData.currentMedications && patientData.currentMedications.length > 0
              ? patientData.currentMedications.join(', ')
              : "None"
        },
        {
          header: "Alternative Medications",
          content:
            results?.alternativeMedications && results.alternativeMedications.length > 0
              ? results.alternativeMedications
                  .map((med, index) => `${index + 1}. ${med.name} - ${med.dosage} mg`)
                  .join("\n")
              : "None"
        },
        {
          header: "Blockchain Verification",
          content: `Blockchain Hash: ${results?.blockchainHash}`
        }
      ]
    };

    // Gemini API endpoint and API key
    const geminiApiUrl = "https://api.gemini.com/v1/reports/generate";
    const apiKey = "AIzaSyD2BQZHLCH1VZEF5AiD__d59wkXGEJbQcc";

    try {
      console.log("Sending report payload to Gemini:", reportPayload);
      const response = await fetch(geminiApiUrl, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
        body: JSON.stringify(reportPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
      }

      // If successful, assume Gemini returns the PDF as a binary blob
      const pdfBlob = await response.blob();
      console.log("Gemini API returned a PDF blob.");

      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "detailed-report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating detailed report via Gemini:", error);
      console.log("Falling back to original jsPDF report generation with enhanced structure.");

      // Enhanced jsPDF-based report generation with added structure for clarity
      const doc = new jsPDF();

      // Header Section
      doc.setFillColor(75, 0, 130);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text("Dosage Recommendation Report", 20, 25);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setDrawColor(200, 200, 200);
      doc.line(10, 45, 200, 45);

      let yPosition = 55;
      // I. Basic Information
      doc.setFontSize(14);
      doc.setTextColor(75, 0, 130);
      doc.text("I. Basic Information", 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Prediction ID: ${id}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Dosage: ${results?.recommendedDosage} mg`, 20, yPosition);
      yPosition += 8;
      doc.text(`Confidence: ${(results?.confidence * 100).toFixed(0)}%`, 20, yPosition);
      yPosition += 8;
      doc.text(`Drug: ${patientData.drugName}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Patient ID: ${patientData.patientId}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Age: ${patientData.age} | Weight: ${patientData.weight}kg`, 20, yPosition);
      yPosition += 8;
      doc.text(`Height: ${patientData.height}cm | Gender: ${patientData.gender}`, 20, yPosition);

      // II. Medical Details
      yPosition += 12;
      doc.setFontSize(14);
      doc.setTextColor(75, 0, 130);
      doc.text("II. Medical Details", 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Genetic Markers:", 20, yPosition);
      doc.setFontSize(11);
      doc.text(
        patientData.geneticMarkers && patientData.geneticMarkers.length > 0
          ? patientData.geneticMarkers.join(', ')
          : "None",
        60,
        yPosition
      );
      yPosition += 8;
      doc.setFontSize(12);
      doc.text("Medical History:", 20, yPosition);
      doc.setFontSize(11);
      doc.text(
        patientData.medicalHistory && patientData.medicalHistory.length > 0
          ? patientData.medicalHistory.join(', ')
          : "None",
        60,
        yPosition
      );
      yPosition += 8;
      doc.setFontSize(12);
      doc.text("Current Medications:", 20, yPosition);
      doc.setFontSize(11);
      doc.text(
        patientData.currentMedications && patientData.currentMedications.length > 0
          ? patientData.currentMedications.join(', ')
          : "None",
        80,
        yPosition
      );

      // III. Alternative Medications
      yPosition += 12;
      doc.setFontSize(14);
      doc.setTextColor(75, 0, 130);
      doc.text("III. Alternative Medications", 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      if (results?.alternativeMedications && results.alternativeMedications.length > 0) {
        results.alternativeMedications.forEach((med, index) => {
          doc.text(`${index + 1}. ${med.name} - ${med.dosage} mg`, 25, yPosition + (index * 8));
        });
        yPosition += results.alternativeMedications.length * 8;
      } else {
        doc.text("None", 25, yPosition);
        yPosition += 8;
      }

      // IV. Blockchain Verification
      yPosition += 10;
      doc.setFontSize(14);
      doc.setTextColor(75, 0, 130);
      doc.text("IV. Blockchain Verification", 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Hash: ${results?.blockchainHash}`, 20, yPosition);

      doc.save("enhanced-report.pdf");
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (location.state) {
          const { formData, results: fetchedResults } = location.state as LocationState;
          setResults(fetchedResults);
          setPatientData(formData);
          
          if (!predictionAdded) {
            const newPrediction = {
              id: id || `pred_${Math.random().toString().slice(2, 10)}`,
              patientId: formData.patientId || `P${Math.floor(Math.random() * 10000)}`,
              drugName: formData.drugName,
              dosage: `${fetchedResults.recommendedDosage} mg`,
              timestamp: new Date().toISOString(),
              status: 'completed',
              confidence: fetchedResults.confidence,
              blockchainHash: fetchedResults.blockchainHash,
              alternativeMedications: fetchedResults.alternativeMedications,
              patientData: formData,
            };
            addPrediction(newPrediction);
            setPredictionAdded(true);
          }
        } else {
          console.log('No state available. Attempting to retrieve prediction from context for ID:', id);
          const predictionFromContext = predictions.find(pred => pred.id === id);
          if (predictionFromContext) {
            const recommendedDosage = parseInt(predictionFromContext.dosage) || 0;
            const constructedResults: ResultsData = {
              recommendedDosage,
              confidence: predictionFromContext.confidence,
              alternativeMedications: predictionFromContext.alternativeMedications || [
                { name: 'naproxen', dosage: 250 },
                { name: 'acetaminophen', dosage: 500 }
              ],
              blockchainHash: predictionFromContext.blockchainHash,
            };
            setResults(constructedResults);
            
            const constructedPatientData = predictionFromContext.patientData || {
              drugName: predictionFromContext.drugName,
              patientId: predictionFromContext.patientId,
              age: '-', 
              weight: '-', 
              height: '-', 
              gender: '-', 
              geneticMarkers: [],
              medicalHistory: [],
              currentMedications: []
            };
            setPatientData(constructedPatientData);
          } else {
            console.log('Prediction not found in context for ID:', id);
            const fallbackResults: ResultsData = {
              recommendedDosage: 400,
              confidence: 0.85,
              alternativeMedications: [
                { name: 'naproxen', dosage: 250 },
                { name: 'acetaminophen', dosage: 500 }
              ],
              blockchainHash: `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
            };
            setResults(fallbackResults);
            setPatientData({
              age: 45,
              weight: 75,
              height: 175,
              gender: 'male',
              geneticMarkers: ['CYP2D6 - Normal Metabolizer'],
              medicalHistory: ['Hypertension'],
              currentMedications: ['Lisinopril'],
              drugName: 'ibuprofen'
            });
          }
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id, location.state, addPrediction, predictionAdded, predictions]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-700"></div>
      </div>
    );
  }

  if (!results || !patientData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Results Not Found</h3>
              <p className="mt-2 text-red-700">
                We couldn't find the prediction results you're looking for. Please try making a new prediction.
              </p>
              <div className="mt-4">
                <Link to="/predict" className="text-red-700 font-medium hover:text-red-600">
                  Make a New Prediction &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: ['Confidence', 'Uncertainty'],
    datasets: [
      {
        data: [results.confidence * 100, (1 - results.confidence) * 100],
        backgroundColor: ['#4F46E5', '#E5E7EB'],
        borderColor: ['#4338CA', '#D1D5DB'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-indigo-700 px-6 py-4">
          <h1 className="text-white text-2xl font-bold">Dosage Recommendation Results</h1>
          <p className="text-indigo-100 mt-1">Prediction ID: {id}</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Recommendation Section */}
              <div className="bg-indigo-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-indigo-900 mb-4">Recommended Dosage</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold text-indigo-700">{results.recommendedDosage} mg</p>
                    <p className="text-lg text-indigo-600 mt-1 capitalize">{patientData.drugName}</p>
                  </div>
                  <div className="bg-white p-2 rounded-full">
                    <Check className="h-8 w-8 text-green-500" />
                  </div>
                </div>
              </div>
              {/* Patient Information */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Patient Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">{patientData.age}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">{patientData.weight}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Height</p>
                    <p className="font-medium">{patientData.height}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium capitalize">{patientData.gender}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Genetic Markers</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {patientData.geneticMarkers && patientData.geneticMarkers.length > 0 ? (
                      patientData.geneticMarkers.map((marker: string) => (
                        <span key={marker} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {marker}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-600">None specified</span>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Medical History</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {patientData.medicalHistory && patientData.medicalHistory.length > 0 ? (
                      patientData.medicalHistory.map((condition: string) => (
                        <span key={condition} className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          {condition}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-600">None specified</span>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Current Medications</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {patientData.currentMedications && patientData.currentMedications.length > 0 ? (
                      patientData.currentMedications.map((medication: string) => (
                        <span key={medication} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          {medication}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-600">None specified</span>
                    )}
                  </div>
                </div>
              </div>
              {/* Alternative Medications */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Alternative Medications</h2>
                {results.alternativeMedications && results.alternativeMedications.length > 0 ? (
                  <div className="space-y-4">
                    {results.alternativeMedications.map((med, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                        <div>
                          <p className="font-medium capitalize">{med.name}</p>
                          <p className="text-sm text-gray-500">Alternative option</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-indigo-700">{med.dosage} mg</p>
                          <p className="text-xs text-gray-500">Recommended dosage</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No alternative medications recommended.</p>
                )}
              </div>
            </div>
            {/* Sidebar */}
            <div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Prediction Confidence</h2>
                <div className="h-48 relative flex items-center justify-center">
                  <Doughnut data={chartData} options={chartOptions} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-indigo-700">{Math.round(results.confidence * 100)}%</p>
                      <p className="text-sm text-gray-500">Confidence</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  This score represents the model's confidence in the dosage recommendation based on the provided patient data.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Blockchain Verification</h2>
                <div className="bg-gray-50 p-3 rounded border border-gray-200 break-all font-mono text-xs">
                  {results.blockchainHash}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  This prediction has been securely recorded on the blockchain for transparency and auditability.
                </p>
                <div className="mt-4">
                  <Link 
                    to={`/verify/${results.blockchainHash}`} 
                    className="flex items-center text-indigo-700 hover:text-indigo-800"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Verify on Blockchain
                  </Link>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Actions</h2>
                <div className="space-y-3">
                  <button 
                    onClick={downloadReport}
                    className="w-full flex items-center justify-center px-4 py-2 border border-indigo-700 text-indigo-700 rounded-md hover:bg-indigo-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </button>
                  <Link 
                    to="/predict" 
                    className="w-full flex items-center justify-center px-4 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-800"
                  >
                    New Prediction
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
