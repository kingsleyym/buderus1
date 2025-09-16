import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Upload, Plus } from 'lucide-react';
import { Subscriber, FilterStatus, FilterSource } from '../shared/types';
import SubscriberStats from './SubscriberStats';
import SubscriberFilters from './SubscriberFilters';
import SubscriberList from './SubscriberList';
import SubscriberModal from './SubscriberModal';
import ImportExportModal from './ImportExportModal';
import { subscriberService } from './SubscriberService';

// Mock Data für Development
const mockSubscribers: Subscriber[] = [
  {
    id: '1',
    email: 'max.mustermann@example.com',
    firstName: 'Max',
    lastName: 'Mustermann',
    company: 'Mustermann GmbH',
    confirmed: true,
    createdAt: new Date('2024-01-15'),
    confirmedAt: new Date('2024-01-15'),
    source: 'website' as const,
    tags: ['kunde', 'premium'],
    lastActivity: new Date('2024-03-10')
  },
  {
    id: '2',
    email: 'anna.schmidt@test.de',
    firstName: 'Anna',
    lastName: 'Schmidt',
    confirmed: false,
    createdAt: new Date('2024-03-05'),
    confirmedAt: null,
    source: 'manual' as const,
    tags: ['interessent'],
    lastActivity: null
  },
  {
    id: '3',
    email: 'peter.mueller@firma.com',
    firstName: 'Peter',
    lastName: 'Müller',
    company: 'Tech Solutions AG',
    confirmed: true,
    createdAt: new Date('2024-02-20'),
    confirmedAt: new Date('2024-02-20'),
    source: 'import' as const,
    tags: ['b2b', 'partner'],
    lastActivity: new Date('2024-03-08')
  }
];

const SubscriberManagement: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterSource, setFilterSource] = useState<FilterSource>('all');
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null);
  const [showImportExportModal, setShowImportExportModal] = useState(false);
  const [importExportMode, setImportExportMode] = useState<'import' | 'export'>('import');

  // Load data on component mount
  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      
      // Set initial mock data for development
      subscriberService.setMockData(mockSubscribers);
      
      const data = await subscriberService.getSubscribers();
      setSubscribers(data);
    } catch (error) {
      console.error('Fehler beim Laden der Abonnenten:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  useEffect(() => {
    let filtered = subscribers;

    // Text Search
    if (searchTerm) {
      filtered = filtered.filter(sub => 
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.company && sub.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status Filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(sub => 
        filterStatus === 'confirmed' ? sub.confirmed : !sub.confirmed
      );
    }

    // Source Filter
    if (filterSource !== 'all') {
      filtered = filtered.filter(sub => sub.source === filterSource);
    }

    setFilteredSubscribers(filtered);
  }, [subscribers, searchTerm, filterStatus, filterSource]);

  const handleEdit = async (subscriber: Subscriber) => {
    setEditingSubscriber(subscriber);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDelete = async (subscriberId: string) => {
    if (!window.confirm('Abonnent wirklich löschen?')) return;
    
    try {
      await subscriberService.deleteSubscriber(subscriberId);
      await loadSubscribers(); // Reload data
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      alert('Fehler beim Löschen des Abonnenten');
    }
  };

  const handleAdd = () => {
    setEditingSubscriber(null);
    setModalMode('add');
    setShowModal(true);
  };

  const handleSaveSubscriber = async (subscriberData: Omit<Subscriber, 'id' | 'createdAt'>) => {
    try {
      if (modalMode === 'add') {
        await subscriberService.addSubscriber(subscriberData);
      } else if (editingSubscriber) {
        await subscriberService.updateSubscriber(editingSubscriber.id, subscriberData);
      }
      
      await loadSubscribers(); // Reload data
      setShowModal(false);
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert('Fehler beim Speichern des Abonnenten');
    }
  };

  const handleExport = () => {
    setImportExportMode('export');
    setShowImportExportModal(true);
  };

  const handleImport = () => {
    setImportExportMode('import');
    setShowImportExportModal(true);
  };

  const handleImportSubscribers = async (importData: Omit<Subscriber, 'id' | 'createdAt'>[]) => {
    try {
      await subscriberService.addMultipleSubscribers(importData);
      await loadSubscribers(); // Reload data
      alert(`${importData.length} Abonnenten erfolgreich importiert`);
    } catch (error) {
      console.error('Fehler beim Import:', error);
      alert('Fehler beim Importieren der Abonnenten');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        <div className="loading-spinner">Lade Abonnenten...</div>
      </div>
    );
  }

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
            <h1 className="dashboard-title">Abonnenten Verwaltung</h1>
            <p className="dashboard-subtitle">
              {filteredSubscribers.length} von {subscribers.length} Abonnenten
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn btn-secondary"
            onClick={handleExport}
          >
            <Download size={16} />
            Export
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleImport}
          >
            <Upload size={16} />
            Import
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleAdd}
          >
            <Plus size={16} />
            Abonnent hinzufügen
          </button>
        </div>
      </div>

      <SubscriberStats subscribers={subscribers} />

      <SubscriberFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterSource={filterSource}
        setFilterSource={setFilterSource}
      />

      <SubscriberList
        subscribers={filteredSubscribers}
        selectedSubscribers={selectedSubscribers}
        setSelectedSubscribers={setSelectedSubscribers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modals */}
      <SubscriberModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveSubscriber}
        subscriber={editingSubscriber}
        mode={modalMode}
      />

      <ImportExportModal
        isOpen={showImportExportModal}
        onClose={() => setShowImportExportModal(false)}
        onImport={handleImportSubscribers}
        onExport={() => {}} // Handled internally by modal
        subscribers={subscribers}
        mode={importExportMode}
      />
    </>
  );
};

export default SubscriberManagement;
