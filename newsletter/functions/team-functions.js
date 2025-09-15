// Team-System Functions für 1:1 GitHub Pages Ersatz

const admin = require('firebase-admin');
const functions = require('firebase-functions');

/**
 * Team-Übersicht rendern (ersetzt /mitarbeiter/index.html)
 * URL: helios-energy.web.app/team
 */
exports.renderTeamList = functions.https.onRequest(async (req, res) => {
  try {
    // Employee-Daten aus Firestore laden (nur genehmigte)
    const employeesSnapshot = await admin.firestore()
      .collection('employees')
      .where('approved', '==', true)
      .where('status', '==', 'active')
      .orderBy('lastName')
      .get();
    
    const employees = [];
    employeesSnapshot.forEach(doc => {
      const data = doc.data();
      employees.push({
        id: doc.id,
        ...data,
        // URL-freundlicher Slug generieren
        slug: `${data.firstName.toLowerCase()}-${data.lastName.toLowerCase()}`
      });
    });

    // HTML generieren (1:1 wie deine aktuelle mitarbeiter/index.html)
    const html = generateTeamOverviewHTML(employees);
    
    // Cache für 5 Minuten
    res.set('Cache-Control', 'public, max-age=300');
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
    
  } catch (error) {
    console.error('❌ Team-Liste Fehler:', error);
    res.status(500).send(generateErrorHTML('Team-Liste konnte nicht geladen werden'));
  }
});

/**
 * Individual Employee-Seite rendern (ersetzt /mitarbeiter/[name].html)  
 * URL: helios-energy.web.app/team/max-mustermann
 */
exports.renderEmployee = functions.https.onRequest(async (req, res) => {
  try {
    // Employee-Name aus URL extrahieren
    const pathParts = req.path.split('/');
    const employeeSlug = pathParts[pathParts.length - 1]; // letzter Teil der URL
    
    console.log('🔍 Suche Employee mit Slug:', employeeSlug);
    
    // Employee-Daten aus Firestore laden
    const employeesSnapshot = await admin.firestore()
      .collection('employees')
      .where('approved', '==', true)
      .where('status', '==', 'active')
      .get();
    
    let employee = null;
    employeesSnapshot.forEach(doc => {
      const data = doc.data();
      const slug = `${data.firstName.toLowerCase()}-${data.lastName.toLowerCase()}`;
      if (slug === employeeSlug) {
        employee = {
          id: doc.id,
          ...data,
          slug: slug
        };
      }
    });
    
    if (!employee) {
      console.log('❌ Employee nicht gefunden:', employeeSlug);
      res.status(404).send(generateNotFoundHTML(employeeSlug));
      return;
    }
    
    console.log('✅ Employee gefunden:', employee.firstName, employee.lastName);
    
    // Individual HTML generieren (1:1 wie aktuelle Employee-Seiten)
    const html = generateEmployeeCardHTML(employee);
    
    // Cache für 10 Minuten  
    res.set('Cache-Control', 'public, max-age=600');
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
    
  } catch (error) {
    console.error('❌ Employee-Seite Fehler:', error);
    res.status(500).send(generateErrorHTML('Mitarbeiter-Seite konnte nicht geladen werden'));
  }
});

/**
 * vCard Download API
 * URL: helios-energy.web.app/api/vcard/max-mustermann
 */
exports.generateVCard = functions.https.onRequest(async (req, res) => {
  try {
    const pathParts = req.path.split('/');
    const employeeSlug = pathParts[pathParts.length - 1];
    
    // Employee finden
    const employeesSnapshot = await admin.firestore()
      .collection('employees')
      .where('approved', '==', true)
      .get();
    
    let employee = null;
    employeesSnapshot.forEach(doc => {
      const data = doc.data();
      const slug = `${data.firstName.toLowerCase()}-${data.lastName.toLowerCase()}`;
      if (slug === employeeSlug) {
        employee = { id: doc.id, ...data };
      }
    });
    
    if (!employee) {
      res.status(404).send('Mitarbeiter nicht gefunden');
      return;
    }
    
    // vCard generieren
    const vCard = generateVCardContent(employee);
    
    // Als Download senden
    res.set('Content-Type', 'text/vcard; charset=utf-8');
    res.set('Content-Disposition', `attachment; filename="${employee.firstName}-${employee.lastName}.vcf"`);
    res.send(vCard);
    
  } catch (error) {
    console.error('❌ vCard Fehler:', error);
    res.status(500).send('vCard konnte nicht generiert werden');
  }
});

/**
 * Avatar-API für Employee-Bilder
 * URL: helios-energy.web.app/api/avatar/employee-id
 */
exports.getEmployeeAvatar = functions.https.onRequest(async (req, res) => {
  try {
    const pathParts = req.path.split('/');
    const employeeId = pathParts[pathParts.length - 1];
    
    // Employee-Daten laden
    const employeeDoc = await admin.firestore()
      .collection('employees')
      .doc(employeeId)
      .get();
    
    if (!employeeDoc.exists) {
      // Fallback zu Default-Avatar
      res.redirect('/assets/avatar.png');
      return;
    }
    
    const employee = employeeDoc.data();
    
    if (employee.avatar) {
      // Base64 Avatar dekodieren und senden
      const avatarData = employee.avatar.replace(/^data:image\/[a-z]+;base64,/, '');
      const imageBuffer = Buffer.from(avatarData, 'base64');
      
      res.set('Content-Type', 'image/png');
      res.set('Cache-Control', 'public, max-age=3600'); // 1h cache
      res.send(imageBuffer);
    } else {
      // Fallback zu Default-Avatar
      res.redirect('/assets/avatar.png');
    }
    
  } catch (error) {
    console.error('❌ Avatar Fehler:', error);
    res.redirect('/assets/avatar.png');
  }
});

// HTML-Template-Funktionen
function generateTeamOverviewHTML(employees) {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unser Team | Helios Energy</title>
    <meta name="theme-color" content="#181A23">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="msapplication-navbutton-color" content="#181A23">
    <meta name="apple-mobile-web-app-capable" content="yes">
    
    <!-- SEO Meta-Tags -->
    <meta name="description" content="Lernen Sie unser kompetentes Team bei Helios Energy kennen. Erfahrene Berater für moderne Heiztechnik und Energielösungen.">
    <meta name="keywords" content="Helios Energy Team, Heiztechnik Berater, Energieberatung, Fachberater">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Unser Team | Helios Energy">
    <meta property="og:description" content="Lernen Sie unser kompetentes Team bei Helios Energy kennen.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://helios-energy.web.app/team">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/assets/favicon-ico-data.ico">
    <link rel="apple-touch-icon" href="/assets/apple-touch-icon-png-data.png">
    
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/mitarbeiter/employee-directory.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Helios Energy",
      "url": "https://helios-energy.web.app",
      "employee": [
        ${employees.map(emp => `{
          "@type": "Person",
          "name": "${emp.firstName} ${emp.lastName}",
          "jobTitle": "${emp.position}",
          "email": "${emp.email}",
          "telephone": "${emp.phone}"
        }`).join(',')}
      ]
    }
    </script>
</head>
<body>
    <div class="container">
        <!-- Hintergrund mit Verlauf -->
        <div class="background"></div>
        
        <!-- Header Container -->
        <div class="header-container">
            <div class="think-text">
                Think intelligent.<br>
                Think blue.
            </div>
            
            <div class="logo">
                <img src="/assets/logo.png" alt="Helios Energy Logo">
            </div>
        </div>
        
        <!-- Team-Inhalt -->
        <div class="content">
            <h1>Unser Team</h1>
            <p class="team-intro">Lernen Sie unsere kompetenten Berater für moderne Heiztechnik kennen.</p>
            
            <div class="employee-grid">
                ${employees.map(employee => `
                <div class="employee-card">
                    <a href="/team/${employee.slug}" class="employee-link">
                        <div class="employee-avatar">
                            <img src="/api/avatar/${employee.id}" alt="Profilbild von ${employee.firstName} ${employee.lastName}">
                        </div>
                        <div class="employee-info">
                            <h3>${employee.firstName} ${employee.lastName}</h3>
                            <p class="position">${employee.position}</p>
                            <div class="contact-info">
                                <p>📧 ${employee.email}</p>
                                <p>📞 ${employee.phone}</p>
                            </div>
                        </div>
                    </a>
                </div>
                `).join('')}
            </div>
            
            <div class="team-footer">
                <a href="/" class="back-button">← Zurück zur Startseite</a>
            </div>
        </div>
    </div>
    
    <!-- Analytics -->
    <script>
        // Team-Seite View tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: 'Team Übersicht',
                page_location: window.location.href
            });
        }
    </script>
</body>
</html>`;
}

function generateEmployeeCardHTML(employee) {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${employee.firstName} ${employee.lastName} - ${employee.position} | Helios Energy</title>
    <meta name="theme-color" content="#181A23">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="msapplication-navbutton-color" content="#181A23">
    <meta name="apple-mobile-web-app-capable" content="yes">
    
    <!-- SEO Meta-Tags -->
    <meta name="description" content="${employee.bio || `${employee.firstName} ${employee.lastName} - ${employee.position} bei Helios Energy. Kontaktieren Sie unseren Experten für Heiztechnik und Energielösungen.`}">
    <meta name="keywords" content="Helios Energy, ${employee.firstName} ${employee.lastName}, ${employee.position}, Heiztechnik, Energieberatung">
    
    <!-- Open Graph (Social Media Sharing) -->
    <meta property="og:title" content="${employee.firstName} ${employee.lastName} - ${employee.position}">
    <meta property="og:description" content="${employee.bio || `${employee.position} bei Helios Energy`}">
    <meta property="og:image" content="https://helios-energy.web.app/api/avatar/${employee.id}">
    <meta property="og:url" content="https://helios-energy.web.app/team/${employee.slug}">
    <meta property="og:type" content="profile">
    
    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${employee.firstName} ${employee.lastName}">
    <meta name="twitter:description" content="${employee.position} bei Helios Energy">
    <meta name="twitter:image" content="https://helios-energy.web.app/api/avatar/${employee.id}">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/assets/favicon-ico-data.ico">
    <link rel="apple-touch-icon" href="/assets/apple-touch-icon-png-data.png">
    
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/mitarbeiter/employee-directory.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Structured Data (Schema.org) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "${employee.firstName} ${employee.lastName}",
      "jobTitle": "${employee.position}",
      "worksFor": {
        "@type": "Organization",
        "name": "Helios Energy",
        "url": "https://helios-energy.web.app"
      },
      "email": "${employee.email}",
      "telephone": "${employee.phone}",
      "url": "https://helios-energy.web.app/team/${employee.slug}",
      "image": "https://helios-energy.web.app/api/avatar/${employee.id}"
    }
    </script>
</head>
<body>
    <div class="container">
        <!-- Hintergrund mit Verlauf -->
        <div class="background"></div>
        
        <!-- Header Container -->
        <div class="header-container">
            <div class="think-text">
                Think intelligent.<br>
                Think blue.
            </div>
            
            <div class="logo">
                <img src="/assets/logo.png" alt="Helios Energy Logo">
            </div>
        </div>
        
        <!-- Employee-Profil -->
        <div class="content">
            <!-- Profilbild -->
            <div class="profile-avatar">
                <img src="/api/avatar/${employee.id}" alt="Profilbild von ${employee.firstName} ${employee.lastName}">
            </div>
            
            <!-- Name und Position -->
            <div class="profile-info">
                <h1>${employee.firstName} ${employee.lastName}</h1>
                <h2>${employee.position}</h2>
            </div>
            
            <!-- Kontakt-Informationen -->
            <div class="contact-section">
                <div class="contact-item">
                    <span class="contact-icon">📧</span>
                    <span class="contact-label">E-Mail:</span>
                    <a href="mailto:${employee.email}" class="contact-value">${employee.email}</a>
                </div>
                
                <div class="contact-item">
                    <span class="contact-icon">📞</span>
                    <span class="contact-label">Telefon:</span>
                    <a href="tel:${employee.phone}" class="contact-value">${employee.phone}</a>
                </div>
                
                <div class="contact-item">
                    <span class="contact-icon">🌐</span>
                    <span class="contact-label">Unternehmen:</span>
                    <span class="contact-value">Helios Energy</span>
                </div>
            </div>
            
            ${employee.bio ? `
            <div class="bio-section">
                <h3>Über mich</h3>
                <p>${employee.bio}</p>
            </div>
            ` : ''}
            
            <!-- Action-Buttons -->
            <div class="actions">
                <a href="mailto:${employee.email}" class="btn btn-primary">
                    📧 E-Mail senden
                </a>
                
                <a href="tel:${employee.phone}" class="btn btn-secondary">
                    📞 Anrufen
                </a>
                
                <a href="/api/vcard/${employee.slug}" class="btn btn-outline" download="${employee.firstName}-${employee.lastName}.vcf">
                    📇 Kontakt speichern
                </a>
            </div>
            
            <!-- QR-Code für einfaches Teilen -->
            <div class="qr-section">
                <h4>Profil teilen</h4>
                <div id="qr-code"></div>
                <p>QR-Code scannen zum Teilen des Profils</p>
            </div>
            
            <!-- Navigation -->
            <div class="navigation">
                <a href="/team" class="back-button">← Zurück zum Team</a>
                <a href="/" class="home-button">🏠 Startseite</a>
            </div>
            
            <!-- Social Sharing -->
            <div class="social-sharing">
                <h4>Profil teilen</h4>
                <div class="social-buttons">
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://helios-energy.web.app/team/${employee.slug}" target="_blank" class="social-btn linkedin">
                        LinkedIn
                    </a>
                    <a href="https://twitter.com/intent/tweet?text=${employee.firstName} ${employee.lastName} - ${employee.position} bei Helios Energy&url=https://helios-energy.web.app/team/${employee.slug}" target="_blank" class="social-btn twitter">
                        Twitter
                    </a>
                    <a href="mailto:?subject=${employee.firstName} ${employee.lastName} - Helios Energy&body=Schauen Sie sich das Profil von ${employee.firstName} ${employee.lastName} an: https://helios-energy.web.app/team/${employee.slug}" class="social-btn email">
                        E-Mail
                    </a>
                </div>
            </div>
        </div>
    </div>
    
    <!-- QR-Code JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
    <script>
        // QR-Code für aktuelles Profil generieren
        const currentUrl = window.location.href;
        QRCode.toCanvas(document.getElementById('qr-code'), currentUrl, {
            width: 200,
            margin: 2,
            color: {
                dark: '#181A23',
                light: '#FFFFFF'
            }
        });
        
        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: '${employee.firstName} ${employee.lastName} - Profil',
                page_location: currentUrl,
                custom_parameters: {
                    employee_id: '${employee.id}',
                    employee_name: '${employee.firstName} ${employee.lastName}',
                    employee_position: '${employee.position}'
                }
            });
        }
        
        // Kontakt-Button Tracking
        document.querySelector('a[href^="mailto:"]').addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'contact_email', {
                    employee_id: '${employee.id}',
                    employee_name: '${employee.firstName} ${employee.lastName}'
                });
            }
        });
        
        document.querySelector('a[href^="tel:"]').addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'contact_phone', {
                    employee_id: '${employee.id}',
                    employee_name: '${employee.firstName} ${employee.lastName}'
                });
            }
        });
        
        document.querySelector('a[href^="/api/vcard/"]').addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'download_vcard', {
                    employee_id: '${employee.id}',
                    employee_name: '${employee.firstName} ${employee.lastName}'
                });
            }
        });
    </script>
</body>
</html>`;
}

function generateVCardContent(employee) {
  return `BEGIN:VCARD
VERSION:3.0
FN:${employee.firstName} ${employee.lastName}
N:${employee.lastName};${employee.firstName};;;
ORG:Helios Energy
TITLE:${employee.position}
EMAIL;TYPE=WORK:${employee.email}
TEL;TYPE=WORK,VOICE:${employee.phone}
URL:https://helios-energy.web.app/team/${employee.firstName.toLowerCase()}-${employee.lastName.toLowerCase()}
NOTE:${employee.bio || `${employee.position} bei Helios Energy`}
REV:${new Date().toISOString()}
END:VCARD`;
}

function generateErrorHTML(message) {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fehler | Helios Energy</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <div class="container">
        <div class="error-message">
            <h1>⚠️ Fehler</h1>
            <p>${message}</p>
            <a href="/team" class="btn">← Zurück zum Team</a>
        </div>
    </div>
</body>
</html>`;
}

function generateNotFoundHTML(slug) {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mitarbeiter nicht gefunden | Helios Energy</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <div class="container">
        <div class="error-message">
            <h1>👤 Mitarbeiter nicht gefunden</h1>
            <p>Der gesuchte Mitarbeiter "${slug}" konnte nicht gefunden werden.</p>
            <a href="/team" class="btn">← Zurück zum Team</a>
        </div>
    </div>
</body>
</html>`;
}
