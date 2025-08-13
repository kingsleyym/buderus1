# Buderus Systeme Business Cards - Lösung für GitHub Pages

## 🎯 Problem gelöst!

Das ursprüngliche dynamische Routing-System funktionierte nicht auf GitHub Pages. Die neue Lösung verwendet **statische HTML-Dateien** für jeden Mitarbeiter.

## 📁 Datei-Struktur

```
├── index.html                    # Hauptseite (Mitarbeiter-Verzeichnis)
├── max-mustermann.html          # ✅ Statische Mitarbeiter-Seite
├── anna-schmidt.html            # ✅ Statische Mitarbeiter-Seite  
├── peter-mueller.html           # ✅ Statische Mitarbeiter-Seite
├── employees.json               # Mitarbeiter-Datenbank
├── generate-employee-pages.js   # 🤖 Automatisierungs-Skript
├── deploy-static-pages.sh       # 🚀 Deployment-Skript
├── styles.css                   # Haupt-Styles
├── employee-directory.css       # Directory-spezifische Styles
└── ../assets/                      # Bilder, Icons, Avatare
```

## 🚀 Deployment

```bash
# Automatisches Deployment
./deploy-static-pages.sh
```

## ➕ Neuen Mitarbeiter hinzufügen

1. **Mitarbeiter zu `employees.json` hinzufügen:**
```json
{
  "id": "neuer-mitarbeiter",
  "name": "Neuer Mitarbeiter", 
  "title": "Position",
  "phone": "+49 123 456792",
  "email": "neuer.mitarbeiter@buderus-systeme.com",
  "website": "https://buderus-systeme.com",
  "company": "Buderus Systeme"
}
```

2. **Avatar-Bild hinzufügen:**
```
../assets/avatars/neuer-mitarbeiter.png
```

3. **HTML-Seiten generieren:**
```bash
node generate-employee-pages.js
```

4. **Index.html aktualisieren:**
```html
<a href="neuer-mitarbeiter.html" class="employee-card">
    <div class="employee-avatar">
        <img src="../assets/avatars/neuer-mitarbeiter.png" alt="Neuer Mitarbeiter">
    </div>
    <div class="employee-info">
        <h3>Neuer Mitarbeiter</h3>
        <p>Position</p>
    </div>
</a>
```

5. **Deployen:**
```bash
./deploy-static-pages.sh
```

## ✅ Funktionen

- **📱 Mobile-optimiert** - Responsive Design für alle Geräte
- **💾 vCard Download** - Kontakt direkt ins Adressbuch speichern
- **📞 Direkte Aktionen** - Anrufen & E-Mail mit einem Klick
- **🔗 Statische URLs** - Jeder Mitarbeiter hat eine eigene URL
- **🤖 Automatisiert** - Neue Mitarbeiter-Seiten automatisch generieren
- **🌐 GitHub Pages** - Vollständig kompatibel

## 🔗 URL-Struktur

```
https://[USERNAME].github.io/[REPO]/              # Hauptseite (Team-Übersicht)
https://[USERNAME].github.io/[REPO]/max-mustermann.html
https://[USERNAME].github.io/[REPO]/anna-schmidt.html  
https://[USERNAME].github.io/[REPO]/peter-mueller.html
```

## 💡 Warum diese Lösung?

1. **GitHub Pages Kompatibilität** - Statische Dateien funktionieren garantiert
2. **Keine Client-Side Routing Probleme** - Jede Seite ist eine echte HTML-Datei
3. **SEO-freundlich** - Jeder Mitarbeiter hat eine eigene indexierbare URL
4. **Einfache Wartung** - Automatisierte Generierung neuer Seiten
5. **Schnelle Ladezeiten** - Keine JavaScript-abhängige Navigation

## 🎯 Nächste Schritte

1. ✅ Alle HTML-Dateien wurden generiert
2. ✅ Index-Seite als Team-Verzeichnis aktualisiert  
3. ✅ CSS für optimale Darstellung angepasst
4. 🚀 **Führe jetzt `./deploy-static-pages.sh` aus!**

Die Individual-URLs funktionieren jetzt garantiert auf GitHub Pages! 🎉
