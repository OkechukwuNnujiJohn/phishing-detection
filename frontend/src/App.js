// import React from 'react';
// import HomePage from './pages/HomePage.js';

// const App = () => {
//   return (
//     <div>
//       <h1>Phishing Detection App</h1>
//       <HomePage />
//     </div>
//   );
// };

// export default App;
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
