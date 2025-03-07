import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';


import Navbar from './components/Navbar';
import Footer from './components/Footer';


import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import PredictionForm from './pages/PredictionForm';
import Results from './pages/Results';
import VerificationPage from './pages/VerificationPage';
import AboutPage from './pages/AboutPage';


import { PredictionProvider } from './context/PredictionContext';

function App() {
  return (
    <PredictionProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/predict" element={<PredictionForm />} />
              <Route path="/results/:id" element={<Results />} />
              <Route path="/verify/:hash" element={<VerificationPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </PredictionProvider>
  );
}

export default App;
