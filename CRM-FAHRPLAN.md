# 🚀 CRM FAHRPLAN - Helios Energy Dashboard

## 📊 BESTEHENDE COLLECTIONS (Ist-Zustand)

### 1. Users Collection ✅
```
/users/{userId}
- Zentrale Auth-Entität
- Wird für Firebase Auth verwendet
- Rollen: admin, seller, customer
```

### 2. Employees Collection ✅ 
```
/employees/{employeeId}
- uid: Firebase Auth UID
- email, firstName, lastName, phone
- position, status, approved
- createdAt, confirmationToken
```

### 3. Subscribers Collection ✅
```
/subscribers/{subscriberId}
- email, firstName, lastName, company
- subscriptionId, confirmed, marketingConsent
- source, createdAt, confirmedAt
```

### 4. Vorhandene Collections:
- `consent` - DSGVO Records
- `newsletters` - Newsletter Kampagnen
- `qr_codes` - QR-Code Tracking
- `qr_scans` - Scan-Statistiken

## 🎯 ZIEL-ARCHITEKTUR

### Neue Collections:

#### 5. Leads Collection 🆕
```
/leads/{leadId}
{
  "id": "lead_001",
  "firstName": "Max",
  "lastName": "Mustermann", 
  "email": "max@example.com",
  "phone": "0123456789",
  "address": "Musterstraße 1, 80331 München",
  "source": "newsletter", // newsletter | website | referral | manual
  "status": "neu", // neu → interessiert → angebot → abschluss
  "priority": "medium", // low | medium | high
  
  // Verknüpfungen
  "assignedSellerId": "employeeId_123",
  "subscriberId": "sub_123", // optional
  "userId": "userId_123", // optional, falls registriert
  
  // Business Daten
  "projectType": "wärmepumpe", // wärmepumpe | solar | heizung
  "budget": 25000,
  "timeline": "3_monate",
  "notes": "Interessiert an Luft-Wasser Wärmepumpe",
  
  // Provisionen
  "commissionSplits": [
    {"sellerId": "emp_123", "percentage": 70},
    {"managerId": "emp_456", "percentage": 30}
  ],
  
  // Meta
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "lastContactAt": "timestamp"
}
```

#### 6. Appointments Collection 🆕
```
/appointments/{appointmentId}
{
  "id": "appt_001",
  "leadId": "lead_001",
  "type": "beratung", // beratung | besichtigung | angebot | nachfassung
  "title": "Wärmepumpen-Beratung",
  "description": "Vor-Ort Beratung für Wärmepumpe",
  
  // Termin Details
  "scheduledAt": "2025-09-20T10:00:00Z",
  "duration": 120, // Minuten
  "location": "Beim Kunden",
  "address": "Musterstraße 1, München",
  
  // Teilnehmer
  "assignedSellerId": "emp_123",
  "participants": ["emp_123", "emp_456"], // optional weitere
  
  // Status
  "status": "geplant", // geplant | bestätigt | abgeschlossen | abgesagt
  "result": "", // Ergebnis nach Termin
  "followUpAction": "", // Nächste Schritte
  
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### 7. Offers Collection 🆕
```
/offers/{offerId}
{
  "id": "offer_001",
  "leadId": "lead_001", 
  "appointmentId": "appt_001", // optional
  
  // Angebots-Details
  "title": "Wärmepumpe Installation",
  "totalAmount": 28500,
  "validUntil": "2025-10-15",
  "status": "erstellt", // erstellt → gesendet → angenommen → abgelehnt
  
  // Positionen
  "items": [
    {
      "id": "item_1",
      "name": "Luft-Wasser Wärmepumpe",
      "description": "inklusive Installation",
      "quantity": 1,
      "unitPrice": 25000,
      "totalPrice": 25000
    }
  ],
  
  // Provisionen
  "commissionAmount": 2000,
  "commissionSplits": [...],
  
  "createdBy": "emp_123",
  "createdAt": "timestamp"
}
```

#### 8. Invoices Collection 🆕
```
/invoices/{invoiceId}
{
  "id": "inv_001",
  "leadId": "lead_001",
  "offerId": "offer_001",
  
  // Rechnungs-Details
  "invoiceNumber": "RE-2025-001",
  "totalAmount": 28500,
  "taxAmount": 5415,
  "netAmount": 23085,
  "dueDate": "2025-10-01",
  
  // Status
  "status": "offen", // offen → überfällig → bezahlt → storniert
  "paidAt": null,
  "paidAmount": 0,
  
  "createdBy": "emp_123",
  "createdAt": "timestamp"
}
```

## 🛠 IMPLEMENTIERUNGS-FAHRPLAN

### PHASE 1: Foundation (Woche 1-2) 🔥 JETZT STARTEN

#### 1.1 Dashboard Statistiken ✅ PRIORITÄT 1
```typescript
// Dashboard Statistics Component
interface DashboardStats {
  leads: {
    total: number;
    thisMonth: number;
    new: number;
    qualified: number;
  };
  appointments: {
    today: number;
    thisWeek: number;
    upcoming: number;
  };
  revenue: {
    thisMonth: number;
    thisQuarter: number;
    target: number;
  };
}
```

#### 1.2 Leads Collection Setup ✅ PRIORITÄT 1
- Firestore Collection `leads` anlegen
- Firebase Functions für Lead CRUD
- Test-Leads generieren (10-20 Stück)
- Lead-List Component erstellen

#### 1.3 Navigation & Routing ✅ PRIORITÄT 1
```tsx
// Main Dashboard Navigation
- Dashboard (Statistiken)
- Leads (Lead-Management)
- Termine (Appointment-Übersicht)  
- Angebote (Offer-Management)
- Rechnungen (Invoice-Management)
```

### PHASE 2: Lead Management (Woche 2-3)

#### 2.1 Lead CRUD Operations
- ✅ Create Lead (manuell + aus Subscriber)
- ✅ Read Leads (Liste, Filter, Suche)
- ✅ Update Lead (Status, Notes, Assignment)
- ✅ Delete Lead (mit Berechtigung)

#### 2.2 Lead Lifecycle
- Status-Pipeline: neu → interessiert → angebot → abschluss
- Automatische Verknüpfung: Subscriber → Lead
- Verkäufer-Zuweisung mit Benachrichtigung

### PHASE 3: Appointment System (Woche 3-4)

#### 3.1 Appointment CRUD
- Termin erstellen (aus Lead heraus)
- Kalender-Integration
- Status-Updates (geplant → bestätigt → abgeschlossen)

#### 3.2 Appointment Features
- Erinnerungen per E-Mail
- Kalender-Export (iCal)
- Follow-up Actions nach Termin

### PHASE 4: Offers & Invoices (Woche 4-5)

#### 4.1 Offer System
- Angebote aus Leads/Terminen erstellen
- PDF-Generation
- E-Mail-Versand
- Status-Tracking

#### 4.2 Invoice System
- Rechnungen aus Angeboten
- Payment-Tracking
- Überfälligkeits-Management

### PHASE 5: Advanced Features (Woche 5-6)

#### 5.1 Commission System
- Automatische Provisionsberechnung
- Split-Logik zwischen Verkäufern
- Commission Reports

#### 5.2 Automation
- Lead-Scoring
- Automatische E-Mails
- Workflow-Trigger

## 🎯 SOFORTIGER START - HEUTE IMPLEMENTIEREN

### 1. Dashboard Statistics ⚡ JETZT
```typescript
// components/dashboard/DashboardStats.tsx
- Leads Statistiken (total, new, qualified)
- Termine heute/diese Woche  
- Umsatz-Tracking
- Employee Performance
```

### 2. Test Leads generieren ⚡ JETZT
```typescript
// Mock Data für Development
const testLeads = [
  {
    firstName: "Max", lastName: "Mustermann",
    email: "max@test.de", phone: "0123456789",
    source: "website", status: "neu",
    projectType: "wärmepumpe", budget: 25000
  },
  // ... 15 weitere Test-Leads
];
```

### 3. Basic Lead List ⚡ JETZT
```typescript
// components/leads/LeadList.tsx
- Tabelle mit allen Leads
- Filter nach Status, Source, Verkäufer
- Suche nach Name, E-Mail
- Neue Lead Button
```

## 🔧 TECHNISCHE DETAILS

### Firebase Functions zu erstellen:
```javascript
// functions/lead-functions.js
exports.createLead = functions.https.onCall(...)
exports.updateLead = functions.https.onCall(...)
exports.getLeads = functions.https.onCall(...)
exports.assignLead = functions.https.onCall(...)
```

### React Components Struktur:
```
src/components/
├── dashboard/
│   ├── DashboardMain.tsx
│   ├── DashboardStats.tsx
│   └── QuickActions.tsx
├── leads/
│   ├── LeadList.tsx
│   ├── LeadCard.tsx
│   ├── LeadModal.tsx
│   └── LeadFilters.tsx
├── appointments/
│   ├── AppointmentCalendar.tsx
│   └── AppointmentList.tsx
├── offers/
│   └── OfferList.tsx
└── invoices/
    └── InvoiceList.tsx
```

## ✅ NÄCHSTE SCHRITTE - HEUTE STARTEN

1. **Dashboard Statistics Component** erstellen
2. **Test Leads** in Firestore Collection anlegen  
3. **Lead List Component** implementieren
4. **Navigation** zwischen Bereichen einrichten
5. **Firebase Functions** für Leads erstellen

Soll ich mit **Schritt 1 - Dashboard Statistics** beginnen?
