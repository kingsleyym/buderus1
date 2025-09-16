import React, { useState, useEffect } from 'react';
import { Upload, Plus, Search, Edit, Copy, Trash2, Send } from 'lucide-react';
import NewsletterEditor from './NewsletterEditor';

// Newsletter interface erweitert
interface Newsletter {
  id: string;
  subject: string;
  content: string;
  status: 'draft' | 'sent' | 'scheduled';
  campaign?: string;
  category: string;
  recipientCount: number;
  sentAt?: Date;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  analytics?: {
    opened: number;
    clicked: number;
    bounced: number;
  };
}

type FilterStatus = 'all' | 'draft' | 'sent' | 'scheduled';
type FilterCategory = 'all' | 'kampagne' | 'angebot' | 'news' | 'wartung';

// Mock Newsletter Data
const mockNewsletters: Newsletter[] = [
  {
    id: '1',
    subject: 'Frühjahrs-Aktion: 20% auf alle Heizungen',
    content: '<p>Frühjahrs-Aktion...</p>',
    status: 'sent',
    campaign: 'Frühjahrsaktion 2024',
    category: 'angebot',
    recipientCount: 847,
    sentAt: new Date('2024-03-10'),
    createdAt: new Date('2024-03-08'),
    updatedAt: new Date('2024-03-08'),
    analytics: { opened: 324, clicked: 87, bounced: 12 }
  },
  {
    id: '2',
    subject: 'Wartungserinnerung für Ihre Heizung',
    content: '<p>Wartung...</p>',
    status: 'scheduled',
    campaign: 'Service-Kampagne',
    category: 'wartung',
    recipientCount: 234,
    scheduledAt: new Date('2024-03-20'),
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15')
  },
  {
    id: '3',
    subject: 'Newsletter März 2024 - Neuigkeiten',
    content: '<p>Newsletter...</p>',
    status: 'draft',
    category: 'news',
    recipientCount: 0,
    createdAt: new Date('2024-03-18'),
    updatedAt: new Date('2024-03-18')
  }
];

type ViewType = 'overview' | 'editor';

const NewsletterMain: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [filteredNewsletters, setFilteredNewsletters] = useState<Newsletter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNewsletters();
  }, []);

  const loadNewsletters = async () => {
    try {
      setLoading(true);
      // Mock data für Development
      setNewsletters(mockNewsletters);
      setFilteredNewsletters(mockNewsletters);
    } catch (error) {
      console.error('Fehler beim Laden der Newsletter:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  useEffect(() => {
    let filtered = newsletters;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(newsletter =>
        newsletter.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        newsletter.campaign?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        newsletter.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(newsletter => newsletter.status === filterStatus);
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(newsletter => newsletter.category === filterCategory);
    }

    setFilteredNewsletters(filtered);
  }, [newsletters, searchTerm, filterStatus, filterCategory]);

  const getStatusBadge = (status: Newsletter['status']) => {
    const styles = {
      draft: { bg: '#FEF3C7', color: '#D97706', text: 'Entwurf' },
      sent: { bg: '#DEF7EC', color: '#047857', text: 'Versendet' },
      scheduled: { bg: '#E0E7FF', color: '#4338CA', text: 'Geplant' }
    };
    const style = styles[status];
    return (
      <span style={{ 
        backgroundColor: style.bg, 
        color: style.color, 
        padding: '4px 8px', 
        borderRadius: '4px', 
        fontSize: '12px',
        fontWeight: '500'
      }}>
        {style.text}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const styles: { [key: string]: { bg: string; color: string } } = {
      angebot: { bg: '#FEE2E2', color: '#DC2626' },
      kampagne: { bg: '#E0E7FF', color: '#4338CA' },
      news: { bg: '#F0FDF4', color: '#16A34A' },
      wartung: { bg: '#FEF3C7', color: '#D97706' }
    };
    const style = styles[category] || { bg: '#F3F4F6', color: '#6B7280' };
    return (
      <span style={{ 
        backgroundColor: style.bg, 
        color: style.color, 
        padding: '4px 8px', 
        borderRadius: '4px', 
        fontSize: '11px',
        fontWeight: '500'
      }}>
        {category}
      </span>
    );
  };

  if (currentView === 'editor') {
    return (
      <NewsletterEditor 
        onBack={() => setCurrentView('overview')}
        editingNewsletter={null}
      />
    );
  }

  return (
    <div className="admin-section">
      <div className="content-header">
        <div>
          <h1>📧 Newsletter Marketing</h1>
          <p className="subtitle">Verwalten Sie alle Newsletter, Kampagnen und Templates zentral</p>
        </div>
        <div className="header-actions">
          <button 
            className="secondary-btn"
            onClick={() => {/* TODO: Import */}}
          >
            <Upload size={16} />
            HTML importieren
          </button>
          <button 
            className="primary-btn"
            onClick={() => setCurrentView('editor')}
          >
            <Plus size={16} />
            Newsletter erstellen
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="content-card" style={{ marginBottom: '1.5rem' }}>
        <div className="filter-toolbar">
          {/* Search */}
          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Suche nach Betreff, Kampagne oder Kategorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="filter-group">
            <div className="filter-item">
              <label className="filter-label">Status</label>
              <select 
                className="filter-select"
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              >
                <option value="all">Alle Status</option>
                <option value="draft">Entwürfe</option>
                <option value="sent">Versendet</option>
                <option value="scheduled">Geplant</option>
              </select>
            </div>

            <div className="filter-item">
              <label className="filter-label">Kategorie</label>
              <select 
                className="filter-select"
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
              >
                <option value="all">Alle Kategorien</option>
                <option value="angebot">Angebote</option>
                <option value="kampagne">Kampagnen</option>
                <option value="news">Newsletter</option>
                <option value="wartung">Wartung</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Table */}
      <div className="content-card">
        <div className="table-header">
          <h3>Newsletter ({filteredNewsletters.length})</h3>
        </div>
        
        {loading ? (
          <div className="loading-state">
            <p>Newsletter werden geladen...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Betreff</th>
                  <th>Status</th>
                  <th>Kategorie</th>
                  <th>Kampagne</th>
                  <th>Empfänger</th>
                  <th>Geöffnet</th>
                  <th>Datum</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {filteredNewsletters.map((newsletter) => (
                  <tr key={newsletter.id}>
                    <td>
                      <div className="newsletter-subject">
                        {newsletter.subject}
                      </div>
                    </td>
                    <td>{getStatusBadge(newsletter.status)}</td>
                    <td>{getCategoryBadge(newsletter.category)}</td>
                    <td>
                      <span className="campaign-name">
                        {newsletter.campaign || '-'}
                      </span>
                    </td>
                    <td>{newsletter.recipientCount}</td>
                    <td>
                      {newsletter.analytics ? (
                        <span className="analytics-info">
                          {newsletter.analytics.opened} ({Math.round((newsletter.analytics.opened / newsletter.recipientCount) * 100)}%)
                        </span>
                      ) : '-'}
                    </td>
                    <td>
                      {newsletter.sentAt ? newsletter.sentAt.toLocaleDateString('de-DE') : 
                       newsletter.scheduledAt ? newsletter.scheduledAt.toLocaleDateString('de-DE') :
                       newsletter.createdAt.toLocaleDateString('de-DE')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button 
                          className="btn btn-icon"
                          onClick={() => {/* TODO: Bearbeiten */}}
                          title="Bearbeiten"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          className="btn btn-icon"
                          onClick={() => {/* TODO: Kopieren */}}
                          title="Kopieren"
                        >
                          <Copy size={14} />
                        </button>
                        {newsletter.status === 'draft' && (
                          <button 
                            className="btn btn-icon btn-primary"
                            onClick={() => {/* TODO: Senden */}}
                            title="Sofort senden"
                          >
                            <Send size={14} />
                          </button>
                        )}
                        <button 
                          className="btn btn-icon btn-danger"
                          onClick={() => {/* TODO: Löschen */}}
                          title="Löschen"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterMain;
