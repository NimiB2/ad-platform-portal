import React, { useState } from 'react';
import { loginUser, registerUser, checkEmailExists } from '../api';
import axios from 'axios';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isDeveloperLogin, setIsDeveloperLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      
      if (isDeveloperLogin) {
        // Developer login logic
        const response = await axios.post('/api/developers/login', { email });
        
        if (response.data.exists) {
          // Store developer info
          localStorage.setItem('currentUser', email);
          localStorage.setItem('isDeveloper', 'true');
          localStorage.setItem('developerId', response.data.developerId);
          onLogin(email);
        } else {
          setError('Developer not found');
        }
      } else {
        // Regular user login/registration
        // Check if email exists
        const emailExists = await checkEmailExists(email);
        
        if (isLogin) {
          // Login flow
          if (emailExists) {
            // Email exists, proceed with login
            await loginUser(email);
            onLogin(email);
          } else {
            // Email doesn't exist, show error
            setError('User not found. Please check your email or register.');
          }
        } else {
          // Registration flow
          if (emailExists) {
            // Email exists, prevent registration
            setError('This email is already registered. Please login instead.');
          } else {
            // Email doesn't exist, proceed with registration
            await registerUser(name, email);
            onLogin(email);
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>{isDeveloperLogin ? 'Developer Login' : (isLogin ? 'Login' : 'Register')}</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {!isLogin && !isDeveloperLogin && (
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin && !isDeveloperLogin}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
        )}
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: isDeveloperLogin ? '#673AB7' : '#4CAF50',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginRight: '10px'
            }}
          >
            {loading ? 'Processing...' : (isDeveloperLogin ? 'Developer Login' : (isLogin ? 'Login' : 'Register'))}
          </button>
          
          {!isDeveloperLogin && (
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{
                backgroundColor: '#2196F3',
                color: 'white',
                padding: '10px 15px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {isLogin ? 'Need to Register?' : 'Back to Login'}
            </button>
          )}
        </div>
        
        {/* Developer Login Button */}
        <button
          type="button"
          onClick={() => {
            setIsDeveloperLogin(!isDeveloperLogin);
            setIsLogin(true); // Reset to login mode when toggling
          }}
          style={{
            backgroundColor: '#9C27B0',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '15px',
            width: '100%'
          }}
        >
          {isDeveloperLogin ? 'Back to Regular Login' : 'Login as Developer'}
        </button>
      </form>
    </div>
  );
};

export default Auth;