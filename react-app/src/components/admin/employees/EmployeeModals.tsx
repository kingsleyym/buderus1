import React from 'react';
import {
    CheckCircle,
    XCircle,
    UserX,
    Building2,
    AlertTriangle
} from 'lucide-react';
import { Employee, FACHPARTNER_OPTIONS, ConfirmAction } from './employee-types';

interface EmployeeModalsProps {
    showFachpartnerModal: boolean;
    showConfirmModal: boolean;
    editingEmployee: Employee | null;
    selectedFachpartners: string[];
    confirmAction: ConfirmAction | null;
    onCloseFachpartnerModal: () => void;
    onCloseConfirmModal: () => void;
    onSaveFachpartnerChanges: () => void;
    onToggleFachpartner: (fachpartner: string) => void;
    onConfirmAction: () => void;
}

const EmployeeModals: React.FC<EmployeeModalsProps> = ({
    showFachpartnerModal,
    showConfirmModal,
    editingEmployee,
    selectedFachpartners,
    confirmAction,
    onCloseFachpartnerModal,
    onCloseConfirmModal,
    onSaveFachpartnerChanges,
    onToggleFachpartner,
    onConfirmAction
}) => {
    return (
        <>
            {/* Fachpartner Assignment Modal */}
            {showFachpartnerModal && editingEmployee && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Fachpartner zuordnen - {editingEmployee.name}</h3>
                            <span className="close" onClick={onCloseFachpartnerModal}>&times;</span>
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
                                                onChange={() => onToggleFachpartner(fp.value)}
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
                                onClick={onCloseFachpartnerModal}
                            >
                                Abbrechen
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={onSaveFachpartnerChanges}
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

            {/* Confirmation Modal */}
            {showConfirmModal && confirmAction && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h3 style={{ display: 'flex', alignItems: 'center' }}>
                                <AlertTriangle
                                    size={24}
                                    style={{
                                        marginRight: '8px',
                                        color: confirmAction.type === 'approve' ? 'var(--success-color)' : 'var(--danger-color)'
                                    }}
                                />
                                {confirmAction.type === 'approve' ? 'Mitarbeiter freischalten' :
                                    confirmAction.type === 'reject' ? 'Mitarbeiter ablehnen' : 'Mitarbeiter deaktivieren'}
                            </h3>
                            <span className="close" onClick={onCloseConfirmModal}>&times;</span>
                        </div>
                        <div className="modal-body">
                            {/* Employee Info */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1rem',
                                backgroundColor: 'var(--background-secondary)',
                                borderRadius: '8px',
                                marginBottom: '1.5rem'
                            }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--primary-color)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem',
                                    color: 'white',
                                    marginRight: '1rem'
                                }}>
                                    {confirmAction.employee.firstName?.charAt(0)}{confirmAction.employee.lastName?.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{confirmAction.employee.name}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{confirmAction.employee.position}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{confirmAction.employee.email}</div>
                                </div>
                            </div>

                            {/* Confirmation Message */}
                            <div style={{
                                padding: '1rem',
                                backgroundColor: confirmAction.type === 'approve' ? '#D4EDDA' : '#F8D7DA',
                                border: `1px solid ${confirmAction.type === 'approve' ? '#C3E6CB' : '#F5C6CB'}`,
                                borderRadius: '8px',
                                marginBottom: '1rem'
                            }}>
                                <p style={{
                                    margin: 0,
                                    color: confirmAction.type === 'approve' ? '#155724' : '#721C24',
                                    fontWeight: '500'
                                }}>
                                    {confirmAction.message}
                                </p>
                            </div>

                            {/* Additional Info based on action */}
                            {confirmAction.type === 'approve' && (
                                <div className="alert alert-info">
                                    <strong>ℹ️ Nach der Freischaltung:</strong>
                                    <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
                                        <li>Der Mitarbeiter erhält Zugang zum System</li>
                                        <li>Login-Daten werden per E-Mail versendet</li>
                                        <li>Fachpartner-Zuordnungen können angepasst werden</li>
                                    </ul>
                                </div>
                            )}

                            {confirmAction.type === 'reject' && (
                                <div className="alert alert-warning">
                                    <strong>⚠️ Wichtiger Hinweis:</strong>
                                    <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
                                        <li>Diese Aktion kann nicht rückgängig gemacht werden</li>
                                        <li>Der Mitarbeiter wird per E-Mail benachrichtigt</li>
                                        <li>Eine Neuregistrierung ist erforderlich</li>
                                    </ul>
                                </div>
                            )}

                            {confirmAction.type === 'disable' && (
                                <div className="alert alert-warning">
                                    <strong>⚠️ Nach der Deaktivierung:</strong>
                                    <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
                                        <li>Der Zugang wird sofort gesperrt</li>
                                        <li>Alle aktiven Sessions werden beendet</li>
                                        <li>Reaktivierung ist jederzeit möglich</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onCloseConfirmModal}
                            >
                                Abbrechen
                            </button>
                            <button
                                type="button"
                                className={`btn ${confirmAction.type === 'approve' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={onConfirmAction}
                                style={{
                                    color: confirmAction.type === 'approve' ? 'white' : 'var(--danger-color)',
                                    borderColor: confirmAction.type === 'approve' ? 'var(--primary-color)' : 'var(--danger-color)',
                                    backgroundColor: confirmAction.type === 'approve' ? 'var(--primary-color)' : 'transparent'
                                }}
                            >
                                {confirmAction.type === 'approve' && <CheckCircle size={16} style={{ marginRight: '8px' }} />}
                                {confirmAction.type === 'reject' && <XCircle size={16} style={{ marginRight: '8px' }} />}
                                {confirmAction.type === 'disable' && <UserX size={16} style={{ marginRight: '8px' }} />}

                                {confirmAction.type === 'approve' ? 'Jetzt freischalten' :
                                    confirmAction.type === 'reject' ? 'Jetzt ablehnen' : 'Jetzt deaktivieren'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EmployeeModals;
