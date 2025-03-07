
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, AlertTriangle, ExternalLink, Search } from 'lucide-react';
import { usePredictionContext, Prediction } from '../context/PredictionContext';


const calculateMostPrescribedDrug = (predictions: Prediction[]) => {
  const frequency: { [drug: string]: number } = {};
  predictions.forEach(pred => {
    frequency[pred.drugName] = (frequency[pred.drugName] || 0) + 1;
  });
  let mostPrescribed = '';
  let maxCount = 0;
  Object.entries(frequency).forEach(([drug, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostPrescribed = drug;
    }
  });
  return mostPrescribed;
};

const Dashboard = () => {
  const { predictions } = usePredictionContext();
  const [searchTerm, setSearchTerm] = useState('');

  const stats = {
    totalPredictions: predictions.length,
    averageConfidence: predictions.length
      ? predictions.reduce((acc, pred) => acc + pred.confidence, 0) / predictions.length
      : 0,
    uniquePatients: new Set(predictions.map(p => p.patientId)).size,
    mostPrescribedDrug: calculateMostPrescribedDrug(predictions)
  };


  const filteredPredictions = predictions.filter(pred =>
    pred.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pred.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pred.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Overview of dosage predictions and system performance
          </p>
        </div>
        <Link 
          to="/predict" 
          className="mt-4 md:mt-0 bg-indigo-700 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-800 transition"
        >
          New Prediction
        </Link>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-indigo-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Predictions</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPredictions}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Confidence</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(stats.averageConfidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-blue-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Unique Patients</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.uniquePatients}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-purple-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Most Prescribed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.mostPrescribedDrug}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Predictions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recent Predictions</h2>
        </div>
        
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by patient ID, drug name, or prediction ID"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prediction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Drug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dosage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPredictions.length > 0 ? (
                filteredPredictions.map((prediction) => (
                  <tr key={prediction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{prediction.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{prediction.patientId}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{prediction.drugName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{prediction.dosage}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500" 
                            style={{ width: `${prediction.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {(prediction.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(prediction.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link to={`/results/${prediction.id}`} className="text-indigo-600 hover:text-indigo-900">
                          View
                        </Link>
                        <Link to={`/verify/${prediction.blockchainHash}`} className="text-green-600 hover:text-green-900">
                          Verify
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No predictions found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
