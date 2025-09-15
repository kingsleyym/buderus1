import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import '../../styles/admin-clean.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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
