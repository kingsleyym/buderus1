import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Grid3X3, 
  List, 
  Eye, 
  Edit, 
  Trash2,
  Clock,
  Mail,
  Star,
  FileText,
  CheckCircle,
  XCircle,
  Phone,
  User,
  Euro,
  Calendar,
  MapPin,
  Building,
  X
} from 'lucide-react';
import { Lead, getStatusDisplayName, getSourceDisplayName, formatCurrency, calculateCommission, LeadProduct, LeadHistoryEntry } from '../../../types/Lead';
import { mockLeads } from '../../../data/mockLeads';
import './leads.css';

// Helper functions
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'new': return <Clock className="status-icon new" size={16} />;
    case 'contacted': return <Mail className="status-icon contacted" size={16} />;
    case 'qualified': return <Star className="status-icon qualified" size={16} />;
    case 'proposal_sent': return <FileText className="status-icon proposal" size={16} />;
    case 'closed_won': return <CheckCircle className="status-icon won" size={16} />;
    case 'closed_lost': return <XCircle className="status-icon lost" size={16} />;
    default: return <Clock className="status-icon" size={16} />;
  }
};

const getPriorityClass = (priority: string) => {
  return `priority-${priority.toLowerCase()}`;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Lead Detail Modal Component
const LeadDetailModal: React.FC<{ lead: Lead; onClose: () => void }> = ({ lead, onClose }) => {
  const totalCommission = calculateCommission(lead);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content lead-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{lead.firstName} {lead.lastName}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="detail-sections">
            {/* Status & Priority */}
            <div className="detail-section">
              <div className="status-priority">
                <div className="status-info">
                  <div className={`status-badge large ${lead.status.current}`}>
                    {getStatusIcon(lead.status.current)}
                    {getStatusDisplayName(lead.status.current)}
                  </div>
                  <div className={`priority-badge large ${getPriorityClass(lead.priority)}`}>
                    Priorität: {lead.priority}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="detail-section">
              <h3><User size={20} /> Kontaktinformationen</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <Phone size={16} />
                  <span>{lead.phone}</span>
                </div>
                <div className="detail-item">
                  <Mail size={16} />
                  <span>{lead.email}</span>
                </div>
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>{lead.address.city}</span>
                </div>
                <div className="detail-item">
                  <Building size={16} />
                  <span>Quelle: {getSourceDisplayName(lead.source)}</span>
                </div>
              </div>
            </div>

            {/* Products & Commission */}
            <div className="detail-section">
              <h3><Euro size={20} /> Produkte & Provisionen</h3>
              <div className="products-list">
                {lead.products.map((product: LeadProduct, index: number) => (
                  <div key={index} className="product-item">
                    <div className="product-name">{product.name}</div>
                    <div className="product-value">{formatCurrency(product.estimatedValue)}</div>
                    {product.specifications && (
                      <div className="product-specs">
                        {Object.entries(product.specifications).map(([key, value], specIndex) => (
                          <span key={specIndex} className="spec">{key}: {value}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="commission-details">
                <div className="commission-item">
                  <span>Gesamtwert:</span>
                  <span>{formatCurrency(lead.totalEstimatedValue)}</span>
                </div>
                <div className="commission-item">
                  <span>Verkäufer-Provision:</span>
                  <span>{lead.commission.salespersonRate || 0}%</span>
                </div>
                <div className="commission-item total">
                  <span>Gesamtprovision:</span>
                  <span>{formatCurrency(totalCommission.totalCommission)}</span>
                </div>
              </div>
            </div>

            {/* History */}
            <div className="detail-section">
              <h3><Calendar size={20} /> Verlauf</h3>
              <div className="history-list">
                {lead.history.map((entry: LeadHistoryEntry, index: number) => (
                  <div key={index} className="history-item">
                    <div className="history-timestamp">
                      {formatDate(entry.timestamp)}
                    </div>
                    <div className="history-action">{entry.description}</div>
                    <div className="history-performer">von {entry.performedBy}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {lead.notes && lead.notes.length > 0 && (
              <div className="detail-section">
                <h3><FileText size={20} /> Notizen</h3>
                <div className="notes-list">
                  {lead.notes.map((note: string, index: number) => (
                    <div key={index} className="note-item">{note}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const LeadsList: React.FC = () => {
  const [leads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'value' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Filter and sort leads
  const filteredAndSortedLeads = useMemo(() => {
    let filtered = leads.filter(lead => {
      const matchesSearch = 
        lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || lead.status.current === statusFilter;
      const matchesSource = sourceFilter === 'all' || lead.source.type === sourceFilter;
      const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesSource && matchesPriority;
    });

    // Sort leads
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = `${a.firstName} ${a.lastName}`
            .localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'value':
          comparison = a.totalEstimatedValue - b.totalEstimatedValue;
          break;
        case 'status':
          comparison = a.status.current.localeCompare(b.status.current);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [leads, searchTerm, statusFilter, sourceFilter, priorityFilter, sortBy, sortOrder]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const totalValue = leads.reduce((sum, lead) => sum + lead.totalEstimatedValue, 0);
    const totalCommission = leads.reduce((sum, lead) => sum + calculateCommission(lead).totalCommission, 0);
    const wonLeads = leads.filter(lead => lead.status.current === 'closed_won').length;
    const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

    return {
      total: totalLeads,
      value: totalValue,
      commission: totalCommission,
      conversion: conversionRate
    };
  }, [leads]);

  // Status statistics
  const statusStats = useMemo(() => {
    const statuses = ['new', 'contacted', 'qualified', 'proposal_sent', 'closed_won', 'closed_lost'];
    return statuses.map(status => ({
      status,
      count: leads.filter(lead => lead.status.current === status).length,
      label: getStatusDisplayName(status)
    }));
  }, [leads]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="leads-container">
      {/* Header */}
      <div className="leads-header">
        <div>
          <h1>Lead-Management</h1>
          <div className="header-stats">
            <div className="stat-item">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Gesamt Leads</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{formatCurrency(stats.value)}</div>
              <div className="stat-label">Gesamtwert</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{formatCurrency(stats.commission)}</div>
              <div className="stat-label">Provisionen</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.conversion.toFixed(1)}%</div>
              <div className="stat-label">Conversion Rate</div>
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <List size={16} />
            </button>
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Status Statistics */}
      <div className="status-stats">
        {statusStats.map(stat => (
          <div key={stat.status} className="status-stat">
            {getStatusIcon(stat.status)}
            <span className="count">{stat.count}</span>
            <span className="label">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="leads-filters">
        <div className="filter-group">
          <div className="search-box">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Nach Name, E-Mail oder Telefon suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-group">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Alle Status</option>
            <option value="new">Neu</option>
            <option value="contacted">Kontaktiert</option>
            <option value="qualified">Qualifiziert</option>
            <option value="proposal_sent">Angebot gesendet</option>
            <option value="closed_won">Gewonnen</option>
            <option value="closed_lost">Verloren</option>
          </select>
        </div>

        <div className="filter-group">
          <select 
            value={sourceFilter} 
            onChange={(e) => setSourceFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Alle Quellen</option>
            <option value="salesperson">Verkäufer</option>
            <option value="purchased">Gekauft</option>
            <option value="company-owned">Firmeneigen</option>
            <option value="advertising">Werbung</option>
            <option value="registration">Anmeldung</option>
            <option value="affiliate">Affiliate</option>
          </select>
        </div>

        <div className="filter-group">
          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Alle Prioritäten</option>
            <option value="urgent">Dringend</option>
            <option value="high">Hoch</option>
            <option value="medium">Mittel</option>
            <option value="low">Niedrig</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        {filteredAndSortedLeads.length} von {leads.length} Leads
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="leads-table">
          <div className="table-header">
            <div 
              className="header-cell sortable" 
              onClick={() => handleSort('name')}
            >
              Kunde
              <ArrowUpDown size={14} />
            </div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Quelle</div>
            <div 
              className="header-cell sortable" 
              onClick={() => handleSort('value')}
            >
              Wert & Provision
              <ArrowUpDown size={14} />
            </div>
            <div className="header-cell">Priorität</div>
            <div 
              className="header-cell sortable" 
              onClick={() => handleSort('date')}
            >
              Erstellt
              <ArrowUpDown size={14} />
            </div>
            <div className="header-cell">Aktionen</div>
          </div>
          
          <div className="table-body">
            {filteredAndSortedLeads.map(lead => (
              <div 
                key={lead.id} 
                className="table-row"
                onClick={() => setSelectedLead(lead)}
              >
                <div className="cell name-cell">
                  <div>
                    <div className="name">
                      {lead.firstName} {lead.lastName}
                    </div>
                    <div className="email">{lead.email}</div>
                  </div>
                </div>
                
                <div className="cell">
                  <div className={`status-badge ${lead.status.current}`}>
                    {getStatusIcon(lead.status.current)}
                    {getStatusDisplayName(lead.status.current)}
                  </div>
                </div>
                
                <div className="cell source-cell">
                  {getSourceDisplayName(lead.source)}
                </div>
                
                <div className="cell value-cell">
                  <div className="value-info">
                    <div className="main-value">{formatCurrency(lead.totalEstimatedValue)}</div>
                    <div className="commission">
                      Provision: {formatCurrency(calculateCommission(lead).totalCommission)}
                    </div>
                  </div>
                </div>
                
                <div className="cell">
                  <span className={`priority-badge ${getPriorityClass(lead.priority)}`}>
                    {lead.priority}
                  </span>
                </div>
                
                <div className="cell date-cell">
                  {formatDate(lead.createdAt)}
                </div>
                
                <div className="cell actions-cell">
                  <button 
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLead(lead);
                    }}
                  >
                    <Eye size={16} />
                  </button>
                  <button className="action-btn">
                    <Edit size={16} />
                  </button>
                  <button className="action-btn danger">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="leads-grid">
          {filteredAndSortedLeads.map(lead => (
            <div 
              key={lead.id} 
              className="lead-card"
              onClick={() => setSelectedLead(lead)}
            >
              <div className="card-header">
                <h3>{lead.firstName} {lead.lastName}</h3>
                <div className={`status-badge ${lead.status.current}`}>
                  {getStatusIcon(lead.status.current)}
                  {getStatusDisplayName(lead.status.current)}
                </div>
              </div>
              
              <div className="card-content">
                <div className="lead-info">
                  <div className="info-item">
                    <Mail size={14} />
                    <span>{lead.email}</span>
                  </div>
                  <div className="info-item">
                    <Phone size={14} />
                    <span>{lead.phone}</span>
                  </div>
                  <div className="info-item">
                    <Building size={14} />
                    <span>{getSourceDisplayName(lead.source)}</span>
                  </div>
                </div>
                
                <div className="lead-value">
                  <div className="value-amount">{formatCurrency(lead.totalEstimatedValue)}</div>
                  <div className="commission-amount">
                    Provision: {formatCurrency(calculateCommission(lead).totalCommission)}
                  </div>
                </div>
                
                <div className="card-footer">
                  <span className={`priority-badge ${getPriorityClass(lead.priority)}`}>
                    {lead.priority}
                  </span>
                  <span className="date">{formatDate(lead.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedLead && (
        <LeadDetailModal 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)} 
        />
      )}
    </div>
  );
};

export default LeadsList;
