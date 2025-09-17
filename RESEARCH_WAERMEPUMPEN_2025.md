# RESEARCH: Wärmepumpen & Wirtschaftlichkeitsberechnung 2025

## 1. FÖRDERUNGEN & SUBVENTIONEN

### BEG (Bundesförderung für effiziente Gebäude) 2025
- **Grundförderung:** 25% der förderfähigen Kosten
- **Effizienzbonus:** +5% (JAZ ≥ 4,5)
- **Wärmequellenbonus:** +5% (Erdwärme/Wasser-Wasser)
- **Einkommensbonus:** +30% (≤ 40.000€ Jahreseinkommen)
- **Max. Förderung:** 70%
- **Förderobergrenze:** 30.000€ pro Wohneinheit

### KfW-Kredite
- **Kredit 261:** Bis zu 150.000€ (0,01% Zinssatz)
- **Tilgungszuschuss:** Bis zu 37.500€

### Regionale Förderungen
- **Länder:** Zusätzlich 1.000-5.000€
- **Kommunen:** Variable Zuschüsse
- **Energieversorger:** Boni bei Ökostrom-Tarifen

## 2. WÄRMEPUMPEN-TECHNOLOGIEN

### Luft-Wasser-Wärmepumpen
- **JAZ (Jahresarbeitszahl):** 3,0 - 4,5
- **Investitionskosten:** 12.000 - 18.000€
- **Erschließungskosten:** 2.000 - 5.000€
- **Betriebskosten:** Mittel
- **Förderung:** 25-35%

### Sole-Wasser-Wärmepumpen (Erdwärme)
- **JAZ:** 4,0 - 5,5
- **Investitionskosten:** 15.000 - 25.000€
- **Erschließungskosten:** 8.000 - 15.000€ (Erdbohrung)
- **Betriebskosten:** Niedrig
- **Förderung:** 30-40% (mit Wärmequellenbonus)

### Wasser-Wasser-Wärmepumpen
- **JAZ:** 4,5 - 6,0
- **Investitionskosten:** 18.000 - 30.000€
- **Erschließungskosten:** 10.000 - 20.000€ (Brunnenbohrung)
- **Betriebskosten:** Sehr niedrig
- **Förderung:** 30-40%

### Luft-Luft-Wärmepumpen
- **JAZ:** 2,5 - 4,0
- **Investitionskosten:** 8.000 - 15.000€
- **Erschließungskosten:** 1.000 - 3.000€
- **Förderung:** Nicht BEG-förderfähig (nur in Ausnahmen)

## 3. WIRTSCHAFTLICHKEITSBERECHNUNG - FAKTOREN

### Gebäudedaten (Kundenerfassung)
- **Wohnfläche:** m²
- **Baujahr:** Einfluss auf Dämmstandard
- **Gebäudetyp:** EFH, MFH, Reihenhaus
- **Dämmstandard:** Unsaniert, teilsaniert, KfW-Standard
- **Heizlast:** kW (berechnet oder geschätzt)
- **Warmwasserbedarf:** Personenanzahl
- **Bisherige Heizung:** Öl, Gas, Strom

### Energieverbrauchsdaten
- **Bisheriger Verbrauch:** kWh/Jahr oder Liter Öl/Gas
- **Heizkosten aktuell:** €/Jahr
- **Stromverbrauch:** kWh/Jahr
- **Stromtarif:** €/kWh

### Lokale Faktoren
- **Klimazone:** Deutschland (Temperaturdaten)
- **Grundwassertemperatur:** Für Wasser-Wasser-WP
- **Bodenbeschaffenheit:** Für Erdwärme-WP
- **Lärmschutzbestimmungen:** Für Luft-WP

## 4. BERECHNUNG - FORMELN & METHODIK

### Heizwärmebedarf
```
Heizwärmebedarf = Wohnfläche × spezifischer Heizwärmebedarf × Klimafaktor
```

**Spezifischer Heizwärmebedarf nach Baujahr:**
- Vor 1978: 150-250 kWh/m²/Jahr
- 1979-1995: 100-150 kWh/m²/Jahr  
- 1996-2001: 80-120 kWh/m²/Jahr
- 2002-2009: 60-100 kWh/m²/Jahr
- Ab 2010: 40-70 kWh/m²/Jahr
- KfW 55: 30-55 kWh/m²/Jahr
- Passivhaus: 15 kWh/m²/Jahr

### Stromverbrauch Wärmepumpe
```
Stromverbrauch WP = Heizwärmebedarf / JAZ + Warmwasser-Anteil
```

### Betriebskosten Wärmepumpe
```
Betriebskosten = Stromverbrauch WP × Strompreis × (1 + Preissteigerung)^Jahre
```

### Einsparung vs. bisherige Heizung
```
Einsparung = Bisherige Heizkosten - Betriebskosten WP - Wartungskosten
```

### Amortisation
```
Amortisationszeit = (Investitionskosten - Förderung) / Jährliche Einsparung
```

## 5. PREISE & KOSTEN 2025

### Strompreise
- **Haushaltsstrom:** 0,32 - 0,45 €/kWh
- **Wärmepumpentarif:** 0,28 - 0,35 €/kWh
- **Jährliche Steigerung:** 3-5%

### Fossile Energieträger
- **Heizöl:** 0,08 - 0,12 €/kWh
- **Erdgas:** 0,07 - 0,11 €/kWh
- **Jährliche Steigerung:** 4-7%

### Wartungskosten
- **Wärmepumpe:** 150-300 €/Jahr
- **Gasheizung:** 200-400 €/Jahr
- **Ölheizung:** 300-500 €/Jahr

## 6. AUTOMATISIERTE BERECHNUNG - ALGORITHMUS

### Input-Parameter für Kunden-Tool
1. **Gebäudedaten**
   - PLZ (für Klimadaten)
   - Wohnfläche
   - Baujahr
   - Gebäudetyp
   - Dämmstandard

2. **Aktuelle Heizung**
   - Energieträger
   - Jahresverbrauch
   - Jährliche Kosten

3. **Präferenzen**
   - Budget
   - Gewünschte WP-Art
   - Priorität (Kosten vs. Umwelt)

### Output-Berechnung
1. **Heizlast-Ermittlung**
2. **WP-Dimensionierung**
3. **Investitionskosten**
4. **Förderung berechnen**
5. **Betriebskosten projizieren**
6. **Amortisation ermitteln**
7. **CO2-Einsparung berechnen**

## 7. BEISPIEL-RECHNUNG

### Ausgangssituation
- **Objekt:** EFH, 150m², Baujahr 1985
- **Aktuelle Heizung:** Gasheizung, 25.000 kWh/Jahr, 2.500€/Jahr
- **Strompreis:** 0,35 €/kWh

### WP-Empfehlung: Luft-Wasser-WP
- **Investition:** 16.000€
- **Installation:** 4.000€
- **Gesamtkosten:** 20.000€
- **Förderung (30%):** 6.000€
- **Eigenanteil:** 14.000€

### Betriebskosten
- **JAZ:** 4,0
- **Stromverbrauch:** 6.250 kWh/Jahr
- **Stromkosten:** 2.188€/Jahr
- **Wartung:** 200€/Jahr
- **Gesamt:** 2.388€/Jahr

### Wirtschaftlichkeit
- **Einsparung:** 112€/Jahr
- **Amortisation:** 125 Jahre (nicht wirtschaftlich!)

### Optimierung: WP-Stromtarif + bessere Effizienz
- **WP-Tarif:** 0,28 €/kWh
- **Neue Stromkosten:** 1.750€/Jahr
- **Einsparung:** 550€/Jahr
- **Amortisation:** 25 Jahre ✓

## 8. PRODUKTDATENBANK - STRUKTUR

### Hersteller-Kategorien
- **Premium:** Viessmann, Vaillant, Buderus
- **Standard:** Wolf, Junkers, Weishaupt
- **Budget:** Panasonic, LG, Samsung

### Produkt-Attributes
- **Modellname**
- **Typ** (Luft-Wasser, Sole-Wasser, etc.)
- **Heizleistung** (kW)
- **JAZ** bei verschiedenen Temperaturen
- **Kältemittel**
- **Max. Vorlauftemperatur**
- **Schallpegel**
- **Abmessungen**
- **Gewicht**
- **Listenpreis**
- **Einkaufspreis**
- **Verfügbarkeit**

## 9. INTEGRATION IN CRM-SYSTEM

### Schritt 1: Produktmanagement
- Produkte anlegen mit allen technischen Daten
- Preise und Verfügbarkeiten verwalten
- Hersteller-Partnerschaften abbilden

### Schritt 2: Kundenerfassung erweitern
- Wirtschaftlichkeits-Fragebogen
- Automatische Heizlastberechnung
- Standort-basierte Klimadaten

### Schritt 3: Automatisierte Berechnung
- Algorithmus für WP-Auswahl
- Förder-Rechner
- Amortisations-Kalkulation
- CO2-Bilanz

### Schritt 4: Angebotserstellung
- Automatische Produktauswahl
- Kalkulierte Preise
- Förderanträge vorbereiten
- Finanzierungsoptionen

## 10. ÖFFENTLICHES KUNDEN-TOOL

### Funktionen
- **Schnell-Check:** 5 Fragen, grobe Schätzung
- **Detail-Analyse:** Umfassende Berechnung
- **Produkt-Vergleich:** Verschiedene WP-Typen
- **Förder-Check:** Aktuelle Förderungen
- **Lead-Generierung:** Kontakt für Beratung

### Vorteile
- **Marketing:** SEO-optimiert für "Wärmepumpe Rechner"
- **Lead-Qualität:** Nur interessierte Kunden
- **Automatisierung:** Weniger manuelle Beratung
- **Datensammlung:** Marktforschung

## 11. NÄCHSTE SCHRITTE

1. **Produktdatenbank aufbauen**
2. **Berechnungsalgorithmus entwickeln**
3. **Frontend für Kundenerfassung**
4. **Integration in CRM**
5. **Öffentliches Tool erstellen**
6. **Marketing & SEO optimieren**
