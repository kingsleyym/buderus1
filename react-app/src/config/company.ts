// Company Configuration für SAAS-ready Architecture
// Hier werden alle company-spezifischen Einstellungen definiert

export interface CompanyConfig {
  id: string;
  name: string;
  logo: string;
  domain: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    font: string;
  };
  features: {
    employees: boolean;
    newsletter: boolean;
    qrCodes: boolean;
    analytics: boolean;
    leads: boolean;
    rewards: boolean;
  };
  contact: {
    email: string;
    phone?: string;
    address?: string;
    website?: string;
  };
}

// Helios Energy Konfiguration
export const HELIOS_CONFIG: CompanyConfig = {
  id: 'helios-energy',
  name: 'Helios Energy',
  logo: '/assets/logo.png',
  domain: 'helios-energy.web.app',
  branding: {
    primaryColor: '#181A23',      // Aus admin.css extrahiert
    secondaryColor: '#2c2f36',
    accentColor: '#007bff',
    backgroundColor: '#f8f9fa',
    textColor: '#333333',
    font: 'Poppins, sans-serif'   // Aus HTML extrahiert
  },
  features: {
    employees: true,              // Mitarbeiter-System aktiv
    newsletter: true,             // Newsletter-System aktiv
    qrCodes: true,               // QR-Code-System aktiv
    analytics: true,             // Analytics aktiv
    leads: false,                // Lead-Generation (zukünftig)
    rewards: true                // Belohnungssystem aktiv
  },
  contact: {
    email: 'info@helios-energy.com',
    website: 'https://helios-energy.web.app'
  }
};

// Aktuelle Company (für Multi-Tenant später erweiterbar)
export const CURRENT_COMPANY = HELIOS_CONFIG;

// Helper Functions
export const getCompanyBranding = () => CURRENT_COMPANY.branding;
export const getCompanyFeatures = () => CURRENT_COMPANY.features;
export const isFeatureEnabled = (feature: keyof CompanyConfig['features']) => 
  CURRENT_COMPANY.features[feature];

// CSS Variables Generator (für Dynamic Theming)
export const generateCSSVariables = (company: CompanyConfig = CURRENT_COMPANY) => ({
  '--company-primary': company.branding.primaryColor,
  '--company-secondary': company.branding.secondaryColor,
  '--company-accent': company.branding.accentColor,
  '--company-bg': company.branding.backgroundColor,
  '--company-text': company.branding.textColor,
  '--company-font': company.branding.font
});

export default CURRENT_COMPANY;
