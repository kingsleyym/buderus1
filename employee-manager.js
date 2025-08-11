// Employee Card Manager
class EmployeeCardManager {
    constructor() {
        this.employees = [];
        this.currentEmployee = null;
        this.loadEmployees();
    }

    async loadEmployees() {
        try {
            const response = await fetch('employees.json');
            this.employees = await response.json();
            this.handleRouting();
        } catch (error) {
            console.error('Fehler beim Laden der Mitarbeiterdaten:', error);
            this.showError();
        }
    }

    handleRouting() {
        const path = window.location.pathname;
        const employeeId = this.extractEmployeeId(path);
        
        if (employeeId) {
            this.showEmployee(employeeId);
        } else {
            this.showEmployeeList();
        }
    }

    extractEmployeeId(path) {
        // Extrahiert ID aus Pfaden wie /max-mustermann oder /employees/max-mustermann
        const parts = path.split('/').filter(part => part.length > 0);
        
        // Wenn letzter Teil eine bekannte Employee-ID ist
        if (parts.length > 0) {
            const lastPart = parts[parts.length - 1];
            if (this.employees.find(emp => emp.id === lastPart)) {
                return lastPart;
            }
        }
        
        return null;
    }

    showEmployee(employeeId) {
        const employee = this.employees.find(emp => emp.id === employeeId);
        if (!employee) {
            this.showError();
            return;
        }

        this.currentEmployee = employee;
        this.updatePageContent(employee);
        this.updatePageTitle(employee);
    }

    updatePageContent(employee) {
        // Avatar automatisch finden oder Fallback verwenden
        const avatarPath = this.getAvatarPath(employee);
        
        // Avatar aktualisieren
        const avatarImg = document.querySelector('.profile-avatar img');
        if (avatarImg) {
            avatarImg.src = avatarPath;
            avatarImg.alt = `Profilbild von ${employee.name}`;
            
            // Fallback wenn Avatar nicht existiert
            avatarImg.onerror = () => {
                avatarImg.src = 'assets/avatars/default.png';
            };
        }

        // Name aktualisieren
        const nameElement = document.querySelector('.name');
        if (nameElement) {
            nameElement.textContent = employee.name;
        }

        // Jobbeschreibung aktualisieren
        const jobElement = document.querySelector('.job-description');
        if (jobElement) {
            jobElement.textContent = employee.title;
        }

        // Kontaktdaten für vCard aktualisieren
        if (window.updateContactData) {
            window.updateContactData(employee);
        }
    }

    getAvatarPath(employee) {
        // 1. Wenn explizit in JSON angegeben, verwende das
        if (employee.avatar) {
            return employee.avatar;
        }
        
        // 2. Automatische Erkennung basierend auf ID
        const possiblePaths = [
            `assets/avatars/${employee.id}.png`,
            `assets/avatars/${employee.id}.jpg`,
            `assets/avatars/${employee.id}.jpeg`,
            `assets/avatars/${employee.id}.webp`
        ];
        
        // Für jetzt verwenden wir den ersten Pfad
        // In einer echten Anwendung würde man prüfen ob die Datei existiert
        return possiblePaths[0];
    }

    updatePageTitle(employee) {
        document.title = `${employee.name} - ${employee.title} | Buderus Systeme`;
    }

    showEmployeeList() {
        // Zeigt eine Liste aller Mitarbeiter (optional)
        this.createEmployeeDirectory();
    }

    createEmployeeDirectory() {
        // Erstellt eine Übersichtsseite mit allen Mitarbeitern
        const content = document.querySelector('.content');
        if (!content) return;

        content.innerHTML = `
            <div class="employee-directory">
                <h1 class="directory-title">Unser Team</h1>
                <div class="employee-grid">
                    ${this.employees.map(employee => `
                        <a href="/${employee.id}" class="employee-card">
                            <img src="${employee.avatar}" alt="${employee.name}" class="employee-avatar">
                            <h3 class="employee-name">${employee.name}</h3>
                            <p class="employee-title">${employee.title}</p>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }

    showError() {
        const content = document.querySelector('.content');
        if (content) {
            content.innerHTML = `
                <div class="error-message">
                    <h2>Mitarbeiter nicht gefunden</h2>
                    <p>Der angeforderte Mitarbeiter existiert nicht.</p>
                    <a href="/" class="back-link">Zurück zur Übersicht</a>
                </div>
            `;
        }
    }

    // Methode zum einfachen Hinzufügen neuer Mitarbeiter
    async addEmployee(employeeData) {
        this.employees.push(employeeData);
        // In einer echten Anwendung würde hier eine API aufgerufen werden
        console.log('Neuer Mitarbeiter hinzugefügt:', employeeData);
    }
}

// Globale Funktion zum Aktualisieren der Kontaktdaten
window.updateContactData = function(employee) {
    // Telefonnummer aktualisieren
    if (window.makeCall) {
        window.makeCall = function() {
            window.location.href = `tel:${employee.phone}`;
        };
    }

    // E-Mail aktualisieren
    if (window.sendEmail) {
        window.sendEmail = function() {
            window.location.href = `mailto:${employee.email}?subject=Kontakt%20von%20Website`;
        };
    }

    // vCard Daten aktualisieren
    if (window.saveContact) {
        window.saveContact = function() {
            const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${employee.name}
N:${employee.name.split(' ').reverse().join(';')};;;
ORG:${employee.company}
TITLE:${employee.title}
TEL;TYPE=CELL:${employee.phone}
EMAIL;TYPE=INTERNET:${employee.email}
URL:${employee.website}
END:VCARD`;

            const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${employee.name.replace(/\s+/g, '_')}.vcf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        };
    }
};

// Initialisierung
document.addEventListener('DOMContentLoaded', function() {
    window.employeeManager = new EmployeeCardManager();
});

// Browser History API für Clean URLs
window.addEventListener('popstate', function() {
    if (window.employeeManager) {
        window.employeeManager.handleRouting();
    }
});
