# 🔍 GitHub Pages & Employee System Analyse

## 📊 **Aktuelle Infrastruktur**

### **🐙 GitHub Repository**
```yaml
Repository: kingsleyym/buderus1
Branch: main
URL: https://github.com/kingsleyym/buderus1.git
GitHub Pages: Aktiviert (vermutlich auf buderus-systeme.de)
```

### **🤖 GitHub Actions (2 Workflows)**

#### **Workflow 1: employee-pages.yml**
```yaml
Trigger: 
  - repository_dispatch (employee_update)
  - workflow_dispatch (manuell)

Prozess:
1. Checkout Repository
2. Node.js 18 Setup  
3. Ausführung: mitarbeiter/generate-employee-pages.js
4. Auto-Commit & Push der generierten HTML-Seiten

Output: Alle Mitarbeiter-HTML-Seiten werden automatisch erstellt
```

#### **Workflow 2: generate-employee-pages.yml**
```yaml
Trigger: 
  - repository_dispatch (employee_update)
  - workflow_dispatch (manuell)

Prozess: 
1. Node.js 20 Setup
2. Generiert Employee-Pages aus employees.json
3. Commit mit Employee-Namen
4. Push zu GitHub Pages

Besonderheit: Reagiert auf Mitarbeiter-Änderungen im Dashboard
```

### **⚙️ Employee Generation System**

#### **Template System:**
```javascript
// mitarbeiter/generate-employee-pages.js
- Liest employees.json
- Generiert HTML-Seiten pro Mitarbeiter
- Template enthält: "Buderus Systeme" Branding
- Avatar-Bilder aus assets/avatars/
- E-Mail: @buderus-systeme.de
- Website: https://buderus-systeme.de
```

#### **Integration mit Firebase Dashboard:**
```javascript
// Mitarbeiter-Dashboard trigger GitHub Action
repository_dispatch → employee_update → Automatische HTML-Generierung
```

## 🔄 **Employee-Update Prozess**

### **Aktueller Ablauf:**
1. **Mitarbeiter bearbeitet Profil** (mitarbeiter-dashboard/)
2. **Firebase Function** wird ausgelöst
3. **GitHub API call** (repository_dispatch)
4. **GitHub Action** startet automatisch
5. **generate-employee-pages.js** wird ausgeführt
6. **HTML-Seiten** werden generiert und committed
7. **GitHub Pages** deployed automatisch
8. **Neue Seite** ist live auf buderus-systeme.de/mitarbeiter/

### **Betroffene Dateien bei Employee-Update:**
```bash
mitarbeiter/employees.json          # Employee-Daten
mitarbeiter/[name].html            # Individual HTML-Seiten  
assets/avatars/[id].png            # Profilbilder
mitarbeiter/index.html             # Team-Übersicht
```

## 🎯 **Migration Herausforderungen**

### **1. GitHub Pages Domain**
```yaml
Aktuell: buderus-systeme.de (über CNAME)
Ziel: helios-energy.de

Problem: 
- CNAME muss geändert werden
- DNS A-Records müssen umgestellt werden
- GitHub Pages Custom Domain Setting
```

### **2. Employee-Daten Migration**
```json
// employees.json - ALLE Einträge ändern:
{
  "email": "name@buderus-systeme.de",     // → @helios-energy.de
  "website": "https://buderus-systeme.de", // → https://helios-energy.de  
  "company": "Buderus Systeme"            // → "Helios Energy"
}
```

### **3. HTML-Template Migration**
```html
<!-- generate-employee-pages.js Template -->
<title>{{name}} - {{title}} | Buderus Systeme</title>  <!-- → Helios Energy -->

<!-- Alle generierten HTML-Seiten: -->
mitarbeiter/agim-beciri.html
mitarbeiter/david-sawall.html
mitarbeiter/roland-neu.html
... (alle müssen regeneriert werden)
```

### **4. GitHub Repository**
```yaml
Aktuell: kingsleyym/buderus1
Ziel: kingsleyym/helios-energy

Überlegungen:
- Repository umbenennen vs. neues Repository
- GitHub Actions müssen migriert werden
- Secrets/Tokens prüfen
```

## 📋 **Migrations-Strategie**

### **Option A: Repository umbenennen (Einfach)**
```bash
# GitHub → Settings → Repository name → "helios-energy"
# Lokale Remote URL aktualisieren
git remote set-url origin https://github.com/kingsleyym/helios-energy.git

Vorteil: History bleibt erhalten, GitHub Actions funktionieren weiter
Nachteil: Alte URLs brechen (aber das wollen wir ja)
```

### **Option B: Neues Repository (Sauber)**
```bash
# Neues Repository erstellen: helios-energy
# Code kopieren, aber sauberer Start
# GitHub Actions neu konfigurieren

Vorteil: Komplett sauberer Start, alte "buderus" Referenzen weg
Nachteil: Git-History geht verloren (nicht schlimm)
```

### **Option C: Parallel-Betrieb (Sicher)**
```bash
# Neues Repository helios-energy
# Beide Systeme laufen 1-2 Monate parallel
# Schrittweise Migration der Mitarbeiter

Vorteil: Kein Downtime-Risiko
Nachteil: Doppelter Aufwand
```

## 🚀 **Empfohlene Migration (Schritt-für-Schritt)**

### **Phase 1: Vorbereitung**
```bash
1. Domain helios-energy.de registrieren
2. DNS-Records vorbereiten (aber noch nicht aktivieren)
3. Neues GitHub Repository "helios-energy" erstellen
4. GitHub Pages für helios-energy aktivieren
```

### **Phase 2: Code-Migration**
```bash
1. employees.json komplett aktualisieren (alle E-Mails/Domains)
2. generate-employee-pages.js Template ändern
3. _config.yml aktualisieren
4. CNAME Datei erstellen (helios-energy.de)
5. GitHub Actions kopieren/anpassen
```

### **Phase 3: Integration testen**
```bash
1. Mitarbeiter-Dashboard auf neues Repository zeigen lassen
2. Employee-Update Test durchführen
3. GitHub Actions Test (manuell triggern)
4. Generierte HTML-Seiten prüfen
```

### **Phase 4: DNS-Umstellung**
```bash
1. GitHub Pages Custom Domain: helios-energy.de setzen
2. DNS A-Records live schalten
3. SSL-Zertifikat automatisch erstellen lassen
4. Alte Domain weiterleiten (falls gewünscht)
```

## ⚠️ **Kritische Integration-Punkte**

### **1. Firebase → GitHub API**
```javascript
// In Employee-Dashboard Functions:
// GitHub API-Call muss auf neues Repository zeigen
const repoOwner = 'kingsleyym';
const repoName = 'helios-energy';  // statt 'buderus1'
```

### **2. Employee-Dashboard URLs**
```javascript
// Dashboard muss neue GitHub Pages URLs generieren:
const profileUrl = `https://helios-energy.de/mitarbeiter/${fileName}.html`;
// statt: https://buderus-systeme.de/mitarbeiter/${fileName}.html
```

### **3. GitHub Secrets/Tokens**
```yaml
# Prüfen ob GitHub Token/Secrets migriert werden müssen
# Personal Access Token muss Zugriff auf neues Repository haben
```

## 🎯 **Sofort-Aktionen**

### **1. Backup erstellen**
```bash
# Komplettes Backup vor Migration
tar -czf github-pages-backup-$(date +%Y%m%d).tar.gz mitarbeiter/ .github/
```

### **2. Domain registrieren** 
```bash
# helios-energy.de registrieren
# DNS-Provider wählen (Cloudflare empfohlen)
```

### **3. Neues GitHub Repository**
```bash
# Repository "helios-energy" erstellen
# GitHub Pages aktivieren
# Settings vorbereiten
```

## 🤔 **Fragen an dich:**

1. **Repository-Strategie**: Willst du `buderus1` umbenennen oder komplett neues Repository?

2. **Migration-Timing**: Parallel-Betrieb oder direkte Umstellung?

3. **Domain-Timing**: Wann soll helios-energy.de live gehen?

4. **Employee-Kommunikation**: Sollen Mitarbeiter über neue URLs informiert werden?

---

**🎯 Welche Migration-Option bevorzugst du?**
- **A)** Repository umbenennen (schnell)
- **B)** Neues Repository (sauber) 
- **C)** Parallel-Betrieb (sicher)

**Was soll ich als Nächstes vorbereiten?**
