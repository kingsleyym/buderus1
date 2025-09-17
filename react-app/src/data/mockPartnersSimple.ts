import { Partner } from '../components/admin/partners/partner-types-simple';

export const mockPartnersSimple: Partner[] = [
  {
    id: '1',
    name: 'Buderus',
    type: 'manufacturer',
    logo: '/assets/partners/buderus-logo.png',
    website: 'https://www.buderus.de',
    email: 'partner@buderus.de',
    phone: '+49 2771 81-0',
    address: {
      street: 'Sophienstraße 30-32',
      city: 'Wetzlar',
      postalCode: '35576',
      country: 'Deutschland'
    },
    contactPerson: {
      name: 'Thomas Müller',
      email: 'thomas.mueller@buderus.de',
      phone: '+49 2771 81-1234',
      position: 'Vertriebsleiter'
    },
    productIds: ['1', '2', '3'], // Wärmepumpen, Heizkessel etc.
    status: 'active',
    contracts: [
      {
        id: 'c1',
        type: 'distribution',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-12-31'),
        terms: 'Exklusiver Vertrieb für Wärmepumpen in der Region',
        discountLevel: 15,
        minimumOrder: 10000,
        isActive: true
      }
    ],
    contactHistory: [
      {
        id: 'h1',
        type: 'meeting',
        subject: 'Vertragsverhandlung 2025',
        description: 'Besprechung der neuen Konditionen für das kommende Jahr',
        contactPerson: 'Thomas Müller',
        date: new Date('2024-11-15'),
        outcome: 'Vertrag verlängert mit 15% Rabatt',
        priority: 'high'
      }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-11-15'),
    notes: 'Wichtiger Premium-Partner für Wärmepumpen'
  },
  {
    id: '2',
    name: 'Viessmann',
    type: 'manufacturer',
    logo: '/assets/partners/viessmann-logo.png',
    website: 'https://www.viessmann.de',
    email: 'partner@viessmann.de',
    phone: '+49 6452 70-0',
    address: {
      street: 'Viessmannstraße 1',
      city: 'Allendorf',
      postalCode: '35108',
      country: 'Deutschland'
    },
    contactPerson: {
      name: 'Sandra Schmidt',
      email: 'sandra.schmidt@viessmann.de',
      phone: '+49 6452 70-2345',
      position: 'Partnermanager'
    },
    productIds: ['4', '5', '6'],
    status: 'active',
    contracts: [
      {
        id: 'c2',
        type: 'service',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2025-02-28'),
        terms: 'Service und Wartung für Viessmann Geräte',
        discountLevel: 12,
        minimumOrder: 5000,
        isActive: true
      }
    ],
    contactHistory: [
      {
        id: 'h2',
        type: 'email',
        subject: 'Neue Produktlinie verfügbar',
        description: 'Information über neue Wärmepumpen-Serie',
        contactPerson: 'Sandra Schmidt',
        date: new Date('2024-10-20'),
        outcome: 'Bestellung von 5 Geräten',
        priority: 'medium'
      }
    ],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-10-20'),
    notes: 'Starker Partner für innovative Heiztechnik'
  }
];
