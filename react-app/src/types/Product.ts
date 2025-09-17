// Flexibles Produktsystem für Buderus CRM
// Unterstützt Wärmepumpen, PV-Anlagen und weitere Produkte

export interface Manufacturer {
  id: string;
  name: string;
  logo?: string;
  partnershipLevel: 'premium' | 'standard' | 'basic';
  contactInfo: {
    email: string;
    phone: string;
    representative?: string;
  };
  discountRates: {
    standard: number; // Prozent
    volume: number;   // Ab bestimmter Menge
    seasonal?: number; // Saisonale Rabatte
  };
}

export type ProductCategory = 
  | 'heat_pump' 
  | 'solar_pv' 
  | 'solar_thermal' 
  | 'heating_system' 
  | 'installation_materials'
  | 'accessories';

export type HeatPumpType = 
  | 'air_water' 
  | 'ground_water' 
  | 'water_water' 
  | 'air_air';

export interface ProductSpecifications {
  // Wärmepumpen-spezifisch
  heatPump?: {
    type: HeatPumpType;
    heatingCapacity: number; // kW
    coolingCapacity?: number; // kW
    jahresarbeitszahl: number; // JAZ/COP
    maxFlowTemperature: number; // °C
    refrigerant: string;
    soundLevel: number; // dB(A)
    powerConsumption: number; // kW
    dimensions: {
      width: number;
      height: number;
      depth: number;
    };
    weight: number; // kg
    minAmbientTemp: number; // °C
    maxAmbientTemp: number; // °C
  };

  // PV-Anlagen-spezifisch
  solarPV?: {
    modulePower: number; // Wp
    efficiency: number; // %
    moduleType: 'monocrystalline' | 'polycrystalline' | 'thin_film';
    dimensions: {
      width: number;
      height: number;
      thickness: number;
    };
    weight: number; // kg
    warranty: number; // Jahre
    degradation: number; // % pro Jahr
    temperatureCoefficient: number; // %/°C
  };

  // Solarthermie-spezifisch
  solarThermal?: {
    collectorArea: number; // m²
    efficiency: number; // %
    maxPressure: number; // bar
    stagnationTemperature: number; // °C
    absorberType: string;
  };

  // Allgemeine technische Daten
  general?: {
    energyLabel?: string; // A+++ bis G
    installation: 'indoor' | 'outdoor' | 'both';
    connectivity?: string[]; // WLAN, LAN, etc.
    controls?: string;
    maintenance?: string;
    [key: string]: any; // Für zukünftige Erweiterungen
  };
}

export interface PricingInfo {
  listPrice: number; // UVP
  purchasePrice: number; // Einkaufspreis
  salesPrice: number; // Verkaufspreis
  margin: number; // Marge in %
  currency: string;
  validFrom: Date;
  validUntil?: Date;
  specialOffers?: {
    description: string;
    discountPercent: number;
    validUntil: Date;
  }[];
}

export interface InventoryInfo {
  inStock: number;
  reserved: number;
  ordered: number;
  minStock: number;
  maxStock: number;
  leadTime: number; // Tage
  lastRestocked: Date;
  supplier: string;
}

export interface Product {
  id: string;
  sku: string; // Artikelnummer
  name: string;
  description: string;
  category: ProductCategory;
  manufacturer: Manufacturer;
  
  // Technische Daten
  specifications: ProductSpecifications;
  
  // Preise & Konditionen
  pricing: PricingInfo;
  
  // Lager & Verfügbarkeit
  inventory: InventoryInfo;
  
  // Zusatzinformationen
  images: string[]; // URLs zu Produktbildern
  documents: {
    datasheet?: string;
    manual?: string;
    certificate?: string;
    warranty?: string;
  };
  
  // Förderung & Zertifizierung
  eligible: {
    bafaFunding: boolean;
    kfwFunding: boolean;
    regionalFunding?: string[];
    certifications: string[]; // CE, TÜV, etc.
  };
  
  // Installation & Service
  installation: {
    complexity: 'simple' | 'medium' | 'complex';
    estimatedTime: number; // Stunden
    requiredPersonnel: number;
    specialTools?: string[];
    additionalMaterials?: string[];
  };
  
  // Metadaten
  isActive: boolean;
  isDiscontinued: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Utility Functions
export const getMarginPercent = (product: Product): number => {
  const { purchasePrice, salesPrice } = product.pricing;
  return ((salesPrice - purchasePrice) / salesPrice) * 100;
};

export const isEligibleForFunding = (product: Product): boolean => {
  return product.eligible.bafaFunding || product.eligible.kfwFunding;
};

export const getAvailableQuantity = (product: Product): number => {
  return product.inventory.inStock - product.inventory.reserved;
};

export const formatPrice = (price: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency
  }).format(price);
};

export const getProductDisplayName = (product: Product): string => {
  return `${product.manufacturer.name} ${product.name}`;
};

// Für Filterung und Suche
export interface ProductFilters {
  category?: ProductCategory;
  manufacturer?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
  fundingEligible?: boolean;
  tags?: string[];
}

// Für Produkterstellung
export interface CreateProductRequest {
  name: string;
  description: string;
  category: ProductCategory;
  manufacturerId: string;
  specifications: ProductSpecifications;
  pricing: Omit<PricingInfo, 'validFrom'>;
  inventory: Omit<InventoryInfo, 'lastRestocked'>;
  images?: string[];
  documents?: Product['documents'];
  eligible: Product['eligible'];
  installation: Product['installation'];
  tags?: string[];
}
