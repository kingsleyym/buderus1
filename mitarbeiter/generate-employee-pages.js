const fs = require('fs');
const path = require('path');

// Template für die Mitarbeiter-HTML-Seite
const htmlTemplate = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{name}} - {{title}} | Buderus Systeme</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="employee-directory.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <!-- Hintergrund mit Verlauf -->
        <div class="background"></div>
        
        <!-- Schwarzer Container -->
        <div class="header-container">
            <!-- Think Text oben links -->
            <div class="think-text">
                Think intelligent.<br>
                Think blue.
            </div>
            
            <!-- Logo oben rechts -->
            <div class="logo">
                <img src="../assets/logo.png" alt="Logo">
            </div>
        </div>
        
        <!-- Hauptinhalt -->
        <div class="content">
            <!-- Profilbild -->
            <div class="profile-avatar">
                <img src="../assets/avatars/{{id}}.png" alt="Profilbild von {{name}}">
            </div>
            
            <!-- Name -->
            <h1 class="name">{{name}}</h1>
            
            <!-- Jobbeschreibung -->
            <p class="job-description">{{title}}</p>
            
            <!-- Zwei kleinere Buttons -->
            <div class="button-row">
                <button class="secondary-button phone-button" onclick="makeCall()">
                    <img src="../assets/phone-call-icon.png" alt="Anrufen" class="button-icon">
                    Anrufen
                </button>
                <button class="secondary-button email-button" onclick="sendEmail()">
                    <img src="../assets/mail-filled.png" alt="E-Mail" class="button-icon">
                    E-Mail
                </button>
            </div>
            
            <!-- Hauptbutton -->
            <button class="main-button" onclick="saveContact()">Kontakt speichern</button>
            
            <!-- QR Code unten mittig -->
            <div class="qr-code">
                <img src="../assets/qr.png" alt="QR Code">
            </div>
        </div>
    </div>

    <script>
        // Kontaktdaten für {{name}}
        const employeeData = {
            name: "{{name}}",
            title: "{{title}}",
            phone: "{{phone}}",
            email: "{{email}}",
            company: "{{company}}",
            website: "{{website}}"
        };

        // Kontakt speichern
        function saveContact() {
            const vCardData = \`BEGIN:VCARD
VERSION:3.0
FN:\${employeeData.name}
N:\${employeeData.name.split(' ').reverse().join(';')};;;
ORG:\${employeeData.company}
TITLE:\${employeeData.title}
TEL;TYPE=CELL:\${employeeData.phone}
EMAIL;TYPE=INTERNET:\${employeeData.email}
URL:\${employeeData.website}
END:VCARD\`;

            const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = \`\${employeeData.name.replace(/\\s+/g, '_')}.vcf\`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        }

        // Telefon anrufen
        function makeCall() {
            window.location.href = \`tel:\${employeeData.phone}\`;
        }

        // E-Mail senden
        function sendEmail() {
            window.location.href = \`mailto:\${employeeData.email}?subject=Kontakt%20von%20Website\`;
        }
    </script>
</body>
</html>`;

// Funktion zum Ersetzen von Platzhaltern
function replacePlaceholders(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] || match;
    });
}

// Hauptfunktion
function generateEmployeePages() {
    try {
        // Arbeitsverzeichnis setzen
        const workDir = '/Users/lucaschweiger/Documents/Clients/Website';
        process.chdir(workDir);

        // Mitarbeiterdaten laden
        const employeesData = JSON.parse(fs.readFileSync('employees.json', 'utf8'));

        console.log('🔄 Generiere individuelle Mitarbeiter-Seiten...');

        employeesData.forEach(employee => {
            // HTML für diesen Mitarbeiter generieren
            const htmlContent = replacePlaceholders(htmlTemplate, employee);

            // Dateiname erstellen
            const fileName = `${employee.id}.html`;

            // Datei schreiben
            fs.writeFileSync(fileName, htmlContent, 'utf8');
            console.log(`✅ ${fileName} erfolgreich erstellt`);
        });

        console.log('🎉 Alle Mitarbeiter-Seiten wurden erfolgreich generiert!');
        console.log('\n📝 Nächste Schritte:');
        console.log('1. Aktualisiere die index.html um direkt auf die individuellen HTML-Dateien zu verlinken');
        console.log('2. Stelle sicher, dass alle Avatar-Bilder in ../assets/avatars/ vorhanden sind');
        console.log('3. Committe und pushe alle Änderungen zu GitHub Pages');

    } catch (error) {
        console.error('❌ Fehler beim Generieren der Mitarbeiter-Seiten:', error.message);
    }
}

// Skript ausführen
generateEmployeePages();
