'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  FileText, 
  Smartphone, 
  MessageSquare, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  Clock,
  Layers,
  Mail,
  Phone,
  Send,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [currency, setCurrency] = useState<'FCFA' | 'EUR'>('FCFA');
  const [activeTab, setActiveTab] = useState<'payments' | 'leases' | 'crm' | 'sales' | 'social'>('payments');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Simulation de paiement interactive sur la landing page
  const [simStep, setSimStep] = useState<1 | 2 | 3>(1);
  const [simOperator, setSimOperator] = useState<'orange' | 'wave' | 'mtn'>('orange');
  const [simNumber, setSimNumber] = useState('+225 07 45 45 45 45');
  const [simProgress, setSimProgress] = useState(0);

  // Formulaire de contact landing page
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setTimeout(() => {
      setContactLoading(false);
      setContactSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactMessage('');
    }, 1000);
  };

  const startSimulation = () => {
    setSimStep(2);
    setSimProgress(0);
  };

  useEffect(() => {
    if (simStep === 2) {
      const interval = setInterval(() => {
        setSimProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setSimStep(3);
            }, 800);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [simStep]);

  const pricing = {
    monthly: {
      starter: { FCFA: '15 000 FCFA', EUR: '23 €' },
      agency: { FCFA: '25 000 FCFA', EUR: '38 €' },
      enterprise: { FCFA: '50 000 FCFA', EUR: '76 €' }
    },
    annual: {
      starter: { FCFA: '12 000 FCFA', EUR: '18 €' },
      agency: { FCFA: '20 000 FCFA', EUR: '30 €' },
      enterprise: { FCFA: '40 000 FCFA', EUR: '60 €' }
    }
  };

  const getPrice = (plan: 'starter' | 'agency' | 'enterprise') => {
    return pricing[billingPeriod][plan][currency];
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-amber-500 selection:text-slate-900">
      
      {/* Background gradients decoratifs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-1/4 w-[600px] h-[600px] bg-slate-800/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-10 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full glass-card-dark border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Building2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-title text-xl font-bold tracking-tight text-white">
                IMMO<span className="text-amber-500">360</span>
              </span>
              <span className="text-[10px] block font-mono text-amber-500 tracking-[0.2em] font-semibold -mt-1 uppercase">AFRIQUE</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="/marketplace" className="text-amber-500 font-bold hover:text-amber-450 transition-colors">Marketplace 🌟</Link>
            <a href="#problems" className="hover:text-amber-500 transition-colors">Défis</a>
            <a href="#features" className="hover:text-amber-500 transition-colors">Fonctionnalités</a>
            <a href="#simulator" className="hover:text-amber-500 transition-colors">Démo live</a>
            <a href="#pricing" className="hover:text-amber-500 transition-colors">Tarifs</a>
            <a href="#faq" className="hover:text-amber-500 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard?login=true" 
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-200 border border-slate-800 hover:bg-slate-900 hover:text-white transition-all"
            >
              Démo Agence
            </Link>
            <Link 
              href="/dashboard?signup=true" 
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 shadow-lg shadow-amber-500/10 transition-all duration-300"
            >
              <span className="flex items-center gap-1.5">
                Essai Gratuit <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-28 md:pt-32 md:pb-40 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-amber-500 font-semibold mb-8 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Le premier ERP Immobilier pensé pour l'Afrique francophone</span>
        </div>

        <h1 className="font-title text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08] max-w-5xl mx-auto">
          Le système d'exploitation de <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
            l'immobilier africain.
          </span>
        </h1>

        <p className="mt-8 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Libérez votre agence de la paperasse. Automatisez la perception des loyers par Mobile Money, générez des quittances professionnelles et gérez vos baux en parfaite conformité.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/dashboard?signup=true" 
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-slate-950 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 shadow-xl shadow-amber-500/20 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            Commencer maintenant
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="#simulator" 
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-slate-300 hover:text-white bg-slate-900/60 border border-slate-800 hover:bg-slate-900 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Tester le simulateur
          </a>
        </div>

        {/* Dashboard Preview Render */}
        <div className="mt-20 md:mt-28 relative mx-auto max-w-6xl rounded-3xl p-2 bg-gradient-to-b from-slate-800 to-slate-950 shadow-2xl shadow-slate-950/80 border border-slate-800/80">
          <div className="relative rounded-[22px] overflow-hidden bg-slate-950/50 backdrop-blur-sm aspect-[16/10] border border-slate-900 flex flex-col items-center justify-center p-8 text-center group">
            
            {/* Simulation d'une interface dashboard de luxe */}
            <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity duration-700" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80')` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
            
            {/* Fausse Sidebar + Grid de la démo */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between text-left">
              <div className="flex justify-between items-center pb-4 border-b border-slate-900">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs font-mono text-slate-500 ml-4">https://app.immo360.africa/dashboard</span>
                </div>
                <div className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-amber-500 uppercase tracking-widest font-bold">
                  BABI IMMO S.A.
                </div>
              </div>

              {/* Faux KPIs animés */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-auto">
                {[
                  { label: "Loyers Encaissés (Juin)", val: "14 850 000 FCFA", color: "text-emerald-400" },
                  { label: "Taux d'Occupation", val: "94.6%", color: "text-amber-400" },
                  { label: "Locataires Relancés", val: "12", color: "text-rose-400" },
                  { label: "Contrats Actifs", val: "148 baux", color: "text-white" }
                ].map((kpi, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-850/60 backdrop-blur-md">
                    <span className="text-xs text-slate-500 font-medium">{kpi.label}</span>
                    <h4 className={`text-lg sm:text-xl font-bold font-mono mt-1 ${kpi.color}`}>{kpi.val}</h4>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-4 border-t border-slate-900 gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Explorez l'ensemble des modules interactifs</h3>
                  <p className="text-xs text-slate-500">Pas de faux formulaires : une application de gestion complète et simulée.</p>
                </div>
                <Link
                  href="/dashboard?login=true"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 transition-colors flex items-center gap-2 shrink-0 shadow-lg shadow-black/20"
                >
                  Accéder au Dashboard <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PROBLEMS SECTION */}
      <section id="problems" className="py-24 border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-title text-3xl sm:text-4xl font-extrabold text-white">
              Les outils occidentaux n'ont pas été pensés pour le marché africain
            </h2>
            <p className="mt-4 text-slate-400">
              Les agences immobilières en Afrique font face à des contraintes de paiement et de gestion uniques qu'aucun logiciel standard ne résout.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                title: "Pas de Mobile Money",
                desc: "Les locataires privilégient Orange Money, MTN, Wave ou Moov, tandis que les logiciels standards n'intègrent que Stripe, PayPal ou la carte bancaire.",
                icon: Smartphone
              },
              {
                title: "Relances manuelles pénibles",
                desc: "Passer des heures à envoyer des rappels sur WhatsApp ou par SMS un par un. Le manque d'automatisation conduit à des loyers en retard systématiques.",
                icon: MessageSquare
              },
              {
                title: "Baux et conformité locale",
                desc: "Les contrats de bail doivent respecter le droit OHADA et les spécificités des pays africains (ex: le plafonnement des mois de caution en Côte d'Ivoire).",
                icon: FileText
              }
            ].map((prob, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-slate-900/50 border border-slate-900 hover:border-slate-800 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
                  <prob.icon className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-white">{prob.title}</h3>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{prob.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO / SIMULATOR SECTION */}
      <section id="simulator" className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <span className="text-xs font-mono font-bold text-amber-500 tracking-wider uppercase">Démonstration Interactive</span>
              <h2 className="font-title text-3xl sm:text-4xl font-extrabold text-white mt-3">
                Simulez un encaissement par Mobile Money en temps réel
              </h2>
              <p className="mt-4 text-slate-400 leading-relaxed">
                Notre solution se connecte aux passerelles de paiement locales les plus populaires d'Afrique de l'Ouest et Centrale. Faites l'expérience du flux de bout en bout de vos futurs clients.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <span className="text-sm text-slate-300">Intégration native des codes USSD & SDK Wave, MTN, Orange.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <span className="text-sm text-slate-300">Génération et envoi automatisés de la quittance en PDF par WhatsApp.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <span className="text-sm text-slate-300">Rapprochement bancaire et comptabilité simplifiée en 1 clic.</span>
                </div>
              </div>
            </div>

            {/* Simulateur UI */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
              
              <div className="flex justify-between items-center pb-6 border-b border-slate-900 mb-6">
                <span className="text-xs font-mono text-slate-400">Terminal d'Encaissement</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-[10px] font-bold text-amber-400">Mode Sandbox Actif</span>
              </div>

              <AnimatePresence mode="wait">
                {simStep === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="text-xs text-slate-400 block mb-2 font-medium">Sélectionnez l'opérateur Mobile Money</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'orange', label: 'Orange Money', color: 'border-orange-500/50 bg-orange-950/20 text-orange-400' },
                          { id: 'wave', label: 'Wave', color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-400' },
                          { id: 'mtn', label: 'MTN Money', color: 'border-yellow-500/50 bg-yellow-950/20 text-yellow-400' }
                        ].map(op => (
                          <button
                            key={op.id}
                            onClick={() => setSimOperator(op.id as any)}
                            className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                              simOperator === op.id ? op.color : 'border-slate-800 hover:border-slate-700 bg-slate-900/50 text-slate-400'
                            }`}
                          >
                            {op.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-2 font-medium">Numéro de téléphone du locataire</label>
                      <input
                        type="text"
                        value={simNumber}
                        onChange={(e) => setSimNumber(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                        placeholder="+225 ..."
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900 flex justify-between items-center">
                      <div>
                        <span className="text-xs text-slate-500 block">Loyer Mensuel</span>
                        <span className="text-sm font-bold text-white font-mono">Appartement F3 - Zone 4</span>
                      </div>
                      <span className="text-base font-bold text-amber-500 font-mono">900 000 FCFA</span>
                    </div>

                    <button
                      onClick={startSimulation}
                      className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
                    >
                      Payer via {simOperator === 'orange' ? 'Orange Money' : simOperator === 'wave' ? 'Wave' : 'MTN'}
                    </button>
                  </motion.div>
                )}

                {simStep === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="py-10 text-center space-y-6"
                  >
                    <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                      <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-bold text-white">Demande de paiement envoyée...</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Veuillez valider l'invite Push reçue sur le numéro <span className="font-mono text-amber-500">{simNumber}</span>.
                      </p>
                    </div>

                    <div className="w-full max-w-xs mx-auto bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full transition-all duration-200" style={{ width: `${simProgress}%` }} />
                    </div>
                  </motion.div>
                )}

                {simStep === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 space-y-6"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-white">Transaction Confirmée !</h4>
                      <p className="text-xs text-slate-400">Réf : <span className="font-mono text-amber-500">TX-98762514-OM</span></p>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 max-w-sm mx-auto space-y-3 text-left text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span>Locataire :</span>
                        <span className="font-semibold text-white">Koffi Kouassi</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Montant :</span>
                        <span className="font-semibold text-white font-mono">900 000 FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quittance Générée :</span>
                        <span className="font-mono text-amber-400">Q-2026-06-9041.pdf</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-900 text-[10px] text-emerald-400">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" /> Envoyé par WhatsApp
                        </span>
                        <span>Il y a quelques instants</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSimStep(1)}
                      className="text-xs text-slate-400 hover:text-white font-semibold underline underline-offset-4"
                    >
                      Refaire un test
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>
        </div>
      </section>

      {/* CORE FEATURES TABS */}
      <section id="features" className="py-24 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-amber-500 tracking-wider uppercase">Architecture Modulaire</span>
            <h2 className="font-title text-3xl sm:text-4xl font-extrabold text-white mt-3">
              Conçu pour gérer 100% de votre activité immobilière
            </h2>
            <p className="mt-4 text-slate-400">
              Chaque fonctionnalité a été conçue en collaboration avec des professionnels de l'immobilier ouest-africain.
            </p>
          </div>

          {/* Navigation des onglets */}
          <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-900 rounded-2xl max-w-3xl mx-auto mb-12">
            {[
              { id: 'payments', label: 'Paiements Mobile', icon: Smartphone },
              { id: 'leases', label: 'Baux OHADA', icon: FileText },
              { id: 'sales', label: 'Ventes & Cessions', icon: TrendingUp },
              { id: 'crm', label: 'CRM & Prospects', icon: Users },
              { id: 'social', label: 'Logements Sociaux', icon: Layers }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenu de l'onglet actif */}
          <div className="p-8 md:p-12 rounded-3xl bg-slate-900/40 border border-slate-850/80 max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'payments' && (
                <motion.div 
                  key="payments"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid md:grid-cols-2 gap-12 items-center"
                >
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">Loyers & Encaissements automatisés</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Finis les chèques en bois et les déplacements physiques. Notre passerelle de paiement multi-pays encaisse les fonds et les attribue automatiquement à la période correspondante.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" />
                        <span>Rapprochement comptable instantané</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" />
                        <span>Support multidevise (FCFA XOF/XAF, Euro)</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" />
                        <span>Notification de paiement automatique au propriétaire</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block font-bold">Transaction récente</span>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-900">
                      <div>
                        <h4 className="text-sm font-semibold text-white">Koffi Kouassi</h4>
                        <span className="text-[10px] text-slate-500">Appt 4B - Zone 4</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-emerald-400 font-mono">+900 000 FCFA</span>
                        <span className="text-[10px] text-slate-500 block">via Wave</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>Statut de la quittance :</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">WhatsApp Envoyé</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'leases' && (
                <motion.div 
                  key="leases"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid md:grid-cols-2 gap-12 items-center"
                >
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">Baux administratifs et signature électronique</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Créez des contrats conformes au droit OHADA en 2 minutes. Sélectionnez un modèle (habitation, commercial, professionnel, terrain), remplissez les détails et envoyez-le pour signature électronique.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" />
                        <span>Génération de PDF aux normes locales</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" />
                        <span>Alertes de renouvellement automatique</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" />
                        <span>Coffre-fort sécurisé pour l'archivage numérique</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block font-bold">Éditeur de Bail</span>
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-900 rounded-lg border border-slate-850 text-xs flex justify-between items-center">
                        <span className="text-slate-400">Modèle de Bail :</span>
                        <span className="font-semibold text-white">Habitation - Côte d'Ivoire</span>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-lg border border-slate-850 text-xs flex justify-between items-center">
                        <span className="text-slate-400">Loi de Caution :</span>
                        <span className="font-semibold text-amber-500">Max 2 mois (Conforme loi 2018)</span>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-lg border border-slate-850 text-xs flex justify-between items-center">
                        <span className="text-slate-400">Signature :</span>
                        <span className="font-semibold text-emerald-400">Signé numériquement</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'sales' && (
                <motion.div 
                  key="sales"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid md:grid-cols-2 gap-12 items-center"
                >
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">Ventes, Cessions &amp; Commissions (10%)</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Publiez des maisons et des terrains à vendre. Notre plateforme intègre un module de checkout transparent prélevant automatiquement une commission de 10% sur chaque transaction.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" />
                        <span>Visualisation de la répartition 90/10 en temps réel</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" />
                        <span>Enregistrement automatique de l'acheteur avec justificatifs</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" />
                        <span>Paiement sécurisé et intégration comptable instantanée</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block font-bold">Répartition Financière Type</span>
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 space-y-3 text-xs">
                      <div className="flex justify-between font-bold text-white">
                        <span>Vente de Terrain (Cocody, Abidjan)</span>
                        <span className="text-emerald-400 font-semibold font-mono">Enregistré</span>
                      </div>
                      <div className="pt-2 border-t border-slate-850 space-y-2 font-mono text-[11px]">
                        <div className="flex justify-between text-slate-300">
                          <span>Prix de vente final :</span>
                          <span className="font-semibold text-white">45 000 000 FCFA</span>
                        </div>
                        <div className="flex justify-between text-amber-400">
                          <span>Commission Plateforme (10%) :</span>
                          <span className="font-semibold">- 4 500 000 FCFA</span>
                        </div>
                        <div className="flex justify-between text-emerald-400 font-bold border-t border-dashed border-slate-800 pt-2 text-xs">
                          <span>Net reversé au propriétaire (90%) :</span>
                          <span>40 500 000 FCFA</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-850 text-[10px] text-slate-500 flex justify-between">
                        <span>Acheteur : Kouadio N'Goran</span>
                        <span>Mode : Virement Bancaire</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'crm' && (
                <motion.div 
                  key="crm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid md:grid-cols-2 gap-12 items-center"
                >
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">Pipeline de Vente & Suivi Clients</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Transformez vos contacts en transactions de location ou de vente. Suivez vos prospects à travers un kanban de vente visuel et programmez des relances automatiques.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" />
                        <span>Fiches de prospects unifiées</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" />
                        <span>Rapports d'activité des agents</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" />
                        <span>Intégration d'agenda pour les visites</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block font-bold">Dernier Prospect</span>
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 space-y-2 text-xs">
                      <div className="flex justify-between font-bold text-white">
                        <span>Désiré N'Guessan</span>
                        <span className="text-amber-500">Qualifié</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">Recherche Villa F5 Cocody, Budget : 75M FCFA</p>
                      <div className="pt-2 border-t border-slate-850 flex justify-between items-center text-[10px] text-slate-500">
                        <span>Agent assigné : Awa T.</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Visite le 15 Juin</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'social' && (
                <motion.div 
                  key="social"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid md:grid-cols-2 gap-12 items-center"
                >
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">Spécificité : Gestion des Logements Sociaux</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Spécialement développé pour répondre aux programmes gouvernementaux (notamment en Côte d'Ivoire). Suivez les dossiers des bénéficiaires, calculez les quotients sociaux d'éligibilité et gérez les attributions de biens.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" />
                        <span>Critères d'éligibilité paramétrables</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" />
                        <span>Vérification automatique du revenu/quotient familial</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" />
                        <span>Historique transparent des attributions</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block font-bold">Bénéficiaire Logement Social</span>
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 space-y-2 text-xs">
                      <div className="flex justify-between font-bold text-white">
                        <span>Bakary Konaté</span>
                        <span className="text-emerald-400">Éligible</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">Revenu mensuel déclaré : 180 000 FCFA (Foyer de 5 personnes)</p>
                      <div className="pt-2 border-t border-slate-850 text-[10px] text-slate-500">
                        <span>Dossier validé par le gestionnaire le 10/05/2026</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-amber-500 tracking-wider uppercase">Plans de Tarification</span>
            <h2 className="font-title text-3xl sm:text-4xl font-extrabold text-white mt-3">
              Un tarif transparent adapté à votre volume de biens
            </h2>
            <p className="mt-4 text-slate-400">
              Choisissez votre formule de facturation. Économisez 20% en optant pour un paiement annuel.
            </p>

            {/* Sélecteurs de Devise & Période */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              {/* Toggle Mensuel / Annuel */}
              <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    billingPeriod === 'monthly' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Mensuel
                </button>
                <button
                  onClick={() => setBillingPeriod('annual')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    billingPeriod === 'annual' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Annuel (-20%)
                </button>
              </div>

              {/* Toggle FCFA / EUR */}
              <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  onClick={() => setCurrency('FCFA')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currency === 'FCFA' ? 'bg-slate-850 text-amber-500' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  FCFA
                </button>
                <button
                  onClick={() => setCurrency('EUR')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currency === 'EUR' ? 'bg-slate-850 text-amber-500' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Euros (€)
                </button>
              </div>
            </div>

          </div>

          {/* Grille des tarifs */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* PLAN STARTER */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-900 flex flex-col justify-between relative overflow-hidden">
              <div>
                <h3 className="text-lg font-bold text-white">Plan Standard</h3>
                <p className="text-xs text-slate-400 mt-2">Pour les petits bailleurs indépendants débutant la digitalisation.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">{getPrice('starter')}</span>
                  <span className="text-xs text-slate-500">/ mois</span>
                </div>
                <ul className="mt-8 space-y-4 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Jusqu'à <span className="font-bold">5 biens immobiliers</span></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Gestion des locataires & baux</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Encaissements Espèces/Virements</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Envois de quittances par email</span>
                  </li>
                </ul>
              </div>
              <Link 
                href="/dashboard?signup=true"
                className="mt-8 w-full py-3 rounded-xl border border-slate-800 hover:bg-slate-900 transition-colors text-center text-xs font-bold text-white block"
              >
                Choisir ce plan
              </Link>
            </div>

            {/* PLAN AGENCY (RECOMMENDED) */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border-2 border-amber-500/80 flex flex-col justify-between relative shadow-xl shadow-amber-500/5">
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-[10px] font-extrabold text-slate-950 uppercase tracking-widest">
                Populaire
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Plan Premium</h3>
                <p className="text-xs text-slate-400 mt-2">Pour les agences immobilières dynamiques recherchant l'automatisation.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-amber-500 font-mono">{getPrice('agency')}</span>
                  <span className="text-xs text-slate-400">/ mois</span>
                </div>
                <ul className="mt-8 space-y-4 text-xs text-slate-200">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-bold">Jusqu'à 15 biens immobiliers</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Encaissements Mobile Money & Wave</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-bold">Relances & Quittances WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Accès Comptable & Signature Électronique</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Gestion des Logements Sociaux</span>
                  </li>
                </ul>
              </div>
              <Link 
                href="/dashboard?signup=true"
                className="mt-8 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all text-center text-xs block shadow-lg shadow-amber-500/10"
              >
                Commencer l'essai gratuit
              </Link>
            </div>

            {/* PLAN ENTERPRISE */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-900 flex flex-col justify-between relative overflow-hidden">
              <div>
                <h3 className="text-lg font-bold text-white">Plan VIP</h3>
                <p className="text-xs text-slate-400 mt-2">Pour les grands promoteurs, syndics et portefeuilles illimités.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">{getPrice('enterprise')}</span>
                  <span className="text-xs text-slate-500">/ mois</span>
                </div>
                <ul className="mt-8 space-y-4 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Nombre de biens <span className="font-bold">Illimité</span></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Multi-agences & Droits granulaires</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Marque Blanche (Logo & Domaine personnalisés)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>API WhatsApp dédiée pour l'agence</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Support premium & Conseiller dédié</span>
                  </li>
                </ul>
              </div>
              <Link 
                href="/dashboard?signup=true"
                className="mt-8 w-full py-3 rounded-xl border border-slate-800 hover:bg-slate-900 transition-colors text-center text-xs font-bold text-white block"
              >
                Choisir ce plan
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 bg-slate-900/40 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side info */}
            <div className="text-left">
              <span className="text-xs font-mono font-bold text-amber-500 tracking-wider uppercase">Contactez-nous</span>
              <h2 className="font-title text-3xl sm:text-4xl font-extrabold text-white mt-3">
                Discutons de votre projet de digitalisation
              </h2>
              <p className="mt-4 text-slate-400 leading-relaxed text-sm">
                Que vous soyez un bailleur particulier ou le directeur d'une agence immobilière d'envergure, notre équipe est à votre écoute pour vous faire une démonstration personnalisée.
              </p>

              <div className="mt-8 space-y-6 text-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-slate-400 text-xs uppercase font-bold">Téléphone</span>
                    <span className="text-white font-semibold font-mono text-xs">+225 07 89 89 89 89 (Abidjan) / +221 33 820 12 12 (Dakar)</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-slate-400 text-xs uppercase font-bold">Email professionnel</span>
                    <span className="text-white font-semibold text-xs">contact@immo360.africa</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-slate-400 text-xs uppercase font-bold">Bureaux physiques</span>
                    <span className="text-white text-xs">Zone 4, Rue du Canal, Abidjan 🇨🇮 • Les Almadies, Dakar 🇸🇳</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side form */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-900 shadow-2xl text-left">
              {contactSuccess ? (
                <div className="p-6 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 rounded-2xl text-xs space-y-3 animate-scaleIn py-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Demande reçue avec succès !</h4>
                  <p className="text-slate-400">Merci pour votre intérêt. Un conseiller commercial IMMO360 vous recontactera sous 2 heures pour organiser votre démo.</p>
                  <button 
                    onClick={() => setContactSuccess(false)}
                    className="text-xs font-semibold text-amber-500 underline underline-offset-4 mt-2"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-bold uppercase">Nom complet *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="ex: Amadou Kouassi"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-bold uppercase">Email professionnel *</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="ex: amadou@agence.com"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-bold uppercase">Téléphone (WhatsApp) *</label>
                      <input
                        type="text"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="ex: +225 07 01 02 03 04"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-bold uppercase">Message / Besoins spécifiques *</label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Décrivez votre agence, le nombre de biens à gérer et vos objectifs..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={contactLoading}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer shadow-lg shadow-amber-500/10"
                  >
                    {contactLoading ? (
                      <span>Envoi en cours...</span>
                    ) : (
                      <>
                        Envoyer ma demande de démo <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 bg-slate-950 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-title text-3xl font-extrabold text-white">Questions fréquentes</h2>
            <p className="mt-4 text-slate-400 text-sm">
              Toutes les réponses pour dissiper vos doutes avant d'adopter IMMO360 AFRIQUE.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Comment fonctionne l'intégration de Mobile Money sans compte marchand complexe ?",
                a: "IMMO360 AFRIQUE met à votre disposition une technologie de collecte hybride. Nous gérons la liaison technique avec les opérateurs (Orange, MTN, Wave, Moov) et reversons les montants cumulés directement sur votre compte bancaire d'agence, ou via vos propres comptes marchands si vous en possédez."
              },
              {
                q: "Les quittances de loyer envoyées par WhatsApp sont-elles légales ?",
                a: "Oui, tout à fait. La quittance est un document comptable attestant du paiement du loyer. Le fait de la transmettre au format PDF via WhatsApp ou par email est parfaitement valide au regard de la législation OHADA et des réglementations locales, sous réserve que la quittance comporte les mentions légales obligatoires (générées automatiquement)."
              },
              {
                q: "Comment les données de mes propriétaires et locataires sont-elles sécurisées ?",
                a: "Nous utilisons Supabase avec le protocole RLS (Row Level Security). Cela signifie que les données de votre agence sont cloisonnées de manière hermétique au niveau le plus profond de la base de données. Aucun autre utilisateur ou agence ne peut intercepter, lire ou modifier vos enregistrements."
              },
              {
                q: "Le module de logement social Côte d'Ivoire est-il inclus dans tous les plans ?",
                a: "Ce module spécialisé est inclus par défaut à partir de la formule 'Agence Croissance'. Il intègre les plafonnements ivoiriens de ressources et les démarches d'attribution réglementées."
              }
            ].map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-900 bg-slate-900/20 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-white hover:text-amber-500 transition-colors text-sm"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform text-slate-500 ${openFaq === idx ? 'rotate-180 text-amber-500' : ''}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-xs text-slate-400 leading-relaxed border-t border-slate-900/50 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-24 bg-gradient-to-t from-slate-950 to-slate-900 border-t border-slate-900 text-center px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10 space-y-8">
          <h2 className="font-title text-3xl sm:text-5xl font-extrabold text-white">
            Prêt à transformer la gestion de votre parc immobilier ?
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
            Rejoignez les agences immobilières modernes à Abidjan, Dakar, Douala, Cotonou et Lomé qui font confiance à IMMO360 AFRIQUE pour automatiser leur croissance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/dashboard?signup=true"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
            >
              Créer mon compte agence
            </Link>
            <a 
              href="#contact"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-900 transition-all text-center block"
            >
              Prendre rendez-vous avec un conseiller
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-900 bg-slate-950 text-xs text-slate-500 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-slate-950" />
            </div>
            <span className="font-title font-bold text-white">IMMO360 AFRIQUE</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-slate-400">
            <a href="#problems" className="hover:text-amber-500 transition-colors">Défis</a>
            <a href="#features" className="hover:text-amber-500 transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-amber-500 transition-colors">Tarifs</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Politique RGPD / APDP</a>
          </div>

          <div>
            &copy; 2026 IMMO360 AFRIQUE. Tous droits réservés.
          </div>
        </div>
      </footer>

    </div>
  );
}
