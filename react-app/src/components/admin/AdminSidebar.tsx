import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  PenTool, 
  Users, 
  Mail, 
  QrCode, 
  UserCheck, 
  Gift, 
  TrendingUp,
  LogOut
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen }) => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', icon: BarChart3, label: 'Dashboard' },
    { path: '/admin/newsletter-editor', icon: PenTool, label: 'Newsletter erstellen' },
    { path: '/admin/subscribers', icon: Users, label: 'Abonnenten' },
    { path: '/admin/campaigns', icon: Mail, label: 'Kampagnen' },
    { path: '/admin/qr-codes', icon: QrCode, label: 'QR-Codes' },
    { path: '/admin/employees', icon: UserCheck, label: 'Mitarbeiter' },
    { path: '/admin/rewards', icon: Gift, label: 'Belohnungen' },
    { path: '/admin/analytics', icon: TrendingUp, label: 'Statistiken' },
  ];

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log('Logout clicked');
  };

  return (
    <nav className={`admin-sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <img src="/assets/logo.png" alt="Buderus Systeme" className="sidebar-logo" />
        <h2 className="sidebar-title">Admin Dashboard</h2>
        <p className="sidebar-subtitle">Newsletter Management</p>
      </div>
      
      <div className="sidebar-nav">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <IconComponent size={18} className="nav-icon" /> {item.label}
            </Link>
          );
        })}
      </div>
      
      <div className="sidebar-footer">
        <button id="logoutBtn" className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} className="nav-icon" /> Abmelden
        </button>
      </div>
    </nav>
  );
};

export default AdminSidebar;
