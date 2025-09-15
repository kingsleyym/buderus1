# 🚀 Migration: Nur Firebase zu Helios-Energy

## 📋 **Fokussierte Checkliste (nur .web.app)**

### **Firebase Setup**
- [ ] ✅ Firebase-Projekt "helios-energy" erstellt
- [ ] Firebase CLI installiert/aktualisiert
- [ ] Bei Firebase angemeldet
- [ ] Projekt "helios-energy" konfiguriert
- [ ] Firestore-Daten migriert

### **Code Migration (nur Firebase)**
- [ ] Firebase URLs aktualisiert (.web.app)
- [ ] Firebase authDomain aktualisiert (.firebaseapp.com)
- [ ] Firebase projectId in allen HTML-Dateien
- [ ] QR-Code Short-Links (.web.app/q/)
- [ ] Admin/Dashboard Links (.web.app)

### **NICHT ändern (bleibt bei buderus-systeme.de)**
- [ ] GitHub Pages URLs (.de) - NICHT ÄNDERN
- [ ] E-Mail-Adressen (@buderus-systeme.de) - NICHT ÄNDERN
- [ ] Employee-Profile URLs (.de) - NICHT ÄNDERN
- [ ] Mitarbeiter-Seiten (.de) - NICHT ÄNDERN

---

## 🔧 **Schritt-für-Schritt: Nur Firebase Migration**

### **Schritt 1: Firebase CLI Setup**

```bash
# Firebase CLI aktualisieren
npm install -g firebase-tools

# Anmelden
firebase login

# Projekt wechseln
firebase use helios-energy

# Bestätigung
firebase projects:list --current
```

### **Schritt 2: .firebaserc aktualisieren**

```bash
# .firebaserc Dateien automatisch aktualisieren
find . -name ".firebaserc" -exec sed -i '' 's/"buderus-systeme"/"helios-energy"/g' {} \;

# Prüfen
cat .firebaserc
cat newsletter/.firebaserc
```

### **Schritt 3: Nur Firebase .web.app URLs ändern**

```bash
# Backup erstellen
tar -czf firebase-migration-backup-$(date +%Y%m%d).tar.gz .

# NUR .web.app URLs ändern
find . -name "*.html" -o -name "*.js" | xargs grep -l "buderus-systeme\.web\.app" | xargs sed -i '' 's/buderus-systeme\.web\.app/helios-energy.web.app/g'

# NUR Firebase authDomain ändern
find . -name "*.html" | xargs grep -l "buderus-systeme\.firebaseapp\.com" | xargs sed -i '' 's/buderus-systeme\.firebaseapp\.com/helios-energy.firebaseapp.com/g'

# Prüfen was geändert wurde
git diff --name-only
```

### **Schritt 4: Firebase Config in HTML-Dateien**

**🔥 Diese Dateien manuell aktualisieren mit deiner neuen Firebase Config:**

```javascript
// ALTE Config ersetzen:
const firebaseConfig = {
    apiKey: "...",
    authDomain: "buderus-systeme.firebaseapp.com", // ← ÄNDERN
    projectId: "buderus-systeme", // ← ÄNDERN
    storageBucket: "buderus-systeme.appspot.com", // ← ÄNDERN
    messagingSenderId: "...",
    appId: "..."
};

// NEUE Config (aus Firebase Console):
const firebaseConfig = {
    apiKey: "DEINE-NEUE-API-KEY",
    authDomain: "helios-energy.firebaseapp.com",
    projectId: "helios-energy", 
    storageBucket: "helios-energy.appspot.com",
    messagingSenderId: "NEUE-SENDER-ID",
    appId: "NEUE-APP-ID"
};
```

**Betroffene Dateien:**
- `admin/index.html`
- `admin/qr-codes.html` 
- `admin/dashboard.html`
- `admin/employees.html`
- `admin/analytics.html`
- `admin/newsletter-editor.html`
- `admin/subscribers.html`
- `admin/rewards.html`
- `admin/campaigns.html`
- `mitarbeiter-dashboard/index.html`
- `newsletter/index.html`
- `newsletter/confirm.html`

### **Schritt 5: Firestore-Daten migrieren**

```bash
# Export aus altem Projekt
firebase --project buderus-systeme firestore:export gs://buderus-systeme.appspot.com/backup-$(date +%Y%m%d)

# Import in neues Projekt
firebase --project helios-energy firestore:import gs://helios-energy.appspot.com/backup-$(date +%Y%m%d)
```

### **Schritt 6: Functions deployen**

```bash
# Functions-Dependencies installieren
cd newsletter/functions
npm install
cd ../../

# Deploy
firebase deploy --only functions
firebase deploy --only firestore
firebase deploy --only hosting
```

### **Schritt 7: Testing**

Nach der Migration testen:
- [ ] **Admin-Panel**: https://helios-energy.web.app/admin/
- [ ] **Dashboard**: https://helios-energy.web.app/mitarbeiter-dashboard/
- [ ] **Newsletter**: https://helios-energy.web.app/newsletter/
- [ ] **QR-Codes**: https://helios-energy.web.app/q/test

---

## ⚠️ **Wichtig: Was NICHT geändert wird**

```bash
# Diese URLs bleiben unverändert:
buderus-systeme.de                    # ← NICHT ÄNDERN
@buderus-systeme.de                   # ← E-Mail bleibt
mitarbeiter/                          # ← GitHub Pages bleibt
CNAME (www.buderus-systeme.de)        # ← Bleibt
```

---

## 🧪 **Schnell-Test Commands**

```bash
# Prüfen was sich geändert hat
grep -r "helios-energy\.web\.app" . --include="*.html" --include="*.js"

# Prüfen dass .de URLs NICHT geändert wurden  
grep -r "buderus-systeme\.de" . --include="*.html" --include="*.js" | head -5

# Firebase Status
firebase projects:list --current
```

---

**🎯 Fokus: Nur Firebase-Backend und Web-App!**
**⏱️ Geschätzte Zeit: 1-2 Stunden**
