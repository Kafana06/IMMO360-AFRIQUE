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
  created_at?: string;
  trial_ends_at?: string;
}

export interface SaaSPlanSettings {
  standard_price: number;
  premium_price: number;
  vip_price: number;
  trial_days: number;
}

export interface SaaSDiscountCoupon {
  id: string;
  code: string;
  discount_type: 'percent' | 'fixed';
  value: number;
  status: 'Actif' | 'Expiré';
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

// Données en mémoire initialisées avec le compte d'administration par défaut (Kafana)
let db_agencies: Agency[] = [
  {
    id: 'a-kafana',
    name: 'Kafana',
    logo_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80',
    country: "Côte d'Ivoire",
    currency: 'FCFA',
    address: 'Abidjan',
    phone: '+225 07 89 01 23 45',
    email: 'kafanafousseni@gmail.com',
    plan: 'Standard',
    status: 'Actif',
    created_at: new Date('2026-06-01T08:00:00Z').toISOString(),
    trial_ends_at: new Date('2026-06-15T08:00:00Z').toISOString()
  }
];
let db_profiles: Profile[] = [
  {
    id: 'u-kafana',
    agency_id: 'a-kafana',
    email: 'kafanafousseni@gmail.com',
    first_name: 'Fousseni',
    last_name: 'Kafana',
    phone: '+225 07 89 01 23 45',
    role: 'agency_admin'
  }
];
let db_landlords: Landlord[] = [];
let db_properties: Property[] = [];
let db_tenants: Tenant[] = [];
let db_leases: Lease[] = [];
let db_payments: Payment[] = [];
let db_receipts: Receipt[] = [];
let db_maintenance_tickets: MaintenanceTicket[] = [];
let db_crm_leads: CRMLead[] = [];
let db_social_housing: SocialHousingApplication[] = [];
let db_sales: SaleTransaction[] = [];

let saas_plans: SaaSPlanSettings = {
  standard_price: 15000,
  premium_price: 25000,
  vip_price: 50000,
  trial_days: 14
};

let db_coupons: SaaSDiscountCoupon[] = [
  { id: 'c-welcome10', code: 'WELCOME10', discount_type: 'percent', value: 10, status: 'Actif' },
  { id: 'c-free30', code: 'FREE30', discount_type: 'percent', value: 30, status: 'Actif' },
  { id: 'c-immo5k', code: 'IMMO5K', discount_type: 'fixed', value: 5000, status: 'Actif' }
];

const isClient = typeof window !== 'undefined';

export function saveToStorage() {
  if (!isClient) return;
  try {
    localStorage.setItem('immo360_db_agencies', JSON.stringify(db_agencies));
    localStorage.setItem('immo360_db_profiles', JSON.stringify(db_profiles));
    localStorage.setItem('immo360_db_landlords', JSON.stringify(db_landlords));
    localStorage.setItem('immo360_db_properties', JSON.stringify(db_properties));
    localStorage.setItem('immo360_db_tenants', JSON.stringify(db_tenants));
    localStorage.setItem('immo360_db_leases', JSON.stringify(db_leases));
    localStorage.setItem('immo360_db_payments', JSON.stringify(db_payments));
    localStorage.setItem('immo360_db_receipts', JSON.stringify(db_receipts));
    localStorage.setItem('immo360_db_maintenance_tickets', JSON.stringify(db_maintenance_tickets));
    localStorage.setItem('immo360_db_crm_leads', JSON.stringify(db_crm_leads));
    localStorage.setItem('immo360_db_social_housing', JSON.stringify(db_social_housing));
    localStorage.setItem('immo360_db_sales', JSON.stringify(db_sales));
    localStorage.setItem('immo360_saas_plans', JSON.stringify(saas_plans));
    localStorage.setItem('immo360_db_coupons', JSON.stringify(db_coupons));
  } catch (e) {
    console.error("Error saving mock database to localStorage", e);
  }
}

export function loadFromStorage(): boolean {
  if (!isClient) return false;
  try {
    const agencies = localStorage.getItem('immo360_db_agencies');
    if (!agencies) return false;
    
    db_agencies = JSON.parse(agencies);
    
    const profiles = localStorage.getItem('immo360_db_profiles');
    if (profiles) db_profiles = JSON.parse(profiles);
    
    const landlords = localStorage.getItem('immo360_db_landlords');
    if (landlords) db_landlords = JSON.parse(landlords);
    
    const properties = localStorage.getItem('immo360_db_properties');
    if (properties) db_properties = JSON.parse(properties);
    
    const tenants = localStorage.getItem('immo360_db_tenants');
    if (tenants) db_tenants = JSON.parse(tenants);
    
    const leases = localStorage.getItem('immo360_db_leases');
    if (leases) db_leases = JSON.parse(leases);
    
    const payments = localStorage.getItem('immo360_db_payments');
    if (payments) db_payments = JSON.parse(payments);
    
    const receipts = localStorage.getItem('immo360_db_receipts');
    if (receipts) db_receipts = JSON.parse(receipts);
    
    const tickets = localStorage.getItem('immo360_db_maintenance_tickets');
    if (tickets) db_maintenance_tickets = JSON.parse(tickets);
    
    const leads = localStorage.getItem('immo360_db_crm_leads');
    if (leads) db_crm_leads = JSON.parse(leads);
    
    const social = localStorage.getItem('immo360_db_social_housing');
    if (social) db_social_housing = JSON.parse(social);
    
    const sales = localStorage.getItem('immo360_db_sales');
    if (sales) db_sales = JSON.parse(sales);
    
    const plansStr = localStorage.getItem('immo360_saas_plans');
    if (plansStr) saas_plans = JSON.parse(plansStr);
    
    const couponsStr = localStorage.getItem('immo360_db_coupons');
    if (couponsStr) db_coupons = JSON.parse(couponsStr);
    
    return true;
  } catch (e) {
    console.error("Error loading mock database from localStorage", e);
  }
  return false;
}

// CLIENT SIMULÉ API (GETTER/SETTERS REACTIFS EN MEMOIRE)
export const mockSupabase = {
  // Session active (simulation)
  activeAgencyId: '',
  
  setActiveAgency(agencyId: string) {
    this.activeAgencyId = agencyId;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('agencyChanged', { detail: agencyId }));
    }
  },

  registerAgency(agency: Omit<Agency, 'id'>, profile: Omit<Profile, 'id' | 'agency_id' | 'role'>, generateDemoData: boolean) {
    const trialDays = saas_plans.trial_days;
    const now = new Date();
    const trialEnds = new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000);

    const newAgency: Agency = {
      ...agency,
      id: `a-${Math.random().toString(36).substr(2, 9)}`,
      plan: agency.plan || 'Standard',
      status: 'Actif',
      created_at: now.toISOString(),
      trial_ends_at: trialEnds.toISOString()
    };
    db_agencies.push(newAgency);

    const newProfile: Profile = {
      ...profile,
      id: `u-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: newAgency.id,
      role: 'agency_admin'
    };
    db_profiles.push(newProfile);

    if (generateDemoData) {
      this.generateDemoDataForAgency(newAgency.id, newAgency.country);
    }

    saveToStorage();
    return { agency: newAgency, profile: newProfile };
  },

  getSaaSPlanSettings(): SaaSPlanSettings {
    return saas_plans;
  },

  updateSaaSPlanSettings(settings: SaaSPlanSettings) {
    saas_plans = settings;
    saveToStorage();
  },

  getDiscountCoupons(): SaaSDiscountCoupon[] {
    return db_coupons;
  },

  addDiscountCoupon(coupon: Omit<SaaSDiscountCoupon, 'id'>) {
    const newCoupon: SaaSDiscountCoupon = {
      ...coupon,
      id: `coupon-${Math.random().toString(36).substr(2, 9)}`
    };
    db_coupons.unshift(newCoupon);
    saveToStorage();
    return newCoupon;
  },

  toggleCouponStatus(couponId: string) {
    db_coupons = db_coupons.map(c => 
      c.id === couponId 
        ? { ...c, status: c.status === 'Actif' ? 'Expiré' : 'Actif' } 
        : c
    );
    saveToStorage();
  },

  deleteDiscountCoupon(couponId: string) {
    db_coupons = db_coupons.filter(c => c.id !== couponId);
    saveToStorage();
  },

  generateDemoDataForAgency(agencyId: string, country: string) {
    const isCI = country === "Côte d'Ivoire";

    // Add 2 Landlords
    const l1: Landlord = {
      id: `l-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: agencyId,
      first_name: 'Amadou',
      last_name: 'Koné',
      email: 'amadou.kone@gmail.com',
      phone: isCI ? '+225 07 89 01 23 45' : '+221 77 123 45 67',
      address: isCI ? 'Cocody, Abidjan' : 'Almadies, Dakar',
      bank_details: 'RIB SGCI CI008 01202 98765432109 88',
      mobile_money_details: 'Wave: ' + (isCI ? '+225 07 89 01 23 45' : '+221 77 123 45 67')
    };
    const l2: Landlord = {
      id: `l-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: agencyId,
      first_name: 'Chantal',
      last_name: 'Boni',
      email: 'chantal.boni@gmail.com',
      phone: isCI ? '+225 05 12 34 56 78' : '+221 70 987 65 43',
      address: isCI ? 'Zone 4, Abidjan' : 'Plateau, Dakar',
      bank_details: 'RIB CBAO SN012 01001 00223344556 77',
      mobile_money_details: 'Orange Money: ' + (isCI ? '+225 05 12 34 56 78' : '+221 70 987 65 43')
    };
    db_landlords.push(l1, l2);

    // Add 2 Tenants
    const t1: Tenant = {
      id: `t-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: agencyId,
      first_name: 'Koffi',
      last_name: 'Kouassi',
      email: 'koffi.kouassi@gmail.com',
      phone: isCI ? '+225 07 45 45 45 45' : '+221 76 800 11 22',
      profession: 'Ingénieur',
      employer: 'Tech CI'
    };
    const t2: Tenant = {
      id: `t-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: agencyId,
      first_name: 'Marie-Estelle',
      last_name: 'Ouedraogo',
      email: 'marie.estelle@ecobank.com',
      phone: isCI ? '+225 05 88 99 00 11' : '+221 78 555 44 33',
      profession: 'Directrice Financière',
      employer: 'Ecobank'
    };
    db_tenants.push(t1, t2);

    // Add 3 Properties
    const p1: Property = {
      id: `p-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: agencyId,
      name: 'Appartement F3 Chic',
      type: 'Appartement',
      status: 'Occupé',
      address: isCI ? 'Marcory Zone 4' : 'Fann Résidence',
      city: isCI ? 'Abidjan' : 'Dakar',
      country: country,
      description: 'Superbe appartement 3 pièces meublé, groupe électrogène, ascenseur, sécurité.',
      surface: 120,
      rooms: 3,
      rental_value: 850000,
      gallery: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
      listing_type: 'Location'
    };
    const p2: Property = {
      id: `p-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: agencyId,
      name: 'Villa Prestige avec Piscine',
      type: 'Villa',
      status: 'Disponible',
      address: isCI ? 'Cocody Riviera 3' : 'Almadies',
      city: isCI ? 'Abidjan' : 'Dakar',
      country: country,
      description: 'Villa contemporaine de 5 pièces, grand jardin et piscine.',
      surface: 350,
      rooms: 5,
      rental_value: 1500000,
      gallery: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'],
      listing_type: 'Location'
    };
    const p3: Property = {
      id: `p-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: agencyId,
      name: 'Terrain Résidentiel Bingerville',
      type: 'Terrain',
      status: 'Disponible',
      address: isCI ? 'Bingerville' : 'Somone',
      city: isCI ? 'Abidjan' : 'Dakar',
      country: country,
      description: 'Terrain de 500m2 avec ACD, viabilisé et prêt pour construction immédiate.',
      surface: 500,
      rooms: 0,
      rental_value: 25000000,
      gallery: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'],
      listing_type: 'Vente'
    };
    db_properties.push(p1, p2, p3);

    // Add 1 Lease
    const lease: Lease = {
      id: `b-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: agencyId,
      property_id: p1.id,
      tenant_id: t1.id,
      type: 'Habitation',
      start_date: '2026-01-01',
      rent_amount: 850000,
      deposit_amount: 1700000,
      advance_months: 2,
      charges_amount: 50000,
      payment_day: 5,
      status: 'Actif'
    };
    db_leases.push(lease);

    // Add 2 Payments
    const pay1: Payment = {
      id: `pay-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: agencyId,
      lease_id: lease.id,
      amount: 900000,
      period_start: '2026-05-01',
      period_end: '2026-05-31',
      status: 'Payé',
      payment_date: '2026-05-04T12:00:00Z',
      method: 'Wave',
      reference: 'TX-WAVE-887162'
    };
    const pay2: Payment = {
      id: `pay-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: agencyId,
      lease_id: lease.id,
      amount: 900000,
      period_start: '2026-06-01',
      period_end: '2026-06-30',
      status: 'Impayé'
    };
    db_payments.push(pay1, pay2);

    // Add CRM Lead
    const lead: CRMLead = {
      id: `c-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: agencyId,
      first_name: 'Désiré',
      last_name: "N'Guessan",
      phone: isCI ? '+225 07 11 22 33 44' : '+221 77 988 77 66',
      email: 'desire.nguessan@gmail.com',
      interest_type: 'Location',
      budget: 750000,
      status: 'Qualifié',
      notes: 'Recherche appartement F3/F4 Riviera',
      created_at: new Date().toISOString()
    };
    db_crm_leads.push(lead);

    // Add maintenance ticket
    const ticket: MaintenanceTicket = {
      id: `mt-${Math.random().toString(36).substr(2, 9)}`,
      agency_id: agencyId,
      property_id: p1.id,
      title: 'Fuite eau cuisine',
      description: 'Fuite au niveau du siphon de l\'évier',
      status: 'Nouveau',
      priority: 'Moyenne',
      cost: 0,
      created_at: new Date().toISOString()
    };
    db_maintenance_tickets.push(ticket);
  },

  getProfileByEmail(email: string): Profile | undefined {
    return db_profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
  },

  getProfiles(): Profile[] {
    return db_profiles;
  },

  getAgency(): Agency {
    const found = db_agencies.find(a => a.id === this.activeAgencyId) || db_agencies[0];
    if (found) return found;
    return {
      id: '',
      name: 'Aucune Agence',
      logo_url: '',
      country: "Côte d'Ivoire",
      currency: 'FCFA',
      address: '',
      phone: '',
      email: '',
      plan: 'Standard',
      status: 'Actif'
    };
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
    saveToStorage();
    return newAgency;
  },

  updateAgencyStatus(agencyId: string, status: Agency['status']) {
    db_agencies = db_agencies.map(a => a.id === agencyId ? { ...a, status } : a);
    saveToStorage();
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
    saveToStorage();
    return newProperty;
  },

  updatePropertyStatus(propertyId: string, status: Property['status']) {
    db_properties = db_properties.map(p => p.id === propertyId ? { ...p, status } : p);
    saveToStorage();
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
    saveToStorage();
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
    saveToStorage();
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
    saveToStorage();
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
    saveToStorage();
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
    saveToStorage();
    return newTicket;
  },

  updateTicketStatus(ticketId: string, status: MaintenanceTicket['status']) {
    db_maintenance_tickets = db_maintenance_tickets.map(t => t.id === ticketId ? { ...t, status } : t);
    saveToStorage();
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
    saveToStorage();
    return newLead;
  },

  updateLeadStatus(leadId: string, status: CRMLead['status']) {
    db_crm_leads = db_crm_leads.map(c => c.id === leadId ? { ...c, status } : c);
    saveToStorage();
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
    saveToStorage();
    return newApp;
  },

  attributeSocialHousing(appId: string, propertyId: string) {
    db_social_housing = db_social_housing.map(s => 
      s.id === appId 
        ? { ...s, eligibility_status: 'Attribué', attributed_property_id: propertyId } 
        : s
    );
    this.updatePropertyStatus(propertyId, 'Occupé');
    saveToStorage();
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
    saveToStorage();
    return newTx;
  },

  getGlobalAgenciesStats() {
    const stats: { [agencyId: string]: { properties: number; leases: number; tenants: number } } = {};
    db_agencies.forEach(agency => {
      stats[agency.id] = {
        properties: db_properties.filter(p => p.agency_id === agency.id).length,
        leases: db_leases.filter(l => l.agency_id === agency.id).length,
        tenants: db_tenants.filter(t => t.agency_id === agency.id).length
      };
    });
    return stats;
  }
};

const loaded = loadFromStorage();
if (!loaded) {
  // Pré-remplissage des données de démo pour le compte d'agence par défaut Kafana
  mockSupabase.generateDemoDataForAgency('a-kafana', "Côte d'Ivoire");
  saveToStorage();
}
