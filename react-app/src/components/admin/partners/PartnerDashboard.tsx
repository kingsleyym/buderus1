import React, { useState } from 'react';
import { Package, Building2 } from 'lucide-react';
import PartnerManagement from './PartnerManagement';
import ProductCatalog from '../products/ProductCatalog';

const PartnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'partners' | 'products'>('partners');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Navigation Tabs */}
      <div className="admin-navigation" style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setActiveTab('partners')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderBottom: activeTab === 'partners' ? '2px solid #3b82f6' : '2px solid transparent',
              background: 'none',
              color: activeTab === 'partners' ? '#3b82f6' : '#6b7280',
              fontWeight: activeTab === 'partners' ? '600' : '400',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Building2 size={16} />
            Fachpartner
          </button>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderBottom: activeTab === 'products' ? '2px solid #3b82f6' : '2px solid transparent',
              background: 'none',
              color: activeTab === 'products' ? '#3b82f6' : '#6b7280',
              fontWeight: activeTab === 'products' ? '600' : '400',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Package size={16} />
            Produkte
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'partners' && <PartnerManagement />}
      {activeTab === 'products' && <ProductCatalog />}
    </div>
  );
};

export default PartnerDashboard;