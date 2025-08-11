# 📇 Buderus Systeme Digital Business Cards

## Über dieses System

Dies ist eine **separate Visitenkarten-Anwendung** für Buderus Systeme Mitarbeiter - **NICHT die Hauptwebsite**!

### Zweck:
- Digitale Visitenkarten für alle Mitarbeiter
- Schnelle Kontaktdaten-Weitergabe
- Elegante mobile Darstellung
- vCard Download für Smartphone-Kontakte

### URLs:
- `buderus-systeme.com/cards/` → Alle Mitarbeiter-Visitenkarten
- `buderus-systeme.com/cards/max-mustermann` → Max Mustermanns Visitenkarte
- `buderus-systeme.com/cards/anna-schmidt` → Anna Schmidts Visitenkarte

---

## 🚀 Neuen Mitarbeiter hinzufügen

### 1. Avatar hinzufügen:
```bash
# Avatar-Datei benennen nach ID und in Ordner legen:
assets/avatars/neuer-mitarbeiter.png
assets/avatars/neuer-mitarbeiter.jpg  # oder .jpg/.jpeg/.webp
```

### 2. Mitarbeiterdaten in `employees.json`:
```json
{
  "id": "neuer-mitarbeiter",           // URL: /neuer-mitarbeiter
  "name": "Neuer Mitarbeiter",
  "title": "Position/Abteilung", 
  "phone": "+49 123 456789",
  "email": "email@buderus-systeme.com",
  "website": "https://buderus-systeme.com",
  "company": "Buderus Systeme"
}
```

### 3. Fertig! 
Das System erkennt automatisch:
- Avatar durch ID: `neuer-mitarbeiter.png`
- Route: `/neuer-mitarbeiter`
- Alle Kontaktfunktionen funktionieren automatisch

---

## 📁 Datei-Struktur

```
/
├── index.html                 # Haupttemplate
├── styles.css                # Responsive Design  
├── employees.json             # Mitarbeiterdaten
├── employee-manager.js        # Logik
├── contact.js                # vCard/Kontakt-Features
├── assets/
│   ├── background.png         # Hintergrundbild
│   ├── logo.png              # Firmenlogo
│   ├── qr.png                # QR Code
│   └── avatars/              # Mitarbeiter-Avatars
│       ├── max-mustermann.png
│       ├── anna-schmidt.jpg
│       └── default.png       # Fallback-Avatar
```

---

## 🎨 Avatar-System

### Automatische Erkennung:
1. **Nach ID benannt**: `max-mustermann.png` für ID `"max-mustermann"`
2. **Unterstützte Formate**: `.png`, `.jpg`, `.jpeg`, `.webp`
3. **Fallback**: `default.png` wenn Avatar nicht gefunden

### Beispiele:
```bash
# Mitarbeiter mit ID "john-doe"
assets/avatars/john-doe.png     ✅ Wird automatisch erkannt
assets/avatars/john-doe.jpg     ✅ Wird automatisch erkannt

# Fallback wenn kein Avatar gefunden
assets/avatars/default.png     ✅ Wird verwendet
```

---

## 📱 Features

- ✅ **Responsive Design** (iPhone SE bis Desktop)
- ✅ **vCard Download** (Kontakt speichern)
- ✅ **Direkter Anruf/E-Mail** via Button
- ✅ **QR Code Sharing**
- ✅ **SEO optimiert** pro Mitarbeiter
- ✅ **GitHub Pages ready**

---

## 🌐 Deployment

```bash
# Lokaler Test
python3 -m http.server 3000

# GitHub Pages
./deploy.sh
git add .
git commit -m "Update employee cards"
git push origin main
```

Die Visitenkarten sind **völlig unabhängig** von der Hauptwebsite!
