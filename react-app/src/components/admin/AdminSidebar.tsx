import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  PenTool, 
  Users, 
  QrCode, 
  UserCheck, 
  Gift, 
  TrendingUp,
  LogOut,
  ChevronDown,
  ChevronRight,
  Megaphone,
  Send,
  UserPlus,
  Building2
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['marketing']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const mainNavItems = [
    { path: '/', icon: BarChart3, label: 'Dashboard' },
    { path: '/leads', icon: UserPlus, label: 'Leads' },
    { path: '/fachpartner', icon: Building2, label: 'Fachpartner' },
    { path: '/employees', icon: UserCheck, label: 'Mitarbeiter' },
    { path: '/products', icon: Users, label: 'Produkte' },
    { path: '/qr-codes', icon: QrCode, label: 'QR-Codes' },
    { path: '/analytics', icon: TrendingUp, label: 'Analytics' },
  ];

  const marketingItems = [
    { path: '/marketing/newsletter-editor', icon: PenTool, label: 'Newsletter erstellen' },
    { path: '/marketing/subscribers', icon: Users, label: 'Abonnenten' },
    { path: '/marketing/campaigns', icon: Send, label: 'Kampagnen' },
    { path: '/marketing/rewards', icon: Gift, label: 'Belohnungen' },
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
        {/* Main Navigation */}
        {mainNavItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <IconComponent size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Marketing Section */}
        <div className="nav-section">
          {/* Marketing Main Link */}
          <Link
            to="/admin/marketing"
            className={`nav-item ${location.pathname.startsWith('/admin/marketing') ? 'active' : ''}`}
            style={{ marginBottom: '0.5rem' }}
          >
            <Megaphone size={18} />
            <span>Marketing</span>
          </Link>
          
          {/* Marketing Submenu Toggle */}
          <button 
            className={`nav-section-header ${expandedSections.includes('marketing') ? 'expanded' : ''}`}
            onClick={() => toggleSection('marketing')}
            style={{ paddingLeft: '2rem', fontSize: '0.8rem' }}
          >
            <div className="nav-section-title">
              <span>Bereiche</span>
            </div>
            {expandedSections.includes('marketing') ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>
          
          {expandedSections.includes('marketing') && (
            <div className="nav-section-items">
              {marketingItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-item nav-sub-item ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <IconComponent size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
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
