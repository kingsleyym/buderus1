import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Grid3X3, 
  List, 
  Eye, 
  Edit, 
  Phone,
  Mail,
  MapPin,
  Building,
  Star,
  TrendingUp,
  Users,
  Award,
  X,
  FileText,
  Calendar,
  Euro,
  Clock
} from 'lucide-react';
import { Partner } from './partner-types';
import { mockPartners } from '../../../data/mockPartners';
import './partners.css';

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Partner Detail Modal Component
const PartnerDetailModal: React.FC<{ partner: Partner; onClose: () => void }> = ({ partner, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content partner-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="partner-detail-header">
            <div className="partner-detail-logo">
              {partner.name.charAt(0)}
            </div>
            <div className="partner-detail-info">
              <h2>{partner.name}</h2>
              <span className={`partnership-level ${partner.partnershipLevel}`}>
                {partner.partnershipLevel.toUpperCase()}-Partner
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="partner-detail-sections">
            
            {/* Contact Information */}
            <div className="detail-section">
              <h3><Building size={20} /> Kontaktinformationen</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <Phone size={16} />
                  <strong>Telefon:</strong>
                  <span>{partner.contactInfo.phone}</span>
                </div>
                <div className="detail-item">
                  <Mail size={16} />
                  <strong>E-Mail:</strong>
                  <span>{partner.contactInfo.email}</span>
                </div>
                <div className="detail-item">
                  <Users size={16} />
                  <strong>Ansprechpartner:</strong>
                  <span>{partner.contactInfo.representative}</span>
                </div>
                <div className="detail-item">
                  <Calendar size={16} />
                  <strong>Gegründet:</strong>
                  <span>{partner.establishedYear}</span>
                </div>
                <div className="detail-item">
                  <Users size={16} />
                  <strong>Mitarbeiter:</strong>
                  <span>{partner.employees.toLocaleString('de-DE')}</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="detail-section">
              <h3><TrendingUp size={20} /> Performance</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <Euro size={16} />
                  <strong>Umsatz (Jahr):</strong>
                  <span>{formatCurrency(partner.performance.orderVolume.lastYear)}</span>
                </div>
                <div className="detail-item">
                  <Euro size={16} />
                  <strong>Umsatz (Quartal):</strong>
                  <span>{formatCurrency(partner.performance.orderVolume.lastQuarter)}</span>
                </div>
                <div className="detail-item">
                  <Star size={16} />
                  <strong>Qualitäts-Rating:</strong>
                  <span>{partner.performance.qualityRating}/5.0</span>
                </div>
                <div className="detail-item">
                  <Clock size={16} />
                  <strong>Antwortzeit:</strong>
                  <span>{partner.performance.responseTime}h</span>
                </div>
                <div className="detail-item">
                  <FileText size={16} />
                  <strong>Support Tickets:</strong>
                  <span>{partner.performance.supportTickets.open} offen, {partner.performance.supportTickets.resolved} gelöst</span>
                </div>
              </div>
            </div>

            {/* Contract Information */}
            <div className="detail-section">
              <h3><FileText size={20} /> Verträge</h3>
              <div className="detail-grid">
                {partner.contracts.map(contract => (
                  <div key={contract.id} className="detail-item">
                    <Award size={16} />
                    <strong>{contract.type}:</strong>
                    <span>{contract.terms} ({contract.discountLevel}% Rabatt)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialties & Regions */}
            <div className="detail-section">
              <h3><MapPin size={20} /> Regionen & Spezialisierung</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <MapPin size={16} />
                  <strong>Regionen:</strong>
                  <span>{partner.regions.join(', ')}</span>
                </div>
                <div className="detail-item">
                  <Award size={16} />
                  <strong>Spezialisierung:</strong>
                  <span>{partner.specialties.join(', ')}</span>
                </div>
                <div className="detail-item">
                  <Star size={16} />
                  <strong>Zertifizierungen:</strong>
                  <span>{partner.certifications.join(', ')}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Recent Contact History */}
          <div className="detail-section" style={{ gridColumn: '1 / -1', marginTop: '2rem' }}>
            <h3><FileText size={20} /> Kontakt-Historie</h3>
            <div className="contact-history">
              {partner.contactHistory.slice(0, 3).map(contact => (
                <div key={contact.id} className="contact-entry">
                  <div className="contact-header">
                    <strong>{contact.subject}</strong>
                    <span className="contact-date">{formatDate(contact.date)}</span>
                  </div>
                  <div className="contact-details">
                    <span className="contact-type">{contact.type}</span>
                    <span className="contact-person">{contact.contactPerson}</span>
                  </div>
                  <p className="contact-description">{contact.description}</p>
                  {contact.outcome && (
                    <p className="contact-outcome"><strong>Ergebnis:</strong> {contact.outcome}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {partner.notes && (
            <div className="detail-section" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <h3><FileText size={20} /> Notizen</h3>
              <p>{partner.notes}</p>
            </div>
          )}

        </div>

        <div className="modal-actions">
          <button className="action-btn primary">
            <Edit size={16} />
            Bearbeiten
          </button>
          <button className="action-btn">
            <Phone size={16} />
            Kontaktieren
          </button>
          <button className="action-btn" onClick={onClose}>
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

const PartnerManagement: React.FC = () => {
  const [partners] = useState<Partner[]>(mockPartners);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Filtered partners
  const filteredPartners = useMemo(() => {
    return partners.filter(partner => {
      const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           partner.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesLevel = levelFilter === 'all' || partner.partnershipLevel === levelFilter;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && partner.isActive) ||
                           (statusFilter === 'inactive' && !partner.isActive);

      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [partners, searchTerm, levelFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const active = partners.filter(p => p.isActive).length;
    const premium = partners.filter(p => p.partnershipLevel === 'premium').length;
    const totalRevenue = partners.reduce((sum, p) => sum + p.performance.orderVolume.lastYear, 0);
    const avgRating = partners.reduce((sum, p) => sum + p.performance.qualityRating, 0) / partners.length;

    return {
      total: partners.length,
      active,
      premium,
      totalRevenue,
      avgRating
    };
  }, [partners]);

  const handlePartnerClick = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowDetails(true);
  };

  const handleViewDetails = (partner: Partner, e: React.MouseEvent) => {
    e.stopPropagation();
    handlePartnerClick(partner);
  };

  return (
    <div className="partners-container">
      {/* Header */}
      <div className="partners-header">
        <div>
          <h1>Fachpartner-Verwaltung</h1>
          <p className="partners-subtitle">Verwalten Sie Ihre Hersteller und Vertriebspartner</p>
        </div>
        <button className="action-btn primary">
          <Building size={16} />
          Neuer Partner
        </button>
      </div>

      {/* Statistics */}
      <div className="partners-stats">
        <div className="stat-card">
          <div className="stat-value primary">{stats.total}</div>
          <div className="stat-label">Gesamt Partner</div>
        </div>
        <div className="stat-card">
          <div className="stat-value success">{stats.active}</div>
          <div className="stat-label">Aktive Partner</div>
        </div>
        <div className="stat-card">
          <div className="stat-value warning">{stats.premium}</div>
          <div className="stat-label">Premium Partner</div>
        </div>
        <div className="stat-card">
          <div className="stat-value primary">{formatCurrency(stats.totalRevenue)}</div>
          <div className="stat-label">Jahresumsatz</div>
        </div>
        <div className="stat-card">
          <div className="stat-value success">{stats.avgRating.toFixed(1)}/5.0</div>
          <div className="stat-label">Ø Bewertung</div>
        </div>
      </div>

      {/* Filters */}
      <div className="partners-filters">
        <div className="filter-row">
          <div className="search-input">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Partner suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="filter-select"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="all">Alle Level</option>
            <option value="premium">Premium</option>
            <option value="standard">Standard</option>
            <option value="basic">Basic</option>
          </select>

          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Alle Status</option>
            <option value="active">Aktiv</option>
            <option value="inactive">Inaktiv</option>
          </select>

          <div className="filter-info">
            {filteredPartners.length} von {partners.length} Partner
          </div>

          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 size={16} />
              Grid
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
              Liste
            </button>
          </div>
        </div>
      </div>

      {/* Partners Content */}
      <div className="partners-content">
        {viewMode === 'grid' ? (
          <div className="partners-grid">
            {filteredPartners.map(partner => (
              <div 
                key={partner.id} 
                className="partner-card"
                onClick={() => handlePartnerClick(partner)}
              >
                <div className="partner-card-header">
                  <div className="partner-logo">
                    {partner.name.charAt(0)}
                  </div>
                  <div className="partner-info">
                    <h3>{partner.name}</h3>
                    <span className={`partnership-level ${partner.partnershipLevel}`}>
                      {partner.partnershipLevel.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="partner-metrics">
                  <div className="metric">
                    <div className="metric-value">{formatCurrency(partner.performance.orderVolume.lastYear)}</div>
                    <div className="metric-label">Jahresumsatz</div>
                  </div>
                  <div className="metric">
                    <div className="metric-value">{partner.performance.qualityRating}/5</div>
                    <div className="metric-label">Bewertung</div>
                  </div>
                </div>

                <div className="partner-tags">
                  {partner.specialties.slice(0, 3).map(specialty => (
                    <span key={specialty} className="tag">{specialty}</span>
                  ))}
                </div>

                <div className="partner-actions">
                  <button 
                    className="action-btn"
                    onClick={(e) => handleViewDetails(partner, e)}
                  >
                    <Eye size={16} />
                    Details
                  </button>
                  <button 
                    className="action-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Edit size={16} />
                    Bearbeiten
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="partners-table">
            <thead>
              <tr>
                <th>Partner</th>
                <th>Level</th>
                <th>Jahresumsatz</th>
                <th>Bewertung</th>
                <th>Status</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.map(partner => (
                <tr key={partner.id} onClick={() => handlePartnerClick(partner)}>
                  <td>
                    <div className="table-partner-info">
                      <div className="table-partner-logo">
                        {partner.name.charAt(0)}
                      </div>
                      <div className="table-partner-details">
                        <h4>{partner.name}</h4>
                        <p>{partner.specialties.slice(0, 2).join(', ')}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`partnership-level ${partner.partnershipLevel}`}>
                      {partner.partnershipLevel.toUpperCase()}
                    </span>
                  </td>
                  <td>{formatCurrency(partner.performance.orderVolume.lastYear)}</td>
                  <td>
                    <div className="rating-display">
                      <Star size={16} fill="currentColor" />
                      {partner.performance.qualityRating}/5
                    </div>
                  </td>
                  <td>
                    <div className="status-indicator">
                      <div className={`status-dot ${partner.isActive ? 'active' : 'inactive'}`}></div>
                      {partner.isActive ? 'Aktiv' : 'Inaktiv'}
                    </div>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="action-btn"
                        onClick={(e) => handleViewDetails(partner, e)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="action-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Partner Detail Modal */}
      {showDetails && selectedPartner && (
        <PartnerDetailModal 
          partner={selectedPartner} 
          onClose={() => setShowDetails(false)} 
        />
      )}
    </div>
  );
};

export default PartnerManagement;
