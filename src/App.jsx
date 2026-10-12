import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Theory from './pages/Theory';
import Interview from './pages/Interview';

function App() {
  return (
    <Router>
      <div className="app-shell">
        <div className="container app-header">
          <Navbar />
        </div>
        <div className="app-main">
          <Routes>
            <Route
              path="/"
              element={
                <div className="page-scroll">
                  <div className="container">
                    <Home />
                  </div>
                </div>
              }
            />
            <Route path="/theory" element={<Theory />} />
            <Route path="/interview" element={<div className="page-scroll"><Interview /></div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
