// src/pages/LoginPage.tsx
import React, { useEffect, useState } from 'react';
import { useFirebase } from '../contexts/FirebaseProvider';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login, user, googleLogin } = useFirebase();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   if (user) {
  //     navigate('/dashboard');
  //   }
  // }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard'); // Redirect to a protected route after successful login
    } catch (error) {
      setError('Failed to log in. Please check your email and password.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to log in with Google.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </label>
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Login</button>
      </form>

      <hr style={{ margin: '2rem 0' }} />

      <button
        onClick={handleGoogleLogin}
        style={{
          backgroundColor: '#4285F4',
          color: 'white',
          padding: '0.5rem 1rem',
          width: '100%',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Login with Google
      </button>
    </div>
  );
};

export default LoginPage;
