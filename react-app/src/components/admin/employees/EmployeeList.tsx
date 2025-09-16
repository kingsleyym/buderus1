import React from 'react';
import {
  RefreshCw,
  UserX,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Building2,
  Mail,
  Phone,
  Calendar,
  User
} from 'lucide-react';
import { Employee, FACHPARTNER_OPTIONS } from './employee-types';

interface EmployeeListProps {
  employees: Employee[];
  loading: boolean;
  viewMode: 'list' | 'grid';
  onEmployeeClick: (employee: Employee) => void;
  onEmployeeAction: (type: 'approve' | 'reject' | 'disable', employee: Employee) => void;
  onFachpartnerEdit: (employee: Employee) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  loading,
  viewMode,
  onEmployeeClick,
  onEmployeeAction,
  onFachpartnerEdit
}) => {
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

  if (loading) {
    return (
      <div className="content-card">
        <div className="card-content">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <RefreshCw className="spin" size={32} style={{ color: 'var(--text-secondary)' }} />
            <p>Mitarbeiter werden geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="content-card">
        <div className="card-content">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <UserX size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
            <h3>Keine Mitarbeiter gefunden</h3>
            <p>Keine Mitarbeiter entsprechen den Filterkriterien.</p>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Kachelansicht)
  if (viewMode === 'grid') {
    return (
      <div className="content-card">
        <div className="card-content">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: '1.5rem'
          }}>
            {employees.map(employee => (
              <div key={employee.id} className="stat-card" style={{ 
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onClick={() => onEmployeeClick(employee)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
              }}
              >
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
                    marginRight: '1rem',
                    color: 'white'
                  }}>
                    {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px 0', fontWeight: '600' }}>{employee.name}</h4>
                    <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <User size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      {employee.position}
                    </p>
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
                  <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                    <Mail size={12} style={{ marginRight: '6px', color: 'var(--text-secondary)' }} />
                    <span style={{ wordBreak: 'break-all' }}>{employee.email}</span>
                  </div>
                  <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                    <Phone size={12} style={{ marginRight: '6px', color: 'var(--text-secondary)' }} />
                    {employee.phone}
                  </div>
                  <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                    <Calendar size={12} style={{ marginRight: '6px', color: 'var(--text-secondary)' }} />
                    Seit {formatDate(employee.createdAt)}
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

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => onEmployeeClick(employee)}
                    style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                  >
                    <Eye size={14} style={{ marginRight: '4px' }} />
                    Details
                  </button>

                  <button 
                    className="btn btn-secondary"
                    onClick={() => onFachpartnerEdit(employee)}
                    style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                  >
                    <Edit size={14} style={{ marginRight: '4px' }} />
                    Fachpartner
                  </button>

                  {employee.status === 'pending' && (
                    <>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => onEmployeeAction('approve', employee)}
                        style={{ 
                          fontSize: '0.8rem', 
                          padding: '0.5rem 0.75rem',
                          color: 'var(--success-color)',
                          borderColor: 'var(--success-color)'
                        }}
                      >
                        <CheckCircle size={14} style={{ marginRight: '4px' }} />
                        Freischalten
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => onEmployeeAction('reject', employee)}
                        style={{ 
                          fontSize: '0.8rem', 
                          padding: '0.5rem 0.75rem',
                          color: 'var(--danger-color)',
                          borderColor: 'var(--danger-color)'
                        }}
                      >
                        <XCircle size={14} style={{ marginRight: '4px' }} />
                        Ablehnen
                      </button>
                    </>
                  )}

                  {employee.status === 'approved' && (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => onEmployeeAction('disable', employee)}
                      style={{ 
                        fontSize: '0.8rem', 
                        padding: '0.5rem 0.75rem',
                        color: 'var(--danger-color)',
                        borderColor: 'var(--danger-color)'
                      }}
                    >
                      <UserX size={14} style={{ marginRight: '4px' }} />
                      Deaktivieren
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // List View - Responsive Listenansicht
  return (
    <div className="content-card">
      <div className="card-content" style={{ padding: '0', overflowX: 'auto' }}>
        {/* Desktop Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60px 1fr 200px 150px 200px 250px',
          gap: '1rem',
          padding: '1rem',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--background-secondary)',
          fontWeight: '600',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          minWidth: '900px'
        }}>
          <div></div>
          <div>MITARBEITER</div>
          <div>KONTAKT</div>
          <div>STATUS</div>
          <div>FACHPARTNER</div>
          <div style={{ textAlign: 'center' }}>AKTIONEN</div>
        </div>

        {/* Employee Rows */}
        {employees.map(employee => (
          <div key={employee.id} style={{
            display: 'grid',
            gridTemplateColumns: '60px 1fr 200px 150px 200px 250px',
            gap: '1rem',
            padding: '1rem',
            borderBottom: '1px solid var(--border-color)',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            minWidth: '900px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background-secondary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          onClick={() => onEmployeeClick(employee)}
          >
            {/* Avatar */}
            <div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                color: 'white'
              }}>
                {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
              </div>
            </div>

            {/* Employee Info */}
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>{employee.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <User size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                {employee.position}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <Calendar size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                Seit {formatDate(employee.createdAt)}
              </div>
            </div>

            {/* Contact */}
            <div>
              <div style={{ fontSize: '0.8rem', marginBottom: '4px' }}>
                <Mail size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                <span style={{ wordBreak: 'break-all' }}>{employee.email}</span>
              </div>
              <div style={{ fontSize: '0.8rem' }}>
                <Phone size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                {employee.phone}
              </div>
            </div>

            {/* Status */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
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

            {/* Fachpartner */}
            <div>
              {employee.fachpartner.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {getFachpartnerInfo(employee.fachpartner).map((fp, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      backgroundColor: fp?.color + '20',
                      color: fp?.color,
                      padding: '2px 6px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '500'
                    }}>
                      <Building2 size={10} style={{ marginRight: '2px' }} />
                      {fp?.label}
                    </div>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  Keine Zuordnung
                </span>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
              <button 
                className="btn btn-secondary"
                onClick={() => onEmployeeClick(employee)}
                style={{ fontSize: '0.7rem', padding: '0.4rem 0.6rem' }}
                title="Details anzeigen"
              >
                <Eye size={12} />
              </button>

              <button 
                className="btn btn-secondary"
                onClick={() => onFachpartnerEdit(employee)}
                style={{ fontSize: '0.7rem', padding: '0.4rem 0.6rem' }}
                title="Fachpartner bearbeiten"
              >
                <Edit size={12} />
              </button>

              {employee.status === 'pending' && (
                <>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => onEmployeeAction('approve', employee)}
                    style={{ 
                      fontSize: '0.7rem', 
                      padding: '0.4rem 0.6rem',
                      color: 'var(--success-color)',
                      borderColor: 'var(--success-color)'
                    }}
                    title="Freischalten"
                  >
                    <CheckCircle size={12} />
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => onEmployeeAction('reject', employee)}
                    style={{ 
                      fontSize: '0.7rem', 
                      padding: '0.4rem 0.6rem',
                      color: 'var(--danger-color)',
                      borderColor: 'var(--danger-color)'
                    }}
                    title="Ablehnen"
                  >
                    <XCircle size={12} />
                  </button>
                </>
              )}

              {employee.status === 'approved' && (
                <button 
                  className="btn btn-secondary"
                  onClick={() => onEmployeeAction('disable', employee)}
                  style={{ 
                    fontSize: '0.7rem', 
                    padding: '0.4rem 0.6rem',
                    color: 'var(--danger-color)',
                    borderColor: 'var(--danger-color)'
                  }}
                  title="Deaktivieren"
                >
                  <UserX size={12} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;
