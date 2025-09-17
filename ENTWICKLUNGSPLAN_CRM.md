# ENTWICKLUNGSPLAN: Buderus CRM-System 2025

## PHASE 1: PRODUKTDATENBANK (Woche 1-2)
### 🔧 Buderus & Viessmann Produkte
- [ ] **Hersteller-Partnerschaften** (Buderus, Viessmann)
- [ ] **Produktkatalog** mit technischen Daten
- [ ] **Einkaufspreise** hinterlegen
- [ ] **Verkaufspreise** mit Margen
- [ ] **Produktverfügbarkeit** tracken

**Deliverables:**
- `types/Product.ts` - Einfache Produkt-Struktur
- `components/admin/products/ProductCatalog.tsx`
- `data/buderusProducts.ts` - Echte Buderus-Produkte
- `data/viessmannProducts.ts` - Echte Viessmann-Produkte

### 📊 Berechnungs-Utilities
- [ ] **Förder-Rechner** (BEG 2025)
- [ ] **Amortisations-Rechner**
- [ ] **Einsparungs-Kalkulation**
- [ ] **Basis-Heizlastschätzung**

**Deliverables:**
- `utils/IncentiveCalculator.ts` - Förderungsberechnung
- `utils/SavingsCalculator.ts` - Einsparungen vs. alte Heizung
- `utils/BasicHeatingCalculator.ts` - Vereinfachte Heizlast

## PHASE 2: LEAD-SYSTEM ERWEITERN (Woche 3-4)
### � Bestehende Leads erweitern
- [ ] **Verkäufer-Zuordnung** in Leads integrieren
- [ ] **Affiliate-Tracking** für Lead-Quellen
- [ ] **Termine-Integration** (bestehend)
- [ ] **Produktinteresse** erfassen
- [ ] **Berechnungen** an Lead anhängen

**Deliverables:**
- Erweiterte `types/Lead.ts` um Produktdaten
- `components/admin/leads/ProductSelection.tsx`
- `components/admin/leads/CalculationResults.tsx`

### 🗓️ Termin & Angebots-Workflow
- [ ] **Termin → Beratung → Berechnung → Angebot**
- [ ] **Manuelle Produktauswahl** nach Beratung
- [ ] **Berechnungsergebnisse** in Lead speichern
- [ ] **Angebotsstatus** tracken

## PHASE 3: ANGEBOT-TEMPLATES (Woche 5-6)
### 📄 Template-Upload-System
- [ ] **PDF-Upload** für Angebotsvorlagen
- [ ] **Template-Editor** für Anpassungen
- [ ] **Platzhalter-System** für dynamische Inhalte
- [ ] **Verschiedene Vorlagen** je Produkttyp
- [ ] **Manueller Template-Edit** möglich

**Deliverables:**
- `components/admin/quotes/TemplateManager.tsx`
- `components/admin/quotes/TemplateEditor.tsx`
- `utils/TemplateProcessor.ts`

### 💰 Preiskalkulation
- [ ] **Produktpreise** aus Katalog
- [ ] **Feste Installationspreise** je Produkttyp
- [ ] **Externe Monteure** Kostenstellen
- [ ] **Material-Overhead** kalkulierbar
- [ ] **Gesamtpreis-Berechnung**

**Deliverables:**
- `utils/PriceCalculator.ts`
- `types/Installation.ts`
- `components/admin/quotes/PriceBreakdown.tsx`

## PHASE 4: KUNDENBERATUNG & BERECHNUNG (Woche 7-8)
### 🏠 Vereinfachte Kundendatenerfassung
- [ ] **Basis-Gebäudedaten** (Größe, Baujahr, Heizung)
- [ ] **Aktueller Energieverbrauch**
- [ ] **Budget-Vorstellungen**
- [ ] **Förder-Check** für Kunde
- [ ] **Einfache Wirtschaftlichkeit** zeigen

**Deliverables:**
- `components/customer/SimpleCalculator.tsx`
- `components/customer/IncentiveChecker.tsx`

### � Beratungstool für Verkäufer
- [ ] **Schnelle Berechnungen** vor Ort
- [ ] **Produktempfehlungen** basierend auf Daten
- [ ] **Förder-Sofort-Check**
- [ ] **Grobe Kosteneinschätzung**
- [ ] **Ergebnisse an Lead** anhängen

## PHASE 5: PDF-GENERIERUNG & VERTRÄGE (Woche 9-10)
### 📄 Automatische Angebots-PDFs
- [ ] **Template + Daten = PDF**
- [ ] **Produktdaten einfügen**
- [ ] **Berechnungsergebnisse** einbauen
- [ ] **Förderinformationen** automatisch
- [ ] **Firmen-Branding** Buderus/Viessmann

### � Vertragsvorlagen
- [ ] **Installation-Verträge**
- [ ] **Wartungsverträge**
- [ ] **Finanzierungs-Optionen**
- [ ] **AGB-Integration**

## VEREINFACHTE ARCHITEKTUR

### Datenfluss
```
1. Lead erfassen (bestehend)
2. Termin vereinbaren (bestehend)
3. Vor-Ort-Beratung → Kundendaten erfassen
4. Verkäufer wählt Produkte aus Katalog
5. System berechnet Förderung + Einsparung
6. Angebot aus Template generieren
7. PDF erstellen und versenden
8. Vertrag bei Zusage
```

### Einfache Tech-Stack
```typescript
// Bestehend erweitern
Lead-System ✓
Termin-System ✓

// Neu hinzufügen
Product Catalog
Simple Calculator
Template Manager
PDF Generator
```

## VEREINFACHTE MEILENSTEINE

### Woche 2: Produktkatalog Live
- ✅ Buderus & Viessmann Produkte eingepflegt
- ✅ Einkaufs-/Verkaufspreise hinterlegt

### Woche 4: Lead-Integration
- ✅ Produktauswahl in Leads
- ✅ Berechnungen speicherbar

### Woche 6: Angebots-Templates  
- ✅ Upload-System für Templates
- ✅ Preiskalkulation funktional

### Woche 10: Vollständiger Workflow
- ✅ Lead → Beratung → Berechnung → Angebot → PDF
- ✅ Verkäufer-Tools einsatzbereit

## BUSINESS-REALITÄT FOKUS

### Was ihr WIRKLICH braucht:
✅ **Produktkatalog** - Buderus & Viessmann mit Preisen  
✅ **Erweiterte Leads** - Verkäufer/Affiliate-Integration  
✅ **Einfache Berechnung** - Förderung & Einsparung  
✅ **Template-Upload** - Bestehende Angebote digitalisieren  
✅ **PDF-Generator** - Professionelle Angebote  
✅ **Feste Preise** - Keine komplexe Stundensatz-Rechnung  

### Was ihr NICHT braucht:
❌ KI-Algorithmen  
❌ Komplexe Heizlast-Berechnungen  
❌ Automatische Produktauswahl  
❌ Öffentliches Tool (erstmal)  
❌ Stundensatz-Kalkulationen  

## SOFORT STARTBAR

**Soll ich mit Phase 1 beginnen?**
- Produktkatalog für Buderus & Viessmann
- Lead-System um Produkte erweitern
- Einfache Förder-Berechnung

**Das bringt euch sofort:**
- Strukturierte Produktdaten
- Verkäufer können Produkte zu Leads zuordnen  
- Automatische Förder-Checks
- Basis für Angebotserstellung

**Zeit: 1-2 Wochen bis nutzbar! 🚀**
