// src/Login.jsx
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    

    // Check the credentials
    if (username === 'principal@bitsathy.ac.in' && password === 'principal') {
      navigate('/principal');
    } else if (username === 'dean@bitsathy.ac.in' && password === 'dean') {
      navigate('/dean');
    } else if (username === 'mteam@bitsathy.ac.in' && password === 'mteam') {
      navigate('/mteam');
    }else if (username === 'management@bitsathy.ac.in' && password === 'management') {
      navigate('/management');
    } else {
      try {
        const response = await axios.get('http://localhost:8801/login/check', {
          params: {
            userEmail: username
          }
        });

        if (response.data) { // Response is true
          navigate(`/dashboard/${username}`);
        } else {
          alert('Invalid email address');
        }
      } catch (err) {
        console.error('Error checking email:', err);
        alert('Failed to check email');
      }
    }

    setPassword('');
    setUsername('');
  };

  const handleGoogleLogin = (response) => {
    // Handle the Google login response
    console.log('Google Login Response:', response);

    // You should send the response token to your backend server for verification and user session management
    // Example:
    // fetch('/auth/google', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ token: response.credential }),
    // })
    // .then(res => res.json())
    // .then(data => {
    //   if (data.success) {
    //     navigate('/some-page');
    //   } else {
    //     console.log('Google login failed');
    //   }
    // })
    // .catch(error => console.error('Error:', error));
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="email"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div className="google-login">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={(error) => console.error('Google Login Error:', error)}
        />
      </div>
    </div>
  );
};

export default Login;
