// Mock-Daten für das neue Produktsystem
// Basiert auf ProductNew.ts Types

import { 
  Product,
  ProductManufacturer
} from '../types/ProductNew';

// Hersteller
export const manufacturers: ProductManufacturer[] = [
  {
    id: 'buderus',
    name: 'Buderus',
    brand: 'Buderus'
  },
  {
    id: 'viessmann',
    name: 'Viessmann',
    brand: 'Viessmann'
  },
  {
    id: 'vaillant',
    name: 'Vaillant',
    brand: 'Vaillant'
  },
  {
    id: 'wolf',
    name: 'Wolf',
    brand: 'Wolf'
  },
  {
    id: 'daikin',
    name: 'Daikin',
    brand: 'Daikin'
  }
];

// Vollständige Produktdaten
export const mockProducts: Product[] = [
  // === WÄRMEPUMPEN ===
  {
    id: 'hp-001',
    name: 'Logatherm WLW196i-6',
    model: 'WLW196i-6',
    description: 'Luft-Wasser-Wärmepumpe für Innenaufstellung, 6 kW Heizleistung',
    category: 'heatpump',
    type: 'main_product',
    manufacturer: manufacturers[0], // Buderus
    isActive: true,
    
    pricing: {
      retail: 8500,
      wholesale: 6200,
      currency: 'EUR'
    },
    
    availability: {
      inStock: true,
      quantity: 12,
      leadTime: '1-2 Wochen'
    },
    
    technicalData: {
      heatPumpType: 'air_water' as const,
      
      performance: {
        heatingCapacity: {
          at7_35: 6.0,
          at2_35: 5.2,
          atMinus7_35: 3.8
        },
        
        coolingCapacity: {
          at35_18: 5.2
        },
        
        cop: {
          at7_35: 4.5,
          at2_35: 3.9,
          atMinus7_35: 2.8
        },
        
        scop: 4.1
      },
      
      powerConsumption: {
        at7_35: 1.33,
        at2_35: 1.33,
        atMinus7_35: 1.36,
        standby: 15
      },
      
      energyLabel: 'A+++',
      
      refrigerant: {
        type: 'R32',
        amount: 1.8,
        gwp: 675
      },
      
      soundLevel: {
        outdoor: 35,
        indoor: 28
      },
      
      dimensions: {
        outdoor: {
          width: 795,
          height: 1340,
          depth: 330,
          weight: 85
        },
        indoor: {
          width: 600,
          height: 1200,
          depth: 600,
          weight: 65
        }
      },
      
      connections: {
        electrical: '230V/1~/50Hz',
        heating: '3/4" AG',
        hotWater: '3/4" AG'
      },
      
      operatingLimits: {
        ambient: {
          heating: { min: -20, max: 35 },
          cooling: { min: 10, max: 43 }
        },
        water: {
          heating: { min: 15, max: 60 },
          hotWater: { min: 10, max: 65 }
        }
      }
    },
    
    features: [
      'Sehr leise im Betrieb',
      'Hohe Effizienz',
      'Einfache Installation',
      'Smart Home kompatibel'
    ],
    
    certifications: ['CE', 'ErP A+++'],
    
    relationships: {
      compatibleWith: ['acc-001', 'acc-002'],
      optionalAccessories: ['acc-003']
    },
    
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-09-01')
  },

  {
    id: 'hp-002', 
    name: 'Logatherm WLW196i-12',
    model: 'WLW196i-12',
    description: 'Luft-Wasser-Wärmepumpe für Innenaufstellung, 12 kW Heizleistung',
    category: 'heatpump',
    type: 'main_product',
    manufacturer: manufacturers[0],
    isActive: true,
    
    pricing: {
      retail: 12500,
      wholesale: 9200,
      currency: 'EUR'
    },
    
    availability: {
      inStock: true,
      quantity: 8,
      leadTime: '2-3 Wochen'
    },
    
    technicalData: {
      heatPumpType: 'air_water' as const,
      
      performance: {
        heatingCapacity: {
          at7_35: 12.0,
          at2_35: 10.5,
          atMinus7_35: 7.8
        },
        
        coolingCapacity: {
          at35_18: 10.5
        },
        
        cop: {
          at7_35: 4.2,
          at2_35: 3.7,
          atMinus7_35: 2.6
        },
        
        scop: 3.9
      },
      
      powerConsumption: {
        at7_35: 2.86,
        at2_35: 2.84,
        atMinus7_35: 3.0,
        standby: 18
      },
      
      energyLabel: 'A+++',
      
      refrigerant: {
        type: 'R32',
        amount: 2.8,
        gwp: 675
      },
      
      soundLevel: {
        outdoor: 38,
        indoor: 32
      },
      
      dimensions: {
        outdoor: {
          width: 950,
          height: 1590,
          depth: 370,
          weight: 125
        },
        indoor: {
          width: 700,
          height: 1400,
          depth: 700,
          weight: 95
        }
      },
      
      connections: {
        electrical: '400V/3~/50Hz',
        heating: '1¼" AG',
        hotWater: '1" AG'
      },
      
      operatingLimits: {
        ambient: {
          heating: { min: -20, max: 35 },
          cooling: { min: 10, max: 43 }
        },
        water: {
          heating: { min: 15, max: 65 },
          hotWater: { min: 10, max: 70 }
        }
      }
    },
    
    features: [
      'Hohe Heizleistung',
      'Für große Objekte geeignet',
      'Inverter-Technologie',
      'R32 Kältemittel'
    ],
    
    certifications: ['CE', 'ErP A+++'],
    
    relationships: {
      compatibleWith: ['acc-001', 'acc-002'],
      optionalAccessories: ['acc-004']
    },
    
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-09-01')
  },

  {
    id: 'hp-003',
    name: 'Vitocal 250-A',
    model: 'AWOT-M-E-AC 251.A10',
    description: 'Viessmann Split-Luft-Wasser-Wärmepumpe mit R32 Kältemittel',
    category: 'heatpump',
    type: 'main_product',
    manufacturer: manufacturers[1], // Viessmann
    isActive: true,
    
    pricing: {
      retail: 18200,
      wholesale: 14560,
      currency: 'EUR'
    },
    
    availability: {
      inStock: true,
      quantity: 5,
      leadTime: '1-2 Wochen'
    },
    
    technicalData: {
      heatPumpType: 'air_water' as const,
      performance: {
        heatingCapacity: {
          at7_35: 10.2,
          at2_35: 9.1,
          atMinus7_35: 6.8
        },
        cop: {
          at7_35: 4.4,
          at2_35: 3.7,
          atMinus7_35: 2.6
        },
        scop: 4.0
      },
      powerConsumption: {
        at7_35: 2.3,
        at2_35: 2.5,
        atMinus7_35: 2.6,
        standby: 12
      },
      energyLabel: 'A++',
      refrigerant: {
        type: 'R32',
        amount: 2.2,
        gwp: 675
      },
      soundLevel: {
        outdoor: 55
      },
      dimensions: {
        outdoor: {
          width: 900,
          height: 1400,
          depth: 350,
          weight: 110
        }
      },
      connections: {
        electrical: '400V/3~/50Hz',
        heating: '1" AG'
      },
      operatingLimits: {
        ambient: {
          heating: { min: -20, max: 35 }
        },
        water: {
          heating: { min: 15, max: 60 }
        }
      }
    },
    
    features: [
      'Split-Bauweise',
      'R32 Kältemittel',
      'Inverter-Technologie',
      'Kompakte Inneneinheit'
    ],
    
    certifications: ['CE', 'ErP A++'],
    
    relationships: {
      requiredAccessories: ['acc-003', 'acc-004'],
      optionalAccessories: ['acc-005', 'acc-006'],
      compatibleWith: ['ctrl-002', 'stor-002']
    },
    
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-15')
  },

  {
    id: 'hp-004',
    name: 'aroTHERM plus VWL 125/6 A',
    model: 'VWL 125/6 A 400V',
    description: 'Vaillant Luft-Wasser-Wärmepumpe mit natürlichem Kältemittel R290',
    category: 'heatpump',
    type: 'main_product',
    manufacturer: manufacturers[2], // Vaillant
    isActive: true,
    
    pricing: {
      retail: 17800,
      wholesale: 14240,
      currency: 'EUR'
    },
    
    availability: {
      inStock: false,
      quantity: 0,
      leadTime: '4-6 Wochen'
    },
    
    technicalData: {
      heatPumpType: 'air_water' as const,
      performance: {
        heatingCapacity: {
          at7_35: 12.8,
          at2_35: 11.2,
          atMinus7_35: 8.9
        },
        cop: {
          at7_35: 4.7,
          at2_35: 4.0,
          atMinus7_35: 3.0
        },
        scop: 4.3
      },
      powerConsumption: {
        at7_35: 2.7,
        at2_35: 2.8,
        atMinus7_35: 3.0,
        standby: 14
      },
      energyLabel: 'A+++',
      refrigerant: {
        type: 'R290',
        amount: 1.9,
        gwp: 3
      },
      soundLevel: {
        outdoor: 52
      },
      dimensions: {
        outdoor: {
          width: 850,
          height: 1350,
          depth: 340,
          weight: 95
        }
      },
      connections: {
        electrical: '400V/3~/50Hz',
        heating: '1¼" AG'
      },
      operatingLimits: {
        ambient: {
          heating: { min: -22, max: 35 }
        },
        water: {
          heating: { min: 15, max: 65 }
        }
      }
    },
    
    features: [
      'R290 Propan (natürlich)',
      'Sehr hohe Effizienz',
      'Umweltfreundlich',
      'Leiser Betrieb'
    ],
    
    certifications: ['CE', 'ErP A+++'],
    
    relationships: {
      requiredAccessories: ['acc-010', 'acc-011'],
      optionalAccessories: ['acc-012', 'acc-013'],
      compatibleWith: ['ctrl-003', 'stor-004']
    },
    
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-08')
  },

  {
    id: 'hp-005',
    name: 'CHA-Monoblock 12kW',
    model: 'CHA-12',
    description: 'Wolf Luft-Wasser-Wärmepumpe im kompakten Monoblock-Design',
    category: 'heatpump',
    type: 'main_product',
    manufacturer: manufacturers[3], // Wolf
    isActive: true,
    
    pricing: {
      retail: 15900,
      wholesale: 12720,
      currency: 'EUR'
    },
    
    availability: {
      inStock: true,
      quantity: 3,
      leadTime: '2-3 Wochen'
    },
    
    technicalData: {
      heatPumpType: 'air_water' as const,
      performance: {
        heatingCapacity: {
          at7_35: 11.8,
          at2_35: 10.3,
          atMinus7_35: 7.8
        },
        cop: {
          at7_35: 4.3,
          at2_35: 3.6,
          atMinus7_35: 2.7
        },
        scop: 3.9
      },
      powerConsumption: {
        at7_35: 2.7,
        at2_35: 2.9,
        atMinus7_35: 2.9,
        standby: 16
      },
      energyLabel: 'A++',
      refrigerant: {
        type: 'R32',
        amount: 2.4,
        gwp: 675
      },
      soundLevel: {
        outdoor: 56
      },
      dimensions: {
        outdoor: {
          width: 920,
          height: 1450,
          depth: 360,
          weight: 115
        }
      },
      connections: {
        electrical: '400V/3~/50Hz',
        heating: '1¼" AG'
      },
      operatingLimits: {
        ambient: {
          heating: { min: -20, max: 35 }
        },
        water: {
          heating: { min: 15, max: 60 }
        }
      }
    },
    
    features: [
      'Monoblock-Design',
      'Einfache Installation',
      'Kompakte Bauweise',
      'Robuste Bauart'
    ],
    
    certifications: ['CE', 'ErP A++'],
    
    relationships: {
      requiredAccessories: ['acc-014', 'acc-015'],
      optionalAccessories: ['acc-016', 'acc-017'],
      compatibleWith: ['ctrl-004', 'stor-005']
    },
    
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-12')
  },

  // === SOLAR SYSTEME ===
  {
    id: 'sol-001',
    name: 'Logasol SKT1.0',
    model: 'SKT1.0',
    description: 'Flachkollektor für Solarthermie, 2,3 m² Aperturfläche',
    category: 'solar',
    type: 'main_product',
    manufacturer: manufacturers[0],
    isActive: true,
    
    pricing: {
      retail: 1200,
      wholesale: 850,
      currency: 'EUR'
    },
    
    availability: {
      inStock: true,
      quantity: 25,
      leadTime: '1 Woche'
    },
    
    technicalData: {
      solarType: 'thermal' as const,
      
      thermal: {
        collectorArea: 2.51,
        absorberArea: 2.3,
        efficiency: 82,
        
        fluidData: {
          volume: 1.8,
          maxPressure: 10,
          antifreeze: 'Propylenglykol'
        },
        
        temperatureRange: {
          min: -30,
          max: 120
        }
      },
      
      dimensions: {
        width: 1200,
        height: 2000,
        thickness: 100,
        weight: 45
      },
      
      materials: {
        frame: 'Aluminium eloxiert',
        glass: 'Solarglas 3,2mm entspiegelt',
        backsheet: 'Mineralwolle-Dämmung'
      },
      
      warranty: {
        product: 10,
        performance: 20
      },
      
      certifications: ['Solar Keymark', 'CE', 'ISO 9806']
    },
    
    features: [
      'Hoher Wirkungsgrad',
      'Wetterbeständig',
      'Einfache Montage',
      '10 Jahre Garantie'
    ],
    
    certifications: ['Solar Keymark', 'CE'],
    
    relationships: {
      compatibleWith: ['hp-001', 'hp-002'],
      requiredAccessories: ['acc-005']
    },
    
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-08-15')
  },

  {
    id: 'sol-002',
    name: 'Vitosol 300-TM',
    model: 'SP3A',
    description: 'Viessmann Röhrenkollektor mit CPC-Reflektor für optimale Energieausbeute',
    category: 'solar',
    type: 'main_product',
    manufacturer: manufacturers[1], // Viessmann
    isActive: true,
    
    pricing: {
      retail: 1650,
      wholesale: 1320,
      currency: 'EUR'
    },
    
    availability: {
      inStock: true,
      quantity: 8,
      leadTime: '2 Wochen'
    },
    
    technicalData: {
      solarType: 'thermal' as const,
      thermal: {
        collectorArea: 3.02,
        absorberArea: 2.51,
        efficiency: 82.1,
        fluidData: {
          volume: 2.1,
          maxPressure: 10,
          antifreeze: 'Propylenglykol'
        },
        temperatureRange: {
          min: -30,
          max: 210
        }
      },
      dimensions: {
        width: 1310,
        height: 2330,
        thickness: 115,
        weight: 58
      },
      materials: {
        frame: 'Aluminium eloxiert',
        glass: 'Borosilikatglas'
      },
      
      warranty: {
        product: 10,
        performance: 25
      },
      
      certifications: ['CE', 'Solar Keymark']
    },
    
    features: [
      'CPC-Reflektor',
      'Röhrenkollektor',
      'Hohe Effizienz',
      'Witterungsbeständig'
    ],
    
    certifications: ['CE', 'Solar Keymark'],
    
    relationships: {
      requiredAccessories: ['acc-007', 'acc-008'],
      compatibleWith: ['stor-003', 'ctrl-003']
    },
    
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-03-18')
  },

  // === SPEICHER ===
  {
    id: 'stor-001',
    name: 'Logalux PNR500-120/5E',
    model: 'PNR500-120',
    description: 'Buderus Pufferspeicher 500 Liter mit einem Wärmetauscher',
    category: 'storage',
    type: 'main_product',
    manufacturer: manufacturers[0], // Buderus
    isActive: true,
    
    pricing: {
      retail: 2200,
      wholesale: 1760,
      currency: 'EUR'
    },
    
    availability: {
      inStock: true,
      quantity: 6,
      leadTime: '1-2 Wochen'
    },
    
    technicalData: {
      specifications: {
        volume: 500,
        maxTemperature: 95,
        maxPressure: 3,
        insulation: 'PU-Hartschaum 100mm',
        connections: '6x G1" AG',
        height: 1755,
        diameter: 750,
        weight: 95
      }
    },
    
    features: [
      '500 Liter Volumen',
      'Ein Wärmetauscher',
      'Hochwertige Isolierung',
      'Vielseitige Anschlüsse'
    ],
    
    certifications: ['CE', 'Druckbehälterverordnung'],
    
    relationships: {
      compatibleWith: ['hp-001', 'hp-002', 'sol-001'],
      requiredAccessories: ['acc-009', 'acc-010']
    },
    
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-02-28')
  },

  {
    id: 'stor-002',
    name: 'Logalux SU300/5W',
    model: 'SU300/5W',
    description: 'Solarspeicher 300 Liter mit 2 Wärmetauschern',
    category: 'storage',
    type: 'main_product',
    manufacturer: manufacturers[0], // Buderus
    isActive: true,
    
    pricing: {
      retail: 1850,
      wholesale: 1480,
      currency: 'EUR'
    },
    
    availability: {
      inStock: true,
      quantity: 4,
      leadTime: '2 Wochen'
    },
    
    technicalData: {
      specifications: {
        volume: 300,
        maxTemperature: 95,
        maxPressure: 10,
        heatExchangers: 2,
        insulation: 'PU-Hartschaum 80mm',
        height: 1580,
        diameter: 650,
        weight: 78
      }
    },
    
    features: [
      '300 Liter Volumen',
      'Zwei Wärmetauscher',
      'Solar optimiert',
      'Kompakte Bauweise'
    ],
    
    certifications: ['CE', 'Druckbehälterverordnung'],
    
    relationships: {
      compatibleWith: ['sol-001', 'sol-002', 'hp-001'],
      requiredAccessories: ['acc-032', 'acc-033']
    },
    
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-03-02')
  },

  // === STEUERUNGEN ===
  {
    id: 'ctrl-001',
    name: 'Logamatic EMS plus',
    model: 'EMS plus',
    description: 'Intelligente Heizungsregelung mit Smart-Home Integration',
    category: 'control',
    type: 'main_product',
    manufacturer: manufacturers[0], // Buderus
    isActive: true,
    
    pricing: {
      retail: 890,
      wholesale: 712,
      currency: 'EUR'
    },
    
    availability: {
      inStock: true,
      quantity: 12,
      leadTime: '1 Woche'
    },
    
    technicalData: {
      specifications: {
        display: 'Farbdisplay 4.3"',
        connectivity: 'WiFi, Ethernet, EMS-Bus',
        zones: 4,
        sensors: 8,
        weatherCompensation: true,
        smartHome: 'KNX, Modbus',
        app: 'MyDevice App'
      }
    },
    
    features: [
      'Farbdisplay',
      'WiFi-fähig',
      'App-Steuerung',
      'Smart Home Ready'
    ],
    
    certifications: ['CE', 'KNX zertifiziert'],
    
    relationships: {
      compatibleWith: ['hp-001', 'stor-001', 'stor-002'],
      requiredAccessories: ['acc-034', 'acc-035']
    },
    
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-02-25')
  },

  {
    id: 'ctrl-002',
    name: 'Vitotronic 300-K',
    model: 'MW2D',
    description: 'Viessmann Universalregelung für Wärmepumpen und Heizkessel',
    category: 'control',
    type: 'main_product',
    manufacturer: manufacturers[1], // Viessmann
    isActive: true,
    
    pricing: {
      retail: 1150,
      wholesale: 920,
      currency: 'EUR'
    },
    
    availability: {
      inStock: true,
      quantity: 7,
      leadTime: '1-2 Wochen'
    },
    
    technicalData: {
      specifications: {
        display: 'Grafik-Display',
        connectivity: 'LON-Bus, KNX',
        zones: 6,
        sensors: 12,
        weatherCompensation: true,
        app: 'ViCare App'
      }
    },
    
    features: [
      'Grafik-Display',
      'App-Steuerung',
      'Wettergeführt',
      'Mehrzonen-Regelung'
    ],
    
    certifications: ['CE', 'KNX zertifiziert'],
    
    relationships: {
      compatibleWith: ['hp-003', 'stor-002'],
      requiredAccessories: ['acc-011', 'acc-012']
    },
    
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-20')
  },

  // === ZUBEHÖR ===
  {
    id: 'acc-001',
    name: 'Smart Thermostat BC100',
    model: 'BC100',
    description: 'Intelligenter Raumthermostat mit App-Steuerung',
    category: 'control',
    type: 'accessory',
    manufacturer: manufacturers[0],
    isActive: true,
    
    pricing: {
      retail: 320,
      wholesale: 220,
      currency: 'EUR'
    },
    
    availability: {
      inStock: true,
      quantity: 50,
      leadTime: '3-5 Tage'
    },
    
    technicalData: {
      dimensions: {
        width: 80,
        height: 80,
        depth: 25,
        weight: 0.2
      },
      
      material: 'ABS Kunststoff',
      finish: 'Matt weiß',
      color: 'Weiß',
      
      specifications: {
        displayType: '3.5" TFT Farb-Display',
        touchscreen: true,
        backlighting: true,
        
        wifi: true,
        bluetooth: true,
        ethernet: false,
        protocol: 'OpenTherm',
        
        powerSupply: 'Batterie + 24V',
        batteryLife: '2 Jahre',
        batteryType: '2x AA',
        
        tempRange: '-5°C bis +50°C',
        accuracy: '±0.5°C',
        resolution: '0.1°C',
        
        timePrograms: 6,
        holidayMode: true,
        partyMode: true,
        
        appControl: true,
        voiceControl: 'Amazon Alexa, Google Assistant',
        automation: true,
        energyMonitoring: true
      },
      
      installation: {
        method: 'Wandmontage',
        timeRequired: '30 Minuten',
        toolsRequired: ['Schraubendreher', 'Bohrmaschine'],
        skillLevel: 'simple' as const
      },
      
      compatibleWith: ['hp-001', 'hp-002']
    },
    
    features: [
      'WiFi und Bluetooth',
      'App-Steuerung',
      'Zeitprogramme',
      'Energiesparfunktionen'
    ],
    
    certifications: ['CE'],
    
    relationships: {
      compatibleWith: ['hp-001', 'hp-002']
    },
    
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-09-01')
  },

  {
    id: 'acc-002',
    name: 'Pufferspeicher 300L',
    model: 'PS300',
    description: 'Pufferspeicher 300 Liter für Wärmepumpen',
    category: 'storage',
    type: 'accessory',
    manufacturer: manufacturers[0],
    isActive: true,
    
    pricing: {
      retail: 1800,
      wholesale: 1300,
      currency: 'EUR'
    },
    
    availability: {
      inStock: true,
      quantity: 15,
      leadTime: '1-2 Wochen'
    },
    
    technicalData: {
      dimensions: {
        width: 650,
        height: 1500,
        diameter: 650,
        weight: 85
      },
      
      material: 'Stahl beschichtet',
      finish: 'Pulverbeschichtung',
      color: 'RAL 9016 Weiß',
      
      specifications: {
        volume: 300,
        usableVolume: 285,
        heatExchangerArea: 1.8,
        
        maxPressure: 6,
        testPressure: 9,
        
        maxTemperature: 95,
        standbyLoss: 2.1,
        
        insulation: 'PU-Schaum 100mm',
        insulationClass: 'B',
        thermalConductivity: 0.024,
        
        heatingFlow: 'R1" AG',
        heatingReturn: 'R1" AG',
        sensorPockets: 3,
        drainValve: 'R½" IG',
        
        pressureVessel: true,
        ce_marking: true,
        efficiency_class: 'B'
      },
      
      installation: {
        method: 'Rohrmontage',
        timeRequired: '2 Stunden',
        toolsRequired: ['Rohrzange', 'Dichtmaterial', 'Anschlussrohre'],
        skillLevel: 'professional' as const
      },
      
      compatibleWith: ['hp-001', 'hp-002']
    },
    
    features: [
      '300 Liter Volumen',
      'Hochwertige Isolierung',
      '5 Jahre Garantie',
      'Kompakte Bauweise'
    ],
    
    certifications: ['CE', 'Druckbehälterverordnung'],
    
    relationships: {
      compatibleWith: ['hp-001', 'hp-002']
    },
    
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-08-20')
  },

  {
    id: 'acc-003',
    name: 'Betonfundament WP-12',
    model: 'FUND-WP12',
    description: 'Vorgefertigtes Betonfundament für Wärmepumpen bis 12kW',
    category: 'accessory',
    type: 'accessory',
    manufacturer: manufacturers[0], // Buderus
    isActive: true,
    
    pricing: {
      retail: 450,
      wholesale: 360,
      currency: 'EUR'
    },
    
    availability: {
      inStock: true,
      quantity: 20,
      leadTime: '1 Woche'
    },
    
    technicalData: {
      specifications: {
        material: 'Stahlbeton C25/30',
        dimensions: '1500x800x200mm',
        weight: 480,
        loadCapacity: '2000kg',
        drainage: 'integriert'
      },
      installation: {
        method: 'Fundamentmontage',
        timeRequired: '2-3 Stunden',
        skillLevel: 'moderate' as const
      }
    },
    
    features: [
      'Vorgefertigt',
      'Drainage integriert',
      'Hohe Tragkraft',
      'Witterungsbeständig'
    ],
    
    certifications: ['CE', 'DIN EN 206'],
    
    relationships: {
      compatibleWith: ['hp-001', 'hp-002', 'hp-003']
    },
    
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-02-20')
  },

  {
    id: 'acc-004',
    name: 'Schallschutz-Haube Premium',
    model: 'SSH-Premium',
    description: 'Hochwertige Schallschutzhaube zur Geräuschreduzierung',
    category: 'accessory',
    type: 'accessory',
    manufacturer: manufacturers[0], // Buderus
    isActive: true,
    
    pricing: {
      retail: 650,
      wholesale: 520,
      currency: 'EUR'
    },
    
    availability: {
      inStock: true,
      quantity: 8,
      leadTime: '2 Wochen'
    },
    
    technicalData: {
      specifications: {
        material: 'Aluminium pulverbeschichtet',
        insulation: 'Mineralwolle 50mm',
        reduction: '8-12 dB(A)',
        ventilation: 'optimiert',
        weather: 'witterungsbeständig'
      },
      installation: {
        method: 'Aufbaumontage',
        timeRequired: '1-2 Stunden',
        skillLevel: 'moderate' as const
      }
    },
    
    features: [
      'Schallreduktion 8-12 dB',
      'Optimierte Belüftung',
      'Einfache Montage',
      'Korrosionsschutz'
    ],
    
    certifications: ['CE', 'Brandschutz B1'],
    
    relationships: {
      compatibleWith: ['hp-001', 'hp-002', 'hp-003']
    },
    
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-10')
  },

  {
    id: 'acc-005',
    name: 'Edelstahl-Schrauben-Set WP',
    model: 'ESS-WP-Pro',
    description: 'Hochwertiges Schrauben-Set aus Edelstahl für Außenaufstellung',
    category: 'accessory',
    type: 'accessory',
    manufacturer: manufacturers[0], // Buderus
    isActive: true,
    
    pricing: {
      retail: 85,
      wholesale: 68,
      currency: 'EUR'
    },
    
    availability: {
      inStock: true,
      quantity: 50,
      leadTime: '2-3 Tage'
    },
    
    technicalData: {
      specifications: {
        material: 'Edelstahl A2/A4',
        coating: 'korrosionsbeständig',
        includes: 'Schrauben M8-M16, Muttern, Unterlegscheiben',
        quantity: '50 Teile',
        torque: 'bis 25 Nm'
      },
      installation: {
        method: 'Schraubmontage',
        timeRequired: '15-30 Min',
        skillLevel: 'simple' as const
      }
    },
    
    features: [
      'Edelstahl-Qualität',
      'Korrosionsbeständig',
      'Komplettes Set',
      'Verschiedene Größen'
    ],
    
    certifications: ['CE', 'DIN ISO 3506'],
    
    relationships: {
      compatibleWith: ['hp-001', 'hp-002', 'hp-003', 'acc-003', 'acc-004']
    },
    
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-03-05')
  },

  {
    id: 'acc-006',
    name: 'Hydraulik-Anschluss-Set Standard',
    model: 'HAS-Standard',
    description: 'Komplett-Set für die hydraulische Anbindung von Wärmepumpen',
    category: 'accessory',
    type: 'accessory',
    manufacturer: manufacturers[0],
    isActive: true,
    
    pricing: {
      retail: 280,
      wholesale: 224,
      currency: 'EUR'
    },
    
    availability: {
      inStock: true,
      quantity: 35,
      leadTime: '3-5 Tage'
    },
    
    technicalData: {
      specifications: {
        includes: 'Verschraubungen, Dichtungen, Absperrventile',
        material: 'Messing vernickelt',
        connections: '1" AG/IG',
        pressure: '10 bar',
        temperature: '120°C'
      },
      installation: {
        method: 'Rohranschluss',
        timeRequired: '30-45 Min',
        skillLevel: 'simple' as const
      }
    },
    
    features: [
      'Vollständiges Anschluss-Set',
      'Hochwertige Materialien',
      'Einfache Installation',
      'Alle Dichtungen inklusive'
    ],
    
    certifications: ['CE', 'DVGW'],
    
    relationships: {
      compatibleWith: ['hp-001', 'hp-002', 'hp-003', 'hp-004', 'hp-005']
    },
    
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-01')
  }
];

export default mockProducts;
