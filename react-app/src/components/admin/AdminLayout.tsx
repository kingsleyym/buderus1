import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/admin-clean.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      // Redirect to login domain
      const currentHost = window.location.hostname;
      if (currentHost.includes('localhost')) {
        window.location.href = 'http://login.localhost:3000';
      } else if (currentHost.includes('helios-energy')) {
        window.location.href = 'https://login-helios-energy-8752e.web.app';
      } else {
        window.location.href = 'https://login.helios-energy.de';
      }
    }
    
    // Check if user has admin role
    if (!loading && isAuthenticated() && user?.role !== 'admin') {
      alert('Zugriff verweigert: Sie benötigen Administrator-Rechte.');
      window.location.href = '/unauthorized';
    }
  }, [loading, isAuthenticated, user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Lade...</div>
      </div>
    );
  }

  if (!isAuthenticated() || user?.role !== 'admin') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Weiterleitung...</div>
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
