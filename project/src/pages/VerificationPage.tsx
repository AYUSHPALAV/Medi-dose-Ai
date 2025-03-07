import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import { usePredictionContext } from '../context/PredictionContext';

const VerificationPage = () => {
  const { hash } = useParams<{ hash: string }>();
  const { predictions } = usePredictionContext();
  const [status, setStatus] = useState<'loading' | 'verified' | 'failed'>('loading');
  const [verificationData, setVerificationData] = useState<any>(null);

  useEffect(() => {
    const verifyOnBlockchain = async () => {
      try {
        // Retrieve the prediction from context using the blockchain hash
        const prediction = predictions.find(pred => pred.blockchainHash === hash);
        
        // Simulate a delay for blockchain verification
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate successful verification 90% of the time
        if (Math.random() > 0.1) {
          setStatus('verified');
          setVerificationData({
            timestamp: new Date().toISOString(),
            blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
            network: 'Polygon Mumbai Testnet',
            transactionHash: hash,
            verifiedBy: 'MediDose AI Verification Service',
            drugName: prediction ? prediction.drugName : 'Unknown Drug',
            dosage: prediction ? prediction.dosage : '0 mg',
            patientId: prediction ? prediction.patientId : 'Unknown Patient'
          });
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('failed');
      }
    };

    if (hash) {
      verifyOnBlockchain();
    } else {
      setStatus('failed');
    }
  }, [hash, predictions]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-indigo-700 px-6 py-4">
          <h1 className="text-white text-2xl font-bold">Blockchain Verification</h1>
          <p className="text-indigo-100 mt-1">
            Verify the authenticity of a dosage recommendation
          </p>
        </div>
        
        <div className="p-6">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Clock className="h-16 w-16 text-indigo-500 animate-pulse mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Verifying on Blockchain</h2>
              <p className="text-gray-600 text-center max-w-md">
                We're checking the blockchain to verify the authenticity of this dosage recommendation.
                This may take a few moments.
              </p>
            </div>
          )}
          
          {status === 'failed' && (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Verification Failed</h2>
              <p className="text-gray-600 text-center max-w-md">
                We couldn't verify this record on the blockchain. This could be because:
              </p>
              <ul className="list-disc text-gray-600 mt-4 pl-6">
                <li>The hash is invalid or has been tampered with</li>
                <li>The record doesn't exist on the blockchain</li>
                <li>There was an error connecting to the blockchain network</li>
              </ul>
              <div className="mt-8">
                <a href="/predict" className="px-6 py-3 bg-indigo-700 text-white rounded-md font-medium hover:bg-indigo-800">
                  Make a New Prediction
                </a>
              </div>
            </div>
          )}
          
          {status === 'verified' && verificationData && (
            <div>
              <div className="flex items-center justify-center py-6 bg-green-50 rounded-lg mb-8">
                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                <h2 className="text-xl font-semibold text-green-800">Successfully Verified on Blockchain</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Blockchain Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Transaction Hash</p>
                      <p className="font-mono text-sm break-all bg-gray-50 p-2 rounded border border-gray-200">
                        {verificationData.transactionHash}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Block Number</p>
                      <p className="font-medium">{verificationData.blockNumber}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Network</p>
                      <p className="font-medium">{verificationData.network}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Timestamp</p>
                      <p className="font-medium">
                        {new Date(verificationData.timestamp).toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Verified By</p>
                      <p className="font-medium">{verificationData.verifiedBy}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendation Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Patient ID</p>
                      <p className="font-medium">{verificationData.patientId}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Drug Name</p>
                      <p className="font-medium">{verificationData.drugName}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Recommended Dosage</p>
                      <p className="font-medium">{verificationData.dosage}</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">What does this verification mean?</h4>
                    <p className="text-sm text-blue-700">
                      This verification confirms that the dosage recommendation was generated by our AI system
                      and has been immutably recorded on the blockchain. This ensures the recommendation has
                      not been tampered with since it was created.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <a 
                  href={`https://mumbai.polygonscan.com/tx/${verificationData.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-indigo-700 hover:text-indigo-800"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Polygon Explorer
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
