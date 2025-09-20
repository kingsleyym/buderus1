// Sauberes, dynamisches Produktsystem für Buderus CRM
// Unterstützt verschiedene Produkttypen mit flexiblen technischen Daten

// Basis-Produktkategorien
export type ProductCategory = 
  | 'heatpump'     // Wärmepumpen
  | 'solar'        // Solar (PV + Thermal)
  | 'boiler'       // Heizkessel
  | 'storage'      // Speicher
  | 'control'      // Steuerungen
  | 'accessory';   // Zubehör

// Produkttyp (Hauptprodukt vs. Zubehör)
export type ProductType = 'main_product' | 'accessory';

// Hersteller/Fachpartner-Referenz
export interface ProductManufacturer {
  id: string;
  name: string;
  brand: string;
}

// Basis-Produktdaten (für alle Produkttypen gleich)
export interface BaseProduct {
  // Identifikation
  id: string;
  name: string;
  model: string;
  description?: string;
  
  // Kategorisierung
  category: ProductCategory;
  type: ProductType;
  
  // Hersteller
  manufacturer: ProductManufacturer;
  
  // Preise
  pricing: {
    retail: number;
    wholesale?: number;
    currency: string;
  };
  
  // Verfügbarkeit
  availability: {
    inStock: boolean;
    quantity?: number;
    leadTime?: string; // z.B. "2-3 Wochen"
  };
  
  // Medien
  media?: {
    images: string[];
    documents?: {
      datasheet?: string;
      manual?: string;
      installation?: string;
    };
  };
  
  // Status
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Technische Daten für Wärmepumpen
export interface HeatPumpTechnicalData {
  // Typ
  heatPumpType: 'air_water' | 'ground_water' | 'water_water' | 'air_air';
  
  // Leistungsdaten (verschiedene Betriebspunkte)
  performance: {
    heatingCapacity: {
      at7_35: number;    // kW bei A7/W35
      at2_35: number;    // kW bei A2/W35
      atMinus7_35: number; // kW bei A-7/W35
    };
    
    coolingCapacity?: {
      at35_18: number;   // kW bei A35/W18 (falls Kühlung möglich)
    };
    
    // COP-Werte (Coefficient of Performance)
    cop: {
      at7_35: number;
      at2_35: number;
      atMinus7_35: number;
    };
    
    // Jahresarbeitszahl
    scop: number; // Seasonal Coefficient of Performance
  };
  
  // Stromverbrauch
  powerConsumption: {
    at7_35: number;    // kW
    at2_35: number;    // kW
    atMinus7_35: number; // kW
    standby: number;   // W
  };
  
  // Effizienzklasse
  energyLabel: string; // z.B. "A+++"
  
  // Technische Eigenschaften
  refrigerant: {
    type: string;      // z.B. "R290", "R32"
    amount: number;    // kg
    gwp: number;       // Global Warming Potential
  };
  
  // Geräuschpegel
  soundLevel: {
    outdoor: number;   // dB(A)
    indoor?: number;   // dB(A)
  };
  
  // Abmessungen und Gewicht
  dimensions: {
    outdoor?: {
      width: number;   // mm
      height: number;  // mm
      depth: number;   // mm
      weight: number;  // kg
    };
    indoor?: {
      width: number;
      height: number;
      depth: number;
      weight: number;
    };
  };
  
  // Anschlüsse
  connections: {
    electrical: string;     // z.B. "400V/3~/50Hz"
    heating: string;        // z.B. "3/4" AG"
    hotWater?: string;
    refrigerant?: string;
  };
  
  // Betriebsbereiche
  operatingLimits: {
    ambient: {
      heating: { min: number; max: number }; // °C
      cooling?: { min: number; max: number };
    };
    water: {
      heating: { min: number; max: number };
      hotWater?: { min: number; max: number };
    };
  };
}

// Technische Daten für Solarmodule
export interface SolarTechnicalData {
  // Typ
  solarType: 'photovoltaic' | 'thermal';
  
  // Für PV-Module
  photovoltaic?: {
    nominalPower: number;    // Wp
    efficiency: number;      // %
    cellType: string;        // z.B. "Monokristallin"
    
    electricalData: {
      voltage: {
        openCircuit: number; // Voc
        maxPower: number;    // Vmpp
      };
      current: {
        shortCircuit: number; // Isc
        maxPower: number;     // Impp
      };
    };
    
    temperatureCoefficient: {
      power: number;         // %/K
      voltage: number;       // %/K
    };
  };
  
  // Für Solarthermie
  thermal?: {
    collectorArea: number;   // m²
    absorberArea: number;    // m²
    efficiency: number;      // %
    
    fluidData: {
      volume: number;        // Liter
      maxPressure: number;   // bar
      antifreeze: string;
    };
    
    temperatureRange: {
      min: number;           // °C
      max: number;           // °C
    };
  };
  
  // Gemeinsame Daten
  dimensions: {
    width: number;           // mm
    height: number;          // mm
    thickness: number;       // mm
    weight: number;          // kg
  };
  
  materials: {
    frame: string;
    glass: string;
    backsheet?: string;
  };
  
  warranty: {
    product: number;         // Jahre
    performance: number;     // Jahre
  };
  
  certifications: string[];
}

// Technische Daten für Zubehör (sehr flexibel)
export interface AccessoryTechnicalData {
  // Grunddaten
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
    length?: number;
    diameter?: number;
    weight?: number;
  };
  
  // Material und Oberfläche
  material?: string;
  finish?: string;
  color?: string;
  
  // Technische Eigenschaften (flexibel für verschiedene Zubehörtypen)
  specifications: Record<string, string | number | boolean>;
  
  // Installation
  installation?: {
    method: string;
    timeRequired?: string;
    toolsRequired?: string[];
    skillLevel: 'simple' | 'moderate' | 'professional';
  };
  
  // Kompatibilität
  compatibleWith?: string[]; // Product IDs oder Modellnummern
}

// Union Type für alle technischen Daten
export type TechnicalData = HeatPumpTechnicalData | SolarTechnicalData | AccessoryTechnicalData;

// Hauptprodukt-Interface
export interface Product extends BaseProduct {
  // Technische Daten (abhängig von der Kategorie)
  technicalData?: TechnicalData;
  
  // Produkteigenschaften
  features?: string[];
  benefits?: string[];
  
  // Standards und Zertifizierungen
  standards?: string[];
  certifications?: string[];
  
  // Installation und Wartung
  installation?: {
    complexity: 'simple' | 'moderate' | 'complex';
    timeRequired?: string;
    specialTools?: string[];
    professionalRequired: boolean;
    instructions?: string;
  };
  
  maintenance?: {
    required: boolean;
    interval?: string;
    tasks?: string[];
    estimatedCost?: number;
  };
  
  // Produktbeziehungen
  relationships?: {
    compatibleWith?: string[];      // IDs kompatibler Produkte
    requiredAccessories?: string[]; // IDs benötigter Zubehörteile
    optionalAccessories?: string[]; // IDs optionaler Zubehörteile
    alternatives?: string[];        // IDs alternativer Produkte
  };
}

// Type Guards für bessere TypeScript-Unterstützung
export function isHeatPump(product: Product): product is Product & { technicalData: HeatPumpTechnicalData } {
  return product.category === 'heatpump' && product.technicalData !== undefined;
}

export function isSolar(product: Product): product is Product & { technicalData: SolarTechnicalData } {
  return product.category === 'solar' && product.technicalData !== undefined;
}

export function isAccessory(product: Product): product is Product & { technicalData: AccessoryTechnicalData } {
  return product.category === 'accessory' && product.technicalData !== undefined;
}

// Filter-Interface für Produktsuche
export interface ProductFilter {
  category?: ProductCategory[];
  type?: ProductType[];
  manufacturer?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  inStockOnly?: boolean;
  searchTerm?: string;
  
  // Spezifische Filter
  heatPumpType?: string[];
  solarType?: string[];
  powerRange?: {
    min: number;
    max: number;
  };
}

// Bulk-Import Interface (für das Anlegen vieler Produkte)
export interface ProductBulkImport {
  manufacturer: ProductManufacturer;
  products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[];
}
