import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/admin-clean.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { user, isAuthenticated, loading, profile, isAdmin } = useAuth();

  // Debugging
  console.log('🔒 AdminLayout Auth Status:', {
    loading,
    isAuthenticated: isAuthenticated(),
    userEmail: user?.email,
    profileRole: profile?.role,
    isAdmin: isAdmin()
  });

  // Loading state
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>🔄 Lade...</div>
      </div>
    );
  }

  // Nicht angemeldet - ZEIGE WARNUNG statt Redirect
  if (!isAuthenticated()) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '20px' }}>
        <h2>🔒 Nicht angemeldet</h2>
        <p>Sie müssen sich anmelden, um auf das Admin-Dashboard zuzugreifen.</p>
        <button 
          onClick={() => {
            const loginUrl = window.location.hostname.includes('localhost')
              ? 'http://localhost:3000'
              : 'https://login-helios-energy-8752e.web.app';
            window.location.href = loginUrl;
          }}
          style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007cba', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Zur Anmeldung
        </button>
      </div>
    );
  }

  // Angemeldet aber kein Admin
  if (!isAdmin()) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '20px' }}>
        <h2>⚠️ Keine Admin-Berechtigung</h2>
        <p>Sie sind als <strong>{user?.email}</strong> angemeldet, haben aber keine Admin-Berechtigung.</p>
        <p>Ihre Rolle: <strong>{profile?.role || 'Unbekannt'}</strong></p>
        <button 
          onClick={() => {
            const loginUrl = window.location.hostname.includes('localhost')
              ? 'http://localhost:3000'
              : 'https://login-helios-energy-8752e.web.app';
            window.location.href = loginUrl;
          }}
          style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007cba', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Neu anmelden
        </button>
      </div>
    );
  }

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  return (
    <div className="admin-body">
      {/* Mobile Navigation Toggle */}
      <button
        className="mobile-nav-toggle"
        id="mobileNavToggle"
        onClick={toggleMobileNav}
      >
        ☰
      </button>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${isMobileNavOpen ? 'active' : ''}`}
        id="sidebarOverlay"
        onClick={toggleMobileNav}
      ></div>

      <div className="admin-dashboard">
        <AdminSidebar isOpen={isMobileNavOpen} />

        {/* Main Content */}
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
