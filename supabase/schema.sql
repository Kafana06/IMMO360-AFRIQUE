-- IMMO360 AFRIQUE - SCHÉMA POSTGRESQL DE BASE DE DONNÉES

-- -----------------------------------------------------------------------------
-- 1. EXTENSIONS
-- -----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 2. TABLES
-- -----------------------------------------------------------------------------

-- Table des Agences (Tenants)
CREATE TABLE IF NOT EXISTS public.agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    country TEXT NOT NULL, -- Côte d'Ivoire, Sénégal, Cameroun, Bénin, Togo, Burkina Faso
    currency TEXT NOT NULL DEFAULT 'XOF', -- XOF, XAF, EUR
    address TEXT,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table des Profils Utilisateurs (Liés à auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY, -- Référence directe à auth.users.id
    agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('super_admin', 'agency_admin', 'property_manager', 'accountant', 'agent', 'landlord', 'tenant')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table des Propriétaires (Bailleurs)
CREATE TABLE IF NOT EXISTS public.landlords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    address TEXT,
    id_card_url TEXT, -- Copie de la CNI / Passeport
    bank_details TEXT, -- RIB pour les virements de loyers
    mobile_money_details TEXT, -- Numéro + Opérateur (ex: Orange Money +225...)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table des Biens Immobiliers
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Appartement', 'Villa', 'Immeuble', 'Terrain', 'Bureau', 'Magasin', 'Entrepôt')),
    status TEXT NOT NULL DEFAULT 'Disponible' CHECK (status IN ('Disponible', 'Occupé', 'Réservé', 'En maintenance')),
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    description TEXT,
    surface NUMERIC,
    rooms INTEGER,
    rental_value NUMERIC NOT NULL, -- Loyer mensuel HC recommandé
    gallery TEXT[], -- Tableau de liens de photos
    latitude NUMERIC,
    longitude NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table d'association entre Biens et Propriétaires
CREATE TABLE IF NOT EXISTS public.property_landlords (
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    landlord_id UUID REFERENCES public.landlords(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (property_id, landlord_id)
);

-- Table des Locataires
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    profession TEXT,
    employer TEXT,
    id_card_url TEXT, -- Copie de la CNI / Attestation d'identité
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table des Contrats de Bail
CREATE TABLE IF NOT EXISTS public.leases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE RESTRICT NOT NULL,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE RESTRICT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Habitation', 'Commercial', 'Bureau', 'Terrain')),
    start_date DATE NOT NULL,
    end_date DATE,
    rent_amount NUMERIC NOT NULL, -- Loyer mensuel principal
    deposit_amount NUMERIC NOT NULL, -- Dépôt de garantie (Caution)
    advance_months INTEGER DEFAULT 3 CHECK (advance_months >= 0), -- Avances (ex: 3 mois de loyers d'avance)
    charges_amount NUMERIC DEFAULT 0 NOT NULL, -- Provisions sur charges mensuelles
    payment_day INTEGER DEFAULT 5 CHECK (payment_day BETWEEN 1 AND 28), -- Jour limite de paiement
    status TEXT NOT NULL DEFAULT 'Actif' CHECK (status IN ('Actif', 'Expiré', 'Résilié')),
    signature_url TEXT, -- Lien vers le document signé ou signature manuscrite en image
    pdf_url TEXT, -- Lien vers le contrat PDF généré
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table des Paiements et Loyers
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
    lease_id UUID REFERENCES public.leases(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC NOT NULL,
    period_start DATE NOT NULL, -- Début de la période (ex: 2026-06-01)
    period_end DATE NOT NULL, -- Fin de la période (ex: 2026-06-30)
    payment_date TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'Impayé' CHECK (status IN ('Payé', 'Partiellement payé', 'Impayé', 'En retard')),
    method TEXT CHECK (method IN ('Espèces', 'Virement', 'Orange Money', 'MTN Money', 'Moov Money', 'Wave')),
    reference TEXT, -- Référence de la transaction (Mobile Money, virement bancaire)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table des Quittances de loyer
CREATE TABLE IF NOT EXISTS public.receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
    payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE NOT NULL,
    receipt_number TEXT NOT NULL, -- Code unique (ex: Q-2026-06-0001)
    pdf_url TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    sent_via TEXT[] CHECK (sent_via <@ ARRAY['WhatsApp'::text, 'Email'::text]),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table de Maintenance (Tickets d'interventions)
CREATE TABLE IF NOT EXISTS public.maintenance_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Nouveau' CHECK (status IN ('Nouveau', 'Assigné', 'En cours', 'Résolu', 'Fermé')),
    priority TEXT NOT NULL DEFAULT 'Moyenne' CHECK (priority IN ('Faible', 'Moyenne', 'Haute', 'Urgente')),
    contractor_name TEXT,
    contractor_phone TEXT,
    cost NUMERIC DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table des Documents Archivés (Documents administratifs)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Contrat', 'Pièce Identité', 'Plan', 'Facture', 'Reçu', 'Autre')),
    file_url TEXT NOT NULL,
    file_size INTEGER,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table CRM Immobilier (Prospects & Pipeline)
CREATE TABLE IF NOT EXISTS public.crm_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    interest_type TEXT CHECK (interest_type IN ('Achat', 'Location', 'Investissement')),
    budget NUMERIC,
    status TEXT NOT NULL DEFAULT 'Nouveau' CHECK (status IN ('Nouveau', 'Contacté', 'Qualifié', 'Proposition', 'Gagné', 'Perdu')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table spéciale Logements Sociaux (Côte d'Ivoire)
CREATE TABLE IF NOT EXISTS public.social_housing_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
    beneficiary_first_name TEXT NOT NULL,
    beneficiary_last_name TEXT NOT NULL,
    beneficiary_national_id TEXT NOT NULL, -- CNI Ivoirienne
    beneficiary_phone TEXT NOT NULL,
    monthly_income NUMERIC NOT NULL, -- Pour évaluation du quotient social
    family_size INTEGER NOT NULL DEFAULT 1,
    eligibility_status TEXT NOT NULL DEFAULT 'En cours' CHECK (eligibility_status IN ('En cours', 'Éligible', 'Non éligible', 'Attribué')),
    attributed_property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 3. SÉCURITÉ & ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------

-- Activation du RLS sur toutes les tables
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landlords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_landlords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_housing_applications ENABLE ROW LEVEL SECURITY;

-- Politiques de Sécurité : Accès aux données selon l'agence de l'utilisateur

-- Politique globale de lecture/modification des profils
CREATE POLICY profile_policy ON public.profiles
    FOR ALL
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Pour les autres tables, on vérifie l'association via l'agency_id
-- Exemple de fonction helper pour récupérer l'agency_id de l'utilisateur connecté
CREATE OR REPLACE FUNCTION public.get_user_agency_id()
RETURNS UUID AS $$
    SELECT agency_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Politiques RLS dynamiques par Agence
CREATE POLICY agency_access_landlords ON public.landlords
    FOR ALL USING (agency_id = public.get_user_agency_id());

CREATE POLICY agency_access_properties ON public.properties
    FOR ALL USING (agency_id = public.get_user_agency_id());

CREATE POLICY agency_access_property_landlords ON public.property_landlords
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.properties p 
            WHERE p.id = property_id AND p.agency_id = public.get_user_agency_id()
        )
    );

CREATE POLICY agency_access_tenants ON public.tenants
    FOR ALL USING (agency_id = public.get_user_agency_id());

CREATE POLICY agency_access_leases ON public.leases
    FOR ALL USING (agency_id = public.get_user_agency_id());

CREATE POLICY agency_access_payments ON public.payments
    FOR ALL USING (agency_id = public.get_user_agency_id());

CREATE POLICY agency_access_receipts ON public.receipts
    FOR ALL USING (agency_id = public.get_user_agency_id());

CREATE POLICY agency_access_maintenance ON public.maintenance_tickets
    FOR ALL USING (agency_id = public.get_user_agency_id());

CREATE POLICY agency_access_documents ON public.documents
    FOR ALL USING (agency_id = public.get_user_agency_id());

CREATE POLICY agency_access_crm_leads ON public.crm_leads
    FOR ALL USING (agency_id = public.get_user_agency_id());

CREATE POLICY agency_access_social_housing ON public.social_housing_applications
    FOR ALL USING (agency_id = public.get_user_agency_id());

-- -----------------------------------------------------------------------------
-- 4. INDEXES POUR LA PERFORMANCE
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_agency_id ON public.profiles(agency_id);
CREATE INDEX IF NOT EXISTS idx_properties_agency_id ON public.properties(agency_id);
CREATE INDEX IF NOT EXISTS idx_landlords_agency_id ON public.landlords(agency_id);
CREATE INDEX IF NOT EXISTS idx_tenants_agency_id ON public.tenants(agency_id);
CREATE INDEX IF NOT EXISTS idx_leases_agency_id ON public.leases(agency_id);
CREATE INDEX IF NOT EXISTS idx_payments_agency_id ON public.payments(agency_id);
CREATE INDEX IF NOT EXISTS idx_payments_lease_id ON public.payments(lease_id);
CREATE INDEX IF NOT EXISTS idx_receipts_payment_id ON public.receipts(payment_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_property_id ON public.maintenance_tickets(property_id);
CREATE INDEX IF NOT EXISTS idx_documents_agency_id ON public.documents(agency_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_agency_id ON public.crm_leads(agency_id);
CREATE INDEX IF NOT EXISTS idx_social_housing_agency_id ON public.social_housing_applications(agency_id);
