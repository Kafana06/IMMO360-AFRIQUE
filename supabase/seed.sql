-- IMMO360 AFRIQUE - SEED DATA (DONNÉES DE DÉMONSTRATION)

-- -----------------------------------------------------------------------------
-- 1. AGENCES (TENANTS)
-- -----------------------------------------------------------------------------
INSERT INTO public.agencies (id, name, logo_url, country, currency, address, phone, email)
VALUES 
('a1111111-1111-1111-1111-111111111111', 'Babi Immo S.A.', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80', 'Côte d''Ivoire', 'XOF', 'Boulevard Latrille, Cocody, Abidjan', '+225 07 00 00 00 01', 'contact@babi-immo.ci'),
('a2222222-2222-2222-2222-222222222222', 'Teranga Agence Luxe', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80', 'Sénégal', 'XOF', 'Route des Almadies, Dakar', '+221 33 800 00 01', 'luxe@terangaimmo.sn')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. UTILISATEURS / PROFILS
-- -----------------------------------------------------------------------------
-- Ces profils simulent des utilisateurs inscrits dans le système
INSERT INTO public.profiles (id, agency_id, email, first_name, last_name, phone, role)
VALUES
('u1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'admin.babi@immo360.africa', 'Jean-Philippe', 'Koffi', '+225 05 55 55 55 55', 'agency_admin'),
('u1111112-1111-1111-1111-111111111112', 'a1111111-1111-1111-1111-111111111112', 'gestion.babi@immo360.africa', 'Awa', 'Touré', '+225 07 77 77 77 77', 'property_manager'),
('u1111113-1111-1111-1111-111111111113', 'a1111111-1111-1111-1111-111111111113', 'compta.babi@immo360.africa', 'Patrick', 'Diallo', '+225 01 01 01 01 01', 'accountant'),
('u2222221-2222-2222-2222-222222222221', 'a2222222-2222-2222-2222-222222222222', 'admin.teranga@immo360.africa', 'Moustapha', 'Ndiaye', '+221 77 123 45 67', 'agency_admin')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. PROPRIÉTAIRES (LANDLORDS)
-- -----------------------------------------------------------------------------
INSERT INTO public.landlords (id, agency_id, first_name, last_name, email, phone, address, bank_details, mobile_money_details)
VALUES
('l1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Amadou', 'Koné', 'amadou.kone@yahoo.ci', '+225 07 89 01 23 45', 'Cocody Les Deux Plateaux, Abidjan', 'RIB SIB CI056 01101 12345678901 22', 'Orange Money: +225 07 89 01 23 45'),
('l1111112-1111-1111-1111-111111111112', 'a1111111-1111-1111-1111-111111111111', 'Chantal', 'Boni', 'chantal.boni@gmail.com', '+225 05 12 34 56 78', 'Zone 4, Marcory, Abidjan', 'RIB SGCI CI008 01202 98765432109 88', 'Wave: +225 05 12 34 56 78'),
('l2222221-2222-2222-2222-222222222221', 'a2222222-2222-2222-2222-222222222222', 'Fatou', 'Sow', 'fatou.sow@orange.sn', '+221 77 654 32 10', 'Point E, Dakar', 'RIB CBAO SN012 01001 00223344556 77', 'Wave: +221 77 654 32 10')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. BIENS IMMOBILIERS
-- -----------------------------------------------------------------------------
INSERT INTO public.properties (id, agency_id, name, type, status, address, city, country, description, surface, rooms, rental_value, gallery)
VALUES
-- Propriétés de Babi Immo (Côte d'Ivoire)
('p1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Villa Prestige Cocody', 'Villa', 'Occupé', 'Rue des Jardins, Cocody Deux-Plateaux', 'Abidjan', 'Côte d''Ivoire', 'Magnifique villa duplex de 5 pièces avec piscine, jardin paysager, garage 2 véhicules, portail électrique et sécurité H24.', 350.0, 5, 1500000, ARRAY['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80']),
('p1111112-1111-1111-1111-111111111112', 'a1111111-1111-1111-1111-111111111111', 'Appartement Chic Zone 4', 'Appartement', 'Occupé', 'Rue Paul Langevin, Zone 4C, Marcory', 'Abidjan', 'Côte d''Ivoire', 'Appartement F3 haut standing meublé dans un immeuble récent avec ascenseur, groupe électrogène, salle de sport commune et conciergerie.', 120.0, 3, 850000, ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80']),
('p1111113-1111-1111-1111-111111111113', 'a1111111-1111-1111-1111-111111111111', 'Bureaux d''Affaires Plateau', 'Bureau', 'Disponible', 'Avenue Nogues, Plateau', 'Abidjan', 'Côte d''Ivoire', 'Plateau de bureaux cloisonné de 250m2, câblage réseau complet, climatisation centrale, parfait pour siège social ou agence.', 250.0, 6, 2500000, ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80']),
('p1111114-1111-1111-1111-111111111114', 'a1111111-1111-1111-1111-111111111111', 'Villa Sociale Abobo (Eligible CI)', 'Villa', 'Disponible', 'Quartier Avocatier, Abobo', 'Abidjan', 'Côte d''Ivoire', 'Villa basse de 3 pièces dans le cadre du programme de logements sociaux. Loyer modéré réglementé.', 75.0, 3, 120000, ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80']),

-- Propriétés de Teranga Agence Luxe (Sénégal)
('p2222221-2222-2222-2222-222222222221', 'a2222222-2222-2222-2222-222222222222', 'Penthouse Almadies Ocean View', 'Appartement', 'Occupé', 'Corniche Ouest, Les Almadies', 'Dakar', 'Sénégal', 'Penthouse exceptionnel de 4 pièces avec vue panoramique sur l''Océan Atlantique, piscine privée suspendue sur la terrasse, finitions marbre.', 280.0, 4, 3000000, ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80']),
('p2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'Magasin Commercial Dakar Plateau', 'Magasin', 'En maintenance', 'Avenue Léopold Sédar Senghor, Plateau', 'Dakar', 'Sénégal', 'Local commercial en rez-de-chaussée avec une grande vitrine passante, excellent emplacement commercial.', 90.0, 2, 1200000, ARRAY['https://images.unsplash.com/photo-1555529669-e69e7aa0db9a?auto=format&fit=crop&w=800&q=80'])
ON CONFLICT (id) DO NOTHING;

-- Liaison Biens <-> Propriétaires
INSERT INTO public.property_landlords (property_id, landlord_id)
VALUES
('p1111111-1111-1111-1111-111111111111', 'l1111111-1111-1111-1111-111111111111'),
('p1111112-1111-1111-1111-111111111112', 'l1111112-1111-1111-1111-111111111112'),
('p1111113-1111-1111-1111-111111111113', 'l1111111-1111-1111-1111-111111111111'),
('p1111114-1111-1111-1111-111111111114', 'l1111112-1111-1111-1111-111111111112'),
('p2222221-2222-2222-2222-222222222221', 'l2222221-2222-2222-2222-222222222221'),
('p2222222-2222-2222-2222-222222222222', 'l2222221-2222-2222-2222-222222222221')
ON CONFLICT (property_id, landlord_id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 5. LOCATAIRES (TENANTS)
-- -----------------------------------------------------------------------------
INSERT INTO public.tenants (id, agency_id, first_name, last_name, email, phone, profession, employer)
VALUES
('t1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Koffi', 'Kouassi', 'koffi.kouassi@unicef.org', '+225 07 45 45 45 45', 'Chargé de Mission UX', 'UNICEF Côte d''Ivoire'),
('t1111112-1111-1111-1111-111111111112', 'a1111111-1111-1111-1111-111111111111', 'Marie-Estelle', 'Ouedraogo', 'marie.estelle@ecobank.com', '+225 05 88 99 00 11', 'Directrice Risques', 'Ecobank CI'),
('t2222221-2222-2222-2222-222222222221', 'a2222222-2222-2222-2222-222222222222', 'Cheikh', 'Gueye', 'cheikh.gueye@tigo.sn', '+221 76 800 11 22', 'Ingénieur Réseaux', 'Free Sénégal')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 6. CONTRATS DE BAIL (LEASES)
-- -----------------------------------------------------------------------------
INSERT INTO public.leases (id, agency_id, property_id, tenant_id, type, start_date, end_date, rent_amount, deposit_amount, advance_months, charges_amount, payment_day, status, signature_url)
VALUES
-- Bail Villa Cocody (Babi Immo)
('b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 't1111111-1111-1111-1111-111111111111', 'Habitation', '2025-01-01', '2026-12-31', 1500000, 3000000, 3, 150000, 5, 'Actif', 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=400&q=80'),
-- Bail Appartement Zone 4 (Babi Immo)
('b1111112-1111-1111-1111-111111111112', 'a1111111-1111-1111-1111-111111111111', 'p1111112-1111-1111-1111-111111111112', 't1111112-1111-1111-1111-111111111112', 'Habitation', '2025-06-01', '2026-05-31', 850000, 1700000, 2, 50000, 5, 'Actif', 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=400&q=80'),
-- Bail Penthouse Almadies (Teranga Luxe)
('b2222221-2222-2222-2222-222222222221', 'a2222222-2222-2222-2222-222222222222', 'p2222221-2222-2222-2222-222222222221', 't2222221-2222-2222-2222-222222222221', 'Habitation', '2025-03-01', '2027-02-28', 3000000, 6000000, 3, 200000, 5, 'Actif', 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=400&q=80')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 7. PAIEMENTS (LOYERS)
-- -----------------------------------------------------------------------------
INSERT INTO public.payments (id, agency_id, lease_id, amount, period_start, period_end, payment_date, status, method, reference)
VALUES
-- Paiements pour la Villa Cocody (Total Loyer + Charges = 1 650 000 FCFA)
-- Avril Payé
('m1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 1650000, '2026-04-01', '2026-04-30', '2026-04-04 10:30:00+00', 'Payé', 'Virement', 'VR-SIB-09871'),
-- Mai Payé
('m1111112-1111-1111-1111-111111111112', 'a1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 1650000, '2026-05-01', '2026-05-30', '2026-05-05 14:15:00+00', 'Payé', 'Virement', 'VR-SIB-11402'),
-- Juin Impayé / En Retard (L'action se passe le 11 Juin 2026, date limite de paiement était le 5)
('m1111113-1111-1111-1111-111111111113', 'a1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 1650000, '2026-06-01', '2026-06-30', NULL, 'En retard', NULL, NULL),

-- Paiements pour l'appartement Zone 4 (Total Loyer + Charges = 900 000 FCFA)
-- Avril Payé
('m1111114-1111-1111-1111-111111111114', 'a1111111-1111-1111-1111-111111111111', 'b1111112-1111-1111-1111-111111111112', 900000, '2026-04-01', '2026-04-30', '2026-04-05 09:00:00+00', 'Payé', 'Orange Money', 'OM-260405-900K'),
-- Mai Payé
('m1111115-1111-1111-1111-111111111115', 'a1111111-1111-1111-1111-111111111111', 'b1111112-1111-1111-1111-111111111112', 900000, '2026-05-01', '2026-05-30', '2026-05-04 16:45:00+00', 'Payé', 'Wave', 'WV-260504-8742'),
-- Juin Payé (Payé à temps par Wave)
('m1111116-1111-1111-1111-111111111116', 'a1111111-1111-1111-1111-111111111111', 'b1111112-1111-1111-1111-111111111112', 900000, '2026-06-01', '2026-06-30', '2026-06-03 11:20:00+00', 'Payé', 'Wave', 'WV-260603-9041'),

-- Paiements pour le Penthouse Almadies (Total Loyer + Charges = 3 200 000 FCFA)
-- Juin Payé en espèces/chèque
('m2222221-2222-2222-2222-222222222221', 'a2222222-2222-2222-2222-222222222222', 'b2222221-2222-2222-2222-222222222221', 3200000, '2026-06-01', '2026-06-30', '2026-06-02 08:30:00+00', 'Payé', 'Virement', 'VR-CBAO-6721')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 8. QUITTANCES DE LOYER (RECEIPTS)
-- -----------------------------------------------------------------------------
INSERT INTO public.receipts (id, agency_id, payment_id, receipt_number, pdf_url, sent_at, sent_via)
VALUES
('q1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'm1111111-1111-1111-1111-111111111111', 'Q-2026-04-0001', 'https://immo360.africa/storage/receipts/q-2026-04-0001.pdf', '2026-04-04 11:00:00+00', ARRAY['Email', 'WhatsApp']),
('q1111112-1111-1111-1111-111111111112', 'a1111111-1111-1111-1111-111111111111', 'm1111112-1111-1111-1111-111111111112', 'Q-2026-05-0001', 'https://immo360.africa/storage/receipts/q-2026-05-0001.pdf', '2026-05-05 14:30:00+00', ARRAY['Email']),
('q1111113-1111-1111-1111-111111111113', 'a1111111-1111-1111-1111-111111111111', 'm1111116-1111-1111-1111-111111111116', 'Q-2026-06-0002', 'https://immo360.africa/storage/receipts/q-2026-06-0002.pdf', '2026-06-03 12:00:00+00', ARRAY['WhatsApp'])
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 9. MAINTENANCE (TICKETS)
-- -----------------------------------------------------------------------------
INSERT INTO public.maintenance_tickets (id, agency_id, property_id, title, description, status, priority, contractor_name, contractor_phone, cost)
VALUES
('t1111111-2222-3333-4444-555555555555', 'a1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'Fuite climatiseur salon', 'L''unité de climatisation du grand salon coule le long du mur en créant des traces d''humidité.', 'En cours', 'Moyenne', 'Sékou Plomberie-Clim', '+225 07 12 12 12 12', 45000),
('t2222222-3333-4444-5555-666666666666', 'a2222222-2222-2222-2222-222222222222', 'p2222222-2222-2222-2222-222222222222', 'Rénovation vitrine commerce', 'Remplacement des montants en aluminium et changement du vitrage fissuré.', 'Assigné', 'Haute', 'Dakar Alu & Design', '+221 77 444 33 22', 450000)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 10. CRM LEADS
-- -----------------------------------------------------------------------------
INSERT INTO public.crm_leads (id, agency_id, first_name, last_name, phone, email, interest_type, budget, status, notes)
VALUES
('c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Désiré', 'N''Guessan', '+225 01 02 03 04 05', 'desire.nguessan@gmail.com', 'Achat', 75000000, 'Qualifié', 'Recherche un appartement de 3 ou 4 pièces à Cocody-Angré, budget max 75 millions. Préfère résidence fermée.'),
('c1111112-1111-1111-1111-111111111112', 'a1111111-1111-1111-1111-111111111111', 'Kadiatou', 'Sangaré', '+225 05 06 07 08 09', 'kadi.sangare@live.fr', 'Location', 500000, 'Nouveau', 'Recherche studio ou F2 sur Marcory / Zone 4, meublé ou non. Entrée prévue début Juillet.'),
('c2222221-2222-2222-2222-222222222221', 'a2222222-2222-2222-2222-222222222222', 'Ousmane', 'Faye', '+221 78 999 88 77', 'ousmane.faye@invest-sn.com', 'Investissement', 150000000, 'Proposition', 'Client résidant en France. Souhaite acheter un immeuble de rapport ou plusieurs appartements sur Dakar Plateau ou Mermoz.')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 11. CANDIDATURES LOGEMENTS SOCIAUX (CÔTE D'IVOIRE)
-- -----------------------------------------------------------------------------
INSERT INTO public.social_housing_applications (id, agency_id, beneficiary_first_name, beneficiary_last_name, beneficiary_national_id, beneficiary_phone, monthly_income, family_size, eligibility_status, attributed_property_id)
VALUES
('s1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Bakary', 'Konaté', 'CI012345678', '+225 05 76 54 32 10', 180000, 5, 'Éligible', NULL),
('s1111112-1111-1111-1111-111111111112', 'a1111111-1111-1111-1111-111111111111', 'Yasmine', 'Gnakpa', 'CI987654321', '+225 07 11 22 33 44', 320000, 2, 'Attribué', 'p1111114-1111-1111-1111-111111111114')
ON CONFLICT (id) DO NOTHING;
