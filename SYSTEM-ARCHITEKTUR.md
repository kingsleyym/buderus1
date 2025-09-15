# 🏗️ HELIOS ENERGY - SKALIERBARE SYSTEM ARCHITEKTUR

## 📊 **SYSTEM ÜBERSICHT**

### **5 HAUPTBEREICHE:**
1. **🏠 PUBLIC WEBSITE** - Öffentlich ohne Login
2. **👤 EMPLOYEE DASHBOARD** - Mitarbeiter mit Login  
3. **⚙️ ADMIN DASHBOARD** - Administratoren mit Login
4. **📧 NEWSLETTER SYSTEM** - Öffentliche Anmeldung
5. **🎯 LEAD GENERATION** - Zukünftige Erweiterung

---

## 🎯 **REACT APP STRUKTUR (SKALIERBAR)**

### **ROUTING STRUCTURE:**
```
Domain: helios-energy.web.app

├── /                           # 🏠 PUBLIC HOMEPAGE
├── /team                       # 👥 Team Overview (Public)
├── /team/[employee-name]       # 👤 Employee Profile (Public)
├── /newsletter                 # 📧 Newsletter Signup (Public)
├── /newsletter/confirm         # ✅ Newsletter Confirmation (Public)
├── /leads                      # 🎯 Lead Generation (Public - Future)
│
├── /employee                   # 👤 EMPLOYEE DASHBOARD
│   ├── /employee/login         # 🔐 Employee Login
│   ├── /employee/dashboard     # 📊 Employee Main Dashboard
│   ├── /employee/profile       # 👤 Profile Management
│   └── /employee/card          # 🎨 vCard & QR Generator
│
└── /admin                      # ⚙️ ADMIN DASHBOARD
    ├── /admin/login            # 🔐 Admin Login
    ├── /admin/dashboard        # 📊 Admin Main Dashboard
    ├── /admin/employees        # 👥 Employee Management
    ├── /admin/qr-codes         # 📱 QR Code Management
    ├── /admin/newsletter       # 📧 Newsletter Management
    └── /admin/analytics        # 📈 Analytics & Statistics
```

---

## 📁 **REACT FOLDER STRUKTUR (AKTUALISIERT)**

```
src/
├── App.tsx                     # 🎯 Main App mit Routing
├── index.tsx                   # 🚀 App Entry Point
│
├── components/                 # 🧩 SHARED COMPONENTS
│   ├── auth/                   # 🔐 Authentication
│   │   ├── LoginForm.tsx       # Login Component (Employee + Admin)
│   │   ├── AuthGuard.tsx       # Route Protection
│   │   └── LogoutButton.tsx    # Logout Functionality
│   │
│   ├── employee/               # 👤 Employee Components
│   │   ├── EmployeeCard.tsx    # Employee Display Card
│   │   ├── EmployeeForm.tsx    # Employee Edit Form
│   │   ├── VCardGenerator.tsx  # vCard Creation
│   │   └── QRGenerator.tsx     # QR Code Creation
│   │
│   ├── ui/                     # 🎨 UI Components
│   │   ├── LoadingSpinner.tsx  # Loading States
│   │   ├── Toast.tsx           # Notifications
│   │   ├── Modal.tsx           # Popups/Dialogs
│   │   ├── Button.tsx          # Reusable Buttons
│   │   └── FormField.tsx       # Form Inputs
│   │
│   ├── layout/                 # 📐 Layout Components
│   │   ├── PublicLayout.tsx    # Layout für Public Pages
│   │   ├── EmployeeLayout.tsx  # Layout für Employee Dashboard
│   │   ├── AdminLayout.tsx     # Layout für Admin Dashboard
│   │   ├── Header.tsx          # Site Header
│   │   ├── Footer.tsx          # Site Footer
│   │   └── Sidebar.tsx         # Dashboard Sidebar
│   │
│   └── newsletter/             # 📧 Newsletter Components
│       ├── SignupForm.tsx      # Newsletter Anmeldung
│       ├── ConfirmPage.tsx     # Bestätigung
│       └── UnsubscribeForm.tsx # Abmeldung
│
├── pages/                      # 📄 MAIN PAGES
│   ├── public/                 # 🏠 PUBLIC PAGES
│   │   ├── HomePage.tsx        # Landing Page
│   │   ├── TeamPage.tsx        # Team Overview
│   │   ├── EmployeePage.tsx    # Individual Employee
│   │   ├── NewsletterPage.tsx  # Newsletter Signup
│   │   └── LeadsPage.tsx       # Lead Generation (Future)
│   │
│   ├── employee/               # 👤 EMPLOYEE DASHBOARD
│   │   ├── EmployeeLogin.tsx   # Employee Login
│   │   ├── Dashboard.tsx       # Employee Main Dashboard
│   │   ├── Profile.tsx         # Profile Management
│   │   └── CardDesigner.tsx    # vCard Designer
│   │
│   └── admin/                  # ⚙️ ADMIN DASHBOARD
│       ├── AdminLogin.tsx      # Admin Login
│       ├── Dashboard.tsx       # Admin Main Dashboard
│       ├── EmployeeManager.tsx # Employee CRUD
│       ├── QRManager.tsx       # QR Code Management
│       ├── NewsletterEditor.tsx # Newsletter Creation
│       └── Analytics.tsx       # Statistics
│
├── config/                     # ⚙️ CONFIGURATION
│   ├── firebase.ts             # 🔥 Firebase Config (CENTRAL!)
│   ├── company.ts              # 🏢 Company Settings (SAAS-ready)
│   ├── routes.ts               # 🛣️ Route Definitions
│   └── constants.ts            # 📋 App Constants
│
├── hooks/                      # 🎣 CUSTOM HOOKS
│   ├── useAuth.ts              # 🔐 Authentication Logic
│   ├── useFirestore.ts         # 🗄️ Database Operations
│   ├── useFunctions.ts         # ⚡ Firebase Functions
│   ├── useEmployees.ts         # 👥 Employee Data Management
│   └── useNewsletter.ts        # 📧 Newsletter Operations
│
├── utils/                      # 🛠️ UTILITIES
│   ├── validation.ts           # ✅ Form Validation
│   ├── formatting.ts           # 📝 Data Formatting
│   ├── constants.ts            # 📋 Constants
│   ├── helpers.ts              # 🤝 Helper Functions
│   └── types.ts                # 📋 TypeScript Types
│
└── styles/                     # 🎨 GLOBAL STYLES
    ├── globals.css             # Global CSS
    ├── variables.css           # CSS Variables
    └── components.css          # Component Styles
```

---

## 🔐 **AUTHENTICATION FLOW**

### **ROUTING & PROTECTION:**
```typescript
// ÖFFENTLICH (Kein Login erforderlich)
/                   → HomePage
/team               → TeamPage
/team/[name]        → EmployeePage
/newsletter         → NewsletterPage
/leads              → LeadsPage

// EMPLOYEE PROTECTED (Employee Login erforderlich)
/employee/*         → AuthGuard → Employee Routes

// ADMIN PROTECTED (Admin Login erforderlich)  
/admin/*            → AuthGuard → Admin Routes
```

### **USER ROLES:**
```typescript
enum UserRole {
  PUBLIC = 'public',      // Kein Login
  EMPLOYEE = 'employee',  // Mitarbeiter Login
  ADMIN = 'admin'         // Admin Login
}
```

---

## 🌐 **SAAS-READY DESIGN**

### **COMPANY CONFIG:**
```typescript
// config/company.ts
interface CompanyConfig {
  id: string;           // 'helios-energy'
  name: string;         // 'Helios Energy'
  logo: string;         // '/assets/logo.png'
  domain: string;       // 'helios-energy.web.app'
  branding: {
    primaryColor: string;
    secondaryColor: string;
    font: string;
  };
  features: {
    employees: boolean;
    newsletter: boolean;
    qrCodes: boolean;
    analytics: boolean;
    leads: boolean;
  };
}
```

### **ZUKÜNFTIGE SKALIERUNG:**
```
Multi-Tenant Ready:
├── helios.yourapp.com      # Helios Energy
├── company2.yourapp.com    # Andere Firma
└── company3.yourapp.com    # Noch eine Firma
```

---

## 🎯 **MIGRATION PRIORITÄTEN (AKTUALISIERT)**

### **PHASE 1: FOUNDATION**
1. ✅ React App Setup
2. 🔄 Firebase Config zentralisieren
3. 🔄 Public Layout + Routes
4. 🔄 Authentication System

### **PHASE 2: PUBLIC PAGES**
5. 🔄 HomePage erstellen
6. 🔄 TeamPage migrieren  
7. 🔄 Employee Profile Pages
8. 🔄 Newsletter System migrieren

### **PHASE 3: EMPLOYEE DASHBOARD**
9. 🔄 Employee Authentication
10. 🔄 Employee Dashboard
11. 🔄 Profile Management
12. 🔄 vCard & QR Generator

### **PHASE 4: ADMIN DASHBOARD**
13. 🔄 Admin Authentication
14. 🔄 Admin Dashboard
15. 🔄 Employee Management
16. 🔄 QR Code Manager
17. 🔄 Newsletter Editor
18. 🔄 Analytics

### **PHASE 5: OPTIMIZATION**
19. 🔄 Lead Generation Vorbereitung
20. 🔄 Performance Optimization
21. 🔄 SAAS-ready Features

---

**STATUS:** ARCHITEKTUR DESIGN ABGESCHLOSSEN ✅
**NEXT:** React App Struktur implementieren 🚀
