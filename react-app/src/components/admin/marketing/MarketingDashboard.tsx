import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import {
  Mail,
  Users,
  Send,
  TrendingUp,
  Eye,
  MousePointer,
  UserPlus,
  UserMinus,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { MarketingStats } from './marketing-types';

// Import Marketing Components
import SubscriberManagement from './subscribers/SubscriberManagement';
import NewsletterMain from './newsletter/NewsletterMain';
import CampaignManagement from './campaigns/CampaignManagement';
// import RewardManagement from './RewardManagement';

const MarketingDashboard: React.FC = () => {
  const [stats, setStats] = useState<MarketingStats>({
    totalSubscribers: 0,
    confirmedSubscribers: 0,
    pendingSubscribers: 0,
    unsubscribedToday: 0,
    newSubscribersToday: 0,
    newSubscribersThisWeek: 0,
    newSubscribersThisMonth: 0,
    averageOpenRate: 0,
    averageClickRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarketingStats();
  }, []);

  const loadMarketingStats = async () => {
    setLoading(true);
    try {
      // TODO: Firebase Integration
      // Temporäre Test-Daten basierend auf deinen Kollektionen
      const testStats: MarketingStats = {
        totalSubscribers: 156,
        confirmedSubscribers: 143,
        pendingSubscribers: 13,
        unsubscribedToday: 2,
        newSubscribersToday: 8,
        newSubscribersThisWeek: 24,
        newSubscribersThisMonth: 87,
        averageOpenRate: 67.3,
        averageClickRate: 12.8,
        lastNewsletterSent: new Date('2025-08-21T18:57:50'),
        nextScheduledNewsletter: new Date('2025-09-18T10:00:00'),
      };
      setStats(testStats);
    } catch (error) {
      console.error('Fehler beim Laden der Marketing-Statistiken:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendPositive?: boolean;
  }> = ({ title, value, icon, trend, trendPositive }) => (
    <div className="content-card">
      <div className="card-content" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '0.9rem', 
              margin: '0 0 0.5rem 0',
              fontWeight: '500'
            }}>
              {title}
            </p>
            <h3 style={{ 
              margin: '0 0 0.5rem 0', 
              fontSize: '2rem', 
              fontWeight: '700',
              color: 'var(--text-primary)'
            }}>
              {value}
            </h3>
            {trend && (
              <p style={{ 
                margin: 0, 
                fontSize: '0.8rem',
                color: trendPositive ? 'var(--success-color)' : 'var(--danger-color)',
                fontWeight: '500'
              }}>
                {trend}
              </p>
            )}
          </div>
          <div style={{ 
            padding: '0.75rem', 
            borderRadius: '12px',
            background: 'rgba(255, 215, 0, 0.1)',
            color: 'var(--primary-color)'
          }}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="loading-spinner">Lade Marketing-Dashboard...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        <>
          <div className="dashboard-header">
            <h1 className="dashboard-title">Marketing Dashboard</h1>
            <p className="dashboard-subtitle">
              Newsletter, Abonnenten und Kampagnen verwalten
            </p>
          </div>

          {/* Quick Actions */}
          <div className="content-card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-content" style={{ padding: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <Link to="/admin/marketing/newsletter-editor" className="btn btn-primary">
                  <Mail size={16} style={{ marginRight: '8px' }} />
                  Newsletter erstellen
                </Link>
                <Link to="/admin/marketing/campaigns" className="btn btn-secondary">
                  <Send size={16} style={{ marginRight: '8px' }} />
                  Kampagne starten
                </Link>
                <Link to="/admin/marketing/subscribers" className="btn btn-secondary">
                  <UserPlus size={16} style={{ marginRight: '8px' }} />
                  Abonnenten verwalten
                </Link>
              </div>
            </div>
          </div>

          {/* Marketing Bereiche - Quick Access */}
          <div className="content-card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">
              <h3 className="card-title">Marketing Bereiche</h3>
            </div>
            <div className="card-content">
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '1rem'
              }}>
                <Link to="/admin/marketing/newsletter-editor" className="marketing-area-card">
                  <Mail size={20} />
                  <div>
                    <h4>Newsletter Editor</h4>
                    <p>Erstelle und versende Newsletter mit HTML-Editor</p>
                  </div>
                  <ArrowRight size={16} />
                </Link>
                
                <Link to="/admin/marketing/subscribers" className="marketing-area-card">
                  <Users size={20} />
                  <div>
                    <h4>Abonnenten</h4>
                    <p>Verwalte {stats.totalSubscribers} Abonnenten und Segmente</p>
                  </div>
                  <ArrowRight size={16} />
                </Link>
                
                <Link to="/admin/marketing/campaigns" className="marketing-area-card">
                  <Send size={20} />
                  <div>
                    <h4>Kampagnen</h4>
                    <p>Automatisierte E-Mail-Sequenzen und Tracking</p>
                  </div>
                  <ArrowRight size={16} />
                </Link>
                
                <Link to="/admin/marketing/rewards" className="marketing-area-card">
                  <UserPlus size={20} />
                  <div>
                    <h4>Belohnungen</h4>
                    <p>Loyalitätsprogramm und Incentives</p>
                  </div>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <StatCard
              title="Gesamt Abonnenten"
              value={stats.totalSubscribers.toLocaleString()}
              icon={<Users size={24} />}
              trend={`+${stats.newSubscribersThisMonth} diesen Monat`}
              trendPositive={true}
            />
            
            <StatCard
              title="Bestätigte Abonnenten"
              value={stats.confirmedSubscribers.toLocaleString()}
              icon={<UserPlus size={24} />}
              trend={`${Math.round((stats.confirmedSubscribers / stats.totalSubscribers) * 100)}% Bestätigungsrate`}
              trendPositive={true}
            />
            
            <StatCard
              title="Neue Abonnenten (Woche)"
              value={stats.newSubscribersThisWeek}
              icon={<TrendingUp size={24} />}
              trend={`+${stats.newSubscribersToday} heute`}
              trendPositive={true}
            />
            
            <StatCard
              title="Durchschnittliche Öffnungsrate"
              value={`${stats.averageOpenRate}%`}
              icon={<Eye size={24} />}
              trend="Letzte 30 Tage"
              trendPositive={stats.averageOpenRate > 60}
            />
            
            <StatCard
              title="Durchschnittliche Klickrate"
              value={`${stats.averageClickRate}%`}
              icon={<MousePointer size={24} />}
              trend="Letzte 30 Tage"
              trendPositive={stats.averageClickRate > 10}
            />
            
            <StatCard
              title="Abmeldungen (heute)"
              value={stats.unsubscribedToday}
              icon={<UserMinus size={24} />}
              trend="Normal"
              trendPositive={stats.unsubscribedToday < 5}
            />
          </div>

          {/* Recent Activity & Next Actions */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '1.5rem'
          }}>
            {/* Last Newsletter */}
            <div className="content-card">
              <div className="card-header">
                <h3 className="card-title">
                  <Mail size={18} style={{ marginRight: '8px' }} />
                  Letzter Newsletter
                </h3>
              </div>
              <div className="card-content">
                {stats.lastNewsletterSent ? (
                  <div>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
                      Newsletter versendet
                    </p>
                    <p style={{ 
                      margin: '0 0 1rem 0', 
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem'
                    }}>
                      {stats.lastNewsletterSent.toLocaleDateString('de-DE', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <button className="btn btn-secondary">
                      <TrendingUp size={14} style={{ marginRight: '6px' }} />
                      Statistiken anzeigen
                    </button>
                  </div>
                ) : (
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    Noch kein Newsletter versendet
                  </p>
                )}
              </div>
            </div>

            {/* Next Scheduled */}
            <div className="content-card">
              <div className="card-header">
                <h3 className="card-title">
                  <Calendar size={18} style={{ marginRight: '8px' }} />
                  Geplante Aktionen
                </h3>
              </div>
              <div className="card-content">
                {stats.nextScheduledNewsletter ? (
                  <div>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
                      Nächster Newsletter
                    </p>
                    <p style={{ 
                      margin: '0 0 1rem 0', 
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem'
                    }}>
                      {stats.nextScheduledNewsletter.toLocaleDateString('de-DE', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <button className="btn btn-primary">
                      <Mail size={14} style={{ marginRight: '6px' }} />
                      Bearbeiten
                    </button>
                  </div>
                ) : (
                  <div>
                    <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)' }}>
                      Keine geplanten Newsletter
                    </p>
                    <button className="btn btn-primary">
                      <Mail size={14} style={{ marginRight: '6px' }} />
                      Newsletter planen
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      } />
      
      {/* Marketing Sub-Routes */}
      <Route path="/newsletter-editor" element={<NewsletterMain />} />
      <Route path="/subscribers" element={<SubscriberManagement />} />
      <Route path="/campaigns" element={<CampaignManagement />} />
      {/* <Route path="/rewards" element={<RewardManagement />} /> */}
      
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/admin/marketing" replace />} />
    </Routes>
  );
};

export default MarketingDashboard;
