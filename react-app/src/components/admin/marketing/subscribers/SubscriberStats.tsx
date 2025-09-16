import React from 'react';
import { Users, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Subscriber, SubscriberStats } from '../shared/types';

interface SubscriberStatsProps {
  subscribers: Subscriber[];
}

const SubscriberStatsComponent: React.FC<SubscriberStatsProps> = ({ subscribers }) => {
  const stats: SubscriberStats = {
    total: subscribers.length,
    confirmed: subscribers.filter(sub => sub.confirmed).length,
    unconfirmed: subscribers.filter(sub => !sub.confirmed).length,
    thisMonth: subscribers.filter(sub => {
      const createdThisMonth = new Date(sub.createdAt).getMonth() === new Date().getMonth();
      return createdThisMonth;
    }).length,
    website: subscribers.filter(sub => sub.source === 'website').length,
    manual: subscribers.filter(sub => sub.source === 'manual').length,
    import: subscribers.filter(sub => sub.source === 'import').length
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '1rem',
      marginBottom: '1.5rem'
    }}>
      <div className="content-card">
        <div className="stat-card">
          <Users size={24} style={{ color: 'var(--primary-color)' }} />
          <div>
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Gesamt Abonnenten</div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="stat-card">
          <CheckCircle size={24} style={{ color: 'var(--success-color)' }} />
          <div>
            <div className="stat-number">{stats.confirmed}</div>
            <div className="stat-label">Bestätigt</div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="stat-card">
          <XCircle size={24} style={{ color: 'var(--warning-color)' }} />
          <div>
            <div className="stat-number">{stats.unconfirmed}</div>
            <div className="stat-label">Unbestätigt</div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="stat-card">
          <Calendar size={24} style={{ color: 'var(--info-color)' }} />
          <div>
            <div className="stat-number">{stats.thisMonth}</div>
            <div className="stat-label">Dieser Monat</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriberStatsComponent;
