# 🚀 DEPLOYMENT STRATEGY - KONFLIKT-FREI

## Was bleibt gleich:
✅ **helios-energy.web.app** → Deine komplette bestehende Website
✅ **Alle Functions** (qrRedirect, renderTeamList, etc.)
✅ **Alle Routen** (/team, /q, /api, etc.)
✅ **Firestore & Storage Regeln**

## Was NEU dazu kommt:
🆕 **login-helios-energy.web.app** → React Login
🆕 **admin-helios-energy.web.app** → React Admin Dashboard
🆕 **employee-helios-energy.web.app** → React Employee Portal

## Deployment Steps (sicher):

### 1. Backup (Sicherheit)
```bash
cp firebase.json firebase-backup.json
```

### 2. Targets konfigurieren
```bash
firebase target:apply hosting main helios-energy
firebase target:apply hosting login login-helios-energy
firebase target:apply hosting admin admin-helios-energy  
firebase target:apply hosting employee employee-helios-energy
```

### 3. Multi-Domain Config aktivieren
```bash
cp firebase-multi-domain.json firebase.json
```

### 4. Nur NEUE Targets deployen (erstmal)
```bash
firebase deploy --only hosting:login,hosting:admin,hosting:employee
```

### 5. Später: Alle zusammen
```bash
firebase deploy --only hosting
```

## Sicherheit:
- **Hauptseite wird NICHT verändert** (target: main)
- **Bestehende Functions bleiben**
- **Kann jederzeit zurückgerollt werden**

## Test-Reihenfolge:
1. ✅ React App builden
2. ✅ Targets konfigurieren  
3. ✅ Nur Login-Domain deployen (Test)
4. ✅ Admin + Employee Domain
5. ✅ Alles zusammen
