# 🚀 Komplette Migration: Buderus → Helios Energy + E-Mail-Server Setup

## 📋 **Überblick der kompletten Migration**

### **Aktueller Stand:**
- ✅ Firebase: `buderus-systeme` → `helios-energy` (DONE)
- ✅ Web-App: `buderus-systeme.web.app` → `helios-energy.web.app` (DONE)
- ❌ Domain: `buderus-systeme.de` → `helios-energy.de` (TODO)
- ❌ E-Mail-Server: IONOS SMTP → Eigener Server (TODO)
- ❌ GitHub: `buderus1` → `helios-energy` (TODO)

---

## 🎯 **Phase 1: Domain & DNS Setup**

### **1.1 Domain registrieren**
```bash
# Neue Domain registrieren
helios-energy.de         # Haupt-Domain
helios-energy.com        # Optional: International
```

**Empfohlene Provider:**
- **Namecheap** (günstig, gute API)
- **Cloudflare** (kostenlose DNS, schnell)
- **1&1 IONOS** (wenn du dabei bleiben willst)

### **1.2 DNS-Konfiguration vorbereiten**
```dns
# DNS Records für helios-energy.de
A     @              [SERVER-IP]
A     www            [SERVER-IP]
AAAA  @              [IPv6-IP]
AAAA  www            [IPv6-IP]

# E-Mail MX Records
MX    @              10 mail.helios-energy.de
MX    @              20 mail2.helios-energy.de

# SPF/DKIM/DMARC für Anti-Spam
TXT   @              "v=spf1 mx a ip4:[SERVER-IP] ~all"
TXT   _dmarc         "v=DMARC1; p=quarantine; rua=mailto:dmarc@helios-energy.de"
TXT   mail._domainkey "v=DKIM1; k=rsa; p=[DKIM-PUBLIC-KEY]"

# Subdomains
CNAME mail           mail.helios-energy.de
CNAME admin          helios-energy.web.app
CNAME dashboard      helios-energy.web.app
```

---

## 🖥️ **Phase 2: Server & E-Mail-Infrastruktur**

### **2.1 Server-Optionen (Anti-Spam optimiert)**

#### **Option A: Managed E-Mail-Service (Empfohlen)**
```yaml
Provider: Microsoft 365 Business / Google Workspace
Kosten: ~6€/Monat pro User
Vorteile:
  - Professionelle Reputation
  - Eingebaute Anti-Spam-Features
  - 99.9% Uptime
  - Compliance (DSGVO)
  - Mobile Apps
Deliverability: ⭐⭐⭐⭐⭐ (Excellent)
```

#### **Option B: Dedicated E-Mail-Server**
```yaml
Provider: Mailgun / SendGrid / Postmark
Kosten: ~25€/Monat (10k E-Mails)
Vorteile:
  - API-Integration
  - Tracking & Analytics
  - Hohe Deliverability
  - Transactional E-Mails
Deliverability: ⭐⭐⭐⭐⭐ (Excellent)
```

#### **Option C: Eigener VPS + Mail-Server**
```yaml
Provider: Hetzner / DigitalOcean / Linode
Kosten: ~20€/Monat (VPS + Backup)
Server: Ubuntu 22.04 LTS
Software: 
  - Postfix (SMTP)
  - Dovecot (IMAP)
  - Roundcube (Webmail)
  - Rspamd (Anti-Spam)
  - Certbot (SSL)
Deliverability: ⭐⭐⭐⭐ (Gut, braucht Warming)
```

### **2.2 Empfohlene Lösung: Hybrid-Ansatz**

```yaml
Geschäfts-E-Mails: Microsoft 365 Business
  - info@helios-energy.de
  - kontakt@helios-energy.de
  - support@helios-energy.de

Newsletter/Marketing: Mailgun Pro
  - newsletter@helios-energy.de
  - marketing@helios-energy.de
  - noreply@helios-energy.de

System-E-Mails: SendGrid
  - system@helios-energy.de
  - admin@helios-energy.de
  - alerts@helios-energy.de
```

---

## 📧 **Phase 3: E-Mail-Server Setup (Mailgun Beispiel)**

### **3.1 Mailgun Setup**
```bash
# 1. Account erstellen bei mailgun.com
# 2. Domain hinzufügen: helios-energy.de
# 3. DNS Records konfigurieren
# 4. API-Keys generieren
```

**DNS Records für Mailgun:**
```dns
TXT   @              "v=spf1 include:mailgun.org ~all"
TXT   k1._domainkey "k=rsa; p=[MAILGUN-DKIM-KEY]"
CNAME email          eu.mailgun.org
```

### **3.2 Firebase Functions Update**
```javascript
// newsletter/functions/index.js
const mailgun = require('mailgun-js');

const mg = mailgun({
    apiKey: functions.config().mailgun.api_key,
    domain: 'helios-energy.de',
    host: 'api.eu.mailgun.net' // EU Server für DSGVO
});

// E-Mail senden
exports.sendNewsletter = functions.https.onCall(async (data, context) => {
    const emailData = {
        from: 'Newsletter <newsletter@helios-energy.de>',
        to: data.email,
        subject: data.subject,
        html: data.content,
        'h:Reply-To': 'kontakt@helios-energy.de',
        'o:tracking': 'yes',
        'o:tracking-clicks': 'yes',
        'o:tracking-opens': 'yes'
    };
    
    return mg.messages().send(emailData);
});
```

---

## 🔧 **Phase 4: Komplette Code-Migration**

### **4.1 Automatische Domain-Ersetzung**
```bash
# Alle .de Domains ersetzen
find . -name "*.html" -o -name "*.js" -o -name "*.json" | \
  xargs grep -l "buderus-systeme\.de" | \
  xargs sed -i '' 's/buderus-systeme\.de/helios-energy.de/g'

# E-Mail-Adressen
find . -name "*.js" -o -name "*.html" | \
  xargs grep -l "@buderus-systeme\.de" | \
  xargs sed -i '' 's/@buderus-systeme\.de/@helios-energy.de/g'

# CNAME Datei
echo "www.helios-energy.de" > CNAME

# _config.yml aktualisieren
sed -i '' 's/Buderus Systeme/Helios Energy/g' mitarbeiter/_config.yml
```

### **4.2 Firebase Functions E-Mail-Config**
```bash
# Mailgun Config setzen
firebase functions:config:set mailgun.api_key="MAILGUN-API-KEY"
firebase functions:config:set mailgun.domain="helios-energy.de"

# E-Mail-Adressen Config
firebase functions:config:set email.newsletter="newsletter@helios-energy.de"
firebase functions:config:set email.support="support@helios-energy.de"
firebase functions:config:set email.admin="admin@helios-energy.de"

# Deploy
firebase deploy --only functions
```

---

## 🐙 **Phase 5: GitHub Repository Migration**

### **5.1 Neues Repository erstellen**
```bash
# 1. GitHub: Neues Repository "helios-energy" erstellen
# 2. Lokales Repository umbenennen

# Remote URL ändern
git remote set-url origin https://github.com/kingsleyym/helios-energy.git

# Branch umbenennen (falls nötig)
git branch -m main main
git push -u origin main

# Altes Repository archivieren
# GitHub: Settings → Archive Repository
```

### **5.2 GitHub Pages konfigurieren**
```bash
# Repository Settings → Pages
Source: Deploy from branch
Branch: main
Folder: /mitarbeiter
Custom Domain: helios-energy.de
```

### **5.3 GitHub Actions für automatisches Deployment**
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
    paths: [ 'mitarbeiter/**' ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./mitarbeiter
          cname: helios-energy.de
```

---

## 📋 **Phase 6: Migration Checklist**

### **6.1 Vorbereitung (Woche 1)**
- [ ] Domain `helios-energy.de` registrieren
- [ ] Mailgun/Microsoft 365 Account erstellen
- [ ] DNS-Provider konfigurieren
- [ ] SSL-Zertifikate beantragen

### **6.2 E-Mail-Setup (Woche 2)**
- [ ] Mailgun Domain verifizieren
- [ ] DKIM/SPF/DMARC Records setzen
- [ ] Test-E-Mails senden
- [ ] Spam-Score testen (mail-tester.com)
- [ ] Firebase Functions aktualisieren

### **6.3 Code-Migration (Woche 3)**
- [ ] Automatische Domain-Ersetzung
- [ ] GitHub Repository migrieren
- [ ] GitHub Pages konfigurieren
- [ ] Employee-Seiten aktualisieren
- [ ] Alle Links und Referenzen prüfen

### **6.4 DNS-Umstellung (Woche 4)**
- [ ] DNS-Records live schalten
- [ ] 24h Propagation warten
- [ ] Alle Services testen
- [ ] Backup-Plan aktivieren
- [ ] Monitoring einrichten

### **6.5 Cleanup (Woche 5)**
- [ ] Alte Firebase-Projekt deaktivieren
- [ ] IONOS E-Mail-Accounts kündigen
- [ ] Alte GitHub-Repository archivieren
- [ ] Team über neue Adressen informieren
- [ ] Dokumentation aktualisieren

---

## 💰 **Kostenschätzung**

```yaml
Domain: helios-energy.de         ~15€/Jahr
Microsoft 365 Business          ~72€/Jahr (1 User)
Mailgun Pro                     ~300€/Jahr (10k Mails/Monat)
Firebase Hosting                 Kostenlos
GitHub Pages                     Kostenlos
DNS (Cloudflare)                 Kostenlos

TOTAL: ~387€/Jahr (~32€/Monat)
```

**Alternative (Budget):**
```yaml
Domain: helios-energy.de         ~15€/Jahr
Gmail Business                   ~72€/Jahr
SendGrid Essentials             ~180€/Jahr
Firebase Hosting                 Kostenlos

TOTAL: ~267€/Jahr (~22€/Monat)
```

---

## 🚀 **Empfohlener Fahrplan**

### **Sofort starten:**
1. **Domain registrieren**: `helios-energy.de`
2. **Mailgun Account**: Für Newsletter-System
3. **GitHub Repository**: `helios-energy` erstellen

### **Diese Woche:**
1. DNS-Records vorbereiten
2. E-Mail-Accounts einrichten
3. Code-Migration planen

### **Nächste Woche:**
1. Firebase Functions auf Mailgun umstellen
2. Komplette Domain-Migration durchführen
3. GitHub Pages live schalten

---

## ⚠️ **Wichtige Überlegungen**

### **E-Mail-Deliverability Faktoren:**
- **Domain-Reputation**: Neue Domain braucht "Warming"
- **IP-Reputation**: Shared IPs vs. Dedicated IPs
- **Content-Quality**: Spam-Filter-optimierte E-Mails
- **Engagement-Rate**: Öffnungsraten verbessern
- **Authentication**: SPF/DKIM/DMARC korrekt

### **Backup-Plan:**
- Alte buderus-systeme.de 6 Monate parallel laufen lassen
- Redirects von alter zu neuer Domain
- E-Mail-Forwarding einrichten
- Monitoring für alle Services

---

**🎯 Welche Phase sollen wir zuerst angehen? Domain-Registrierung oder E-Mail-Server Setup?**
