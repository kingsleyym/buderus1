# 🚀 Migration von Buderus-Systeme zu Helios-Energy

## 📋 **Migration Checkliste**

### **Vorbereitung**
- [ ] ✅ Firebase-Projekt "helios-energy" erstellt
- [ ] Backup der aktuellen Website erstellt
- [ ] Terminal und Firebase CLI bereit
- [ ] GitHub Repository vorbereitet

### **Firebase Setup**
- [ ] Firebase CLI installiert/aktualisiert
- [ ] Bei Firebase angemeldet
- [ ] Projekt "helios-energy" konfiguriert
- [ ] Firebase-Konfigurationsdateien aktualisiert
- [ ] Firestore-Daten migriert

### **Code Migration**
- [ ] Firebase URLs aktualisiert (.web.app)
- [ ] GitHub Pages URLs aktualisiert (.de)
- [ ] E-Mail-Adressen aktualisiert
- [ ] Firebase-Configs in HTML-Dateien
- [ ] QR-Code Short-Links aktualisiert

### **GitHub Pages**
- [ ] Repository umbenannt/neu erstellt
- [ ] CNAME-Datei aktualisiert
- [ ] _config.yml aktualisiert
- [ ] GitHub Pages aktiviert

### **Deployment & Test**
- [ ] Firebase Functions deployed
- [ ] Firebase Hosting deployed
- [ ] GitHub Pages deployed
- [ ] DNS-Records aktualisiert
- [ ] E-Mail-Konfiguration (IONOS)
- [ ] Alle Links getestet

---

## 🔧 **Detaillierte Schritt-für-Schritt Anleitung**

### **Schritt 1: Firebase CLI Setup**

```bash
# 1. Firebase CLI installieren/aktualisieren
npm install -g firebase-tools

# 2. Version prüfen
firebase --version

# 3. Bei Firebase anmelden
firebase login
# ➡️ Browser öffnet sich → Google Account auswählen → Berechtigung erteilen
```

### **Schritt 2: Firebase-Projekt konfigurieren**

```bash
# 1. Ins Hauptverzeichnis wechseln
cd /Users/lucaschweiger/Documents/Clients/Buderus_Systeme/Website/buderus/buderus

# 2. Aktuelle Firebase-Projekte anzeigen
firebase projects:list

# 3. Neues Projekt "helios-energy" auswählen
firebase use helios-energy

# 4. Bestätigung - sollte "helios-energy" zeigen
firebase projects:list --current
```

### **Schritt 3: Firebase-Konfigurationsdateien aktualisieren**

```bash
# 1. .firebaserc Dateien aktualisieren (automatisch)
find . -name ".firebaserc" -exec sed -i '' 's/"buderus-systeme"/"helios-energy"/g' {} \;

# 2. Prüfen ob korrekt aktualisiert
cat .firebaserc
cat newsletter/.firebaserc

# Sollte zeigen:
# {
#   "projects": {
#     "default": "helios-energy"
#   }
# }
```

### **Schritt 4: Firebase Web-App Konfiguration erstellen**

**🔥 WICHTIG: In Firebase Console (Browser)**

1. **Firebase Console öffnen**: https://console.firebase.google.com
2. **Projekt "helios-energy" öffnen**
3. **⚙️ Projekteinstellungen** → **Allgemein**
4. **"App hinzufügen"** → **Web-App Symbol (</>) klicken**
5. **App-Name**: `helios-energy-web`
6. **✅ Firebase Hosting einrichten** (Checkbox aktivieren)
7. **App registrieren** klicken
8. **Firebase SDK-Konfiguration kopieren** (wichtig!)

**Beispiel der neuen Config (wird angezeigt):**
```javascript
const firebaseConfig = {
  apiKey: "DEINE-NEUE-API-KEY",
  authDomain: "helios-energy.firebaseapp.com",
  projectId: "helios-energy",
  storageBucket: "helios-energy.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### **Schritt 5: Firestore & Authentication aktivieren**

**In Firebase Console:**

1. **🔐 Authentication** → **Loslegen**
2. **Sign-in-Methode** → **E-Mail/Passwort** aktivieren
3. **🗄️ Firestore Database** → **Datenbank erstellen**
4. **Produktionsmodus starten** → **Fertig**
5. **📍 Standort**: `europe-west3 (Frankfurt)` wählen

### **Schritt 6: Firestore-Daten migrieren**

```bash
# 1. Daten aus altem Projekt exportieren
firebase --project buderus-systeme firestore:export gs://buderus-systeme.appspot.com/backup-$(date +%Y%m%d)

# 2. Warten bis Export fertig (kann 5-10 Minuten dauern)
# ➡️ Firebase Console → Storage → backup-DATUM Ordner sollte erscheinen

# 3. Daten in neues Projekt importieren  
firebase --project helios-energy firestore:import gs://helios-energy.appspot.com/backup-$(date +%Y%m%d)

# Alternative: Manueller Export/Import über Firebase Console
# Storage → Backup-Datei herunterladen → In neues Projekt hochladen
```

### **Schritt 7: Firestore Security Rules kopieren**

```bash
# 1. Aktuelle Rules anzeigen
cat newsletter/firestore.rules

# 2. Rules in neues Projekt übertragen (automatisch bei Deploy)
firebase deploy --only firestore:rules

# 3. Firestore Indexes übertragen
firebase deploy --only firestore:indexes
```

### **Schritt 8: Code-Migration durchführen**

```bash
# 1. Backup erstellen
tar -czf helios-migration-backup-$(date +%Y%m%d).tar.gz .

# 2. Firebase Web-App URLs aktualisieren
find . -name "*.html" -o -name "*.js" | xargs grep -l "buderus-systeme\.web\.app" | xargs sed -i '' 's/buderus-systeme\.web\.app/helios-energy.web.app/g'

# 3. Firebase App Domain aktualisieren  
find . -name "*.html" | xargs grep -l "buderus-systeme\.firebaseapp\.com" | xargs sed -i '' 's/buderus-systeme\.firebaseapp\.com/helios-energy.firebaseapp.com/g'

# 4. GitHub Pages URLs aktualisieren
find . -name "*.html" -o -name "*.js" | xargs grep -l "buderus-systeme\.de" | xargs sed -i '' 's/buderus-systeme\.de/helios-energy.de/g'

# 5. E-Mail-Adressen aktualisieren
find . -name "*.js" -o -name "*.html" | xargs grep -l "@buderus-systeme\.de" | xargs sed -i '' 's/@buderus-systeme\.de/@helios-energy.de/g'

# 6. CNAME-Datei für GitHub Pages
echo "www.helios-energy.de" > CNAME
```

### **Schritt 9: Firebase-Configs in HTML-Dateien manuell aktualisieren**

**🔥 WICHTIG: Diese Configs müssen mit deiner echten Firebase-Config ersetzt werden!**

**Betroffene Dateien (müssen alle aktualisiert werden):**
- `admin/index.html`
- `admin/qr-codes.html`
- `admin/dashboard.html`
- `admin/employees.html`
- `mitarbeiter-dashboard/index.html`
- `newsletter/index.html`
- `newsletter/confirm.html`

**Suche nach:**
```javascript
const firebaseConfig = {
    apiKey: "...",
    authDomain: "buderus-systeme.firebaseapp.com",
    projectId: "buderus-systeme",
    // ...
};
```

**Ersetze mit deiner neuen Config:**
```javascript
const firebaseConfig = {
    apiKey: "DEINE-NEUE-API-KEY",
    authDomain: "helios-energy.firebaseapp.com", 
    projectId: "helios-energy",
    storageBucket: "helios-energy.appspot.com",
    messagingSenderId: "DEINE-SENDER-ID",
    appId: "DEINE-APP-ID"
};
```

### **Schritt 10: Functions Dependencies installieren**

```bash
# 1. In Functions-Verzeichnis wechseln
cd newsletter/functions

# 2. Dependencies installieren
npm install

# 3. Zurück ins Hauptverzeichnis
cd ../../

# 4. Admin Functions (falls vorhanden)
if [ -d "admin/functions" ]; then
    cd admin/functions
    npm install
    cd ../../
fi
```

### **Schritt 11: Firebase Deploy**

```bash
# 1. Firestore Rules und Indexes
firebase deploy --only firestore

# 2. Firebase Functions
firebase deploy --only functions

# 3. Firebase Hosting
firebase deploy --only hosting

# 4. Alles zusammen (falls obige Schritte erfolgreich)
firebase deploy

# 5. Deploy-Status prüfen
firebase hosting:sites:list
```

### **Schritt 12: GitHub Repository Setup**

```bash
# 1. Git Status prüfen
git status

# 2. Änderungen committen
git add .
git commit -m "🚀 Migration zu Helios-Energy"

# 3. Repository umbenennen (auf GitHub.com)
# → Gehe zu: https://github.com/kingsleyym/buderus1
# → Settings → Repository name → "helios-energy" → Rename

# 4. Remote URL aktualisieren
git remote set-url origin https://github.com/kingsleyym/helios-energy.git

# 5. Push
git push origin main
```

### **Schritt 13: GitHub Pages aktivieren**

**In GitHub Repository (Browser):**

1. **Repository öffnen**: https://github.com/kingsleyym/helios-energy
2. **⚙️ Settings** → **Pages** (linke Sidebar)
3. **Source**: Deploy from a branch
4. **Branch**: main
5. **Folder**: / (root)
6. **Save** klicken
7. **Custom domain**: `www.helios-energy.de` eingeben
8. **Save** klicken

### **Schritt 14: DNS-Konfiguration**

**Bei deinem Domain-Provider (z.B. IONOS):**

```
# A-Records für helios-energy.de
A    @              185.199.108.153
A    @              185.199.109.153  
A    @              185.199.110.153
A    @              185.199.111.153

# CNAME für www
CNAME www           kingsleyym.github.io
```

### **Schritt 15: E-Mail-Konfiguration (IONOS)**

**Neue E-Mail-Adressen erstellen:**
- `newsletter@helios-energy.de`
- `employees@helios-energy.de` 
- `admin@helios-energy.de`
- `datenschutz@helios-energy.de`

**Firebase Functions Config:**
```bash
# E-Mail-Konfiguration setzen
firebase functions:config:set email.user="newsletter@helios-energy.de"
firebase functions:config:set email.password="DEIN-EMAIL-PASSWORD"

# Config anzeigen
firebase functions:config:get

# Functions neu deployen
firebase deploy --only functions
```

---

## 🧪 **Testing-Checkliste**

Nach der Migration testen:

- [ ] **Firebase Hosting**: https://helios-energy.web.app
- [ ] **Admin-Panel**: https://helios-energy.web.app/admin/
- [ ] **Dashboard**: https://helios-energy.web.app/mitarbeiter-dashboard/
- [ ] **Newsletter**: https://helios-energy.web.app/newsletter/
- [ ] **QR-Codes**: https://helios-energy.web.app/q/test
- [ ] **GitHub Pages**: https://helios-energy.de
- [ ] **Mitarbeiter-Seiten**: https://helios-energy.de/mitarbeiter/
- [ ] **E-Mail-Versand** (Newsletter-Test)
- [ ] **QR-Code Generierung**
- [ ] **Employee Dashboard Login**

---

## ⚠️ **Wichtige Hinweise**

1. **Backup**: Immer vor jeder Änderung!
2. **Firebase-Config**: Echte API-Keys aus Firebase Console verwenden
3. **DNS-Propagation**: Kann 24-48h dauern
4. **E-Mail-Tests**: Erst nach DNS-Update möglich
5. **Rollback-Plan**: Backup bereithalten

---

## 🔧 **Troubleshooting**

### **Firebase Deploy Fehler:**
```bash
# Firebase neu initialisieren
firebase logout
firebase login
firebase use helios-energy
```

### **GitHub Pages 404:**
```bash
# CNAME prüfen
cat CNAME
# Sollte zeigen: www.helios-energy.de
```

### **DNS nicht erreichbar:**
```bash
# DNS-Propagation prüfen
nslookup helios-energy.de
nslookup www.helios-energy.de
```

---

**🎯 Geschätzte Gesamtzeit: 2-4 Stunden**
**⚠️ DNS-Propagation: zusätzlich 24-48h**
