// Buderus Wärmepumpen-Produktdaten 2025
import { Product, Manufacturer } from '../types/Product';

export const buderusManufacturer: Manufacturer = {
  id: 'buderus',
  name: 'Buderus',
  logo: '/assets/manufacturers/buderus-logo.png',
  partnershipLevel: 'premium',
  contactInfo: {
    email: 'partner@buderus.de',
    phone: '+49 2771 81-0',
    representative: 'Thomas Müller'
  },
  discountRates: {
    standard: 15, // 15% Standardrabatt
    volume: 25,   // 25% ab 10 Geräte
    seasonal: 5   // 5% extra im Sommer
  }
};

export const buderusProducts: Product[] = [
  {
    id: 'buderus-logatherm-wlw196i-6',
    sku: 'WLW196i-6',
    name: 'Logatherm WLW196i-6',
    description: 'Luft-Wasser-Wärmepumpe für Innenaufstellung, 6 kW Heizleistung, hohe Effizienz',
    category: 'heat_pump',
    manufacturer: buderusManufacturer,
    
    specifications: {
      heatPump: {
        type: 'air_water',
        heatingCapacity: 6.0,
        coolingCapacity: 5.2,
        jahresarbeitszahl: 4.3,
        maxFlowTemperature: 60,
        refrigerant: 'R32',
        soundLevel: 35,
        powerConsumption: 1.4,
        dimensions: {
          width: 600,
          height: 1850,
          depth: 650
        },
        weight: 120,
        minAmbientTemp: -20,
        maxAmbientTemp: 43
      },
      general: {
        energyLabel: 'A+++',
        installation: 'indoor',
        connectivity: ['WLAN', 'LAN', 'Modbus'],
        controls: 'Logamatic EMS plus',
        maintenance: 'Jährliche Wartung empfohlen'
      }
    },
    
    pricing: {
      listPrice: 8500,
      purchasePrice: 6200,
      salesPrice: 7500,
      margin: 17.3,
      currency: 'EUR',
      validFrom: new Date('2025-01-01'),
      validUntil: new Date('2025-12-31'),
      specialOffers: [
        {
          description: 'Frühjahrs-Aktion 2025',
          discountPercent: 8,
          validUntil: new Date('2025-05-31')
        }
      ]
    },
    
    inventory: {
      inStock: 12,
      reserved: 3,
      ordered: 20,
      minStock: 5,
      maxStock: 30,
      leadTime: 14,
      lastRestocked: new Date('2025-01-15'),
      supplier: 'Buderus Deutschland'
    },
    
    images: [
      '/assets/products/buderus-wlw196i-6-front.jpg',
      '/assets/products/buderus-wlw196i-6-side.jpg',
      '/assets/products/buderus-wlw196i-6-controls.jpg'
    ],
    
    documents: {
      datasheet: '/docs/buderus-wlw196i-datenblatt.pdf',
      manual: '/docs/buderus-wlw196i-bedienungsanleitung.pdf',
      certificate: '/docs/buderus-wlw196i-ce-zertifikat.pdf',
      warranty: '/docs/buderus-garantiebedingungen.pdf'
    },
    
    eligible: {
      bafaFunding: true,
      kfwFunding: true,
      regionalFunding: ['Bayern', 'NRW', 'Baden-Württemberg'],
      certifications: ['CE', 'TÜV Süd', 'EHPA']
    },
    
    installation: {
      complexity: 'medium',
      estimatedTime: 8,
      requiredPersonnel: 2,
      specialTools: ['Kältemittelleitung', 'Vakuumpumpe'],
      additionalMaterials: ['Hydraulikmodul', 'Pufferspeicher']
    },
    
    isActive: true,
    isDiscontinued: false,
    tags: ['effizient', 'leise', 'smart', 'innenaufstellung'],
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15'),
    createdBy: 'admin'
  },
  
  {
    id: 'buderus-logatherm-wlw196i-12',
    sku: 'WLW196i-12',
    name: 'Logatherm WLW196i-12',
    description: 'Luft-Wasser-Wärmepumpe für Innenaufstellung, 12 kW Heizleistung, für größere Objekte',
    category: 'heat_pump',
    manufacturer: buderusManufacturer,
    
    specifications: {
      heatPump: {
        type: 'air_water',
        heatingCapacity: 12.0,
        coolingCapacity: 10.5,
        jahresarbeitszahl: 4.1,
        maxFlowTemperature: 60,
        refrigerant: 'R32',
        soundLevel: 38,
        powerConsumption: 2.9,
        dimensions: {
          width: 700,
          height: 1950,
          depth: 750
        },
        weight: 180,
        minAmbientTemp: -20,
        maxAmbientTemp: 43
      },
      general: {
        energyLabel: 'A+++',
        installation: 'indoor',
        connectivity: ['WLAN', 'LAN', 'Modbus'],
        controls: 'Logamatic EMS plus',
        maintenance: 'Jährliche Wartung empfohlen'
      }
    },
    
    pricing: {
      listPrice: 12500,
      purchasePrice: 9200,
      salesPrice: 11200,
      margin: 17.8,
      currency: 'EUR',
      validFrom: new Date('2025-01-01'),
      validUntil: new Date('2025-12-31')
    },
    
    inventory: {
      inStock: 8,
      reserved: 2,
      ordered: 15,
      minStock: 3,
      maxStock: 20,
      leadTime: 14,
      lastRestocked: new Date('2025-01-10'),
      supplier: 'Buderus Deutschland'
    },
    
    images: [
      '/assets/products/buderus-wlw196i-12-front.jpg'
    ],
    
    documents: {
      datasheet: '/docs/buderus-wlw196i-datenblatt.pdf',
      manual: '/docs/buderus-wlw196i-bedienungsanleitung.pdf'
    },
    
    eligible: {
      bafaFunding: true,
      kfwFunding: true,
      regionalFunding: ['Bayern', 'NRW'],
      certifications: ['CE', 'TÜV Süd', 'EHPA']
    },
    
    installation: {
      complexity: 'medium',
      estimatedTime: 10,
      requiredPersonnel: 2,
      specialTools: ['Kältemittelleitung', 'Vakuumpumpe'],
      additionalMaterials: ['Hydraulikmodul', 'Pufferspeicher']
    },
    
    isActive: true,
    isDiscontinued: false,
    tags: ['effizient', 'leistungsstark', 'smart'],
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-10'),
    createdBy: 'admin'
  },

  {
    id: 'buderus-logatherm-wps-4-cool',
    sku: 'WPS-4-Cool',
    name: 'Logatherm WPS-4 Cool',
    description: 'Sole-Wasser-Wärmepumpe mit Kühlfunktion, 4 kW, sehr effizient mit Erdwärme',
    category: 'heat_pump',
    manufacturer: buderusManufacturer,
    
    specifications: {
      heatPump: {
        type: 'ground_water',
        heatingCapacity: 4.2,
        coolingCapacity: 3.8,
        jahresarbeitszahl: 5.1,
        maxFlowTemperature: 58,
        refrigerant: 'R32',
        soundLevel: 28,
        powerConsumption: 0.8,
        dimensions: {
          width: 550,
          height: 1650,
          depth: 600
        },
        weight: 95,
        minAmbientTemp: -15,
        maxAmbientTemp: 35
      },
      general: {
        energyLabel: 'A+++',
        installation: 'indoor',
        connectivity: ['WLAN', 'LAN'],
        controls: 'Logamatic EMS plus',
        maintenance: 'Alle 2 Jahre Wartung'
      }
    },
    
    pricing: {
      listPrice: 11200,
      purchasePrice: 8100,
      salesPrice: 10200,
      margin: 20.5,
      currency: 'EUR',
      validFrom: new Date('2025-01-01'),
      validUntil: new Date('2025-12-31')
    },
    
    inventory: {
      inStock: 6,
      reserved: 1,
      ordered: 10,
      minStock: 2,
      maxStock: 15,
      leadTime: 21,
      lastRestocked: new Date('2025-01-08'),
      supplier: 'Buderus Deutschland'
    },
    
    images: [
      '/assets/products/buderus-wps-4-cool-front.jpg'
    ],
    
    documents: {
      datasheet: '/docs/buderus-wps-4-cool-datenblatt.pdf'
    },
    
    eligible: {
      bafaFunding: true,
      kfwFunding: true,
      regionalFunding: ['Bayern', 'NRW', 'Baden-Württemberg', 'Hessen'],
      certifications: ['CE', 'TÜV Süd', 'EHPA', 'Wärmepumpen-Gütesiegel']
    },
    
    installation: {
      complexity: 'complex',
      estimatedTime: 16,
      requiredPersonnel: 3,
      specialTools: ['Erdbohrung', 'Sole-Kreislauf', 'Vakuumpumpe'],
      additionalMaterials: ['Erdsonden', 'Sole-Verteiler', 'Pufferspeicher']
    },
    
    isActive: true,
    isDiscontinued: false,
    tags: ['erdwärme', 'sehr effizient', 'kühlfunktion', 'leise'],
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-08'),
    createdBy: 'admin'
  }
];

export default buderusProducts;
