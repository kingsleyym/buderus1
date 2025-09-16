import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Target, BarChart3, Zap, Clock } from 'lucide-react';

const CampaignManagement: React.FC = () => {
  return (
    <>
      <div className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link 
            to="/admin/marketing" 
            className="btn btn-secondary"
            style={{ padding: '0.5rem' }}
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="dashboard-title">Kampagnen Verwaltung</h1>
            <p className="dashboard-subtitle">
              Automatisierte E-Mail-Sequenzen, Tracking und Performance-Analyse
            </p>
          </div>
        </div>
      </div>

      {/* Campaign Features Preview */}
      <div className="content-card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3 className="card-title">
            <Send size={18} style={{ marginRight: '8px' }} />
            Kampagnen Features (Coming Soon)
          </h3>
        </div>
        <div className="card-content">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1rem'
          }}>
            <div className="feature-preview">
              <Send size={20} style={{ color: 'var(--primary-color)' }} />
              <h4>E-Mail-Sequenzen</h4>
              <p>Mehrstufige Kampagnen mit zeitgesteuerten Follow-ups</p>
            </div>
            
            <div className="feature-preview">
              <Target size={20} style={{ color: 'var(--primary-color)' }} />
              <h4>Trigger-basiert</h4>
              <p>Kampagnen basierend auf Öffnungen, Klicks oder Verhalten</p>
            </div>
            
            <div className="feature-preview">
              <BarChart3 size={20} style={{ color: 'var(--primary-color)' }} />
              <h4>Performance Tracking</h4>
              <p>Detaillierte Metriken für jede Kampagnen-Stufe</p>
            </div>
            
            <div className="feature-preview">
              <Zap size={20} style={{ color: 'var(--primary-color)' }} />
              <h4>Automatisierung</h4>
              <p>Welcome-Serien, Geburtstags-Mails, Re-Engagement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign System Concept */}
      <div className="content-card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3 className="card-title">Kampagnen-System Konzept</h3>
        </div>
        <div className="card-content">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '1.5rem'
          }}>
            <div>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary-color)' }}>
                📧 Newsletter-Kampagnen
              </h4>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                Erweiterte Nutzung der bestehenden Newsletter-Collection:
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                <li>Einzelne Newsletter als Kampagnen-Schritte</li>
                <li>Tracking: Wer hat welchen Newsletter geöffnet/geklickt</li>
                <li>Konditionelle nächste Schritte</li>
                <li>Zeitgesteuerte Sequenzen</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary-color)' }}>
                🎯 Trigger-System
              </h4>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                Automatische Aktionen basierend auf Verhalten:
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                <li><strong>Newsletter geöffnet:</strong> → Nächste E-Mail senden</li>
                <li><strong>Link geklickt:</strong> → Interesse-Tag hinzufügen</li>
                <li><strong>Nicht geöffnet:</strong> → Reminder nach 3 Tagen</li>
                <li><strong>Neuer Abonnent:</strong> → Welcome-Serie starten</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Backend Requirements */}
      <div className="content-card">
        <div className="card-header">
          <h3 className="card-title">
            <Clock size={18} style={{ marginRight: '8px' }} />
            Backend-Anforderungen
          </h3>
        </div>
        <div className="card-content">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem'
          }}>
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)' }}>
                📊 Neue Collections needed:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                <li><strong>campaigns:</strong> Kampagnen-Definitionen</li>
                <li><strong>campaign_steps:</strong> Einzelne E-Mail-Schritte</li>
                <li><strong>subscriber_journeys:</strong> Wo steht jeder Abonnent</li>
                <li><strong>email_events:</strong> Öffnungen, Klicks, Bounces</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)' }}>
                ⚡ Automatisierung:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                <li>Firebase Functions für Zeitsteuerung</li>
                <li>Webhook für E-Mail-Events (Öffnungen/Klicks)</li>
                <li>Cron Jobs für geplante Kampagnen</li>
                <li>Real-time Updates für Live-Tracking</li>
              </ul>
            </div>
          </div>
          
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--background-color)', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)' }}>
              💡 Integration mit bestehenden Collections:
            </h4>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
              Die bestehenden Collections können erweitert werden:
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
              <li><strong>newsletter</strong> → campaignId, stepNumber hinzufügen</li>
              <li><strong>subscriber</strong> → tags, lastActivity, engagementScore</li>
              <li><strong>consent</strong> → detailliertere Tracking-Permissions</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CampaignManagement;
