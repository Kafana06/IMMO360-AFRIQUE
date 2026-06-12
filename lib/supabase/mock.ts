// SIMULATION DE BASE DE DONNÉES SUPABASE POUR LE PROTOTYPE INTERACTIF

export interface Agency {
  id: string;
  name: string;
  logo_url: string;
  country: string;
  currency: string;
  address: string;
  phone: string;
  email: string;
  plan?: 'Standard' | 'Premium' | 'VIP';
  status?: 'Actif' | 'Suspendu';
}

export interface Profile {
  id: string;
  agency_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'super_admin' | 'agency_admin' | 'property_manager' | 'accountant' | 'agent' | 'landlord' | 'tenant';
}

export interface Landlord {
  id: string;
  agency_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  bank_details?: string;
  mobile_money_details?: string;
}

export interface Tenant {
  id: string;
  agency_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profession: string;
  employer: string;
  id_card_url?: string;
}

export interface Property {
  id: string;
  agency_id: string;
  name: string;
  type: 'Appartement' | 'Villa' | 'Immeuble' | 'Terrain' | 'Bureau' | 'Magasin' | 'Entrepôt';
  status: 'Disponible' | 'Occupé' | 'Réservé' | 'En maintenance' | 'Vendu';
  address: string;
  city: string;
  country: string;
  description: string;
  surface: number;
  rooms: number;
  rental_value: number;
  gallery: string[];
  latitude?: number;
  longitude?: number;
  listing_type?: 'Location' | 'Vente';
}

export interface Lease {
  id: string;
  agency_id: string;
  property_id: string;
  tenant_id: string;
  type: 'Habitation' | 'Commercial' | 'Bureau' | 'Terrain';
  start_date: string;
  end_date?: string;
  rent_amount: number;
  deposit_amount: number;
  advance_months: number;
  charges_amount: number;
  payment_day: number;
  status: 'Actif' | 'Expiré' | 'Résilié';
  signature_url?: string;
  pdf_url?: string;
}

export interface Payment {
  id: string;
  agency_id: string;
  lease_id: string;
  amount: number;
  period_start: string;
  period_end: string;
  payment_date?: string;
  status: 'Payé' | 'Partiellement payé' | 'Impayé' | 'En retard';
  method?: 'Espèces' | 'Virement' | 'Orange Money' | 'MTN Money' | 'Moov Money' | 'Wave';
  reference?: string;
}

export interface Receipt {
  id: string;
  agency_id: string;
  payment_id: string;
  receipt_number: string;
  pdf_url?: string;
  sent_at?: string;
  sent_via?: ('WhatsApp' | 'Email')[];
}

export interface MaintenanceTicket {
  id: string;
  agency_id: string;
  property_id: string;
  title: string;
  description: string;
  status: 'Nouveau' | 'Assigné' | 'En cours' | 'Résolu' | 'Fermé';
  priority: 'Faible' | 'Moyenne' | 'Haute' | 'Urgente';
  contractor_name?: string;
  contractor_phone?: string;
  cost: number;
  created_at: string;
}

export interface CRMLead {
  id: string;
  agency_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  interest_type?: 'Achat' | 'Location' | 'Investissement';
  budget?: number;
  status: 'Nouveau' | 'Contacté' | 'Qualifié' | 'Proposition' | 'Gagné' | 'Perdu';
  notes?: string;
  created_at: string;
}

export interface SocialHousingApplication {
  id: string;
  agency_id: string;
  beneficiary_first_name: string;
  beneficiary_last_name: string;
  beneficiary_national_id: string;
  beneficiary_phone: string;
  monthly_income: number;
  family_size: number;
  eligibility_status: 'En cours' | 'Éligible' | 'Non éligible' | 'Attribué';
  attributed_property_id?: string;
  created_at: string;
}

export interface SaleTransaction {
  id: string;
  agency_id: string;
  property_id: string;
  buyer_name: string;
  buyer_phone: string;
  sale_price: number;
  commission_amount: number;
  net_owner_amount: number;
  payment_method: 'Orange Money' | 'MTN Money' | 'Wave' | 'Virement' | 'Espèces';
  reference: string;
  status: 'Finalisé' | 'En attente';
  created_at: string;
}

// Données en mémoire (chargées avec les données seed)
let db_agencies: Agency[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Babi Immo S.A.',
    logo_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80',
    country: 'Côte d\'Ivoire',
    currency: 'FCFA',
    address: 'Boulevard Latrille, Cocody, Abidjan',
    phone: '+225 07 00 00 00 01',
    email: 'contact@babi-immo.ci',
    plan: 'Standard',
    status: 'Actif'
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    name: 'Teranga Agence Luxe',
    logo_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80',
    country: 'Sénégal',
    currency: 'FCFA',
    address: 'Route des Almadies, Dakar',
    phone: '+221 33 800 00 01',
    email: 'luxe@terangaimmo.sn',
    plan: 'Premium',
    status: 'Actif'
  }
];

let db_profiles: Profile[] = [
  {
    id: 'u1111111-1111-1111-1111-111111111111',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    email: 'admin.babi@immo360.africa',
    first_name: 'Jean-Philippe',
    last_name: 'Koffi',
    phone: '+225 05 55 55 55 55',
    role: 'agency_admin'
  },
  {
    id: 'u2222221-2222-2222-2222-222222222221',
    agency_id: 'a2222222-2222-2222-2222-222222222222',
    email: 'admin.teranga@immo360.africa',
    first_name: 'Moustapha',
    last_name: 'Ndiaye',
    phone: '+221 77 123 45 67',
    role: 'agency_admin'
  }
];

let db_landlords: Landlord[] = [
  {
    id: 'l1111111-1111-1111-1111-111111111111',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    first_name: 'Amadou',
    last_name: 'Koné',
    email: 'amadou.kone@yahoo.ci',
    phone: '+225 07 89 01 23 45',
    address: 'Cocody Les Deux Plateaux, Abidjan',
    bank_details: 'RIB SIB CI056 01101 12345678901 22',
    mobile_money_details: 'Orange Money: +225 07 89 01 23 45'
  },
  {
    id: 'l1111112-1111-1111-1111-111111111112',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    first_name: 'Chantal',
    last_name: 'Boni',
    email: 'chantal.boni@gmail.com',
    phone: '+225 05 12 34 56 78',
    address: 'Zone 4, Marcory, Abidjan',
    bank_details: 'RIB SGCI CI008 01202 98765432109 88',
    mobile_money_details: 'Wave: +225 05 12 34 56 78'
  },
  {
    id: 'l2222221-2222-2222-2222-222222222221',
    agency_id: 'a2222222-2222-2222-2222-222222222222',
    first_name: 'Fatou',
    last_name: 'Sow',
    email: 'fatou.sow@orange.sn',
    phone: '+221 77 654 32 10',
    address: 'Point E, Dakar',
    bank_details: 'RIB CBAO SN012 01001 00223344556 77',
    mobile_money_details: 'Wave: +221 77 654 32 10'
  }
];

let db_properties: Property[] = [
  {
    id: 'p1111111-1111-1111-1111-111111111111',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Villa Prestige Cocody',
    type: 'Villa',
    status: 'Occupé',
    address: 'Rue des Jardins, Cocody Deux-Plateaux',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    description: 'Magnifique villa duplex de 5 pièces avec piscine, jardin paysager, garage 2 véhicules, portail électrique et sécurité H24.',
    surface: 350.0,
    rooms: 5,
    rental_value: 1500000,
    gallery: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'],
    listing_type: 'Location'
  },
  {
    id: 'p1111112-1111-1111-1111-111111111112',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Appartement Chic Zone 4',
    type: 'Appartement',
    status: 'Occupé',
    address: 'Rue Paul Langevin, Zone 4C, Marcory',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    description: 'Appartement F3 haut standing meublé dans un immeuble récent avec ascenseur, groupe électrogène, salle de sport commune et conciergerie.',
    surface: 120.0,
    rooms: 3,
    rental_value: 850000,
    gallery: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
    listing_type: 'Location'
  },
  {
    id: 'p1111113-1111-1111-1111-111111111113',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Bureaux d\'Affaires Plateau',
    type: 'Bureau',
    status: 'Disponible',
    address: 'Avenue Nogues, Plateau',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    description: 'Plateau de bureaux cloisonné de 250m2, câblage réseau complet, climatisation centrale, parfait pour siège social ou agence.',
    surface: 250.0,
    rooms: 6,
    rental_value: 2500000,
    gallery: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'],
    listing_type: 'Location'
  },
  {
    id: 'p1111114-1111-1111-1111-111111111114',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Villa Sociale Abobo',
    type: 'Villa',
    status: 'Occupé',
    address: 'Quartier Avocatier, Abobo',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    description: 'Villa basse de 3 pièces dans le cadre du programme de logements sociaux. Loyer modéré réglementé.',
    surface: 75.0,
    rooms: 3,
    rental_value: 120000,
    gallery: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80'],
    listing_type: 'Location'
  },
  {
    id: 'p1111115-1111-1111-1111-111111111115',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Terrain Cocody Angré',
    type: 'Terrain',
    status: 'Disponible',
    address: 'Près du CHU d\'Angré, Cocody',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    description: 'Superbe lotissement de 500m2 approuvé avec ACD, prêt pour construction immédiate dans une zone hautement résidentielle.',
    surface: 500.0,
    rooms: 0,
    rental_value: 45000000,
    gallery: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'],
    listing_type: 'Vente'
  },
  {
    id: 'p1111116-1111-1111-1111-111111111116',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Terrain Zone Ind. Yopougon',
    type: 'Terrain',
    status: 'Vendu',
    address: 'Zone Industrielle, Yopougon',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    description: 'Terrain commercial clôturé de 1000m2 avec accès route bitumée, idéal pour entrepôt ou usine.',
    surface: 1000.0,
    rooms: 0,
    rental_value: 30000000,
    gallery: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'],
    listing_type: 'Vente'
  },
  {
    id: 'p2222221-2222-2222-2222-222222222221',
    agency_id: 'a2222222-2222-2222-2222-222222222222',
    name: 'Penthouse Almadies Ocean View',
    type: 'Appartement',
    status: 'Occupé',
    address: 'Corniche Ouest, Les Almadies',
    city: 'Dakar',
    country: 'Sénégal',
    description: 'Penthouse exceptionnel de 4 pièces avec vue panoramique sur l\'Océan Atlantique, piscine privée suspendue sur la terrasse, finitions marbre.',
    surface: 280.0,
    rooms: 4,
    rental_value: 3000000,
    gallery: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'],
    listing_type: 'Location'
  },
  {
    id: 'p2222222-2222-2222-2222-222222222222',
    agency_id: 'a2222222-2222-2222-2222-222222222222',
    name: 'Magasin Commercial Dakar Plateau',
    type: 'Magasin',
    status: 'En maintenance',
    address: 'Avenue Léopold Sédar Senghor, Plateau',
    city: 'Dakar',
    country: 'Sénégal',
    description: 'Local commercial en rez-de-chaussée avec une grande vitrine passante, excellent emplacement commercial.',
    surface: 90.0,
    rooms: 2,
    rental_value: 1200000,
    gallery: ['https://images.unsplash.com/photo-1555529669-e69e7aa0db9a?auto=format&fit=crop&w=800&q=80'],
    listing_type: 'Location'
  },
  {
    id: 'p2222223-2222-2222-2222-222222222223',
    agency_id: 'a2222222-2222-2222-2222-222222222222',
    name: 'Maison Prestige Almadies',
    type: 'Villa',
    status: 'Disponible',
    address: 'Zone résidentielle, Les Almadies',
    city: 'Dakar',
    country: 'Sénégal',
    description: 'Somptueuse demeure contemporaine de 7 pièces, grand jardin arboré, piscine olympique et quartier diplomatique sécurisé.',
    surface: 600.0,
    rooms: 7,
    rental_value: 120000000,
    gallery: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'],
    listing_type: 'Vente'
  }
];

let db_tenants: Tenant[] = [
  {
    id: 't1111111-1111-1111-1111-111111111111',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    first_name: 'Koffi',
    last_name: 'Kouassi',
    email: 'koffi.kouassi@unicef.org',
    phone: '+225 07 45 45 45 45',
    profession: 'Chargé de Mission UX',
    employer: 'UNICEF Côte d\'Ivoire'
  },
  {
    id: 't1111112-1111-1111-1111-111111111112',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    first_name: 'Marie-Estelle',
    last_name: 'Ouedraogo',
    email: 'marie.estelle@ecobank.com',
    phone: '+225 05 88 99 00 11',
    profession: 'Directrice Risques',
    employer: 'Ecobank CI'
  },
  {
    id: 't2222221-2222-2222-2222-222222222221',
    agency_id: 'a2222222-2222-2222-2222-222222222222',
    first_name: 'Cheikh',
    last_name: 'Gueye',
    email: 'cheikh.gueye@tigo.sn',
    phone: '+221 76 800 11 22',
    profession: 'Ingénieur Réseaux',
    employer: 'Free Sénégal'
  }
];

let db_leases: Lease[] = [
  {
    id: 'b1111111-1111-1111-1111-111111111111',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    property_id: 'p1111111-1111-1111-1111-111111111111',
    tenant_id: 't1111111-1111-1111-1111-111111111111',
    type: 'Habitation',
    start_date: '2025-01-01',
    end_date: '2026-12-31',
    rent_amount: 1500000,
    deposit_amount: 3000000,
    advance_months: 3,
    charges_amount: 150000,
    payment_day: 5,
    status: 'Actif',
    signature_url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=400&q=80',
    pdf_url: '/documents/lease_presite_cocody.pdf'
  },
  {
    id: 'b1111112-1111-1111-1111-111111111112',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    property_id: 'p1111112-1111-1111-1111-111111111112',
    tenant_id: 't1111112-1111-1111-1111-111111111112',
    type: 'Habitation',
    start_date: '2025-06-01',
    end_date: '2026-05-31',
    rent_amount: 850000,
    deposit_amount: 1700000,
    advance_months: 2,
    charges_amount: 50000,
    payment_day: 5,
    status: 'Actif',
    signature_url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=400&q=80',
    pdf_url: '/documents/lease_appartement_zone4.pdf'
  },
  {
    id: 'b2222221-2222-2222-2222-222222222221',
    agency_id: 'a2222222-2222-2222-2222-222222222222',
    property_id: 'p2222221-2222-2222-2222-222222222221',
    tenant_id: 't2222221-2222-2222-2222-222222222221',
    type: 'Habitation',
    start_date: '2025-03-01',
    end_date: '2027-02-28',
    rent_amount: 3000000,
    deposit_amount: 6000000,
    advance_months: 3,
    charges_amount: 200000,
    payment_day: 5,
    status: 'Actif',
    signature_url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=400&q=80',
    pdf_url: '/documents/lease_penthouse_almadies.pdf'
  }
];

let db_payments: Payment[] = [
  // Villa Cocody (Total: 1 650 000 FCFA)
  {
    id: 'm1111111-1111-1111-1111-111111111111',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    lease_id: 'b1111111-1111-1111-1111-111111111111',
    amount: 1650000,
    period_start: '2026-04-01',
    period_end: '2026-04-30',
    payment_date: '2026-04-04T10:30:00Z',
    status: 'Payé',
    method: 'Virement',
    reference: 'VR-SIB-09871'
  },
  {
    id: 'm1111112-1111-1111-1111-111111111112',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    lease_id: 'b1111111-1111-1111-1111-111111111111',
    amount: 1650000,
    period_start: '2026-05-01',
    period_end: '2026-05-30',
    payment_date: '2026-05-05T14:15:00Z',
    status: 'Payé',
    method: 'Virement',
    reference: 'VR-SIB-11402'
  },
  {
    id: 'm1111113-1111-1111-1111-111111111113',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    lease_id: 'b1111111-1111-1111-1111-111111111111',
    amount: 1650000,
    period_start: '2026-06-01',
    period_end: '2026-06-30',
    status: 'En retard'
  },
  // Appartement Zone 4 (Total: 900 000 FCFA)
  {
    id: 'm1111114-1111-1111-1111-111111111114',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    lease_id: 'b1111112-1111-1111-1111-111111111112',
    amount: 900000,
    period_start: '2026-04-01',
    period_end: '2026-04-30',
    payment_date: '2026-04-05T09:00:00Z',
    status: 'Payé',
    method: 'Orange Money',
    reference: 'OM-260405-900K'
  },
  {
    id: 'm1111115-1111-1111-1111-111111111115',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    lease_id: 'b1111112-1111-1111-1111-111111111112',
    amount: 900000,
    period_start: '2026-05-01',
    period_end: '2026-05-30',
    payment_date: '2026-05-04T16:45:00Z',
    status: 'Payé',
    method: 'Wave',
    reference: 'WV-260504-8742'
  },
  {
    id: 'm1111116-1111-1111-1111-111111111116',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    lease_id: 'b1111112-1111-1111-1111-111111111112',
    amount: 900000,
    period_start: '2026-06-01',
    period_end: '2026-06-30',
    payment_date: '2026-06-03T11:20:00Z',
    status: 'Payé',
    method: 'Wave',
    reference: 'WV-260603-9041'
  },
  // Penthouse Almadies (Total: 3 200 000 FCFA)
  {
    id: 'm2222221-2222-2222-2222-222222222221',
    agency_id: 'a2222222-2222-2222-2222-222222222222',
    lease_id: 'b2222221-2222-2222-2222-222222222221',
    amount: 3200000,
    period_start: '2026-06-01',
    period_end: '2026-06-30',
    payment_date: '2026-06-02T08:30:00Z',
    status: 'Payé',
    method: 'Virement',
    reference: 'VR-CBAO-6721'
  }
];

let db_receipts: Receipt[] = [
  {
    id: 'q1111111-1111-1111-1111-111111111111',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    payment_id: 'm1111111-1111-1111-1111-111111111111',
    receipt_number: 'Q-2026-04-0001',
    pdf_url: '/documents/quittance_q-2026-04-0001.pdf',
    sent_at: '2026-04-04T11:00:00Z',
    sent_via: ['Email', 'WhatsApp']
  },
  {
    id: 'q1111112-1111-1111-1111-111111111112',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    payment_id: 'm1111112-1111-1111-1111-111111111112',
    receipt_number: 'Q-2026-05-0001',
    pdf_url: '/documents/quittance_q-2026-05-0001.pdf',
    sent_at: '2026-05-05T14:30:00Z',
    sent_via: ['Email']
  },
  {
    id: 'q1111113-1111-1111-1111-111111111113',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    payment_id: 'm1111116-1111-1111-1111-111111111116',
    receipt_number: 'Q-2026-06-0002',
    pdf_url: '/documents/quittance_q-2026-06-0002.pdf',
    sent_at: '2026-06-03T12:00:00Z',
    sent_via: ['WhatsApp']
  }
];

let db_maintenance_tickets: MaintenanceTicket[] = [
  {
    id: 't1111111-2222-3333-4444-555555555555',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    property_id: 'p1111111-1111-1111-1111-111111111111',
    title: 'Fuite climatiseur salon',
    description: 'L\'unité de climatisation du grand salon coule le long du mur en créant des traces d\'humidité.',
    status: 'En cours',
    priority: 'Moyenne',
    contractor_name: 'Sékou Plomberie-Clim',
    contractor_phone: '+225 07 12 12 12 12',
    cost: 45000,
    created_at: '2026-06-01T09:00:00Z'
  },
  {
    id: 't2222222-3333-4444-5555-666666666666',
    agency_id: 'a2222222-2222-2222-2222-222222222222',
    property_id: 'p2222222-2222-2222-2222-222222222222',
    title: 'Rénovation vitrine commerce',
    description: 'Remplacement des montants en aluminium et changement du vitrage fissuré.',
    status: 'Assigné',
    priority: 'Haute',
    contractor_name: 'Dakar Alu & Design',
    contractor_phone: '+221 77 444 33 22',
    cost: 450000,
    created_at: '2026-06-05T15:30:00Z'
  }
];

let db_crm_leads: CRMLead[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    first_name: 'Désiré',
    last_name: 'N\'Guessan',
    phone: '+225 01 02 03 04 05',
    email: 'desire.nguessan@gmail.com',
    interest_type: 'Achat',
    budget: 75000000,
    status: 'Qualifié',
    notes: 'Recherche un appartement de 3 ou 4 pièces à Cocody-Angré, budget max 75 millions. Préfère résidence fermée.',
    created_at: '2026-05-15T10:00:00Z'
  },
  {
    id: 'c1111112-1111-1111-1111-111111111112',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    first_name: 'Kadiatou',
    last_name: 'Sangaré',
    phone: '+225 05 06 07 08 09',
    email: 'kadi.sangare@live.fr',
    interest_type: 'Location',
    budget: 500000,
    status: 'Nouveau',
    notes: 'Recherche studio ou F2 sur Marcory / Zone 4, meublé ou non. Entrée prévue début Juillet.',
    created_at: '2026-06-08T11:20:00Z'
  },
  {
    id: 'c2222221-2222-2222-2222-222222222221',
    agency_id: 'a2222222-2222-2222-2222-222222222222',
    first_name: 'Ousmane',
    last_name: 'Faye',
    phone: '+221 78 999 88 77',
    email: 'ousmane.faye@invest-sn.com',
    interest_type: 'Investissement',
    budget: 150000000,
    status: 'Proposition',
    notes: 'Client résidant en France. Souhaite acheter un immeuble de rapport ou plusieurs appartements sur Dakar Plateau ou Mermoz.',
    created_at: '2026-05-20T14:40:00Z'
  }
];

let db_social_housing: SocialHousingApplication[] = [
  {
    id: 's1111111-1111-1111-1111-111111111111',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    beneficiary_first_name: 'Bakary',
    beneficiary_last_name: 'Konaté',
    beneficiary_national_id: 'CI012345678',
    beneficiary_phone: '+225 05 76 54 32 10',
    monthly_income: 180000,
    family_size: 5,
    eligibility_status: 'Éligible',
    created_at: '2026-05-10T08:30:00Z'
  },
  {
    id: 's1111112-1111-1111-1111-111111111112',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    beneficiary_first_name: 'Yasmine',
    beneficiary_last_name: 'Gnakpa',
    beneficiary_national_id: 'CI987654321',
    beneficiary_phone: '+225 07 11 22 33 44',
    monthly_income: 320000,
    family_size: 2,
    eligibility_status: 'Attribué',
    attributed_property_id: 'p1111114-1111-1111-1111-111111111114',
    created_at: '2026-06-02T10:15:00Z'
  }
];

let db_sales: SaleTransaction[] = [
  {
    id: 's1111111-2222-3333-4444-555555555555',
    agency_id: 'a1111111-1111-1111-1111-111111111111',
    property_id: 'p1111116-1111-1111-1111-111111111116',
    buyer_name: 'Kouadio N\'Goran',
    buyer_phone: '+225 07 11 22 33 44',
    sale_price: 30000000,
    commission_amount: 3000000,
    net_owner_amount: 27000000,
    payment_method: 'Virement',
    reference: 'VR-SGCI-88123',
    status: 'Finalisé',
    created_at: '2026-06-05T10:00:00Z'
  }
];

// CLIENT SIMULÉ API (GETTER/SETTERS REACTIFS EN MEMOIRE)
export const mockSupabase = {
  // Session active (simulation)
  activeAgencyId: 'a1111111-1111-1111-1111-111111111111', // Babi Immo par défaut
  
  setActiveAgency(agencyId: string) {
    this.activeAgencyId = agencyId;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('agencyChanged', { detail: agencyId }));
    }
  },

  getAgency(): Agency {
    return db_agencies.find(a => a.id === this.activeAgencyId) || db_agencies[0];
  },

  getAgencies(): Agency[] {
    return db_agencies;
  },

  addAgency(agency: Omit<Agency, 'id'>) {
    const newAgency: Agency = {
      ...agency,
      id: `a-${Math.random().toString(36).substr(2, 9)}`,
      plan: agency.plan || 'Standard',
      status: agency.status || 'Actif'
    };
    db_agencies.push(newAgency);
    return newAgency;
  },

  updateAgencyStatus(agencyId: string, status: Agency['status']) {
    db_agencies = db_agencies.map(a => a.id === agencyId ? { ...a, status } : a);
  },

  // PROPERTIES
  getProperties(): Property[] {
    return db_properties.filter(p => p.agency_id === this.activeAgencyId);
  },

  addProperty(property: Omit<Property, 'id' | 'agency_id'>) {
    const newProperty: Property = {
      ...property,
      id: `p-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: this.activeAgencyId
    };
    db_properties.unshift(newProperty);
    return newProperty;
  },

  updatePropertyStatus(propertyId: string, status: Property['status']) {
    db_properties = db_properties.map(p => p.id === propertyId ? { ...p, status } : p);
  },

  // LANDLORDS
  getLandlords(): Landlord[] {
    return db_landlords.filter(l => l.agency_id === this.activeAgencyId);
  },

  addLandlord(landlord: Omit<Landlord, 'id' | 'agency_id'>) {
    const newLandlord: Landlord = {
      ...landlord,
      id: `l-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: this.activeAgencyId
    };
    db_landlords.unshift(newLandlord);
    return newLandlord;
  },

  // TENANTS
  getTenants(): Tenant[] {
    return db_tenants.filter(t => t.agency_id === this.activeAgencyId);
  },

  addTenant(tenant: Omit<Tenant, 'id' | 'agency_id'>) {
    const newTenant: Tenant = {
      ...tenant,
      id: `t-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: this.activeAgencyId
    };
    db_tenants.unshift(newTenant);
    return newTenant;
  },

  // LEASES
  getLeases(): (Lease & { property: Property; tenant: Tenant })[] {
    return db_leases
      .filter(l => l.agency_id === this.activeAgencyId)
      .map(l => ({
        ...l,
        property: db_properties.find(p => p.id === l.property_id)!,
        tenant: db_tenants.find(t => t.id === l.tenant_id)!
      }));
  },

  addLease(lease: Omit<Lease, 'id' | 'agency_id' | 'status'>) {
    const newLease: Lease = {
      ...lease,
      id: `b-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: this.activeAgencyId,
      status: 'Actif'
    };
    db_leases.unshift(newLease);
    this.updatePropertyStatus(lease.property_id, 'Occupé');
    return newLease;
  },

  // PAYMENTS
  getPayments(): (Payment & { lease: Lease & { property: Property; tenant: Tenant } })[] {
    const activeLeases = this.getLeases();
    const leaseMap = new Map(activeLeases.map(l => [l.id, l]));
    
    return db_payments
      .filter(p => p.agency_id === this.activeAgencyId)
      .map(p => ({
        ...p,
        lease: leaseMap.get(p.lease_id)!
      }))
      .filter(p => p.lease !== undefined); // Sécurité
  },

  recordPayment(paymentId: string, method: Payment['method'], reference: string) {
    const now = new Date().toISOString();
    db_payments = db_payments.map(p => 
      p.id === paymentId 
        ? { ...p, status: 'Payé', method, reference, payment_date: now } 
        : p
    );

    // Génération automatique d'une quittance
    const pay = db_payments.find(p => p.id === paymentId);
    if (pay) {
      const qNumber = `Q-2026-06-${Math.floor(1000 + Math.random() * 9000)}`;
      const newReceipt: Receipt = {
        id: `q-${Math.random().toString(36).substr(2, 9)}`,
        agency_id: this.activeAgencyId,
        payment_id: paymentId,
        receipt_number: qNumber,
        pdf_url: `/documents/quittance_${qNumber.toLowerCase()}.pdf`,
        sent_at: now,
        sent_via: ['WhatsApp', 'Email']
      };
      db_receipts.push(newReceipt);
    }
  },

  // RECEIPTS
  getReceipts(): (Receipt & { payment: Payment & { lease: Lease & { property: Property; tenant: Tenant } } })[] {
    const payments = this.getPayments();
    const payMap = new Map(payments.map(p => [p.id, p]));

    return db_receipts
      .filter(r => r.agency_id === this.activeAgencyId)
      .map(r => ({
        ...r,
        payment: payMap.get(r.payment_id)!
      }))
      .filter(r => r.payment !== undefined);
  },

  // MAINTENANCE
  getMaintenanceTickets(): (MaintenanceTicket & { property: Property })[] {
    const props = this.getProperties();
    const propMap = new Map(props.map(p => [p.id, p]));

    return db_maintenance_tickets
      .filter(t => t.agency_id === this.activeAgencyId)
      .map(t => ({
        ...t,
        property: propMap.get(t.property_id)!
      }))
      .filter(t => t.property !== undefined);
  },

  addMaintenanceTicket(ticket: Omit<MaintenanceTicket, 'id' | 'agency_id' | 'created_at' | 'status'>) {
    const newTicket: MaintenanceTicket = {
      ...ticket,
      id: `mt-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: this.activeAgencyId,
      status: 'Nouveau',
      created_at: new Date().toISOString()
    };
    db_maintenance_tickets.unshift(newTicket);
    return newTicket;
  },

  updateTicketStatus(ticketId: string, status: MaintenanceTicket['status']) {
    db_maintenance_tickets = db_maintenance_tickets.map(t => t.id === ticketId ? { ...t, status } : t);
  },

  // CRM
  getCRMLeads(): CRMLead[] {
    return db_crm_leads.filter(c => c.agency_id === this.activeAgencyId);
  },

  addCRMLead(lead: Omit<CRMLead, 'id' | 'agency_id' | 'created_at'>) {
    const newLead: CRMLead = {
      ...lead,
      id: `c-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: this.activeAgencyId,
      created_at: new Date().toISOString()
    };
    db_crm_leads.unshift(newLead);
    return newLead;
  },

  updateLeadStatus(leadId: string, status: CRMLead['status']) {
    db_crm_leads = db_crm_leads.map(c => c.id === leadId ? { ...c, status } : c);
  },

  // SOCIAL HOUSING
  getSocialHousingApplications(): (SocialHousingApplication & { property?: Property })[] {
    const props = this.getProperties();
    const propMap = new Map(props.map(p => [p.id, p]));

    return db_social_housing
      .filter(s => s.agency_id === this.activeAgencyId)
      .map(s => ({
        ...s,
        property: s.attributed_property_id ? propMap.get(s.attributed_property_id) : undefined
      }));
  },

  addSocialHousingApplication(app: Omit<SocialHousingApplication, 'id' | 'agency_id' | 'created_at' | 'eligibility_status'>) {
    const newApp: SocialHousingApplication = {
      ...app,
      id: `s-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: this.activeAgencyId,
      eligibility_status: 'En cours',
      created_at: new Date().toISOString()
    };
    db_social_housing.unshift(newApp);
    return newApp;
  },

  attributeSocialHousing(appId: string, propertyId: string) {
    db_social_housing = db_social_housing.map(s => 
      s.id === appId 
        ? { ...s, eligibility_status: 'Attribué', attributed_property_id: propertyId } 
        : s
    );
    this.updatePropertyStatus(propertyId, 'Occupé');
  },

  // SALES & TRANSACTIONS
  getSaleTransactions(): (SaleTransaction & { property: Property })[] {
    const props = db_properties.filter(p => p.agency_id === this.activeAgencyId);
    const propMap = new Map(props.map(p => [p.id, p]));
    return db_sales
      .filter(s => s.agency_id === this.activeAgencyId)
      .map(s => ({
        ...s,
        property: propMap.get(s.property_id)!
      }))
      .filter(s => s.property !== undefined);
  },

  addSaleTransaction(transaction: Omit<SaleTransaction, 'id' | 'agency_id' | 'commission_amount' | 'net_owner_amount' | 'created_at'>) {
    const comm = Math.round(transaction.sale_price * 0.10);
    const net = transaction.sale_price - comm;
    const newTx: SaleTransaction = {
      ...transaction,
      id: `sale-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: this.activeAgencyId,
      commission_amount: comm,
      net_owner_amount: net,
      created_at: new Date().toISOString()
    };
    db_sales.unshift(newTx);
    this.updatePropertyStatus(transaction.property_id, 'Vendu');
    return newTx;
  }
};
