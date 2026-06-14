'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Users, 
  FileText, 
  Smartphone, 
  MessageSquare, 
  Wrench, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Plus, 
  Download, 
  Settings, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Send, 
  Menu, 
  X,
  CreditCard,
  DollarSign,
  ChevronRight,
  Filter,
  LogOut,
  MapPin,
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Calendar
} from 'lucide-react';
import { mockSupabase, Agency, Property, Landlord, Tenant, Lease, Payment, Receipt, MaintenanceTicket, CRMLead, SocialHousingApplication, SaleTransaction, Profile } from '@/lib/supabase/mock';
import Link from 'next/link';

export default function DashboardPage() {
  const [activeMenu, setActiveMenu] = useState<'overview' | 'properties' | 'sales' | 'landlords' | 'tenants' | 'leases' | 'payments' | 'receipts' | 'maintenance' | 'crm' | 'social' | 'appointments' | 'settings' | 'saas' | 'contact'>('overview');
  
  // State réactif de la simulation de base de données
  const [currentAgency, setCurrentAgency] = useState(mockSupabase.getAgency());
  const [agencies, setAgencies] = useState(mockSupabase.getAgencies());
  const [properties, setProperties] = useState<Property[]>([]);
  const [landlords, setLandlords] = useState<Landlord[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [leases, setLeases] = useState<(Lease & { property: Property; tenant: Tenant })[]>([]);
  const [payments, setPayments] = useState<(Payment & { lease: Lease & { property: Property; tenant: Tenant } })[]>([]);
  const [receipts, setReceipts] = useState<(Receipt & { payment: Payment & { lease: Lease & { property: Property; tenant: Tenant } } })[]>([]);
  const [tickets, setTickets] = useState<(MaintenanceTicket & { property: Property })[]>([]);
  const [crmLeads, setCrmLeads] = useState<CRMLead[]>([]);
  const [socialApps, setSocialApps] = useState<(SocialHousingApplication & { property?: Property })[]>([]);
  const [sales, setSales] = useState<(SaleTransaction & { property: Property })[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  // Filtres actifs pour le catalogue des biens
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('Tous');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('Tous');
  const [selectedPropertyForDetails, setSelectedPropertyForDetails] = useState<Property | null>(null);

  // Rôle de l'utilisateur (Admin Agence ou Super Admin du SaaS)
  const [userRole, setUserRole] = useState<'agency_admin' | 'super_admin'>('agency_admin');
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [isOwnerUser, setIsOwnerUser] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(null);

  // States pour la connexion propriétaire secrète
  const [secretLoginOpen, setSecretLoginOpen] = useState(false);
  const [secretPassword, setSecretPassword] = useState('');
  const [secretError, setSecretError] = useState<string | null>(null);

  // States pour la facturation et mise à niveau d'abonnement
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [selectedBillingPlan, setSelectedBillingPlan] = useState<'Standard' | 'Premium' | 'VIP'>('Standard');
  const [billingPhone, setBillingPhone] = useState('');
  const [billingMethod, setBillingMethod] = useState<'Orange Money' | 'MTN Money' | 'Moov Money' | 'Wave'>('Wave');
  const [billingIsLoading, setBillingIsLoading] = useState(false);

  // States pour les onglets de la console SaaS
  const [saasTab, setSaasTab] = useState<'overview' | 'agencies' | 'plans' | 'commissions' | 'broadcast' | 'infrastructure'>('overview');

  // States pour les annonces globales (broadcast)
  const [broadcastMessage, setBroadcastMessage] = useState<string>('Maintenance planifiée ce soir de 23h à 01h GMT pour optimisation des bases de données locales.');
  const [broadcastActive, setBroadcastActive] = useState<boolean>(true);
  const [broadcastLevel, setBroadcastLevel] = useState<'info' | 'warning' | 'error'>('info');
  const [broadcastDismissed, setBroadcastDismissed] = useState<boolean>(false);

  // States pour le formulaire de contact/support admin
  const [supportSubject, setSupportSubject] = useState('Assistance Technique');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportSuccess, setSupportSuccess] = useState(false);
  const [supportLoading, setSupportLoading] = useState(false);

  useEffect(() => {
    if (currentAgency) {
      setSupportPhone(currentAgency.phone || '');
      setSupportEmail(currentAgency.email || '');
    }
  }, [currentAgency]);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSupportLoading(true);
    setTimeout(() => {
      setSupportLoading(false);
      setSupportSuccess(true);
      setSupportMessage('');
      showToast("Ticket de support créé avec succès.");
    }, 1000);
  };

  // Mobile menu visibility
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals visibility
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [activePaymentToPay, setActivePaymentToPay] = useState<(Payment & { lease: Lease & { property: Property; tenant: Tenant } }) | null>(null);
  
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [leaseModalOpen, setLeaseModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);

  // Forms states
  const [newProp, setNewProp] = useState({
    name: '',
    type: 'Appartement' as Property['type'],
    address: '',
    city: '',
    description: '',
    surface: 80,
    rooms: 3,
    rental_value: 400000,
    listing_type: 'Location' as Property['listing_type']
  });

  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [newSale, setNewSale] = useState({
    property_id: '',
    buyer_name: '',
    buyer_phone: '',
    sale_price: 0,
    payment_method: 'Wave' as SaleTransaction['payment_method'],
    reference: ''
  });

  const [newLease, setNewLease] = useState({
    property_id: '',
    tenant_id: '',
    type: 'Habitation' as Lease['type'],
    start_date: '2026-06-01',
    rent_amount: 0,
    deposit_amount: 0,
    advance_months: 3,
    charges_amount: 25000,
    payment_day: 5
  });

  const [newLead, setNewLead] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    interest_type: 'Location' as CRMLead['interest_type'],
    budget: 300000,
    notes: ''
  });

  const [newAgency, setNewAgency] = useState({
    name: '',
    country: "Côte d'Ivoire",
    currency: 'FCFA',
    address: '',
    phone: '',
    email: '',
    plan: 'Standard' as Agency['plan'],
    status: 'Actif' as Agency['status']
  });

  // Pay Modal variables
  const [paymentMethod, setPaymentMethod] = useState<'Orange Money' | 'MTN Money' | 'Moov Money' | 'Wave' | 'Virement' | 'Espèces'>('Wave');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentIsLoading, setPaymentIsLoading] = useState(false);

  // Notification simulation alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Authentification agence
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('signup') === 'true' || params.get('login') === 'true') {
        sessionStorage.removeItem('immo360_authenticated');
        sessionStorage.removeItem('immo360_user_email');
        return false;
      }
      return sessionStorage.getItem('immo360_authenticated') === 'true';
    }
    return false;
  });
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot_password'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('signup') === 'true') return 'signup';
      if (params.get('login') === 'true') return 'login';
      return mockSupabase.getAgencies().length === 0 ? 'signup' : 'login';
    }
    return 'login';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // States pour la création de compte agence (Sign Up)
  const [signupAgencyName, setSignupAgencyName] = useState('');
  const [signupCountry, setSignupCountry] = useState("Côte d'Ivoire");
  const [signupCurrency, setSignupCurrency] = useState('FCFA');
  const [signupAddress, setSignupAddress] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupUserPhone, setSignupUserPhone] = useState('');
  const [generateDemoData, setGenerateDemoData] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);

  // États du tunnel d'inscription et de checkout
  const [signupStep, setSignupStep] = useState<'form' | 'verification' | 'payment'>('form');
  const [signupSelectedPlan, setSignupSelectedPlan] = useState<'Standard' | 'Premium' | 'VIP'>('Standard');
  const [generatedCode, setGeneratedCode] = useState('');
  const [userEnteredCode, setUserEnteredCode] = useState('');
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // States pour le flux "Mot de passe oublié"
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotGeneratedCode, setForgotGeneratedCode] = useState('');
  const [forgotEnteredCode, setForgotEnteredCode] = useState('');
  const [forgotPassword, setForgotPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);

  // États de paiement/checkout
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0); 
  const [promoDiscountType, setPromoDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'Wave' | 'Orange Money' | 'MTN Money' | 'Carte'>('Wave');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutCardName, setCheckoutCardName] = useState('');
  const [checkoutCardNum, setCheckoutCardNum] = useState('');
  const [checkoutCardExpiry, setCheckoutCardExpiry] = useState('');
  const [checkoutCardCvv, setCheckoutCardCvv] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // SaaS global settings (loaded in reloadData/useEffect)
  const [saasPlansSettings, setSaasPlansSettings] = useState<any>({
    standard_price: 15000,
    premium_price: 25000,
    vip_price: 50000,
    trial_days: 14
  });
  const [saasCoupons, setSaasCoupons] = useState<any[]>([]);
  const [selectedSaasAgencyDetails, setSelectedSaasAgencyDetails] = useState<any | null>(null);
  const [globalAgenciesStats, setGlobalAgenciesStats] = useState<any>({});
  const [expandedAgencyId, setExpandedAgencyId] = useState<string | null>(null);

  // Nouveau coupon form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percent' | 'fixed'>('percent');
  const [newCouponValue, setNewCouponValue] = useState(10);

  // Modals et formulaires pour Bailleurs et Locataires
  const [landlordModalOpen, setLandlordModalOpen] = useState(false);
  const [tenantModalOpen, setTenantModalOpen] = useState(false);

  const [newLandlord, setNewLandlord] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    address: '',
    bank_details: '',
    mobile_money_details: ''
  });

  const [newTenant, setNewTenant] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    profession: '',
    employer: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    setTimeout(() => {
      const emailLower = loginEmail.trim().toLowerCase();
      const pass = loginPassword.trim();

      const profile = mockSupabase.getProfiles().find(p => 
        p.email.toLowerCase() === emailLower || 
        (emailLower === 'kafana' && p.email.toLowerCase() === 'kafanafousseni@gmail.com')
      );

      const agenciesList = mockSupabase.getAgencies();
      const matchedAgency = agenciesList.find(a => 
        a.email.toLowerCase() === emailLower || 
        (emailLower === 'kafana' && a.email.toLowerCase() === 'kafanafousseni@gmail.com') ||
        (profile && a.id === profile.agency_id)
      );

      if (!matchedAgency) {
        setLoginError("Aucune agence trouvée avec cet email d'administrateur.");
        setLoginLoading(false);
        return;
      }

      if (matchedAgency.status === 'Suspendu') {
        setLoginError("Cette agence a été suspendue/bloquée par l'administrateur SaaS. Veuillez contacter le support.");
        setLoginLoading(false);
        return;
      }

      // Check password
      const isPasswordValid = profile?.password 
        ? pass === profile.password 
        : (pass === 'password' || pass === 'admin' || pass === '123456' || pass === 'Kafana0605@');

      if (!isPasswordValid) {
        setLoginError("Mot de passe incorrect.");
        setLoginLoading(false);
        return;
      }

      mockSupabase.setActiveAgency(matchedAgency.id);
      setIsAuthenticated(true);
      sessionStorage.setItem('immo360_authenticated', 'true');
      sessionStorage.setItem('immo360_user_email', emailLower);
      
      const isOwner = emailLower === 'kafanafousseni@gmail.com' || emailLower === 'kafana' || emailLower === 'admin@immo360.africa';
      setIsOwnerUser(isOwner);
      if (isOwner) {
        setUserRole('super_admin');
        setActiveMenu('saas');
        setShowRoleSwitcher(true);
      } else {
        setUserRole('agency_admin');
        setActiveMenu('overview');
        setShowRoleSwitcher(false);
      }

      reloadData();
      showToast(`Connexion réussie : Bienvenue chez ${matchedAgency.name}`);
      setLoginLoading(false);
    }, 800);
  };

  const getDynamicPlanPrice = (plan: string | undefined) => {
    const settings = saasPlansSettings || { standard_price: 15000, premium_price: 25000, vip_price: 50000 };
    if (plan === 'Standard') return settings.standard_price;
    if (plan === 'Premium') return settings.premium_price;
    if (plan === 'VIP') return settings.vip_price;
    return 0;
  };

  const getCheckoutFinalPrice = () => {
    const base = getDynamicPlanPrice(signupSelectedPlan);
    if (!appliedCouponCode) return base;
    if (promoDiscountType === 'percent') {
      return Math.max(0, base - Math.round(base * (promoDiscount / 100)));
    } else {
      return Math.max(0, base - promoDiscount);
    }
  };

  const applyPromoCode = () => {
    const coupon = saasCoupons.find(c => c.code.toUpperCase() === promoCode.trim().toUpperCase() && c.status === 'Actif');
    if (coupon) {
      setAppliedCouponCode(coupon.code);
      setPromoDiscount(coupon.value);
      setPromoDiscountType(coupon.discount_type);
      showToast(`Code promo ${coupon.code} appliqué avec succès !`);
    } else {
      showToast("Code promo invalide ou expiré.");
    }
  };

  const sendEmailNotification = async (to: string, subject: string, html: string) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, html }),
      });
      const data = await response.json();
      if (data.success) {
        return true;
      } else {
        console.warn(`Email sending failed: ${data.error}`);
        return false;
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError(null);

    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Les mots de passe ne correspondent pas.");
      setSignupLoading(false);
      return;
    }

    setTimeout(async () => {
      const emailLower = signupEmail.trim().toLowerCase();

      const existing = mockSupabase.getAgencies().some(a => a.email.toLowerCase() === emailLower);
      if (existing) {
        setSignupError("Cet email d'administrateur est déjà utilisé.");
        setSignupLoading(false);
        return;
      }

      // Générer le code de validation à 6 chiffres
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);

      const emailHtml = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1e293b; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; width: 50px; height: 50px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px; line-height: 50px; text-align: center; color: white; font-size: 24px; font-weight: bold;">I</div>
            <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin-top: 15px; margin-bottom: 5px; letter-spacing: -0.025em;">IMMO360 AFRIQUE</h1>
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin: 0;">SaaS de Gestion Immobilière Premium</p>
          </div>
          <div style="line-height: 1.6; font-size: 15px;">
            <p style="margin-top: 0;">Bonjour ${signupFirstName} ${signupLastName},</p>
            <p>Merci d'avoir choisi <strong>IMMO360 AFRIQUE</strong> pour la gestion de votre agence immobilière <strong>"${signupAgencyName}"</strong>.</p>
            <p>Pour finaliser la création de votre compte, veuillez utiliser le code de validation à 6 chiffres ci-dessous :</p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
              <span style="font-size: 36px; font-weight: 800; font-family: monospace; letter-spacing: 8px; color: #d97706; padding-left: 8px;">${code}</span>
            </div>
            <p style="font-size: 13px; color: #64748b;">Ce code est valide pendant 15 minutes. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <div style="text-align: center; font-size: 12px; color: #94a3b8;">
            <p style="margin: 0 0 4px 0;">© 2026 IMMO360 AFRIQUE. Tous droits réservés.</p>
            <p style="margin: 0;">Côte d'Ivoire & Sénégal • Espace de Gestion Multi-tenant</p>
          </div>
        </div>
      `;

      const sent = await sendEmailNotification(emailLower, "Code de validation - IMMO360 AFRIQUE", emailHtml);
      setSignupLoading(false);
      setSignupStep('verification');

      if (sent) {
        showToast(`[E-mail de validation] Code envoyé à ${signupEmail}`);
      } else {
        showToast(`[Démo] Impossible d'envoyer le mail. Code : ${code}`);
      }
    }, 1000);
  };

  const handleVerifyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError(null);

    if (userEnteredCode.trim() === generatedCode) {
      setSignupStep('payment');
      showToast("E-mail vérifié avec succès. Veuillez choisir votre forfait.");
    } else {
      setVerificationError("Code de validation incorrect. Veuillez réessayer.");
    }
  };

  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError(null);

    const emailClean = forgotEmail.trim().toLowerCase();
    const phoneClean = forgotPhone.trim().replace(/\s+/g, '');

    const profile = mockSupabase.getProfiles().find(
      p => p.email.toLowerCase() === emailClean &&
           p.phone.trim().replace(/\s+/g, '') === phoneClean
    );

    if (!profile) {
      setForgotError("Aucun profil correspondant à cet email et numéro de téléphone enregistré n'a été trouvé. Par sécurité, la récupération est impossible.");
      setForgotLoading(false);
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setForgotGeneratedCode(code);

    const emailHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1e293b; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; width: 50px; height: 50px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px; line-height: 50px; text-align: center; color: white; font-size: 24px; font-weight: bold;">I</div>
          <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin-top: 15px; margin-bottom: 5px; letter-spacing: -0.025em;">IMMO360 AFRIQUE</h1>
          <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin: 0;">SaaS de Gestion Immobilière Premium</p>
        </div>
        <div style="line-height: 1.6; font-size: 15px;">
          <p style="margin-top: 0;">Bonjour ${profile.first_name} ${profile.last_name},</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte IMMO360 AFRIQUE.</p>
          <p>Veuillez utiliser le code de sécurité à 6 chiffres ci-dessous pour poursuivre l'opération :</p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
            <span style="font-size: 36px; font-weight: 800; font-family: monospace; letter-spacing: 8px; color: #d97706; padding-left: 8px;">${code}</span>
          </div>
          <p style="font-size: 13px; color: #64748b;">Ce code de sécurité à usage unique expire dans 15 minutes. Si vous n'avez pas demandé ce changement, vous pouvez ignorer cet e-mail et votre mot de passe restera inchangé.</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <div style="text-align: center; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0 0 4px 0;">© 2026 IMMO360 AFRIQUE. Tous droits réservés.</p>
          <p style="margin: 0;">Côte d'Ivoire & Sénégal • Espace de Gestion Multi-tenant</p>
        </div>
      </div>
    `;

    const sent = await sendEmailNotification(emailClean, "Récupération de mot de passe - IMMO360 AFRIQUE", emailHtml);
    setForgotLoading(false);
    if (sent) {
      showToast(`[Code envoyé] Un code de récupération a été envoyé à ${forgotEmail}`);
    } else {
      showToast(`[Démo] Impossible d'envoyer le mail. Code : ${code}`);
    }
    setForgotStep(2);
  };

  const handleForgotVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    if (forgotEnteredCode.trim() === forgotGeneratedCode) {
      setForgotStep(3);
    } else {
      setForgotError("Code de validation incorrect. Veuillez réessayer.");
    }
  };

  const handleForgotReset = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError(null);

    if (forgotPassword.length < 6) {
      setForgotError("Le mot de passe doit contenir au moins 6 caractères.");
      setForgotLoading(false);
      return;
    }

    if (forgotPassword !== forgotConfirmPassword) {
      setForgotError("Les mots de passe ne correspondent pas.");
      setForgotLoading(false);
      return;
    }

    mockSupabase.updateProfilePassword(forgotEmail.trim().toLowerCase(), forgotPassword);
    
    setForgotLoading(false);
    showToast("Votre mot de passe a été réinitialisé avec succès.");
    setAuthMode('login');
    
    // Clear forgot states
    setForgotEmail('');
    setForgotPhone('');
    setForgotStep(1);
    setForgotGeneratedCode('');
    setForgotEnteredCode('');
    setForgotPassword('');
    setForgotConfirmPassword('');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutLoading(true);
    setCheckoutError(null);

    setTimeout(() => {
      const emailLower = signupEmail.trim().toLowerCase();

      const agencyData = {
        name: signupAgencyName,
        logo_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80',
        country: signupCountry,
        currency: signupCurrency,
        address: signupAddress,
        phone: signupPhone,
        email: emailLower,
        plan: signupSelectedPlan
      };

      const profileData = {
        email: emailLower,
        first_name: signupFirstName,
        last_name: signupLastName,
        phone: signupUserPhone,
        password: signupPassword
      };

      // Register
      const result = mockSupabase.registerAgency(agencyData, profileData, generateDemoData);

      mockSupabase.setActiveAgency(result.agency.id);
      setIsAuthenticated(true);
      sessionStorage.setItem('immo360_authenticated', 'true');
      sessionStorage.setItem('immo360_user_email', emailLower);
      reloadData();

      showToast(`Compte d'agence activé avec succès ! Forfait ${signupSelectedPlan} activé.`);
      setCheckoutLoading(false);
      
      // Reset
      setSignupStep('form');
      setPromoCode('');
      setPromoDiscount(0);
      setAppliedCouponCode(null);
    }, 1500);
  };

  const handleAddLandlordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockSupabase.addLandlord(newLandlord);
    reloadData();
    setLandlordModalOpen(false);
    setNewLandlord({
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      address: '',
      bank_details: '',
      mobile_money_details: ''
    });
    showToast("Propriétaire enregistré avec succès.");
  };

  const handleAddTenantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockSupabase.addTenant(newTenant);
    reloadData();
    setTenantModalOpen(false);
    setNewTenant({
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      profession: '',
      employer: ''
    });
    showToast("Locataire enregistré avec succès.");
  };

  const [logoClicks, setLogoClicks] = useState(0);
  const handleLogoClick = () => {
    setLogoClicks(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setSecretLoginOpen(true);
        setSecretError(null);
        return 0;
      }
      return next;
    });
  };

  const handleSecretLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const passLower = secretPassword.trim().toLowerCase();
    if (
      secretPassword === '360owner' || 
      secretPassword === 'admin' || 
      secretPassword === 'Kafana0605@' || 
      passLower === 'kafana'
    ) {
      setUserRole('super_admin');
      setActiveMenu('saas');
      setShowRoleSwitcher(true);
      setIsAuthenticated(true);
      setIsOwnerUser(true);
      sessionStorage.setItem('immo360_authenticated', 'true');
      sessionStorage.setItem('immo360_user_email', 'admin@immo360.africa');
      setSecretLoginOpen(false);
      setSecretPassword('');
      setSecretError(null);
      showToast("Accès Propriétaire SaaS activé !");
    } else {
      setSecretError("Code d'accès incorrect.");
    }
  };

  useEffect(() => {
    // URL Query check
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('secret') === '360owner' || params.get('admin') === 'true') {
        setUserRole('super_admin');
        setActiveMenu('saas');
        setShowRoleSwitcher(true);
        setIsOwnerUser(true);
        showToast("Accès Propriétaire SaaS activé via clé secrète !");
      }
      if (params.get('signup') === 'true') {
        setAuthMode('signup');
        setIsAuthenticated(false);
        setIsOwnerUser(false);
        sessionStorage.removeItem('immo360_authenticated');
        sessionStorage.removeItem('immo360_user_email');
        mockSupabase.setActiveAgency('');
      } else if (params.get('login') === 'true') {
        setAuthMode('login');
        setIsAuthenticated(false);
        setIsOwnerUser(false);
        sessionStorage.removeItem('immo360_authenticated');
        sessionStorage.removeItem('immo360_user_email');
        mockSupabase.setActiveAgency('');
      }
    }

    // Keyboard shortcut listener (Ctrl + Shift + P / Ctrl + Alt + S)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') ||
        (e.ctrlKey && e.altKey && e.key.toLowerCase() === 's')
      ) {
        e.preventDefault();
        setSecretLoginOpen(true);
        setSecretError(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Charger les données de l'agence sélectionnée
  const reloadData = () => {
    setCurrentAgency(mockSupabase.getAgency());
    setAgencies(mockSupabase.getAgencies());
    setProperties(mockSupabase.getProperties());
    setLandlords(mockSupabase.getLandlords());
    setTenants(mockSupabase.getTenants());
    setLeases(mockSupabase.getLeases());
    setPayments(mockSupabase.getPayments());
    setReceipts(mockSupabase.getReceipts());
    setTickets(mockSupabase.getMaintenanceTickets());
    setCrmLeads(mockSupabase.getCRMLeads());
    setSocialApps(mockSupabase.getSocialHousingApplications());
    setSales(mockSupabase.getSaleTransactions());
    setAppointments(mockSupabase.getAppointments());
    setSaasPlansSettings(mockSupabase.getSaaSPlanSettings());
    setSaasCoupons(mockSupabase.getDiscountCoupons());
    setGlobalAgenciesStats(mockSupabase.getGlobalAgenciesStats());
    reloadUserProfile();
  };

  const reloadUserProfile = () => {
    if (typeof window !== 'undefined') {
      const email = sessionStorage.getItem('immo360_user_email');
      if (email) {
        const prof = mockSupabase.getProfileByEmail(email);
        if (prof) {
          setCurrentUserProfile(prof);
          return;
        }
      }
      setCurrentUserProfile(null);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = sessionStorage.getItem('immo360_user_email');
      const agenciesList = mockSupabase.getAgencies();
      if (email) {
        const emailLower = email.trim().toLowerCase();
        const isOwner = emailLower === 'kafanafousseni@gmail.com' || emailLower === 'kafana' || emailLower === 'admin@immo360.africa';
        setIsOwnerUser(isOwner);
        if (isOwner) {
          setUserRole('super_admin');
          setActiveMenu('saas');
          setShowRoleSwitcher(true);
        }
        const found = agenciesList.find(a => a.email.toLowerCase() === emailLower);
        if (found) {
          mockSupabase.setActiveAgency(found.id);
        } else if (agenciesList.length > 0) {
          mockSupabase.setActiveAgency(agenciesList[0].id);
        } else {
          mockSupabase.setActiveAgency('');
        }
      } else {
        if (agenciesList.length > 0) {
          mockSupabase.setActiveAgency(agenciesList[0].id);
        } else {
          mockSupabase.setActiveAgency('');
        }
      }
    }
    reloadData();
  }, []);

  const changeAgency = (agencyId: string) => {
    mockSupabase.setActiveAgency(agencyId);
    reloadData();
    showToast(`Bascule multi-tenant vers ${mockSupabase.getAgency().name} effectuée.`);
  };

  // Actions
  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaymentToPay) return;
    setPaymentIsLoading(true);

    setTimeout(() => {
      mockSupabase.recordPayment(activePaymentToPay.id, paymentMethod, paymentRef || `TX-REF-${Math.floor(Math.random() * 900000)}`);
      reloadData();
      setPaymentIsLoading(false);
      setPayModalOpen(false);
      
      const agencyCurrency = mockSupabase.getAgency().currency;
      const propId = activePaymentToPay.lease.property.id;
      const landlord = landlords.find(l => {
        if (propId.includes('p1111111') || propId.includes('p1111113')) return l.id.includes('l1111111');
        if (propId.includes('p1111112') || propId.includes('p1111114')) return l.id.includes('l1111112');
        if (propId.includes('p2222221') || propId.includes('p2222222')) return l.id.includes('l2222221');
        return false;
      }) || landlords[0];
      
      showToast(`Paiement de ${activePaymentToPay.amount.toLocaleString()} ${agencyCurrency} perçu ! Reversement automatique de ${(Math.round(activePaymentToPay.amount * 0.9)).toLocaleString()} ${agencyCurrency} envoyé à ${landlord ? landlord.first_name + ' ' + landlord.last_name : 'le propriétaire'} (${landlord ? landlord.mobile_money_details?.split(':')[0] || 'Mobile Money' : 'Mobile Money'}).`);
    }, 1200);
  };

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();

    // Plan limit check
    const currentPlan = currentAgency.plan || 'Standard';
    const currentPropCount = properties.length;
    
    if (currentPlan === 'Standard' && currentPropCount >= 5) {
      showToast("Limite de plan atteinte : Le plan Standard (15 000 FCFA) est limité à 5 biens. Veuillez passer au plan Premium.");
      return;
    }
    if (currentPlan === 'Premium' && currentPropCount >= 15) {
      showToast("Limite de plan atteinte : Le plan Premium (25 000 FCFA) est limité à 15 biens. Veuillez passer au plan VIP.");
      return;
    }

    const created = mockSupabase.addProperty({
      name: newProp.name,
      type: newProp.type,
      status: 'Disponible',
      address: newProp.address,
      city: newProp.city,
      country: currentAgency.country,
      description: newProp.description,
      surface: Number(newProp.surface),
      rooms: Number(newProp.rooms),
      rental_value: Number(newProp.rental_value),
      listing_type: newProp.listing_type || 'Location',
      gallery: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80']
    });

    reloadData();
    setPropertyModalOpen(false);
    setNewProp({ name: '', type: 'Appartement', address: '', city: '', description: '', surface: 80, rooms: 3, rental_value: 400000, listing_type: 'Location' });
    showToast(`Bien "${created.name}" ajouté avec succès dans l'espace ${currentAgency.name}.`);
  };

  const handleAddSaleTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSale.property_id || !newSale.buyer_name || !newSale.buyer_phone) {
      showToast("Veuillez remplir toutes les informations obligatoires.");
      return;
    }
    
    const targetProp = properties.find(p => p.id === newSale.property_id);
    if (!targetProp) return;
    
    const created = mockSupabase.addSaleTransaction({
      property_id: newSale.property_id,
      buyer_name: newSale.buyer_name,
      buyer_phone: newSale.buyer_phone,
      sale_price: Number(newSale.sale_price) || targetProp.rental_value,
      payment_method: newSale.payment_method,
      reference: newSale.reference || `TX-SALE-${Math.floor(Math.random() * 900000)}`,
      status: 'Finalisé'
    });
    
    reloadData();
    setSaleModalOpen(false);
    
    const comm = Math.round(created.sale_price * 0.1);
    
    showToast(`Vente de "${targetProp.name}" finalisée ! Prix : ${created.sale_price.toLocaleString()} ${currentAgency.currency}. Commission 10% (${comm.toLocaleString()}) prélevée.`);
  };

  const handleAddLease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLease.property_id || !newLease.tenant_id) return;
    
    mockSupabase.addLease({
      property_id: newLease.property_id,
      tenant_id: newLease.tenant_id,
      type: newLease.type,
      start_date: newLease.start_date,
      rent_amount: Number(newLease.rent_amount),
      deposit_amount: Number(newLease.deposit_amount),
      advance_months: Number(newLease.advance_months),
      charges_amount: Number(newLease.charges_amount),
      payment_day: Number(newLease.payment_day)
    });

    reloadData();
    setLeaseModalOpen(false);
    showToast("Contrat de bail enregistré. Statut du bien mis à jour sur 'Occupé'.");
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    mockSupabase.addCRMLead({
      first_name: newLead.first_name,
      last_name: newLead.last_name,
      phone: newLead.phone,
      email: newLead.email,
      interest_type: newLead.interest_type,
      budget: Number(newLead.budget),
      notes: newLead.notes,
      status: 'Nouveau'
    });

    reloadData();
    setLeadModalOpen(false);
    setNewLead({ first_name: '', last_name: '', phone: '', email: '', interest_type: 'Location', budget: 300000, notes: '' });
    showToast("Nouveau prospect qualifié enregistré dans le pipeline.");
  };

  const handleAddAgencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgency.name || !newAgency.email) {
      showToast("Veuillez remplir le nom et l'email de l'agence.");
      return;
    }
    
    const added = mockSupabase.addAgency({
      name: newAgency.name,
      logo_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80',
      country: newAgency.country,
      currency: newAgency.currency,
      address: newAgency.address || 'Abidjan / Dakar',
      phone: newAgency.phone || '+225 00 00 00 00',
      email: newAgency.email,
      plan: newAgency.plan,
      status: newAgency.status
    });

    setNewAgency({
      name: '',
      country: "Côte d'Ivoire",
      currency: 'FCFA',
      address: '',
      phone: '',
      email: '',
      plan: 'Standard',
      status: 'Actif'
    });
    
    reloadData();
    showToast(`Agence "${added.name}" créée et enregistrée (Multi-tenant) !`);
  };

  const toggleAgencyStatus = (agencyId: string, currentStatus: Agency['status']) => {
    const nextStatus = currentStatus === 'Suspendu' ? 'Actif' : 'Suspendu';
    mockSupabase.updateAgencyStatus(agencyId, nextStatus);
    reloadData();
    showToast(`Statut de l'agence mis à jour : ${nextStatus}`);
  };

  const handleDeleteAgency = (agencyId: string) => {
    const target = mockSupabase.getAgencies().find(a => a.id === agencyId);
    if (!target) return;
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement l'agence "${target.name}" ?\n\nCette action est irréversible et supprimera toutes ses données ainsi que les profils d'accès.`)) {
      mockSupabase.deleteAgency(agencyId);
      reloadData();
      showToast(`L'agence "${target.name}" a été définitivement supprimée.`);
    }
  };

  const updateAgencyPlan = (agencyId: string, plan: Agency['plan']) => {
    const target = mockSupabase.getAgencies().find(a => a.id === agencyId);
    if (target) {
      target.plan = plan;
      reloadData();
      showToast(`Abonnement de ${target.name} changé vers ${plan}.`);
    }
  };

  const handleConfirmAppointment = (apptId: string) => {
    mockSupabase.updateAppointmentStatus(apptId, 'Confirmé');
    reloadData();
    showToast("Le rendez-vous a été confirmé avec succès.");
  };

  const handleCancelAppointment = (apptId: string) => {
    mockSupabase.updateAppointmentStatus(apptId, 'Annulé');
    reloadData();
    showToast("Le rendez-vous a été annulé.");
  };

  const handleSimulateWhatsAppRelance = (payment: Payment & { lease: Lease & { property: Property; tenant: Tenant } }) => {
    const channel = 'WhatsApp';
    showToast(`Notification WhatsApp simulée envoyée à ${payment.lease.tenant.first_name} ${payment.lease.tenant.last_name} (${payment.lease.tenant.phone}) pour son loyer de ${payment.amount.toLocaleString()} FCFA.`);
  };

  // Statistiques calculées à la volée
  const stats = {
    totalProperties: properties.length,
    occupiedProperties: properties.filter(p => p.status === 'Occupé').length,
    occupancyRate: properties.length ? Math.round((properties.filter(p => p.status === 'Occupé').length / properties.length) * 100) : 0,
    monthlyIncome: payments.filter(p => p.status === 'Payé').reduce((acc, curr) => acc + curr.amount, 0),
    lateIncome: payments.filter(p => p.status === 'En retard' || p.status === 'Impayé').reduce((acc, curr) => acc + curr.amount, 0),
    activeLeasesCount: leases.filter(l => l.status === 'Actif').length
  };

  const filteredProperties = properties.filter(prop => {
    const matchesType = selectedTypeFilter === 'Tous' || prop.type === selectedTypeFilter;
    const matchesStatus = selectedStatusFilter === 'Tous' || prop.status === selectedStatusFilter;
    return matchesType && matchesStatus;
  });

  // Activités récentes construites de manière dynamique pour refléter le contenu réel de la base de données
  const activities: { icon: any; color: string; text: string; time: string }[] = [];
  
  payments
    .filter(p => p.status === 'Payé')
    .slice(0, 2)
    .forEach(p => {
      activities.push({
        icon: CreditCard,
        color: "text-emerald-500 bg-emerald-50",
        text: `Paiement de ${p.lease?.tenant?.first_name || ''} ${p.lease?.tenant?.last_name?.charAt(0) || ''}. reçu par ${p.method || 'Mobile Money'}`,
        time: p.payment_date ? new Date(p.payment_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : "Récemment"
      });
    });

  leases
    .slice(0, 1)
    .forEach(l => {
      activities.push({
        icon: FileText,
        color: "text-blue-500 bg-blue-50",
        text: `Bail ${l.property?.name || ''} enregistré`,
        time: new Date(l.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
      });
    });

  tickets
    .slice(0, 1)
    .forEach(t => {
      activities.push({
        icon: Wrench,
        color: "text-amber-500 bg-amber-50",
        text: `Ticket maintenance : "${t.title}"`,
        time: new Date(t.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
      });
    });

  crmLeads
    .slice(0, 1)
    .forEach(c => {
      activities.push({
        icon: Users,
        color: "text-purple-500 bg-purple-50",
        text: `Prospect ${c.first_name} ${c.last_name} qualifié`,
        time: new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
      });
    });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center relative overflow-hidden font-sans select-none selection:bg-amber-500 selection:text-slate-900">
        {/* TOAST SYSTEM FOR AUTH VIEWS */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex items-center gap-3 max-w-lg text-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <span className="font-semibold text-slate-100">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Background decorative gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-slate-800/30 rounded-full blur-[160px] pointer-events-none" />
        
        {/* Animated grid decorative background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.15] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md p-6">
          {/* Logo / Title */}
          <div className="flex flex-col items-center mb-6 text-center animate-fadeIn">
            <div 
              onClick={handleLogoClick}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-2xl shadow-amber-500/20 mb-3 cursor-pointer"
            >
              <Building2 className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <h1 
              onClick={handleLogoClick}
              className="font-title text-xl font-extrabold text-white tracking-tight cursor-pointer select-none"
            >
              IMMO<span className="text-amber-500">360</span> AFRIQUE
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider font-mono">Espace de Gestion Professionnel</p>
          </div>

          <AnimatePresence mode="wait">
            {authMode === 'login' && (
              <motion.div 
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
              >
                <h2 className="text-lg font-bold text-white mb-2">Connexion</h2>
                <p className="text-xs text-slate-400 mb-6">Accédez au tableau de bord de votre agence immobilière.</p>

                <form onSubmit={handleLogin} className="space-y-4 text-left">
                  {loginError && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>{loginError}</span>
                    </motion.div>
                  )}

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">Adresse Email Administrateur</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        autoComplete="off"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="admin@monagence.com"
                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">Mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl pl-11 pr-10 py-2.5 text-xs text-white focus:outline-none transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-slate-350 cursor-pointer border-none bg-transparent"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 disabled:text-slate-500 font-bold text-xs shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                    >
                      {loginLoading ? (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                      ) : (
                        <span>Se connecter</span>
                      )}
                    </button>
                  </div>
                </form>

                <div className="flex items-center justify-between mt-6">
                  <button 
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot_password');
                      setForgotStep(1);
                      setForgotError(null);
                    }}
                    className="text-xs text-amber-500 hover:text-amber-400 transition-colors underline underline-offset-4 cursor-pointer"
                  >
                    Mot de passe oublié ?
                  </button>
                  <button 
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="text-xs text-slate-400 hover:text-slate-350 transition-colors underline underline-offset-4 cursor-pointer"
                  >
                    Créer un compte d'agence
                  </button>
                </div>
              </motion.div>
            )}

            {authMode === 'signup' && (
              <motion.div 
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
              >
                {signupStep === 'form' ? (
                  <>
                    <h2 className="text-lg font-bold text-white mb-2">Créer un compte d'agence</h2>
                    <p className="text-xs text-slate-400 mb-6">Enregistrez votre agence de gestion immobilière en 2 minutes.</p>

                    <form onSubmit={handleSignup} className="space-y-4 text-left">
                      {signupError && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4 shrink-0" />
                          <span>{signupError}</span>
                        </motion.div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">Nom de l'agence *</label>
                          <input
                            type="text"
                            required
                            value={signupAgencyName}
                            onChange={(e) => setSignupAgencyName(e.target.value)}
                            placeholder="Ex: Kafana Gestion"
                            className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2 text-xs text-white focus:outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">Pays *</label>
                          <select
                            value={signupCountry}
                            onChange={(e) => {
                              setSignupCountry(e.target.value);
                              setSignupCurrency(e.target.value === 'Sénégal' || e.target.value === "Côte d'Ivoire" ? 'FCFA' : 'EUR');
                            }}
                            className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2 text-xs text-white focus:outline-none transition-all cursor-pointer"
                          >
                            <option value="Côte d'Ivoire">Côte d'Ivoire 🇨🇮</option>
                            <option value="Sénégal">Sénégal 🇸🇳</option>
                            <option value="Cameroun">Cameroun 🇨🇲</option>
                            <option value="Gabon">Gabon 🇬🇦</option>
                            <option value="France">France 🇫🇷</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">Devise</label>
                          <select
                            value={signupCurrency}
                            onChange={(e) => setSignupCurrency(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2 text-xs text-white focus:outline-none transition-all cursor-pointer"
                          >
                            <option value="FCFA">FCFA (XOF/XAF)</option>
                            <option value="EUR">Euro (€)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">Téléphone Agence</label>
                          <input
                            type="text"
                            value={signupPhone}
                            onChange={(e) => setSignupPhone(e.target.value)}
                            placeholder="Ex: +225 07..."
                            className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2 text-xs text-white focus:outline-none transition-all font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">Adresse Physique</label>
                        <input
                          type="text"
                          value={signupAddress}
                          onChange={(e) => setSignupAddress(e.target.value)}
                          placeholder="Ex: Boulevard Hassan II, Dakar"
                          className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2 text-xs text-white focus:outline-none transition-all"
                        />
                      </div>

                      <div className="border-t border-slate-800 pt-3 my-1">
                        <span className="text-[10px] font-bold text-amber-500 block mb-2 uppercase tracking-wider">Compte Administrateur</span>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1 font-medium">Prénom *</label>
                            <input
                              type="text"
                              required
                              value={signupFirstName}
                              onChange={(e) => setSignupFirstName(e.target.value)}
                              placeholder="Jean"
                              className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2 text-xs text-white focus:outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1 font-medium">Nom *</label>
                            <input
                              type="text"
                              required
                              value={signupLastName}
                              onChange={(e) => setSignupLastName(e.target.value)}
                              placeholder="Koffi"
                              className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2 text-xs text-white focus:outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1.5 font-medium">Email *</label>
                          <input
                            type="email"
                            required
                            autoComplete="off"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="admin@monagence.com"
                            className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2 text-xs text-white focus:outline-none transition-all font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1.5 font-medium">Mot de passe *</label>
                          <div className="relative">
                            <input
                              type={showSignupPassword ? "text" : "password"}
                              required
                              autoComplete="new-password"
                              value={signupPassword}
                              onChange={(e) => setSignupPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl pl-4 pr-10 py-2 text-xs text-white focus:outline-none transition-all font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => setShowSignupPassword(!showSignupPassword)}
                              className="absolute right-3 top-2 text-slate-500 hover:text-slate-350 cursor-pointer border-none bg-transparent"
                            >
                              {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1.5 font-medium">Confirmer le mot de passe *</label>
                        <div className="relative">
                          <input
                            type={showSignupConfirmPassword ? "text" : "password"}
                            required
                            autoComplete="new-password"
                            value={signupConfirmPassword}
                            onChange={(e) => setSignupConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl pl-4 pr-10 py-2 text-xs text-white focus:outline-none transition-all font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                            className="absolute right-3 top-2 text-slate-500 hover:text-slate-350 cursor-pointer border-none bg-transparent"
                          >
                            {showSignupConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={signupLoading}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 disabled:text-slate-500 font-bold text-xs shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                        >
                          {signupLoading ? (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                          ) : (
                            <span>Créer mon compte</span>
                          )}
                        </button>
                      </div>
                    </form>

                    <div className="text-center mt-6">
                      <button 
                        onClick={() => setAuthMode('login')}
                        className="text-xs text-slate-450 hover:text-slate-350 transition-colors underline underline-offset-4 cursor-pointer"
                      >
                        Déjà inscrit ? Se connecter
                      </button>
                    </div>
                  </>
                ) : signupStep === 'verification' ? (
                  <div>
                    <h2 className="text-lg font-bold text-white mb-2">Validation de l'e-mail</h2>
                    <p className="text-xs text-slate-400 mb-6">Un e-mail de validation contenant un code à 6 chiffres a été envoyé à <span className="text-white font-semibold font-mono">{signupEmail}</span>.</p>

                    <form onSubmit={handleVerifyCodeSubmit} className="space-y-6 text-left">
                      {verificationError && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                          <XCircle className="w-4 h-4 shrink-0" />
                          <span>{verificationError}</span>
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">Code de Validation (6 chiffres)</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={userEnteredCode}
                          onChange={(e) => setUserEnteredCode(e.target.value)}
                          placeholder="Ex: 123456"
                          className="w-full text-center bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-lg font-bold text-white focus:outline-none transition-all tracking-widest font-mono"
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => { setSignupStep('form'); setVerificationError(null); }}
                          className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer border-none"
                        >
                          Retour
                        </button>
                        <button
                          type="submit"
                          className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs transition-all cursor-pointer border-none"
                        >
                          Valider le code
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h2 className="text-lg font-bold text-white mb-1">Finalisez votre inscription</h2>
                    <p className="text-xs text-slate-400 mb-4">Sélectionnez votre forfait et activez votre compte d'agence.</p>

                    <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-left">
                      {checkoutError && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                          <XCircle className="w-4 h-4 shrink-0" />
                          <span>{checkoutError}</span>
                        </div>
                      )}

                      {/* Plan Selector Grid */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'Standard', label: 'Standard', price: saasPlansSettings.standard_price, desc: 'Max 5 biens' },
                          { id: 'Premium', label: 'Premium', price: saasPlansSettings.premium_price, desc: 'Max 15 biens' },
                          { id: 'VIP', label: 'VIP', price: saasPlansSettings.vip_price, desc: 'Biens illimités' }
                        ].map(plan => (
                          <div 
                            key={plan.id}
                            onClick={() => setSignupSelectedPlan(plan.id as any)}
                            className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                              signupSelectedPlan === plan.id 
                                ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/5' 
                                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <span className="block text-xs font-bold">{plan.label}</span>
                            <span className="block text-[14px] font-bold font-mono text-amber-500 mt-1">{plan.price.toLocaleString()}</span>
                            <span className="block text-[8px] text-slate-500 mt-1 font-semibold">{plan.desc}</span>
                          </div>
                        ))}
                      </div>

                      {/* Coupon Section */}
                      <div className="bg-slate-950/30 border border-slate-800/80 rounded-2xl p-3 space-y-2">
                        <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Bon de réduction</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Ex: WELCOME10"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-white uppercase focus:outline-none transition-all font-mono"
                          />
                          <button
                            type="button"
                            onClick={applyPromoCode}
                            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-none"
                          >
                            Appliquer
                          </button>
                        </div>
                        {appliedCouponCode && (
                          <span className="block text-[10px] text-emerald-400 font-semibold">
                            ✓ Bon appliqué '{appliedCouponCode}' ({promoDiscountType === 'percent' ? `${promoDiscount}%` : `${promoDiscount.toLocaleString()} FCFA`} de réduction).
                          </span>
                        )}
                      </div>

                      {/* Prices Summary */}
                      <div className="p-3 bg-slate-950/50 rounded-2xl text-xs space-y-2 border border-slate-900">
                        <div className="flex justify-between text-slate-400">
                          <span>Prix de base :</span>
                          <span className="font-mono text-white">{getDynamicPlanPrice(signupSelectedPlan).toLocaleString()} {signupCurrency}</span>
                        </div>
                        {appliedCouponCode && (
                          <div className="flex justify-between text-emerald-400">
                            <span>Réduction :</span>
                            <span className="font-mono">
                              -{promoDiscountType === 'percent' 
                                ? `${(Math.round(getDynamicPlanPrice(signupSelectedPlan) * (promoDiscount / 100))).toLocaleString()} ${signupCurrency} (${promoDiscount}%)` 
                                : `${promoDiscount.toLocaleString()} ${signupCurrency}`}
                            </span>
                          </div>
                        )}
                        <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-sm">
                          <span className="text-slate-200">Total à payer :</span>
                          <span className="font-mono text-amber-500">{getCheckoutFinalPrice().toLocaleString()} {signupCurrency}</span>
                        </div>
                      </div>

                      {/* Payment Method Switcher */}
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Moyen de Paiement</label>
                        <div className="flex gap-1.5 border border-slate-850 p-1 rounded-xl bg-slate-950/40 text-[10px]">
                          {(['Wave', 'Orange Money', 'MTN Money', 'Carte'] as const).map(method => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setCheckoutPaymentMethod(method)}
                              className={`flex-1 py-1.5 rounded-lg font-bold transition-all border-none cursor-pointer ${
                                checkoutPaymentMethod === method 
                                  ? 'bg-amber-50 text-slate-950' 
                                  : 'bg-transparent text-slate-400 hover:text-white'
                              }`}
                            >
                              {method}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Conditional fields based on Payment Method */}
                      {checkoutPaymentMethod !== 'Carte' ? (
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-medium font-mono">Numéro Mobile Money *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: +225 07 12 34 56 78"
                            value={checkoutPhone}
                            onChange={(e) => setCheckoutPhone(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2 text-xs text-white focus:outline-none transition-all font-mono"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1 font-medium">Nom sur la carte *</label>
                            <input
                              type="text"
                              required
                              placeholder="Fousseni Kafana"
                              value={checkoutCardName}
                              onChange={(e) => setCheckoutCardName(e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2 text-xs text-white focus:outline-none transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2">
                              <label className="text-[10px] text-slate-400 block mb-1 font-medium">Numéro de carte *</label>
                              <input
                                type="text"
                                required
                                placeholder="4000 1234 5678 9010"
                                value={checkoutCardNum}
                                onChange={(e) => setCheckoutCardNum(e.target.value)}
                                className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2 text-xs text-white focus:outline-none transition-all font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1 font-medium font-mono">CVV *</label>
                              <input
                                type="text"
                                required
                                maxLength={3}
                                placeholder="123"
                                value={checkoutCardCvv}
                                onChange={(e) => setCheckoutCardCvv(e.target.value)}
                                className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2 text-xs text-white focus:outline-none transition-all font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Trial notice */}
                      {saasPlansSettings.trial_days > 0 && (
                        <div className="text-[10px] text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900 text-left leading-relaxed">
                          💡 <span className="text-amber-500 font-bold">Période d'essai gratuite de {saasPlansSettings.trial_days} jours activée</span>. Votre compte sera activé immédiatement et aucun prélèvement ne sera effectué avant le <span className="text-slate-200 font-semibold">{new Date(Date.now() + saasPlansSettings.trial_days * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>.
                        </div>
                      )}

                      {/* Submit / Action buttons */}
                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => { setSignupStep('verification'); setCheckoutError(null); }}
                          className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer border-none"
                        >
                          Retour
                        </button>
                        <button
                          type="submit"
                          disabled={checkoutLoading}
                          className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:from-slate-850 disabled:to-slate-850 text-slate-950 disabled:text-slate-500 font-bold text-xs transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                        >
                          {checkoutLoading ? (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                          ) : (
                            <span>Confirmer & Activer</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            )}

            {authMode === 'forgot_password' && (
              <motion.div 
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
              >
                <h2 className="text-lg font-bold text-white mb-2">Récupération de mot de passe</h2>
                <p className="text-xs text-slate-400 mb-6 font-medium">
                  {forgotStep === 1 && "Entrez vos identifiants pour recevoir un code de sécurité par e-mail."}
                  {forgotStep === 2 && "Saisissez le code de validation à 6 chiffres envoyé à votre adresse e-mail."}
                  {forgotStep === 3 && "Définissez un nouveau mot de passe sécurisé pour votre compte."}
                </p>

                {forgotError && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 mb-4"
                  >
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>{forgotError}</span>
                  </motion.div>
                )}

                {forgotStep === 1 && (
                  <form onSubmit={handleForgotRequest} className="space-y-4 text-left">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">Adresse Email Administrateur</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          required
                          autoComplete="off"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="admin@monagence.com"
                          className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">Téléphone Administrateur Enregistré (Sécurité)</label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={forgotPhone}
                          onChange={(e) => setForgotPhone(e.target.value)}
                          placeholder="Ex: +225 07..."
                          className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none transition-all font-mono"
                        />
                      </div>
                      <p className="text-[9px] text-slate-500 mt-1 font-medium">Par mesure de sécurité, nous vérifions que le numéro de téléphone correspond à celui renseigné lors de la création de l'agence.</p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 disabled:text-slate-500 font-bold text-xs shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                      >
                        {forgotLoading ? (
                          <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                        ) : (
                          <span>Envoyer le code</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {forgotStep === 2 && (
                  <form onSubmit={handleForgotVerify} className="space-y-4 text-left">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">Code de Validation à 6 chiffres</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={forgotEnteredCode}
                        onChange={(e) => setForgotEnteredCode(e.target.value)}
                        placeholder="Ex: 123456"
                        className="w-full text-center bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-lg font-bold tracking-widest text-white focus:outline-none transition-all font-mono"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                      >
                        <span>Vérifier le code</span>
                      </button>
                    </div>
                  </form>
                )}

                {forgotStep === 3 && (
                  <form onSubmit={handleForgotReset} className="space-y-4 text-left">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">Nouveau Mot de passe</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type={showForgotPassword ? "text" : "password"}
                          required
                          autoComplete="new-password"
                          value={forgotPassword}
                          onChange={(e) => setForgotPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl pl-11 pr-10 py-2.5 text-xs text-white focus:outline-none transition-all font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(!showForgotPassword)}
                          className="absolute right-3 top-3 text-slate-500 hover:text-slate-350 cursor-pointer border-none bg-transparent"
                        >
                          {showForgotPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">Confirmer le Nouveau Mot de passe</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type={showForgotConfirmPassword ? "text" : "password"}
                          required
                          autoComplete="new-password"
                          value={forgotConfirmPassword}
                          onChange={(e) => setForgotConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl pl-11 pr-10 py-2.5 text-xs text-white focus:outline-none transition-all font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                          className="absolute right-3 top-3 text-slate-500 hover:text-slate-350 cursor-pointer border-none bg-transparent"
                        >
                          {showForgotConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 disabled:text-slate-500 font-bold text-xs shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                      >
                        {forgotLoading ? (
                          <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                        ) : (
                          <span>Enregistrer le mot de passe</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                <div className="text-center mt-6">
                  <button 
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setForgotError(null);
                    }}
                    className="text-xs text-slate-450 hover:text-slate-350 transition-colors underline underline-offset-4 cursor-pointer"
                  >
                    Retour à la connexion
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to Home link */}
          <div className="text-center mt-6">
            <Link 
              href="/"
              className="text-xs text-slate-500 hover:text-slate-350 transition-colors underline underline-offset-4"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>

        {/* MODAL SECRET CONNECT: PROPRIÉTAIRE SAAS */}
        <AnimatePresence>
          {secretLoginOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.75 }}
                exit={{ opacity: 0 }}
                onClick={() => setSecretLoginOpen(false)}
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
              />
              
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-slate-900 border border-slate-800 text-white rounded-3xl shadow-2xl p-8 max-w-sm w-full relative z-10 text-center animate-scaleIn"
              >
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                  <ShieldCheck className="w-6 h-6 text-amber-500 animate-pulse" />
                </div>
                <h3 className="font-title text-lg font-bold text-white mb-1">Accès Propriétaire</h3>
                <p className="text-xs text-slate-400 mb-6">Zone sécurisée IMMO360 AFRIQUE</p>
   
                <form onSubmit={handleSecretLoginSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="text-xs text-slate-400 block mb-2 font-medium">Saisir le Code d'accès</label>
                    <input
                      type="password"
                      required
                      value={secretPassword}
                      onChange={(e) => {
                        setSecretPassword(e.target.value);
                        setSecretError(null);
                      }}
                      placeholder="••••••••"
                      className="w-full bg-slate-850 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 text-sm font-mono tracking-widest text-center"
                    />
                    {secretError && (
                      <span className="text-[10px] text-rose-500 font-bold block mt-1.5 text-center">{secretError}</span>
                    )}
                  </div>
   
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSecretLoginOpen(false);
                        setSecretPassword('');
                        setSecretError(null);
                      }}
                      className="w-1/2 py-3 rounded-xl border border-slate-800 hover:bg-slate-850 font-semibold text-xs transition-colors text-slate-400"
                    >
                      Fermer
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg hover:shadow-xl shadow-amber-500/10 cursor-pointer"
                    >
                      Connexion
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* TOAST SYSTEM PREMIUM */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex items-center gap-3 max-w-lg text-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DASHBOARD HEADER */}
      <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        
        {/* Toggle burger mobile */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 md:hidden transition-colors"
          >
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
          
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <span className="font-title text-base font-bold text-slate-900 block leading-tight">
                IMMO360 <span className="text-amber-500">AFRIQUE</span>
              </span>
              <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">Espace Professionnel</span>
            </div>
          </div>
        </div>

        {/* MULTI-TENANT SWITCHER & PROFILE */}
        <div className="flex items-center gap-4">
          
          {/* SÉLECTEUR MULTI-TENANT */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 px-2 hidden lg:inline-block">AGENCE ACTIVE :</span>
            <select
              value={currentAgency.id}
              onChange={(e) => changeAgency(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer pr-3"
            >
              {agencies.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.country})</option>
              ))}
            </select>
          </div>

          <div className="h-10 w-px bg-slate-200 hidden md:block" />

          {/* Profil utilisateur connecté & Sélecteur de Rôle */}
          <div className="items-center gap-3 hidden md:flex">
            <div 
              onDoubleClick={() => {
                if (isOwnerUser || userRole === 'super_admin') {
                  setShowRoleSwitcher(!showRoleSwitcher);
                }
              }}
              className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm shadow-inner transition-transform ${
                userRole === 'super_admin' ? 'bg-amber-500 text-slate-950 cursor-pointer' : 'bg-slate-200 text-slate-800'
              }`}
            >
              {userRole === 'super_admin' 
                ? 'SA' 
                : (currentUserProfile 
                    ? `${currentUserProfile.first_name?.[0] || ''}${currentUserProfile.last_name?.[0] || ''}`.toUpperCase() 
                    : 'AD'
                  )
              }
            </div>
            <div className="text-left">
              {isOwnerUser || userRole === 'super_admin' ? (
                <select
                  value={userRole}
                  onChange={(e) => {
                    const role = e.target.value as 'agency_admin' | 'super_admin';
                    setUserRole(role);
                    if (role === 'super_admin') {
                      setActiveMenu('saas');
                      showToast("Accès Super Admin (Propriétaire SaaS) activé !");
                    } else {
                      setActiveMenu('overview');
                      showToast("Accès Administrateur Agence activé.");
                    }
                  }}
                  className="bg-transparent text-xs font-bold text-amber-600 focus:outline-none cursor-pointer p-0 border-0 outline-none"
                >
                  <option value="agency_admin">Bascule : Admin Agence</option>
                  <option value="super_admin">Propriétaire SaaS</option>
                </select>
              ) : (
                <span className="text-xs font-bold text-slate-850 block">
                  {currentUserProfile ? `${currentUserProfile.first_name} ${currentUserProfile.last_name}` : 'Administrateur'}
                </span>
              )}
              <span className="text-[10px] text-slate-400 block -mt-0.5">
                {userRole === 'super_admin' ? 'SaaS Owner (Toutes Options)' : 'Administrateur Agence'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex relative">
        
        {/* SIDEBAR NAVIGATION - DESKTOP */}
        <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shrink-0 hidden md:flex">
          
          <div className="space-y-8">
            <div>
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block mb-4">Navigation</span>
              <nav className="space-y-1">
                {[
                  { id: 'overview', label: 'Aperçu général', icon: TrendingUp },
                  { id: 'properties', label: 'Gestion des Biens', icon: Building2 },
                  { id: 'sales', label: 'Ventes & Cessions', icon: CreditCard },
                  { id: 'landlords', label: 'Propriétaires', icon: Users },
                  { id: 'tenants', label: 'Locataires', icon: Users },
                  { id: 'leases', label: 'Contrats de bail', icon: FileText },
                  { id: 'payments', label: 'Loyers & Encaissements', icon: CreditCard },
                  { id: 'receipts', label: 'Quittances de loyer', icon: FileText },
                  { id: 'maintenance', label: 'Tickets de Maintenance', icon: Wrench },
                  { id: 'crm', label: 'CRM Prospects', icon: Users },
                  { id: 'appointments', label: 'Rendez-vous (Visites)', icon: Calendar }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      activeMenu === item.id 
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' 
                        : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${activeMenu === item.id ? 'text-amber-500' : 'text-slate-400'}`} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Special Module Côte d'Ivoire / Sénégal */}
            <div>
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block mb-4">Modules Régionaux</span>
              <nav className="space-y-1">
                {currentAgency.country === "Côte d'Ivoire" ? (
                  <button
                    onClick={() => setActiveMenu('social')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      activeMenu === 'social' 
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' 
                        : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Layers className={`w-4 h-4 ${activeMenu === 'social' ? 'text-amber-500' : 'text-slate-400'}`} />
                    <div>
                      <span>Logements Sociaux</span>
                      <span className="text-[9px] block text-amber-500 font-semibold -mt-0.5">Côte d'Ivoire 🇨🇮</span>
                    </div>
                  </button>
                ) : (
                  <div className="px-4 py-3 text-xs text-slate-400 italic">
                    Aucun module spécifique pour le Sénégal 🇸🇳
                  </div>
                )}
              </nav>
            </div>

            {/* Console SaaS pour le Super Admin */}
            {userRole === 'super_admin' && (
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block mb-4">Administration SaaS</span>
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveMenu('saas')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      activeMenu === 'saas' 
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' 
                        : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck className={`w-4 h-4 ${activeMenu === 'saas' ? 'text-amber-500' : 'text-slate-400'}`} />
                    <span>Console SaaS (Global)</span>
                  </button>
                </nav>
              </div>
            )}
          </div>

          {/* Abonnement Usage Box */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 mb-4 text-left">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-mono text-amber-800 font-extrabold uppercase tracking-wide">Abonnement {currentAgency.plan || 'Standard'}</span>
              <span className="text-[10px] font-mono font-bold text-amber-800">{properties.length}/{currentAgency.plan === 'Standard' ? 5 : currentAgency.plan === 'Premium' ? 15 : '∞'} Biens</span>
            </div>
            {currentAgency.plan !== 'VIP' ? (
              <>
                <div className="w-full bg-amber-200/50 h-1.5 rounded-full overflow-hidden mb-2">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((properties.length / (currentAgency.plan === 'Standard' ? 5 : 15)) * 100, 100)}%` }} 
                  />
                </div>
                <button 
                  onClick={() => {
                    setSelectedBillingPlan(currentAgency.plan || 'Standard');
                    setBillingModalOpen(true);
                  }}
                  className="text-[10px] font-extrabold text-amber-700 hover:text-amber-800 flex items-center gap-0.5 cursor-pointer"
                >
                  Mettre à niveau <ChevronRight className="w-3 h-3" />
                </button>
              </>
            ) : (
              <p className="text-[10px] text-amber-750 font-bold">Portefeuille illimité débloqué ! 🚀</p>
            )}
          </div>

          <div className="pt-6 border-t border-slate-200">
            <button
              onClick={() => setActiveMenu('contact')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all mb-2 ${
                activeMenu === 'contact' ? 'bg-slate-900 text-white' : 'text-slate-650 hover:bg-slate-50'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-slate-400" />
              Support & Contact
            </button>
            <button
              onClick={() => setActiveMenu('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all mb-2 ${
                activeMenu === 'settings' ? 'bg-slate-900 text-white' : 'text-slate-650 hover:bg-slate-50'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              Configuration
            </button>
            <Link
              href="/"
              onClick={() => {
                sessionStorage.removeItem('immo360_authenticated');
                sessionStorage.removeItem('immo360_user_email');
                setIsAuthenticated(false);
                setIsOwnerUser(false);
                setUserRole('agency_admin');
                setShowRoleSwitcher(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Link>
          </div>
        </aside>

        {/* SIDEBAR NAVIGATION - MOBILE DRAWER */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 z-50 bg-black md:hidden"
              />
              
              {/* Drawer */}
              <motion.aside 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-80 bg-white z-50 p-6 flex flex-col justify-between md:hidden"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-250">
                    <span className="font-bold text-slate-900">Menu</span>
                    <button 
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-slate-100"
                    >
                      <X className="w-5 h-5 text-slate-650" />
                    </button>
                  </div>

                  <nav className="space-y-1">
                    {[
                      { id: 'overview', label: 'Aperçu général', icon: TrendingUp },
                      { id: 'properties', label: 'Gestion des Biens', icon: Building2 },
                      { id: 'sales', label: 'Ventes & Cessions', icon: CreditCard },
                      { id: 'landlords', label: 'Propriétaires', icon: Users },
                      { id: 'tenants', label: 'Locataires', icon: Users },
                      { id: 'leases', label: 'Contrats de bail', icon: FileText },
                      { id: 'payments', label: 'Loyers & Encaissements', icon: CreditCard },
                      { id: 'receipts', label: 'Quittances de loyer', icon: FileText },
                      { id: 'maintenance', label: 'Tickets de Maintenance', icon: Wrench },
                      { id: 'crm', label: 'CRM Prospects', icon: Users },
                      { id: 'appointments', label: 'Rendez-vous (Visites)', icon: Calendar }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveMenu(item.id as any);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                          activeMenu === item.id ? 'bg-slate-900 text-white' : 'text-slate-650 hover:bg-slate-50'
                        }`}
                      >
                        <item.icon className="w-4 h-4 text-slate-400" />
                        {item.label}
                      </button>
                    ))}
                    {currentAgency.country === "Côte d'Ivoire" && (
                      <button
                        onClick={() => {
                          setActiveMenu('social');
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                          activeMenu === 'social' ? 'bg-slate-900 text-white' : 'text-slate-650 hover:bg-slate-50'
                        }`}
                      >
                        <Layers className="w-4 h-4 text-slate-400" />
                        <span>Logements Sociaux 🇨🇮</span>
                      </button>
                    )}
                    {userRole === 'super_admin' && (
                      <button
                        onClick={() => {
                          setActiveMenu('saas');
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                          activeMenu === 'saas' ? 'bg-slate-900 text-white' : 'text-slate-650 hover:bg-slate-50'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 text-slate-400" />
                        <span>Console SaaS (Global)</span>
                      </button>
                    )}
                  </nav>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  {/* Sélecteur de Rôle sur Mobile */}
                  <div 
                    onDoubleClick={() => {
                      if (isOwnerUser || userRole === 'super_admin') {
                        setShowRoleSwitcher(!showRoleSwitcher);
                      }
                    }}
                    className={`flex items-center gap-3 p-3 rounded-2xl mb-4 text-left border ${
                      isOwnerUser || userRole === 'super_admin' 
                        ? 'bg-amber-50 border-amber-200 cursor-pointer' 
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs shrink-0 ${
                      userRole === 'super_admin' ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {userRole === 'super_admin' 
                        ? 'SA' 
                        : (currentUserProfile 
                            ? `${currentUserProfile.first_name?.[0] || ''}${currentUserProfile.last_name?.[0] || ''}`.toUpperCase() 
                            : 'AD'
                          )
                      }
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {currentUserProfile ? `${currentUserProfile.first_name} ${currentUserProfile.last_name}` : 'Administrateur'}
                      </span>
                      <span className="text-[10px] text-slate-400 block -mt-0.5">
                        {userRole === 'super_admin' ? 'Propriétaire SaaS' : 'Administrateur Agence'}
                      </span>
                    </div>
                  </div>

                  {(isOwnerUser || userRole === 'super_admin') && showRoleSwitcher && (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 mb-4 text-left animate-fadeIn">
                      <span className="text-[10px] font-bold text-amber-700 block mb-2 uppercase tracking-wider">Mode Développeur / Rôle</span>
                      <select
                        value={userRole}
                        onChange={(e) => {
                          const role = e.target.value as 'agency_admin' | 'super_admin';
                          setUserRole(role);
                          if (role === 'super_admin') {
                            setActiveMenu('saas');
                            setMobileMenuOpen(false);
                            showToast("Accès Super Admin (Propriétaire SaaS) activé !");
                          } else {
                            setActiveMenu('overview');
                            setMobileMenuOpen(false);
                            showToast("Accès Administrateur Agence activé.");
                          }
                        }}
                        className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                      >
                        <option value="agency_admin">
                          {currentUserProfile ? `${currentUserProfile.first_name} (Admin Agence)` : 'Admin Agence'}
                        </option>
                        <option value="super_admin">Propriétaire SaaS (Super Admin)</option>
                      </select>
                    </div>
                  )}

                  {/* Abonnement Usage Box Mobile */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 mb-4 text-left">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-mono text-amber-800 font-extrabold uppercase tracking-wide">Abonnement {currentAgency.plan || 'Standard'}</span>
                      <span className="text-[10px] font-mono font-bold text-amber-800">{properties.length}/{currentAgency.plan === 'Standard' ? 5 : currentAgency.plan === 'Premium' ? 15 : '∞'} Biens</span>
                    </div>
                    {currentAgency.plan !== 'VIP' ? (
                      <>
                        <div className="w-full bg-amber-200/50 h-1.5 rounded-full overflow-hidden mb-2">
                          <div 
                            className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min((properties.length / (currentAgency.plan === 'Standard' ? 5 : 15)) * 100, 100)}%` }} 
                          />
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedBillingPlan(currentAgency.plan || 'Standard');
                            setBillingModalOpen(true);
                            setMobileMenuOpen(false);
                          }}
                          className="text-[10px] font-extrabold text-amber-700 hover:text-amber-800 flex items-center gap-0.5 cursor-pointer"
                        >
                          Mettre à niveau <ChevronRight className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <p className="text-[10px] text-amber-750 font-bold">Portefeuille illimité débloqué ! 🚀</p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setActiveMenu('contact');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-650 hover:bg-slate-50"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    Support & Contact
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('settings');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-650 hover:bg-slate-50"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Configuration
                  </button>
                  <Link
                    href="/"
                    onClick={() => {
                      sessionStorage.removeItem('immo360_authenticated');
                      sessionStorage.removeItem('immo360_user_email');
                      setIsAuthenticated(false);
                      setMobileMenuOpen(false);
                      setIsOwnerUser(false);
                      setUserRole('agency_admin');
                      setShowRoleSwitcher(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-rose-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </Link>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* MAIN DASHBOARD CONTENT */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
          
          {/* APERÇU (OVERVIEW) VIEW */}
          {activeMenu === 'overview' && (
            <div className="space-y-8">

              {/* GLOBAL PLATFORM BROADCAST BANNER */}
              {broadcastActive && broadcastMessage && !broadcastDismissed && (
                <div className={`p-4 rounded-3xl border text-xs flex items-center justify-between shadow-sm animate-fadeIn ${
                  broadcastLevel === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
                  broadcastLevel === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                  'bg-indigo-50 border-indigo-200 text-indigo-800'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      broadcastLevel === 'error' ? 'bg-rose-100 text-rose-600' :
                      broadcastLevel === 'warning' ? 'bg-amber-100 text-amber-600' :
                      'bg-indigo-100 text-indigo-650'
                    }`}>
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="font-bold uppercase tracking-wider block text-[9px] text-slate-400">Annonce Plateforme IMMO360</span>
                      <p className="mt-0.5 font-semibold leading-relaxed">{broadcastMessage}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setBroadcastDismissed(true);
                      showToast("Annonce masquée.");
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-250 transition-colors cursor-pointer shrink-0 ml-3"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              )}
              
              {/* WELCOME BANNER */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="space-y-2 relative z-10">
                  <h1 className="font-title text-2xl md:text-3xl font-extrabold">Akwaba chez {currentAgency.name} !</h1>
                  <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
                    Voici l'état actuel de votre portefeuille immobilier pour {currentAgency.name} ({currentAgency.country}). Vous opérez dans la monnaie locale <span className="font-mono text-amber-500 font-bold">{currentAgency.currency}</span>.
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-750 backdrop-blur-sm shrink-0 relative z-10">
                  <ShieldCheck className="w-6 h-6 text-amber-500" />
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block font-mono">ISOLATION CLIENT</span>
                    <span className="text-xs font-bold text-white">Sécurisé par RLS</span>
                  </div>
                </div>
              </div>

              {/* STATS CARDS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Biens sous Gestion", val: stats.totalProperties, desc: `${stats.occupiedProperties} biens occupés`, icon: Building2 },
                  { label: "Taux d'Occupation", val: `${stats.occupancyRate}%`, desc: `${stats.activeLeasesCount} baux actifs`, icon: TrendingUp },
                  { label: "Loyers Encaissés (Juin)", val: `${stats.monthlyIncome.toLocaleString()} ${currentAgency.currency}`, desc: "Comptabilisé", icon: DollarSign, color: "text-emerald-600" },
                  { label: "Loyers Non Encaissés", val: `${stats.lateIncome.toLocaleString()} ${currentAgency.currency}`, desc: `${payments.filter(p => p.status === 'En retard').length} locataires en retard`, icon: Clock, color: "text-rose-600" }
                ].map((stat, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-semibold">{stat.label}</span>
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                        <stat.icon className="w-4 h-4 text-slate-500" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className={`text-2xl font-bold font-mono tracking-tight ${stat.color || 'text-slate-900'}`}>{stat.val}</h3>
                      <span className="text-[10px] text-slate-400 block mt-1 font-medium">{stat.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CHARTS SECTION */}
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* Graphique de revenus (SVG simple réactif) */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Revenus et Encaissés</h3>
                      <span className="text-[10px] text-slate-400">Historique des 3 derniers mois</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 font-mono">+{stats.monthlyIncome.toLocaleString()} {currentAgency.currency}</span>
                  </div>

                  {/* SVG Chart */}
                  <div className="h-48 w-full flex items-end justify-between pt-6 border-b border-slate-150 font-mono text-[9px] text-slate-400">
                    <div className="w-full h-full relative flex items-end">
                      
                      {/* Barres d'historique de revenus */}
                      <div className="absolute inset-x-0 bottom-0 top-0 flex items-end justify-around px-8">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-14 bg-slate-200 rounded-t-lg h-36 hover:bg-slate-300 transition-colors relative group">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">12.5M</span>
                          </div>
                          <span>Avril</span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                          <div className="w-14 bg-slate-300 rounded-t-lg h-40 hover:bg-slate-400 transition-colors relative group">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">14.2M</span>
                          </div>
                          <span>Mai</span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                          <div className="w-14 bg-amber-500 rounded-t-lg h-44 hover:bg-amber-400 transition-colors relative group">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">15.8M</span>
                          </div>
                          <span className="text-amber-600 font-bold">Juin</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Graphique d'occupation circulaire */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Taux d'occupation</h3>
                    <span className="text-[10px] text-slate-400">Statistiques en temps réel</span>
                  </div>

                  <div className="py-6 flex justify-center relative items-center">
                    {/* SVG Donut */}
                    <svg className="w-32 h-32" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-amber-500"
                        strokeDasharray={`${stats.occupancyRate}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-bold text-slate-900 font-mono">{stats.occupancyRate}%</span>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Occupé</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 flex justify-around border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>{stats.occupiedProperties} Loués</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <span>{stats.totalProperties - stats.occupiedProperties} Libres</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* RECENT ACTIVITIES & ACTIONS */}
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* Activités et relances urgentes */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Retards & Relances Immédiates</h3>
                      <span className="text-[10px] text-slate-400">Paiements en attente de relances automatiques</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 text-[10px] font-bold">Action requise</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {payments.filter(p => p.status === 'En retard' || p.status === 'Impayé').length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400">
                        Aucun retard de paiement détecté ! Tous les loyers sont à jour.
                      </div>
                    ) : (
                      payments.filter(p => p.status === 'En retard' || p.status === 'Impayé').map(payment => (
                        <div key={payment.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                          <div className="text-left">
                            <h4 className="text-xs font-bold text-slate-900">{payment.lease.tenant.first_name} {payment.lease.tenant.last_name}</h4>
                            <span className="text-[10px] text-slate-500 block">{payment.lease.property.name} - Loyer mensuel HC</span>
                            <span className="text-[9px] font-mono text-rose-600 font-bold block mt-0.5">Date limite : {payment.lease.payment_day} du mois</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-mono text-slate-700 mr-2">{payment.amount.toLocaleString()} {currentAgency.currency}</span>
                            
                            <button
                              onClick={() => handleSimulateWhatsAppRelance(payment)}
                              className="px-3 py-1.5 rounded-lg border border-slate-250 text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 transition-all flex items-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3" /> Relancer
                            </button>
                            
                            <button
                              onClick={() => {
                                setActivePaymentToPay(payment);
                                setPayModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold transition-all"
                            >
                              Encaisser
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Activités récentes */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">Journal d'activités</h3>
                  
                  <div className="space-y-4 text-left">
                    {activities.length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-400">
                        Aucune activité récente.
                      </div>
                    ) : (
                      activities.map((act, idx) => (
                        <div key={act.text + idx} className="flex gap-3 text-xs">
                          <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${act.color}`}>
                            <act.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-slate-700 font-semibold leading-snug">{act.text}</p>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{act.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* GESTION DES BIENS (PROPERTIES) VIEW */}
          {activeMenu === 'properties' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-title text-2xl font-extrabold text-slate-900">Catalogue des Biens</h1>
                  <p className="text-xs text-slate-500">Ajoutez, gérez et suivez le statut de vos appartements, villas et bureaux.</p>
                </div>
                <button
                  onClick={() => setPropertyModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-slate-900/10"
                >
                  <Plus className="w-4 h-4" /> Nouveau Bien
                </button>
              </div>

              {/* Filtres rapides */}
              <div className="space-y-3 pb-4">
                <div className="flex flex-wrap gap-2 items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider mr-2">Catégorie :</span>
                  {['Tous', 'Villa', 'Appartement', 'Bureau', 'Magasin'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedTypeFilter(f)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedTypeFilter === f
                          ? 'bg-slate-900 text-white shadow'
                          : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-2 items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider mr-2">Disponibilité :</span>
                  {['Tous', 'Disponible', 'Occupé', 'En maintenance'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedStatusFilter(s)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedStatusFilter === s
                          ? 'bg-slate-900 text-white shadow'
                          : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

               {/* Grille des biens */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.length === 0 ? (
                  <div className="col-span-full text-center py-16 px-6 bg-white border border-slate-200 rounded-3xl shadow-sm max-w-lg mx-auto space-y-4 my-6">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20">
                      <Building2 className="w-8 h-8 text-amber-500 animate-pulse" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Aucun bien enregistré</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Votre agence immobilière est prête. Ajoutez votre premier appartement, villa ou terrain à louer ou à vendre pour commencer à gérer votre activité !
                    </p>
                    <button
                      onClick={() => setPropertyModalOpen(true)}
                      className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 mx-auto cursor-pointer border-none"
                    >
                      <Plus className="w-4 h-4" /> Ajouter mon premier bien
                    </button>
                  </div>
                ) : filteredProperties.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-slate-500 font-medium">
                    Aucun bien ne correspond aux filtres sélectionnés.
                  </div>
                ) : (
                  filteredProperties.map(prop => (
                    <div key={prop.id} onClick={() => setSelectedPropertyForDetails(prop)} className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all group cursor-pointer">
                      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                        <img 
                          src={prop.gallery[0]} 
                          alt={prop.name}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                        <span className={`absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          prop.status === 'Disponible' ? 'bg-emerald-500 text-white' : 
                          prop.status === 'Occupé' ? 'bg-blue-500 text-white' : 
                          'bg-amber-500 text-white'
                        }`}>
                          {prop.status}
                        </span>
                      </div>

                      <div className="p-6 text-left flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">{prop.type}</span>
                          <h3 className="text-base font-bold text-slate-900">{prop.name}</h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {prop.address}, {prop.city}
                          </p>
                          <p className="text-xs text-slate-650 line-clamp-2 mt-2 leading-relaxed">{prop.description}</p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center">
                          <div className="text-left">
                            <span className="text-[10px] text-slate-400 block font-semibold">VALEUR LOCATIVE</span>
                            <span className="text-sm font-bold font-mono text-slate-900">{prop.rental_value.toLocaleString()} {currentAgency.currency}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-xs font-mono text-slate-400 font-semibold">{prop.surface} m²</span>
                            <span className="text-xs text-slate-400 font-semibold">•</span>
                            <span className="text-xs text-slate-400 font-semibold">{prop.rooms} p.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* GESTION DES VENTES (SALES) VIEW */}
          {activeMenu === 'sales' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h1 className="font-title text-2xl font-extrabold text-slate-900">Ventes & Cessions de Biens</h1>
                  <p className="text-xs text-slate-500">Gerez les ventes de maisons et de terrains. La plateforme preleve automatiquement 10% sur chaque transaction.</p>
                </div>
                <button
                  onClick={() => {
                    const firstSaleProp = properties.find(p => p.listing_type === 'Vente' && p.status === 'Disponible');
                    setNewSale({
                      property_id: firstSaleProp?.id || '',
                      buyer_name: '',
                      buyer_phone: '',
                      sale_price: firstSaleProp?.rental_value || 0,
                      payment_method: 'Wave',
                      reference: ''
                    });
                    setSaleModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-slate-900/10 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Enregistrer une Vente
                </button>
              </div>

              {/* KPIs de ventes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Volume de Vente Global", val: `${sales.reduce((acc, s) => acc + s.sale_price, 0).toLocaleString()} ${currentAgency.currency}`, desc: `${sales.length} transactions finalisees`, icon: TrendingUp },
                  { label: "Commissions Prelevees (10%)", val: `${sales.reduce((acc, s) => acc + s.commission_amount, 0).toLocaleString()} ${currentAgency.currency}`, desc: "Revenu SaaS / Agence", icon: DollarSign, color: "text-amber-655" },
                  { label: "Reverse aux Proprietaires (90%)", val: `${sales.reduce((acc, s) => acc + s.net_owner_amount, 0).toLocaleString()} ${currentAgency.currency}`, desc: "Payouts Mobile Money / Virement", icon: CreditCard, color: "text-emerald-600" },
                  { label: "Biens en Vente Disponibles", val: properties.filter(p => p.listing_type === 'Vente' && p.status === 'Disponible').length, desc: "Maisons & terrains", icon: Building2 }
                ].map((stat, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-semibold">{stat.label}</span>
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                        <stat.icon className="w-4 h-4 text-slate-500" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className={`text-xl font-bold font-mono tracking-tight ${stat.color || 'text-slate-900'}`}>{stat.val}</h3>
                      <span className="text-[10px] text-slate-400 block mt-1 font-medium">{stat.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Section 1: Biens en vente disponibles */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 text-left">Catalogue des Biens en Vente</h3>
                {properties.filter(p => p.listing_type === 'Vente' && p.status === 'Disponible').length === 0 ? (
                  <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-xs text-slate-400">
                    Aucun terrain ou maison n'est actuellement disponible a la vente. Ajoutez un bien avec l'option "Vente" pour le lister.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.filter(p => p.listing_type === 'Vente' && p.status === 'Disponible').map(prop => (
                      <div key={prop.id} className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-slate-350 transition-all text-left group">
                        <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                          <img 
                            src={prop.gallery[0]} 
                            alt={prop.name}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                          />
                          <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow">
                            En Vente
                          </span>
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <span className="text-[10px] font-mono text-amber-600 font-bold uppercase tracking-wider">{prop.type}</span>
                            <h3 className="text-base font-bold text-slate-900">{prop.name}</h3>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {prop.address}, {prop.city}
                            </p>
                            <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">{prop.description}</p>
                          </div>

                          <div className="pt-4 mt-4 border-t border-slate-150 flex justify-between items-center">
                            <div>
                              <span className="text-[10px] text-slate-400 block font-semibold">PRIX DE VENTE</span>
                              <span className="text-sm font-bold font-mono text-slate-900">{prop.rental_value.toLocaleString()} {currentAgency.currency}</span>
                            </div>
                            <button
                              onClick={() => {
                                setNewSale({
                                  property_id: prop.id,
                                  buyer_name: '',
                                  buyer_phone: '',
                                  sale_price: prop.rental_value,
                                  payment_method: 'Wave',
                                  reference: ''
                                });
                                setSaleModalOpen(true);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow"
                            >
                              Vendre
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 2: Historique des ventes finalisees */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 text-left">Historique des Transactions de Vente</h3>
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden text-left">
                  {sales.length === 0 ? (
                    <div className="py-6 text-center text-slate-450 text-xs">
                      Aucune transaction de vente n'a encore ete finalisee.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 font-bold text-xs">
                            <th className="pb-3 font-semibold text-left">Bien Vendu</th>
                            <th className="pb-3 font-semibold text-left">Acquereur (Acheteur)</th>
                            <th className="pb-3 font-semibold text-left">Prix de Vente</th>
                            <th className="pb-3 font-semibold text-left">Repartition (10% / 90%)</th>
                            <th className="pb-3 font-semibold text-left">Paiement</th>
                            <th className="pb-3 font-semibold text-right">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {sales.map(sale => (
                            <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-4">
                                <span className="font-bold text-slate-900 block text-xs">{sale.property.name}</span>
                                <span className="text-[10px] text-slate-400 block font-mono">{sale.property.type} &bull; {sale.property.city}</span>
                              </td>
                              <td className="py-4">
                                <span className="font-bold text-slate-850 block text-xs">{sale.buyer_name}</span>
                                <span className="text-[10px] text-slate-500 block font-mono">{sale.buyer_phone}</span>
                              </td>
                              <td className="py-4 font-mono font-bold text-slate-900 text-xs">
                                {sale.sale_price.toLocaleString()} {currentAgency.currency}
                              </td>
                              <td className="py-4">
                                <div className="space-y-1 text-[10px] font-mono">
                                  <span className="block text-amber-600 font-bold">⚡ Commission (10%) : {sale.commission_amount.toLocaleString()} {currentAgency.currency}</span>
                                  <span className="block text-emerald-600 font-bold">👤 Net Vendeur (90%) : {sale.net_owner_amount.toLocaleString()} {currentAgency.currency}</span>
                                </div>
                              </td>
                              <td className="py-4">
                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold block w-fit">
                                  {sale.payment_method}
                                </span>
                                <span className="text-[10px] text-slate-400 block font-mono mt-1">{sale.reference}</span>
                              </td>
                              <td className="py-4 text-right text-xs text-slate-500">
                                {new Date(sale.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* GESTION DES BAILLEURS (LANDLORDS) */}
          {activeMenu === 'landlords' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center text-left">
                <div>
                  <h1 className="font-title text-2xl font-extrabold text-slate-900">Bailleurs & Propriétaires</h1>
                  <p className="text-xs text-slate-500">Gérez vos mandats de gestion et les coordonnées des propriétaires de vos biens.</p>
                </div>
                <button
                  onClick={() => setLandlordModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer border-none"
                >
                  <Plus className="w-4 h-4 text-amber-500 stroke-[3]" />
                  Ajouter un Propriétaire
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden text-left">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold text-xs">
                        <th className="pb-3 font-semibold">Nom complet</th>
                        <th className="pb-3 font-semibold">Téléphone</th>
                        <th className="pb-3 font-semibold">Email</th>
                        <th className="pb-3 font-semibold">Coordonnées de virement / Mobile</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {landlords.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-400 text-xs italic">
                            Aucun bailleur enregistré. Utilisez le bouton ci-dessus pour en ajouter un.
                          </td>
                        </tr>
                      ) : (
                        landlords.map(landlord => (
                          <tr key={landlord.id}>
                            <td className="py-4 font-bold text-slate-900">{landlord.first_name} {landlord.last_name}</td>
                            <td className="py-4 font-mono text-xs text-slate-700">{landlord.phone}</td>
                            <td className="py-4 text-slate-650">{landlord.email}</td>
                            <td className="py-4 text-xs font-mono text-slate-550">
                              <span className="block text-slate-800 font-bold">{landlord.bank_details}</span>
                              <span className="block text-amber-600 font-bold mt-0.5">{landlord.mobile_money_details}</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* GESTION DES LOCATAIRES (TENANTS) */}
          {activeMenu === 'tenants' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center text-left">
                <div>
                  <h1 className="font-title text-2xl font-extrabold text-slate-900">Annuaire des Locataires</h1>
                  <p className="text-xs text-slate-500">Accédez aux profils des locataires, professions, employeurs et pièces d'identité.</p>
                </div>
                <button
                  onClick={() => setTenantModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer border-none"
                >
                  <Plus className="w-4 h-4 text-amber-500 stroke-[3]" />
                  Ajouter un Locataire
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden text-left">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold text-xs">
                        <th className="pb-3 font-semibold">Nom complet</th>
                        <th className="pb-3 font-semibold">Téléphone</th>
                        <th className="pb-3 font-semibold">Profession / Employeur</th>
                        <th className="pb-3 font-semibold">Email</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tenants.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-400 text-xs italic">
                            Aucun locataire enregistré. Utilisez le bouton ci-dessus pour en ajouter un.
                          </td>
                        </tr>
                      ) : (
                        tenants.map(tenant => (
                          <tr key={tenant.id}>
                            <td className="py-4 font-bold text-slate-900">{tenant.first_name} {tenant.last_name}</td>
                            <td className="py-4 font-mono text-xs text-slate-700">{tenant.phone}</td>
                            <td className="py-4 text-slate-650">
                              <span className="font-semibold text-slate-800">{tenant.profession}</span>
                              <span className="block text-[10px] text-slate-400">{tenant.employer}</span>
                            </td>
                            <td className="py-4 text-slate-600">{tenant.email}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* GESTION DES CONTRATS DE BAIL (LEASES) */}
          {activeMenu === 'leases' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-title text-2xl font-extrabold text-slate-900">Contrats de Bail</h1>
                  <p className="text-xs text-slate-500">Rédigez de nouveaux contrats de location conformes au droit local.</p>
                </div>
                <button
                  onClick={() => setLeaseModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-slate-900/10"
                >
                  <Plus className="w-4 h-4" /> Nouveau Bail
                </button>
              </div>

              {leases.length === 0 ? (
                <div className="text-center py-16 px-6 bg-white border border-slate-200 rounded-3xl shadow-sm max-w-lg mx-auto space-y-4 my-6">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20">
                    <FileText className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Aucun contrat de bail actif</h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Une fois que vous avez enregistré des biens, des propriétaires et des locataires, vous pourrez créer des contrats de bail pour générer automatiquement les échéanciers de loyers.
                  </p>
                  <button
                    onClick={() => {
                      if (properties.length === 0) {
                        showToast("Veuillez d'abord ajouter un bien dans le catalogue.");
                        setActiveMenu('properties');
                      } else if (tenants.length === 0) {
                        showToast("Veuillez d'abord enregistrer un locataire.");
                        setActiveMenu('tenants');
                      } else {
                        setLeaseModalOpen(true);
                      }
                    }}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 mx-auto cursor-pointer border-none"
                  >
                    <Plus className="w-4 h-4" /> Rédiger mon premier bail
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {leases.map(lease => (
                    <div key={lease.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-left flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">{lease.type}</span>
                          <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Actif
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 block font-semibold">LOCATAIRE</span>
                          <h3 className="text-base font-bold text-slate-900">{lease.tenant.first_name} {lease.tenant.last_name}</h3>
                          <span className="text-xs text-slate-500 block">{lease.property.name}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-2 border-t border-b border-slate-100 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Loyer Mensuel</span>
                            <span className="font-bold font-mono text-slate-800">{lease.rent_amount.toLocaleString()} FCFA</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Caution</span>
                            <span className="font-bold font-mono text-slate-800">{lease.deposit_amount.toLocaleString()} FCFA</span>
                          </div>
                        </div>

                        <div className="text-xs text-slate-500 space-y-1">
                          <div className="flex justify-between">
                            <span>Entrée en vigueur :</span>
                            <span className="font-semibold text-slate-800">{lease.start_date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Échéance loyer :</span>
                            <span className="font-semibold text-slate-800">Le {lease.payment_day} du mois</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 mt-4 border-t border-slate-100">
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); showToast("Téléchargement de la quittance PDF simulé."); }}
                          className="w-full py-2.5 rounded-xl border border-slate-200 text-center text-xs font-bold text-slate-650 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Download className="w-4 h-4" /> Télécharger le contrat
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* GESTION DES LOYERS & ENCAISSEMENTS (PAYMENTS) */}
          {activeMenu === 'payments' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-title text-2xl font-extrabold text-slate-900">Loyers & Encaissements</h1>
                <p className="text-xs text-slate-500">Percevez les loyers, gérez les échéances et déclenchez des relances automatisées.</p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden text-left">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold text-xs">
                        <th className="pb-3 font-semibold">Locataire / Bien</th>
                        <th className="pb-3 font-semibold">Période</th>
                        <th className="pb-3 font-semibold">Montant</th>
                        <th className="pb-3 font-semibold">Statut</th>
                        <th className="pb-3 font-semibold">Répartition & Reversements</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 text-xs italic">
                            Aucun paiement ou échéance générée. Créez un contrat de bail pour démarrer l'échéancier.
                          </td>
                        </tr>
                      ) : (
                        payments.map(payment => (
                          <tr key={payment.id}>
                            <td className="py-4">
                              <span className="font-bold text-slate-900 block">{payment.lease.tenant.first_name} {payment.lease.tenant.last_name}</span>
                              <span className="text-xs text-slate-500 block">{payment.lease.property.name}</span>
                            </td>
                            <td className="py-4 font-mono text-xs text-slate-600">
                              Du {payment.period_start} <br />
                              au {payment.period_end}
                            </td>
                            <td className="py-4 font-mono font-bold text-slate-900">
                              {payment.amount.toLocaleString()} {currentAgency.currency}
                            </td>
                            <td className="py-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                payment.status === 'Payé' ? 'bg-emerald-100 text-emerald-600' : 
                                payment.status === 'En retard' ? 'bg-rose-100 text-rose-600' : 
                                'bg-amber-100 text-amber-600'
                              }`}>
                                {payment.status}
                              </span>
                              {payment.method && (
                                <span className="text-[10px] block text-slate-400 font-semibold mt-1">
                                  via {payment.method}
                                </span>
                              )}
                            </td>
                            <td className="py-4">
                              {payment.status === 'Payé' ? (
                                (() => {
                                  const landlord = landlords.find(l => {
                                    const propId = payment.lease.property.id;
                                    if (propId.includes('p1111111') || propId.includes('p1111113')) return l.id.includes('l1111111');
                                    if (propId.includes('p1111112') || propId.includes('p1111114')) return l.id.includes('l1111112');
                                    if (propId.includes('p2222221') || propId.includes('p2222222')) return l.id.includes('l2222221');
                                    return false;
                                  }) || landlords[0];
                                  
                                  const propAmt = Math.round(payment.amount * 0.9);
                                  const agencyAmt = Math.round(payment.amount * 0.08);
                                  const saasAmt = Math.round(payment.amount * 0.02);
                                  
                                  return (
                                    <div className="space-y-1.5 text-xs text-left">
                                      <div className="flex items-center gap-1 font-semibold text-emerald-600">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Versé automatiquement</span>
                                      </div>
                                      <div className="text-[10px] text-slate-500 space-y-0.5 font-mono">
                                        <span className="block">👤 <strong>Propriétaire (90%) :</strong> {propAmt.toLocaleString()} {currentAgency.currency} ({landlord ? landlord.first_name : 'Amadou'} - {landlord ? landlord.mobile_money_details?.split(':')[0] || 'Orange Money' : 'Orange Money'})</span>
                                        <span className="block">🏢 <strong>Commission Agence (8%) :</strong> {agencyAmt.toLocaleString()} {currentAgency.currency}</span>
                                        <span className="block">⚡ <strong>Frais SaaS (2%) :</strong> {saasAmt.toLocaleString()} {currentAgency.currency}</span>
                                      </div>
                                    </div>
                                  );
                                })()
                              ) : (
                                <div className="text-xs text-slate-400 italic text-left">
                                  En attente d'encaissement...
                                </div>
                              )}
                            </td>
                            <td className="py-4 text-right">
                              {payment.status !== 'Payé' ? (
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => handleSimulateWhatsAppRelance(payment)}
                                    className="px-3 py-1.5 rounded-lg border border-slate-250 text-xs font-bold text-slate-650 hover:bg-slate-50 transition-all"
                                  >
                                    Relancer
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActivePaymentToPay(payment);
                                      setPayModalOpen(true);
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all"
                                  >
                                    Encaisser
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs font-semibold text-emerald-600">
                                  Encaissé le {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : ''}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* GESTION DES QUITTANCES (RECEIPTS) */}
          {activeMenu === 'receipts' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-title text-2xl font-extrabold text-slate-900">Quittances de Loyer</h1>
                <p className="text-xs text-slate-500">Historique des reçus administratifs transmis aux locataires.</p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden text-left">
                {receipts.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    Aucune quittance n'a encore été générée. Enregistrez des paiements pour commencer.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-bold text-xs">
                          <th className="pb-3 font-semibold">Numéro de Reçu</th>
                          <th className="pb-3 font-semibold">Locataire</th>
                          <th className="pb-3 font-semibold">Montant quittancé</th>
                          <th className="pb-3 font-semibold">Envoi de notification</th>
                          <th className="pb-3 font-semibold text-right">Télécharger</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {receipts.map(receipt => (
                          <tr key={receipt.id}>
                            <td className="py-4 font-mono font-bold text-slate-900">{receipt.receipt_number}</td>
                            <td className="py-4">
                              <span className="font-bold text-slate-800 block">{receipt.payment.lease.tenant.first_name} {receipt.payment.lease.tenant.last_name}</span>
                              <span className="text-xs text-slate-550 block">{receipt.payment.lease.property.name}</span>
                            </td>
                            <td className="py-4 font-mono font-bold text-slate-900">
                              {receipt.payment.amount.toLocaleString()} {currentAgency.currency}
                            </td>
                            <td className="py-4">
                              <div className="flex gap-1.5 flex-wrap">
                                {receipt.sent_via?.map((channel, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> {channel}
                                  </span>
                                ))}
                              </div>
                              <span className="text-[10px] text-slate-400 block mt-1">Transmis le {receipt.sent_at ? new Date(receipt.sent_at).toLocaleDateString() : ''}</span>
                            </td>
                            <td className="py-4 text-right">
                              <button 
                                onClick={() => showToast("Quittance PDF prête pour impression.")}
                                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors inline-block"
                              >
                                <Download className="w-4 h-4 text-slate-500" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* GESTION DE MAINTENANCE (TICKETS) */}
          {activeMenu === 'maintenance' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-title text-2xl font-extrabold text-slate-900">Suivi de Maintenance</h1>
                <p className="text-xs text-slate-500">Gérez les pannes, affectez des prestataires et contrôlez les coûts d'entretien de vos biens.</p>
              </div>

              {tickets.length === 0 ? (
                <div className="text-center py-16 px-6 bg-white border border-slate-200 rounded-3xl shadow-sm max-w-lg mx-auto space-y-4 my-6">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20">
                    <Wrench className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Aucun ticket de maintenance</h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Aucune panne ou réparation n'est actuellement signalée sur vos biens. Lorsqu'un locataire signale un problème, il s'affichera ici.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {tickets.map(ticket => (
                    <div key={ticket.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-left flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            ticket.priority === 'Urgente' || ticket.priority === 'Haute' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'
                          }`}>
                            Priorité {ticket.priority}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
                            {ticket.status}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-slate-900">{ticket.title}</h3>
                          <span className="text-xs font-semibold text-amber-600 block">{ticket.property.name}</span>
                          <p className="text-xs text-slate-500 leading-relaxed pt-2">{ticket.description}</p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-450">Prestataire :</span>
                            <span className="font-semibold text-slate-800">{ticket.contractor_name || 'Non assigné'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-455">Coût estimé :</span>
                            <span className="font-semibold text-slate-800 font-mono">{ticket.cost.toLocaleString()} {currentAgency.currency}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 mt-4 border-t border-slate-100 flex gap-2">
                        <button 
                          onClick={() => { mockSupabase.updateTicketStatus(ticket.id, 'Résolu'); reloadData(); showToast("Ticket de maintenance résolu."); }}
                          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-center text-xs font-bold text-white transition-colors"
                        >
                          Marquer Résolu
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CRM PROSPECTS VIEW */}
          {activeMenu === 'crm' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-title text-2xl font-extrabold text-slate-900">CRM & Prospects</h1>
                  <p className="text-xs text-slate-500">Qualifiez et transformez vos demandes de location ou d'achat.</p>
                </div>
                <button
                  onClick={() => setLeadModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-slate-900/10"
                >
                  <Plus className="w-4 h-4" /> Qualifier Prospect
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden text-left">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold text-xs">
                        <th className="pb-3 font-semibold">Prospect</th>
                        <th className="pb-3 font-semibold">Téléphone</th>
                        <th className="pb-3 font-semibold">Projet immobilier</th>
                        <th className="pb-3 font-semibold">Étape</th>
                        <th className="pb-3 font-semibold text-right">Changer Étape</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {crmLeads.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400 text-xs italic">
                            Aucun prospect qualifié. Utilisez le bouton ci-dessus pour qualifier une nouvelle demande.
                          </td>
                        </tr>
                      ) : (
                        crmLeads.map(lead => (
                          <tr key={lead.id}>
                            <td className="py-4">
                              <span className="font-bold text-slate-900 block">{lead.first_name} {lead.last_name}</span>
                              <span className="text-xs text-slate-400 block">{lead.email}</span>
                            </td>
                            <td className="py-4 font-mono text-xs text-slate-700">{lead.phone}</td>
                            <td className="py-4 text-xs">
                              <span className="font-semibold text-slate-800 block">{lead.interest_type}</span>
                              <span className="text-[10px] text-slate-400 font-mono">Budget max : {lead.budget?.toLocaleString()} {currentAgency.currency}</span>
                            </td>
                            <td className="py-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                lead.status === 'Gagné' ? 'bg-emerald-100 text-emerald-600' :
                                lead.status === 'Proposition' ? 'bg-amber-100 text-amber-600' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => { mockSupabase.updateLeadStatus(lead.id, 'Proposition'); reloadData(); showToast("Prospect déplacé à l'étape Proposition."); }}
                                  className="px-2.5 py-1.5 rounded-lg border border-slate-250 text-xs font-semibold text-slate-650 hover:bg-slate-50"
                                >
                                  Proposition
                                </button>
                                <button
                                  onClick={() => { mockSupabase.updateLeadStatus(lead.id, 'Gagné'); reloadData(); showToast("Proposition acceptée ! Prospect marqué Gagné."); }}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold"
                                >
                                  Gagné
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* LOGEMENTS SOCIAUX (IVORY COAST ONLY) */}
          {activeMenu === 'social' && currentAgency.country === "Côte d'Ivoire" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-title text-2xl font-extrabold text-slate-900">Portail des Logements Sociaux</h1>
                <p className="text-xs text-slate-500">Spécificité Côte d'Ivoire 🇨🇮. Suivez les quotients sociaux et attribuez les villas résidentielles.</p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden text-left">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold text-xs">
                        <th className="pb-3 font-semibold">Bénéficiaire / CNI</th>
                        <th className="pb-3 font-semibold">Revenu mensuel</th>
                        <th className="pb-3 font-semibold">Famille</th>
                        <th className="pb-3 font-semibold">Statut éligibilité</th>
                        <th className="pb-3 font-semibold text-right">Attribution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {socialApps.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                            <div className="flex flex-col items-center justify-center gap-3 py-6">
                              <Building2 className="w-12 h-12 text-slate-350 animate-pulse" />
                              <span className="text-sm text-slate-500">Aucune demande de logement social enregistrée.</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        socialApps.map(app => (
                          <tr key={app.id}>
                            <td className="py-4">
                              <span className="font-bold text-slate-900 block">{app.beneficiary_first_name} {app.beneficiary_last_name}</span>
                              <span className="text-xs font-mono text-slate-400 block">CNI: {app.beneficiary_national_id}</span>
                            </td>
                            <td className="py-4 font-mono font-bold text-slate-700">
                              {app.monthly_income.toLocaleString()} FCFA
                            </td>
                            <td className="py-4 text-xs font-semibold text-slate-600">
                              {app.family_size} personnes
                            </td>
                            <td className="py-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                app.eligibility_status === 'Attribué' ? 'bg-emerald-100 text-emerald-600' :
                                app.eligibility_status === 'Éligible' ? 'bg-blue-100 text-blue-600' :
                                'bg-amber-100 text-amber-600'
                              }`}>
                                {app.eligibility_status}
                              </span>
                              {app.property && (
                                <span className="block text-[10px] text-slate-400 mt-1 font-semibold">
                                  {app.property.name}
                                </span>
                              )}
                            </td>
                            <td className="py-4 text-right">
                              {app.eligibility_status === 'Éligible' ? (
                                <button
                                  onClick={() => {
                                    // Trouver le premier bien social disponible (p1111114 ou autre disponible)
                                    mockSupabase.attributeSocialHousing(app.id, 'p1111114-1111-1111-1111-111111111114');
                                    reloadData();
                                    showToast("Logement attribué avec succès à la famille.");
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all"
                                >
                                  Attribuer Villa
                                </button>
                              ) : app.eligibility_status === 'Attribué' ? (
                                <span className="text-xs text-slate-400 italic">Logement finalisé</span>
                              ) : (
                                <span className="text-xs text-slate-400">En cours d'étude</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* RENDEZ-VOUS (APPOINTMENTS) VIEW */}
          {activeMenu === 'appointments' && (
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-title text-xl font-bold text-slate-900">Gestion des Rendez-vous</h1>
                  <p className="text-xs text-slate-400 mt-1">Consultez les demandes de visite de biens planifiées par le public sur la marketplace.</p>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <span className="block text-2xl font-bold font-mono text-slate-900">{appointments.length}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total RDV</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-2xl font-bold font-mono text-slate-900">
                      {appointments.filter(a => a.status === 'En attente').length}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">En attente</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-2xl font-bold font-mono text-slate-900">
                      {appointments.filter(a => a.status === 'Confirmé').length}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Confirmés</span>
                  </div>
                </div>
              </div>

              {/* Table of bookings */}
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">Liste des réservations de visite</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold text-xs">
                        <th className="pb-3 px-6 font-semibold">Client</th>
                        <th className="pb-3 font-semibold">Bien ciblé</th>
                        <th className="pb-3 font-semibold">Date & Heure</th>
                        <th className="pb-3 font-semibold">Statut</th>
                        <th className="pb-3 px-6 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {appointments.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-10 text-center text-xs text-slate-400">
                            Aucune réservation enregistrée pour cette agence.
                          </td>
                        </tr>
                      ) : (
                        appointments.map(appt => {
                          const targetProp = mockSupabase.getAllProperties().find(p => p.id === appt.property_id);
                          
                          return (
                            <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4 px-6">
                                <div>
                                  <span className="font-bold text-slate-900 block text-xs">{appt.client_name}</span>
                                  <span className="text-[10px] text-slate-400 block font-mono">{appt.client_phone}</span>
                                  <span className="text-[10px] text-slate-400 block font-mono">{appt.client_email}</span>
                                </div>
                              </td>
                              <td className="py-4 text-xs font-semibold text-slate-700">
                                {targetProp ? targetProp.name : 'Bien inconnu'}
                                <span className="block text-[10px] text-slate-400 font-normal">{targetProp?.city}, {targetProp?.country}</span>
                              </td>
                              <td className="py-4 font-mono text-xs text-slate-600">
                                <div>
                                  <span className="font-semibold text-slate-800">{appt.date}</span>
                                  <span className="block text-[10px] text-slate-400">Créneau : {appt.time}</span>
                                </div>
                              </td>
                              <td className="py-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  appt.status === 'Confirmé' ? 'bg-emerald-100 text-emerald-700' :
                                  appt.status === 'Annulé' ? 'bg-rose-100 text-rose-700' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {appt.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right space-x-1">
                                {appt.status === 'En attente' && (
                                  <button
                                    onClick={() => handleConfirmAppointment(appt.id)}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] cursor-pointer border-none transition-all"
                                  >
                                    Confirmer
                                  </button>
                                )}
                                {appt.status !== 'Annulé' && (
                                  <button
                                    onClick={() => handleCancelAppointment(appt.id)}
                                    className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold text-[10px] cursor-pointer transition-all"
                                  >
                                    Annuler
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    showToast(`Rappel WhatsApp de visite envoyé à ${appt.client_name} (${appt.client_phone}) pour le ${appt.date} à ${appt.time}.`);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] cursor-pointer border-none transition-all"
                                  title="Simuler rappel WhatsApp"
                                >
                                  Rappel
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PARAMÈTRES (SETTINGS) VIEW */}
          {activeMenu === 'settings' && (
            <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-left max-w-2xl">
              <h1 className="font-title text-xl font-bold text-slate-900 mb-6">Paramètres de l'Agence</h1>
              
              <div className="space-y-6 text-sm">
                <div>
                  <label className="text-xs text-slate-400 block mb-2 font-medium">Nom de l'Agence</label>
                  <input
                    type="text"
                    defaultValue={currentAgency.name}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-2 font-medium">Pays</label>
                    <input
                      type="text"
                      defaultValue={currentAgency.country}
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-2 font-medium">Devise monétaire</label>
                    <input
                      type="text"
                      defaultValue={currentAgency.currency}
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-2">
                  <h4 className="font-bold">Mode Multi-Tenant Actif</h4>
                  <p>Vos données sont strictement cloisonnées et stockées sur les serveurs locaux correspondants aux spécifications OHADA.</p>
                </div>

                <button 
                  onClick={() => showToast("Modifications de configuration enregistrées.")}
                  className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                >
                  Enregistrer les paramètres
                </button>
              </div>
            </div>
          )}

          {/* SAAS OWNER CONSOLE VIEW */}
          {activeMenu === 'saas' && userRole === 'super_admin' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-left">
                  <h1 className="font-title text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-amber-500" />
                    Console Propriétaire SaaS (Global)
                  </h1>
                  <p className="text-xs text-slate-500">Supervision globale d'IMMO360 AFRIQUE, gestion des multi-locataires, facturation et passerelles de reversement.</p>
                </div>
                <div className="flex items-center gap-2 self-start md:self-center">
                  <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-full text-xs font-bold font-mono">
                    Mode Super Admin Actif
                  </span>
                </div>
              </div>

              {/* SaaS Console Tabs Switcher */}
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 text-xs">
                {[
                  { id: 'overview', label: "Vue d'ensemble & KPIs" },
                  { id: 'agencies', label: "Gestion des Agences (Tenants)" },
                  { id: 'plans', label: "Tarifs & Codes Promo" },
                  { id: 'commissions', label: "Commissions & Loyers (2%)" },
                  { id: 'broadcast', label: "Alertes & Diffusion Globale" },
                  { id: 'infrastructure', label: "OHADA & Infrastructure" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSaasTab(tab.id as any)}
                    className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                      saasTab === tab.id 
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: OVERVIEW */}
              {saasTab === 'overview' && (
                <div className="space-y-6">
                  {/* KPIs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* KPI 1: MRR */}
                    <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden group text-left">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <DollarSign className="w-16 h-16 text-amber-500" />
                      </div>
                      <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block mb-2">Revenu Mensuel (MRR)</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-mono text-amber-500">
                          {agencies.reduce((acc, a) => {
                            if (a.status === 'Suspendu') return acc;
                            return acc + getDynamicPlanPrice(a.plan);
                          }, 0).toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-slate-400 font-mono">FCFA</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold mt-2 block">
                        ↑ 18.7% de croissance ce mois
                      </span>
                    </div>

                    {/* KPI 2: Total Agencies */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group text-left">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Building2 className="w-16 h-16 text-slate-900" />
                      </div>
                      <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block mb-2">Total Agences</span>
                      <div className="flex items-baseline gap-1 text-left">
                        <span className="text-3xl font-extrabold text-slate-900 font-mono">{agencies.length}</span>
                        <span className="text-xs font-bold text-slate-400 pl-1">locataires</span>
                      </div>
                      <div className="text-[9px] text-slate-455 mt-2 space-y-0.5 font-semibold">
                        <div>Actives : <span className="font-bold text-slate-700">{agencies.filter(a => a.status === 'Actif').length}</span> • Suspendues : <span className="font-bold text-slate-700">{agencies.filter(a => a.status === 'Suspendu').length}</span></div>
                        <div className="text-[8px] text-slate-400">Standard: {agencies.filter(a => a.plan === 'Standard').length} | Premium: {agencies.filter(a => a.plan === 'Premium').length} | VIP: {agencies.filter(a => a.plan === 'VIP').length}</div>
                      </div>
                    </div>

                    {/* KPI 3: Avg Subscription */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group text-left">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <CreditCard className="w-16 h-16 text-slate-900" />
                      </div>
                      <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block mb-2">Abonnement Moyen</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900 font-mono">
                          {Math.round(
                            agencies.reduce((acc, a) => {
                              if (a.status === 'Suspendu') return acc;
                              return acc + getDynamicPlanPrice(a.plan);
                            }, 0) / (agencies.filter(a => a.status === 'Actif').length || 1)
                          ).toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-slate-400 font-mono">FCFA/mois</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-2 block">
                        Basé sur les abonnements actifs
                      </span>
                    </div>

                    {/* KPI 4: Platform properties */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group text-left">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Layers className="w-16 h-16 text-slate-900" />
                      </div>
                      <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block mb-2">Logements Platform-wide</span>
                      <div className="flex items-baseline gap-1 text-left">
                        <span className="text-3xl font-extrabold text-slate-900 font-mono text-slate-900">42</span>
                        <span className="text-xs font-bold text-slate-400 pl-1">biens gérés</span>
                      </div>
                      <span className="text-[10px] text-amber-500 font-semibold mt-2 block">
                        ✓ Données cloisonnées conformes OHADA
                      </span>
                    </div>
                  </div>

                  {/* SVG MRR Chart and Pénétration Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                    {/* Evolution Graph Card */}
                    <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-title text-base font-bold text-slate-900">Évolution des revenus (MRR) & Inscriptions</h3>
                          <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">6 DERNIERS MOIS</span>
                        </div>
                        {/* SVG Chart */}
                        <div className="w-full h-48 bg-slate-50 rounded-2xl p-4 border border-slate-100 relative">
                          <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2"/>
                                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0"/>
                              </linearGradient>
                            </defs>
                            {/* Grid lines */}
                            <line x1="0" y1="30" x2="500" y2="30" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="4" />
                            <line x1="0" y1="70" x2="500" y2="70" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="4" />
                            <line x1="0" y1="110" x2="500" y2="110" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="4" />
                            
                            {/* Area */}
                            <path d="M 10 140 L 90 110 L 170 95 L 250 85 L 330 60 L 410 45 L 490 20 L 490 140 Z" fill="url(#chartGrad)" />
                            
                            {/* Line path */}
                            <path d="M 10 140 L 90 110 L 170 95 L 250 85 L 330 60 L 410 45 L 490 20" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                            
                            {/* Points */}
                            <circle cx="10" cy="140" r="4" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
                            <circle cx="90" cy="110" r="4" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
                            <circle cx="170" cy="95" r="4" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
                            <circle cx="250" cy="85" r="4" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
                            <circle cx="330" cy="60" r="4" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
                            <circle cx="410" cy="45" r="4" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
                            <circle cx="490" cy="20" r="4" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
                          </svg>
                          <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-2 px-1">
                            <span>Janv</span>
                            <span>Févr</span>
                            <span>Mars</span>
                            <span>Avril</span>
                            <span>Mai</span>
                            <span>Juin</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs font-semibold text-slate-650 mt-4 border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                          <span>MRR (FCFA)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
                          <span>Inscriptions (+42% ce semestre)</span>
                        </div>
                      </div>
                    </div>

                    {/* Regional Stats Card */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-left flex flex-col justify-between">
                      <div>
                        <h3 className="font-title text-base font-bold text-slate-900 mb-4">Pénétration Régionale</h3>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-800">Côte d'Ivoire 🇨🇮</span>
                              <span className="text-slate-500 font-mono">3 Agences (55%)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-amber-500 h-full rounded-full" style={{ width: '55%' }} />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-800">Sénégal 🇸🇳</span>
                              <span className="text-slate-500 font-mono">2 Agences (35%)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-slate-900 h-full rounded-full" style={{ width: '35%' }} />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-800">Cameroun 🇨🇲</span>
                              <span className="text-slate-500 font-mono">1 Agence (10%)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-slate-500 h-full rounded-full" style={{ width: '10%' }} />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-800">Bénin 🇧🇯</span>
                              <span className="text-slate-500 font-mono">1 Agence (8%)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-slate-400 h-full rounded-full" style={{ width: '8%' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-3 mt-4">
                        Expansion prévue : Gabon 🇬🇦 et Mali 🇲🇱 en Q4 2026.
                      </div>
                    </div>
                  </div>

                  {/* SUB TAB DETAILS: SUBSCRIPTION LISTS & SPLIT STATS */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left animate-fadeIn">
                    {/* Compact Tenants List */}
                    <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-left">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-title text-base font-bold text-slate-900">Résumé des Abonnements par Agence</h3>
                        <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">TEMPS RÉEL</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-400 font-bold">
                              <th className="pb-2 text-left">Nom de l'Agence</th>
                              <th className="pb-2 text-left">Pays / Région</th>
                              <th className="pb-2 text-left">Plan Actif</th>
                              <th className="pb-2 text-left">Statut</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                            {agencies.map(agency => (
                              <tr key={agency.id} className="hover:bg-slate-50 transition-colors">
                                <td className="py-2.5 font-bold text-slate-900">{agency.name}</td>
                                <td className="py-2.5 text-slate-500">{agency.country}</td>
                                <td className="py-2.5">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                                    agency.plan === 'VIP' ? 'bg-purple-100 text-purple-700' :
                                    agency.plan === 'Premium' ? 'bg-amber-100 text-amber-700' :
                                    'bg-slate-100 text-slate-700'
                                  }`}>
                                    {agency.plan || 'Standard'}
                                  </span>
                                </td>
                                <td className="py-2.5">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                    agency.status === 'Suspendu' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                                  }`}>
                                    {agency.status || 'Actif'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Subscription statistics */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div>
                        <h3 className="font-title text-base font-bold text-slate-900 mb-4">Répartition des Revenus</h3>
                        <div className="space-y-3 text-xs">
                          <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="font-bold text-slate-700">Plans VIP ({getDynamicPlanPrice('VIP').toLocaleString()} F)</span>
                            <span className="font-mono text-purple-700 font-bold">
                              {(agencies.filter(a => a.plan === 'VIP' && a.status !== 'Suspendu').length * getDynamicPlanPrice('VIP')).toLocaleString()} F
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="font-bold text-slate-700">Plans Premium ({getDynamicPlanPrice('Premium').toLocaleString()} F)</span>
                            <span className="font-mono text-amber-600 font-bold">
                              {(agencies.filter(a => a.plan === 'Premium' && a.status !== 'Suspendu').length * getDynamicPlanPrice('Premium')).toLocaleString()} F
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="font-bold text-slate-700">Plans Standard ({getDynamicPlanPrice('Standard').toLocaleString()} F)</span>
                            <span className="font-mono text-slate-600 font-bold">
                              {(agencies.filter(a => a.plan === 'Standard' && a.status !== 'Suspendu').length * getDynamicPlanPrice('Standard')).toLocaleString()} F
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-4 border-t border-slate-100 pt-3">
                        Revenu récurrent annuel (ARR) estimé : <span className="font-bold font-mono text-slate-750">
                          {(agencies.reduce((acc, a) => {
                            if (a.status === 'Suspendu') return acc;
                            return acc + getDynamicPlanPrice(a.plan);
                          }, 0) * 12).toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* System activity logs & gateways */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                    <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                      <h3 className="font-title text-base font-bold text-slate-900 mb-4">Activités Récentes de la Plateforme</h3>
                      <div className="space-y-3 font-mono text-[11px] text-slate-650">
                        <div className="p-3 bg-slate-50 rounded-2xl flex items-start gap-3 border border-slate-100">
                          <span className="text-emerald-500 font-bold">12:42</span>
                          <div>
                            <span className="text-slate-800 block font-semibold">💸 Orange Money Payout envoyé</span>
                            <span className="block text-slate-500">Reversement automatique de 1 350 000 FCFA envoyé à Amadou Koné (Babi Immo S.A.). ID Trans: OM-PAY-88210. Status: Réussi.</span>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl flex items-start gap-3 border border-slate-100">
                          <span className="text-amber-500 font-bold">11:15</span>
                          <div>
                            <span className="text-slate-800 block font-semibold">🏢 Nouveau Tenant Enregistré</span>
                            <span className="block text-slate-500">Agence 'Sahel Immo Dakar' (Sénégal) créée avec succès sur le plan Standard. Base de données cloisonnée allouée.</span>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl flex items-start gap-3 border border-slate-100">
                          <span className="text-indigo-500 font-bold">09:30</span>
                          <div>
                            <span className="text-slate-800 block font-semibold">⚡ Plan Abonnement Modifié</span>
                            <span className="block text-slate-500">Teranga Agence Luxe est passée au plan VIP (50 000 FCFA/mois). Limite de biens débloquée (illimitée).</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div>
                        <h3 className="font-title text-base font-bold text-slate-900 mb-4">Passerelles de Paiement</h3>
                        <div className="space-y-3 text-xs">
                          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="font-bold text-slate-850">Orange Money API</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold">Actif</span>
                          </div>
                          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="font-bold text-slate-850">Wave Payout API</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold">Actif</span>
                          </div>
                          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="font-bold text-slate-850">MTN MoMo Payout</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold">Actif</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-4 border-t border-slate-100 pt-3">
                        Total Payouts traités : <span className="font-bold font-mono">14.8M FCFA</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: AGENCIES */}
              {saasTab === 'agencies' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                  {/* Table of agencies */}
                  <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-left">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-title text-base font-bold text-slate-900">Locataires Multi-Tenants Enregistrées</h3>
                      <span className="text-[10px] text-slate-400 font-semibold font-mono uppercase">Total : {agencies.length}</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 font-bold text-xs">
                            <th className="pb-3 font-semibold text-left">Agence</th>
                            <th className="pb-3 font-semibold text-left">Région</th>
                            <th className="pb-3 font-semibold text-left">Abonnement</th>
                            <th className="pb-3 font-semibold text-left">Statut</th>
                            <th className="pb-3 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {agencies.map(agency => {
                            const isExpanded = expandedAgencyId === agency.id;
                            return (
                              <React.Fragment key={agency.id}>
                                <tr className="hover:bg-slate-50 transition-colors">
                                  <td className="py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-500 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-800">
                                        {agency.name.substring(0, 2).toUpperCase()}
                                      </div>
                                      <div>
                                        <span className="font-bold text-slate-900 block text-xs">{agency.name}</span>
                                        <span className="text-[10px] text-slate-400 block">{agency.email}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-4 text-xs font-semibold text-slate-700">
                                    {agency.country} 🇨🇮
                                    <span className="text-[9px] font-mono text-slate-400 block font-normal">{agency.currency}</span>
                                  </td>
                                  <td className="py-4">
                                    <select
                                      value={agency.plan || 'Standard'}
                                      onChange={(e) => updateAgencyPlan(agency.id, e.target.value as Agency['plan'])}
                                      className="bg-slate-100 hover:bg-slate-200 border-0 rounded-xl px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                                    >
                                      <option value="Standard">Standard ({getDynamicPlanPrice('Standard').toLocaleString()} F)</option>
                                      <option value="Premium">Premium ({getDynamicPlanPrice('Premium').toLocaleString()} F)</option>
                                      <option value="VIP">VIP ({getDynamicPlanPrice('VIP').toLocaleString()} F)</option>
                                    </select>
                                  </td>
                                  <td className="py-4">
                                    <button
                                      onClick={() => toggleAgencyStatus(agency.id, agency.status)}
                                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                        agency.status === 'Suspendu' 
                                          ? 'bg-rose-100 text-rose-700 font-bold' 
                                          : 'bg-emerald-100 text-emerald-700 font-bold'
                                      }`}
                                    >
                                      {agency.status || 'Actif'}
                                    </button>
                                  </td>
                                  <td className="py-4 text-right">
                                    <button
                                      onClick={() => setExpandedAgencyId(isExpanded ? null : agency.id)}
                                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] cursor-pointer mr-1.5"
                                    >
                                      {isExpanded ? "Masquer" : "Détails"}
                                    </button>
                                    <button
                                      onClick={() => changeAgency(agency.id)}
                                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] cursor-pointer mr-1.5"
                                    >
                                      Incarner
                                    </button>
                                    <button
                                      onClick={() => handleDeleteAgency(agency.id)}
                                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold text-[10px] cursor-pointer transition-all"
                                    >
                                      Supprimer
                                    </button>
                                  </td>
                                </tr>
                                {isExpanded && (() => {
                                  const adminProfile = mockSupabase.getProfiles().find(p => p.agency_id === agency.id && p.role === 'agency_admin') || 
                                                       mockSupabase.getProfiles().find(p => p.agency_id === agency.id);
                                  const stats = globalAgenciesStats[agency.id] || { properties: 0, leases: 0, tenants: 0 };
                                  const createdDate = agency.created_at ? new Date(agency.created_at).toLocaleDateString() : 'N/A';
                                  const trialEndsDate = agency.trial_ends_at ? new Date(agency.trial_ends_at).toLocaleDateString() : 'N/A';
                                  const trialDaysLeft = agency.trial_ends_at 
                                    ? Math.max(0, Math.ceil((new Date(agency.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                                    : 0;

                                  return (
                                    <tr className="bg-slate-50/50">
                                      <td colSpan={5} className="p-4 border-t border-slate-100">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                          {/* Admin Info */}
                                          <div className="bg-white p-3 rounded-2xl border border-slate-200">
                                            <span className="font-bold text-slate-900 block mb-2 text-[10px] uppercase tracking-wider text-amber-500">Contact Administrateur</span>
                                            <div className="space-y-1">
                                              <p><span className="text-slate-400">Nom :</span> <span className="font-semibold text-slate-800">{adminProfile ? `${adminProfile.first_name} ${adminProfile.last_name}` : 'N/A'}</span></p>
                                              <p><span className="text-slate-400">Tél :</span> <span className="font-semibold text-slate-800 font-mono">{adminProfile?.phone || agency.phone || 'N/A'}</span></p>
                                              <p><span className="text-slate-400">Email :</span> <span className="font-semibold text-slate-800 font-mono">{adminProfile?.email || agency.email || 'N/A'}</span></p>
                                            </div>
                                          </div>

                                          {/* Agency Settings */}
                                          <div className="bg-white p-3 rounded-2xl border border-slate-200">
                                            <span className="font-bold text-slate-900 block mb-2 text-[10px] uppercase tracking-wider text-amber-500">Détails & Abonnement</span>
                                            <div className="space-y-1">
                                              <p><span className="text-slate-400">Adresse :</span> <span className="font-semibold text-slate-850">{agency.address || 'N/A'}</span></p>
                                              <p><span className="text-slate-400">Créé le :</span> <span className="font-semibold text-slate-850 font-mono">{createdDate}</span></p>
                                              <p>
                                                <span className="text-slate-400">Fin d'essai :</span>{' '}
                                                <span className="font-semibold text-slate-850 font-mono">{trialEndsDate}</span>
                                                {trialDaysLeft > 0 ? (
                                                  <span className="ml-1.5 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] rounded-md font-bold">({trialDaysLeft}j restants)</span>
                                                ) : (
                                                  <span className="ml-1.5 px-1.5 py-0.5 bg-rose-50 text-rose-700 text-[9px] rounded-md font-bold">(Expirée)</span>
                                                )}
                                              </p>
                                            </div>
                                          </div>

                                          {/* Live Stats */}
                                          <div className="bg-white p-3 rounded-2xl border border-slate-200">
                                            <span className="font-bold text-slate-900 block mb-2 text-[10px] uppercase tracking-wider text-amber-500">Statistiques d'Activité</span>
                                            <div className="grid grid-cols-3 gap-2 text-center">
                                              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                                <span className="block text-lg font-bold font-mono text-slate-800">{stats.properties}</span>
                                                <span className="text-[9px] text-slate-400 font-semibold block uppercase">Biens</span>
                                              </div>
                                              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                                <span className="block text-lg font-bold font-mono text-slate-800">{stats.leases}</span>
                                                <span className="text-[9px] text-slate-400 font-semibold block uppercase">Baux</span>
                                              </div>
                                              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                                <span className="block text-lg font-bold font-mono text-slate-800">{stats.tenants}</span>
                                                <span className="text-[9px] text-slate-400 font-semibold block uppercase">Locataires</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })()}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Create Tenant Form */}
                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-left h-fit">
                    <h3 className="font-title text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-amber-500" />
                      Créer une Agence
                    </h3>
                    <form onSubmit={handleAddAgencySubmit} className="space-y-4 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-bold">Nom de l'agence *</label>
                        <input
                          type="text"
                          required
                          value={newAgency.name}
                          onChange={(e) => setNewAgency({...newAgency, name: e.target.value})}
                          placeholder="Sahel Immo Dakar"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-bold">Pays</label>
                          <select
                            value={newAgency.country}
                            onChange={(e) => {
                              const country = e.target.value;
                              const currency = country === "Sénégal" || country === "Côte d'Ivoire" || country === "Bénin" || country === "Togo" || country === "Burkina Faso" ? 'FCFA' : 'EUR';
                              setNewAgency({...newAgency, country, currency});
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-900 focus:outline-none cursor-pointer"
                          >
                            <option value="Côte d'Ivoire">Côte d'Ivoire 🇨🇮</option>
                            <option value="Sénégal">Sénégal 🇸🇳</option>
                            <option value="Cameroun">Cameroun 🇨🇲</option>
                            <option value="Bénin">Bénin 🇧🇯</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-bold">Devise</label>
                          <input type="text" disabled value={newAgency.currency} className="w-full bg-slate-100 border border-slate-250 rounded-xl px-2 py-2 text-slate-500 font-mono" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-bold">Email professionnel *</label>
                        <input
                          type="email"
                          required
                          value={newAgency.email}
                          onChange={(e) => setNewAgency({...newAgency, email: e.target.value})}
                          placeholder="admin@sahelimmo.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                        />
                      </div>
                      <button type="submit" className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl mt-2 transition-colors cursor-pointer">
                        Créer le Tenant Agence
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 3: COMMISSIONS & REVERSEMENTS (2% PLATFORM LEDGER & 10% SALES) */}
              {saasTab === 'commissions' && (
                <div className="space-y-6 text-left animate-fadeIn">
                  {(() => {
                    const totalRentCommissions = payments.filter(p => p.status === 'Payé').reduce((acc, p) => acc + p.amount, 0) * 0.02;
                    const totalSalesCommissions = sales.reduce((acc, s) => acc + s.commission_amount, 0);
                    const totalCommissions = totalRentCommissions + totalSalesCommissions;

                    const totalRentPayouts = payments.filter(p => p.status === 'Payé').reduce((acc, p) => acc + p.amount, 0) * 0.98;
                    const totalSalesPayouts = sales.reduce((acc, s) => acc + s.net_owner_amount, 0);
                    const totalPayouts = totalRentPayouts + totalSalesPayouts;

                    const pendingRentPayouts = payments.filter(p => p.status !== 'Payé').reduce((acc, p) => acc + p.amount, 0) * 0.98;

                    const commissionsHistory = [
                      ...payments.filter(p => p.status === 'Payé').map(p => ({
                        id: p.id,
                        type: 'Location (2%)',
                        label: `${p.lease.tenant.first_name} ${p.lease.tenant.last_name}`,
                        sublabel: `${p.lease.property.name} - ${p.lease.property.city}`,
                        total: p.amount,
                        commission: p.amount * 0.02,
                        net: p.amount * 0.98,
                        status: 'Reversé (Wave/OM API)',
                        date: p.payment_date ? new Date(p.payment_date).toLocaleDateString() : 'N/A'
                      })),
                      ...sales.map(s => ({
                        id: s.id,
                        type: 'Vente (10%)',
                        label: `Acheteur: ${s.buyer_name}`,
                        sublabel: `${s.property.name} - ${s.property.city}`,
                        total: s.sale_price,
                        commission: s.commission_amount,
                        net: s.net_owner_amount,
                        status: 'Reversé (Wave/OM API)',
                        date: new Date(s.created_at).toLocaleDateString()
                      }))
                    ];

                    return (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                            <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block mb-1">Commissions Collectées</span>
                            <div className="text-2xl font-bold font-mono text-slate-900">
                              {totalCommissions.toLocaleString()} FCFA
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-1">2% sur loyers payés + 10% sur ventes finalisées</span>
                          </div>
                          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                            <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block mb-1">Reversements Effectués</span>
                            <div className="text-2xl font-bold font-mono text-emerald-600">
                              {totalPayouts.toLocaleString()} FCFA
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-1">Transférés automatiquement aux propriétaires (98% / 90%)</span>
                          </div>
                          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div>
                              <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block mb-1">Reversements en attente</span>
                              <div className="text-2xl font-bold font-mono text-amber-500">
                                {pendingRentPayouts.toLocaleString()} FCFA
                              </div>
                            </div>
                            <button 
                              onClick={() => showToast("Reversements Wave/Orange Money déclenchés avec succès.")}
                              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs mt-3 transition-colors cursor-pointer text-center"
                            >
                              Exécuter les reversements
                            </button>
                          </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                          <h3 className="font-title text-base font-bold text-slate-900 mb-4">Livre des Commissions & Reversements (Consolidé)</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-slate-200 text-slate-400 font-bold text-xs">
                                  <th className="pb-3 font-semibold text-left">Bénéficiaire / Transaction</th>
                                  <th className="pb-3 font-semibold text-left">Type</th>
                                  <th className="pb-3 font-semibold text-left">Volume Total</th>
                                  <th className="pb-3 font-semibold text-left">Commission</th>
                                  <th className="pb-3 font-semibold text-left">Net Reversé</th>
                                  <th className="pb-3 font-semibold text-left">Statut</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {commissionsHistory.map(row => (
                                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3.5 text-left">
                                      <span className="font-bold text-slate-900 block text-xs">
                                        {row.label}
                                      </span>
                                      <span className="text-[10px] text-slate-400 block">
                                        {row.sublabel}
                                      </span>
                                    </td>
                                    <td className="py-3.5 text-left text-xs font-semibold text-slate-600">
                                      {row.type}
                                    </td>
                                    <td className="py-3.5 text-left text-xs font-mono font-bold text-slate-700">
                                      {row.total.toLocaleString()} FCFA
                                    </td>
                                    <td className="py-3.5 text-left text-xs font-mono text-amber-600 font-bold">
                                      {row.commission.toLocaleString()} FCFA
                                    </td>
                                    <td className="py-3.5 text-left text-xs font-mono text-emerald-600 font-bold">
                                      {row.net.toLocaleString()} FCFA
                                    </td>
                                    <td className="py-3.5 text-left">
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                                        {row.status}
                                      </span>
                                      <span className="text-[10px] text-slate-400 block mt-1">{row.date}</span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* TAB 4: ALERTES & DIFFUSION GLOBALE (BROADCAST) */}
              {saasTab === 'broadcast' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left animate-fadeIn">
                  <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-left">
                    <h3 className="font-title text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Send className="w-5 h-5 text-amber-500" />
                      Publier un Flash Info / Alerte Globale
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1 font-bold">Message à diffuser *</label>
                        <textarea
                          rows={3}
                          value={broadcastMessage}
                          onChange={(e) => setBroadcastMessage(e.target.value)}
                          placeholder="Saisissez le message d'alerte pour toutes les agences..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none text-xs"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-400 block mb-1 font-bold">Niveau d'Urgence</label>
                          <select
                            value={broadcastLevel}
                            onChange={(e) => setBroadcastLevel(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-900 focus:outline-none cursor-pointer text-xs"
                          >
                            <option value="info">ℹ️ Information (Bleu)</option>
                            <option value="warning">⚠️ Avertissement (Orange)</option>
                            <option value="error">🚨 Critique / Danger (Rouge)</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2 mt-5">
                          <input
                            type="checkbox"
                            id="broadcastActiveCheckbox"
                            checked={broadcastActive}
                            onChange={(e) => setBroadcastActive(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 accent-slate-900 cursor-pointer"
                          />
                          <label htmlFor="broadcastActiveCheckbox" className="text-xs font-bold text-slate-700 cursor-pointer">
                            Activer la diffusion
                          </label>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setBroadcastDismissed(false);
                          showToast("L'alerte globale a été mise à jour et publiée !");
                        }}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl mt-2 transition-colors cursor-pointer text-xs"
                      >
                        Mettre à jour & Diffuser l'annonce
                      </button>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-left h-fit space-y-4">
                    <h3 className="font-title text-base font-bold text-slate-900">Aperçu pour l'utilisateur</h3>
                    <div className="p-4 rounded-2xl bg-slate-50 text-[10px] space-y-2 border border-slate-200">
                      <span className="font-mono text-slate-400 block uppercase font-bold">Bannière en haut du dashboard :</span>
                      {broadcastActive && broadcastMessage && (
                        <div className={`p-3 rounded-xl border text-[11px] font-medium ${
                          broadcastLevel === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
                          broadcastLevel === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                          'bg-sky-50 border-sky-200 text-sky-800'
                        }`}>
                          {broadcastMessage}
                        </div>
                      )}
                      {!broadcastActive && (
                        <span className="text-slate-400 italic block">Aucune alerte active actuellement.</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: OHADA & INFRASTRUCTURE */}
              {saasTab === 'infrastructure' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left animate-fadeIn">
                  <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-left space-y-6">
                    <h3 className="font-title text-base font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-amber-500" />
                      Statut de la Réplication Multi-Régionale (Conformité OHADA)
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-slate-800">Dakar Cloud (Réplique 🇸🇳)</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold text-[9px]">Principal</span>
                        </div>
                        <div className="space-y-1 text-slate-500 font-semibold text-[10px]">
                          <div>Statut : <span className="text-emerald-600">En ligne 🟢</span></div>
                          <div>Temps de latence : <span className="font-mono">12 ms</span></div>
                          <div>Version DB : <span className="font-mono">Supabase PG-15.4</span></div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-slate-800">Abidjan Cloud (Réplique 🇨🇮)</span>
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-bold text-[9px]">Réplica chaud</span>
                        </div>
                        <div className="space-y-1 text-slate-500 font-semibold text-[10px]">
                          <div>Statut : <span className="text-emerald-600">En ligne 🟢</span></div>
                          <div>Désynchronisation : <span className="font-mono">0.02s</span></div>
                          <div>Latence réseau : <span className="font-mono">18 ms</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <h4 className="font-bold text-xs text-slate-900 mb-2">Historique d'audit de sécurité des données</h4>
                      <div className="space-y-2 text-[11px] font-semibold text-slate-600">
                        <div className="flex justify-between p-2 bg-white rounded-lg border border-slate-100">
                          <span>RLS (Row Level Security) - Cloisonnement</span>
                          <span className="text-emerald-600 font-bold">100% Conforme</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white rounded-lg border border-slate-100">
                          <span>Chiffrement AES-256 en transit/repos</span>
                          <span className="text-emerald-600 font-bold">Actif</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white rounded-lg border border-slate-100">
                          <span>Localisation physique des serveurs (Espace OHADA)</span>
                          <span className="text-emerald-600 font-bold">Conforme</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-left h-fit space-y-4">
                    <h3 className="font-title text-base font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-amber-500" />
                      OHADA Compliance
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      L'Acte Uniforme OHADA portant sur le droit commercial général impose que les données financières des entreprises de l'espace OHADA soient hébergées conformément aux réglementations de souveraineté des données régionales. IMMO360 réplique ses données exclusivement au Sénégal et en Côte d'Ivoire.
                    </p>
                    <div className="text-[10px] text-slate-400 font-semibold">
                      Dernière vérification automatique : <span className="font-mono text-slate-600">il y a 5 min</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: PLAN PRICES & DISCOUNT COUPONS */}
              {saasTab === 'plans' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left animate-fadeIn">
                  {/* Plan Prices Configurations */}
                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-left">
                    <h3 className="font-title text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-amber-500" />
                      Configuration des Tarifs & Essai
                    </h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      mockSupabase.updateSaaSPlanSettings(saasPlansSettings);
                      reloadData();
                      showToast("Configurations des plans mises à jour avec succès.");
                    }} className="space-y-4 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-bold">Tarif Mensuel Plan Standard (FCFA)</label>
                        <input
                          type="number"
                          required
                          value={saasPlansSettings.standard_price}
                          onChange={(e) => setSaasPlansSettings({...saasPlansSettings, standard_price: parseInt(e.target.value) || 0})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none font-mono font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-bold">Tarif Mensuel Plan Premium (FCFA)</label>
                        <input
                          type="number"
                          required
                          value={saasPlansSettings.premium_price}
                          onChange={(e) => setSaasPlansSettings({...saasPlansSettings, premium_price: parseInt(e.target.value) || 0})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none font-mono font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-bold">Tarif Mensuel Plan VIP (FCFA)</label>
                        <input
                          type="number"
                          required
                          value={saasPlansSettings.vip_price}
                          onChange={(e) => setSaasPlansSettings({...saasPlansSettings, vip_price: parseInt(e.target.value) || 0})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none font-mono font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-bold">Période d'essai par défaut (Jours)</label>
                        <input
                          type="number"
                          required
                          value={saasPlansSettings.trial_days}
                          onChange={(e) => setSaasPlansSettings({...saasPlansSettings, trial_days: parseInt(e.target.value) || 0})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none font-mono font-bold text-xs"
                        />
                      </div>
                      <button type="submit" className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl mt-2 transition-colors cursor-pointer border-none">
                        Mettre à jour les configurations
                      </button>
                    </form>
                  </div>

                  {/* Coupons Management Table */}
                  <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-left">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-title text-base font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        Gestion des Bons de Réduction
                      </h3>
                      <span className="text-[10px] text-slate-400 font-semibold font-mono uppercase">Actifs : {saasCoupons.length}</span>
                    </div>

                    {/* Add Coupon Form */}
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!newCouponCode.trim()) return;
                      mockSupabase.addDiscountCoupon({
                        code: newCouponCode.trim().toUpperCase(),
                        discount_type: newCouponType,
                        value: newCouponValue,
                        status: 'Actif'
                      });
                      setNewCouponCode('');
                      setNewCouponValue(10);
                      reloadData();
                      showToast("Bon de réduction créé avec succès.");
                    }} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                      <div>
                        <label className="text-[9px] text-slate-400 font-bold block mb-1 uppercase">Code Promo</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: SPECIAL50"
                          value={newCouponCode}
                          onChange={(e) => setNewCouponCode(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none font-mono uppercase font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-bold block mb-1 uppercase">Type</label>
                        <select
                          value={newCouponType}
                          onChange={(e) => setNewCouponType(e.target.value as any)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-slate-900 focus:outline-none cursor-pointer"
                        >
                          <option value="percent">Pourcentage (%)</option>
                          <option value="fixed">Montant Fixe (FCFA)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-405 font-bold block mb-1 uppercase">Valeur</label>
                        <input
                          type="number"
                          required
                          value={newCouponValue}
                          onChange={(e) => setNewCouponValue(parseInt(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none font-mono font-bold"
                        />
                      </div>
                      <div className="flex items-end">
                        <button type="submit" className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer border-none">
                          Ajouter le Bon
                        </button>
                      </div>
                    </form>

                    {/* Coupons List */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 font-bold text-xs">
                            <th className="pb-3 font-semibold text-left">Code</th>
                            <th className="pb-3 font-semibold text-left">Type de Remise</th>
                            <th className="pb-3 font-semibold text-left">Valeur</th>
                            <th className="pb-3 font-semibold text-left">Statut</th>
                            <th className="pb-3 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {saasCoupons.map(coupon => (
                            <tr key={coupon.id} className="hover:bg-slate-55 transition-colors">
                              <td className="py-3 font-mono font-bold text-slate-900">{coupon.code}</td>
                              <td className="py-3 text-xs text-slate-500">
                                {coupon.discount_type === 'percent' ? 'Pourcentage (%)' : 'Montant Fixe (FCFA)'}
                              </td>
                              <td className="py-3 font-mono font-bold text-slate-700">
                                {coupon.discount_type === 'percent' ? `${coupon.value}%` : `${coupon.value.toLocaleString()} FCFA`}
                              </td>
                              <td className="py-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    mockSupabase.toggleCouponStatus(coupon.id);
                                    reloadData();
                                    showToast(`Statut du coupon ${coupon.code} modifié.`);
                                  }}
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold cursor-pointer border-none ${
                                    coupon.status === 'Actif' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                  }`}
                                >
                                  {coupon.status}
                                </button>
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => {
                                    mockSupabase.deleteDiscountCoupon(coupon.id);
                                    reloadData();
                                    showToast("Bon de réduction supprimé.");
                                  }}
                                  className="px-2 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-[10px] font-bold cursor-pointer border-none"
                                >
                                  Supprimer
                                </button>
                              </td>
                            </tr>
                          ))}
                          {saasCoupons.length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                                Aucun bon de réduction configuré.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* SUPPORT & CONTACT VIEW */}
          {activeMenu === 'contact' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left animate-fadeIn">
              <div className="lg:col-span-2 p-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-left">
                <h1 className="font-title text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-amber-500" />
                  Support Client & Contact Technique
                </h1>
                <p className="text-xs text-slate-500 mb-6">
                  Une question, un bug ou une suggestion ? Remplissez ce formulaire et notre équipe technique vous répondra dans les plus brefs délais.
                </p>

                {supportSuccess ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs space-y-2 animate-scaleIn">
                    <h4 className="font-bold text-sm">Ticket support créé avec succès !</h4>
                    <p>Votre demande a été enregistrée avec la référence <span className="font-bold font-mono text-slate-700">#SUP-28391</span>. Notre équipe technique ou votre conseiller dédié vous répondra sous 15 minutes.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSupportSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-bold uppercase">Sujet de votre demande *</label>
                      <select
                        value={supportSubject}
                        onChange={(e) => setSupportSubject(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none cursor-pointer"
                      >
                        <option value="Assistance Technique">🛠️ Assistance Technique / Bug</option>
                        <option value="Facturation & Abonnements">💳 Facturation & Abonnements</option>
                        <option value="Suggestion de Fonctionnalité">💡 Suggestion de Fonctionnalité</option>
                        <option value="Autre">🙋 Autre question</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-bold uppercase">Description détaillée *</label>
                      <textarea
                        required
                        rows={5}
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        placeholder="Décrivez votre besoin avec précision (ex: numéro de contrat, message d'erreur...)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-bold uppercase">Téléphone de contact</label>
                        <input
                          type="text"
                          value={supportPhone}
                          onChange={(e) => setSupportPhone(e.target.value)}
                          placeholder="+225 07 ..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-bold uppercase">E-mail de contact</label>
                        <input
                          type="email"
                          value={supportEmail}
                          onChange={(e) => setSupportEmail(e.target.value)}
                          className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-500 font-medium"
                          disabled
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={supportLoading}
                      className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      {supportLoading ? (
                        <>Envoi en cours...</>
                      ) : (
                        <>
                          Envoyer ma demande <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm text-left space-y-4">
                  <h3 className="font-title text-base font-bold text-slate-900">Assistance Directe</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Vous préférez discuter directement avec un conseiller ? Utilisez nos canaux directs pour une assistance immédiate.
                  </p>
                  <div className="space-y-3 text-xs">
                    <a 
                      href="https://wa.me/2250789898989" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-3 p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-800 rounded-2xl font-bold transition-all cursor-pointer"
                    >
                      <Smartphone className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <span className="block text-slate-800 font-bold">WhatsApp Direct</span>
                        <span className="text-[10px] text-emerald-600 font-mono">+225 07 89 89 89 89</span>
                      </div>
                    </a>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 text-slate-700 rounded-2xl">
                      <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                      <div>
                        <span className="block text-slate-800 font-bold">Disponibilité</span>
                        <span className="text-[10px] text-slate-500">7j/7, de 08:00 à 21:00 GMT</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl text-left relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-16 h-16 text-amber-500" />
                  </div>
                  <h3 className="font-title text-base font-bold text-white mb-2">Garantie de service (SLA)</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    En tant qu'abonné <span className="text-amber-500 font-bold">{currentAgency.plan || 'Standard'}</span>, vous bénéficiez d'une assistance prioritaire. Les tickets d'assistance technique ou de facturation sont résolus sous un délai contractuel de 2 heures maximum.
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL 1: CAISSE MOBILE MONEY ENCAISSEMENT */}
      <AnimatePresence>
        {payModalOpen && activePaymentToPay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setPayModalOpen(false)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-md w-full relative z-10 text-left"
            >
              <h3 className="font-title text-lg font-bold text-slate-900 mb-2">Percevoir le Loyer</h3>
              <p className="text-xs text-slate-400 mb-6">
                Enregistrez le paiement du loyer de <span className="font-bold text-slate-700">{activePaymentToPay.lease.tenant.first_name} {activePaymentToPay.lease.tenant.last_name}</span>.
              </p>

              <form onSubmit={handleRecordPaymentSubmit} className="space-y-6 text-sm">
                <div>
                  <label className="text-xs text-slate-400 block mb-2 font-medium">Mode de versement</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none"
                  >
                    <option value="Wave">Wave</option>
                    <option value="Orange Money">Orange Money</option>
                    <option value="MTN Money">MTN Money</option>
                    <option value="Moov Money">Moov Money</option>
                    <option value="Virement">Virement bancaire</option>
                    <option value="Espèces">Espèces</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-2 font-medium">Référence transaction (Optionnel)</label>
                  <input
                    type="text"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder="ex: OM-382910-XOF"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 text-xs flex justify-between items-center font-bold">
                  <span>Montant dû :</span>
                  <span className="font-mono text-sm text-amber-500">{activePaymentToPay.amount.toLocaleString()} {currentAgency.currency}</span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPayModalOpen(false)}
                    className="w-1/2 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-xs transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={paymentIsLoading}
                    className="w-1/2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center"
                  >
                    {paymentIsLoading ? "Validation..." : "Confirmer paiement"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: AJOUTER UN BIEN */}
      <AnimatePresence>
        {propertyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setPropertyModalOpen(false)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-lg w-full relative z-10 text-left overflow-y-auto max-h-[85vh]"
            >
              <h3 className="font-title text-lg font-bold text-slate-900 mb-2">Ajouter un nouveau Bien</h3>
              <p className="text-xs text-slate-400 mb-6">Enregistrez les caractéristiques physiques et la valeur locative.</p>

              <form onSubmit={handleAddProperty} className="space-y-4 text-sm">
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Désignation du Bien</label>
                  <input
                    type="text"
                    required
                    value={newProp.name}
                    onChange={(e) => setNewProp({ ...newProp, name: e.target.value })}
                    placeholder="ex: Appartement F4 - Résidence Latrille"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Type</label>
                    <select
                      value={newProp.type}
                      onChange={(e) => setNewProp({ ...newProp, type: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                    >
                      <option value="Appartement">Appartement</option>
                      <option value="Villa">Villa</option>
                      <option value="Immeuble">Immeuble</option>
                      <option value="Terrain">Terrain</option>
                      <option value="Bureau">Bureau</option>
                      <option value="Magasin">Magasin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Transaction</label>
                    <select
                      value={newProp.listing_type || 'Location'}
                      onChange={(e) => setNewProp({ ...newProp, listing_type: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                    >
                      <option value="Location">Location</option>
                      <option value="Vente">Vente</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">
                      {newProp.listing_type === 'Vente' ? 'Prix de Vente' : 'Loyer HC mensuel'}
                    </label>
                    <input
                      type="number"
                      required
                      value={newProp.rental_value}
                      onChange={(e) => setNewProp({ ...newProp, rental_value: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-mono focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Surface (m²)</label>
                    <input
                      type="number"
                      value={newProp.surface}
                      onChange={(e) => setNewProp({ ...newProp, surface: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Pièces</label>
                    <input
                      type="number"
                      value={newProp.rooms}
                      onChange={(e) => setNewProp({ ...newProp, rooms: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Adresse exacte</label>
                  <input
                    type="text"
                    required
                    value={newProp.address}
                    onChange={(e) => setNewProp({ ...newProp, address: e.target.value })}
                    placeholder="ex: Boulevard des Jardins, Cocody Deux-Plateaux"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Ville</label>
                    <input
                      type="text"
                      required
                      value={newProp.city}
                      onChange={(e) => setNewProp({ ...newProp, city: e.target.value })}
                      placeholder="Abidjan"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Pays</label>
                    <input
                      type="text"
                      disabled
                      value={currentAgency.country}
                      className="w-full bg-slate-100 border border-slate-250 rounded-xl px-4 py-2.5 text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Description</label>
                  <textarea
                    value={newProp.description}
                    onChange={(e) => setNewProp({ ...newProp, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none min-h-[80px]"
                    placeholder="Informations additionnelles (finitions, commodités, etc.)"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setPropertyModalOpen(false)}
                    className="w-1/2 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-xs"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: RÉDIGER UN BAIL */}
      <AnimatePresence>
        {leaseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setLeaseModalOpen(false)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-lg w-full relative z-10 text-left overflow-y-auto max-h-[85vh]"
            >
              <h3 className="font-title text-lg font-bold text-slate-900 mb-2">Créer un nouveau Contrat de Bail</h3>
              <p className="text-xs text-slate-400 mb-6">Sélectionnez le bien libre et le locataire qualifié pour générer le bail.</p>

              <form onSubmit={handleAddLease} className="space-y-4 text-sm">
                
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Sélectionner le Bien disponible</label>
                  <select
                    value={newLease.property_id}
                    onChange={(e) => {
                      const prop = properties.find(p => p.id === e.target.value);
                      setNewLease({ 
                        ...newLease, 
                        property_id: e.target.value,
                        rent_amount: prop ? prop.rental_value : 0,
                        deposit_amount: prop ? prop.rental_value * 2 : 0 // Suggest 2 months
                      });
                    }}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                  >
                    <option value="">-- Choisir un bien --</option>
                    {properties.filter(p => p.status === 'Disponible').map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.rental_value.toLocaleString()} FCFA)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Sélectionner le Locataire</label>
                  <select
                    value={newLease.tenant_id}
                    onChange={(e) => setNewLease({ ...newLease, tenant_id: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                  >
                    <option value="">-- Choisir un locataire --</option>
                    {tenants.map(t => (
                      <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Usage du contrat</label>
                    <select
                      value={newLease.type}
                      onChange={(e) => setNewLease({ ...newLease, type: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                    >
                      <option value="Habitation">Habitation</option>
                      <option value="Commercial">Commercial (Bail commercial)</option>
                      <option value="Bureau">Professionnel / Bureau</option>
                      <option value="Terrain">Terrain</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Date de début</label>
                    <input
                      type="date"
                      required
                      value={newLease.start_date}
                      onChange={(e) => setNewLease({ ...newLease, start_date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Loyer principal</label>
                    <input
                      type="number"
                      required
                      value={newLease.rent_amount}
                      onChange={(e) => setNewLease({ ...newLease, rent_amount: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Dépôt de garantie (Caution)</label>
                    <input
                      type="number"
                      required
                      value={newLease.deposit_amount}
                      onChange={(e) => setNewLease({ ...newLease, deposit_amount: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Mois d'avance</label>
                    <input
                      type="number"
                      value={newLease.advance_months}
                      onChange={(e) => setNewLease({ ...newLease, advance_months: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Charges/mois</label>
                    <input
                      type="number"
                      value={newLease.charges_amount}
                      onChange={(e) => setNewLease({ ...newLease, charges_amount: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Jour de paiement</label>
                    <input
                      type="number"
                      min={1}
                      max={28}
                      value={newLease.payment_day}
                      onChange={(e) => setNewLease({ ...newLease, payment_day: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                {currentAgency.country === "Côte d'Ivoire" && newLease.type === 'Habitation' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[10px] text-amber-800 leading-snug">
                    <strong>Contrôle loi 2018 (Côte d'Ivoire) :</strong> Le bail d'habitation limite le dépôt de garantie à 2 mois maximum et le paiement d'avance à 2 mois maximum. Vérifiez vos paramètres d'attribution sociale le cas échéant.
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setLeaseModalOpen(false)}
                    className="w-1/2 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-xs"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                  >
                    Créer & Signer le bail
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: CRM - PROSPECT */}
      <AnimatePresence>
        {leadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setLeadModalOpen(false)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-md w-full relative z-10 text-left"
            >
              <h3 className="font-title text-lg font-bold text-slate-900 mb-2">Qualifier un Prospect</h3>
              <p className="text-xs text-slate-400 mb-6">Enregistrez un nouveau contact pour le pipeline de commercialisation.</p>

              <form onSubmit={handleAddLead} className="space-y-4 text-sm">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Prénom</label>
                    <input
                      type="text"
                      required
                      value={newLead.first_name}
                      onChange={(e) => setNewLead({ ...newLead, first_name: e.target.value })}
                      placeholder="ex: Kadiatou"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Nom</label>
                    <input
                      type="text"
                      required
                      value={newLead.last_name}
                      onChange={(e) => setNewLead({ ...newLead, last_name: e.target.value })}
                      placeholder="ex: Sangaré"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Téléphone portable</label>
                  <input
                    type="text"
                    required
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="ex: +225 05..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">E-mail</label>
                  <input
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="kadi@live.fr"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Type de projet</label>
                    <select
                      value={newLead.interest_type}
                      onChange={(e) => setNewLead({ ...newLead, interest_type: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                    >
                      <option value="Location">Location</option>
                      <option value="Achat">Achat</option>
                      <option value="Investissement">Investissement</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Budget</label>
                    <input
                      type="number"
                      value={newLead.budget}
                      onChange={(e) => setNewLead({ ...newLead, budget: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Notes additionnelles</label>
                  <textarea
                    value={newLead.notes}
                    onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none min-h-[60px]"
                    placeholder="Caractéristiques du bien recherché..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setLeadModalOpen(false)}
                    className="w-1/2 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-xs"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                  >
                    Qualifer prospect
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 5: DETAIL D'UN BIEN */}
      <AnimatePresence>
        {selectedPropertyForDetails && (() => {
          const prop = selectedPropertyForDetails;
          const propLandlord = landlords.find(l => {
            if (prop.id.includes('p1111111') || prop.id.includes('p1111113')) return l.id.includes('l1111111');
            if (prop.id.includes('p1111112') || prop.id.includes('p1111114')) return l.id.includes('l1111112');
            if (prop.id.includes('p2222221') || prop.id.includes('p2222222')) return l.id.includes('l2222221');
            return false;
          }) || landlords[0];
          
          const propLease = leases.find(l => l.property_id === prop.id && l.status === 'Actif');
          const propTickets = tickets.filter(t => t.property_id === prop.id);
          const activeJunePayment = propLease ? payments.find(p => p.lease_id === propLease.id && p.period_start.includes('2026-06')) : null;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPropertyForDetails(null)}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              />
              
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-2xl w-full relative z-10 text-left overflow-y-auto max-h-[90vh]"
              >
                {/* Header */}
                <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">{prop.type}</span>
                    <h3 className="font-title text-xl font-bold text-slate-900">{prop.name}</h3>
                    <p className="text-xs text-slate-505 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {prop.address}, {prop.city} ({prop.country})
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedPropertyForDetails(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="mt-6 space-y-6">
                  {/* Photo & description */}
                  <div className="grid md:grid-cols-2 gap-6 items-start">
                    <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100">
                      <img src={prop.gallery[0]} alt={prop.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-4 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Description</span>
                        <p className="text-slate-600 mt-1 leading-relaxed">{prop.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">Surface</span>
                          <span className="font-bold text-slate-800 font-mono text-sm">{prop.surface} m²</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">Pièces</span>
                          <span className="font-bold text-slate-800 font-mono text-sm">{prop.rooms} pièces</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">Loyer Mensuel</span>
                          <span className="font-bold text-amber-500 font-mono text-sm">{prop.rental_value.toLocaleString()} {currentAgency.currency}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">Statut du Bien</span>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1 ${
                            prop.status === 'Disponible' ? 'bg-emerald-500 text-white' : 
                            prop.status === 'Occupé' ? 'bg-blue-500 text-white' : 
                            'bg-amber-500 text-white'
                          }`}>{prop.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Propriétaire details */}
                  {propLandlord && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block mb-2">Bailleur / Propriétaire</span>
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs">
                        <div>
                          <h4 className="font-bold text-slate-900">{propLandlord.first_name} {propLandlord.last_name}</h4>
                          <span className="text-slate-500">{propLandlord.email} • {propLandlord.phone}</span>
                        </div>
                        <div className="text-left sm:text-right font-mono text-[10px] text-slate-550">
                          <span className="block font-bold text-slate-800">{propLandlord.bank_details}</span>
                          <span className="block font-bold text-amber-600 mt-0.5">{propLandlord.mobile_money_details}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Locataire & Bail Details (si occupé) */}
                  {prop.status === 'Occupé' && propLease ? (
                    <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100/50 space-y-3">
                      <span className="text-[10px] font-mono text-blue-500 font-bold uppercase tracking-wider block">Bail Actif & Locataire</span>
                      <div className="grid md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-405 font-bold block">Locataire</span>
                          <h4 className="font-bold text-slate-900">{propLease.tenant.first_name} {propLease.tenant.last_name}</h4>
                          <span className="text-[11px] text-slate-500 font-mono">{propLease.tenant.phone}</span>
                          <span className="block text-[11px] text-slate-550 mt-0.5">{propLease.tenant.profession} chez {propLease.tenant.employer}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-450">Bail :</span>
                            <span className="font-semibold text-slate-850">{propLease.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-450">Début :</span>
                            <span className="font-semibold text-slate-850">{propLease.start_date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-450">Avance payée :</span>
                            <span className="font-semibold text-slate-850 font-mono">{propLease.advance_months} mois</span>
                          </div>
                          {activeJunePayment && (
                            <div className="flex justify-between items-center pt-1 mt-1 border-t border-blue-100/30">
                              <span className="text-slate-450 font-bold">Loyer Juin :</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                activeJunePayment.status === 'Payé' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                              }`}>{activeJunePayment.status}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : prop.status === 'Occupé' ? (
                    <div className="text-xs text-slate-400 italic">Bail en cours de rédaction ou de validation.</div>
                  ) : null}

                  {/* Tickets de maintenance */}
                  {propTickets.length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-50/20 border border-amber-100 space-y-2">
                      <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-wider block">Maintenance en cours</span>
                      {propTickets.map(ticket => (
                        <div key={ticket.id} className="flex justify-between items-center text-xs">
                          <div>
                            <h4 className="font-bold text-slate-900">{ticket.title}</h4>
                            <p className="text-[11px] text-slate-500 leading-snug">{ticket.description}</p>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-600 text-[10px] font-bold">{ticket.status}</span>
                            <span className="block text-[10px] text-slate-400 mt-1 font-mono">{ticket.cost.toLocaleString()} FCFA</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

                <div className="flex gap-3 pt-6 mt-6 border-t border-slate-100">
                  {/* Si le bien est occupé et le loyer est en retard, bouton direct pour encaisser */}
                  {prop.status === 'Occupé' && propLease && activeJunePayment && activeJunePayment.status !== 'Payé' && (
                    <button
                      onClick={() => {
                        setSelectedPropertyForDetails(null);
                        setActivePaymentToPay(activeJunePayment);
                        setPayModalOpen(true);
                      }}
                      className="w-1/2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" /> Encaisser le loyer de Juin
                    </button>
                  )}
                  
                  {/* Si le bien est disponible, proposer de rédiger un bail */}
                  {prop.status === 'Disponible' && (
                    <button
                      onClick={() => {
                        setSelectedPropertyForDetails(null);
                        setNewLease(prev => ({ ...prev, property_id: prop.id, rent_amount: prop.rental_value, deposit_amount: prop.rental_value * 2 }));
                        setLeaseModalOpen(true);
                      }}
                      className="w-1/2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Rédiger un Bail
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedPropertyForDetails(null)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold text-xs text-center cursor-pointer"
                  >
                    Fermer les détails
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* MODAL SECRET CONNECT: PROPRIÉTAIRE SAAS */}
      <AnimatePresence>
        {secretLoginOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              onClick={() => setSecretLoginOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 text-white rounded-3xl shadow-2xl p-8 max-w-sm w-full relative z-10 text-center"
            >
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                <ShieldCheck className="w-6 h-6 text-amber-500 animate-pulse" />
              </div>
              <h3 className="font-title text-lg font-bold text-white mb-1">Accès Propriétaire</h3>
              <p className="text-xs text-slate-400 mb-6">Zone sécurisée IMMO360 AFRIQUE</p>
 
              <form onSubmit={handleSecretLoginSubmit} className="space-y-4 text-left">
                <div>
                  <label className="text-xs text-slate-400 block mb-2 font-medium">Saisir le Code d'accès</label>
                  <input
                    type="password"
                    required
                    value={secretPassword}
                    onChange={(e) => {
                      setSecretPassword(e.target.value);
                      setSecretError(null);
                    }}
                    placeholder="••••••••"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 text-sm font-mono tracking-widest text-center"
                  />
                  {secretError && (
                    <span className="text-[10px] text-rose-500 font-bold block mt-1.5 text-center">{secretError}</span>
                  )}
                </div>
 
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSecretLoginOpen(false);
                      setSecretPassword('');
                      setSecretError(null);
                    }}
                    className="w-1/2 py-3 rounded-xl border border-slate-800 hover:bg-slate-850 font-semibold text-xs transition-colors text-slate-400"
                  >
                    Fermer
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg hover:shadow-xl shadow-amber-500/10 cursor-pointer"
                  >
                    Connexion
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      {/* MODAL ABONNEMENT: UPGRADE FORFAIT */}
      <AnimatePresence>
        {billingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setBillingModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-2xl w-full relative z-10 text-left overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="font-title text-lg font-bold text-slate-900">Forfaits & Tarifs IMMO360</h3>
                  <p className="text-xs text-slate-450 mt-1">Mettez à niveau votre compte pour débloquer de nouveaux quotas.</p>
                </div>
                <button 
                  onClick={() => setBillingModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
 
              {/* Pricing Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { plan: 'Standard', desc: 'Pour les petites structures', limit: 'Max 5 biens', popular: false },
                  { plan: 'Premium', desc: 'Pour les agences en croissance', limit: 'Max 15 biens', popular: true },
                  { plan: 'VIP', desc: 'Forfait sans concessions', limit: 'Biens illimités', popular: false },
                ].map((item) => (
                  <div 
                    key={item.plan}
                    onClick={() => setSelectedBillingPlan(item.plan as any)}
                    className={`p-5 rounded-2xl border-2 text-left cursor-pointer transition-all relative flex flex-col justify-between ${
                      selectedBillingPlan === item.plan 
                        ? 'border-slate-900 bg-slate-50/50 shadow-md' 
                        : 'border-slate-150 bg-white hover:border-slate-300'
                    }`}
                  >
                    {item.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-extrabold uppercase tracking-wide">
                        Conseillé
                      </span>
                    )}
                    <div>
                      <span className="text-xs font-bold text-slate-400 block font-mono">{item.plan}</span>
                      <h4 className="text-xl font-black text-slate-900 mt-1">{getDynamicPlanPrice(item.plan).toLocaleString()} FCFA <span className="text-xs font-normal text-slate-500 font-sans">/mois</span></h4>
                      <p className="text-[10px] text-slate-500 mt-2 leading-snug">{item.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{item.limit}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedBillingPlan === item.plan ? 'border-amber-500 bg-amber-500 text-slate-950' : 'border-slate-300'
                      }`}>
                        {selectedBillingPlan === item.plan && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
 
              {/* Checkout Form */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-150">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block mb-3">Paiement Sécurisé Mobile Money</span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {(['Wave', 'Orange Money', 'MTN Money', 'Moov Money'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setBillingMethod(method)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                        billingMethod === method 
                          ? 'border-amber-500 bg-amber-500/10 text-amber-700' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-655'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
 
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-bold">Numéro de téléphone payeur *</label>
                    <input
                      type="text"
                      required
                      value={billingPhone}
                      onChange={(e) => setBillingPhone(e.target.value)}
                      placeholder="Ex: +225 07 00 00 00 01"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-950 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-bold">Montant à facturer</label>
                    <div className="bg-slate-200/50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold font-mono text-slate-800 text-sm h-[38px] flex items-center justify-between">
                      <span>Forfait {selectedBillingPlan}</span>
                      <span className="text-amber-600 font-black">{getDynamicPlanPrice(selectedBillingPlan).toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>
 
                <button
                  type="button"
                  disabled={billingIsLoading}
                  onClick={() => {
                    if (!billingPhone) {
                      showToast("Veuillez renseigner votre numéro de téléphone.");
                      return;
                    }
                    setBillingIsLoading(true);
                    setTimeout(() => {
                      setBillingIsLoading(false);
                      setBillingModalOpen(false);
                      updateAgencyPlan(currentAgency.id, selectedBillingPlan);
                      setBillingPhone('');
                    }, 1500);
                  }}
                  className="w-full mt-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-slate-900/10 cursor-pointer"
                >
                  {billingIsLoading ? (
                    <span>Initiation de la transaction USSD...</span>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4 text-amber-500 animate-pulse" />
                      <span>Confirmer le paiement Mobile Money ({selectedBillingPlan})</span>
                    </>
                  )}
                </button>
              </div>
 
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 5: ENREGISTRER UNE VENTE (SALES) */}
      <AnimatePresence>
        {saleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fadeIn">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSaleModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-lg w-full relative z-10 text-left overflow-y-auto max-h-[85vh]"
            >
              <h3 className="font-title text-lg font-bold text-slate-900 mb-2">Finaliser la Vente d'un Bien</h3>
              <p className="text-xs text-slate-400 mb-6">Renseignez les details de la transaction pour enregistrer la vente de ce terrain ou de cette maison.</p>

              <form onSubmit={handleAddSaleTransaction} className="space-y-4 text-sm">
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Selectionner le Bien en Vente</label>
                  <select
                    value={newSale.property_id}
                    onChange={(e) => {
                      const prop = properties.find(p => p.id === e.target.value);
                      setNewSale({ 
                        ...newSale, 
                        property_id: e.target.value,
                        sale_price: prop ? prop.rental_value : 0
                      });
                    }}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                  >
                    <option value="">-- Choisir un bien --</option>
                    {properties.filter(p => p.listing_type === 'Vente' && p.status === 'Disponible').map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.rental_value.toLocaleString()} {currentAgency.currency})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Nom complet de l'acquereur (Acheteur) *</label>
                  <input
                    type="text"
                    required
                    value={newSale.buyer_name}
                    onChange={(e) => setNewSale({ ...newSale, buyer_name: e.target.value })}
                    placeholder="Ex: Kouadio N'Goran"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Telephone de l'acquereur *</label>
                  <input
                    type="text"
                    required
                    value={newSale.buyer_phone}
                    onChange={(e) => setNewSale({ ...newSale, buyer_phone: e.target.value })}
                    placeholder="Ex: +225 07 11 22 33 44"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-mono focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Prix Final Convenu</label>
                    <input
                      type="number"
                      required
                      value={newSale.sale_price}
                      onChange={(e) => setNewSale({ ...newSale, sale_price: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Mode de Reglement</label>
                    <select
                      value={newSale.payment_method}
                      onChange={(e) => setNewSale({ ...newSale, payment_method: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none cursor-pointer"
                    >
                      <option value="Wave">Wave</option>
                      <option value="Orange Money">Orange Money</option>
                      <option value="MTN Money">MTN Money</option>
                      <option value="Virement">Virement Bancaire</option>
                      <option value="Especes">Especes</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Reference transaction (N&deg; Virement, Ref Mobile Money)</label>
                  <input
                    type="text"
                    value={newSale.reference}
                    onChange={(e) => setNewSale({ ...newSale, reference: e.target.value })}
                    placeholder="Ex: VR-SGCI-99812"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none font-mono"
                  />
                </div>

                {newSale.sale_price > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-mono text-slate-700 space-y-1">
                    <span className="block font-bold uppercase tracking-wider text-[9px] text-amber-800">Calcul de la Repartition (10% Commission)</span>
                    <div className="flex justify-between mt-1">
                      <span>&bull; Commission SaaS / Agence (10%) :</span>
                      <strong className="text-amber-800">{(Math.round(newSale.sale_price * 0.1)).toLocaleString()} {currentAgency.currency}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>&bull; Net Reverse au Vendeur (90%) :</span>
                      <strong className="text-emerald-700">{(Math.round(newSale.sale_price * 0.9)).toLocaleString()} {currentAgency.currency}</strong>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setSaleModalOpen(false)}
                    className="w-1/2 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-xs text-center cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg cursor-pointer"
                  >
                    Valider la Vente
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: AJOUTER UN PROPRIÉTAIRE */}
      <AnimatePresence>
        {landlordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fadeIn">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setLandlordModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-md w-full relative z-10 text-left overflow-y-auto max-h-[85vh]"
            >
              <h3 className="font-title text-lg font-bold text-slate-900 mb-2">Nouveau Propriétaire / Mandant</h3>
              <p className="text-xs text-slate-400 mb-6">Ajoutez les coordonnées d'un propriétaire pour lui affecter des mandats de gestion et lui verser ses loyers.</p>

              <form onSubmit={handleAddLandlordSubmit} className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Nom *</label>
                    <input
                      type="text"
                      required
                      value={newLandlord.last_name}
                      onChange={(e) => setNewLandlord({ ...newLandlord, last_name: e.target.value })}
                      placeholder="Ex: Koné"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={newLandlord.first_name}
                      onChange={(e) => setNewLandlord({ ...newLandlord, first_name: e.target.value })}
                      placeholder="Ex: Amadou"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Téléphone *</label>
                  <input
                    type="text"
                    required
                    value={newLandlord.phone}
                    onChange={(e) => setNewLandlord({ ...newLandlord, phone: e.target.value })}
                    placeholder="Ex: +225 07 89 01 23 45"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Adresse Email *</label>
                  <input
                    type="email"
                    required
                    value={newLandlord.email}
                    onChange={(e) => setNewLandlord({ ...newLandlord, email: e.target.value })}
                    placeholder="Ex: amadou.kone@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Adresse Physique</label>
                  <input
                    type="text"
                    value={newLandlord.address}
                    onChange={(e) => setNewLandlord({ ...newLandlord, address: e.target.value })}
                    placeholder="Ex: Cocody Les Deux Plateaux, Abidjan"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Coordonnées Bancaires (RIB / IBAN)</label>
                  <input
                    type="text"
                    value={newLandlord.bank_details}
                    onChange={(e) => setNewLandlord({ ...newLandlord, bank_details: e.target.value })}
                    placeholder="Ex: RIB SGCI CI008 01202 98765432109 88"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Compte Mobile Money pour versement (Wave, OM, etc.)</label>
                  <input
                    type="text"
                    value={newLandlord.mobile_money_details}
                    onChange={(e) => setNewLandlord({ ...newLandlord, mobile_money_details: e.target.value })}
                    placeholder="Ex: Wave: +225 07 89 01 23 45"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none text-xs"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setLandlordModalOpen(false)}
                    className="w-1/2 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-xs text-center cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg cursor-pointer"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: AJOUTER UN LOCATAIRE */}
      <AnimatePresence>
        {tenantModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fadeIn">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setTenantModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-md w-full relative z-10 text-left overflow-y-auto max-h-[85vh]"
            >
              <h3 className="font-title text-lg font-bold text-slate-900 mb-2">Nouveau Locataire</h3>
              <p className="text-xs text-slate-400 mb-6">Ajoutez les coordonnées d'un nouveau locataire dans votre annuaire.</p>

              <form onSubmit={handleAddTenantSubmit} className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Nom *</label>
                    <input
                      type="text"
                      required
                      value={newTenant.last_name}
                      onChange={(e) => setNewTenant({ ...newTenant, last_name: e.target.value })}
                      placeholder="Ex: Kouassi"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={newTenant.first_name}
                      onChange={(e) => setNewTenant({ ...newTenant, first_name: e.target.value })}
                      placeholder="Ex: Koffi"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Téléphone *</label>
                  <input
                    type="text"
                    required
                    value={newTenant.phone}
                    onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                    placeholder="Ex: +225 07 45 45 45 45"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Adresse Email *</label>
                  <input
                    type="email"
                    required
                    value={newTenant.email}
                    onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                    placeholder="Ex: koffi.kouassi@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Profession</label>
                    <input
                      type="text"
                      value={newTenant.profession}
                      onChange={(e) => setNewTenant({ ...newTenant, profession: e.target.value })}
                      placeholder="Ex: Ingénieur UX"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-medium">Employeur</label>
                    <input
                      type="text"
                      value={newTenant.employer}
                      onChange={(e) => setNewTenant({ ...newTenant, employer: e.target.value })}
                      placeholder="Ex: UNICEF"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setTenantModalOpen(false)}
                    className="w-1/2 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-xs text-center cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg cursor-pointer"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
