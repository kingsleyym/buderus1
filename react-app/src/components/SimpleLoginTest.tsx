import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const SimpleLoginTest: React.FC = () => {
  const [email, setEmail] = useState('lucakingsley@gmail.com');
  const [password, setPassword] = useState('');
  const { login, user, profile, loading, isAuthenticated, isAdmin } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
      alert('Login erfolgreich!');
    } catch (error) {
      alert(`Login fehlgeschlagen: ${error}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>🧪 Login Test</h2>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5' }}>
        <strong>DEBUG INFO:</strong><br/>
        Loading: {loading ? 'Ja' : 'Nein'}<br/>
        Authenticated: {isAuthenticated() ? 'Ja' : 'Nein'}<br/>
        User: {user?.email || 'Nicht eingeloggt'}<br/>
        Profile Role: {profile?.role || 'Kein Profil'}<br/>
        Is Admin: {isAdmin() ? 'Ja' : 'Nein'}<br/>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Email:</label><br/>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Passwort:</label><br/>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <button 
        onClick={handleLogin}
        disabled={loading}
        style={{ 
          width: '100%', 
          padding: '10px', 
          backgroundColor: '#007bff', 
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        {loading ? 'Anmelden...' : 'Anmelden'}
      </button>
    </div>
  );
};

export default SimpleLoginTest;
