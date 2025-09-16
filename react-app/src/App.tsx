import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminEmployees from './components/admin/employees/AdminEmployees';
import MarketingDashboard from './components/admin/marketing/MarketingDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          } />
          
          {/* Marketing Routes */}
          <Route path="/admin/marketing/*" element={
            <AdminLayout>
              <MarketingDashboard />
            </AdminLayout>
          } />
          
          {/* Other Admin Routes */}
          <Route path="/admin/qr-codes" element={
            <AdminLayout>
              <div>QR-Codes - Coming Soon</div>
            </AdminLayout>
          } />
          
          <Route path="/admin/employees" element={
            <AdminLayout>
              <AdminEmployees />
            </AdminLayout>
          } />
          
          <Route path="/admin/analytics" element={
            <AdminLayout>
              <div>Analytics - Coming Soon</div>
            </AdminLayout>
          } />
          
          <Route path="/admin/rewards" element={
            <AdminLayout>
              <div>Rewards - Coming Soon</div>
            </AdminLayout>
          } />
          
          <Route path="/admin/analytics" element={
            <AdminLayout>
              <div>Analytics - Coming Soon</div>
            </AdminLayout>
          } />
          
          {/* Default Route */}
          <Route path="/" element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h1>Buderus Systeme - React Migration</h1>
              <p>Admin Dashboard: <a href="/admin">/admin</a></p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
