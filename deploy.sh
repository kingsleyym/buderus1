#!/bin/bash

# GitHub Pages Deploy Script für Employee Cards
# Dieses Script automatisiert die Erstellung von Mitarbeiter-Unterseiten

echo "🚀 Deploying Employee Cards to GitHub Pages..."

# Erstelle assets/avatars Ordner falls nicht vorhanden
mkdir -p assets/avatars

# Kopiere Standard-Avatar falls Mitarbeiter-Avatar fehlt
if [ ! -f "assets/avatars/default.png" ]; then
    cp "assets/avatar.png" "assets/avatars/default.png"
fi

# Erstelle .htaccess für Apache (falls verwendet)
cat > .htaccess << 'EOF'
RewriteEngine On
RewriteBase /

# Handle employee routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^([a-zA-Z0-9\-]+)/?$ index.html [L,QSA]

# Ensure JSON files are served with correct MIME type
<Files "*.json">
    Header set Content-Type "application/json"
</Files>
EOF

# Erstelle _config.yml für Jekyll (GitHub Pages)
cat > _config.yml << 'EOF'
# GitHub Pages Configuration
title: "Buderus Systeme Team Cards"
description: "Digital Business Cards for Team Members"

# Include wichtige Dateien
include:
  - ".htaccess"
  - "*.json"

# Plugins für GitHub Pages
plugins:
  - jekyll-sitemap
  - jekyll-feed

# Sass/SCSS Konfiguration
sass:
  sass_dir: _sass
  style: compressed

# Collections (optional, für erweiterte Features)
collections:
  employees:
    output: true
    permalink: /:name/
EOF

# Erstelle robots.txt
cat > robots.txt << 'EOF'
User-agent: *
Allow: /

Sitemap: https://buderus-systeme.com/sitemap.xml
EOF

echo "✅ Deployment-Dateien erstellt!"
echo ""
echo "📋 Nächste Schritte:"
echo "1. Fügen Sie Mitarbeiter-Avatars in assets/avatars/ hinzu"
echo "2. Aktualisieren Sie employees.json mit Ihren Mitarbeiterdaten"
echo "3. Committen und pushen Sie zu GitHub"
echo "4. Aktivieren Sie GitHub Pages in den Repository-Einstellungen"
echo ""
echo "🌐 URLs werden dann verfügbar sein als:"
echo "   - https://buderus-systeme.github.io/ (Übersicht)"
echo "   - https://buderus-systeme.github.io/max-mustermann"
echo "   - https://buderus-systeme.github.io/anna-schmidt"
echo "   - etc."
