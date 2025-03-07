import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Shield, Database, Activity, Zap, Users } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About MediDose AI</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Revolutionizing personalized medicine through AI and blockchain technology
        </p>
      </div>
      
      {/* Mission Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-16">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Medical Research" 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              At MediDose AI, we're committed to enhancing patient safety and treatment efficacy through 
              personalized medicine. Our platform combines cutting-edge machine learning with blockchain 
              technology to provide healthcare professionals with accurate, transparent, and secure drug 
              dosage recommendations.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By analyzing individual patient characteristics including age, weight, genetic markers, and 
              medical history, our AI models can predict optimal drug dosages with high confidence. Every 
              prediction is securely recorded on the blockchain, ensuring complete transparency and 
              auditability throughout the treatment process.
            </p>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Database className="h-8 w-8 text-indigo-700" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Data Collection & Processing</h3>
            <p className="text-gray-600">
              Our system collects relevant patient data including age, weight, height, gender, genetic markers, 
              and medical history. This data is securely processed and anonymized to protect patient privacy.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Brain className="h-8 w-8 text-indigo-700" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">AI Analysis & Prediction</h3>
            <p className="text-gray-600">
              Our machine learning models analyze the processed data to determine the optimal drug dosage 
              for the individual patient. The models are trained on extensive synthetic and real-world data 
              to ensure high accuracy.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-indigo-700" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Blockchain Verification</h3>
            <p className="text-gray-600">
              Each dosage recommendation is digitally signed and recorded on the blockchain, creating an 
              immutable record that can be verified at any time. This ensures complete transparency and 
              builds trust in the recommendation process.
            </p>
          </div>
        </div>
      </div>
      
      {/* Technology Stack */}
      <div className="bg-indigo-700 text-white rounded-lg shadow-lg p-8 mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Technology Stack</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Brain className="h-6 w-6 mr-2" />
              Machine Learning
            </h3>
            <ul className="space-y-2 text-indigo-100">
              <li>• TensorFlow.js for in-browser model execution</li>
              <li>• Ridge and Lasso regression for dosage prediction</li>
              <li>• Feature engineering to capture non-linear relationships</li>
              <li>• Continuous learning from feedback loops</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2" />
              Blockchain Integration
            </h3>
            <ul className="space-y-2 text-indigo-100">
              <li>• Ethereum and Polygon smart contracts</li>
              <li>• Immutable logging of prediction hashes</li>
              <li>• Transparent verification system</li>
              <li>• Access control for healthcare professionals</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Zap className="h-6 w-6 mr-2" />
              Web Technologies
            </h3>
            <ul className="space-y-2 text-indigo-100">
              <li>• React for responsive user interface</li>
              <li>• RESTful APIs for backend communication</li>
              <li>• Web3.js for blockchain interaction</li>
              <li>• Real-time data visualization</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Activity className="h-6 w-6 mr-2" />
              Data Security
            </h3>
            <ul className="space-y-2 text-indigo-100">
              <li>• End-to-end encryption for sensitive data</li>
              <li>• HIPAA-compliant data handling</li>
              <li>• Anonymization of patient information</li>
              <li>• Secure API endpoints</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Team</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="mb-4">
              <Users className="h-12 w-12 text-indigo-700 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Tharunsai Nannuri</h3>
            <p className="text-indigo-700 mb-4">Frontend developer</p>
            <p className="text-gray-600">
              Expert frontend developer with expertise in react and nodejs.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="mb-4">
              <Brain className="h-12 w-12 text-indigo-700 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Ayush Pallav</h3>
            <p className="text-indigo-700 mb-4">FullStack Developer</p>
            <p className="text-gray-600">
               Machine Learning focused on healthcare applications and predictive modeling.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="mb-4">
              <Shield className="h-12 w-12 text-indigo-700 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Raajavel R</h3>
            <p className="text-indigo-700 mb-4">Blockchain Architect</p>
            <p className="text-gray-600">
              Specialist in blockchain technology with extensive experience in healthcare data security.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="mb-4">
              <Zap className="h-12 w-12 text-indigo-700 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Rohan Singh</h3>
            <p className="text-indigo-700 mb-4">Software Engineer</p>
            <p className="text-gray-600">
              Expert in full-stack development with a passion for building scalable, robust applications.
            </p>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Experience the Future of Personalized Medicine?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join us in revolutionizing healthcare through AI-powered dosage recommendations and blockchain verification.
        </p>
        <Link 
          to="/predict" 
          className="bg-indigo-700 text-white px-8 py-4 rounded-md font-medium text-lg hover:bg-indigo-800 transition inline-block"
        >
          Try MediDose AI Today
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
