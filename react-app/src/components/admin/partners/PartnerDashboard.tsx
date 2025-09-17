// Fachpartner-Dashboard mit Navigation
import React, { useState } from 'react';
import { Building2, Package, Plus, Users, Star, TrendingUp } from 'lucide-react';
import ProductCatalog from '../products/ProductCatalog';
import PartnerManagementSimple from './PartnerManagementSimple';
import './partners-simple.css';

const PartnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('partners');

  return (
    <div className="partner-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Fachpartner-Verwaltung</h1>
        <p className="dashboard-subtitle">Verwalten Sie Ihre Hersteller-Partnerschaften und Produktkataloge</p>
      </div>

      {/* Navigation Tabs */}
      <div className="partner-navigation" style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '2rem' }}>
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
            Produktkatalog
          </button>
        </div>
      </div>

      {/* Fachpartner Tab */}
      {activeTab === 'partners' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Linke Spalte: Partner-Übersicht */}
          <div className="lg:col-span-2">
            <PartnerManagementSimple />
          </div>

          {/* Rechte Spalte: Quick Stats */}
          <div className="space-y-6">
            {/* Partner Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Partner-Statistiken</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Aktive Partner</div>
                      <div className="text-sm text-gray-500">Hersteller</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">2</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Package size={20} className="text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Produkte</div>
                      <div className="text-sm text-gray-500">Im Katalog</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">6</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Star size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Premium Partner</div>
                      <div className="text-sm text-gray-500">Buderus & Viessmann</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">2</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <TrendingUp size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium">Lagerwert</div>
                      <div className="text-sm text-gray-500">Gesamter Bestand</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">€245k</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Schnellaktionen</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Plus size={16} className="text-blue-600" />
                  <div>
                    <div className="font-medium">Neuer Partner</div>
                    <div className="text-sm text-gray-500">Hersteller hinzufügen</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Package size={16} className="text-green-600" />
                  <div>
                    <div className="font-medium">Produkt hinzufügen</div>
                    <div className="text-sm text-gray-500">Zum Katalog</div>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Users size={16} className="text-purple-600" />
                  <div>
                    <div className="font-medium">Kontakte verwalten</div>
                    <div className="text-sm text-gray-500">Ansprechpartner</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Produktkatalog Tab */}
      {activeTab === 'products' && (
        <ProductCatalog />
      )}
    </div>
  );
};

export default PartnerDashboard;
