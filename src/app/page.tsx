"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  ArrowUpRight,
  RefreshCw,
  Send,
  Sparkles,
  MessageCircle,
  HelpCircle,
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
      q: "What is RAMA INTERNATIONAL-INDIA's licensing status in India?",
      a: "We are fully authorized and licensed by the Ministry of External Affairs (MEA), Government of India (Lic No: RC-B-0850/DEL/COM/1000+/5/9385/2018). This status permits us to recruit unlimited manpower globally.",
    },
    {
      q: "Where are your trade testing and training centers located?",
      a: "Our state-of-the-art trade testing yards are located in New Delhi (Dwarka) and Mumbai. These centers feature full setups for practical welding (6G), industrial electrical panels, HVAC rigging, plumbing, and civil construction mockups.",
    },
    {
      q: "What is your standard turnaround time for GCC mobilization?",
      a: "Typically, the timeline from selection to flight departure takes 25 to 40 days. This duration includes medical diagnostics, biometric registrations, degree attestation by embassy portals, and visa stamping.",
    },
    {
      q: "How do you verify the technical skills of candidates?",
      a: "Every candidate undergoes strict practical screening guided by international standards. We perform rigorous trade tests and maintain detailed grading records, which are shared with clients prior to official select signatures.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-navy-900 font-sans">
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
            <div className="inline-flex items-center space-x-2 bg-blue-600/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-blue-500 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5 text-gold-500" />
              <span>Government Registered Sourcing Agency</span>
            </div>

            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Leading International <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-gold-400">Recruitment</span> &amp; Manpower
            </h1>

            <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Bridging the gap between premier global enterprises and top-tier specialized talent. We deliver compliant, end-to-end recruitment pipelines from sourcing to final consular visa stamping.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 font-bold text-xs">
              <Link
                href="/contact"
                className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-500 text-white uppercase tracking-wider px-8 py-4.5 rounded-full shadow-lg hover:shadow-blue-500/15 transition-all duration-300 font-bold border border-blue-500/20 hover:-translate-y-0.5 active:scale-95"
              >
                Hire Talent
              </Link>
              <Link
                href="/jobs"
                className="w-full sm:w-auto text-center border-2 border-white/20 text-white hover:bg-white hover:text-navy-950 uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300 font-bold hover:-translate-y-0.5 active:scale-95"
              >
                Explore Opportunities
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
                <span className="font-headline text-xs font-bold text-blue-500 tracking-wider">LIVE RECRUITMENT DEMAND</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              
              <div className="space-y-3.5 text-xs">
                {[
                  { title: "Staff Nurse (ICU)", country: "Germany Desk", s: "Healthcare" },
                  { title: "6G Pipe Welder", country: "Almarai Foods / KSA", s: "Manufacturing" },
                  { title: "Structural Estimator", country: "Sterling Projects / UAE", s: "Construction" },
                  { title: "Safety Inspector", country: "Qatar Energy / Doha", s: "Energy" },
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
              { val: 10000, suf: "+", label: "Placements" },
              { val: 250, suf: "+", label: "Global Clients" },
              { val: 18, suf: "+", label: "Countries Served" },
              { val: 100, suf: "%", label: "Satisfaction" },
              { val: 2018, suf: "", label: "Established", isStatic: true },
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
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest font-headline">Enterprise Leadership</span>
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-navy-900 leading-tight">
              Redefining Global Human Resources with Integrity
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
              Under the leadership of Founder &amp; MD Deepak Chauhan, RAMA INTERNATIONAL-INDIA has scaled to become one of India's premier international manpower consultancy structures. We bridge the critical technical gap between qualified Indian tradespeople and global enterprise employers, managing the entire lifecycle of overseas hiring with absolute compliance and speed.
            </p>
            <div className="p-6 bg-slate-50 rounded-[20px] border border-gray-100 text-xs font-medium space-y-2.5">
              <p className="font-bold text-navy-900 font-headline">MEA Government Licensure Details:</p>
              <p className="text-gray-500 font-light">Registration No: <span className="font-bold text-navy-900">Lic: RC-B-0850/DEL/COM/1000+/5/9385/2018</span></p>
              <p className="text-gray-500 font-light">Vetted and authorized for unlimited worldwide recruitment deployment.</p>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="w-full max-w-md bg-slate-50 border border-gray-150 rounded-[24px] p-8 shadow-enterprise space-y-6">
              <h3 className="font-headline text-lg font-bold text-navy-900">Our Core Mandates</h3>
              <div className="space-y-5 text-xs font-light text-gray-650">
                <div className="flex items-start space-x-3.5">
                  <CheckCircle className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-navy-900">Government Attestation Desk</h4>
                    <p className="text-[11px] mt-0.5">Attesting degree and trade records through official Ministry of External Affairs portals.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3.5">
                  <CheckCircle className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-navy-900">Biometrics &amp; VFS Tracking</h4>
                    <p className="text-[11px] mt-0.5">Partnering with regional VFS centers for seamless finger-scan logging and medical clearances.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3.5">
                  <CheckCircle className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-navy-900">Trade Yard Evaluations</h4>
                    <p className="text-[11px] mt-0.5">Rigorous practical skills testing inside our certified New Delhi (Dwarka) and Mumbai yards.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us Section */}
      <section className="py-24 bg-slate-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest font-headline">Our Strategic Edge</span>
          <h2 className="font-headline text-3xl font-extrabold text-navy-900">Why Global Enterprises Partner With RAMA</h2>
          <p className="text-xs text-gray-500 max-w-lg mx-auto font-light">We engineer trust, compliance, and efficiency at every step of global workforce deployments.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Certified Sourcing Yards", desc: "Our physical testing yards in Delhi & Mumbai evaluate HVAC, electrical, welding, and civil trades under strict industrial criteria.", icon: Building },
            { title: "MEA eMigrate Compliant", desc: "100% compliant with eMigrate registrations, ensuring legally authenticated, penalty-free mobilizations across GCC and Europe.", icon: ShieldCheck },
            { title: "Proprietary ATS Pipelines", desc: "Our enterprise platform enables corporate clients to track candidate selection status, biometrics, and stamps in real time.", icon: Activity },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white border border-gray-150 rounded-[24px] p-8 shadow-enterprise hover:-translate-y-1 hover:shadow-lg hover:border-blue-500/20 transition-all duration-300 space-y-5">
                <div className="h-12 w-12 bg-blue-600/5 text-blue-650 rounded-xl flex items-center justify-center border border-blue-500/10">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-headline font-bold text-navy-900 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest font-headline">Recruitment Solutions</span>
          <h2 className="font-headline text-3xl font-extrabold text-navy-900">Premium Manpower Solutions</h2>
          <p className="text-xs text-gray-500 max-w-lg mx-auto font-light">Customized recruitment pathways structured for world-class international hiring.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Permanent Recruitment", slug: "permanent-recruitment", desc: "Long-term staffing solutions connecting your organization with high-caliber Indian professionals.", icon: Users },
            { title: "Bulk Hiring Drives", slug: "bulk-hiring", desc: "Large-scale mobilization campaigns for heavy industries, including testing, medicals, and stamping.", icon: TrendingUp },
            { title: "Executive Search", slug: "executive-search", desc: "C-suite and senior leadership headhunting for critical healthcare, engineering, and energy boards.", icon: Award },
            { title: "Skilled Labour Supply", slug: "skilled-labour-supply", desc: "Highly-qualified technical technicians vetted by certified trade test yard evaluations.", icon: Briefcase },
            { title: "Visa & Stamping Assist", slug: "overseas-placement", desc: "Complete logistics management including GAMCA medical checkups and embassy stamped visas.", icon: Plane },
            { title: "HR Consulting", slug: "hr-consultancy", desc: "Strategic advice on labor compliance, MEA regulations, and local compensation trends.", icon: ShieldCheck },
          ].map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div key={idx} className="bg-white border border-gray-150 rounded-[24px] p-8 shadow-enterprise hover:-translate-y-1 hover:shadow-lg hover:border-blue-500/20 transition-all duration-300 flex flex-col justify-between h-80 group">
                <div className="space-y-4">
                  <div className="h-12 w-12 bg-blue-600/5 text-blue-650 rounded-xl flex items-center justify-center border border-blue-500/10 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-headline text-base font-bold text-navy-900 group-hover:text-blue-600 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">{svc.desc}</p>
                </div>
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/services/${svc.slug}`}
                    className="inline-flex items-center space-x-1 text-blue-600 font-bold uppercase tracking-widest text-[10px] hover:underline"
                  >
                    <span>Read Details</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Industries We Serve Section */}
      <section className="py-24 bg-slate-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest font-headline">Sectors We Empower</span>
          <h2 className="font-headline text-3xl font-extrabold text-navy-900">Industries We Serve Globally</h2>
          <p className="text-xs text-gray-500 max-w-lg mx-auto font-light">Customized sourcing models built for specific technical industries.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { name: "Healthcare", desc: "Clinicians & Nurses", icon: "medical_services" },
            { name: "Construction", desc: "Civil Infrastructure", icon: "construction" },
            { name: "Oil & Gas", desc: "Energy Technicians", icon: "oil_barrel" },
            { name: "Hospitality", desc: "F&B Personnel", icon: "apartment" },
            { name: "Logistics", desc: "Fleet Operators", icon: "local_shipping" },
            { name: "Manufacturing", desc: "Assembly Boards", icon: "precision_manufacturing" },
          ].map((ind, idx) => (
            <div key={idx} className="bg-white border border-gray-150 rounded-[20px] p-6 text-center shadow-enterprise hover:border-blue-600 hover:shadow-md transition-all duration-300 cursor-pointer group">
              <span className="material-symbols-outlined text-gold-500 text-4xl mb-3 group-hover:scale-110 transition-transform">{ind.icon}</span>
              <h4 className="font-headline font-bold text-navy-900 text-xs">{ind.name}</h4>
              <p className="text-[10px] text-gray-400 font-light mt-1">{ind.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Countries We Recruit For */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest font-headline">Global Reach</span>
          <h2 className="font-headline text-3xl font-extrabold text-navy-900">Countries We Recruit For</h2>
          <p className="text-xs text-gray-500 max-w-lg mx-auto font-light">Deploying talent across primary GCC corridors and international desks.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4 text-center font-bold text-xs text-navy-900">
          {["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Bahrain", "Europe", "Singapore", "Canada"].map((c, idx) => (
            <div key={idx} className="bg-slate-50 border border-gray-150 rounded-[16px] py-6 hover:border-blue-600 hover:bg-white shadow-enterprise transition-all duration-300 cursor-pointer font-headline">
              <span>{c}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Recruitment Process Section */}
      <section className="py-24 bg-slate-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest font-headline">Hiring Roadmap</span>
          <h2 className="font-headline text-3xl font-extrabold text-navy-900">Our Six-Step Deployment Blueprint</h2>
          <p className="text-xs text-gray-500 max-w-lg mx-auto font-light">From candidate sourcing to the final flight mobilization.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 text-xs text-gray-600">
          {[
            { step: "01", t: "Demand Vetting", d: "Sourcing details and MEA approvals." },
            { step: "02", t: "Talent Vetting", d: "Filtering candidates from database." },
            { step: "03", t: "Trade Testing", d: "Practical assessments at our yards." },
            { step: "04", t: "Medical Check", d: "Wafid fit clearances & certifications." },
            { step: "05", t: "Consulate Stamp", d: "Stamping visas via target embassies." },
            { step: "06", t: "Flight Bookings", d: "Final coordination and site reporting." },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-150 rounded-[20px] p-6 shadow-enterprise space-y-3 hover:border-blue-500/20 transition-all duration-300">
              <span className="font-headline text-2xl font-extrabold text-blue-500/20 block">{item.step}</span>
              <h4 className="font-bold text-navy-900 font-headline">{item.t}</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed font-light">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Featured Jobs Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16">
          <div className="space-y-2">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest font-headline">Active Openings</span>
            <h2 className="font-headline text-3xl font-extrabold text-navy-900">Latest Recruitment Drives</h2>
          </div>
          <Link
            href="/jobs"
            className="border-2 border-blue-600/30 text-blue-600 hover:bg-blue-650 hover:text-white hover:border-blue-650 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200"
          >
            Sift All Jobs
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {loadingJobs ? (
            <div className="col-span-3 text-center text-xs font-semibold py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-500 mx-auto mb-3" />
              <span>Fetching vacancies...</span>
            </div>
          ) : jobs.length === 0 ? (
            <p className="col-span-3 text-center text-xs text-gray-400 py-12">No current postings found.</p>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="bg-white border border-gray-150 rounded-[24px] p-6 shadow-enterprise hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-80">
                <div className="space-y-3.5">
                  <div className="flex justify-between items-start">
                    <span className="bg-[#0B3D91]/10 text-navy-900 px-3 py-1 rounded-full text-[9px] uppercase font-bold tracking-wider">
                      {job.sector}
                    </span>
                  </div>
                  <h3 className="font-headline text-base font-bold text-navy-900 truncate mt-2">{job.title}</h3>
                  <p className="text-[10px] text-gray-450 font-semibold">{job.employer.companyName}</p>
                  <p className="text-xs text-gray-500 font-light line-clamp-3 leading-relaxed mt-2">{job.description}</p>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                  <span className="text-navy-900 font-bold">{job.country}</span>
                  <Link href="/jobs" className="text-blue-655 hover:text-blue-550 font-bold uppercase tracking-widest text-[10px] flex items-center hover:underline">
                    <span>Easy Apply</span>
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
            <span className="text-blue-500 text-xs font-bold uppercase tracking-widest font-headline">Global Feedback</span>
            <h2 className="font-headline text-3xl font-extrabold text-white">Partner Endorsements</h2>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              See what our international corporate clients say about our vetting yards and visa turnaround.
            </p>
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setTestimonialIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                className="p-3 bg-[#0B3D91] border border-white/10 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 cursor-pointer"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length)}
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
                  "{TESTIMONIALS[testimonialIndex].quote}"
                </p>
                <div>
                  <h4 className="font-headline text-blue-400 font-bold text-sm">
                    {TESTIMONIALS[testimonialIndex].name}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5 tracking-wider font-headline">
                    {TESTIMONIALS[testimonialIndex].role} | {TESTIMONIALS[testimonialIndex].country}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 11. Client Logos */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-xs font-headline font-bold text-gray-400 tracking-wider">
            <span className="hover:text-blue-600 transition-colors cursor-default">ALMARAI FOODS</span>
            <span className="hover:text-blue-600 transition-colors cursor-default">STERLING PROJECTS</span>
            <span className="hover:text-blue-600 transition-colors cursor-default">QATAR PETRO GAS</span>
            <span className="hover:text-blue-600 transition-colors cursor-default">SAUDI GERMAN HOSPITALS</span>
          </div>
        </div>
      </section>

      {/* 12. FAQ Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest font-headline">Portal Queries</span>
            <h2 className="font-headline text-3xl font-extrabold text-navy-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4 font-sans text-xs">
            {faqs.map((faq, idx) => {
              const isOpen = activeFAQ === idx;
              return (
                <div key={idx} className="bg-white border border-gray-150 rounded-[20px] p-5 select-none transition-all shadow-enterprise">
                  <div
                    onClick={() => setActiveFAQ(isOpen ? null : idx)}
                    className="flex justify-between items-center cursor-pointer font-bold text-navy-900 text-sm font-headline"
                  >
                    <span>{faq.q}</span>
                    <span className="text-blue-600 font-bold text-base">{isOpen ? "−" : "+"}</span>
                  </div>
                  {isOpen && (
                    <p className="mt-4 text-gray-500 leading-relaxed font-light pt-4 border-t border-gray-100">
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
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest font-headline">News Feed</span>
          <h2 className="font-headline text-3xl font-extrabold text-navy-900">Visa Stamping &amp; Labor Insights</h2>
          <p className="text-xs text-gray-500 max-w-lg mx-auto font-light">Keep up with consulate queues, credential checks, and global salary changes.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: "GCC Visa Stamping Updates for 2026", cat: "Consulate Updates", desc: "Read latest rules regarding biometrics collection schedules and attestation updates required by Saudi Arabian embassies." },
            { title: "Germany Sourcing Desk: Critical Nursing Credentials", cat: "Industry Insights", desc: "Detailing language training modules and credential attestation steps for nurses to report to Munich hospitals." },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 border border-gray-150 rounded-[24px] p-8 hover:border-blue-500/30 shadow-enterprise transition-all duration-300 flex flex-col justify-between h-64">
              <div className="space-y-3">
                <span className="text-blue-600 font-bold text-[9px] uppercase tracking-wider font-headline">{item.cat}</span>
                <h4 className="font-headline text-base font-bold text-navy-900 mt-1">{item.title}</h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed">{item.desc}</p>
              </div>
              <Link href="/blog" className="text-navy-900 hover:text-blue-650 font-bold uppercase tracking-widest text-[9px] inline-flex items-center space-x-1 mt-4">
                <span>Read Full Article</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 14. CRM Contact & Callback Form */}
      <section className="py-24 bg-slate-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest font-headline">Connect Today</span>
            <h2 className="font-headline text-3xl font-extrabold text-navy-900 leading-tight">
              Ready to Source Technical Candidates from India?
            </h2>
            <p className="text-xs sm:text-sm text-gray-550 leading-relaxed font-light">
              Submit your project specifications or callback number, and a RAMA client relations manager will contact you within 24 business hours.
            </p>
            <div className="flex flex-col gap-3 font-semibold text-xs text-navy-900 pt-2 space-y-1">
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

          <div className="bg-white border border-gray-150 rounded-[32px] p-6 sm:p-8 shadow-enterprise">
            {contactSuccess ? (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-semibold">
                Corporate callback logged successfully! A consultant will contact your office shortly.
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs font-semibold text-gray-500">
                <div>
                  <label className="block mb-1.5 text-navy-900 font-headline">Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-600 focus:bg-white transition-all text-navy-900 font-medium font-sans"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5 text-navy-900 font-headline">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-600 focus:bg-white transition-all text-navy-900 font-medium font-sans"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-navy-900 font-headline">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={contactCompany}
                      onChange={(e) => setContactCompany(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-600 focus:bg-white transition-all text-navy-900 font-medium font-sans"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1.5 text-navy-900 font-headline">Requirements Summary *</label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Outline number of workers needed, trade testing parameters, etc..."
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-600 focus:bg-white transition-all text-navy-900 font-medium resize-none font-sans"
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
                      <span>Submit Inquiry</span>
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
