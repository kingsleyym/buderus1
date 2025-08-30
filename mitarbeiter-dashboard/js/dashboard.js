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
    if (!currentEmployeeData) return;
    
    document.getElementById('cardName').textContent = `${currentEmployeeData.firstName} ${currentEmployeeData.lastName}`;
    document.getElementById('cardPosition').textContent = currentEmployeeData.position || '';
    document.getElementById('cardEmail').textContent = currentEmployeeData.email || '';
    document.getElementById('cardPhone').textContent = currentEmployeeData.phone || '';
    
    if (currentEmployeeData.avatar) {
        document.getElementById('cardAvatar').src = currentEmployeeData.avatar;
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

function showBusinessCard() {
    switchDashboardSection('businessCardSection');
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

// Export für globale Verfügbarkeit
window.dashboardApp = {
    showProfile,
    showBusinessCard,
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
    downloadBusinessCard,
    shareBusinessCard,
    downloadQRCode,
    printQRCode,
    regenerateQRCode
};
