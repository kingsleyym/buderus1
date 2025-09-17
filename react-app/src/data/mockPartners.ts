// Mock-Daten für Fachpartner
import { Partner } from '../components/admin/partners/partner-types';

export const mockPartners: Partner[] = [
  {
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
      standard: 15,
      volume: 25,
      seasonal: 5
    },
    establishedYear: 1731,
    employees: 7000,
    annualRevenue: 2800000000,
    certifications: ['ISO 9001', 'ISO 14001', 'VDE', 'CE'],
    regions: ['Deutschland', 'Österreich', 'Schweiz', 'Niederlande'],
    specialties: ['Wärmepumpen', 'Heiztechnik', 'Systemlösungen'],
    contactHistory: [
      {
        id: '1',
        type: 'meeting',
        subject: 'Jahresverhandlung 2025',
        description: 'Besprechung der Konditionen für 2025',
        contactPerson: 'Thomas Müller',
        date: new Date('2024-12-15'),
        outcome: 'Neue Rabattstruktur vereinbart',
        priority: 'high'
      },
      {
        id: '2',
        type: 'email',
        subject: 'Produktschulung Wärmepumpen',
        description: 'Anfrage nach Schulung für neue Mitarbeiter',
        contactPerson: 'Sarah Klein',
        date: new Date('2024-11-20'),
        priority: 'medium'
      }
    ],
    performance: {
      orderVolume: {
        lastMonth: 245000,
        lastQuarter: 680000,
        lastYear: 2400000
      },
      paymentTerms: {
        averageDays: 28,
        overdueCount: 0
      },
      qualityRating: 4.8,
      responseTime: 2.5,
      supportTickets: {
        open: 1,
        resolved: 23,
        avgResolutionTime: 4.2
      }
    },
    contracts: [
      {
        id: 'c1',
        type: 'distribution',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2026-12-31'),
        terms: 'Exklusivvertrieb Region Süddeutschland',
        discountLevel: 25,
        minimumOrder: 50000,
        isActive: true
      }
    ],
    isActive: true,
    notes: 'Langjähriger Premium-Partner mit excellenter Performance',
    createdAt: new Date('2020-01-15'),
    updatedAt: new Date('2024-12-15')
  },
  
  {
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
      standard: 18,
      volume: 28,
      seasonal: 6
    },
    establishedYear: 1917,
    employees: 12000,
    annualRevenue: 3200000000,
    certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001', 'CE', 'VDE'],
    regions: ['Deutschland', 'Europa', 'International'],
    specialties: ['Wärmepumpen', 'Digitale Lösungen', 'Klimatechnik', 'Kühltechnik'],
    contactHistory: [
      {
        id: '3',
        type: 'contract',
        subject: 'Vertragsverlängerung 2025-2027',
        description: 'Verhandlung über neue Vertragslaufzeit',
        contactPerson: 'Stefan Weber',
        date: new Date('2024-10-30'),
        outcome: 'Vertrag um 2 Jahre verlängert',
        priority: 'high'
      }
    ],
    performance: {
      orderVolume: {
        lastMonth: 320000,
        lastQuarter: 890000,
        lastYear: 3100000
      },
      paymentTerms: {
        averageDays: 25,
        overdueCount: 0
      },
      qualityRating: 4.9,
      responseTime: 1.8,
      supportTickets: {
        open: 0,
        resolved: 31,
        avgResolutionTime: 3.1
      }
    },
    contracts: [
      {
        id: 'c2',
        type: 'distribution',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2027-12-31'),
        terms: 'Vollsortiment-Partner mit erweiterten Konditionen',
        discountLevel: 28,
        minimumOrder: 75000,
        isActive: true
      }
    ],
    isActive: true,
    notes: 'Top-Performance Partner mit innovativen Produkten',
    createdAt: new Date('2019-03-20'),
    updatedAt: new Date('2024-10-30')
  },

  {
    id: 'wolf',
    name: 'Wolf Heiztechnik',
    logo: '/assets/manufacturers/wolf-logo.png',
    partnershipLevel: 'standard',
    contactInfo: {
      email: 'service@wolf.eu',
      phone: '+49 8741 808-0',
      representative: 'Michael Schmidt'
    },
    discountRates: {
      standard: 12,
      volume: 20,
      seasonal: 3
    },
    establishedYear: 1963,
    employees: 2500,
    annualRevenue: 450000000,
    certifications: ['ISO 9001', 'CE', 'VDE'],
    regions: ['Deutschland', 'Österreich'],
    specialties: ['Heiztechnik', 'Wärmepumpen', 'Lüftungstechnik'],
    contactHistory: [
      {
        id: '4',
        type: 'phone',
        subject: 'Lieferzeiten Q1 2025',
        description: 'Nachfrage zu Verfügbarkeiten',
        contactPerson: 'Michael Schmidt',
        date: new Date('2024-12-10'),
        priority: 'medium'
      }
    ],
    performance: {
      orderVolume: {
        lastMonth: 85000,
        lastQuarter: 220000,
        lastYear: 780000
      },
      paymentTerms: {
        averageDays: 32,
        overdueCount: 1
      },
      qualityRating: 4.2,
      responseTime: 6.5,
      supportTickets: {
        open: 3,
        resolved: 18,
        avgResolutionTime: 7.8
      }
    },
    contracts: [
      {
        id: 'c3',
        type: 'distribution',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2025-05-31'),
        terms: 'Standard-Vertriebspartner',
        discountLevel: 20,
        minimumOrder: 25000,
        isActive: true
      }
    ],
    isActive: true,
    notes: 'Solider Partner, Potenzial für Upgrade auf Premium',
    createdAt: new Date('2021-06-15'),
    updatedAt: new Date('2024-12-10')
  },

  {
    id: 'vaillant',
    name: 'Vaillant Group',
    logo: '/assets/manufacturers/vaillant-logo.png',
    partnershipLevel: 'premium',
    contactInfo: {
      email: 'partnership@vaillant.de',
      phone: '+49 2103 901-0',
      representative: 'Andrea Wagner'
    },
    discountRates: {
      standard: 16,
      volume: 24,
      seasonal: 4
    },
    establishedYear: 1874,
    employees: 16000,
    annualRevenue: 3500000000,
    certifications: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'CE'],
    regions: ['Europa', 'China'],
    specialties: ['Wärmepumpen', 'Brennwerttechnik', 'Smart Home'],
    contactHistory: [
      {
        id: '5',
        type: 'meeting',
        subject: 'Smart Home Integration',
        description: 'Präsentation neuer digitaler Lösungen',
        contactPerson: 'Andrea Wagner',
        date: new Date('2024-11-15'),
        outcome: 'Pilotprojekt vereinbart',
        priority: 'high'
      }
    ],
    performance: {
      orderVolume: {
        lastMonth: 180000,
        lastQuarter: 520000,
        lastYear: 1800000
      },
      paymentTerms: {
        averageDays: 30,
        overdueCount: 0
      },
      qualityRating: 4.6,
      responseTime: 3.2,
      supportTickets: {
        open: 2,
        resolved: 27,
        avgResolutionTime: 5.1
      }
    },
    contracts: [
      {
        id: 'c4',
        type: 'distribution',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2025-12-31'),
        terms: 'Premium-Partner mit Smart Home Fokus',
        discountLevel: 24,
        minimumOrder: 40000,
        isActive: true
      }
    ],
    isActive: true,
    notes: 'Innovativer Partner mit Fokus auf Digitalisierung',
    createdAt: new Date('2020-08-10'),
    updatedAt: new Date('2024-11-15')
  },

  {
    id: 'junkers',
    name: 'Junkers Bosch',
    logo: '/assets/manufacturers/junkers-logo.png',
    partnershipLevel: 'basic',
    contactInfo: {
      email: 'info@junkers.com',
      phone: '+49 7154 1309-0',
      representative: 'Klaus Brenner'
    },
    discountRates: {
      standard: 8,
      volume: 15,
      seasonal: 2
    },
    establishedYear: 1895,
    employees: 3800,
    annualRevenue: 580000000,
    certifications: ['ISO 9001', 'CE'],
    regions: ['Deutschland'],
    specialties: ['Gasheizung', 'Wärmepumpen', 'Warmwasser'],
    contactHistory: [
      {
        id: '6',
        type: 'email',
        subject: 'Konditionen-Update',
        description: 'Anfrage nach besseren Konditionen',
        contactPerson: 'Klaus Brenner',
        date: new Date('2024-09-20'),
        priority: 'low'
      }
    ],
    performance: {
      orderVolume: {
        lastMonth: 45000,
        lastQuarter: 130000,
        lastYear: 420000
      },
      paymentTerms: {
        averageDays: 38,
        overdueCount: 2
      },
      qualityRating: 3.8,
      responseTime: 12.0,
      supportTickets: {
        open: 5,
        resolved: 12,
        avgResolutionTime: 15.2
      }
    },
    contracts: [
      {
        id: 'c5',
        type: 'distribution',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        terms: 'Basis-Vertriebspartner',
        discountLevel: 15,
        minimumOrder: 15000,
        isActive: true
      }
    ],
    isActive: true,
    notes: 'Ausbaufähige Partnerschaft, Review erforderlich',
    createdAt: new Date('2022-01-10'),
    updatedAt: new Date('2024-09-20')
  }
];

export default mockPartners;
