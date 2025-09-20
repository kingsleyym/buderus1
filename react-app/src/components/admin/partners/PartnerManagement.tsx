import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Star,
  Grid,
  List,
  Filter,
  Award,
  TrendingUp,
  DollarSign,
  Package
} from 'lucide-react';

// Import Partner Interface von den bestehenden Mock-Daten
import { Partner, mockPartners } from '../../../data/mockPartners';

const PartnerManagement: React.FC = () => {
  // Verwende die bestehenden Mock-Daten
  const allPartners: Partner[] = mockPartners;

  // State Management
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Gefilterte Partner
  const filteredPartners = useMemo(() => {
    return allPartners.filter(partner => {
      // Aktiv Filter
      if (showOnlyActive && !partner.isActive) {
        return false;
      }
      
      // Suchbegriff Filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          partner.name.toLowerCase().includes(searchLower) ||
          partner.contactInfo.email.toLowerCase().includes(searchLower) ||
          partner.contactInfo.representative.toLowerCase().includes(searchLower) ||
          (partner.specialties && partner.specialties.some((s: string) => s.toLowerCase().includes(searchLower)))
        );
      }
      
      return true;
    });
  }, [allPartners, showOnlyActive, searchTerm]);

  // Helper Functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      notation: 'compact'
    }).format(amount);
  };

  // Statistiken
  const statistics = useMemo(() => {
    const totalPartners = allPartners.length;
    const activePartners = allPartners.filter(p => p.isActive).length;
    const totalRevenue = allPartners.reduce((sum, p) => sum + (p.performance?.orderVolume.lastYear || 0), 0);
    const avgQuality = allPartners.reduce((sum, p) => sum + (p.performance?.qualityRating || 0), 0) / totalPartners;
    
    return {
      totalPartners,
      activePartners,
      totalRevenue,
      avgQuality: avgQuality.toFixed(1),
      filteredCount: filteredPartners.length
    };
  }, [allPartners, filteredPartners]);

  const handlePartnerSelect = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowDetailsModal(true);
  };

  return (
    <div className="admin-content">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <h1 className="admin-title">Fachpartner</h1>
            <p className="admin-subtitle">
              Verwalten Sie Ihr Partnernetzwerk und deren Performance
            </p>
          </div>
          
          <div className="admin-header-actions">
            {/* View Mode Toggle */}
            <div className="view-toggle">
              <button
                onClick={() => setViewMode('grid')}
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button className="btn btn-primary">
              <Plus className="w-4 h-4" />
              <span>Neuer Partner</span>
            </button>
          </div>
        </div>

        {/* Statistiken */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-value">{statistics.totalPartners}</div>
            <div className="stat-label">Gesamt</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-success">{statistics.activePartners}</div>
            <div className="stat-label">Aktiv</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-primary">{formatCurrency(statistics.totalRevenue)}</div>
            <div className="stat-label">Jahresumsatz</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-warning">{statistics.avgQuality}</div>
            <div className="stat-label">Ø Qualität</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-info">{statistics.filteredCount}</div>
            <div className="stat-label">Gefiltert</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="admin-filter-section">
        <div className="admin-filter-header">
          <div className="admin-filter-title">
            <Filter className="w-5 h-5" />
            <h3>Filter</h3>
          </div>
        </div>

        <div className="admin-filter-content">
          {/* Suchfeld */}
          <div className="form-group">
            <label className="form-label">Suche</label>
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name, Email..."
                className="form-input search-input"
              />
            </div>
          </div>

          {/* Aktiv Filter */}
          <div className="form-group">
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="onlyActive"
                checked={showOnlyActive}
                onChange={(e) => setShowOnlyActive(e.target.checked)}
                className="form-checkbox"
              />
              <label htmlFor="onlyActive" className="checkbox-label">
                Nur aktive Partner
              </label>
            </div>
          </div>

          {/* Reset Button */}
          <div className="form-group">
            <button
              onClick={() => {
                setSearchTerm('');
                setShowOnlyActive(false);
              }}
              className="btn btn-secondary btn-sm"
            >
              Zurücksetzen
            </button>
          </div>
        </div>
      </div>

      {/* Partner Liste */}
      {filteredPartners.length === 0 ? (
        <div className="empty-state">
          <Building2 className="empty-state-icon" />
          <h3 className="empty-state-title">Keine Partner gefunden</h3>
          <p className="empty-state-text">
            Versuchen Sie, die Filter zu ändern oder zurückzusetzen.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="admin-grid">
          {filteredPartners.map((partner) => (
            <div key={partner.id} className="admin-card">
              {/* Header */}
              <div className="admin-card-header">
                <div className="admin-card-avatar">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="admin-card-info">
                  <h3 className="admin-card-name">{partner.name}</h3>
                  <div className="admin-card-meta">
                    {partner.establishedYear ? `Gegründet ${partner.establishedYear}` : 'Hersteller'}
                  </div>
                </div>
              </div>

              {/* Kontaktinfo */}
              <div className="admin-card-details">
                <div className="detail-item">
                  <Mail className="detail-icon" />
                  <span className="detail-text">{partner.contactInfo.email}</span>
                </div>
                <div className="detail-item">
                  <Phone className="detail-icon" />
                  <span className="detail-text">{partner.contactInfo.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ansprechpartner:</span>
                  <span className="detail-text">{partner.contactInfo.representative}</span>
                </div>
              </div>

              {/* Performance */}
              {partner.performance && (
                <div className="admin-card-stats">
                  <div className="stat-item">
                    <div className="stat-value">
                      {formatCurrency(partner.performance.orderVolume.lastYear)}
                    </div>
                    <div className="stat-label">Jahresumsatz</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value text-warning">
                      {partner.performance.qualityRating}
                    </div>
                    <div className="stat-label">Qualität</div>
                  </div>
                </div>
              )}

              {/* Rabatte */}
              <div className="admin-card-tags">
                <div className="tag-label">Rabatte</div>
                <div className="tags">
                  <span className="tag tag-primary">
                    Standard: {partner.discountRates.standard}%
                  </span>
                  <span className="tag tag-success">
                    Volumen: {partner.discountRates.volume}%
                  </span>
                </div>
              </div>

              {/* Aktionen */}
              <div className="admin-card-actions">
                <button
                  onClick={() => handlePartnerSelect(partner)}
                  className="btn btn-primary btn-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>Details</span>
                </button>
                <button className="btn btn-secondary btn-sm">
                  <Edit className="w-4 h-4" />
                  <span>Bearbeiten</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Partner</th>
                <th>Informationen</th>
                <th>Jahresumsatz</th>
                <th>Qualität</th>
                <th className="text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.map((partner) => (
                <tr key={partner.id}>
                  <td>
                    <div className="table-user">
                      <div className="table-user-avatar">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="table-user-info">
                        <div className="table-user-name">{partner.name}</div>
                        <div className="table-user-meta">{partner.contactInfo.representative}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="table-meta">
                      {partner.establishedYear ? `Seit ${partner.establishedYear}` : 'Hersteller'}
                    </span>
                  </td>
                  <td>
                    <span className="table-value">
                      {partner.performance ? formatCurrency(partner.performance.orderVolume.lastYear) : '-'}
                    </span>
                  </td>
                  <td>
                    <div className="table-rating">
                      <Star className="w-4 h-4 text-warning" />
                      <span className="rating-value">
                        {partner.performance?.qualityRating || '-'}
                      </span>
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="table-actions">
                      <button
                        onClick={() => handlePartnerSelect(partner)}
                        className="btn-icon btn-icon-primary"
                        title="Details anzeigen"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="btn-icon btn-icon-secondary"
                        title="Bearbeiten"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedPartner && (
        <div className="modal-overlay">
          <div className="modal modal-lg">
            <div className="modal-header">
              <h2 className="modal-title">{selectedPartner.name}</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="modal-grid">
                {/* Grunddaten */}
                <div className="info-section">
                  <h3 className="info-section-title">Grunddaten</h3>
                  <div className="info-items">
                    <div className="info-item">
                      <span className="info-label">Gegründet:</span>
                      <p className="info-value">{selectedPartner.establishedYear}</p>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Mitarbeiter:</span>
                      <p className="info-value">{selectedPartner.employees?.toLocaleString()}</p>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Jahresumsatz:</span>
                      <p className="info-value">{selectedPartner.annualRevenue ? formatCurrency(selectedPartner.annualRevenue) : '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Kontaktdaten */}
                <div className="info-section">
                  <h3 className="info-section-title">Kontakt</h3>
                  <div className="info-items">
                    <div className="info-item">
                      <Mail className="info-icon" />
                      <span className="info-value">{selectedPartner.contactInfo.email}</span>
                    </div>
                    <div className="info-item">
                      <Phone className="info-icon" />
                      <span className="info-value">{selectedPartner.contactInfo.phone}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Ansprechpartner:</span>
                      <p className="info-value">{selectedPartner.contactInfo.representative}</p>
                    </div>
                  </div>
                </div>

                {/* Performance */}
                {selectedPartner.performance && (
                  <div className="info-section info-section-full">
                    <h3 className="info-section-title">Performance</h3>
                    <div className="performance-grid">
                      <div className="performance-item">
                        <div className="performance-value">
                          {formatCurrency(selectedPartner.performance.orderVolume.lastMonth)}
                        </div>
                        <div className="performance-label">Letzter Monat</div>
                      </div>
                      <div className="performance-item">
                        <div className="performance-value">
                          {formatCurrency(selectedPartner.performance.orderVolume.lastQuarter)}
                        </div>
                        <div className="performance-label">Letztes Quartal</div>
                      </div>
                      <div className="performance-item">
                        <div className="performance-value text-warning">
                          {selectedPartner.performance.qualityRating}
                        </div>
                        <div className="performance-label">Qualitätsbewertung</div>
                      </div>
                      <div className="performance-item">
                        <div className="performance-value text-primary">
                          {selectedPartner.performance.responseTime}h
                        </div>
                        <div className="performance-label">Ø Antwortzeit</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rabattstruktur */}
                <div className="info-section">
                  <h3 className="info-section-title">Rabattstruktur</h3>
                  <div className="info-items">
                    <div className="info-item-row">
                      <span className="info-label">Standard:</span>
                      <span className="info-value">{selectedPartner.discountRates.standard}%</span>
                    </div>
                    <div className="info-item-row">
                      <span className="info-label">Volumen:</span>
                      <span className="info-value">{selectedPartner.discountRates.volume}%</span>
                    </div>
                    <div className="info-item-row">
                      <span className="info-label">Saison:</span>
                      <span className="info-value">{selectedPartner.discountRates.seasonal}%</span>
                    </div>
                  </div>
                </div>

                {/* Spezialisierungen */}
                {selectedPartner.specialties && (
                  <div className="info-section">
                    <h3 className="info-section-title">Spezialisierungen</h3>
                    <div className="tags">
                      {selectedPartner.specialties.map((specialty: string, index: number) => (
                        <span key={index} className="tag tag-primary">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerManagement;
