import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LandingPage from './pages/LandingPage/LandingPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import './App.css';
import 'bulma/css/bulma.min.css';
import { createFhevmInstance, init } from './fhevmjs';

const App: React.FC = () => {
  useEffect(() => {
    async function initializeLibrary() {
      await init();
      await createFhevmInstance();
      console.log('fhevm init done');
    }
  
    initializeLibrary();
  }, []);

  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
