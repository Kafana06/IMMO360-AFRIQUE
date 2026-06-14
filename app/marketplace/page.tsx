'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Search, 
  Filter, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  X, 
  CheckCircle2, 
  ChevronRight,
  Layers,
  ArrowLeft,
  CalendarCheck
} from 'lucide-react';
import { mockSupabase, Property, Agency } from '@/lib/supabase/mock';
import Link from 'next/link';

export default function PublicMarketplacePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('Tous');
  const [selectedType, setSelectedType] = useState('Tous');
  const [selectedListingType, setSelectedListingType] = useState<'Tous' | 'Location' | 'Vente'>('Tous');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [minRooms, setMinRooms] = useState<string>('Tous');

  // Booking Modal
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Agency Contact Details Popover
  const [contactAgency, setContactAgency] = useState<Agency | null>(null);

  useEffect(() => {
    // Load database
    setProperties(mockSupabase.getAllProperties());
    setAgencies(mockSupabase.getAgencies());
  }, []);

  const handleBookAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;
    
    setBookingLoading(true);
    setBookingError(null);

    if (!bookingDate || !bookingTime) {
      setBookingError("Veuillez sélectionner un jour et un créneau horaire.");
      setBookingLoading(false);
      return;
    }

    setTimeout(() => {
      try {
        mockSupabase.addAppointment({
          agency_id: selectedProperty.agency_id,
          property_id: selectedProperty.id,
          client_name: bookingName,
          client_email: bookingEmail,
          client_phone: bookingPhone,
          date: bookingDate,
          time: bookingTime,
          message: bookingMessage
        });

        setBookingSuccess(true);
        setBookingLoading(false);
      } catch (err: any) {
        setBookingError("Une erreur est survenue lors de l'enregistrement de votre rendez-vous.");
        setBookingLoading(false);
      }
    }, 1200);
  };

  const closeBookingModal = () => {
    setSelectedProperty(null);
    setBookingName('');
    setBookingEmail('');
    setBookingPhone('');
    setBookingMessage('');
    setBookingDate('');
    setBookingTime('');
    setBookingSuccess(false);
    setBookingError(null);
  };

  // Generate next 7 days slots starting tomorrow
  const getNextDays = () => {
    const days = [];
    const weekdays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateString = d.toISOString().split('T')[0];
      const label = `${weekdays[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
      days.push({ value: dateString, label });
    }
    return days;
  };

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  const getPropertyAgency = (agencyId: string) => {
    return agencies.find(a => a.id === agencyId);
  };

  const filteredProperties = properties
    .filter(p => p.status === 'Disponible') // Only display available listings in public marketplace
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.city.toLowerCase().includes(searchQuery.toLowerCase());
      
      const agency = getPropertyAgency(p.agency_id);
      const matchesCountry = selectedCountry === 'Tous' || (agency && agency.country === selectedCountry);
      const matchesType = selectedType === 'Tous' || p.type === selectedType;
      const matchesListingType = selectedListingType === 'Tous' || p.listing_type === selectedListingType;
      const matchesPrice = maxPrice === '' || p.rental_value <= maxPrice;
      const matchesRooms = minRooms === 'Tous' || p.rooms >= parseInt(minRooms);

      return matchesSearch && matchesCountry && matchesType && matchesListingType && matchesPrice && matchesRooms;
    });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* BACKGROUND GRADIENTS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-1/4 w-[600px] h-[600px] bg-slate-800/10 rounded-full blur-[160px] pointer-events-none" />

      {/* HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-title text-xl font-bold tracking-tight text-white">
                  IMMO<span className="text-amber-500">360</span>
                </span>
                <span className="text-[10px] block font-mono text-amber-500 tracking-[0.2em] font-semibold -mt-1 uppercase">AFRIQUE</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Retour Accueil
            </Link>
            <Link 
              href="/dashboard?login=true" 
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-200 border border-slate-850 hover:bg-slate-900 hover:text-white transition-all"
            >
              Accès Agence
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-10 px-6 max-w-7xl mx-auto text-center w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] text-amber-500 font-semibold mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Marketplace Publique & Prise de Rendez-vous</span>
        </div>
        <h1 className="font-title text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Trouvez votre futur bien immobilier.
        </h1>
        <p className="mt-4 text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Consultez et recherchez parmi les annonces en cours de publication de nos agences partenaires en Côte d'Ivoire, Sénégal et partout en Afrique de l'Ouest.
        </p>
      </section>

      {/* FILTER PANEL */}
      <section className="px-6 max-w-7xl mx-auto w-full mb-8">
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par mot-clé, ville, quartier..."
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none transition-all"
              />
            </div>

            {/* Country Selector */}
            <div>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-all cursor-pointer"
              >
                <option value="Tous">Tous les pays</option>
                <option value="Côte d'Ivoire">Côte d'Ivoire 🇨🇮</option>
                <option value="Sénégal">Sénégal 🇸🇳</option>
                <option value="Cameroun">Cameroun 🇨🇲</option>
                <option value="Gabon">Gabon 🇬🇦</option>
                <option value="France">France 🇫🇷</option>
              </select>
            </div>

            {/* Transaction Type */}
            <div className="flex gap-2">
              {(['Tous', 'Location', 'Vente'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedListingType(type)}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                    selectedListingType === type
                      ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-900/60">
            
            {/* Property Type */}
            <div>
              <label className="text-[9px] text-slate-400 font-bold block mb-1 uppercase tracking-wider">Type de bien</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2 text-xs text-white focus:outline-none transition-all cursor-pointer"
              >
                <option value="Tous">Tous types</option>
                <option value="Appartement">Appartement</option>
                <option value="Villa">Villa</option>
                <option value="Terrain">Terrain</option>
                <option value="Bureau">Bureau</option>
                <option value="Magasin">Magasin</option>
                <option value="Entrepôt">Entrepôt</option>
              </select>
            </div>

            {/* Max budget */}
            <div>
              <label className="text-[9px] text-slate-400 font-bold block mb-1 uppercase tracking-wider">Budget Max</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value === '' ? '' : parseInt(e.target.value))}
                placeholder="Ex: 500000"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2 text-xs text-white focus:outline-none transition-all font-mono"
              />
            </div>

            {/* Min rooms */}
            <div>
              <label className="text-[9px] text-slate-400 font-bold block mb-1 uppercase tracking-wider">Nombre de pièces minimum</label>
              <select
                value={minRooms}
                onChange={(e) => setMinRooms(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2 text-xs text-white focus:outline-none transition-all cursor-pointer"
              >
                <option value="Tous">Sans filtre</option>
                <option value="1">1+ pièces</option>
                <option value="2">2+ pièces</option>
                <option value="3">3+ pièces</option>
                <option value="4">4+ pièces</option>
                <option value="5">5+ pièces</option>
              </select>
            </div>

          </div>
        </div>
      </section>

      {/* PROPERTIES LIST */}
      <main className="px-6 max-w-7xl mx-auto w-full mb-20 flex-grow">
        
        {filteredProperties.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/20 border border-slate-900 rounded-3xl p-8">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4 stroke-[1.5]" />
            <h3 className="text-base font-bold text-white mb-1">Aucune annonce trouvée</h3>
            <p className="text-xs text-slate-400">Modifiez vos critères de recherche pour afficher d'autres résultats.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProperties.map(property => {
              const agency = getPropertyAgency(property.agency_id);
              
              return (
                <motion.div 
                  key={property.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900/35 border border-slate-900 hover:border-slate-850 rounded-3xl overflow-hidden shadow-2xl flex flex-col group transition-all duration-300"
                >
                  {/* Property Image */}
                  <div className="relative h-48 w-full bg-slate-950 overflow-hidden shrink-0">
                    <img
                      src={property.gallery[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold shadow-md ${
                        property.listing_type === 'Vente' 
                          ? 'bg-amber-500 text-slate-950' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        {property.listing_type || 'Location'}
                      </span>
                    </div>
                    
                    <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
                      <span className="font-mono text-amber-500 font-extrabold text-sm">
                        {property.rental_value.toLocaleString()} {agency?.currency || 'FCFA'}
                        {property.listing_type === 'Location' && <span className="text-[10px] text-slate-450 font-normal"> /mois</span>}
                      </span>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{property.type}</span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-450">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{property.city}, {property.country}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-white text-sm mb-2 group-hover:text-amber-500 transition-colors line-clamp-1">{property.name}</h3>
                      <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed mb-4">{property.description}</p>
                    </div>

                    <div className="space-y-4">
                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-950/30 p-2.5 rounded-xl border border-slate-900/50">
                        <div><span className="text-slate-500 font-medium">Surface :</span> <span className="font-semibold text-slate-200 font-mono">{property.surface} m²</span></div>
                        <div><span className="text-slate-500 font-medium">Pièces :</span> <span className="font-semibold text-slate-200 font-mono">{property.rooms || 'N/A'}</span></div>
                      </div>

                      {/* Agency Badge */}
                      {agency && (
                        <div className="flex items-center justify-between border-t border-slate-900 pt-3 shrink-0">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-slate-950 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-800">
                              {agency.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-slate-300 block">{agency.name}</span>
                              <span className="text-[8px] text-slate-500 block">{agency.email}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setContactAgency(agency)}
                            className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition-colors border-none bg-transparent cursor-pointer"
                            title="Contacter l'agence"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Schedule Button */}
                      <button
                        onClick={() => setSelectedProperty(property)}
                        className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/5 transition-all border-none"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Prendre RDV (Visite)</span>
                      </button>

                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

      </main>

      {/* PUBLIC FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center text-xs text-slate-500 shrink-0">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-white">IMMO360 AFRIQUE</span>
          </div>
          <p className="margin-0">© 2026 Espace de publication multi-agences. Tous droits réservés.</p>
        </div>
      </footer>

      {/* APPOINTMENT MODAL */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              onClick={closeBookingModal}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 text-white rounded-3xl shadow-2xl max-w-lg w-full relative z-10 p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={closeBookingModal}
                className="absolute right-4 top-4 p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {bookingSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="font-title text-xl font-bold text-white mb-2">Rendez-vous planifié !</h3>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed max-w-sm mx-auto">
                    Votre demande de visite pour le bien <strong>"{selectedProperty.name}"</strong> a été transmise avec succès à l'agence. Vous recevrez une confirmation sous peu.
                  </p>
                  <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-950/80 text-left text-xs mb-6 font-mono space-y-2">
                    <div className="flex justify-between"><span className="text-slate-500">Date :</span> <span className="text-white font-semibold">{bookingDate}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Heure :</span> <span className="text-white font-semibold">{bookingTime}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Client :</span> <span className="text-white font-semibold">{bookingName}</span></div>
                  </div>
                  <button
                    onClick={closeBookingModal}
                    className="px-6 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer border-none"
                  >
                    Fermer
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-500">
                    <CalendarCheck className="w-5 h-5" />
                    <span className="font-bold text-xs uppercase tracking-wider">Planifier une Visite</span>
                  </div>
                  <h3 className="font-title text-base sm:text-lg font-bold text-white line-clamp-1">{selectedProperty.name}</h3>
                  <p className="text-[11px] text-slate-400">Remplissez les détails et choisissez votre créneau horaire sur le calendrier personnalisé de l'agence.</p>

                  <form onSubmit={handleBookAppointmentSubmit} className="space-y-4 pt-2 text-left">
                    {bookingError && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                        <X className="w-4 h-4 shrink-0" />
                        <span>{bookingError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] text-slate-400 font-bold block mb-1 uppercase tracking-wider">Nom Complet *</label>
                        <input
                          type="text"
                          required
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          placeholder="Fatou Diop"
                          className="w-full bg-slate-950 border border-slate-850 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-bold block mb-1 uppercase tracking-wider">Téléphone *</label>
                        <input
                          type="tel"
                          required
                          value={bookingPhone}
                          onChange={(e) => setBookingPhone(e.target.value)}
                          placeholder="+225 07..."
                          className="w-full bg-slate-950 border border-slate-850 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] text-slate-400 font-bold block mb-1 uppercase tracking-wider">Adresse E-mail *</label>
                      <input
                        type="email"
                        required
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        placeholder="client@mail.com"
                        className="w-full bg-slate-950 border border-slate-850 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-all font-mono"
                      />
                    </div>

                    {/* Step 1: Calendar Select Date */}
                    <div>
                      <label className="text-[9px] text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">Étape 1 : Choisissez le jour de visite *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-slate-850 p-2 rounded-xl bg-slate-950/40">
                        {getNextDays().map(day => (
                          <button
                            key={day.value}
                            type="button"
                            onClick={() => setBookingDate(day.value)}
                            className={`px-3 py-2 rounded-lg text-left text-[10px] font-bold transition-all border cursor-pointer ${
                              bookingDate === day.value
                                ? 'bg-amber-500 border-amber-500 text-slate-950'
                                : 'bg-slate-950/80 border-slate-850 text-slate-400 hover:text-white hover:border-slate-800'
                            }`}
                          >
                            {day.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Calendar Select Time Slot */}
                    {bookingDate && (
                      <div>
                        <label className="text-[9px] text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">Étape 2 : Choisissez l'heure disponible *</label>
                        <div className="grid grid-cols-3 gap-2 border border-slate-850 p-2 rounded-xl bg-slate-950/40">
                          {timeSlots.map(time => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setBookingTime(time)}
                              className={`py-2 rounded-lg text-center text-xs font-bold transition-all border cursor-pointer ${
                                bookingTime === time
                                  ? 'bg-amber-500 border-amber-500 text-slate-950'
                                  : 'bg-slate-950/80 border-slate-850 text-slate-400 hover:text-white hover:border-slate-800'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{time}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-[9px] text-slate-400 font-bold block mb-1 uppercase tracking-wider">Remarques ou Message (Optionnel)</label>
                      <textarea
                        value={bookingMessage}
                        onChange={(e) => setBookingMessage(e.target.value)}
                        placeholder="Ex: Je souhaite visiter ce bien l'après-midi..."
                        rows={2}
                        className="w-full bg-slate-950 border border-slate-850 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={closeBookingModal}
                        className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer border-none"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={bookingLoading}
                        className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:from-slate-850 disabled:to-slate-850 text-slate-950 disabled:text-slate-500 font-bold text-xs transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                      >
                        {bookingLoading ? (
                          <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                        ) : (
                          <span>Confirmer le RDV</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AGENCY CONTACT DETAILS MODAL */}
      <AnimatePresence>
        {contactAgency && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              onClick={() => setContactAgency(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 text-white rounded-3xl shadow-2xl max-w-sm w-full relative z-10 p-6 text-center"
            >
              <button
                onClick={() => setContactAgency(null)}
                className="absolute right-4 top-4 p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                <Building2 className="w-6 h-6 text-amber-500" />
              </div>

              <h3 className="font-title text-base font-bold text-white mb-1">{contactAgency.name}</h3>
              <p className="text-[10px] text-slate-500 mb-6 uppercase tracking-wider font-mono">{contactAgency.country}</p>

              <div className="space-y-3 text-left bg-slate-950/50 p-4 rounded-2xl border border-slate-950/80 mb-6 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-mono text-slate-200">{contactAgency.phone || "Non renseigné"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-mono text-slate-200">{contactAgency.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-slate-200">{contactAgency.address || "Non renseigné"}</span>
                </div>
              </div>

              <button
                onClick={() => setContactAgency(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer border-none"
              >
                Fermer
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
