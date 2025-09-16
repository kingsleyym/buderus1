import React, { useState } from 'react';
import { Plus, Mail, Send, Edit, Trash2, Copy } from 'lucide-react';

interface Newsletter {
  id: string;
  subject: string;
  content: string;
  status: 'draft' | 'sent' | 'scheduled';
  recipientCount: number;
  sentAt?: Date;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mock Data
const mockNewsletters: Newsletter[] = [
  {
    id: '1',
    subject: 'Willkommen bei Buderus - Ihre neue Heizung',
    content: '<p>Willkommen...</p>',
    status: 'sent',
    recipientCount: 156,
    sentAt: new Date('2024-03-10'),
    createdAt: new Date('2024-03-09'),
    updatedAt: new Date('2024-03-09')
  },
  {
    id: '2', 
    subject: 'Frühjahrs-Wartung für Ihre Heizung',
    content: '<p>Wartung...</p>',
    status: 'draft',
    recipientCount: 0,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15')
  }
];

const NewsletterList: React.FC = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>(mockNewsletters);

  const getStatusBadge = (status: Newsletter['status']) => {
    const styles = {
      draft: { bg: '#FEF3C7', color: '#D97706', text: 'Entwurf' },
      sent: { bg: '#DEF7EC', color: '#047857', text: 'Versendet' },
      scheduled: { bg: '#E0E7FF', color: '#4338CA', text: 'Geplant' }
    };
    
    const style = styles[status];
    return (
      <span style={{
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '500',
        backgroundColor: style.bg,
        color: style.color
      }}>
        {style.text}
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleEdit = (newsletter: Newsletter) => {
    alert(`Editor für "${newsletter.subject}" wird implementiert`);
  };

  const handleDuplicate = (newsletter: Newsletter) => {
    const duplicate = {
      ...newsletter,
      id: Date.now().toString(),
      subject: `${newsletter.subject} (Kopie)`,
      status: 'draft' as const,
      sentAt: undefined,
      scheduledAt: undefined,
      recipientCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNewsletters([duplicate, ...newsletters]);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Newsletter wirklich löschen?')) {
      setNewsletters(newsletters.filter(n => n.id !== id));
    }
  };

  return (
    <div className="content-card">
      <div className="card-header">
        <h3 className="card-title">
          <Mail size={18} style={{ marginRight: '8px' }} />
          Newsletter Übersicht
        </h3>
        <button className="btn btn-primary">
          <Plus size={16} />
          Neuer Newsletter
        </button>
      </div>
      <div className="card-content">
        {newsletters.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <Mail size={48} style={{ marginBottom: '1rem' }} />
            <h4>Noch keine Newsletter erstellt</h4>
            <p>Erstelle deinen ersten Newsletter für deine Abonnenten</p>
            <button className="btn btn-primary">
              <Plus size={16} />
              Ersten Newsletter erstellen
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Betreff</th>
                  <th>Status</th>
                  <th>Empfänger</th>
                  <th>Erstellt</th>
                  <th>Versendet</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {newsletters.map((newsletter) => (
                  <tr key={newsletter.id}>
                    <td>
                      <div style={{ fontWeight: '500' }}>
                        {newsletter.subject}
                      </div>
                    </td>
                    <td>{getStatusBadge(newsletter.status)}</td>
                    <td>{newsletter.recipientCount.toLocaleString()}</td>
                    <td>{formatDate(newsletter.createdAt)}</td>
                    <td>
                      {newsletter.sentAt ? formatDate(newsletter.sentAt) : 
                       newsletter.scheduledAt ? `Geplant: ${formatDate(newsletter.scheduledAt)}` : 
                       '-'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button 
                          className="btn btn-icon"
                          onClick={() => handleEdit(newsletter)}
                          title="Bearbeiten"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          className="btn btn-icon"
                          onClick={() => handleDuplicate(newsletter)}
                          title="Duplizieren"
                        >
                          <Copy size={14} />
                        </button>
                        {newsletter.status === 'draft' && (
                          <button 
                            className="btn btn-icon"
                            title="Versenden"
                          >
                            <Send size={14} />
                          </button>
                        )}
                        <button 
                          className="btn btn-icon btn-danger"
                          onClick={() => handleDelete(newsletter.id)}
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

export default NewsletterList;
