# 🚀 Eigener Mail-Server: Multi-Domain Docker Setup

## 💡 **Projekt-Konzept: "Mail-Server-as-a-Service"**

### **🎯 Ziel:**
- **Eigener VPS**: ~5€/Monat (Hetzner Cloud)
- **Unbegrenzte Domains**: helios-energy.de, future-projects.de, etc.
- **Docker-basiert**: Einfache Verwaltung & Updates
- **Anti-Spam optimiert**: Hohe Deliverability
- **API-Integration**: Firebase Functions Support
- **Webmail**: Moderne Web-Oberfläche

---

## 🖥️ **Server-Spezifikationen**

### **Empfohlener VPS (Hetzner Cloud):**
```yaml
Server: CPX11 (Shared vCPU)
RAM: 2 GB
Storage: 40 GB SSD
Traffic: 20 TB
IPv4: 1x inklusive
IPv6: inklusive
Kosten: 4.15€/Monat
Location: Falkenstein (Deutschland)
```

### **Alternative Provider:**
```yaml
DigitalOcean: Droplet Basic (5€/Monat)
Linode: Nanode 1GB (5€/Monat)
Vultr: Regular Performance (5€/Monat)
```

---

## 🐳 **Docker-Stack Architecture**

### **Container-Setup:**
```yaml
services:
  # Mail-Server Core
  postfix:          # SMTP Server (Outgoing)
  dovecot:          # IMAP/POP3 (Incoming)
  rspamd:           # Anti-Spam/DKIM
  
  # Web-Interface
  roundcube:        # Webmail Client
  postfixadmin:     # Domain/User Management
  
  # Proxy & SSL
  nginx:            # Reverse Proxy
  certbot:          # Let's Encrypt SSL
  
  # Database
  mysql:            # User/Domain Storage
  redis:            # Caching
  
  # Monitoring
  fail2ban:         # Intrusion Prevention
  netdata:          # Server Monitoring
```

---

## 📁 **Neues VS Code Projekt Setup**

### **Projekt-Struktur:**
```
mail-server-docker/
├── docker-compose.yml
├── .env
├── README.md
├── scripts/
│   ├── setup.sh
│   ├── add-domain.sh
│   ├── add-user.sh
│   └── backup.sh
├── config/
│   ├── postfix/
│   ├── dovecot/
│   ├── rspamd/
│   ├── nginx/
│   └── roundcube/
├── ssl/
│   └── certs/
├── data/
│   ├── mysql/
│   ├── mail/
│   └── logs/
└── api/
    ├── server.js
    ├── routes/
    └── package.json
```

---

## 🔧 **Docker Compose Configuration**

### **docker-compose.yml (Basis):**
```yaml
version: '3.8'

services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: mail_mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: mailserver
    volumes:
      - ./data/mysql:/var/lib/mysql
      - ./config/mysql/init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: mail_redis
    restart: unless-stopped

  # Postfix SMTP
  postfix:
    image: postfix:latest
    container_name: mail_postfix
    environment:
      MYSQL_HOST: mysql
      MYSQL_DB: mailserver
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - ./config/postfix:/etc/postfix
      - ./data/mail:/var/mail
      - ./ssl/certs:/etc/ssl/certs
    ports:
      - "25:25"     # SMTP
      - "587:587"   # Submission
    depends_on:
      - mysql
    restart: unless-stopped

  # Dovecot IMAP/POP3
  dovecot:
    image: dovecot:latest
    container_name: mail_dovecot
    environment:
      MYSQL_HOST: mysql
      MYSQL_DB: mailserver
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - ./config/dovecot:/etc/dovecot
      - ./data/mail:/var/mail
      - ./ssl/certs:/etc/ssl/certs
    ports:
      - "143:143"   # IMAP
      - "993:993"   # IMAPS
      - "110:110"   # POP3
      - "995:995"   # POP3S
    depends_on:
      - mysql
    restart: unless-stopped

  # Rspamd Anti-Spam
  rspamd:
    image: rspamd/rspamd:latest
    container_name: mail_rspamd
    volumes:
      - ./config/rspamd:/etc/rspamd
      - ./data/rspamd:/var/lib/rspamd
    ports:
      - "11334:11334"
    restart: unless-stopped

  # Roundcube Webmail
  roundcube:
    image: roundcube/roundcubemail:latest
    container_name: mail_roundcube
    environment:
      ROUNDCUBEMAIL_DB_TYPE: mysql
      ROUNDCUBEMAIL_DB_HOST: mysql
      ROUNDCUBEMAIL_DB_NAME: roundcubemail
      ROUNDCUBEMAIL_DB_USER: ${MYSQL_USER}
      ROUNDCUBEMAIL_DB_PASSWORD: ${MYSQL_PASSWORD}
      ROUNDCUBEMAIL_DEFAULT_HOST: ssl://dovecot
      ROUNDCUBEMAIL_SMTP_SERVER: tls://postfix
    volumes:
      - ./config/roundcube:/var/roundcube/config
    depends_on:
      - mysql
      - dovecot
      - postfix
    restart: unless-stopped

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: mail_nginx
    volumes:
      - ./config/nginx:/etc/nginx/conf.d
      - ./ssl/certs:/etc/ssl/certs
      - ./ssl/private:/etc/ssl/private
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - roundcube
    restart: unless-stopped

  # Mail API Server
  mail-api:
    build: ./api
    container_name: mail_api
    environment:
      SMTP_HOST: postfix
      SMTP_PORT: 587
      MYSQL_HOST: mysql
      MYSQL_DB: mailserver
      API_KEY: ${API_KEY}
    ports:
      - "3000:3000"
    depends_on:
      - postfix
      - mysql
    restart: unless-stopped
```

---

## 🔑 **Multi-Domain Management**

### **Domain-Konfiguration:**
```sql
-- MySQL Schema für Multi-Domain
CREATE TABLE domains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain VARCHAR(255) UNIQUE NOT NULL,
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    domain_id INT,
    active TINYINT(1) DEFAULT 1,
    quota BIGINT DEFAULT 1073741824, -- 1GB
    FOREIGN KEY (domain_id) REFERENCES domains(id)
);

CREATE TABLE aliases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    domain_id INT,
    active TINYINT(1) DEFAULT 1,
    FOREIGN KEY (domain_id) REFERENCES domains(id)
);
```

### **Domain-Management Scripts:**
```bash
#!/bin/bash
# scripts/add-domain.sh

DOMAIN=$1
if [ -z "$DOMAIN" ]; then
    echo "Usage: ./add-domain.sh example.com"
    exit 1
fi

# Add to MySQL
docker exec mail_mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} mailserver \
  -e "INSERT INTO domains (domain) VALUES ('$DOMAIN');"

# Generate DKIM Key
docker exec mail_rspamd rspamadm dkim_keygen \
  -b 2048 -s mail -d $DOMAIN > ./ssl/dkim/${DOMAIN}.key

# Restart services
docker-compose restart postfix dovecot rspamd

echo "✅ Domain $DOMAIN hinzugefügt!"
echo "📋 DNS Records:"
echo "MX    @    10 mail.${DOMAIN}"
echo "TXT   @    v=spf1 mx a ip4:$(curl -s ifconfig.me) ~all"
echo "TXT   mail._domainkey    $(cat ./ssl/dkim/${DOMAIN}.key)"
```

---

## 🌐 **API für Firebase Integration**

### **Mail API Server (Node.js):**
```javascript
// api/server.js
const express = require('express');
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

// SMTP Transporter
const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

// Send Email Endpoint
app.post('/api/send-email', async (req, res) => {
    const { from, to, subject, html, domain } = req.body;
    
    // Verify API Key
    if (req.headers['x-api-key'] !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        const mailOptions = {
            from: `${from}@${domain}`,
            to: to,
            subject: subject,
            html: html,
            headers: {
                'List-Unsubscribe': `<mailto:unsubscribe@${domain}>`
            }
        };
        
        const result = await transporter.sendMail(mailOptions);
        res.json({ success: true, messageId: result.messageId });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add Domain Endpoint
app.post('/api/add-domain', async (req, res) => {
    // Domain management logic
});

app.listen(3000, () => {
    console.log('📧 Mail API Server läuft auf Port 3000');
});
```

---

## 💰 **Kostenvergleich**

### **Eigener Server:**
```yaml
Hetzner VPS CPX11:     4.15€/Monat
Domain (.de):          ~1€/Monat
SSL (Let's Encrypt):   Kostenlos
TOTAL:                 5.15€/Monat

Vorteile:
- Unbegrenzte Domains
- Unbegrenzte E-Mail-Accounts
- Volle Kontrolle
- Lernfaktor
- Wiederverwendbar für alle Projekte
```

### **vs. Managed Services:**
```yaml
Mailgun Pro:           25€/Monat (10k E-Mails)
Microsoft 365:         6€/Monat pro User
TOTAL:                 31€/Monat

Begrenzungen:
- Pro Domain/Projekt neue Kosten
- Limitierte E-Mails
- Keine Kontrolle
```

**💡 Ersparnis: 26€/Monat = 312€/Jahr!**

---

## 🚀 **Setup-Plan**

### **Phase 1: Server & Basis-Setup**
1. Hetzner Cloud Account erstellen
2. VPS bestellen (CPX11)
3. Ubuntu 22.04 LTS installieren
4. Docker & Docker Compose installieren
5. SSH-Keys & Firewall konfigurieren

### **Phase 2: Mail-Server Deployment**
1. VS Code Projekt erstellen
2. Docker Compose Setup
3. Erste Domain konfigurieren
4. SSL-Zertifikate generieren
5. DNS-Records setzen

### **Phase 3: Integration & Testing**
1. Mail API entwickeln
2. Firebase Functions anbinden
3. Anti-Spam konfigurieren
4. Deliverability testen
5. Monitoring einrichten

---

**🎯 Soll ich das neue VS Code Projekt für den Mail-Server erstellen?**

**Nächste Schritte:**
1. **Neues Workspace** für Mail-Server Setup
2. **Hetzner Account** erstellen (oder anderen VPS)
3. **Docker Compose** Configuration schreiben
4. **Setup-Scripts** für automatische Installation

**Womit fangen wir an?** 🔥
