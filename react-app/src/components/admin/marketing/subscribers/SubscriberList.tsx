import React from 'react';
import { Edit, Trash2, Mail, CheckCircle, XCircle, Users } from 'lucide-react';
import { Subscriber } from '../shared/types';

interface SubscriberListProps {
  subscribers: Subscriber[];
  selectedSubscribers: string[];
  setSelectedSubscribers: (ids: string[]) => void;
  onEdit: (subscriber: Subscriber) => void;
  onDelete: (subscriberId: string) => void;
}

const SubscriberList: React.FC<SubscriberListProps> = ({
  subscribers,
  selectedSubscribers,
  setSelectedSubscribers,
  onEdit,
  onDelete
}) => {
  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (confirmed: boolean) => {
    return (
      <span className={`status-badge ${confirmed ? 'status-active' : 'status-inactive'}`}>
        {confirmed ? (
          <>
            <CheckCircle size={12} />
            Bestätigt
          </>
        ) : (
          <>
            <XCircle size={12} />
            Unbestätigt
          </>
        )}
      </span>
    );
  };

  const getSourceBadge = (source: string) => {
    const sourceLabels = {
      website: 'Website',
      manual: 'Manuell',
      import: 'Import',
      api: 'API'
    };

    return (
      <span className="source-badge">
        {sourceLabels[source as keyof typeof sourceLabels] || source}
      </span>
    );
  };

  const toggleSelectAll = () => {
    if (selectedSubscribers.length === subscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(subscribers.map(sub => sub.id));
    }
  };

  const toggleSelectSubscriber = (subscriberId: string) => {
    if (selectedSubscribers.includes(subscriberId)) {
      setSelectedSubscribers(selectedSubscribers.filter(id => id !== subscriberId));
    } else {
      setSelectedSubscribers([...selectedSubscribers, subscriberId]);
    }
  };

  if (subscribers.length === 0) {
    return (
      <div className="content-card">
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'var(--text-muted)'
        }}>
          <Users size={48} style={{ marginBottom: '1rem' }} />
          <p>Keine Abonnenten gefunden</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-card">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  checked={selectedSubscribers.length === subscribers.length && subscribers.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>E-Mail</th>
              <th>Name</th>
              <th>Firma</th>
              <th>Status</th>
              <th>Quelle</th>
              <th>Registriert</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedSubscribers.includes(subscriber.id)}
                    onChange={() => toggleSelectSubscriber(subscriber.id)}
                  />
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                    {subscriber.email}
                  </div>
                </td>
                <td>{subscriber.firstName} {subscriber.lastName}</td>
                <td>{subscriber.company || '-'}</td>
                <td>{getStatusBadge(subscriber.confirmed)}</td>
                <td>{getSourceBadge(subscriber.source)}</td>
                <td>{formatDate(subscriber.createdAt)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button 
                      className="btn btn-icon"
                      onClick={() => onEdit(subscriber)}
                      title="Bearbeiten"
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      className="btn btn-icon btn-danger"
                      onClick={() => onDelete(subscriber.id)}
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
    </div>
  );
};

export default SubscriberList;
