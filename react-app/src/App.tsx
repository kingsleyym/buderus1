// Domain-basierte Routing für Helios NRG
// Bestehende Admin-Routen bleiben, aber auf Subdomain
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth Components
import LoginPage from './pages/auth/LoginPage';
import { useAuth } from './hooks/useAuth';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminEmployees from './components/admin/employees/AdminEmployees';
import MarketingDashboard from './components/admin/marketing/MarketingDashboard';
import LeadsListAdvanced from './components/admin/leads/LeadsListAdvanced';
import PartnerDashboard from './components/admin/partners/PartnerDashboard';
import ProductCatalog from './components/admin/products/ProductCatalog';
import './App.css';

// Admin Routes - zeigt Login oder Dashboard basierend auf Auth-Status
const AdminRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Root Route - zeigt Login oder Dashboard */}
        <Route path="/" element={<AdminAuthChecker />} />
        
        {/* Explizite Login Route */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Dashboard Routes (nur wenn angemeldet) */}
        <Route path="/dashboard" element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        } />
        
        {/* Marketing Routes */}
        <Route path="/marketing/*" element={
          <AdminLayout>
            <MarketingDashboard />
          </AdminLayout>
        } />
        
        {/* Leads Routes */}
        <Route path="/leads" element={
          <AdminLayout>
            <LeadsListAdvanced />
          </AdminLayout>
        } />
        
        {/* Products Route */}
        <Route path="/products" element={
          <AdminLayout>
            <ProductCatalog />
          </AdminLayout>
        } />

        {/* Partners Route */}
        <Route path="/partners" element={
          <AdminLayout>
            <PartnerDashboard />
          </AdminLayout>
        } />

        {/* Employee Management */}
        <Route path="/employees" element={
          <AdminLayout>
            <AdminEmployees />
          </AdminLayout>
        } />
      </Routes>
    </Router>
  );
};

// Auth Checker Component - entscheidet zwischen Login und Dashboard
const AdminAuthChecker: React.FC = () => {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>� Lade...</div>
      </div>
    );
  }
  
  // Nicht angemeldet oder kein Admin → Login Page
  if (!isAuthenticated() || !isAdmin()) {
    return <LoginPage />;
  }
  
  // Angemeldet als Admin → Dashboard
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
};

function App() {
  // Domain-Detection
  const hostname = window.location.hostname;
  const urlParams = new URLSearchParams(window.location.search);
  const isAdmin = urlParams.get('admin') === 'true';
  const isEmployee = urlParams.get('employee') === 'true';

  console.log('🌐 Current hostname:', hostname);
  console.log('🔧 URL params:', { isAdmin, isEmployee });

  // ADMIN DOMAIN - zeigt Login oder Dashboard basierend auf Auth-Status
  if (hostname === 'admin.localhost' ||
    hostname === 'admin.helios-nrg.de' ||
    hostname.includes('admin-helios') ||
    hostname.startsWith('admin-')) {
    console.log('🔧 Admin domain detected - showing admin system');
    return <AdminRoutes />;
  }

  // SAME-DOMAIN ROUTING mit URL-Parametern (für Fallback)
  if (isAdmin) {
    console.log('🔧 Showing AdminRoutes due to ?admin=true parameter');
    return <AdminRoutes />;
  }
  
  if (isEmployee) {
    console.log('🔧 Showing EmployeeRoutes due to ?employee=true parameter');
    return <div>Employee Dashboard - Coming Soon</div>;
  }

  // EMPLOYEE DOMAIN
  if (hostname === 'employee.localhost' ||
    hostname === 'employee.helios-nrg.de' ||
    hostname.includes('employee-helios') ||
    hostname.startsWith('employee-')) {
    return <div>Employee Dashboard - Coming Soon</div>;
  }

  // FALLBACK für localhost ohne Subdomain
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        color: 'white'
      }}>
        <h1>🚀 Helios NRG - Subdomain Setup</h1>
        <p>Bitte verwende eine der Subdomains:</p>
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <a
            href="http://login.localhost:3003"
            style={{
              padding: '1rem 2rem',
              background: 'white',
              color: '#333',
              textDecoration: 'none',
              borderRadius: '8px',
              minWidth: '300px'
            }}
          >
            🔐 login.localhost:3003
          </a>
          <a
            href="http://admin.localhost:3003"
            style={{
              padding: '1rem 2rem',
              background: 'white',
              color: '#333',
              textDecoration: 'none',
              borderRadius: '8px',
              minWidth: '300px'
            }}
          >
            ⚡ admin.localhost:3003
          </a>
          <a
            href="http://employee.localhost:3003"
            style={{
              padding: '1rem 2rem',
              background: 'white',
              color: '#333',
              textDecoration: 'none',
              borderRadius: '8px',
              minWidth: '300px'
            }}
          >
            👥 employee.localhost:3003
          </a>
        </div>
        <div style={{ marginTop: '2rem', fontSize: '0.9rem', opacity: 0.8 }}>
          <p>📝 Hosts-Datei Setup erforderlich:</p>
          <code style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '4px' }}>
            sudo nano /etc/hosts
          </code>
        </div>
      </div>
    );
  }

  // Unbekannte Domain
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Domain nicht erkannt</h1>
      <p>Hostname: <strong>{hostname}</strong></p>
      <p>Bitte verwende: login.localhost, admin.localhost oder employee.localhost</p>
    </div>
  );
}


export default App;
