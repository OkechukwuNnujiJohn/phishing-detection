import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import HomePage from './pages/HomePage';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => setIsAuthenticated(true);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <HomePage /> : <Login onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
};

export default App;
