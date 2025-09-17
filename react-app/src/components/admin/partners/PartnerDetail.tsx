import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  Plus,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building2,
  Package,
  Calendar,
  FileText,
  User
} from 'lucide-react';
import { Partner, PartnerContactEntry } from './partner-types-simple';
import { mockPartnersSimple } from '../../../data/mockPartnersSimple';
import './partners-simple.css';

const PartnerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPartner, setEditedPartner] = useState<Partner | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'products' | 'contacts' | 'contracts'>('info');

  useEffect(() => {
    const foundPartner = mockPartnersSimple.find(p => p.id === id);
    if (foundPartner) {
      setPartner(foundPartner);
      setEditedPartner({ ...foundPartner });
    }
  }, [id]);

  const handleSave = () => {
    if (editedPartner) {
      setPartner(editedPartner);
      setIsEditing(false);
      // TODO: API call to save partner
    }
  };

  const handleCancel = () => {
    setEditedPartner(partner ? { ...partner } : null);
    setIsEditing(false);
  };

  const addContactEntry = () => {
    if (editedPartner) {
      const newEntry: PartnerContactEntry = {
        id: Date.now().toString(),
        type: 'note',
        subject: '',
        description: '',
        contactPerson: editedPartner.contactPerson.name,
        date: new Date(),
        priority: 'medium'
      };
      setEditedPartner({
        ...editedPartner,
        contactHistory: [...editedPartner.contactHistory, newEntry]
      });
    }
  };

  if (!partner) {
    return (
      <div className="partner-detail-container">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Partner nicht gefunden</h2>
          <Link to="/admin/partners" className="text-blue-600 hover:text-blue-700">
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    );
  }

  const currentData = isEditing ? editedPartner : partner;

  return (
    <div className="partner-detail-container">
      {/* Header */}
      <div className="partner-detail-header">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/partners')}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Zurück
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentData?.name}</h1>
            <p className="text-gray-600">
              {currentData?.type === 'manufacturer' ? 'Hersteller' :
               currentData?.type === 'distributor' ? 'Händler' : 'Service'} • 
              {currentData?.status === 'active' ? ' Aktiv' : ' Inaktiv'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button onClick={handleCancel} className="btn-secondary flex items-center gap-2">
                <X size={16} />
                Abbrechen
              </button>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                <Save size={16} />
                Speichern
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)} 
              className="btn-primary flex items-center gap-2"
            >
              <Edit size={16} />
              Bearbeiten
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="partner-detail-tabs">
        <button 
          className={`tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <Building2 size={16} />
          Informationen
        </button>
        <button 
          className={`tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={16} />
          Produkte
        </button>
        <button 
          className={`tab ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          <User size={16} />
          Kontakte
        </button>
        <button 
          className={`tab ${activeTab === 'contracts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contracts')}
        >
          <FileText size={16} />
          Verträge
        </button>
      </div>

      {/* Content */}
      <div className="partner-detail-content">
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grundinformationen */}
            <div className="info-section">
              <h3 className="section-title">Grundinformationen</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedPartner?.name || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">{currentData?.name}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Typ</label>
                  {isEditing ? (
                    <select
                      value={editedPartner?.type || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? { ...prev, type: e.target.value as any } : null)}
                      className="form-input"
                    >
                      <option value="manufacturer">Hersteller</option>
                      <option value="distributor">Händler</option>
                      <option value="service">Service</option>
                    </select>
                  ) : (
                    <div className="form-value">
                      {currentData?.type === 'manufacturer' ? 'Hersteller' :
                       currentData?.type === 'distributor' ? 'Händler' : 'Service'}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>E-Mail</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedPartner?.email || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? { ...prev, email: e.target.value } : null)}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">{currentData?.email}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Telefon</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedPartner?.phone || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? { ...prev, phone: e.target.value } : null)}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">{currentData?.phone}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Website</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={editedPartner?.website || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? { ...prev, website: e.target.value } : null)}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">
                      {currentData?.website ? (
                        <a href={currentData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                          {currentData.website}
                        </a>
                      ) : 'Nicht angegeben'}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Status</label>
                  {isEditing ? (
                    <select
                      value={editedPartner?.status || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? { ...prev, status: e.target.value as any } : null)}
                      className="form-input"
                    >
                      <option value="active">Aktiv</option>
                      <option value="inactive">Inaktiv</option>
                      <option value="pending">Pending</option>
                    </select>
                  ) : (
                    <div className="form-value">
                      <span className={`status-badge ${
                        currentData?.status === 'active' ? 'text-green-600 bg-green-100' :
                        currentData?.status === 'inactive' ? 'text-red-600 bg-red-100' : 'text-yellow-600 bg-yellow-100'
                      }`}>
                        {currentData?.status === 'active' ? 'Aktiv' :
                         currentData?.status === 'inactive' ? 'Inaktiv' : 'Pending'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div className="info-section">
              <h3 className="section-title">Adresse</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Straße</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedPartner?.address.street || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? { 
                        ...prev, 
                        address: { ...prev.address, street: e.target.value }
                      } : null)}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">{currentData?.address.street}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>PLZ</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedPartner?.address.postalCode || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? { 
                        ...prev, 
                        address: { ...prev.address, postalCode: e.target.value }
                      } : null)}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">{currentData?.address.postalCode}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Stadt</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedPartner?.address.city || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? { 
                        ...prev, 
                        address: { ...prev.address, city: e.target.value }
                      } : null)}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">{currentData?.address.city}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Land</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedPartner?.address.country || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? { 
                        ...prev, 
                        address: { ...prev.address, country: e.target.value }
                      } : null)}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">{currentData?.address.country}</div>
                  )}
                </div>
              </div>

              {/* Ansprechpartner */}
              <h4 className="section-subtitle">Ansprechpartner</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedPartner?.contactPerson.name || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? { 
                        ...prev, 
                        contactPerson: { ...prev.contactPerson, name: e.target.value }
                      } : null)}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">{currentData?.contactPerson.name}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Position</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedPartner?.contactPerson.position || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? { 
                        ...prev, 
                        contactPerson: { ...prev.contactPerson, position: e.target.value }
                      } : null)}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">{currentData?.contactPerson.position}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>E-Mail</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedPartner?.contactPerson.email || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? { 
                        ...prev, 
                        contactPerson: { ...prev.contactPerson, email: e.target.value }
                      } : null)}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">{currentData?.contactPerson.email}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Telefon</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedPartner?.contactPerson.phone || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? { 
                        ...prev, 
                        contactPerson: { ...prev.contactPerson, phone: e.target.value }
                      } : null)}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">{currentData?.contactPerson.phone}</div>
                  )}
                </div>
              </div>

              {/* Notizen */}
              <div className="form-group">
                <label>Notizen</label>
                {isEditing ? (
                  <textarea
                    value={editedPartner?.notes || ''}
                    onChange={(e) => setEditedPartner(prev => prev ? { ...prev, notes: e.target.value } : null)}
                    className="form-input"
                    rows={4}
                  />
                ) : (
                  <div className="form-value">{currentData?.notes || 'Keine Notizen'}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-section">
            <div className="section-header">
              <h3 className="section-title">Zugeordnete Produkte</h3>
              <button className="btn-primary flex items-center gap-2">
                <Plus size={16} />
                Produkt zuordnen
              </button>
            </div>
            
            <div className="products-grid">
              {currentData?.productIds.map((productId) => (
                <div key={productId} className="product-card">
                  <div className="product-info">
                    <h4>Produkt {productId}</h4>
                    <p className="text-gray-600">Produktbeschreibung hier...</p>
                  </div>
                  <button className="btn-danger">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            
            {(!currentData?.productIds || currentData.productIds.length === 0) && (
              <div className="empty-state">
                <Package size={48} className="text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mt-4">Keine Produkte zugeordnet</h3>
                <p className="text-gray-500">Fügen Sie Produkte zu diesem Partner hinzu.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="contacts-section">
            <div className="section-header">
              <h3 className="section-title">Kontaktverlauf</h3>
              {isEditing && (
                <button onClick={addContactEntry} className="btn-primary flex items-center gap-2">
                  <Plus size={16} />
                  Kontakt hinzufügen
                </button>
              )}
            </div>
            
            <div className="contacts-list">
              {currentData?.contactHistory.map((contact, index) => (
                <div key={contact.id} className="contact-entry">
                  <div className="contact-header">
                    <div className="contact-type">
                      {contact.type === 'email' && <Mail size={16} />}
                      {contact.type === 'phone' && <Phone size={16} />}
                      {contact.type === 'meeting' && <User size={16} />}
                      {contact.type === 'contract' && <FileText size={16} />}
                      {contact.type === 'note' && <FileText size={16} />}
                      <span className="type-label">
                        {contact.type === 'email' ? 'E-Mail' :
                         contact.type === 'phone' ? 'Telefon' :
                         contact.type === 'meeting' ? 'Meeting' :
                         contact.type === 'contract' ? 'Vertrag' : 'Notiz'}
                      </span>
                    </div>
                    <div className="contact-date">
                      <Calendar size={14} />
                      {contact.date.toLocaleDateString('de-DE')}
                    </div>
                  </div>
                  
                  {isEditing ? (
                    <div className="contact-form">
                      <input
                        type="text"
                        placeholder="Betreff"
                        value={contact.subject}
                        onChange={(e) => {
                          const updatedHistory = [...(editedPartner?.contactHistory || [])];
                          updatedHistory[index] = { ...contact, subject: e.target.value };
                          setEditedPartner(prev => prev ? { ...prev, contactHistory: updatedHistory } : null);
                        }}
                        className="form-input mb-2"
                      />
                      <textarea
                        placeholder="Beschreibung"
                        value={contact.description}
                        onChange={(e) => {
                          const updatedHistory = [...(editedPartner?.contactHistory || [])];
                          updatedHistory[index] = { ...contact, description: e.target.value };
                          setEditedPartner(prev => prev ? { ...prev, contactHistory: updatedHistory } : null);
                        }}
                        className="form-input"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <div className="contact-content">
                      <h4 className="contact-subject">{contact.subject}</h4>
                      <p className="contact-description">{contact.description}</p>
                      <div className="contact-details">
                        <span>Kontakt: {contact.contactPerson}</span>
                        {contact.outcome && <span>Ergebnis: {contact.outcome}</span>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {(!currentData?.contactHistory || currentData.contactHistory.length === 0) && (
              <div className="empty-state">
                <User size={48} className="text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mt-4">Kein Kontaktverlauf</h3>
                <p className="text-gray-500">Noch keine Kontakte mit diesem Partner erfasst.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="contracts-section">
            <div className="section-header">
              <h3 className="section-title">Verträge</h3>
              <button className="btn-primary flex items-center gap-2">
                <Plus size={16} />
                Neuer Vertrag
              </button>
            </div>
            
            <div className="contracts-list">
              {currentData?.contracts.map((contract) => (
                <div key={contract.id} className="contract-card">
                  <div className="contract-header">
                    <h4 className="contract-type">
                      {contract.type === 'distribution' ? 'Vertriebsvertrag' :
                       contract.type === 'service' ? 'Servicevertrag' :
                       contract.type === 'exclusive' ? 'Exklusivvertrag' : 'Garantievertrag'}
                    </h4>
                    <span className={`status-badge ${contract.isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                      {contract.isActive ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </div>
                  
                  <div className="contract-details">
                    <div className="detail-row">
                      <span>Laufzeit:</span>
                      <span>{contract.startDate.toLocaleDateString('de-DE')} - {contract.endDate.toLocaleDateString('de-DE')}</span>
                    </div>
                    <div className="detail-row">
                      <span>Rabatt:</span>
                      <span>{contract.discountLevel}%</span>
                    </div>
                    {contract.minimumOrder && (
                      <div className="detail-row">
                        <span>Mindestbestellung:</span>
                        <span>€{contract.minimumOrder.toLocaleString('de-DE')}</span>
                      </div>
                    )}
                    <div className="detail-row">
                      <span>Bedingungen:</span>
                      <span>{contract.terms}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {(!currentData?.contracts || currentData.contracts.length === 0) && (
              <div className="empty-state">
                <FileText size={48} className="text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mt-4">Keine Verträge</h3>
                <p className="text-gray-500">Noch keine Verträge mit diesem Partner erfasst.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerDetail;
