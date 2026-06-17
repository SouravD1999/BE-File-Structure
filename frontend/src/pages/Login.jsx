import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';
import './Pages.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/users/login', { email });
      login(response.data.token); // Store token globally
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login to Dashboard</h2>
        {error && <div className="error-alert">{error}</div>}
        <input 
          type="email" 
          placeholder="Enter email (e.g. rohan@tcs.com)" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}