"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Users,
  Briefcase,
  Globe,
  Award,
  TrendingUp,
  MapPin,
  CheckCircle,
  Activity,
  ShieldCheck,
  Plane,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  Building,
  RefreshCw,
  Send,
  Sparkles,
  HeartPulse,
  Building2,
  Fuel,
  Hotel,
  Truck,
  Factory,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// FAQ type definition
interface FAQItem {
  q: string;
  a: string;
}

// Counter component for animated statistics
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();
    
    const run = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        requestAnimationFrame(run);
      }
    };
    requestAnimationFrame(run);
  }, [value]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

// Testimonials
const TESTIMONIALS = [
  {
    name: "Dr. Khaled Al-Mutairi",
    role: "HR Director, Almarai Foods Group",
    quote: "RAMA INTERNATIONAL-INDIA is our absolute go-to partner. Their trade testing is incredibly rigorous, and they managed the visa stamping of 150 HVAC technicians in record time.",
    country: "Saudi Arabia",
  },
  {
    name: "Marc Sterling",
    role: "Project Manager, Sterling Projects GmbH",
    quote: "Sourcing nurses who meet German language requirements was a massive challenge until we partnered with RAMA. Deepak Chauhan's team handled the MEA certifications and logistics flawlessly.",
    country: "Germany",
  },
  {
    name: "Yousef Al-Kuwari",
    role: "Operations Chief, Qatar Gas Logistics",
    quote: "We mobilized over 100 heavy vehicle drivers in a single campaign. The candidates arrived fully briefed, trade-tested, and with completed biometric clearances. Highly professional.",
    country: "Qatar",
  },
];

export default function PremiumHome() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);

  const industryConfigs: Record<string, {
    icon: any;
    countries: string[];
    key: string;
  }> = {
    healthcare: {
      key: "healthcare",
      icon: HeartPulse,
      countries: ["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Bahrain"]
    },
    construction: {
      key: "construction",
      icon: Building2,
      countries: ["UAE", "Saudi Arabia", "Qatar", "Kuwait"]
    },
    oilGas: {
      key: "oilGas",
      icon: Fuel,
      countries: ["Saudi Arabia", "UAE", "Qatar", "Oman"]
    },
    hospitality: {
      key: "hospitality",
      icon: Hotel,
      countries: ["UAE", "Qatar", "Bahrain"]
    },
    logistics: {
      key: "logistics",
      icon: Truck,
      countries: ["UAE", "Saudi Arabia", "Kuwait"]
    },
    manufacturing: {
      key: "manufacturing",
      icon: Factory,
      countries: ["Europe", "Canada", "UAE"]
    }
  };

  const regionGroups = [
    {
      regionKey: "regionGulf",
      countries: [
        { key: "uae", nameEn: "United Arab Emirates (UAE)", nameHi: "संयुक्त अरब अमीरात (UAE)" },
        { key: "ksa", nameEn: "Saudi Arabia", nameHi: "सऊदी अरब" },
        { key: "qatar", nameEn: "Qatar", nameHi: "कतर" },
        { key: "kuwait", nameEn: "Kuwait", nameHi: "कुवैत" },
        { key: "oman", nameEn: "Oman", nameHi: "ओमान" },
        { key: "bahrain", nameEn: "Bahrain", nameHi: "बहरीन" },
      ]
    },
    {
      regionKey: "regionEurope",
      countries: [
        { key: "germany", nameEn: "Germany", nameHi: "जर्मनी" },
        { key: "poland", nameEn: "Poland", nameHi: "पोलैंड" },
        { key: "romania", nameEn: "Romania", nameHi: "रोमानिया" },
        { key: "croatia", nameEn: "Croatia", nameHi: "क्रोएशिया" },
        { key: "hungary", nameEn: "Hungary", nameHi: "हंगरी" },
        { key: "serbia", nameEn: "Serbia", nameHi: "सर्बिया" },
        { key: "bulgaria", nameEn: "Bulgaria", nameHi: "बुल्गारिया" },
        { key: "czechRepublic", nameEn: "Czech Republic", nameHi: "चेक गणराज्य" },
        { key: "slovakia", nameEn: "Slovakia", nameHi: "स्लोवाकिया" },
        { key: "lithuania", nameEn: "Lithuania", nameHi: "लिथुआनिया" },
        { key: "latvia", nameEn: "Latvia", nameHi: "लातविया" },
        { key: "estonia", nameEn: "Estonia", nameHi: "एस्टोनिया" },
        { key: "malta", nameEn: "Malta", nameHi: "माल्टा" },
        { key: "portugal", nameEn: "Portugal", nameHi: "पुर्तगाल" },
        { key: "spain", nameEn: "Spain", nameHi: "स्पेन" },
        { key: "italy", nameEn: "Italy", nameHi: "इटली" },
        { key: "greece", nameEn: "Greece", nameHi: "ग्रीस" },
        { key: "netherlands", nameEn: "Netherlands", nameHi: "नेदरलैंड्स" },
        { key: "belgium", nameEn: "Belgium", nameHi: "बेल्जियम" },
        { key: "france", nameEn: "France", nameHi: "फ्रांस" },
        { key: "ireland", nameEn: "Ireland", nameHi: "आयरलैंड" },
        { key: "uk", nameEn: "United Kingdom", nameHi: "यूनाइटेड किंगडम" },
      ]
    },
    {
      regionKey: "regionAfrica",
      countries: [
        { key: "southAfrica", nameEn: "South Africa", nameHi: "दक्षिण अफ्रीका" },
        { key: "kenya", nameEn: "Kenya", nameHi: "केन्या" },
        { key: "tanzania", nameEn: "Tanzania", nameHi: "तंजानिया" },
        { key: "uganda", nameEn: "Uganda", nameHi: "युगांडा" },
        { key: "ghana", nameEn: "Ghana", nameHi: "घाना" },
        { key: "nigeria", nameEn: "Nigeria", nameHi: "नाइजीरिया" },
        { key: "ethiopia", nameEn: "Ethiopia", nameHi: "इथियोपिया" },
        { key: "botswana", nameEn: "Botswana", nameHi: "बोत्सवाना" },
        { key: "namibia", nameEn: "Namibia", nameHi: "नामीबिया" },
      ]
    },
    {
      regionKey: "regionAustraliaOceania",
      countries: [
        { key: "australia", nameEn: "Australia", nameHi: "ऑस्ट्रेलिया" },
        { key: "newZealand", nameEn: "New Zealand", nameHi: "न्यूजीलैंड" },
      ]
    },
    {
      regionKey: "regionAsia",
      countries: [
        { key: "malaysia", nameEn: "Malaysia", nameHi: "मलेशिया" },
        { key: "japan", nameEn: "Japan", nameHi: "जापान" },
        { key: "southKorea", nameEn: "South Korea", nameHi: "दक्षिण कोरिया" },
        { key: "maldives", nameEn: "Maldives", nameHi: "मालदीव" },
        { key: "brunei", nameEn: "Brunei", nameHi: "ब्रुनेई" },
      ]
    },
    {
      regionKey: "regionNorthAmerica",
      countries: [
        { key: "canada", nameEn: "Canada", nameHi: "कनाडा" },
      ]
    }
  ];

  // Translation Hooks
  const tHero = useTranslations("hero");
  const tVision = useTranslations("vision");
  const tWhy = useTranslations("whyChoose");
  const tProcess = useTranslations("process");
  const tForm = useTranslations("callbackForm");
  const tNavbar = useTranslations("navbar");
  const tInd = useTranslations("industries");
  const tFaq = useTranslations("faqs");
  const tBlog = useTranslations("blog");
  const tCountries = useTranslations("countries");
  const tServices = useTranslations("servicesPage");
  const tTestimonials = useTranslations("testimonials");
  const tJobs = useTranslations("jobsPage");

  const industries = [
    {
      key: "healthcare",
      icon: HeartPulse,
      title: tInd("healthcare"),
      subtitle: tInd("healthcareSub"),
    },
    {
      key: "construction",
      icon: Building2,
      title: tInd("construction"),
      subtitle: tInd("constructionSub"),
    },
    {
      key: "oilGas",
      icon: Fuel,
      title: tInd("oilGas"),
      subtitle: tInd("oilGasSub"),
    },
    {
      key: "hospitality",
      icon: Hotel,
      title: tInd("hospitality"),
      subtitle: tInd("hospitalitySub"),
    },
    {
      key: "logistics",
      icon: Truck,
      title: tInd("logistics"),
      subtitle: tInd("logisticsSub"),
    },
    {
      key: "manufacturing",
      icon: Factory,
      title: tInd("manufacturing"),
      subtitle: tInd("manufacturingSub"),
    },
  ];

  const testimonialsLocal = [
    {
      name: tTestimonials("t1Name"),
      role: tTestimonials("t1Role"),
      quote: tTestimonials("t1Quote"),
      country: tTestimonials("t1Country"),
    },
    {
      name: tTestimonials("t2Name"),
      role: tTestimonials("t2Role"),
      quote: tTestimonials("t2Quote"),
      country: tTestimonials("t2Country"),
    },
    {
      name: tTestimonials("t3Name"),
      role: tTestimonials("t3Role"),
      quote: tTestimonials("t3Quote"),
      country: tTestimonials("t3Country"),
    },
  ];

  // Form states for contact segment
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/jobs?limit=3")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data.jobs || []);
        setLoadingJobs(false);
      })
      .catch(() => setLoadingJobs(false));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowCountryModal(false);
        setCountrySearch("");
        setActiveIndustry(null);
      }
    };
    if (showCountryModal || activeIndustry) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [showCountryModal, activeIndustry]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          companyName: contactCompany,
          message: contactMessage,
        }),
      });
      if (res.ok) {
        setContactSuccess(true);
        setContactName("");
        setContactEmail("");
        setContactCompany("");
        setContactMessage("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setContactLoading(false);
    }
  };

  const faqs: FAQItem[] = [
    {
      q: tFaq("faq1Q"),
      a: tFaq("faq1A"),
    },
    {
      q: tFaq("faq2Q"),
      a: tFaq("faq2A"),
    },
    {
      q: tFaq("faq3Q"),
      a: tFaq("faq3A"),
    },
    {
      q: tFaq("faq4Q"),
      a: tFaq("faq4A"),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-navy-950 text-navy-900 dark:text-white font-sans transition-colors duration-200 overflow-x-hidden">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-[#051B3D] text-white pt-32 pb-20 overflow-hidden">
        {/* Abstract grids & shapes */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(37,99,235,0.12),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-600/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-blue-400 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5 text-gold-500" />
              <span>{tHero("tagline")}</span>
            </div>

            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              {tHero("title")}
            </h1>

            <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              {tHero("desc")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 font-bold text-xs">
              <Link
                href="/contact"
                className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-500 text-white uppercase tracking-wider px-8 py-4.5 rounded-full shadow-lg hover:shadow-blue-500/15 transition-all duration-300 font-bold border border-blue-500/20 hover:-translate-y-0.5 active:scale-95"
              >
                {tHero("ctaContact")}
              </Link>
              <Link
                href="/jobs"
                className="w-full sm:w-auto text-center border-2 border-white/20 text-white hover:bg-white hover:text-navy-950 uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300 font-bold hover:-translate-y-0.5 active:scale-95"
              >
                {tHero("ctaApply")}
              </Link>
            </div>
          </motion.div>

          {/* Graphical Frame - Live demand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 hidden lg:flex justify-center"
          >
            <div className="w-full max-w-sm bg-[#0B3D91]/40 border border-white/10 rounded-[32px] shadow-2xl p-6 backdrop-blur-md relative overflow-hidden animate-float">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
                <span className="font-headline text-xs font-bold text-blue-500 tracking-wider">{tHero("demandWidget")}</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              
              <div className="space-y-3.5 text-xs">
                {[
                  { title: tHero("demandJob1"), country: tHero("demandEurope"), s: tHero("sectorHealthcare") },
                  { title: tHero("demandJob2"), country: tHero("demandSaudi"), s: tHero("sectorMfg") },
                  { title: tHero("demandJob3"), country: tHero("demandUAE"), s: tHero("sectorConst") },
                  { title: tHero("demandJob4"), country: tHero("demandQatar"), s: tHero("sectorEnergy") },
                ].map((item, idx) => (
                  <div key={idx} className="bg-navy-950/40 border border-white/5 p-3.5 rounded-2xl flex justify-between items-center hover:border-white/15 transition-all">
                    <div>
                      <h4 className="font-bold text-white">{item.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{item.country}</p>
                    </div>
                    <span className="bg-blue-600/10 text-blue-400 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase border border-blue-500/10">
                      {item.s}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
         </div>
       </section>

      {/* 2. Animated Statistics Counters */}
      <section className="bg-[#03132B] border-t border-white/5 py-12 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {[
              { val: 10000, suf: "+", label: tHero("counterVerified") },
              { val: 250, suf: "+", label: tHero("counterClients") },
              { val: 18, suf: "+", label: tHero("counterCountries") },
              { val: 100, suf: "%", label: tHero("counterSuccess") },
              { val: 2018, suf: "", label: tHero("counterEstablished"), isStatic: true },
            ].map((stat, idx) => (
              <div key={idx}>
                <p className="font-headline text-3xl sm:text-4xl font-extrabold text-blue-500">
                  {stat.isStatic ? stat.val : <Counter value={stat.val} suffix={stat.suf} />}
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. About Us Section */}
      <section className="py-24 bg-white dark:bg-navy-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest font-headline">{tVision("leadershipTag")}</span>
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-navy-900 dark:text-white leading-tight">
              {tVision("title")}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">
              {tVision("quote")}
            </p>
            <div className="p-6 bg-slate-50 dark:bg-navy-900/40 rounded-[20px] border border-gray-100 dark:border-white/5 text-xs font-medium space-y-2.5">
              <p className="font-bold text-navy-900 dark:text-white font-headline">{tVision("licDetails")}</p>
              <p className="text-gray-500 dark:text-gray-400 font-light">Registration No: <span className="font-bold text-navy-900 dark:text-white">Lic: RC-B-0850/DEL/COM/1000+/5/9385/2018</span></p>
              <p className="text-gray-500 dark:text-gray-400 font-light">{tVision("licText")}</p>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="w-full max-w-md bg-slate-50 dark:bg-navy-900/40 border border-gray-150 dark:border-white/5 rounded-[24px] p-8 shadow-enterprise space-y-6">
              <h3 className="font-headline text-lg font-bold text-navy-900 dark:text-white">{tVision("mandatesTitle")}</h3>
              <div className="space-y-5 text-xs font-light text-gray-650 dark:text-gray-300">
                <div className="flex items-start space-x-3.5">
                  <CheckCircle className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-navy-900 dark:text-white">{tVision("mandate1Title")}</h4>
                    <p className="text-[11px] mt-0.5">{tVision("mandate1Desc")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3.5">
                  <CheckCircle className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-navy-900 dark:text-white">{tVision("mandate2Title")}</h4>
                    <p className="text-[11px] mt-0.5">{tVision("mandate2Desc")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3.5">
                  <CheckCircle className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-navy-900 dark:text-white">{tVision("mandate3Title")}</h4>
                    <p className="text-[11px] mt-0.5">{tVision("mandate3Desc")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us Section */}
      <section className="py-24 bg-slate-50 dark:bg-navy-900/10 border-y border-gray-100 dark:border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest font-headline">{tVision("strategicTag")}</span>
          <h2 className="font-headline text-3xl font-extrabold text-navy-900 dark:text-white">{tWhy("title")}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-light">{tVision("strategicDesc")}</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: tWhy("testing"), desc: tWhy("testingDesc"), icon: Building },
            { title: tWhy("compliance"), desc: tWhy("complianceDesc"), icon: ShieldCheck },
            { title: tWhy("consulate"), desc: tWhy("consulateDesc"), icon: Activity },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white dark:bg-navy-900/40 border border-gray-150 dark:border-white/5 rounded-[24px] p-8 shadow-enterprise hover:-translate-y-1 hover:shadow-lg hover:border-blue-500/20 dark:hover:border-blue-500/20 transition-all duration-300 space-y-5">
                <div className="h-12 w-12 bg-blue-600/5 text-blue-650 rounded-xl flex items-center justify-center border border-blue-500/10">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-headline font-bold text-navy-900 dark:text-white text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Services Section */}
      <section className="py-24 bg-white dark:bg-navy-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest font-headline">{tServices("solutionsSubtitle")}</span>
          <h2 className="font-headline text-3xl font-extrabold text-navy-900 dark:text-white">{tServices("solutionsTitle")}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-light">{tServices("solutionsDesc")}</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: tServices("svc1Title"), slug: "permanent-recruitment", desc: tServices("svc1Desc"), icon: Users },
            { title: tServices("svc2Title"), slug: "bulk-hiring", desc: tServices("svc2Desc"), icon: TrendingUp },
            { title: tServices("svc3Title"), slug: "executive-search", desc: tServices("svc3Desc"), icon: Award },
            { title: tServices("svc4Title"), slug: "skilled-labour-supply", desc: tServices("svc4Desc"), icon: Briefcase },
            { title: tServices("svc5Title"), slug: "overseas-placement", desc: tServices("svc5Desc"), icon: Plane },
            { title: tServices("svc6Title"), slug: "hr-consultancy", desc: tServices("svc6Desc"), icon: ShieldCheck },
          ].map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div key={idx} className="bg-white dark:bg-navy-900/40 border border-gray-150 dark:border-white/5 rounded-[24px] p-8 shadow-enterprise hover:-translate-y-1 hover:shadow-lg hover:border-blue-500/20 dark:hover:border-blue-500/20 transition-all duration-300 flex flex-col justify-between h-80 group">
                <div className="space-y-4">
                  <div className="h-12 w-12 bg-blue-600/5 text-blue-650 rounded-xl flex items-center justify-center border border-blue-500/10 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-headline text-base font-bold text-navy-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed">{svc.desc}</p>
                </div>
                <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <Link
                     href={`/services/${svc.slug}`}
                     className="inline-flex items-center space-x-1 text-blue-600 font-bold uppercase tracking-widest text-[10px] hover:underline"
                  >
                    <span>{tServices("readDetails")}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Industries We Serve Section */}
      <section className="py-24 bg-slate-50 dark:bg-navy-900/10 border-y border-gray-100 dark:border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest font-headline">{tInd("sectorsEmpower")}</span>
          <h2 className="font-headline text-3xl font-extrabold text-navy-900 dark:text-white">{tInd("industriesTitle")}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-light font-headline">{tInd("industriesSubtitle")}</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {industries.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                onClick={() => setActiveIndustry(item.key)}
                className="group rounded-3xl border border-blue-200 dark:border-white/5 bg-white dark:bg-navy-900/40 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-center cursor-pointer active:scale-95"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                  <Icon size={34} />
                </div>

                <h3 className="text-sm font-bold text-navy-900 dark:text-white font-headline leading-snug">
                  {item.title}
                </h3>

                <p className="mt-2 text-[10px] text-gray-500 dark:text-gray-400 font-light">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* Industry Details Modal & Bottom Sheet */}
        <AnimatePresence>
          {activeIndustry && (() => {
            const config = industryConfigs[activeIndustry];
            if (!config) return null;
            const Icon = config.icon;

            const rolesList = tInd(`${activeIndustry}Roles`).split(",").map(s => s.trim());
            const skillsList = tInd(`${activeIndustry}Skills`).split(",").map(s => s.trim());
            const benefitsList = tInd(`${activeIndustry}Benefits`).split(",").map(s => s.trim());
            const processList = tInd(`${activeIndustry}Process`).split(",").map(s => s.trim());

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveIndustry(null)}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              >
                {/* Desktop/Tablet Centered Modal */}
                <motion.div
                  initial={{ scale: 0.95, y: 30, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.95, y: 30, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={(e) => e.stopPropagation()}
                  className="hidden md:flex flex-col bg-white dark:bg-navy-950 border border-gray-200 dark:border-white/10 rounded-[32px] w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl text-navy-900 dark:text-white transition-colors"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center px-8 py-5 border-b border-gray-150 dark:border-white/5 bg-slate-50 dark:bg-navy-900/20">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-blue-600/5 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/10">
                        <Icon className="h-5.5 w-5.5" />
                      </div>
                      <h3 className="font-headline text-base font-bold uppercase tracking-wider">{tInd(activeIndustry)}</h3>
                    </div>
                    <button
                      onClick={() => setActiveIndustry(null)}
                      className="text-gray-400 hover:text-navy-900 dark:hover:text-white p-2 rounded-xl bg-slate-100 dark:bg-navy-900 border border-gray-200 dark:border-white/5 transition-all text-xs font-bold font-sans"
                    >
                      ✕ Close
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 overflow-y-auto p-8 grid grid-cols-12 gap-8 scrollbar-hide text-xs">
                    {/* Left Column: Summary and CTA buttons */}
                    <div className="col-span-5 space-y-6">
                      <div className="space-y-3">
                        <h4 className="font-headline text-sm font-extrabold text-blue-650 dark:text-blue-400 leading-normal">{tInd(`${activeIndustry}Intro`)}</h4>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-light">{tInd(`${activeIndustry}Desc`)}</p>
                      </div>

                      {/* Detail Parameters */}
                      <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold block">{tInd("lblExperience")}</span>
                          <span className="font-bold text-navy-900 dark:text-white mt-1 block">{tInd(`${activeIndustry}Experience`)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold block">{tInd("lblEmpType")}</span>
                          <span className="font-bold text-navy-900 dark:text-white mt-1 block">{tInd(`${activeIndustry}EmpType`)}</span>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col gap-3 pt-6 border-t border-gray-100 dark:border-white/5">
                        <Link
                          href="/jobs"
                          onClick={() => setActiveIndustry(null)}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-center transition-all shadow-md active:scale-95"
                        >
                          {tInd("btnApplyNow")}
                        </Link>
                        <Link
                          href="/contact"
                          onClick={() => setActiveIndustry(null)}
                          className="w-full border-2 border-gray-200 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5 py-3 rounded-xl font-bold uppercase tracking-wider text-center transition-all active:scale-95 text-navy-750 dark:text-gray-300"
                        >
                          {tInd("btnContactUs")}
                        </Link>
                      </div>
                    </div>

                    {/* Right Column: Roles, Countries, Skills, Benefits, Process */}
                    <div className="col-span-7 space-y-6">
                      {/* Roles */}
                      <div className="space-y-2">
                        <h4 className="font-headline text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-wider font-extrabold">{tInd("lblRoles")}</h4>
                        <div className="flex flex-wrap gap-2">
                          {rolesList.map((role, rIdx) => (
                            <span key={rIdx} className="bg-blue-600/5 text-blue-650 dark:bg-blue-600/10 dark:text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/15 font-semibold text-[10.5px]">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Recruiting Countries */}
                      <div className="space-y-2">
                        <h4 className="font-headline text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-wider font-extrabold">{tInd("lblCountries")}</h4>
                        <div className="flex flex-wrap gap-2">
                          {config.countries.map((country, cIdx) => (
                            <span key={cIdx} className="bg-amber-500/5 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/15 font-semibold text-[10.5px]">
                              {country}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Required Skills */}
                      <div className="space-y-2">
                        <h4 className="font-headline text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-wider font-extrabold">{tInd("lblSkills")}</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {skillsList.map((skill, sIdx) => (
                            <span key={sIdx} className="bg-slate-50 dark:bg-navy-900 border border-gray-150 dark:border-white/5 px-2.5 py-1.5 rounded-full font-light text-[10px]">
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Benefits Offered */}
                      <div className="space-y-2">
                        <h4 className="font-headline text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-wider font-extrabold">{tInd("lblBenefits")}</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {benefitsList.map((benefit, bIdx) => (
                            <span key={bIdx} className="bg-emerald-500/5 text-emerald-650 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-500/10 px-2.5 py-1.5 rounded-full font-light text-[10px]">
                              ★ {benefit}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Recruitment Process */}
                      <div className="space-y-2.5">
                        <h4 className="font-headline text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-wider font-extrabold">{tInd("lblProcess")}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {processList.map((step, pIdx) => (
                            <div key={pIdx} className="flex items-start space-x-2 p-2.5 bg-slate-50 dark:bg-navy-900/40 border border-gray-100 dark:border-white/5 rounded-xl">
                              <span className="text-[10px] font-bold text-blue-500">0{pIdx + 1}</span>
                              <span className="text-[10px] font-light leading-normal">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Mobile/Tablet Bottom Sheet */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 220 }}
                  onClick={(e) => e.stopPropagation()}
                  className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-navy-950 border-t border-gray-250 dark:border-white/10 rounded-t-[32px] max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col text-navy-900 dark:text-white transition-colors"
                >
                  {/* Handle Drag Bar */}
                  <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto my-3 shrink-0" />

                  {/* Header */}
                  <div className="flex justify-between items-center px-6 pb-4 border-b border-gray-150 dark:border-white/5 shrink-0">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 bg-blue-600/5 text-blue-650 dark:text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/10">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-headline text-sm font-bold uppercase tracking-wider">{tInd(activeIndustry)}</h3>
                    </div>
                    <button
                      onClick={() => setActiveIndustry(null)}
                      className="text-gray-400 hover:text-navy-900 dark:hover:text-white p-2 rounded-xl bg-slate-100 dark:bg-navy-900 border border-gray-200 dark:border-white/5 transition-all text-xs font-bold font-sans"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Mobile Content */}
                  <div className="p-6 space-y-6 text-xs overflow-y-auto">
                    <div className="space-y-2">
                      <h4 className="font-headline text-xs font-bold text-blue-650 dark:text-blue-400 leading-normal">{tInd(`${activeIndustry}Intro`)}</h4>
                      <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-light">{tInd(`${activeIndustry}Desc`)}</p>
                    </div>

                    {/* Roles */}
                    <div className="space-y-2">
                      <h4 className="font-headline text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-wider font-extrabold">{tInd("lblRoles")}</h4>
                      <div className="flex flex-wrap gap-2">
                        {rolesList.map((role, rIdx) => (
                          <span key={rIdx} className="bg-blue-600/5 text-blue-650 dark:bg-blue-600/10 dark:text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/15 font-semibold text-[10px]">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Recruiting Countries */}
                    <div className="space-y-2">
                      <h4 className="font-headline text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-wider font-extrabold">{tInd("lblCountries")}</h4>
                      <div className="flex flex-wrap gap-2">
                        {config.countries.map((country, cIdx) => (
                          <span key={cIdx} className="bg-amber-500/5 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/15 font-semibold text-[10px]">
                            {country}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Required Skills */}
                    <div className="space-y-2">
                      <h4 className="font-headline text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-wider font-extrabold">{tInd("lblSkills")}</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {skillsList.map((skill, sIdx) => (
                          <span key={sIdx} className="bg-slate-50 dark:bg-navy-900 border border-gray-150 dark:border-white/5 px-2.5 py-1.5 rounded-full font-light text-[10px]">
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Detail Parameters */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100 dark:border-white/5">
                      <div>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold block">{tInd("lblExperience")}</span>
                        <span className="font-bold text-navy-900 dark:text-white mt-1 block">{tInd(`${activeIndustry}Experience`)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold block">{tInd("lblEmpType")}</span>
                        <span className="font-bold text-navy-900 dark:text-white mt-1 block">{tInd(`${activeIndustry}EmpType`)}</span>
                      </div>
                    </div>

                    {/* Benefits Offered */}
                    <div className="space-y-2">
                      <h4 className="font-headline text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-wider font-extrabold">{tInd("lblBenefits")}</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {benefitsList.map((benefit, bIdx) => (
                          <span key={bIdx} className="bg-emerald-500/5 text-emerald-650 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-500/10 px-2.5 py-1.5 rounded-full font-light text-[10px]">
                            ★ {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Recruitment Process */}
                    <div className="space-y-2.5">
                      <h4 className="font-headline text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-wider font-extrabold">{tInd("lblProcess")}</h4>
                      <div className="space-y-2">
                        {processList.map((step, pIdx) => (
                          <div key={pIdx} className="flex items-start space-x-2.5 p-3 bg-slate-50 dark:bg-navy-900/40 border border-gray-100 dark:border-white/5 rounded-xl">
                            <span className="text-xs font-bold text-blue-500">0{pIdx + 1}</span>
                            <span className="text-[11px] font-light leading-normal">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-3 pt-6 border-t border-gray-100 dark:border-white/5 pb-8">
                      <Link
                        href="/jobs"
                        onClick={() => setActiveIndustry(null)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-center transition-all shadow-md active:scale-95"
                      >
                        {tInd("btnApplyNow")}
                      </Link>
                      <Link
                        href="/contact"
                        onClick={() => setActiveIndustry(null)}
                        className="w-full border-2 border-gray-200 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5 py-3 rounded-xl font-bold uppercase tracking-wider text-center transition-all active:scale-95 text-navy-750 dark:text-gray-300"
                      >
                        {tInd("btnContactUs")}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </section>

      {/* 7. Countries We Recruit For */}
      <section className="py-24 bg-white dark:bg-navy-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest font-headline">{tCountries("subtitle")}</span>
          <h2 className="font-headline text-3xl font-extrabold text-navy-900 dark:text-white">{tCountries("title")}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-light">{tCountries("desc")}</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4 text-center font-bold text-xs text-navy-900 dark:text-white">
          {[
            { label: tCountries("countryUAE") },
            { label: tCountries("countryKSA") },
            { label: tCountries("countryQatar") },
            { label: tCountries("countryKuwait") },
            { label: tCountries("countryOman") },
            { label: tCountries("countryBahrain") },
            { label: tCountries("countryEurope") },
            { label: tCountries("countryCanada") },
            { label: tCountries("countryOther"), action: () => setShowCountryModal(true) },
          ].map((c, idx) => (
            <div
              key={idx}
              onClick={c.action}
              className="bg-slate-50 dark:bg-navy-900/40 border border-gray-150 dark:border-white/5 rounded-[16px] py-6 hover:border-blue-600 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-navy-900 shadow-enterprise transition-all duration-300 cursor-pointer font-headline flex items-center justify-center min-h-[72px]"
            >
              <span>{c.label}</span>
            </div>
          ))}
        </div>

        {/* Countries Modal Overlay */}
        <AnimatePresence>
          {showCountryModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowCountryModal(false);
                setCountrySearch("");
              }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-navy-950 border border-gray-200 dark:border-white/10 rounded-[28px] w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl relative text-navy-900 dark:text-white transition-colors duration-200"
              >
                {/* Modal Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-150 dark:border-white/5 bg-slate-50 dark:bg-navy-900/20">
                  <div>
                    <h3 className="font-headline text-base font-bold text-navy-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-blue-650 dark:text-blue-400" />
                      <span>{tCountries("title")}</span>
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setShowCountryModal(false);
                      setCountrySearch("");
                    }}
                    className="text-gray-400 hover:text-navy-900 dark:hover:text-white p-2 rounded-xl bg-slate-100 dark:bg-navy-900 border border-gray-200 dark:border-white/5 transition-all text-xs font-bold font-sans"
                  >
                    ✕ Close
                  </button>
                </div>

                {/* Search Field */}
                <div className="p-6 border-b border-gray-150 dark:border-white/5 bg-white dark:bg-navy-950">
                  <div className="relative">
                    <Globe className="absolute left-4.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder={tCountries("searchCountries")}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-navy-900 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white rounded-2xl outline-none focus:border-blue-500 font-medium text-xs transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Grouped Regions and Countries */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                  {regionGroups.map((group, idx) => {
                    const filtered = group.countries.filter((c) =>
                      c.nameEn.toLowerCase().includes(countrySearch.toLowerCase()) ||
                      c.nameHi.toLowerCase().includes(countrySearch.toLowerCase())
                    );
                    if (filtered.length === 0) return null;

                    return (
                      <div key={idx} className="space-y-3">
                        <h4 className="flex items-center space-x-2 font-headline text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                          <Globe className="h-4 w-4 text-gold-500 shrink-0" />
                          <span>{tCountries(group.regionKey)}</span>
                        </h4>
                        <div className="flex flex-wrap gap-2.5">
                          {filtered.map((c) => (
                            <span
                              key={c.key}
                              className="bg-slate-50 dark:bg-navy-900 border border-gray-200 dark:border-white/5 text-navy-900 dark:text-white text-[11px] font-semibold px-4.5 py-2.5 rounded-full hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-200 shadow-enterprise cursor-default font-sans"
                            >
                              {tCountries(c.key)}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {regionGroups.every(
                    (group) =>
                      group.countries.filter(
                        (c) =>
                          c.nameEn.toLowerCase().includes(countrySearch.toLowerCase()) ||
                          c.nameHi.toLowerCase().includes(countrySearch.toLowerCase())
                      ).length === 0
                  ) && (
                    <div className="text-center py-12 text-gray-400 text-xs">
                      <Globe className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2 animate-pulse" />
                      <p>{tCountries("noSearchCountries")}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 8. Recruitment Process Section */}
      <section className="py-24 bg-slate-50 dark:bg-navy-900/10 border-y border-gray-100 dark:border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest font-headline">{tProcess("roadmapSubtitle")}</span>
          <h2 className="font-headline text-3xl font-extrabold text-navy-900 dark:text-white">{tProcess("title")}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-light font-headline">{tProcess("roadmapDesc")}</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 text-xs text-gray-600">
          {[
            { step: "01", t: tProcess("step1"), d: tProcess("step1Desc") },
            { step: "02", t: tProcess("step2"), d: tProcess("step2Desc") },
            { step: "03", t: tProcess("stepTrade"), d: tProcess("stepTradeDesc") },
            { step: "04", t: tProcess("stepMedical"), d: tProcess("stepMedicalDesc") },
            { step: "05", t: tProcess("step3"), d: tProcess("step3Desc") },
            { step: "06", t: tProcess("stepFlight"), d: tProcess("stepFlightDesc") },
          ].map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-navy-900/40 border border-gray-150 dark:border-white/5 rounded-[20px] p-6 shadow-enterprise space-y-3 hover:border-blue-500/25 dark:hover:border-blue-500/25 transition-all duration-300">
              <span className="font-headline text-2xl font-extrabold text-blue-500/20 block">{item.step}</span>
              <h4 className="font-bold text-navy-900 dark:text-white font-headline">{item.t}</h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed font-light">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Featured Jobs Section */}
      <section className="py-24 bg-white dark:bg-navy-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16">
          <div className="space-y-2">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest font-headline">{tJobs("activeOpeningsSubtitle")}</span>
            <h2 className="font-headline text-3xl font-extrabold text-navy-900 dark:text-white">{tJobs("latestDrivesTitle")}</h2>
          </div>
          <Link
            href="/jobs"
            className="border-2 border-blue-600/30 text-blue-600 hover:bg-blue-650 hover:text-white hover:border-blue-650 dark:text-blue-400 dark:border-blue-400/30 dark:hover:bg-blue-600 dark:hover:text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200"
          >
            {tJobs("siftAllJobsBtn")}
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {loadingJobs ? (
            <div className="col-span-3 text-center text-xs font-semibold py-12 dark:text-white">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-500 mx-auto mb-3" />
              <span>{tJobs("fetchingVacancies")}</span>
            </div>
          ) : jobs.length === 0 ? (
            <p className="col-span-3 text-center text-xs text-gray-400 py-12">{tJobs("noCurrentPostings")}</p>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="bg-white dark:bg-navy-900/40 border border-gray-150 dark:border-white/5 rounded-[24px] p-6 shadow-enterprise hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-80">
                <div className="space-y-3.5">
                  <div className="flex justify-between items-start">
                    <span className="bg-[#0B3D91]/10 text-navy-900 dark:text-blue-400 px-3 py-1 rounded-full text-[9px] uppercase font-bold tracking-wider">
                      {job.sector}
                    </span>
                  </div>
                  <h3 className="font-headline text-base font-bold text-navy-900 dark:text-white truncate mt-2">{job.title}</h3>
                  <p className="text-[10px] text-gray-450 dark:text-gray-400 font-semibold">{job.employer.companyName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light line-clamp-3 leading-relaxed mt-2">{job.description}</p>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center text-xs">
                  <span className="text-navy-900 dark:text-white font-bold">{job.country}</span>
                  <Link href="/jobs" className="text-blue-655 dark:text-blue-400 hover:text-blue-550 font-bold uppercase tracking-widest text-[10px] flex items-center hover:underline">
                    <span>{tNavbar("apply")}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 10. Success Stories & Testimonials */}
      <section className="py-24 bg-[#051B3D] text-white border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.06),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-blue-500 text-xs font-bold uppercase tracking-widest font-headline">{tTestimonials("subtitle")}</span>
            <h2 className="font-headline text-3xl font-extrabold text-white">{tTestimonials("endorsements")}</h2>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              {tTestimonials("desc")}
            </p>
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setTestimonialIndex((prev) => (prev - 1 + testimonialsLocal.length) % testimonialsLocal.length)}
                className="p-3 bg-[#0B3D91] border border-white/10 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 cursor-pointer"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonialsLocal.length)}
                className="p-3 bg-[#0B3D91] border border-white/10 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 cursor-pointer"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#0B3D91]/70 border border-white/5 rounded-[24px] p-8 backdrop-blur-sm space-y-6 shadow-2xl"
              >
                <p className="text-sm sm:text-base italic leading-relaxed text-gray-300 font-light">
                  "{testimonialsLocal[testimonialIndex].quote}"
                </p>
                <div>
                  <h4 className="font-headline text-blue-400 font-bold text-sm">
                    {testimonialsLocal[testimonialIndex].name}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5 tracking-wider font-headline">
                    {testimonialsLocal[testimonialIndex].role} | {testimonialsLocal[testimonialIndex].country}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 11. Client Logos */}
      <section className="py-16 bg-white dark:bg-navy-950 border-b border-gray-100 dark:border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-xs font-headline font-bold text-gray-450 tracking-wider">
            <span className="hover:text-blue-600 transition-colors cursor-default">{tTestimonials("logo1")}</span>
            <span className="hover:text-blue-600 transition-colors cursor-default">{tTestimonials("logo2")}</span>
            <span className="hover:text-blue-600 transition-colors cursor-default">{tTestimonials("logo3")}</span>
            <span className="hover:text-blue-600 transition-colors cursor-default">{tTestimonials("logo4")}</span>
          </div>
        </div>
      </section>

      {/* 12. FAQ Section */}
      <section className="py-24 bg-slate-50 dark:bg-navy-900/10 transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest font-headline">{tFaq("portalQueries")}</span>
            <h2 className="font-headline text-3xl font-extrabold text-navy-900 dark:text-white">{tFaq("title")}</h2>
          </div>

          <div className="space-y-4 font-sans text-xs">
            {faqs.map((faq, idx) => {
              const isOpen = activeFAQ === idx;
              return (
                <div key={idx} className="bg-white dark:bg-navy-900/40 border border-gray-150 dark:border-white/5 rounded-[20px] p-5 select-none transition-all shadow-enterprise">
                  <div
                    onClick={() => setActiveFAQ(isOpen ? null : idx)}
                    className="flex justify-between items-center cursor-pointer font-bold text-navy-900 dark:text-white text-sm font-headline"
                  >
                    <span>{faq.q}</span>
                    <span className="text-blue-600 font-bold text-base">{isOpen ? "−" : "+"}</span>
                  </div>
                  {isOpen && (
                    <p className="mt-4 text-gray-500 dark:text-gray-400 leading-relaxed font-light pt-4 border-t border-gray-100 dark:border-white/5">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 13. Blog Highlights */}
      <section className="py-24 bg-white dark:bg-navy-950 border-t border-gray-100 dark:border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest font-headline font-headline">{tBlog("newsFeed")}</span>
          <h2 className="font-headline text-3xl font-extrabold text-navy-900 dark:text-white">{tBlog("title")}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-light">{tBlog("desc")}</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: tBlog("post1Title"), cat: tBlog("post1Cat"), desc: tBlog("post1Desc") },
            { title: tBlog("post2Title"), cat: tBlog("post2Cat"), desc: tBlog("post2Desc") },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-navy-900/40 border border-gray-150 dark:border-white/5 rounded-[24px] p-8 hover:border-blue-500/30 dark:hover:border-blue-550/30 shadow-enterprise transition-all duration-300 flex flex-col justify-between h-64">
              <div className="space-y-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-[9px] uppercase tracking-wider font-headline">{item.cat}</span>
                <h4 className="font-headline text-base font-bold text-navy-900 dark:text-white mt-1">{item.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed">{item.desc}</p>
              </div>
              <Link href="/blog" className="text-navy-900 dark:text-gray-300 hover:text-blue-650 dark:hover:text-blue-400 font-bold uppercase tracking-widest text-[9px] inline-flex items-center space-x-1 mt-4">
                <span>{tBlog("readMore")}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 14. CRM Contact & Callback Form */}
      <section className="py-24 bg-slate-50 dark:bg-navy-900/10 border-t border-gray-100 dark:border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest font-headline">{tForm("subtitle")}</span>
            <h2 className="font-headline text-3xl font-extrabold text-navy-900 dark:text-white leading-tight">
              {tForm("title")}
            </h2>
            <p className="text-xs sm:text-sm text-gray-550 dark:text-gray-400 leading-relaxed font-light">
              {tForm("desc")}
            </p>
            <div className="flex flex-col gap-3 font-semibold text-xs text-navy-900 dark:text-white pt-2 space-y-1">
              <span className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <span>+91 93105 89800 / +91 82879 85415 / +91 78397 07378</span>
              </span>
              <span className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <span>ramainternationalindia2@gmail.com</span>
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-900/40 border border-gray-150 dark:border-white/5 rounded-[32px] p-6 sm:p-8 shadow-enterprise">
            {contactSuccess ? (
              <div className="p-4 bg-green-50 border border-green-200 text-green-850 rounded-xl text-xs font-semibold">
                {tForm("successMsg")}
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs font-semibold text-gray-500">
                <div>
                  <label className="block mb-1.5 text-navy-900 dark:text-white font-headline">{tForm("name")} *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-navy-950 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-navy-900 transition-all text-navy-900 dark:text-white font-medium font-sans"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5 text-navy-900 dark:text-white font-headline">{tForm("email")} *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-navy-950 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-navy-900 transition-all text-navy-900 dark:text-white font-medium font-sans"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-navy-900 dark:text-white font-headline">{tForm("company")} *</label>
                    <input
                      type="text"
                      required
                      value={contactCompany}
                      onChange={(e) => setContactCompany(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-navy-950 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-navy-900 transition-all text-navy-900 dark:text-white font-medium font-sans"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1.5 text-navy-900 dark:text-white font-headline">{tForm("message")} *</label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder={tForm("placeholderMsg")}
                    className="w-full bg-slate-50 dark:bg-navy-950 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-navy-900 transition-all text-navy-900 dark:text-white font-medium resize-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={contactLoading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-4 rounded-full flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 text-[10px] border border-blue-500/20 shadow-lg hover:shadow-blue-500/10 transition-all font-headline"
                >
                  {contactLoading ? (
                    <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>{tForm("submit")}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
