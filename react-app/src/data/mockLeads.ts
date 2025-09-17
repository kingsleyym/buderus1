import { Lead } from '../types/Lead';

export const mockLeads: Lead[] = [
  {
    id: '1',
    firstName: 'Maria',
    lastName: 'Schmidt',
    email: 'maria.schmidt@email.com',
    phone: '+49 89 12345678',
    address: {
      street: 'Maximilianstraße 15',
      city: 'München',
      postalCode: '80539',
      state: 'Bayern',
      country: 'Deutschland'
    },
    source: {
      type: 'salesperson',
      sourceId: 'benjamin-karimi',
      sourceName: 'Benjamin Karimi',
    },
    commission: {
      salespersonId: 'benjamin-karimi',
      salespersonRate: 3.5,
      leadCost: 0,
    },
    status: {
      current: 'qualified',
      lastChanged: new Date('2024-01-16'),
      changedBy: 'benjamin-karimi',
      reason: 'Kunde zeigt starkes Interesse'
    },
    priority: 'high',
    products: [
      {
        id: 'prod1',
        name: 'Luft-Wasser-Wärmepumpe Premium',
        category: 'heat_pump',
        type: 'Luft-Wasser',
        estimatedValue: 15000,
        specifications: {
          heatingArea: 180,
          propertyType: 'Neubau',
          efficiency: 'A+++',
          warranty: '10 Jahre'
        }
      }
    ],
    totalEstimatedValue: 15000,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    lastContact: new Date('2024-01-16'),
    nextFollowUp: new Date('2024-01-20'),
    history: [
      {
        id: 'hist1',
        timestamp: new Date('2024-01-15'),
        action: 'created',
        description: 'Lead erstellt durch Direktakquise',
        performedBy: 'benjamin-karimi'
      },
      {
        id: 'hist2',
        timestamp: new Date('2024-01-15'),
        action: 'contacted',
        description: 'Erstkontakt telefonisch - Interesse bestätigt',
        performedBy: 'benjamin-karimi'
      },
      {
        id: 'hist3',
        timestamp: new Date('2024-01-16'),
        action: 'email_sent',
        description: 'Informationsmail mit Produktbroschüre versendet',
        performedBy: 'benjamin-karimi',
        details: { emailId: 'email_123' }
      },
      {
        id: 'hist4',
        timestamp: new Date('2024-01-16'),
        action: 'status_changed',
        description: 'Status geändert von "contacted" zu "qualified"',
        performedBy: 'benjamin-karimi',
        previousStatus: 'contacted',
        newStatus: 'qualified'
      }
    ],
    notes: [
      'Kunde sehr interessiert an umweltfreundlicher Heizung',
      'Neubau wird im März bezugsfertig',
      'Budget ist vorhanden'
    ],
    tags: ['premium', 'neubau', 'umweltbewusst'],
    appointments: [],
    proposals: [],
    invoices: [],
    emails: ['email_123']
  },
  {
    id: '2',
    firstName: 'Thomas',
    lastName: 'Müller',
    email: 'thomas.mueller@email.com',
    phone: '+49 30 98765432',
    address: {
      city: 'Berlin',
      postalCode: '10115',
      state: 'Berlin',
      country: 'Deutschland'
    },
    source: {
      type: 'purchased',
      sourceName: 'LeadProvider GmbH',
      cost: 45.00,
    },
    commission: {
      salespersonId: 'sandro-iavocozzi',
      salespersonRate: 2.5,
      leadCost: 45.00,
    },
    status: {
      current: 'not_reachable',
      lastChanged: new Date('2024-01-14'),
      changedBy: 'sandro-iavocozzi',
      reason: '3x angerufen, keine Antwort'
    },
    priority: 'medium',
    products: [
      {
        id: 'prod2',
        name: 'Sole-Wasser-Wärmepumpe Standard',
        category: 'heat_pump',
        type: 'Sole-Wasser',
        estimatedValue: 12000,
        specifications: {
          heatingArea: 150,
          propertyType: 'Sanierung',
          efficiency: 'A++',
          warranty: '7 Jahre'
        }
      }
    ],
    totalEstimatedValue: 12000,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-14'),
    lastContact: null,
    nextFollowUp: new Date('2024-01-25'),
    history: [
      {
        id: 'hist5',
        timestamp: new Date('2024-01-12'),
        action: 'created',
        description: 'Lead von LeadProvider GmbH eingekauft',
        performedBy: 'system'
      },
      {
        id: 'hist6',
        timestamp: new Date('2024-01-12'),
        action: 'contacted',
        description: '1. Anrufversuch - Mailbox',
        performedBy: 'sandro-iavocozzi'
      },
      {
        id: 'hist7',
        timestamp: new Date('2024-01-13'),
        action: 'contacted',
        description: '2. Anrufversuch - nicht erreichbar',
        performedBy: 'sandro-iavocozzi'
      },
      {
        id: 'hist8',
        timestamp: new Date('2024-01-14'),
        action: 'contacted',
        description: '3. Anrufversuch - nicht erreichbar',
        performedBy: 'sandro-iavocozzi'
      },
      {
        id: 'hist9',
        timestamp: new Date('2024-01-14'),
        action: 'status_changed',
        description: 'Status geändert zu "nicht erreichbar" nach 3 Versuchen',
        performedBy: 'sandro-iavocozzi',
        previousStatus: 'contacted',
        newStatus: 'not_reachable'
      }
    ],
    notes: [
      'Gekaufter Lead - Qualität fraglich',
      '3x angerufen ohne Erfolg',
      'E-Mail-Follow-up geplant'
    ],
    tags: ['gekauft', 'nicht-erreichbar', 'follow-up'],
    appointments: [],
    proposals: [],
    invoices: [],
    emails: []
  },
  {
    id: '3',
    firstName: 'Anna',
    lastName: 'Weber',
    email: 'anna.weber@email.com',
    phone: '+49 40 11223344',
    address: {
      city: 'Hamburg',
      postalCode: '20095',
      state: 'Hamburg',
      country: 'Deutschland'
    },
    source: {
      type: 'affiliate',
      sourceId: 'partner-123',
      sourceName: 'Heizung-Portal.de',
      affiliateCode: 'HP123',
      campaignId: 'winter-2024'
    },
    commission: {
      salespersonId: 'giacomo-peiser',
      salespersonRate: 3.0,
      affiliateId: 'partner-123',
      affiliateRate: 1.5,
      leadCost: 0,
    },
    status: {
      current: 'proposal_sent',
      lastChanged: new Date('2024-01-15'),
      changedBy: 'giacomo-peiser',
      reason: 'Angebot nach Beratungstermin erstellt'
    },
    priority: 'high',
    products: [
      {
        id: 'prod3',
        name: 'Luft-Wasser-Wärmepumpe Premium Plus',
        category: 'heat_pump',
        type: 'Luft-Wasser',
        estimatedValue: 18000,
        specifications: {
          heatingArea: 220,
          propertyType: 'Einfamilienhaus',
          efficiency: 'A+++',
          warranty: '12 Jahre'
        }
      }
    ],
    totalEstimatedValue: 18000,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    lastContact: new Date('2024-01-15'),
    nextFollowUp: new Date('2024-01-18'),
    history: [
      {
        id: 'hist10',
        timestamp: new Date('2024-01-10'),
        action: 'created',
        description: 'Lead über Affiliate-Partner Heizung-Portal.de',
        performedBy: 'system'
      },
      {
        id: 'hist11',
        timestamp: new Date('2024-01-11'),
        action: 'contacted',
        description: 'Erstkontakt - sehr interessiert',
        performedBy: 'giacomo-peiser'
      },
      {
        id: 'hist12',
        timestamp: new Date('2024-01-13'),
        action: 'meeting_scheduled',
        description: 'Beratungstermin vor Ort vereinbart',
        performedBy: 'giacomo-peiser',
        details: { appointmentId: 'app_456' }
      },
      {
        id: 'hist13',
        timestamp: new Date('2024-01-15'),
        action: 'proposal_sent',
        description: 'Individuelles Angebot erstellt und versendet',
        performedBy: 'giacomo-peiser',
        details: { proposalId: 'prop_789' }
      },
      {
        id: 'hist14',
        timestamp: new Date('2024-01-15'),
        action: 'status_changed',
        description: 'Status geändert zu "Angebot versendet"',
        performedBy: 'giacomo-peiser',
        previousStatus: 'qualified',
        newStatus: 'proposal_sent'
      }
    ],
    notes: [
      'Affiliate-Lead mit hoher Qualität',
      'Kunde sehr zufrieden mit Beratung',
      'Entscheidung bis Ende Januar erwartet'
    ],
    tags: ['affiliate', 'premium', 'hot-lead'],
    appointments: ['app_456'],
    proposals: ['prop_789'],
    invoices: [],
    emails: ['email_234', 'email_235']
  },
  {
    id: '6',
    firstName: 'Klaus',
    lastName: 'Hoffmann',
    email: 'klaus.hoffmann@email.com',
    phone: '+49 221 7654321',
    address: {
      street: 'Rheinstraße 42',
      city: 'Köln',
      postalCode: '50676',
      state: 'NRW',
      country: 'Deutschland'
    },
    source: {
      type: 'salesperson',
      sourceId: 'david-sawall',
      sourceName: 'David Sawall',
    },
    commission: {
      salespersonId: 'david-sawall',
      salespersonRate: 4.0,
      leadCost: 0,
      totalCommissionDue: 720,
      commissionPaid: true,
      paymentDate: new Date('2024-01-25')
    },
    status: {
      current: 'closed_won',
      lastChanged: new Date('2024-01-22'),
      changedBy: 'david-sawall',
      reason: 'Vertrag erfolgreich abgeschlossen'
    },
    priority: 'high',
    products: [
      {
        id: 'prod6',
        name: 'Hybrid-Wärmepumpe Premium Plus',
        category: 'heat_pump',
        type: 'Hybrid-System',
        estimatedValue: 18000,
        finalValue: 18000,
        specifications: {
          heatingArea: 200,
          propertyType: 'Altbau-Sanierung',
          efficiency: 'A+++',
          warranty: '15 Jahre',
          installationType: 'Komplett-System'
        }
      }
    ],
    totalEstimatedValue: 18000,
    totalFinalValue: 18000,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-25'),
    lastContact: new Date('2024-01-22'),
    conversionDate: new Date('2024-01-22'),
    history: [
      {
        id: 'hist20',
        timestamp: new Date('2024-01-05'),
        action: 'created',
        description: 'Lead durch Direktakquise von David Sawall',
        performedBy: 'david-sawall'
      },
      {
        id: 'hist21',
        timestamp: new Date('2024-01-05'),
        action: 'contacted',
        description: 'Erstkontakt sehr erfolgreich - sofortiges Interesse',
        performedBy: 'david-sawall'
      },
      {
        id: 'hist22',
        timestamp: new Date('2024-01-08'),
        action: 'meeting_scheduled',
        description: 'Beratungstermin vor Ort für kommende Woche vereinbart',
        performedBy: 'david-sawall',
        details: { appointmentId: 'app_100' }
      },
      {
        id: 'hist23',
        timestamp: new Date('2024-01-12'),
        action: 'meeting_scheduled',
        description: 'Vor-Ort-Beratung durchgeführt - Kunde sehr zufrieden',
        performedBy: 'david-sawall'
      },
      {
        id: 'hist24',
        timestamp: new Date('2024-01-15'),
        action: 'proposal_sent',
        description: 'Detailliertes Angebot mit Finanzierungsoptionen gesendet',
        performedBy: 'david-sawall',
        details: { proposalId: 'prop_100' }
      },
      {
        id: 'hist25',
        timestamp: new Date('2024-01-18'),
        action: 'negotiation_started',
        description: 'Verhandlung über Installationszeitpunkt',
        performedBy: 'david-sawall'
      },
      {
        id: 'hist26',
        timestamp: new Date('2024-01-22'),
        action: 'contract_signed',
        description: 'Vertrag erfolgreich unterzeichnet!',
        performedBy: 'david-sawall'
      },
      {
        id: 'hist27',
        timestamp: new Date('2024-01-22'),
        action: 'status_changed',
        description: 'Lead erfolgreich gewonnen - Status auf "closed_won"',
        performedBy: 'david-sawall',
        previousStatus: 'negotiation',
        newStatus: 'closed_won'
      },
      {
        id: 'hist28',
        timestamp: new Date('2024-01-25'),
        action: 'installation_scheduled',
        description: 'Installation für März 2024 geplant',
        performedBy: 'david-sawall'
      }
    ],
    notes: [
      'Exzellenter Kunde - sehr kooperativ',
      'Empfehlung an Nachbarn bereits zugesagt',
      'Referenzkunde für zukünftige Projekte',
      'Installation läuft perfekt nach Plan'
    ],
    tags: ['gewonnen', 'referenzkunde', 'premium', 'david-top-performer'],
    appointments: ['app_100'],
    proposals: ['prop_100'],
    invoices: ['inv_100'],
    emails: ['email_300', 'email_301', 'email_302'],
    customerLifetimeValue: 18000
  },
  {
    id: '7',
    firstName: 'Sarah',
    lastName: 'Fischer',
    email: 'sarah.fischer@email.com',
    phone: '+49 40 1122334',
    address: {
      street: 'Elbchaussee 123',
      city: 'Hamburg',
      postalCode: '22763',
      state: 'Hamburg',
      country: 'Deutschland'
    },
    source: {
      type: 'advertising',
      sourceName: 'Google Ads Kampagne Q1',
      campaignId: 'campaign_winter_2024'
    },
    commission: {
      salespersonId: 'benjamin-karimi',
      salespersonRate: 3.0,
      leadCost: 0,
    },
    status: {
      current: 'new',
      lastChanged: new Date('2024-01-17'),
      changedBy: 'system',
      reason: 'Neuer Lead über Online-Formular'
    },
    priority: 'medium',
    products: [
      {
        id: 'prod7',
        name: 'Smart-Wärmepumpe mit App-Steuerung',
        category: 'heat_pump',
        type: 'Luft-Wasser Smart',
        estimatedValue: 14500,
        specifications: {
          heatingArea: 160,
          propertyType: 'Neubau',
          efficiency: 'A+++',
          warranty: '10 Jahre'
        }
      }
    ],
    totalEstimatedValue: 14500,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    lastContact: null,
    nextFollowUp: new Date('2024-01-19'),
    history: [
      {
        id: 'hist30',
        timestamp: new Date('2024-01-17'),
        action: 'created',
        description: 'Lead über Google Ads eingegangen - Online-Formular ausgefüllt',
        performedBy: 'system',
        details: { campaignId: 'campaign_winter_2024' }
      }
    ],
    notes: [
      'Interesse an smarter Heizungslösung',
      'Online-Anfrage sehr detailliert',
      'Erster Kontakt steht aus'
    ],
    tags: ['new', 'google-ads', 'smart-home'],
    appointments: [],
    proposals: [],
    invoices: [],
    emails: []
  },
  {
    id: '4',
    firstName: 'Michael',
    lastName: 'König',
    email: 'michael.koenig@email.com',
    phone: '+49 221 55667788',
    address: {
      city: 'Köln',
      postalCode: '50667',
      state: 'NRW',
      country: 'Deutschland'
    },
    source: {
      type: 'advertising',
      sourceName: 'Google Ads - Wärmepumpe Köln',
      campaignId: 'google-ads-koeln'
    },
    commission: {
      salespersonId: 'dennis-srodka',
      salespersonRate: 3.5,
      leadCost: 23.50,
    },
    status: {
      current: 'negotiation',
      lastChanged: new Date('2024-01-16'),
      changedBy: 'dennis-srodka',
      reason: 'Kunde möchte Preis verhandeln'
    },
    priority: 'high',
    products: [
      {
        id: 'prod4',
        name: 'Wasser-Wasser-Wärmepumpe Gewerbe',
        category: 'heat_pump',
        type: 'Wasser-Wasser',
        estimatedValue: 20000,
        specifications: {
          heatingArea: 300,
          propertyType: 'Gewerbe',
          efficiency: 'A+++',
          warranty: '15 Jahre'
        }
      }
    ],
    totalEstimatedValue: 20000,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-16'),
    lastContact: new Date('2024-01-16'),
    nextFollowUp: new Date('2024-01-19'),
    history: [
      {
        id: 'hist15',
        timestamp: new Date('2024-01-08'),
        action: 'created',
        description: 'Lead über Google Ads Kampagne',
        performedBy: 'system'
      },
      {
        id: 'hist16',
        timestamp: new Date('2024-01-09'),
        action: 'contacted',
        description: 'Erstkontakt - Gewerbekunde mit großem Interesse',
        performedBy: 'dennis-srodka'
      },
      {
        id: 'hist17',
        timestamp: new Date('2024-01-15'),
        action: 'proposal_sent',
        description: 'Detailliertes Angebot für Gewerbeobjekt versendet',
        performedBy: 'dennis-srodka',
        details: { proposalId: 'prop_890' }
      },
      {
        id: 'hist18',
        timestamp: new Date('2024-01-16'),
        action: 'status_changed',
        description: 'Verhandlungsphase begonnen - Kunde möchte Rabatt',
        performedBy: 'dennis-srodka',
        previousStatus: 'proposal_sent',
        newStatus: 'negotiation'
      }
    ],
    notes: [
      'Gewerbekunde mit großem Potenzial',
      'Möchte 5% Rabatt - prüfen ob möglich',
      'Entscheidung diese Woche'
    ],
    tags: ['gewerbe', 'verhandlung', 'grossauftrag'],
    appointments: ['app_567'],
    proposals: ['prop_890'],
    invoices: [],
    emails: ['email_345']
  },
  {
    id: '5',
    firstName: 'Sarah',
    lastName: 'Fischer',
    email: 'sarah.fischer@email.com',
    phone: '+49 711 99887766',
    address: {
      city: 'Stuttgart',
      postalCode: '70173',
      state: 'BW',
      country: 'Deutschland'
    },
    source: {
      type: 'registration',
      sourceName: 'Website Anmeldung',
    },
    commission: {
      salespersonId: 'roland-neu',
      salespersonRate: 4.0,
      leadCost: 0,
      totalCommissionDue: 560.00,
      commissionPaid: true,
      paymentDate: new Date('2024-01-20')
    },
    status: {
      current: 'completed',
      lastChanged: new Date('2024-01-25'),
      changedBy: 'roland-neu',
      reason: 'Installation erfolgreich abgeschlossen'
    },
    priority: 'medium',
    products: [
      {
        id: 'prod5',
        name: 'Luft-Wasser-Wärmepumpe Standard',
        category: 'heat_pump',
        type: 'Luft-Wasser',
        estimatedValue: 14000,
        finalValue: 14000,
        specifications: {
          heatingArea: 160,
          propertyType: 'Einfamilienhaus',
          efficiency: 'A++',
          warranty: '10 Jahre'
        }
      }
    ],
    totalEstimatedValue: 14000,
    totalFinalValue: 14000,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-25'),
    lastContact: new Date('2024-01-25'),
    conversionDate: new Date('2024-01-14'),
    customerLifetimeValue: 14000,
    history: [
      {
        id: 'hist19',
        timestamp: new Date('2024-01-05'),
        action: 'created',
        description: 'Lead über Website-Anmeldung',
        performedBy: 'system'
      },
      {
        id: 'hist20',
        timestamp: new Date('2024-01-06'),
        action: 'contacted',
        description: 'Erstkontakt - sehr interessiert',
        performedBy: 'roland-neu'
      },
      {
        id: 'hist21',
        timestamp: new Date('2024-01-10'),
        action: 'proposal_sent',
        description: 'Angebot versendet',
        performedBy: 'roland-neu',
        details: { proposalId: 'prop_999' }
      },
      {
        id: 'hist22',
        timestamp: new Date('2024-01-14'),
        action: 'contract_signed',
        description: 'Vertrag unterschrieben!',
        performedBy: 'roland-neu'
      },
      {
        id: 'hist23',
        timestamp: new Date('2024-01-20'),
        action: 'installation_scheduled',
        description: 'Installation für KW 8 geplant',
        performedBy: 'roland-neu'
      },
      {
        id: 'hist24',
        timestamp: new Date('2024-01-25'),
        action: 'status_changed',
        description: 'Installation erfolgreich abgeschlossen',
        performedBy: 'roland-neu',
        previousStatus: 'installation_scheduled',
        newStatus: 'completed'
      },
      {
        id: 'hist25',
        timestamp: new Date('2024-01-26'),
        action: 'referral_sent',
        description: 'Empfehlungs-Email mit 300€ Bonus versendet',
        performedBy: 'system',
        details: { 
          emailId: 'email_referral_123',
          referralCode: 'SARAH300'
        }
      }
    ],
    notes: [
      'Website-Anmeldung - organischer Lead',
      'Sehr zufriedener Kunde',
      'Empfehlungs-Email versendet'
    ],
    tags: ['abgeschlossen', 'zufrieden', 'empfehlung'],
    appointments: ['app_678'],
    proposals: ['prop_999'],
    invoices: ['inv_111'],
    emails: ['email_456', 'email_referral_123']
  }
];
