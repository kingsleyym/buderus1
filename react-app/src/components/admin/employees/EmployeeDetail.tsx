import React, { useState } from 'react';
import {
    ArrowLeft,
    Save,
    X,
    Edit,
    CheckCircle,
    XCircle,
    UserX,
    Mail,
    Phone,
    Calendar,
    User,
    Building2
} from 'lucide-react';
import { Employee, FACHPARTNER_OPTIONS } from './employee-types';

interface EmployeeDetailProps {
    employee: Employee;
    onBack: () => void;
    onUpdate: (employee: Employee) => void;
    onFachpartnerEdit: (employee: Employee) => void;
    onEmployeeAction: (type: 'approve' | 'reject' | 'disable', employee: Employee) => void;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({
    employee,
    onBack,
    onUpdate,
    onFachpartnerEdit,
    onEmployeeAction
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedEmployee, setEditedEmployee] = useState<Employee>({ ...employee });

    const handleSave = () => {
        onUpdate(editedEmployee);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedEmployee({ ...employee });
        setIsEditing(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
            case 'pending': return 'Wartend auf Freischaltung';
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

    return (
        <>
            {/* Header */}
            <div className="dashboard-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={onBack}
                        style={{ padding: '0.5rem' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="dashboard-title">Mitarbeiter Details</h1>
                        <p className="dashboard-subtitle">Detailansicht und Bearbeitung von {employee.name}</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                {/* Main Content */}
                <div className="content-card">
                    <div className="card-header">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 className="card-title">Mitarbeiter Informationen</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {!isEditing ? (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <Edit size={16} style={{ marginRight: '8px' }} />
                                        Bearbeiten
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleSave}
                                        >
                                            <Save size={16} style={{ marginRight: '8px' }} />
                                            Speichern
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={handleCancel}
                                        >
                                            <X size={16} style={{ marginRight: '8px' }} />
                                            Abbrechen
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="card-content">
                        {/* Avatar and Basic Info */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--background-secondary)', borderRadius: '8px' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--primary-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '2rem',
                                color: 'white',
                                marginRight: '1.5rem'
                            }}>
                                {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem' }}>{employee.name}</h2>
                                <div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                    <User size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                    {employee.position}
                                </div>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    padding: '6px 12px',
                                    borderRadius: '16px',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    backgroundColor: getStatusColor(employee.status) + '20',
                                    color: getStatusColor(employee.status)
                                }}>
                                    {getStatusText(employee.status)}
                                </div>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {/* First Name */}
                            <div className="form-group">
                                <label>Vorname</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedEmployee.firstName}
                                        onChange={(e) => setEditedEmployee(prev => ({
                                            ...prev,
                                            firstName: e.target.value,
                                            name: `${e.target.value} ${prev.lastName}`
                                        }))}
                                    />
                                ) : (
                                    <div style={{ padding: '0.75rem', backgroundColor: 'var(--background-secondary)', borderRadius: '4px' }}>
                                        {employee.firstName}
                                    </div>
                                )}
                            </div>

                            {/* Last Name */}
                            <div className="form-group">
                                <label>Nachname</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedEmployee.lastName}
                                        onChange={(e) => setEditedEmployee(prev => ({
                                            ...prev,
                                            lastName: e.target.value,
                                            name: `${prev.firstName} ${e.target.value}`
                                        }))}
                                    />
                                ) : (
                                    <div style={{ padding: '0.75rem', backgroundColor: 'var(--background-secondary)', borderRadius: '4px' }}>
                                        {employee.lastName}
                                    </div>
                                )}
                            </div>

                            {/* Email */}
                            <div className="form-group">
                                <label>E-Mail</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={editedEmployee.email}
                                        onChange={(e) => setEditedEmployee(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                ) : (
                                    <div style={{ padding: '0.75rem', backgroundColor: 'var(--background-secondary)', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                                        <Mail size={16} style={{ marginRight: '8px', color: 'var(--text-secondary)' }} />
                                        {employee.email}
                                    </div>
                                )}
                            </div>

                            {/* Phone */}
                            <div className="form-group">
                                <label>Telefon</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={editedEmployee.phone}
                                        onChange={(e) => setEditedEmployee(prev => ({ ...prev, phone: e.target.value }))}
                                    />
                                ) : (
                                    <div style={{ padding: '0.75rem', backgroundColor: 'var(--background-secondary)', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                                        <Phone size={16} style={{ marginRight: '8px', color: 'var(--text-secondary)' }} />
                                        {employee.phone}
                                    </div>
                                )}
                            </div>

                            {/* Position */}
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label>Position</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedEmployee.position}
                                        onChange={(e) => setEditedEmployee(prev => ({ ...prev, position: e.target.value }))}
                                    />
                                ) : (
                                    <div style={{ padding: '0.75rem', backgroundColor: 'var(--background-secondary)', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                                        <User size={16} style={{ marginRight: '8px', color: 'var(--text-secondary)' }} />
                                        {employee.position}
                                    </div>
                                )}
                            </div>

                            {/* Bio */}
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label>Beschreibung</label>
                                {isEditing ? (
                                    <textarea
                                        rows={3}
                                        value={editedEmployee.bio || ''}
                                        onChange={(e) => setEditedEmployee(prev => ({ ...prev, bio: e.target.value }))}
                                        placeholder="Kurze Beschreibung des Mitarbeiters..."
                                    />
                                ) : (
                                    <div style={{ padding: '0.75rem', backgroundColor: 'var(--background-secondary)', borderRadius: '4px', minHeight: '4rem' }}>
                                        {employee.bio || 'Keine Beschreibung verfügbar.'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fachpartner Section */}
                        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--background-secondary)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h4 style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                                    <Building2 size={18} style={{ marginRight: '8px' }} />
                                    Fachpartner-Zuordnungen
                                </h4>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => onFachpartnerEdit(employee)}
                                >
                                    <Edit size={14} style={{ marginRight: '6px' }} />
                                    Bearbeiten
                                </button>
                            </div>

                            {employee.fachpartner.length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {getFachpartnerInfo(employee.fachpartner).map((fp, index) => (
                                        <div key={index} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            backgroundColor: fp?.color + '20',
                                            color: fp?.color,
                                            padding: '8px 12px',
                                            borderRadius: '16px',
                                            fontSize: '0.9rem',
                                            fontWeight: '500',
                                            border: `2px solid ${fp?.color}40`
                                        }}>
                                            <Building2 size={16} style={{ marginRight: '6px' }} />
                                            {fp?.label}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                    Keine Fachpartner-Zuordnungen vorhanden.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div>
                    {/* Meta Information */}
                    <div className="content-card" style={{ marginBottom: '1.5rem' }}>
                        <div className="card-header">
                            <h3 className="card-title">Meta-Informationen</h3>
                        </div>
                        <div className="card-content">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                        REGISTRIERT AM
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Calendar size={16} style={{ marginRight: '8px', color: 'var(--text-secondary)' }} />
                                        {formatDate(employee.createdAt)}
                                    </div>
                                </div>

                                {employee.lastLogin && (
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                            LETZTER LOGIN
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Calendar size={16} style={{ marginRight: '8px', color: 'var(--text-secondary)' }} />
                                            {formatDate(employee.lastLogin)}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                        MITARBEITER-ID
                                    </div>
                                    <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                        {employee.id}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="content-card">
                        <div className="card-header">
                            <h3 className="card-title">Aktionen</h3>
                        </div>
                        <div className="card-content">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {employee.status === 'pending' && (
                                    <>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => onEmployeeAction('approve', employee)}
                                            style={{ justifyContent: 'flex-start' }}
                                        >
                                            <CheckCircle size={16} style={{ marginRight: '8px' }} />
                                            Mitarbeiter freischalten
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => onEmployeeAction('reject', employee)}
                                            style={{ justifyContent: 'flex-start', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
                                        >
                                            <XCircle size={16} style={{ marginRight: '8px' }} />
                                            Antrag ablehnen
                                        </button>
                                    </>
                                )}

                                {employee.status === 'approved' && (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => onEmployeeAction('disable', employee)}
                                        style={{ justifyContent: 'flex-start', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
                                    >
                                        <UserX size={16} style={{ marginRight: '8px' }} />
                                        Mitarbeiter deaktivieren
                                    </button>
                                )}

                                {employee.status === 'disabled' && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => onEmployeeAction('approve', employee)}
                                        style={{ justifyContent: 'flex-start' }}
                                    >
                                        <CheckCircle size={16} style={{ marginRight: '8px' }} />
                                        Mitarbeiter reaktivieren
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmployeeDetail;
