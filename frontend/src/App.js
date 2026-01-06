import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Forum from './components/Forum';
import DMs from './components/DMs';
import Admin from './components/Admin';

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      // Verify token and get user
      axios.get('/api/auth/me').then(res => setUser(res.data)).catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} logout={logout} />
        <Routes>
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/" element={<Forum user={user} />} />
          <Route path="/dms" element={<DMs user={user} />} />
          <Route path="/admin" element={<Admin user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;