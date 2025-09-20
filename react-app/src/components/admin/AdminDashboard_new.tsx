import React, { useState, useEffect } from 'react';
import {
    Users,
    Mail,
    Eye,
    Gift,
    Plus,
    PenTool,
    Send,
    UserPlus,
    Package,
    Building2
} from 'lucide-react';
import DashboardStats from './dashboard/DashboardStats';
import ProductCatalog from './products/ProductCatalog';
import PartnerManagement from './partners/PartnerManagement';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'fachpartner' | 'products'>('dashboard');
    const [stats] = useState({
        totalSubscribers: '-',
        subscribersChange: '+0 diese Woche',
        totalEmails: '-',
        emailsChange: '+0 diesen Monat',
        avgOpenRate: '-%',
        openRateChange: '+0% vs. letzter Monat',
        rewardsClaimed: '-',
        rewardsChange: '+0 diese Woche'
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [manualSubscriber, setManualSubscriber] = useState({
        email: '',
        firstName: '',
        lastName: ''
    });

    // TODO: Load actual stats from Firebase
    useEffect(() => {
        // Placeholder for loading actual data
    }, []);

    const handleAddManualSubscriber = () => {
        setIsModalOpen(true);
    };

    const handleSendTestEmail = () => {
        // TODO: Implement test email functionality
        alert('Test-E-Mail Funktion wird implementiert');
    };

    const handleSubmitManualSubscriber = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement manual subscriber addition
        console.log('Manual subscriber:', manualSubscriber);
        setIsModalOpen(false);
        setManualSubscriber({ email: '', firstName: '', lastName: '' });
    };

    return (
        <>
            {/* Navigation Tabs */}
            <div className="admin-navigation" style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            borderBottom: activeTab === 'dashboard' ? '2px solid #3b82f6' : '2px solid transparent',
                            background: 'none',
                            color: activeTab === 'dashboard' ? '#3b82f6' : '#6b7280',
                            fontWeight: activeTab === 'dashboard' ? '600' : '400',
                            cursor: 'pointer'
                        }}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('fachpartner')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            borderBottom: activeTab === 'fachpartner' ? '2px solid #3b82f6' : '2px solid transparent',
                            background: 'none',
                            color: activeTab === 'fachpartner' ? '#3b82f6' : '#6b7280',
                            fontWeight: activeTab === 'fachpartner' ? '600' : '400',
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

            {/* Dashboard Tab Content */}
            {activeTab === 'dashboard' && (
                <>
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">Dashboard</h1>
                        <p className="dashboard-subtitle">Willkommen zurück! Hier ist eine Übersicht Ihrer Geschäfts-Aktivitäten.</p>
                    </div>

                    {/* CRM Statistics */}
                    <DashboardStats />

                    {/* Legacy Newsletter Statistics */}
                    <div className="legacy-stats" style={{ marginTop: '2rem', opacity: 0.7 }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#666' }}>Newsletter Statistiken (Legacy)</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-header">
                                    <div className="stat-icon subscribers">
                                        <Users size={24} />
                                    </div>
                                </div>
                                <h3 className="stat-value" id="totalSubscribers">{stats.totalSubscribers}</h3>
                                <p className="stat-label">Abonnenten</p>
                                <p className="stat-change positive" id="subscribersChange">{stats.subscribersChange}</p>
                            </div>

                            <div className="stat-card">
                                <div className="stat-header">
                                    <div className="stat-icon emails">
                                        <Mail size={24} />
                                    </div>
                                </div>
                                <h3 className="stat-value" id="totalEmails">{stats.totalEmails}</h3>
                                <p className="stat-label">Newsletter versendet</p>
                                <p className="stat-change positive" id="emailsChange">{stats.emailsChange}</p>
                            </div>

                            <div className="stat-card">
                                <div className="stat-header">
                                    <div className="stat-icon opens">
                                        <Eye size={24} />
                                    </div>
                                </div>
                                <h3 className="stat-value" id="avgOpenRate">{stats.avgOpenRate}</h3>
                                <p className="stat-label">Öffnungsrate</p>
                                <p className="stat-change positive" id="openRateChange">{stats.openRateChange}</p>
                            </div>

                            <div className="stat-card">
                                <div className="stat-header">
                                    <div className="stat-icon clicks">
                                        <Gift size={24} />
                                    </div>
                                </div>
                                <h3 className="stat-value" id="rewardsClaimed">{stats.rewardsClaimed}</h3>
                                <p className="stat-label">Belohnungen eingelöst</p>
                                <p className="stat-change positive" id="rewardsChange">{stats.rewardsChange}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="content-grid">
                        <div className="content-card">
                            <div className="card-header">
                                <h3 className="card-title">Schnellaktionen</h3>
                            </div>
                            <div className="card-content">
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                    <button
                                        id="addManualSubscriber"
                                        className="btn btn-primary"
                                        onClick={handleAddManualSubscriber}
                                    >
                                        <Plus size={16} style={{ marginRight: '8px' }} />
                                        E-Mail manuell hinzufügen
                                    </button>
                                    <a href="/admin/newsletter-editor" className="btn btn-primary">
                                        <PenTool size={16} style={{ marginRight: '8px' }} />
                                        Newsletter erstellen
                                    </a>
                                    <a href="/admin/subscribers" className="btn btn-secondary">
                                        <Users size={16} style={{ marginRight: '8px' }} />
                                        Abonnenten verwalten
                                    </a>
                                    <button
                                        id="sendTestEmail"
                                        className="btn btn-success"
                                        onClick={handleSendTestEmail}
                                    >
                                        <Send size={16} style={{ marginRight: '8px' }} />
                                        Test-E-Mail senden
                                    </button>
                                    <a href="/admin/rewards" className="btn btn-primary">
                                        <Gift size={16} style={{ marginRight: '8px' }} />
                                        Belohnungen verwalten
                                    </a>
                                </div>

                                <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
                                    <strong>💡 Tipp:</strong> Nutzen Sie das Belohnungssystem, um die Engagement-Rate zu steigern!
                                    Bestätigte Newsletter-Abonnenten erhalten automatisch einen Belohnungscode.
                                </div>
                            </div>
                        </div>

                        <div className="content-card">
                            <div className="card-header">
                                <h3 className="card-title">Neueste Aktivitäten</h3>
                            </div>
                            <div className="card-content">
                                <div id="recentActivity" style={{ fontSize: '0.9rem' }}>
                                    <div className="activity-item" style={{ padding: '0.75rem 0', borderBottom: '1px solid #e9ecef' }}>
                                        <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                                            <Mail size={16} style={{ marginRight: '8px', color: '#6c757d' }} />
                                            Newsletter versendet
                                        </div>
                                        <div style={{ color: '#666', fontSize: '0.8rem', marginLeft: '24px' }}>vor 2 Stunden</div>
                                    </div>
                                    <div className="activity-item" style={{ padding: '0.75rem 0', borderBottom: '1px solid #e9ecef' }}>
                                        <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                                            <UserPlus size={16} style={{ marginRight: '8px', color: '#6c757d' }} />
                                            Neue Anmeldung
                                        </div>
                                        <div style={{ color: '#666', fontSize: '0.8rem', marginLeft: '24px' }}>vor 3 Stunden</div>
                                    </div>
                                    <div className="activity-item" style={{ padding: '0.75rem 0', borderBottom: '1px solid #e9ecef' }}>
                                        <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                                            <Gift size={16} style={{ marginRight: '8px', color: '#6c757d' }} />
                                            Belohnung eingelöst
                                        </div>
                                        <div style={{ color: '#666', fontSize: '0.8rem', marginLeft: '24px' }}>vor 5 Stunden</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal für manuelle E-Mail-Eingabe */}
                    {isModalOpen && (
                        <div id="manualSubscriberModal" className="modal" style={{ display: 'block' }}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h3>E-Mail manuell hinzufügen</h3>
                                    <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                                </div>
                                <div className="modal-body">
                                    <div className="alert alert-info">
                                        <strong>💡 Hinweis:</strong> Diese Funktion ist für physische Anmeldungen
                                        (Losboxen, Events, persönliche Gespräche) gedacht. Die E-Mail wird direkt
                                        bestätigt und der Kontakt erhält keinen Bestätigungslink.
                                    </div>

                                    <form id="manualSubscriberForm" onSubmit={handleSubmitManualSubscriber}>
                                        <div className="form-group">
                                            <label htmlFor="manualEmail">E-Mail-Adresse *</label>
                                            <input
                                                type="email"
                                                id="manualEmail"
                                                name="email"
                                                required
                                                value={manualSubscriber.email}
                                                onChange={(e) => setManualSubscriber({ ...manualSubscriber, email: e.target.value })}
                                            />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="manualFirstName">Vorname</label>
                                                <input
                                                    type="text"
                                                    id="manualFirstName"
                                                    name="firstName"
                                                    value={manualSubscriber.firstName}
                                                    onChange={(e) => setManualSubscriber({ ...manualSubscriber, firstName: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="manualLastName">Nachname</label>
                                                <input
                                                    type="text"
                                                    id="manualLastName"
                                                    name="lastName"
                                                    value={manualSubscriber.lastName}
                                                    onChange={(e) => setManualSubscriber({ ...manualSubscriber, lastName: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                                                Abbrechen
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                <UserPlus size={16} style={{ marginRight: '8px' }} />
                                                Hinzufügen
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Fachpartner Tab */}
            {activeTab === 'fachpartner' && <PartnerManagement />}

            {/* Products Tab */}
            {activeTab === 'products' && <ProductCatalog />}
        </>
    );
};

export default AdminDashboard;
