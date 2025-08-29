// Employee Admin Management JavaScript
// Erweitert AdminBase aus admin-common.js

class EmployeeAdmin extends AdminBase {
    constructor() {
        super();
        this.employees = [];
        this.currentFilter = 'all';
        this.currentEmployee = null;
        
        // Warte bis Firebase initialisiert ist
        this.waitForFirebase().then(() => {
            this.init();
        });
    }
    
    init() {
        this.setupEventListeners();
        this.loadEmployees();
        this.setupFilters();
    }
    
    setupEventListeners() {
        // Add Employee Form
        const addForm = document.getElementById('addEmployeeForm');
        if (addForm) {
            addForm.addEventListener('submit', (e) => this.handleAddEmployee(e));
        }
        
        // Search Input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterEmployees());
        }
    }
    
    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const status = btn.dataset.status;
                this.filterByStatus(status);
            });
        });
    }
    
    async loadEmployees() {
        try {
            this.showLoading();
            
            // Firebase Admin Functions nutzen
            const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
            const employeesRef = collection(this.db, 'employees');
            const snapshot = await getDocs(employeesRef);
            
            this.employees = [];
            snapshot.forEach(doc => {
                this.employees.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            this.hideLoading();
            this.renderEmployees();
            this.updateCounts();
            
        } catch (error) {
            console.error('Fehler beim Laden der Mitarbeiter:', error);
            this.hideLoading();
            this.showNotification('Fehler beim Laden der Mitarbeiter', 'error');
        }
    }
    
    showLoading() {
        document.getElementById('loadingEmployees').style.display = 'flex';
        document.getElementById('employeesGrid').classList.add('hidden');
        document.getElementById('noEmployees').classList.add('hidden');
    }
    
    hideLoading() {
        document.getElementById('loadingEmployees').style.display = 'none';
    }
    
    renderEmployees() {
        const grid = document.getElementById('employeesGrid');
        const noDataDiv = document.getElementById('noEmployees');
        
        if (this.employees.length === 0) {
            grid.classList.add('hidden');
            noDataDiv.classList.remove('hidden');
            return;
        }
        
        grid.classList.remove('hidden');
        noDataDiv.classList.add('hidden');
        
        const filteredEmployees = this.getFilteredEmployees();
        
        if (filteredEmployees.length === 0) {
            grid.innerHTML = '<div class="no-results">Keine Mitarbeiter gefunden, die den Filterkriterien entsprechen.</div>';
            return;
        }
        
        grid.innerHTML = filteredEmployees.map(employee => this.createEmployeeCard(employee)).join('');
    }
    
    createEmployeeCard(employee) {
        const statusClass = employee.approved ? 'active' : 'pending';
        const statusText = employee.approved ? 'Aktiv' : 'Wartend';
        const avatar = employee.avatar || '/assets/avatar.png';
        const createdDate = employee.createdAt ? new Date(employee.createdAt.seconds * 1000).toLocaleDateString('de-DE') : 'Unbekannt';
        
        return `
            <div class="employee-card" onclick="showEmployeeDetails('${employee.id}')">
                <div class="employee-header">
                    <img src="${avatar}" alt="${employee.firstName} ${employee.lastName}" class="employee-avatar">
                    <div class="employee-info">
                        <h3>${employee.firstName} ${employee.lastName}</h3>
                        <p class="position">${employee.position || 'Position nicht angegeben'}</p>
                    </div>
                </div>
                
                <div class="employee-details">
                    <div class="detail-item">
                        <i>📧</i>
                        <span>${employee.email}</span>
                    </div>
                    <div class="detail-item">
                        <i>📞</i>
                        <span>${employee.phone || 'Nicht angegeben'}</span>
                    </div>
                    <div class="detail-item">
                        <i>📅</i>
                        <span>Erstellt: ${createdDate}</span>
                    </div>
                </div>
                
                <div class="employee-status">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                
                <div class="employee-actions" onclick="event.stopPropagation()">
                    ${!employee.approved ? `
                        <button class="action-btn primary-btn" onclick="approveEmployeeQuick('${employee.id}')">
                            ✅ Genehmigen
                        </button>
                    ` : `
                        <button class="action-btn secondary-btn" onclick="viewPublicProfile('${employee.id}')">
                            🔗 Profil
                        </button>
                    `}
                    <button class="action-btn secondary-btn" onclick="showEmployeeDetails('${employee.id}')">
                        👁️ Details
                    </button>
                </div>
            </div>
        `;
    }
    
    getFilteredEmployees() {
        let filtered = this.employees;
        
        // Status Filter
        if (this.currentFilter !== 'all') {
            if (this.currentFilter === 'pending') {
                filtered = filtered.filter(emp => !emp.approved);
            } else if (this.currentFilter === 'active') {
                filtered = filtered.filter(emp => emp.approved);
            } else if (this.currentFilter === 'disabled') {
                filtered = filtered.filter(emp => emp.disabled);
            }
        }
        
        // Search Filter
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(emp => 
                emp.firstName.toLowerCase().includes(searchTerm) ||
                emp.lastName.toLowerCase().includes(searchTerm) ||
                emp.email.toLowerCase().includes(searchTerm) ||
                (emp.position && emp.position.toLowerCase().includes(searchTerm))
            );
        }
        
        return filtered;
    }
    
    updateCounts() {
        const all = this.employees.length;
        const pending = this.employees.filter(emp => !emp.approved).length;
        const active = this.employees.filter(emp => emp.approved && !emp.disabled).length;
        const disabled = this.employees.filter(emp => emp.disabled).length;
        
        document.getElementById('countAll').textContent = all;
        document.getElementById('countPending').textContent = pending;
        document.getElementById('countActive').textContent = active;
        document.getElementById('countDisabled').textContent = disabled;
    }
    
    filterByStatus(status) {
        this.currentFilter = status;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-status="${status}"]`).classList.add('active');
        
        this.renderEmployees();
    }
    
    filterEmployees() {
        this.renderEmployees();
    }
    
    showAddEmployeeModal() {
        document.getElementById('addEmployeeModal').classList.remove('hidden');
    }
    
    closeAddEmployeeModal() {
        document.getElementById('addEmployeeModal').classList.add('hidden');
        document.getElementById('addEmployeeForm').reset();
    }
    
    async handleAddEmployee(e) {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('addFirstName').value,
            lastName: document.getElementById('addLastName').value,
            email: document.getElementById('addEmail').value,
            phone: document.getElementById('addPhone').value,
            position: document.getElementById('addPosition').value,
            bio: document.getElementById('addBio').value,
            password: document.getElementById('addPassword').value,
            autoApprove: document.getElementById('autoApprove').checked
        };
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i>⏳</i> Erstelle...';
        submitBtn.disabled = true;
        
        try {
            const { httpsCallable } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-functions.js');
            const registerEmployee = httpsCallable(this.functions, 'registerEmployee');
            
            const result = await registerEmployee(formData);
            
            if (result.data.success) {
                this.showNotification('Mitarbeiter erfolgreich erstellt', 'success');
                this.closeAddEmployeeModal();
                this.loadEmployees();
                
                if (formData.autoApprove) {
                    // Automatisch genehmigen
                    const approveEmployee = httpsCallable(this.functions, 'approveEmployee');
                    await approveEmployee({ employeeId: result.data.userId });
                    this.showNotification('Mitarbeiter automatisch genehmigt', 'success');
                }
            }
            
        } catch (error) {
            console.error('Fehler beim Erstellen des Mitarbeiters:', error);
            this.showNotification('Fehler beim Erstellen des Mitarbeiters: ' + error.message, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    async approveEmployeeQuick(employeeId) {
        try {
            const { httpsCallable } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-functions.js');
            const approveEmployee = httpsCallable(this.functions, 'approveEmployee');
            
            const result = await approveEmployee({ employeeId });
            
            if (result.data.success) {
                this.showNotification('Mitarbeiter erfolgreich genehmigt', 'success');
                this.loadEmployees();
            }
            
        } catch (error) {
            console.error('Fehler beim Genehmigen:', error);
            this.showNotification('Fehler beim Genehmigen: ' + error.message, 'error');
        }
    }
    
    showEmployeeDetails(employeeId) {
        const employee = this.employees.find(emp => emp.id === employeeId);
        if (!employee) return;
        
        this.currentEmployee = employee;
        
        // Modal füllen
        document.getElementById('modalName').textContent = `${employee.firstName} ${employee.lastName}`;
        document.getElementById('modalPosition').textContent = employee.position || 'Position nicht angegeben';
        document.getElementById('modalEmail').textContent = employee.email;
        document.getElementById('modalPhone').textContent = employee.phone || 'Nicht angegeben';
        document.getElementById('modalBio').textContent = employee.bio || 'Keine Beschreibung verfügbar';
        document.getElementById('modalAvatar').src = employee.avatar || '/assets/avatar.png';
        
        const statusBadge = document.getElementById('modalStatus');
        if (employee.approved) {
            statusBadge.textContent = 'Aktiv';
            statusBadge.className = 'status-badge active';
        } else {
            statusBadge.textContent = 'Wartend';
            statusBadge.className = 'status-badge pending';
        }
        
        const createdDate = employee.createdAt ? 
            new Date(employee.createdAt.seconds * 1000).toLocaleDateString('de-DE') : 
            'Unbekannt';
        document.getElementById('modalCreated').textContent = `Erstellt am: ${createdDate}`;
        
        // Buttons anpassen
        document.getElementById('approveBtn').style.display = employee.approved ? 'none' : 'inline-block';
        
        document.getElementById('employeeModal').classList.remove('hidden');
    }
    
    closeEmployeeModal() {
        document.getElementById('employeeModal').classList.add('hidden');
        this.currentEmployee = null;
    }
    
    async approveEmployee() {
        if (!this.currentEmployee) return;
        
        try {
            await this.approveEmployeeQuick(this.currentEmployee.id);
            this.closeEmployeeModal();
        } catch (error) {
            console.error('Fehler beim Genehmigen:', error);
        }
    }
    
    viewPublicProfile(employeeId) {
        const employee = employeeId ? 
            this.employees.find(emp => emp.id === employeeId) : 
            this.currentEmployee;
            
        if (employee) {
            const fileName = `${employee.firstName.toLowerCase()}-${employee.lastName.toLowerCase()}`;
            const publicUrl = `/mitarbeiter/${fileName}.html`;
            window.open(publicUrl, '_blank');
        }
    }
    
    // Override der Toast-Funktion für konsistentes Styling
    showNotification(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconMap = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.2rem;">${iconMap[type]}</span>
                <span>${message}</span>
            </div>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #666;">✖</button>
        `;
        
        container.appendChild(toast);
        
        // Animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto remove
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    }
}

// Global Functions für HTML onclick Events
let employeeAdmin;

window.addEventListener('DOMContentLoaded', () => {
    employeeAdmin = new EmployeeAdmin();
});

// Global Functions
function loadEmployees() {
    if (employeeAdmin) employeeAdmin.loadEmployees();
}

function showAddEmployeeModal() {
    if (employeeAdmin) employeeAdmin.showAddEmployeeModal();
}

function closeAddEmployeeModal() {
    if (employeeAdmin) employeeAdmin.closeAddEmployeeModal();
}

function filterByStatus(status) {
    if (employeeAdmin) employeeAdmin.filterByStatus(status);
}

function filterEmployees() {
    if (employeeAdmin) employeeAdmin.filterEmployees();
}

function showEmployeeDetails(id) {
    if (employeeAdmin) employeeAdmin.showEmployeeDetails(id);
}

function closeEmployeeModal() {
    if (employeeAdmin) employeeAdmin.closeEmployeeModal();
}

function approveEmployee() {
    if (employeeAdmin) employeeAdmin.approveEmployee();
}

function approveEmployeeQuick(id) {
    if (employeeAdmin) employeeAdmin.approveEmployeeQuick(id);
}

function viewPublicProfile(id) {
    if (employeeAdmin) employeeAdmin.viewPublicProfile(id);
}

function deactivateEmployee() {
    if (employeeAdmin && employeeAdmin.currentEmployee) {
        employeeAdmin.showNotification('Deaktivierung wird in einer zukünftigen Version implementiert', 'info');
    }
}

function editEmployee() {
    if (employeeAdmin && employeeAdmin.currentEmployee) {
        employeeAdmin.showNotification('Bearbeitung wird in einer zukünftigen Version implementiert', 'info');
    }
}

function deleteEmployee() {
    if (employeeAdmin && employeeAdmin.currentEmployee) {
        if (confirm('Sind Sie sicher, dass Sie diesen Mitarbeiter löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) {
            employeeAdmin.showNotification('Löschung wird in einer zukünftigen Version implementiert', 'warning');
        }
    }
}
