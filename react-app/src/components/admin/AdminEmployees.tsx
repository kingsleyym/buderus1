import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserPlus, 
  RefreshCw, 
  Filter,
  Edit,
  CheckCircle,
  XCircle,
  Eye,
  UserX,
  Building2
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  status: 'pending' | 'approved' | 'rejected' | 'disabled';
  fachpartner: string[]; // Array für mehrere Fachpartnerschaften
  createdAt: string;
  lastLogin?: string;
  bio?: string;
  avatar?: string;
}

const FACHPARTNER_OPTIONS = [
  { value: 'buderus', label: 'Buderus', color: '#FFD700' },
  { value: 'bosch', label: 'Bosch', color: '#0066CC' }
];

const AdminEmployees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fachpartnerFilter, setFachpartnerFilter] = useState('all');
  const [showFachpartnerModal, setShowFachpartnerModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedFachpartners, setSelectedFachpartners] = useState<string[]>([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      // TODO: Firebase Integration
      // Temporäre Test-Daten
      const testEmployees: Employee[] = [
        {
          id: '1',
          name: 'Luca Schweiger',
          firstName: 'Luca',
          lastName: 'Schweiger',
          email: 'luca@kingsley.me',
          phone: '+49 123 456789',
          position: 'Vertriebsmitarbeiter',
          status: 'approved',
          fachpartner: ['buderus', 'bosch'], // Mehrere Fachpartnerschaften
          createdAt: '2024-01-15',
          lastLogin: '2024-03-10'
        },
        {
          id: '2',
          name: 'Max Mustermann',
          firstName: 'Max',
          lastName: 'Mustermann',
          email: 'max@example.com',
          phone: '+49 987 654321',
          position: 'Installateur',
          status: 'pending',
          fachpartner: [], // Noch keine Zuordnung
          createdAt: '2024-03-01'
        }
      ];
      setEmployees(testEmployees);
    } catch (error) {
      console.error('Fehler beim Laden der Mitarbeiter:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEmployees = () => {
    return employees.filter(emp => {
      const matchesSearch = !searchTerm || 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
      const matchesFachpartner = fachpartnerFilter === 'all' || 
        (fachpartnerFilter === 'none' && emp.fachpartner.length === 0) ||
        emp.fachpartner.includes(fachpartnerFilter);
      
      return matchesSearch && matchesStatus && matchesFachpartner;
    });
  };

  const getStatusCounts = () => {
    return {
      all: employees.length,
      pending: employees.filter(e => e.status === 'pending').length,
      approved: employees.filter(e => e.status === 'approved').length,
      rejected: employees.filter(e => e.status === 'rejected').length,
      disabled: employees.filter(e => e.status === 'disabled').length
    };
  };

  const openFachpartnerModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setSelectedFachpartners([...employee.fachpartner]);
    setShowFachpartnerModal(true);
  };

  const saveFachpartnerChanges = async () => {
    if (!editingEmployee) return;
    
    try {
      setEmployees(prev => prev.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...emp, fachpartner: [...selectedFachpartners] }
          : emp
      ));
      setShowFachpartnerModal(false);
      setEditingEmployee(null);
      setSelectedFachpartners([]);
      alert('Fachpartner-Zuordnungen wurden aktualisiert.');
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
    }
  };

  const toggleFachpartner = (fachpartner: string) => {
    setSelectedFachpartners(prev => 
      prev.includes(fachpartner)
        ? prev.filter(fp => fp !== fachpartner)
        : [...prev, fachpartner]
    );
  };

  const rejectEmployee = async (employeeId: string) => {
    try {
      setEmployees(prev => prev.map(emp => 
        emp.id === employeeId ? { ...emp, status: 'rejected' as const } : emp
      ));
      alert('Mitarbeiter wurde abgelehnt.');
    } catch (error) {
      console.error('Fehler beim Ablehnen:', error);
    }
  };

  const disableEmployee = async (employeeId: string) => {
    try {
      setEmployees(prev => prev.map(emp => 
        emp.id === employeeId ? { ...emp, status: 'disabled' as const } : emp
      ));
      alert('Mitarbeiter wurde deaktiviert.');
    } catch (error) {
      console.error('Fehler beim Deaktivieren:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#28A745';
      case 'pending': return '#FFC107';
      case 'rejected': return '#DC3545';
      case 'disabled': return '#6C757D';
      default: return '#6C757D';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Freigeschalten';
      case 'pending': return 'Wartend';
      case 'rejected': return 'Abgelehnt';
      case 'disabled': return 'Deaktiviert';
      default: return 'Unbekannt';
    }
  };

  const getFachpartnerInfo = (fachpartnerList: string[]) => {
    return fachpartnerList.map(fp => 
      FACHPARTNER_OPTIONS.find(option => option.value === fp)
    ).filter(Boolean);
  };

  const counts = getStatusCounts();
  const filteredEmployees = getFilteredEmployees();

  return (
    <>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Mitarbeiter Verwaltung</h1>
        <p className="dashboard-subtitle">Mitarbeiter freischalten, verwalten und Fachpartnern zuordnen</p>
      </div>

      {/* Header Actions */}
      <div className="content-card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-content" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button className="btn btn-primary">
                <UserPlus size={16} style={{ marginRight: '8px' }} />
                Mitarbeiter hinzufügen
              </button>
              <button className="btn btn-secondary" onClick={loadEmployees}>
                <RefreshCw size={16} style={{ marginRight: '8px' }} />
                Aktualisieren
              </button>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {filteredEmployees.length} von {employees.length} Mitarbeitern
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="content-card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3 className="card-title">
            <Filter size={18} style={{ marginRight: '8px' }} />
            Filter & Suche
          </h3>
        </div>
        <div className="card-content">
          {/* Search */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Name, E-Mail oder Telefon suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
            {[
              { value: 'all', label: `Alle (${counts.all})` },
              { value: 'pending', label: `Wartend (${counts.pending})` },
              { value: 'approved', label: `Aktiv (${counts.approved})` },
              { value: 'rejected', label: `Abgelehnt (${counts.rejected})` },
              { value: 'disabled', label: `Deaktiviert (${counts.disabled})` }
            ].map(filter => (
              <button
                key={filter.value}
                className={`btn ${statusFilter === filter.value ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter(filter.value)}
                style={{ fontSize: '0.8rem', padding: '0.5rem' }}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Fachpartner Filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`btn ${fachpartnerFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFachpartnerFilter('all')}
              style={{ fontSize: '0.8rem', padding: '0.5rem' }}
            >
              Alle Fachpartner
            </button>
            {FACHPARTNER_OPTIONS.map(fp => (
              <button
                key={fp.value}
                className={`btn ${fachpartnerFilter === fp.value ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFachpartnerFilter(fp.value)}
                style={{ fontSize: '0.8rem', padding: '0.5rem', borderColor: fp.color }}
              >
                <Building2 size={14} style={{ marginRight: '4px' }} />
                {fp.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="content-card">
        <div className="card-content">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <RefreshCw className="spin" size={32} style={{ color: 'var(--text-secondary)' }} />
              <p>Mitarbeiter werden geladen...</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <UserX size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
              <h3>Keine Mitarbeiter gefunden</h3>
              <p>Keine Mitarbeiter entsprechen den Filterkriterien.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {filteredEmployees.map(employee => (
                <div key={employee.id} className="stat-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      marginRight: '1rem'
                    }}>
                      {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontWeight: '600' }}>{employee.name}</h4>
                      <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{employee.position}</p>
                    </div>
                    <div style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      backgroundColor: getStatusColor(employee.status) + '20',
                      color: getStatusColor(employee.status)
                    }}>
                      {getStatusText(employee.status)}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                    <div style={{ marginBottom: '4px' }}>
                      <strong>E-Mail:</strong> {employee.email}
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      <strong>Telefon:</strong> {employee.phone}
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      <strong>Registriert:</strong> {formatDate(employee.createdAt)}
                    </div>
                    {employee.fachpartner.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                        {getFachpartnerInfo(employee.fachpartner).map((fp, index) => (
                          <div key={index} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            backgroundColor: fp?.color + '20',
                            color: fp?.color,
                            padding: '2px 6px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}>
                            <Building2 size={12} style={{ marginRight: '4px' }} />
                            {fp?.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                      className="btn btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                    >
                      <Eye size={14} style={{ marginRight: '4px' }} />
                      Details
                    </button>

                    <button 
                      className="btn btn-secondary"
                      onClick={() => openFachpartnerModal(employee)}
                      style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                    >
                      <Edit size={14} style={{ marginRight: '4px' }} />
                      Fachpartner
                    </button>

                    {employee.status === 'pending' && (
                      <button 
                        className="btn btn-secondary"
                        onClick={() => rejectEmployee(employee.id)}
                        style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem', color: 'var(--danger-color)' }}
                      >
                        <XCircle size={14} style={{ marginRight: '4px' }} />
                        Ablehnen
                      </button>
                    )}

                    {employee.status === 'approved' && (
                      <button 
                        className="btn btn-secondary"
                        onClick={() => disableEmployee(employee.id)}
                        style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem', color: 'var(--danger-color)' }}
                      >
                        <UserX size={14} style={{ marginRight: '4px' }} />
                        Deaktivieren
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fachpartner Assignment Modal */}
      {showFachpartnerModal && editingEmployee && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Fachpartner zuordnen - {editingEmployee.name}</h3>
              <span className="close" onClick={() => setShowFachpartnerModal(false)}>&times;</span>
            </div>
            <div className="modal-body">
              <div className="alert alert-info">
                <strong>💡 Hinweis:</strong> Ein Mitarbeiter kann mehreren Fachpartnern gleichzeitig zugeordnet werden. 
                Beim Login kann er dann auswählen, für welchen Fachpartner er arbeiten möchte.
              </div>
              
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>Verfügbare Fachpartner:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {FACHPARTNER_OPTIONS.map(fp => (
                    <label key={fp.value} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '0.75rem',
                      border: `2px solid ${selectedFachpartners.includes(fp.value) ? fp.color : 'var(--border-color)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: selectedFachpartners.includes(fp.value) ? fp.color + '10' : 'white',
                      transition: 'all 0.2s ease'
                    }}>
                      <input
                        type="checkbox"
                        checked={selectedFachpartners.includes(fp.value)}
                        onChange={() => toggleFachpartner(fp.value)}
                        style={{ marginRight: '12px', transform: 'scale(1.2)' }}
                      />
                      <Building2 size={20} style={{ marginRight: '8px', color: fp.color }} />
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '1rem' }}>{fp.label}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {fp.value === 'buderus' ? 'Heizungs- und Energiesysteme' : 'Automotive und Technik'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                
                {selectedFachpartners.length === 0 && (
                  <div style={{ 
                    padding: '1rem', 
                    marginTop: '1rem',
                    backgroundColor: '#FFF3CD',
                    border: '1px solid #FFE69C',
                    borderRadius: '8px',
                    color: '#856404'
                  }}>
                    ⚠️ Mindestens ein Fachpartner muss ausgewählt werden.
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowFachpartnerModal(false)}
              >
                Abbrechen
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={saveFachpartnerChanges}
                disabled={selectedFachpartners.length === 0}
                style={{ opacity: selectedFachpartners.length === 0 ? 0.5 : 1 }}
              >
                <CheckCircle size={16} style={{ marginRight: '8px' }} />
                Speichern ({selectedFachpartners.length} ausgewählt)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminEmployees;
