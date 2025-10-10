import React from 'react'
import { useState } from 'react';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'nlc') {
      setIsLoggedIn(true);
      setError('');
    } else {
        setIsLoggedIn(false);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      {isLoggedIn ? (
        <div className="welcome-message">
          <h2>Welcome to NLC Maintenance and Service</h2>
          <p>You are successfully logged in!</p>
          <a href="/dashboard" className="dashboard-link">Go to Dashboard</a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="login-form">
          <h2>NLC Maintance and Service</h2>
          {error && <p className="error">{error}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  )
}

export default Login