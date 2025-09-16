import React, { useState, useEffect } from 'react';
import {
    Search,
    UserPlus,
    RefreshCw,
    Filter,
    Grid,
    List
} from 'lucide-react';
import EmployeeList from './EmployeeList';
import EmployeeDetail from './EmployeeDetail';
import EmployeeModals from './EmployeeModals';
import { Employee, FACHPARTNER_OPTIONS } from './employee-types';

const AdminEmployees: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [fachpartnerFilter, setFachpartnerFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    // Modal States
    const [showFachpartnerModal, setShowFachpartnerModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{
        type: 'approve' | 'reject' | 'disable';
        employee: Employee;
        message: string;
    } | null>(null);

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
                    fachpartner: ['buderus', 'bosch'],
                    createdAt: '2024-01-15',
                    lastLogin: '2024-03-10',
                    bio: 'Erfahrener Vertriebsmitarbeiter mit Fokus auf Heizungssysteme.'
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
                    fachpartner: [],
                    createdAt: '2024-03-01',
                    bio: 'Neu registrierter Installateur, wartet auf Freischaltung.'
                },
                {
                    id: '3',
                    name: 'Anna Schmidt',
                    firstName: 'Anna',
                    lastName: 'Schmidt',
                    email: 'anna@example.com',
                    phone: '+49 555 123456',
                    position: 'Servicetechnikerin',
                    status: 'disabled',
                    fachpartner: ['buderus'],
                    createdAt: '2024-02-10',
                    lastLogin: '2024-02-28',
                    bio: 'Servicetechnikerin, derzeit deaktiviert.'
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

    // Employee Actions with Confirmation
    const handleEmployeeAction = (type: 'approve' | 'reject' | 'disable', employee: Employee) => {
        const messages = {
            approve: `Möchten Sie ${employee.name} wirklich freischalten? Der Mitarbeiter erhält Zugang zum System.`,
            reject: `Möchten Sie ${employee.name} wirklich ablehnen? Diese Aktion kann nicht rückgängig gemacht werden.`,
            disable: `Möchten Sie ${employee.name} wirklich deaktivieren? Der Zugang wird gesperrt.`
        };

        setConfirmAction({
            type,
            employee,
            message: messages[type]
        });
        setShowConfirmModal(true);
    };

    const executeEmployeeAction = async () => {
        if (!confirmAction) return;

        try {
            setEmployees(prev => prev.map(emp =>
                emp.id === confirmAction.employee.id
                    ? { ...emp, status: confirmAction.type === 'approve' ? 'approved' : confirmAction.type as any }
                    : emp
            ));

            const actionTexts = {
                approve: 'freigeschaltet',
                reject: 'abgelehnt',
                disable: 'deaktiviert'
            };

            alert(`${confirmAction.employee.name} wurde erfolgreich ${actionTexts[confirmAction.type]}.`);
            setShowConfirmModal(false);
            setConfirmAction(null);
        } catch (error) {
            console.error('Fehler bei der Aktion:', error);
            alert('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.');
        }
    };

    // Fachpartner Management
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

    // Employee Detail Management
    const openEmployeeDetail = (employee: Employee) => {
        setSelectedEmployee(employee);
    };

    const closeEmployeeDetail = () => {
        setSelectedEmployee(null);
    };

    const updateEmployee = (updatedEmployee: Employee) => {
        setEmployees(prev => prev.map(emp =>
            emp.id === updatedEmployee.id ? updatedEmployee : emp
        ));
        setSelectedEmployee(updatedEmployee);
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
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {/* View Mode Toggle */}
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setViewMode('grid')}
                                    style={{ padding: '0.5rem' }}
                                >
                                    <Grid size={16} />
                                </button>
                                <button
                                    className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setViewMode('list')}
                                    style={{ padding: '0.5rem' }}
                                >
                                    <List size={16} />
                                </button>
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                {filteredEmployees.length} von {employees.length} Mitarbeitern
                            </div>
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
                        <button
                            className={`btn ${fachpartnerFilter === 'none' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFachpartnerFilter('none')}
                            style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        >
                            Ohne Zuordnung
                        </button>
                        {FACHPARTNER_OPTIONS.map((fp) => (
                            <button
                                key={fp.value}
                                className={`btn ${fachpartnerFilter === fp.value ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setFachpartnerFilter(fp.value)}
                                style={{ fontSize: '0.8rem', padding: '0.5rem', borderColor: fp.color }}
                            >
                                {fp.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Employee List */}
            <EmployeeList
                employees={filteredEmployees}
                loading={loading}
                viewMode={viewMode}
                onEmployeeClick={openEmployeeDetail}
                onEmployeeAction={handleEmployeeAction}
                onFachpartnerEdit={openFachpartnerModal}
            />

            {/* Modals */}
            <EmployeeModals
                showFachpartnerModal={showFachpartnerModal}
                showConfirmModal={showConfirmModal}
                editingEmployee={editingEmployee}
                selectedFachpartners={selectedFachpartners}
                confirmAction={confirmAction}
                onCloseFachpartnerModal={() => setShowFachpartnerModal(false)}
                onCloseConfirmModal={() => setShowConfirmModal(false)}
                onSaveFachpartnerChanges={saveFachpartnerChanges}
                onToggleFachpartner={toggleFachpartner}
                onConfirmAction={executeEmployeeAction}
            />

            {/* Employee Detail Modal */}
            {selectedEmployee && (
                <EmployeeDetail
                    employee={selectedEmployee}
                    onBack={closeEmployeeDetail}
                    onUpdate={updateEmployee}
                    onFachpartnerEdit={openFachpartnerModal}
                    onEmployeeAction={handleEmployeeAction}
                />
            )}
        </>
    );
};

export default AdminEmployees;
