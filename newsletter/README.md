# Newsletter System Setup

Dieses Verzeichnis enthält das komplette Newsletter System für die Buderus Systeme Website.

## 🏗️ System Architektur

- **Frontend**: HTML/CSS/JavaScript mit Firebase SDK
- **Backend**: Firebase Cloud Functions (Node.js)
- **Database**: Cloud Firestore
- **E-Mail**: Nodemailer (SMTP konfigurierbar)
- **Hosting**: Firebase Hosting / GitHub Pages

## 📁 Dateistruktur

```
newsletter/
├── index.html              # Newsletter Anmeldeformular
├── confirm.html             # Bestätigungsseite (Double Opt-In)
├── privacy.html             # Datenschutzerklärung
├── newsletter.css           # Spezifische Styles
├── newsletter.js            # Frontend JavaScript
├── package.json             # Haupt Package Config
├── firebase.json            # Firebase Konfiguration
├── firestore.rules          # Firestore Sicherheitsregeln
├── firestore.indexes.json   # Database Indizes
└── functions/
    ├── index.js             # Cloud Functions
    └── package.json         # Functions Dependencies
```

## 🚀 Setup Anleitung

### 1. Firebase Projekt erstellen

```bash
# Firebase CLI installieren
npm install -g firebase-tools

# Firebase Login
firebase login

# Neues Projekt erstellen
firebase init
```

### 2. Dependencies installieren

```bash
# Haupt Dependencies
npm install

# Cloud Functions Dependencies
cd functions
npm install
cd ..
```

### 3. Firebase Konfiguration

```bash
# Firebase Config abrufen
firebase setup:web

# E-Mail Credentials setzen (für Nodemailer)
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-app-password"
```

### 4. Firestore Database Setup

```bash
# Firestore initialisieren
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 5. Cloud Functions deployen

```bash
# Functions deployen
firebase deploy --only functions
```

### 6. Frontend Konfiguration

In `index.html` die Firebase Config einfügen:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
window.firebaseReady = true;
```

## 🔒 DSGVO Compliance

### Double Opt-In Prozess
1. User trägt E-Mail ein
2. Bestätigungs-E-Mail wird gesendet
3. User klickt Bestätigungslink
4. Newsletter Anmeldung ist aktiviert

### Consent Management
- Pflichtfeld: Datenschutzerklärung akzeptieren
- Optional: Marketing E-Mails erhalten
- Alle Einwilligungen werden mit Timestamp und IP gespeichert

### Abmeldung
- Ein-Klick Abmeldung in jeder E-Mail
- Komplette Löschung der Daten nach Abmeldung
- Consent Record für Audit Trail

## 📧 E-Mail Konfiguration

### SMTP Setup (Nodemailer)

Unterstützte Services:
- Gmail (App Password erforderlich)
- SendGrid
- Mailgun
- Amazon SES
- Eigener SMTP Server

```bash
# Beispiel Gmail Setup
firebase functions:config:set email.service="gmail"
firebase functions:config:set email.user="newsletter@buderus-systeme.de"
firebase functions:config:set email.password="your-app-password"
```

## 🧪 Testing

### Local Development

```bash
# Firebase Emulators starten
firebase emulators:start

# Frontend Development Server
npx http-server . -p 3000
```

### Emulator URLs
- Functions: http://localhost:5001
- Firestore: http://localhost:8080
- Hosting: http://localhost:5000
- Emulator UI: http://localhost:4000

## 📊 Analytics & Monitoring

### Events Tracking
- `newsletter_subscription_started`: Anmeldung begonnen
- `newsletter_subscription_confirmed`: Anmeldung bestätigt
- `newsletter_unsubscribe`: Abmeldung
- `newsletter_error`: Fehler aufgetreten

### Firestore Collections
- `subscribers`: Alle Newsletter Abonnenten
- `consent`: DSGVO Consent Records
- `analytics`: Event Tracking Daten

## 🔐 Sicherheit

### Firestore Rules
- Nur Cloud Functions können Daten schreiben
- Admin Authentication für Lesezugriff
- Keine direkten Client-Zugriffe

### Rate Limiting
- Cloud Functions haben automatisches Rate Limiting
- CORS Konfiguration für erlaubte Domains

## 🚀 Deployment

### GitHub Pages (Frontend only)

```bash
# Mit Fallback auf localStorage
git add .
git commit -m "Newsletter System Setup"
git push origin main
```

### Firebase Hosting (Full Stack)

```bash
# Komplettes System deployen
firebase deploy

# Nur Hosting
firebase deploy --only hosting

# Nur Functions
firebase deploy --only functions
```

## 📈 Monitoring

### Firebase Console
- Functions Logs
- Firestore Usage
- Performance Metrics

### Error Handling
- Automatisches Error Logging
- E-Mail Notifications bei kritischen Fehlern
- Graceful Fallbacks

## 🔄 Maintenance

### Regelmäßige Tasks
- Unbestätigte Anmeldungen löschen (> 30 Tage)
- Analytics Daten archivieren
- E-Mail Bounce Handling

### Updates
```bash
# Dependencies aktualisieren
npm update

# Firebase Tools aktualisieren
npm install -g firebase-tools@latest
```

## 🆘 Troubleshooting

### Häufige Probleme

1. **Firebase Config fehlt**
   - Firebase Config in index.html einfügen
   - `window.firebaseReady = true` setzen

2. **E-Mail Versand funktioniert nicht**
   - E-Mail Credentials prüfen
   - SMTP Service Einstellungen überprüfen
   - Functions Logs checken

3. **CORS Fehler**
   - Domain in Firebase Console unter Authentication > Authorized domains hinzufügen

4. **Functions Timeout**
   - Memory Limit erhöhen
   - Cold Start Optimierung

### Support
- Firebase Documentation: https://firebase.google.com/docs
- Functions Logs: `firebase functions:log`
- Emulator Logs: Firebase Emulator UI

## 📝 Nächste Schritte

1. Firebase Projekt erstellen und konfigurieren
2. E-Mail Service einrichten (Gmail/SendGrid)
3. Domain und SSL Zertifikat konfigurieren
4. Testing mit Emulators
5. Production Deployment
6. Monitoring und Analytics Setup
