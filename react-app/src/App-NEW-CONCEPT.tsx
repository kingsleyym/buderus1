// Domain-basierte Routing Strategie für React App
// Erkennt automatisch die Domain und lädt den entsprechenden Bereich

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth Components
import LoginPage from './pages/auth/LoginPage';

// Admin Components (bereits vorhanden)
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminEmployees from './components/admin/employees/AdminEmployees';
import MarketingDashboard from './components/admin/marketing/MarketingDashboard';
import LeadsListAdvanced from './components/admin/leads/LeadsListAdvanced';
import PartnerDashboard from './components/admin/partners/PartnerDashboard';
import ProductCatalog from './components/admin/products/ProductCatalog';

import './App.css';

function App() {
  // Domain-Detection
  const hostname = window.location.hostname;
  
  // Development: localhost routing mit /admin, /employee etc.
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return (
      <Router>
        <Routes>
          {/* Development Route Selection */}
          <Route path="/login/*" element={<LoginPage />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/employee/*" element={<div>Employee Dashboard - Coming Soon</div>} />
          <Route path="/" element={<LoginPage />} /> {/* Default zu Login */}
        </Routes>
      </Router>
    );
  }
  
  // Production: Domain-based routing
  if (hostname === 'admin.helios-nrg.de' || hostname.includes('admin-helios-nrg')) {
    return <AdminRoutes />;
  }
  
  if (hostname === 'employee.helios-nrg.de' || hostname.includes('employee-helios-nrg')) {
    return <div>Employee Dashboard - Coming Soon</div>;
  }
  
  if (hostname === 'login.helios-nrg.de' || hostname.includes('login-helios-nrg')) {
    return <LoginPage />;
  }
  
  // Fallback
  return <div>Domain nicht erkannt: {hostname}</div>;
}

// Admin Routes (für admin.helios-energy.de)
function AdminRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        } />
        
        <Route path="/marketing/*" element={
          <AdminLayout>
            <MarketingDashboard />
          </AdminLayout>
        } />
        
        <Route path="/leads" element={
          <AdminLayout>
            <LeadsListAdvanced />
          </AdminLayout>
        } />
        
        <Route path="/fachpartner" element={
          <AdminLayout>
            <PartnerDashboard />
          </AdminLayout>
        } />
        
        <Route path="/products" element={
          <AdminLayout>
            <ProductCatalog />
          </AdminLayout>
        } />
        
        <Route path="/employees" element={
          <AdminLayout>
            <AdminEmployees />
          </AdminLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
