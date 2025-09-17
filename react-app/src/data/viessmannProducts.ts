// Viessmann Wärmepumpen-Produktdaten 2025
import { Product, Manufacturer } from '../types/Product';

export const viessmannManufacturer: Manufacturer = {
  id: 'viessmann',
  name: 'Viessmann',
  logo: '/assets/manufacturers/viessmann-logo.png',
  partnershipLevel: 'premium',
  contactInfo: {
    email: 'partner@viessmann.de',
    phone: '+49 6452 70-0',
    representative: 'Stefan Weber'
  },
  discountRates: {
    standard: 18, // 18% Standardrabatt
    volume: 28,   // 28% ab 15 Geräte
    seasonal: 6   // 6% extra im Winter
  }
};

export const viessmannProducts: Product[] = [
  {
    id: 'viessmann-vitocal-200s-a06',
    sku: 'Z017080',
    name: 'Vitocal 200-S A06',
    description: 'Luft-Wasser-Wärmepumpe für Außenaufstellung, 6 kW, invertergeregelt',
    category: 'heat_pump',
    manufacturer: viessmannManufacturer,
    
    specifications: {
      heatPump: {
        type: 'air_water',
        heatingCapacity: 6.1,
        coolingCapacity: 5.8,
        jahresarbeitszahl: 4.6,
        maxFlowTemperature: 60,
        refrigerant: 'R32',
        soundLevel: 32,
        powerConsumption: 1.3,
        dimensions: {
          width: 1100,
          height: 1350,
          depth: 500
        },
        weight: 140,
        minAmbientTemp: -25,
        maxAmbientTemp: 46
      },
      general: {
        energyLabel: 'A+++',
        installation: 'outdoor',
        connectivity: ['WLAN', 'LAN', 'ViCare App'],
        controls: 'Vitotronic 200',
        maintenance: 'Alle 2 Jahre Wartung'
      }
    },
    
    pricing: {
      listPrice: 9200,
      purchasePrice: 6500,
      salesPrice: 8200,
      margin: 20.7,
      currency: 'EUR',
      validFrom: new Date('2025-01-01'),
      validUntil: new Date('2025-12-31'),
      specialOffers: [
        {
          description: 'Winter-Special 2025',
          discountPercent: 12,
          validUntil: new Date('2025-03-31')
        }
      ]
    },
    
    inventory: {
      inStock: 15,
      reserved: 4,
      ordered: 25,
      minStock: 8,
      maxStock: 40,
      leadTime: 10,
      lastRestocked: new Date('2025-01-12'),
      supplier: 'Viessmann Deutschland'
    },
    
    images: [
      '/assets/products/viessmann-vitocal-200s-a06-front.jpg',
      '/assets/products/viessmann-vitocal-200s-a06-side.jpg'
    ],
    
    documents: {
      datasheet: '/docs/viessmann-vitocal-200s-datenblatt.pdf',
      manual: '/docs/viessmann-vitocal-200s-anleitung.pdf',
      certificate: '/docs/viessmann-ce-zertifikat.pdf'
    },
    
    eligible: {
      bafaFunding: true,
      kfwFunding: true,
      regionalFunding: ['Bayern', 'NRW', 'Baden-Württemberg'],
      certifications: ['CE', 'TÜV Nord', 'EHPA', 'Keymark']
    },
    
    installation: {
      complexity: 'simple',
      estimatedTime: 6,
      requiredPersonnel: 2,
      specialTools: ['Kältemittelleitung', 'Fundamentplatte'],
      additionalMaterials: ['Außenaufstellung-Kit', 'Hydraulikmodul']
    },
    
    isActive: true,
    isDiscontinued: false,
    tags: ['außenaufstellung', 'inverter', 'app-steuerung', 'wetterresistent'],
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-12'),
    createdBy: 'admin'
  },

  {
    id: 'viessmann-vitocal-200s-a10',
    sku: 'Z017081',
    name: 'Vitocal 200-S A10',
    description: 'Luft-Wasser-Wärmepumpe für Außenaufstellung, 10 kW, für größere Einfamilienhäuser',
    category: 'heat_pump',
    manufacturer: viessmannManufacturer,
    
    specifications: {
      heatPump: {
        type: 'air_water',
        heatingCapacity: 10.2,
        coolingCapacity: 9.8,
        jahresarbeitszahl: 4.4,
        maxFlowTemperature: 60,
        refrigerant: 'R32',
        soundLevel: 36,
        powerConsumption: 2.3,
        dimensions: {
          width: 1200,
          height: 1400,
          depth: 550
        },
        weight: 180,
        minAmbientTemp: -25,
        maxAmbientTemp: 46
      },
      general: {
        energyLabel: 'A+++',
        installation: 'outdoor',
        connectivity: ['WLAN', 'LAN', 'ViCare App'],
        controls: 'Vitotronic 200',
        maintenance: 'Alle 2 Jahre Wartung'
      }
    },
    
    pricing: {
      listPrice: 13800,
      purchasePrice: 10200,
      salesPrice: 12500,
      margin: 18.4,
      currency: 'EUR',
      validFrom: new Date('2025-01-01'),
      validUntil: new Date('2025-12-31')
    },
    
    inventory: {
      inStock: 10,
      reserved: 3,
      ordered: 18,
      minStock: 5,
      maxStock: 25,
      leadTime: 10,
      lastRestocked: new Date('2025-01-10'),
      supplier: 'Viessmann Deutschland'
    },
    
    images: [
      '/assets/products/viessmann-vitocal-200s-a10-front.jpg'
    ],
    
    documents: {
      datasheet: '/docs/viessmann-vitocal-200s-datenblatt.pdf',
      manual: '/docs/viessmann-vitocal-200s-anleitung.pdf'
    },
    
    eligible: {
      bafaFunding: true,
      kfwFunding: true,
      regionalFunding: ['Bayern', 'NRW'],
      certifications: ['CE', 'TÜV Nord', 'EHPA', 'Keymark']
    },
    
    installation: {
      complexity: 'simple',
      estimatedTime: 7,
      requiredPersonnel: 2,
      specialTools: ['Kältemittelleitung', 'Fundamentplatte'],
      additionalMaterials: ['Außenaufstellung-Kit', 'Hydraulikmodul']
    },
    
    isActive: true,
    isDiscontinued: false,
    tags: ['außenaufstellung', 'leistungsstark', 'app-steuerung'],
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-10'),
    createdBy: 'admin'
  },

  {
    id: 'viessmann-vitocal-300g-b301',
    sku: 'Z017090',
    name: 'Vitocal 300-G B301',
    description: 'Sole-Wasser-Wärmepumpe mit natürlichem Kältemittel, 8 kW, sehr umweltfreundlich',
    category: 'heat_pump',
    manufacturer: viessmannManufacturer,
    
    specifications: {
      heatPump: {
        type: 'ground_water',
        heatingCapacity: 8.1,
        coolingCapacity: 7.2,
        jahresarbeitszahl: 5.3,
        maxFlowTemperature: 62,
        refrigerant: 'R290 (Propan)',
        soundLevel: 25,
        powerConsumption: 1.5,
        dimensions: {
          width: 650,
          height: 1800,
          depth: 700
        },
        weight: 160,
        minAmbientTemp: -10,
        maxAmbientTemp: 30
      },
      general: {
        energyLabel: 'A+++',
        installation: 'indoor',
        connectivity: ['WLAN', 'LAN', 'ViCare App'],
        controls: 'Vitotronic 200',
        maintenance: 'Alle 3 Jahre Wartung'
      }
    },
    
    pricing: {
      listPrice: 16500,
      purchasePrice: 12200,
      salesPrice: 15200,
      margin: 19.7,
      currency: 'EUR',
      validFrom: new Date('2025-01-01'),
      validUntil: new Date('2025-12-31')
    },
    
    inventory: {
      inStock: 4,
      reserved: 1,
      ordered: 8,
      minStock: 2,
      maxStock: 12,
      leadTime: 18,
      lastRestocked: new Date('2025-01-05'),
      supplier: 'Viessmann Deutschland'
    },
    
    images: [
      '/assets/products/viessmann-vitocal-300g-b301-front.jpg'
    ],
    
    documents: {
      datasheet: '/docs/viessmann-vitocal-300g-datenblatt.pdf'
    },
    
    eligible: {
      bafaFunding: true,
      kfwFunding: true,
      regionalFunding: ['Bayern', 'NRW', 'Baden-Württemberg', 'Thüringen'],
      certifications: ['CE', 'TÜV Nord', 'EHPA', 'Keymark', 'Umweltzeichen']
    },
    
    installation: {
      complexity: 'complex',
      estimatedTime: 14,
      requiredPersonnel: 3,
      specialTools: ['Erdbohrung', 'R290-Werkzeuge', 'Vakuumpumpe'],
      additionalMaterials: ['Erdsonden', 'Sicherheitsventile', 'Pufferspeicher']
    },
    
    isActive: true,
    isDiscontinued: false,
    tags: ['erdwärme', 'natürliches kältemittel', 'sehr effizient', 'umweltfreundlich'],
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-05'),
    createdBy: 'admin'
  }
];

export default viessmannProducts;
