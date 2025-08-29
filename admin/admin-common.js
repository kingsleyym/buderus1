// Admin Common Functions - Nutzt Firebase v10 aus window objects

class AdminBase {
    constructor() {
        // Warte auf Firebase Scripts
        this.waitForFirebase().then(() => {
            this.initFirebase();
            this.setupAuth();
            this.setupMobileNavigation();
        });
    }
    
    async waitForFirebase() {
        // Warte bis Firebase v10 window objects verfügbar sind
        return new Promise((resolve) => {
            if (window.app && window.auth && window.db) {
                resolve();
                return;
            }
            
            const checkFirebase = setInterval(() => {
                if (window.app && window.auth && window.db) {
                    clearInterval(checkFirebase);
                    resolve();
                }
            }, 100);
            
            // Timeout nach 10 Sekunden
            setTimeout(() => {
                clearInterval(checkFirebase);
                console.error('Firebase timeout');
                resolve();
            }, 10000);
        });
    }
    
    initFirebase() {
        // Nutze die bereits initialisierten Firebase v10 Instanzen
        this.app = window.app;
        this.auth = window.auth;
        this.db = window.db;
        this.functions = window.functions;
        
        console.log('🔧 DEBUG: Firebase in AdminBase initialisiert');
    }
    
    async setupAuth() {
        // Import Firebase Auth functions dynamically
        const { onAuthStateChanged, signOut } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
        
        onAuthStateChanged(this.auth, async (user) => {
            if (!user) {
                // Nur umleiten wenn wir nicht schon auf der Login-Seite sind
                if (!window.location.pathname.includes('/admin/index.html')) {
                    window.location.href = '/admin/index.html';
                }
                return;
            }
            
            // User ist eingeloggt - prüfe Admin-Berechtigung
            console.log('🔧 DEBUG: User eingeloggt:', user.email);
            
            // Hier könntest du später Admin-Berechtigung prüfen
            // Für jetzt nehmen wir an, dass alle eingeloggten User Admins sind
        });
        
        // Wait for DOM to be ready before setting up logout
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupLogout());
        } else {
            this.setupLogout();
        }
    }
    
    async setupLogout() {
        const { signOut } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await signOut(this.auth);
                window.location.href = '/admin/index.html';
            });
        }
    }
    
    setupMobileNavigation() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initMobileNav());
        } else {
            this.initMobileNav();
        }
    }
    
    initMobileNav() {
        const mobileNavToggle = document.getElementById('mobileNavToggle');
        const sidebar = document.querySelector('.admin-sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        if (mobileNavToggle && sidebar && sidebarOverlay) {
            mobileNavToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                sidebarOverlay.classList.toggle('show');
            });
            
            sidebarOverlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('show');
            });
            
            // Close mobile menu when clicking on menu items
            const menuItems = document.querySelectorAll('.admin-sidebar .sidebar-nav a');
            menuItems.forEach(item => {
                item.addEventListener('click', () => {
                    sidebar.classList.remove('open');
                    sidebarOverlay.classList.remove('show');
                });
            });
        }
    }
    
    // Common utility functions
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    formatDate(date) {
        return new Date(date).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    async exportToCSV(data, filename) {
        if (!data || data.length === 0) {
            this.showNotification('Keine Daten zum Exportieren', 'error');
            return;
        }
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => 
                `"${(row[header] || '').toString().replace(/"/g, '""')}"`
            ).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }
}

// Export for use in other admin files
window.AdminBase = AdminBase;
