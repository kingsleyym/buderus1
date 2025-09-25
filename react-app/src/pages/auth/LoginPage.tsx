// Login Page für login.helios-nrg.de
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/auth.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  
  const { login, resetPassword, loading, error, isAuthenticated, profile, user, logout } = useAuth();

  // Debug logging
  useEffect(() => {
    console.log('🔄 LoginPage useEffect:', {
      isAuthenticated: isAuthenticated(),
      profile: profile?.email,
      loading,
      user: user?.email
    });
  }, [isAuthenticated, profile, loading, user]);

  // Sichere Weiterleitung nach Login - MIT Rolle-Check
  useEffect(() => {
    if (!loading && isAuthenticated() && profile) {
      console.log('✅ Login successful, checking role...', profile.role);
      
      // SICHERHEITSCHECK: Nur Admins dürfen ins Admin-Panel
      if (profile.role !== 'admin') {
        console.log('❌ Access denied: User is not admin, role:', profile.role);
        alert(`Zugriff verweigert!\n\nSie sind als "${profile.role}" angemeldet.\nNur Administratoren haben Zugriff auf diesen Bereich.`);
        
        // User ausloggen
        logout().then(() => {
          // KEIN RELOAD - nur zur Login-Seite
          console.log('🔄 User logged out, staying on login page');
        }).catch((error: any) => {
          console.error('Logout error:', error);
        });
        return;
      }
      
      // Nur echte Admins kommen hier hin
      console.log('✅ Admin access granted, redirecting to dashboard...');
      
      // Bleibe auf derselben Domain, gehe nur zur Root
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated, profile, loading, logout]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    try {
      console.log('🔄 Calling login function...');
      await login(email, password);
      console.log('✅ Login successful!');
      
      // Weiterleitung wird durch useEffect gehandhabt, das auf profile wartet
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      // Error wird durch useAuth Hook gehandhabt
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      return;
    }

    try {
      await resetPassword(resetEmail);
      setResetSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
    }
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Anmeldung wird überprüft...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img 
            src="/assets/logo.png" 
            alt="Helios NRG" 
            className="auth-logo"
          />
          <h1>Anmelden</h1>
          <p>Helios NRG Dashboard</p>
        </div>

        {!showForgotPassword ? (
          // Login Form
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">E-Mail-Adresse</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ihre.email@helios-nrg.de"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Passwort</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Ihr Passwort"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading || !email || !password}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Anmelden...
                </>
              ) : (
                'Anmelden'
              )}
            </button>

            <div className="auth-links">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="link-button"
              >
                Passwort vergessen?
              </button>
            </div>
          </form>
        ) : (
          // Forgot Password Form
          <form onSubmit={handleForgotPassword} className="auth-form">
            <h2>Passwort zurücksetzen</h2>
            
            {!resetSent ? (
              <>
                <div className="form-group">
                  <label htmlFor="resetEmail">E-Mail-Adresse</label>
                  <input
                    type="email"
                    id="resetEmail"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    placeholder="ihre.email@helios-nrg.de"
                  />
                </div>

                <button 
                  type="submit" 
                  className="auth-button"
                  disabled={loading || !resetEmail}
                >
                  {loading ? 'Wird gesendet...' : 'Reset-Link senden'}
                </button>
              </>
            ) : (
              <div className="success-message">
                <p>
                  Ein Link zum Zurücksetzen des Passworts wurde an {resetEmail} gesendet.
                </p>
                <p>
                  Überprüfen Sie Ihren Posteingang und folgen Sie den Anweisungen.
                </p>
              </div>
            )}

            <div className="auth-links">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetSent(false);
                  setResetEmail('');
                }}
                className="link-button"
              >
                ← Zurück zur Anmeldung
              </button>
            </div>
          </form>
        )}

        <div className="auth-footer">
          <p>&copy; 2025 Helios NRG - Sicherer Anmeldebereich</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
