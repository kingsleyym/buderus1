// E-Werke Mitarbeiter Dashboard JavaScript
let currentUser = null;
let currentEmployeeData = null;

// Initialisierung
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Loading Screen anzeigen
    showLoadingScreen();
    
    // Debug: Firebase Config prüfen
    console.log('🔧 DEBUG: Firebase App:', window.app);
    console.log('🔧 DEBUG: Firebase Auth:', window.auth);
    console.log('🔧 DEBUG: Firebase Config:', window.app.options);
    
    // Firebase Auth State Listener mit Error Handling
    window.auth.onAuthStateChanged((user) => {
        console.log('🔐 Auth State Changed:', user ? `Benutzer: ${user.uid}` : 'Kein Benutzer');
        
        hideLoadingScreen();
        
        if (user) {
            currentUser = user;
            console.log('✅ Benutzer authentifiziert, prüfe Status...');
            checkUserApprovalStatus(user);
        } else {
            console.log('❌ Kein authentifizierter Benutzer');
            currentUser = null;
            currentEmployeeData = null;
            showLoginScreen();
        }
    }, (error) => {
        console.error('🚨 Auth State Listener Fehler:', error);
        hideLoadingScreen();
        showToast('error', 'Authentifizierungsfehler', 'Problem bei der Benutzerauthentifizierung');
        showLoginScreen();
    });
    
    // Event Listeners für Auth Forms
    setupAuthEventListeners();
}

function showLoadingScreen() {
    document.getElementById('loadingScreen').style.display = 'flex';
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboardScreen').classList.add('hidden');
    document.getElementById('pendingScreen').classList.add('hidden');
}

function hideLoadingScreen() {
    document.getElementById('loadingScreen').style.display = 'none';
}

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('dashboardScreen').classList.add('hidden');
    document.getElementById('pendingScreen').classList.add('hidden');
}

function showDashboardScreen() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboardScreen').classList.remove('hidden');
    document.getElementById('pendingScreen').classList.add('hidden');
    loadUserData();
}

function showPendingScreen() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboardScreen').classList.add('hidden');
    document.getElementById('pendingScreen').classList.remove('hidden');
}

// Auth Event Listeners Setup
function setupAuthEventListeners() {
    // Tab Switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchAuthTab(tabName);
        });
    });
    
    // Login Form
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    
    // Register Form
    document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
    
    // Profile Form
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
}

function switchAuthTab(tabName) {
    // Tab Buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(tabName + 'Form').classList.add('active');
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Anmelden...';
    submitBtn.disabled = true;
    
    try {
        const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
        const userCredential = await signInWithEmailAndPassword(window.auth, email, password);
        
        // Success wird durch onAuthStateChanged behandelt
        showToast('success', 'Erfolgreich angemeldet', 'Willkommen zurück!');
        
    } catch (error) {
        console.error('Login Fehler:', error);
        showToast('error', 'Anmeldung fehlgeschlagen', getErrorMessage(error.code));
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('registerFirstName').value,
        lastName: document.getElementById('registerLastName').value,
        email: document.getElementById('registerEmail').value,
        phone: document.getElementById('registerPhone').value,
        position: document.getElementById('registerPosition').value,
        password: document.getElementById('registerPassword').value,
        confirmPassword: document.getElementById('registerConfirmPassword').value
    };
    
    // Validierung
    if (formData.password !== formData.confirmPassword) {
        showToast('error', 'Passwort-Fehler', 'Die Passwörter stimmen nicht überein');
        return;
    }
    
    if (formData.password.length < 6) {
        showToast('error', 'Passwort zu kurz', 'Das Passwort muss mindestens 6 Zeichen lang sein');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrierung läuft...';
    submitBtn.disabled = true;
    
    try {
        const { httpsCallable } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-functions.js');
        const registerEmployee = httpsCallable(window.functions, 'registerEmployee');
        
        // Debug-Ausgaben
        console.log('Sende Registrierungsdaten:', {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            position: formData.position,
            hasPassword: !!formData.password
        });
        
        const result = await registerEmployee({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            position: formData.position,
            password: formData.password
        });
        
        console.log('Registrierung erfolgreich:', result.data);
        
        showToast('success', 'Registrierung eingereicht', 'Sie erhalten eine E-Mail, sobald Ihr Konto genehmigt wurde');
        showPendingScreen();
        
    } catch (error) {
        console.error('Registrierung Fehler:', error);
        showToast('error', 'Registrierung fehlgeschlagen', getErrorMessage(error.code));
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

async function checkUserApprovalStatus(user) {
    try {
        console.log('🔍 Überprüfe Benutzer-Status für:', user.uid);
        
        const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
        const userDocRef = doc(window.db, 'employees', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('✅ Employee-Daten gefunden:', userData);
            
            if (userData.approved) {
                currentEmployeeData = userData;
                showDashboardScreen();
            } else {
                console.log('⏳ Benutzer noch nicht genehmigt');
                showPendingScreen();
            }
        } else {
            // User existiert nicht in der Employee-Collection - aber nicht automatisch ausloggen
            console.warn('⚠️ Employee-Dokument nicht gefunden für:', user.uid);
            showToast('warning', 'Profil wird erstellt', 'Ihr Mitarbeiterprofil wird gerade eingerichtet. Bitte warten Sie einen Moment.');
            
            // Retry nach 3 Sekunden
            setTimeout(() => {
                if (currentUser) {
                    checkUserApprovalStatus(currentUser);
                }
            }, 3000);
        }
        
    } catch (error) {
        console.error('Fehler beim Überprüfen des Benutzer-Status:', error);
        
        // Unterscheidung zwischen kritischen und temporären Fehlern
        if (error.code === 'permission-denied') {
            showToast('error', 'Keine Berechtigung', 'Sie haben keine Berechtigung auf diese Ressource.');
            logout();
        } else {
            // Bei Netzwerk- oder temporären Fehlern nicht ausloggen
            showToast('warning', 'Verbindungsproblem', 'Überprüfung wird wiederholt...');
            
            // Retry nach 5 Sekunden
            setTimeout(() => {
                if (currentUser) {
                    checkUserApprovalStatus(currentUser);
                }
            }, 5000);
        }
    }
}

async function loadUserData() {
    if (!currentUser || !currentEmployeeData) return;
    
    // Navigation User Info
    document.getElementById('userDisplayName').textContent = `${currentEmployeeData.firstName} ${currentEmployeeData.lastName}`;
    document.getElementById('userAvatar').src = currentEmployeeData.avatar || '../assets/avatar.png';
    
    // Welcome Message
    const welcomeMessage = document.getElementById('welcomeMessage');
    const hour = new Date().getHours();
    let greeting = 'Guten Tag';
    if (hour < 12) greeting = 'Guten Morgen';
    else if (hour < 18) greeting = 'Guten Tag';
    else greeting = 'Guten Abend';
    
    welcomeMessage.textContent = `${greeting}, ${currentEmployeeData.firstName}!`;
    
    // Profile Form laden
    loadProfileForm();
    
    // Business Card laden
    loadBusinessCard();
    
    // QR Code generieren
    generateQRCode();
    
    // Statistiken laden
    loadStatistics();
}

function loadProfileForm() {
    if (!currentEmployeeData) return;
    
    document.getElementById('profileFirstName').value = currentEmployeeData.firstName || '';
    document.getElementById('profileLastName').value = currentEmployeeData.lastName || '';
    document.getElementById('profileEmail').value = currentEmployeeData.email || '';
    document.getElementById('profilePhone').value = currentEmployeeData.phone || '';
    document.getElementById('profilePosition').value = currentEmployeeData.position || '';
    document.getElementById('profileBio').value = currentEmployeeData.bio || '';
    
    if (currentEmployeeData.avatar) {
        document.getElementById('profileAvatarPreview').src = currentEmployeeData.avatar;
    }
}

function loadBusinessCard() {
    if (!currentEmployeeData) {
        console.log('⚠️ loadBusinessCard: Keine Employee Data verfügbar');
        return;
    }
    
    // Diese Funktion ist für das alte Business Card System - wird durch generateEmployeeCardPreview ersetzt
    console.log('ℹ️ loadBusinessCard: Übersprungen - verwende generateEmployeeCardPreview');
    
    // Optional: Employee Card generieren falls auf der richtigen Seite
    if (document.getElementById('employeeCardContainer')) {
        generateEmployeeCardPreview();
    }
}

async function generateQRCode() {
    if (!currentEmployeeData) return;
    
    try {
        console.log('🔄 Generiere QR Code für:', currentUser.uid);
        const { httpsCallable } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-functions.js');
        const generateEmployeeQR = httpsCallable(window.functions, 'generateEmployeeQR');
        
        const result = await generateEmployeeQR({
            employeeId: currentUser.uid
        });
        
        if (result.data.success) {
            // QR Code anzeigen
            const qrCodeDisplay = document.getElementById('qrCodeDisplay');
            qrCodeDisplay.innerHTML = `<img src="${result.data.qrCodeUrl}" alt="QR Code" style="width: 100%; height: 100%; object-fit: contain;">`;
            console.log('✅ QR Code erfolgreich generiert');
        }
        
    } catch (error) {
        console.error('QR Code Generation Fehler:', error);
        // Kein Logout bei QR-Code Fehlern
        showToast('warning', 'QR Code Fehler', 'QR Code konnte nicht generiert werden. Wird später wiederholt.');
    }
}

async function loadStatistics() {
    if (!currentEmployeeData) return;
    
    try {
        console.log('📊 Lade Statistiken für:', currentUser.uid);
        const { httpsCallable } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-functions.js');
        const getEmployeeStats = httpsCallable(window.functions, 'getEmployeeStats');
        
        const result = await getEmployeeStats({
            employeeId: currentUser.uid
        });
        
        if (result.data.success) {
            const stats = result.data.stats;
            document.getElementById('totalScans').textContent = stats.totalScans || 0;
            document.getElementById('todayScans').textContent = stats.todayScans || 0;
            document.getElementById('weekScans').textContent = stats.weekScans || 0;
            console.log('✅ Statistiken erfolgreich geladen');
        }
        
    } catch (error) {
        console.error('Statistiken Fehler:', error);
        // Kein Logout bei Statistik-Fehlern - zeige Standardwerte
        document.getElementById('totalScans').textContent = '-';
        document.getElementById('todayScans').textContent = '-';
        document.getElementById('weekScans').textContent = '-';
    }
}

// Navigation Functions
function showWelcome() {
    switchDashboardSection('welcomeSection');
}

function showProfile() {
    switchDashboardSection('profileSection');
}

function showEmployeeCard() {
    console.log('🎨 Zeige Employee Card Section');
    switchDashboardSection('employeeCardSection');
    
    // Warten bis DOM bereit ist, dann Employee Card generieren
    setTimeout(() => {
        generateEmployeeCardPreview();
    }, 100);
}

// Legacy-Funktion für Kompatibilität
function showBusinessCard() {
    showEmployeeCard();
}

function showOrders() {
    switchDashboardSection('ordersSection');
    loadProducts();
    loadCart();
}

function showQRCode() {
    switchDashboardSection('qrCodeSection');
}

function showSettings() {
    showToast('info', 'Einstellungen', 'Einstellungen werden in einer zukünftigen Version verfügbar sein');
}

function switchDashboardSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Neue Funktionen für zusätzliche Buttons
function openOnlineProfile() {
    // Öffne die Online-Visitenkarte in neuem Tab
    try {
        // Versuche zuerst die aktuellen User-Daten zu bekommen
        let firstName, lastName;
        
        if (window.currentUser && window.currentUser.firstName && window.currentUser.lastName) {
            firstName = window.currentUser.firstName;
            lastName = window.currentUser.lastName;
        } else {
            // Fallback: Versuche Daten aus den Input-Feldern zu holen
            const firstNameInput = document.getElementById('profileFirstName');
            const lastNameInput = document.getElementById('profileLastName');
            
            if (firstNameInput && lastNameInput && firstNameInput.value && lastNameInput.value) {
                firstName = firstNameInput.value;
                lastName = lastNameInput.value;
            }
        }
        
        if (firstName && lastName) {
            const formattedFirstName = firstName.toLowerCase().replace(/\s+/g, '-');
            const formattedLastName = lastName.toLowerCase().replace(/\s+/g, '-');
            const profileUrl = `https://buderus-systeme.de/mitarbeiter/${formattedFirstName}-${formattedLastName}.html`;
            
            console.log('🔗 Öffne Online-Visitenkarte:', profileUrl);
            window.open(profileUrl, '_blank');
        } else {
            console.warn('⚠️ Keine Vor-/Nachname Daten gefunden');
            showToast('info', 'Online Visitenkarte', 'Die Online-Visitenkarte wird nach dem nächsten Profil-Update verfügbar sein');
        }
    } catch (error) {
        console.error('❌ Fehler beim Öffnen der Online-Visitenkarte:', error);
        showToast('error', 'Fehler', 'Visitenkarte konnte nicht geöffnet werden');
    }
}

function showMyOrders() {
    switchDashboardSection('myOrdersSection');
    loadMyOrders();
}

async function loadMyOrders() {
    const ordersLoading = document.getElementById('ordersLoading');
    const ordersList = document.getElementById('ordersList');
    const noOrders = document.getElementById('noOrders');
    
    try {
        ordersLoading.style.display = 'block';
        ordersList.style.display = 'none';
        noOrders.style.display = 'none';
        
        // Firebase Firestore Abfrage
        const { collection, query, where, orderBy, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
        
        // Mehrere Wege versuchen, die User-E-Mail zu bekommen
        let userEmail = null;
        
        if (window.currentUser && window.currentUser.email) {
            userEmail = window.currentUser.email;
        } else if (window.auth && window.auth.currentUser) {
            userEmail = window.auth.currentUser.email;
        } else {
            // Fallback: Versuche die E-Mail aus dem Profil-Input zu holen
            const emailInput = document.getElementById('profileEmail');
            if (emailInput && emailInput.value) {
                userEmail = emailInput.value;
            }
        }
        
        if (!userEmail) {
            throw new Error('Benutzer-E-Mail nicht gefunden. Bitte loggen Sie sich neu ein.');
        }
        
        console.log('🔍 Lade Bestellungen für E-Mail:', userEmail);
        
        const ordersQuery = query(
            collection(window.db, 'orders'),
            where('employee.email', '==', userEmail),
            orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(ordersQuery);
        
        ordersLoading.style.display = 'none';
        
        if (querySnapshot.empty) {
            noOrders.style.display = 'block';
            return;
        }
        
        // Bestellungen anzeigen
        let ordersHtml = '';
        querySnapshot.forEach((doc) => {
            const order = doc.data();
            ordersHtml += generateOrderHTML(order);
        });
        
        ordersList.innerHTML = ordersHtml;
        ordersList.style.display = 'block';
        
    } catch (error) {
        console.error('Fehler beim Laden der Bestellungen:', error);
        ordersLoading.style.display = 'none';
        ordersList.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Fehler beim Laden der Bestellungen: ${error.message}</p>
            </div>
        `;
        ordersList.style.display = 'block';
    }
}

function generateOrderHTML(order) {
    const orderDate = order.timestamp?.toDate?.() || new Date(order.timestamp);
    const formattedDate = orderDate.toLocaleDateString('de-DE');
    const orderNumber = order.orderId.split('_')[1] || order.orderId;
    
    // Status Badge
    const status = order.status || 'pending';
    const statusConfig = {
        pending: { label: 'In Bearbeitung', class: 'status-pending', icon: 'clock' },
        processing: { label: 'Wird bearbeitet', class: 'status-processing', icon: 'cog' },
        shipped: { label: 'Versendet', class: 'status-shipped', icon: 'truck' },
        delivered: { label: 'Zugestellt', class: 'status-delivered', icon: 'check-circle' },
        cancelled: { label: 'Storniert', class: 'status-cancelled', icon: 'times-circle' }
    };
    
    const statusInfo = statusConfig[status] || statusConfig.pending;
    
    // Items aufbereiten
    let itemsHtml = '';
    if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
            itemsHtml += `
                <div class="order-item">
                    <span class="item-name">${item.name}</span>
                    <span class="item-details">${item.details}</span>
                </div>
            `;
        });
    }
    
    return `
        <div class="order-card">
            <div class="order-header">
                <div class="order-info">
                    <h4>Bestellung #${orderNumber}</h4>
                    <p class="order-date">${formattedDate}</p>
                </div>
                <div class="order-status ${statusInfo.class}">
                    <i class="fas fa-${statusInfo.icon}"></i>
                    <span>${statusInfo.label}</span>
                </div>
            </div>
            <div class="order-items">
                ${itemsHtml}
            </div>
        </div>
    `;
}

// Profile Functions
async function handleProfileUpdate(e) {
    e.preventDefault();
    
    console.log('📝 ===== PROFIL UPDATE GESTARTET =====');
    
    const submitBtn = e.target.querySelector('.save-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Speichern...';
    submitBtn.disabled = true;
    
    try {
        // Avatar Upload prüfen
        let avatarUrl = currentEmployeeData.avatar;
        const avatarInput = document.getElementById('profileAvatarInput');
        
        console.log('👤 Current Employee Data:', currentEmployeeData);
        console.log('🖼️ Avatar Input:', avatarInput);
        console.log('📁 Avatar Input Files:', avatarInput.files);
        console.log('📁 Anzahl Dateien:', avatarInput.files ? avatarInput.files.length : 0);
        
        if (avatarInput.files && avatarInput.files[0]) {
            console.log('🆕 NEUES AVATAR GEFUNDEN - STARTE UPLOAD...');
            console.log('📁 Avatar File Details:', {
                name: avatarInput.files[0].name,
                size: avatarInput.files[0].size,
                type: avatarInput.files[0].type
            });
            
            avatarUrl = await uploadAvatar(avatarInput.files[0]);
            console.log('✅ Avatar Upload erfolgreich! Neue URL:', avatarUrl);
        } else {
            console.log('ℹ️ Kein neues Avatar - verwende bestehende URL:', avatarUrl);
        }
        
        // Form Daten sammeln
        const formData = {
            firstName: document.getElementById('profileFirstName').value,
            lastName: document.getElementById('profileLastName').value,
            email: document.getElementById('profileEmail').value,
            phone: document.getElementById('profilePhone').value,
            position: document.getElementById('profilePosition').value,
            bio: document.getElementById('profileBio').value,
            avatar: avatarUrl
        };
        
        console.log('📋 Form Data gesammelt:', formData);
        console.log('📋 Form Data Keys:', Object.keys(formData));
        console.log('📋 Avatar URL in FormData:', formData.avatar);
        
        // CLEAN DATA - NUR STRING VALUES!
        const cleanFormData = {};
        Object.keys(formData).forEach(key => {
            const value = formData[key];
            if (typeof value === 'string' || value === null || value === undefined) {
                cleanFormData[key] = value;
                console.log(`✅ Clean Field: ${key} = ${value}`);
            } else {
                console.error(`❌ PROBLEMATIC FIELD: ${key} = ${typeof value}`, value);
                cleanFormData[key] = String(value); // Force to string
            }
        });
        
        console.log('🧹 CLEAN Form Data:', cleanFormData);
        
        // Cloud Function aufrufen
        console.log('☁️ Importiere Firebase Functions...');
        const { httpsCallable } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-functions.js');
        console.log('☁️ Firebase Functions importiert');
        
        console.log('🔧 Erstelle callable function...');
        const updateEmployeeProfile = httpsCallable(window.functions, 'updateEmployeeProfile');
        console.log('🔧 Callable function erstellt');
        
        const callData = {
            employeeId: currentUser.uid,
            profileData: cleanFormData
        };
        
        console.log('📞 RUFE CLOUD FUNCTION AUF...');
        console.log('📞 Call Data:', callData);
        console.log('📞 Current User UID:', currentUser.uid);
        
        const result = await updateEmployeeProfile(callData);
        console.log('✅ CLOUD FUNCTION ANTWORT:', result);
        console.log('✅ Result Data:', result.data);
        
        if (result.data.success) {
            console.log('🎉 PROFIL UPDATE ERFOLGREICH!');
            currentEmployeeData = { ...currentEmployeeData, ...cleanFormData };
            console.log('📊 Updated Employee Data:', currentEmployeeData);
            
            loadUserData();
            showToast('success', 'Profil aktualisiert', 'Ihre Änderungen wurden gespeichert und Ihre Online-Visitenkarte wird generiert');
        } else {
            console.error('❌ CLOUD FUNCTION FEHLER:', result.data);
            throw new Error(result.data.message || 'Unbekannter Fehler');
        }
        
        console.log('🎉 ===== PROFIL UPDATE KOMPLETT =====');
        
    } catch (error) {
        console.error('💥 ===== PROFIL UPDATE FEHLER =====');
        console.error('💥 Error Object:', error);
        console.error('💥 Error Message:', error.message);
        console.error('💥 Error Code:', error.code);
        console.error('💥 Error Stack:', error.stack);
        
        showToast('error', 'Update fehlgeschlagen', `Profil konnte nicht aktualisiert werden: ${error.message}`);
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        console.log('🔄 Submit Button zurückgesetzt');
    }
}

async function uploadAvatar(file) {
    try {
        console.log('🚀 ===== AVATAR UPLOAD GESTARTET =====');
        console.log('📁 File Details:', {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
        });
        console.log('👤 Current User:', currentUser);
        console.log('🗄️ Window Storage Object:', window.storage);
        console.log('🔧 Storage toString:', window.storage ? window.storage.toString() : 'NULL');
        
        // Firebase App prüfen
        console.log('🔥 Firebase App:', window.app);
        console.log('🔥 Firebase App Config:', window.app ? window.app.options : 'NULL');
        
        const { ref, uploadBytes, getDownloadURL } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js');
        console.log('📦 Firebase Storage Module importiert');
        
        // File Validierung
        console.log('✅ Starte File Validierung...');
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            throw new Error('Bild ist zu groß. Maximale Größe: 5MB');
        }
        console.log('✅ Größe OK:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
        
        if (!file.type.startsWith('image/')) {
            throw new Error('Nur Bilddateien sind erlaubt');
        }
        console.log('✅ Dateityp OK:', file.type);
        
        // Auth Status prüfen
        if (!currentUser || !currentUser.uid) {
            throw new Error('Benutzer nicht authentifiziert');
        }
        console.log('✅ User authentifiziert:', currentUser.uid);
        
        // Unique filename erstellen
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const filename = `avatars/${currentUser.uid}-${timestamp}.${fileExtension}`;
        
        console.log('📝 Generierter Filename:', filename);
        console.log('📝 Timestamp:', timestamp);
        console.log('📝 File Extension:', fileExtension);
        
        // Storage Ref erstellen
        console.log('🔧 Erstelle Storage Reference...');
        const storageRef = ref(window.storage, filename);
        console.log('📍 Storage Ref erstellt:', storageRef);
        console.log('📍 Storage Ref fullPath:', storageRef.fullPath);
        console.log('📍 Storage Ref bucket:', storageRef.bucket);
        
        // Upload starten
        console.log('⬆️ STARTE UPLOAD ZU FIREBASE STORAGE...');
        console.log('⬆️ Upload Parameters:', {
            ref: storageRef.fullPath,
            fileSize: file.size,
            fileName: file.name
        });
        
        const uploadResult = await uploadBytes(storageRef, file);
        console.log('✅ UPLOAD ERFOLGREICH!', uploadResult);
        console.log('✅ Upload Metadata:', uploadResult.metadata);
        
        // Download URL abrufen
        console.log('🔗 Hole Download URL...');
        const downloadURL = await getDownloadURL(storageRef);
        console.log('✅ Download URL erhalten:', downloadURL);
        
        console.log('🎉 ===== AVATAR UPLOAD KOMPLETT ERFOLGREICH =====');
        return downloadURL;
        
    } catch (error) {
        console.error('💥 ===== AVATAR UPLOAD FEHLER =====');
        console.error('💥 Error Object:', error);
        console.error('💥 Error Message:', error.message);
        console.error('💥 Error Code:', error.code);
        console.error('💥 Error Stack:', error.stack);
        
        // Spezielle Firebase Fehler loggen
        if (error.code) {
            console.error('🔥 Firebase Error Code:', error.code);
            switch (error.code) {
                case 'storage/unauthorized':
                    console.error('🚫 UNAUTHORIZIERT: Prüfe Storage Rules und Auth Status');
                    break;
                case 'storage/object-not-found':
                    console.error('📂 OBJEKT NICHT GEFUNDEN: Bucket oder Pfad existiert nicht');
                    break;
                case 'storage/bucket-not-found':
                    console.error('🗂️ BUCKET NICHT GEFUNDEN: Storage Bucket existiert nicht');
                    break;
                case 'storage/quota-exceeded':
                    console.error('📊 QUOTA ÜBERSCHRITTEN: Storage Limit erreicht');
                    break;
                default:
                    console.error('❓ UNBEKANNTER FIREBASE FEHLER:', error.code);
            }
        }
        
        throw new Error(`Avatar Upload fehlgeschlagen: ${error.message} (Code: ${error.code || 'UNKNOWN'})`);
    }
}

function previewAvatar(input) {
    console.log('📸 ===== PREVIEW AVATAR AUFGERUFEN =====');
    console.log('📸 Input:', input);
    console.log('📸 Files:', input.files);
    console.log('📸 Files Length:', input.files ? input.files.length : 0);
    
    if (input.files && input.files[0]) {
        console.log('📸 File gefunden:', input.files[0]);
        console.log('📸 File Details:', {
            name: input.files[0].name,
            size: input.files[0].size,
            type: input.files[0].type
        });
        
        const reader = new FileReader();
        reader.onload = function(e) {
            console.log('📸 FileReader onload - Preview wird gesetzt');
            document.getElementById('profileAvatarPreview').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
        
        // TEST: SOFORT AVATAR UPLOAD STARTEN
        console.log('🚀 TESTE SOFORTIGEN AVATAR UPLOAD...');
        testAvatarUpload(input.files[0]);
    } else {
        console.log('📸 Keine Datei gefunden');
    }
}

// TEST FUNKTION
async function testAvatarUpload(file) {
    try {
        console.log('🧪 ===== TEST AVATAR UPLOAD =====');
        const result = await uploadAvatar(file);
        console.log('🧪 TEST ERFOLGREICH:', result);
        alert('Avatar Upload Test erfolgreich! URL: ' + result);
    } catch (error) {
        console.error('🧪 TEST FEHLGESCHLAGEN:', error);
        alert('Avatar Upload Test fehlgeschlagen: ' + error.message);
    }
}

function previewChanges() {
    showToast('info', 'Vorschau', 'Vorschau-Funktion wird in einer zukünftigen Version verfügbar sein');
}

function previewPublicPage() {
    if (currentEmployeeData) {
        const publicUrl = `https://buderus-systeme.de/mitarbeiter/${currentEmployeeData.firstName.toLowerCase()}-${currentEmployeeData.lastName.toLowerCase()}.html`;
        window.open(publicUrl, '_blank');
    }
}

// Business Card Functions
function downloadBusinessCard() {
    showToast('info', 'Download', 'Download-Funktion wird in einer zukünftigen Version verfügbar sein');
}

function shareBusinessCard() {
    if (navigator.share && currentEmployeeData) {
        navigator.share({
            title: `${currentEmployeeData.firstName} ${currentEmployeeData.lastName} - E-Werke`,
            text: `Kontakt zu ${currentEmployeeData.firstName} ${currentEmployeeData.lastName}`,
            url: `https://buderus-systeme.de/mitarbeiter/${currentEmployeeData.firstName.toLowerCase()}-${currentEmployeeData.lastName.toLowerCase()}.html`
        });
    } else {
        showToast('info', 'Teilen', 'Teilen-Funktion wird in einer zukünftigen Version verfügbar sein');
    }
}

// QR Code Functions
function downloadQRCode() {
    const qrImage = document.querySelector('#qrCodeDisplay img');
    if (qrImage) {
        const link = document.createElement('a');
        link.download = `qr-code-${currentEmployeeData.firstName}-${currentEmployeeData.lastName}.png`;
        link.href = qrImage.src;
        link.click();
    } else {
        showToast('error', 'Download Fehler', 'QR Code nicht verfügbar');
    }
}

function printQRCode() {
    const qrImage = document.querySelector('#qrCodeDisplay img');
    if (qrImage) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head><title>QR Code - ${currentEmployeeData.firstName} ${currentEmployeeData.lastName}</title></head>
                <body style="text-align: center; padding: 50px;">
                    <h2>${currentEmployeeData.firstName} ${currentEmployeeData.lastName}</h2>
                    <p>${currentEmployeeData.position}</p>
                    <img src="${qrImage.src}" style="max-width: 300px;">
                    <p>Scannen Sie diesen Code für den direkten Kontakt</p>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    } else {
        showToast('error', 'Druck Fehler', 'QR Code nicht verfügbar');
    }
}

async function regenerateQRCode() {
    try {
        showToast('info', 'QR Code', 'QR Code wird neu generiert...');
        await generateQRCode();
        showToast('success', 'QR Code', 'QR Code wurde erfolgreich neu generiert');
    } catch (error) {
        showToast('error', 'QR Code Fehler', 'QR Code konnte nicht neu generiert werden');
    }
}

// Utility Functions
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    userMenu.classList.toggle('hidden');
}

// Close user menu when clicking outside
document.addEventListener('click', function(e) {
    const userDropdown = document.querySelector('.user-dropdown');
    const userMenu = document.getElementById('userMenu');
    
    if (!userDropdown.contains(e.target)) {
        userMenu.classList.add('hidden');
    }
});

async function resetPassword() {
    const email = document.getElementById('loginEmail').value;
    
    if (!email) {
        showToast('warning', 'E-Mail erforderlich', 'Bitte geben Sie Ihre E-Mail-Adresse ein');
        return;
    }
    
    try {
        const { sendPasswordResetEmail } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
        await sendPasswordResetEmail(window.auth, email);
        showToast('success', 'E-Mail versendet', 'Ein Link zum Zurücksetzen des Passworts wurde an Ihre E-Mail gesendet');
    } catch (error) {
        console.error('Password Reset Fehler:', error);
        showToast('error', 'Fehler', getErrorMessage(error.code));
    }
}

async function logout() {
    try {
        const { signOut } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
        await signOut(window.auth);
        currentUser = null;
        currentEmployeeData = null;
        showToast('success', 'Abgemeldet', 'Sie wurden erfolgreich abgemeldet');
    } catch (error) {
        console.error('Logout Fehler:', error);
        showToast('error', 'Fehler', 'Fehler beim Abmelden');
    }
}

function backToLogin() {
    showLoginScreen();
}

// Toast Notification System
function showToast(type, title, message) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${iconMap[type]}"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="closeToast(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
        if (toast.parentNode) {
            closeToast(toast.querySelector('.toast-close'));
        }
    }, 5000);
}

function closeToast(button) {
    const toast = button.parentNode;
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Error Message Helper
function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/user-not-found': 'Kein Benutzer mit dieser E-Mail gefunden',
        'auth/wrong-password': 'Falsches Passwort',
        'auth/email-already-in-use': 'Diese E-Mail wird bereits verwendet',
        'auth/weak-password': 'Das Passwort ist zu schwach',
        'auth/invalid-email': 'Ungültige E-Mail-Adresse',
        'auth/user-disabled': 'Dieser Benutzer wurde deaktiviert',
        'auth/too-many-requests': 'Zu viele Anfragen. Bitte versuchen Sie es später erneut',
        'auth/network-request-failed': 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung'
    };
    
    return errorMessages[errorCode] || 'Ein unbekannter Fehler ist aufgetreten';
}

// === EMPLOYEE CARD FUNCTIONS ===
function generateEmployeeCardPreview() {
    const container = document.getElementById('employeeCardContainer');
    if (!container || !currentEmployeeData) {
        console.error('❌ Container oder Employee Data nicht verfügbar');
        return;
    }
    
    console.log('🎨 Generiere Employee Card mit Daten:', currentEmployeeData);
    
    // HTML-Struktur passend zum employee-card.css (ohne card-actions, da schon im HTML vorhanden)
    container.innerHTML = `
        <div class="card-preview-wrapper">
            <div class="employee-card" id="employeeCard">
                <div class="card-top-section">
                    <img src="../assets/logo.png" alt="Logo" class="card-logo">
                    <img src="${currentEmployeeData.avatar || '../assets/avatar.png'}" alt="Avatar" class="card-avatar">
                </div>
                <div class="card-bottom-section">
                    <div class="card-text-content">
                        <h3 class="card-name">${currentEmployeeData.firstName || ''} ${currentEmployeeData.lastName || ''}</h3>
                        <p class="card-job-title">${currentEmployeeData.position || ''}</p>
                        <div class="card-contact-info">
                            <p class="card-contact-item">TEL: ${currentEmployeeData.phone || ''}</p>
                            <p class="card-contact-item">${currentEmployeeData.email || ''}</p>
                            <p class="card-contact-item">buderus-systeme.de</p>
                        </div>
                    </div>
                    <div class="card-qr-code" id="cardQRCode"></div>
                </div>
            </div>
        </div>
    `;
    
    // QR-Code generieren
    setTimeout(() => {
        if (window.QRCode && currentEmployeeData.firstName && currentEmployeeData.lastName) {
            const qrContainer = document.getElementById('cardQRCode');
            const publicUrl = `https://buderus-systeme.de/mitarbeiter/${currentEmployeeData.firstName.toLowerCase()}-${currentEmployeeData.lastName.toLowerCase()}.html`;
            
            console.log('🔗 Generiere QR Code für URL:', publicUrl);
            
            // QR-Code Container leeren
            qrContainer.innerHTML = '';
            
            new QRCode(qrContainer, {
                text: publicUrl,
                width: 52, // Passt zur CSS-Größe von 60px minus padding
                height: 52,
                colorDark: "#1B3155", // Blaue QR-Code auf weißem Hintergrund
                colorLight: "#FFFFFF",
                correctLevel: QRCode.CorrectLevel.M
            });
        }
    }, 100);
}

function orderEmployeeCard() {
    showOrders();
    addToCart('employee-card');
}

function downloadCard() {
    const cardElement = document.getElementById('employeeCard');
    if (!cardElement) return;
    
    if (window.html2canvas) {
        html2canvas(cardElement, {
            scale: 2,
            backgroundColor: '#ffffff'
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `mitarbeiterausweis-${currentUser.firstName}-${currentUser.lastName}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    }
}

// === SHOP FUNCTIONS ===
let cart = [];
let products = [];

async function loadProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    try {
        products = [
            {
                id: 'employee-card',
                name: 'Mitarbeiterausweis',
                description: 'Professioneller Mitarbeiterausweis mit Ihren Daten',
                price: 'Kostenlos',
                icon: 'fas fa-id-card',
                category: 'cards'
            },
            {
                id: 'business-card',
                name: 'Visitenkarten',
                description: '100 Stück, hochwertiger Druck',
                price: '15,00 €',
                icon: 'fas fa-address-card',
                category: 'cards'
            },
            {
                id: 'tshirt',
                name: 'T-Shirt',
                description: 'Firmen T-Shirt in verschiedenen Größen',
                price: '25,00 €',
                icon: 'fas fa-tshirt',
                category: 'clothing'
            }
        ];
        
        renderProducts();
    } catch (error) {
        console.error('Fehler beim Laden der Produkte:', error);
        productGrid.innerHTML = '<p class="error">Fehler beim Laden der Produkte</p>';
    }
}

function renderProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <i class="${product.icon}"></i>
            </div>
            <h4 class="product-title">${product.name}</h4>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${product.price}</div>
            <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                <i class="fas fa-cart-plus"></i>
                In den Warenkorb
            </button>
        </div>
    `).join('');
}

// VERALTETE FUNKTION ENTFERNT - Verwende die neue addToCart-Funktion weiter unten

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    updateCartDisplay();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.productId === productId);
    if (!item) return;
    
    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Warenkorb ist leer</p>';
        if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.productId}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.productId}', 1)">+</button>
                </div>
            </div>
        `).join('');
        if (checkoutBtn) checkoutBtn.disabled = false;
    }
}

// === VOLLSTÄNDIGES BESTELLSYSTEM ===
// cart ist bereits oben deklariert - verwende bestehende Variable
let productStates = {
    'employee-card': { format: '', quantity: 0 },
    tshirt: { size: '', quantity: 0 },
    cards: { format: '', quantity: 0 }
};

// Kategorie anzeigen
function showCategory(category) {
    console.log('🏷️ Zeige Kategorie:', category);
    
    // Kategorie-Buttons aktualisieren
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Produkte filtern
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Produkt aktualisieren (Größe/Format ändern)
function updateProduct(productType, selectElement) {
    const value = selectElement.value;
    console.log('🔄 Update Produkt:', productType, 'Wert:', value);
    
    if (productType === 'tshirt') {
        productStates.tshirt.size = value;
    } else if (productType === 'cards') {
        productStates.cards.format = value;
    } else if (productType === 'employee-card') {
        productStates['employee-card'].format = value;
    }
    
    updateAddToCartButton(productType);
}

// Menge ändern
function changeQuantity(productType, change) {
    const currentQuantity = productStates[productType].quantity;
    let newQuantity = currentQuantity + change;
    
    // Mindestmenge 0
    if (newQuantity < 0) newQuantity = 0;
    
    // Maximalmenge für verschiedene Produkte
    if (productType === 'tshirt' && newQuantity > 10) newQuantity = 10;
    if (productType === 'cards' && newQuantity > 1000) newQuantity = 1000;
    
    productStates[productType].quantity = newQuantity;
    
    // Anzeige aktualisieren
    document.getElementById(`${productType}-quantity`).textContent = newQuantity;
    
    console.log('📊 Menge geändert:', productType, 'Neue Menge:', newQuantity);
    updateAddToCartButton(productType);
}

// "In Warenkorb"-Button aktivieren/deaktivieren
function updateAddToCartButton(productType) {
    const button = document.querySelector(`[onclick="addToCart('${productType}')"]`);
    if (!button) return;
    
    const state = productStates[productType];
    
    let canAdd = false;
    
    if (productType === 'tshirt') {
        canAdd = state.size && state.quantity > 0;
    } else if (productType === 'cards') {
        canAdd = state.format && state.quantity > 0;
    } else if (productType === 'employee-card') {
        canAdd = state.format && state.quantity > 0;
    }
    
    button.disabled = !canAdd;
    console.log('🛒 Button Status:', productType, 'Aktiviert:', canAdd);
}

// Zum Warenkorb hinzufügen
function addToCart(productType) {
    const state = productStates[productType];
    
    if (productType === 'tshirt' && state.size && state.quantity > 0) {
        const item = {
            id: `tshirt-${state.size}-${Date.now()}`,
            type: 'tshirt',
            name: 'Firmen T-Shirt',
            size: state.size,
            quantity: state.quantity,
            details: `Größe: ${state.size}, Anzahl: ${state.quantity}`
        };
        
        cart.push(item);
        console.log('✅ T-Shirt zum Warenkorb hinzugefügt:', item);
        
        // Reset
        productStates.tshirt = { size: '', quantity: 0 };
        const sizeSelect = document.querySelector('.size-select');
        if (sizeSelect) sizeSelect.value = '';
        const quantityDisplay = document.getElementById('tshirt-quantity');
        if (quantityDisplay) quantityDisplay.textContent = '0';
        
    } else if (productType === 'cards' && state.format && state.quantity > 0) {
        const item = {
            id: `cards-${state.format}-${Date.now()}`,
            type: 'cards',
            name: 'Visitenkarten',
            format: state.format,
            quantity: state.quantity,
            details: `Format: ${state.format}, Stückzahl: ${state.quantity}`
        };
        
        cart.push(item);
        console.log('✅ Visitenkarten zum Warenkorb hinzugefügt:', item);
        
        // Reset
        productStates.cards = { format: '', quantity: 0 };
        const formatSelect = document.querySelector('.format-select');
        if (formatSelect) formatSelect.value = '';
        const quantityDisplay = document.getElementById('cards-quantity');
        if (quantityDisplay) quantityDisplay.textContent = '0';
        
    } else if (productType === 'employee-card' && state.format && state.quantity > 0) {
        const item = {
            id: `employee-card-${state.format}-${Date.now()}`,
            type: 'employee-card',
            name: 'Mitarbeiterausweis',
            format: state.format,
            quantity: state.quantity,
            details: `Format: ${state.format}, Anzahl: ${state.quantity}`
        };
        
        cart.push(item);
        console.log('✅ Mitarbeiterausweis zum Warenkorb hinzugefügt:', item);
        
        // Reset
        productStates['employee-card'] = { format: '', quantity: 0 };
        const formatSelect = document.querySelector('div[data-category="cards"] .format-select');
        if (formatSelect) formatSelect.value = '';
        const quantityDisplay = document.getElementById('employee-card-quantity');
        if (quantityDisplay) quantityDisplay.textContent = '0';
    }
    
    updateCartDisplay();
    updateAddToCartButton(productType);
}

// Warenkorb-Anzeige aktualisieren (Neues System)
function updateCartDisplay() {
    const cartBadge = document.getElementById('cartBadge');
    const footerCartCount = document.getElementById('footerCartCount');
    const cartDialogBody = document.getElementById('cartDialogBody');
    const cartTotalItems = document.getElementById('cartTotalItems');
    const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Badge aktualisieren
    if (cartBadge) {
        if (totalItems > 0) {
            cartBadge.textContent = totalItems;
            cartBadge.classList.remove('hidden');
        } else {
            cartBadge.classList.add('hidden');
        }
    }
    
    // Footer Count aktualisieren
    if (footerCartCount) {
        footerCartCount.textContent = totalItems;
    }
    
    // Dialog Content aktualisieren
    if (cartDialogBody) {
        if (cart.length === 0) {
            cartDialogBody.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Warenkorb ist leer</h3>
                    <p>Fügen Sie Artikel aus dem Shop hinzu</p>
                </div>
            `;
        } else {
            cartDialogBody.innerHTML = cart.map(item => `
                <div class="cart-dialog-item">
                    <div class="cart-dialog-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.details}</p>
                    </div>
                    <div class="cart-dialog-item-actions">
                        <span class="cart-item-quantity">${item.quantity}x</span>
                        <button class="remove-cart-item" onclick="removeFromCart('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Total und Checkout Button
    if (cartTotalItems) {
        cartTotalItems.textContent = `${totalItems} Artikel`;
    }
    
    if (cartCheckoutBtn) {
        cartCheckoutBtn.disabled = cart.length === 0;
    }
    
    console.log('🛒 Cart Display aktualisiert:', totalItems, 'Artikel');
}

// Cart Dialog öffnen
function openCartDialog() {
    const cartDialog = document.getElementById('cartDialog');
    if (cartDialog) {
        cartDialog.classList.remove('hidden');
        updateCartDisplay(); // Aktuelle Daten laden
        console.log('🛒 Cart Dialog geöffnet');
    }
}

// Cart Dialog schließen
function closeCartDialog() {
    const cartDialog = document.getElementById('cartDialog');
    if (cartDialog) {
        cartDialog.classList.add('hidden');
        console.log('🛒 Cart Dialog geschlossen');
    }
}

// Artikel aus Warenkorb entfernen
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    console.log('🗑️ Artikel entfernt:', itemId);
    updateCartDisplay();
}

// Bestellung abschicken (Firebase-Integration)
async function submitOrder() {
    if (cart.length === 0) {
        showToast('warning', 'Warenkorb leer', 'Fügen Sie erst Artikel zum Warenkorb hinzu');
        return;
    }
    
    if (!currentEmployeeData) {
        showToast('error', 'Fehler', 'Benutzerdaten nicht verfügbar');
        return;
    }
    
    console.log('📦 Sende Bestellung...');
    
    try {
        const orderData = {
            // Bestellungs-Metadaten
            orderId: `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            status: 'pending', // pending, processing, completed, cancelled
            createdAt: new Date().toISOString(),
            createdDate: new Date().toLocaleDateString('de-DE'),
            orderMonth: new Date().toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit' }),
            
            // Mitarbeiterdaten für Admin-Sortierung
            employee: {
                uid: currentEmployeeData.uid,
                firstName: currentEmployeeData.firstName,
                lastName: currentEmployeeData.lastName,
                fullName: `${currentEmployeeData.firstName} ${currentEmployeeData.lastName}`,
                email: currentEmployeeData.email,
                position: currentEmployeeData.position,
                department: currentEmployeeData.department || 'Unbekannt'
            },
            
            // Bestellte Artikel
            items: cart.map(item => ({
                id: item.id,
                type: item.type,
                name: item.name,
                quantity: item.quantity,
                details: item.details,
                // Zusätzliche Produktdetails
                ...(item.size && { size: item.size }),
                ...(item.format && { format: item.format })
            })),
            
            // Zusammenfassung für Admin-Dashboard
            summary: {
                totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
                itemTypes: [...new Set(cart.map(item => item.type))],
                itemCount: cart.length,
                hasShirts: cart.some(item => item.type === 'tshirt'),
                hasCards: cart.some(item => item.type === 'cards')
            }
        };
        
        console.log('📄 Bestelldaten:', orderData);
        
        // In Firestore speichern (Firebase v9+ SDK)
        const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
        await setDoc(doc(window.db, 'orders', orderData.orderId), orderData);
        
        console.log('✅ Bestellung erfolgreich in Firebase gespeichert');
        
        // Erfolgs-Feedback
        showToast('success', 'Bestellung erfolgreich', `Bestellnummer: ${orderData.orderId.split('_')[1]}`);
        
        // Warenkorb leeren
        cart = [];
        updateCartDisplay();
        
        // Produkt-States zurücksetzen
        productStates = {
            tshirt: { size: '', quantity: 0 },
            cards: { format: '', quantity: 0 }
        };
        
    } catch (error) {
        console.error('❌ Fehler beim Senden der Bestellung:', error);
        showToast('error', 'Fehler', 'Bestellung konnte nicht gesendet werden');
    }
}

function loadCart() {
    cart = [];
    updateCartDisplay();
}

// Legacy-Funktion für Kompatibilität
async function checkout() {
    await submitOrder();
}

// Export für globale Verfügbarkeit
window.dashboardApp = {
    showProfile,
    showBusinessCard,
    showEmployeeCard,
    showOrders,
    showQRCode,
    showWelcome,
    togglePassword,
    toggleUserMenu,
    logout,
    resetPassword,
    backToLogin,
    previewAvatar,
    previewChanges,
    previewPublicPage,
    generateEmployeeCardPreview,
    orderEmployeeCard,
    downloadCard,
    loadProducts,
    addToCart,
    updateQuantity,
    removeFromCart,
    checkout,
    downloadBusinessCard,
    shareBusinessCard,
    downloadQRCode,
    printQRCode,
    regenerateQRCode
};

// Globale Funktionen für onclick Handler
window.showProfile = showProfile;
window.showEmployeeCard = showEmployeeCard;
window.showOrders = showOrders;
window.showQRCode = showQRCode;
window.previewPublicPage = previewPublicPage;
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.orderEmployeeCard = orderEmployeeCard;
window.downloadCard = downloadCard;

// Neue Shop-Funktionen
window.showCategory = showCategory;
window.updateProduct = updateProduct;
window.changeQuantity = changeQuantity;
window.updateAddToCartButton = updateAddToCartButton;
window.submitOrder = submitOrder;
window.openCartDialog = openCartDialog;
window.closeCartDialog = closeCartDialog;
