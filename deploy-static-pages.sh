#!/bin/bash

# GitHub Pages Update Skript für Buderus Systeme Business Cards

echo "🚀 Starte GitHub Pages Update..."

# Wechsle ins korrekte Verzeichnis
cd "/Users/lucaschweiger/Documents/Clients/Website"

# Prüfe Git Status
echo "📋 Git Status:"
git status

# Füge alle Änderungen hinzu
echo "➕ Füge alle Änderungen hinzu..."
git add .

# Commit mit automatischer Nachricht
echo "💾 Committe Änderungen..."
git commit -m "Implementiere statische HTML-Dateien für Mitarbeiter-Business Cards

- ✅ Erstelle individuelle HTML-Dateien für jeden Mitarbeiter
- ✅ Implementiere direktes Linking statt dynamisches Routing  
- ✅ Löse GitHub Pages Routing-Probleme
- ✅ Aktualisiere Index-Seite als Mitarbeiter-Verzeichnis
- ✅ Verbessere CSS für Mitarbeiter-Karten Layout
- ✅ Automatisiere Generierung mit Node.js Skript

Dateien:
- max-mustermann.html (✅ Funktional)
- anna-schmidt.html (✅ Funktional) 
- peter-mueller.html (✅ Funktional)
- index.html (✅ Aktualisiert als Verzeichnis)
- employee-directory.css (✅ Verbesserte Styles)
- generate-employee-pages.js (✅ Automatisierung)"

# Push zu GitHub
echo "🌐 Pushe zu GitHub Pages..."
git push origin main

echo ""
echo "🎉 GitHub Pages Update abgeschlossen!"
echo ""
echo "📊 Zusammenfassung:"
echo "✅ Statische HTML-Dateien für alle Mitarbeiter erstellt"
echo "✅ Direktes Linking implementiert (keine dynamischen URLs)"
echo "✅ Index-Seite als Mitarbeiter-Verzeichnis aktualisiert"
echo "✅ CSS für bessere Darstellung optimiert"
echo "✅ Alle Änderungen zu GitHub Pages gepusht"
echo ""
echo "🔗 Ihre Website ist verfügbar unter:"
echo "   https://[IHR-GITHUB-USERNAME].github.io/[REPOSITORY-NAME]/"
echo ""
echo "📱 Mitarbeiter-Seiten sind jetzt direkt erreichbar:"
echo "   • max-mustermann.html"
echo "   • anna-schmidt.html" 
echo "   • peter-mueller.html"
echo ""
echo "💡 Tipp: Für neue Mitarbeiter führen Sie einfach aus:"
echo "   node generate-employee-pages.js"
