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
  FileText,
  UserCheck,
  Plane,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  HelpCircle,
  BookOpen,
  Building,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  ExternalLink,
  RefreshCw,
  Send,
  Sparkles,
  MessageCircle,
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
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex items-center bg-[#020C1B] text-white pt-28 pb-16 overflow-hidden">
        {/* Abstract grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af3705_1px,transparent_1px),linear-gradient(to_bottom,#d4af3705_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06),transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center space-x-2 bg-gold-500/10 border border-gold-500/20 px-4 py-2 rounded-full text-gold-500 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Government Registered Sourcing Agency</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
              Connecting Global Talent <br />
              with <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500">World-Class</span> Opportunities
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light font-sans">
              From Interview to Visa: Your Complete Global Recruitment Partner. RAMA INTERNATIONAL-INDIA recruits qualified healthcare, construction, energy, and engineering candidates for multinational clients globally.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 font-sans font-bold text-xs">
              <Link
                href="/contact"
                className="w-full sm:w-auto text-center bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 uppercase tracking-wider px-8 py-4.5 rounded-lg shadow-lg hover:shadow-gold-500/10 transition-all cursor-pointer font-bold"
              >
                Hire Talent
              </Link>
              <Link
                href="/jobs"
                className="w-full sm:w-auto text-center border border-gold-500/30 text-gold-500 hover:bg-gold-500 hover:text-navy-950 uppercase tracking-wider px-8 py-4.5 rounded-lg transition-all cursor-pointer font-bold"
              >
                Apply for Jobs
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
            <div className="w-full max-w-sm bg-navy-900/40 border border-gold-500/15 rounded-2xl shadow-2xl p-6 backdrop-blur-md relative overflow-hidden animate-float">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex justify-between items-center pb-4 border-b border-gold-500/10 mb-6">
                <span className="font-serif text-xs font-bold text-gold-500 tracking-wider">LIVE RECRUITMENT DEMAND</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              
              <div className="space-y-3.5 text-xs">
                {[
                  { title: "Staff Nurse (ICU)", country: "Germany Desk", s: "Healthcare" },
                  { title: "6G Pipe Welder", country: "Almarai Foods / KSA", s: "Manufacturing" },
                  { title: "Structural Estimator", country: "Sterling Projects / UAE", s: "Construction" },
                  { title: "Safety Inspector", country: "Qatar Energy / Doha", s: "Energy" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-navy-950/40 border border-gold-500/5 p-3.5 rounded-xl flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-200">{item.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{item.country}</p>
                    </div>
                    <span className="bg-gold-500/10 text-gold-500 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
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
      <section className="bg-[#020C1B] border-t border-gold-500/20 py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            <div>
              <p className="font-serif text-3xl font-extrabold text-gold-500">
                <Counter value={10000} suffix="+" />
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Placements</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-extrabold text-gold-500">
                <Counter value={250} suffix="+" />
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Clients</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-extrabold text-gold-500">
                <Counter value={18} suffix="+" />
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Countries Served</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-extrabold text-gold-500">
                <Counter value={100} suffix="%" />
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Satisfaction</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="font-serif text-3xl font-extrabold text-gold-500">
                2018
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Established</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. About Us Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-gold-600 text-xs font-bold uppercase tracking-widest">Enterprise Leadership</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-900 leading-tight">
              Deepak Chauhan Vision: <br />
              Your Complete Sourcing Partner
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
              Under the leadership of Founder & MD Deepak Chauhan, RAMA INTERNATIONAL-INDIA has scaled to become one of India's premier international manpower consultancy structures. We bridge the critical technical gap between qualified Indian tradespeople and global enterprise employers.
            </p>
            <div className="p-5 bg-luxury-light rounded-xl border border-gray-200 text-xs font-medium space-y-2">
              <p className="font-bold text-navy-900">MEA Government Licensure Details:</p>
              <p className="text-gray-500 font-light">Registration No: **Lic: RC-B-0850/DEL/COM/1000+/5/9385/2018**</p>
              <p className="text-gray-500 font-light">Vetted and authorized for unlimited worldwide recruitment deployment.</p>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="w-full max-w-md bg-luxury-light border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
              <h3 className="font-serif font-bold text-navy-900">Our Core Mandates</h3>
              <div className="space-y-4 text-xs font-light text-gray-600">
                <div className="flex items-start space-x-3.5">
                  <CheckCircle className="h-5 w-5 text-gold-500 shrink-0" />
                  <p>**Government Attestation Desk**: Attesting degree and trade records through the MEA portals.</p>
                </div>
                <div className="flex items-start space-x-3.5">
                  <CheckCircle className="h-5 w-5 text-gold-500 shrink-0" />
                  <p>**Biometrics Tracking**: Partnering with regional VFS centers for quick finger-scan logs.</p>
                </div>
                <div className="flex items-start space-x-3.5">
                  <CheckCircle className="h-5 w-5 text-gold-500 shrink-0" />
                  <p>**Trade Yard testing**: Rigorous practical skills examinations inside our Delhi & Mumbai yards.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us Section */}
      <section className="py-24 bg-luxury-light border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
          <span className="text-gold-600 text-xs font-bold uppercase tracking-widest">Our Strategic Edge</span>
          <h2 className="font-serif text-3xl font-extrabold text-navy-900">Why Global Enterprises Partner With RAMA</h2>
          <p className="text-xs text-gray-500 max-w-lg mx-auto font-light">We engineer trust and efficiency at every step of global workforce deployments.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Certified Sourcing Yards", desc: "Our physical testing yards in Delhi & Mumbai evaluate HVAC, electrical, welding, and civil trades under strict criteria.", icon: Building },
            { title: "MEA eMigrate Portal Vetted", desc: "100% compliant with eMigrate registrations, ensuring legally authenticated, penalty-free mobilizations.", icon: ShieldCheck },
            { title: "Proprietary ATS Pipelines", desc: "Our SaaS portal enables corporate clients to track candidate status, biometrics, and stamps in real time.", icon: Activity },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all space-y-4">
                <div className="h-10 w-10 bg-navy-900 text-gold-500 rounded-lg flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif font-bold text-navy-900 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
          <span className="text-gold-600 text-xs font-bold uppercase tracking-widest">Recruitment Solutions</span>
          <h2 className="font-serif text-3xl font-extrabold text-navy-900">Comprehensive Manpower Services</h2>
          <p className="text-xs text-gray-500 max-w-lg mx-auto font-light">Customized recruitment pathways structured for international recruitment.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Permanent Recruitment", slug: "permanent-recruitment", desc: "Long-term staffing solutions connecting your organization with high-caliber Indian professionals." },
            { title: "Bulk Hiring Drives", slug: "bulk-hiring", desc: "Large-scale mobilization campaigns for heavy industries, including testing and stamping." },
            { title: "Executive Search", slug: "executive-search", desc: "C-suite and senior leadership headhunting for critical healthcare, engineering, and energy boards." },
            { title: "Skilled Labour Supply", slug: "skilled-labour-supply", desc: "Highly-qualified technical technicians vetted by certified trade test yard evaluations." },
            { title: "Visa & Stamping Assist", slug: "overseas-placement", desc: "Complete logistics management including GAMCA medical checkups and embassy stamped visas." },
            { title: "HR Consulting", slug: "hr-consultancy", desc: "Strategic advice on labor compliance, MEA regulations, and local compensation trends." },
          ].map((svc, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between h-64 group">
              <div className="space-y-4">
                <h3 className="font-serif text-md font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                  {svc.title}
                </h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">{svc.desc}</p>
              </div>
              <Link
                href={`/services/${svc.slug}`}
                className="inline-flex items-center space-x-1 text-gold-600 font-bold uppercase tracking-widest text-[10px] hover:underline"
              >
                <span>Learn More</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Industries We Serve Section */}
      <section className="py-24 bg-luxury-light border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
          <span className="text-gold-600 text-xs font-bold uppercase tracking-widest">Target Verticals</span>
          <h2 className="font-serif text-3xl font-extrabold text-navy-900">Industries We Serve Globally</h2>
          <p className="text-xs text-gray-500 max-w-lg mx-auto font-light">Customized sourcing models built for specific technical industries.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { name: "Healthcare", desc: "Clinicians & Nurses" },
            { name: "Construction", desc: "Civil Infrastructure" },
            { name: "Oil & Gas", desc: "Energy Technicians" },
            { name: "Hospitality", desc: "F&B Personnel" },
            { name: "Logistics", desc: "Fleet Operators" },
            { name: "Manufacturing", desc: "Assembly Boards" },
          ].map((ind, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm space-y-2 hover:border-gold-500 transition-colors">
              <h4 className="font-serif font-bold text-navy-900 text-xs">{ind.name}</h4>
              <p className="text-[10px] text-gray-400 font-light">{ind.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Countries We Recruit For */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
          <span className="text-gold-600 text-xs font-bold uppercase tracking-widest">Global Reach</span>
          <h2 className="font-serif text-3xl font-extrabold text-navy-900">Countries We Recruit For</h2>
          <p className="text-xs text-gray-500 max-w-lg mx-auto font-light">Deploying talent across primary GCC corridors and international desks.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4 text-center font-bold text-xs text-navy-900">
          {["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Bahrain", "Europe", "Singapore", "Canada"].map((c, idx) => (
            <div key={idx} className="bg-luxury-light border border-gray-200 rounded-xl py-6 hover:border-gold-500 transition-colors">
              <span>{c}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Recruitment Process Section */}
      <section className="py-24 bg-luxury-light border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
          <span className="text-gold-600 text-xs font-bold uppercase tracking-widest">Hiring Roadmap</span>
          <h2 className="font-serif text-3xl font-extrabold text-navy-900">Our Six-Step Deployment Blueprint</h2>
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
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-2">
              <span className="font-serif text-2xl font-extrabold text-gold-500/30">{item.step}</span>
              <h4 className="font-bold text-navy-900">{item.t}</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed font-light">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Featured Jobs Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16">
          <div className="space-y-2">
            <span className="text-gold-600 text-xs font-bold uppercase tracking-widest">Active Openings</span>
            <h2 className="font-serif text-3xl font-extrabold text-navy-900">Latest Recruitment Drives</h2>
          </div>
          <Link
            href="/jobs"
            className="border border-gold-500/30 text-gold-600 hover:bg-gold-500 hover:text-navy-950 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
          >
            Sift All Jobs
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {loadingJobs ? (
            <div className="col-span-3 text-center text-xs font-semibold py-8">
              <RefreshCw className="h-5 w-5 animate-spin text-gold-500 mx-auto mr-2" />
              <span>Fetching vacancies...</span>
            </div>
          ) : jobs.length === 0 ? (
            <p className="col-span-3 text-center text-xs text-gray-400 py-8">No current postings found.</p>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between h-72">
                <div className="space-y-3.5">
                  <span className="bg-navy-900 text-gold-500 px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider">
                    {job.sector}
                  </span>
                  <h3 className="font-serif text-md font-bold text-navy-900 truncate">{job.title}</h3>
                  <p className="text-[10px] text-gray-400 font-semibold">{job.employer.companyName}</p>
                  <p className="text-xs text-gray-500 font-light line-clamp-3 leading-relaxed mt-2">{job.description}</p>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                  <span className="text-navy-900 font-bold">{job.country}</span>
                  <Link href="/jobs" className="text-gold-600 font-bold uppercase tracking-widest text-[10px] flex items-center hover:underline">
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
      <section className="py-24 bg-navy-900 text-white border-y border-gold-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-gold-500 text-xs font-bold uppercase tracking-widest">Global Feedback</span>
            <h2 className="font-serif text-3xl font-extrabold text-white">Partner Endorsements</h2>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              See what our international corporate clients say about our vetting yards and visa turnaround.
            </p>
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setTestimonialIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                className="p-3 bg-navy-950 border border-gold-500/20 text-gold-500 rounded-lg hover:bg-gold-500 hover:text-navy-950 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length)}
                className="p-3 bg-navy-950 border border-gold-500/20 text-gold-500 rounded-lg hover:bg-gold-500 hover:text-navy-950 transition-all cursor-pointer"
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
                className="bg-navy-950/60 border border-gold-500/10 rounded-2xl p-8 backdrop-blur-sm space-y-6"
              >
                <p className="text-sm italic leading-relaxed text-gray-300 font-light">
                  "{TESTIMONIALS[testimonialIndex].quote}"
                </p>
                <div>
                  <h4 className="font-serif text-gold-500 font-bold text-sm">
                    {TESTIMONIALS[testimonialIndex].name}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5 tracking-wider">
                    {TESTIMONIALS[testimonialIndex].role} | {TESTIMONIALS[testimonialIndex].country}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 11. Client Logos */}
      <section className="py-16 bg-white border-b border-gray-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-xs font-serif font-bold text-gray-400 tracking-wider">
            <span className="hover:text-gold-500 transition-colors">ALMARAI FOODS</span>
            <span className="hover:text-gold-500 transition-colors">STERLING PROJECTS</span>
            <span className="hover:text-gold-500 transition-colors">QATAR PETRO GAS</span>
            <span className="hover:text-gold-500 transition-colors">SAUDI GERMAN HOSPITALS</span>
          </div>
        </div>
      </section>

      {/* 12. FAQ Section */}
      <section className="py-24 bg-luxury-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-gold-600 text-xs font-bold uppercase tracking-widest">Portal Queries</span>
            <h2 className="font-serif text-3xl font-extrabold text-navy-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4 font-sans text-xs">
            {faqs.map((faq, idx) => {
              const isOpen = activeFAQ === idx;
              return (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 select-none transition-all">
                  <div
                    onClick={() => setActiveFAQ(isOpen ? null : idx)}
                    className="flex justify-between items-center cursor-pointer font-bold text-navy-900 text-sm"
                  >
                    <span>{faq.q}</span>
                    <span className="text-gold-500 font-bold">{isOpen ? "−" : "+"}</span>
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
      <section className="py-24 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
          <span className="text-gold-600 text-xs font-bold uppercase tracking-widest">News Feed</span>
          <h2 className="font-serif text-3xl font-extrabold text-navy-900">Visa Stamping & Labor Insights</h2>
          <p className="text-xs text-gray-500 max-w-lg mx-auto font-light">Keep up with consulate queues, credential checks, and global salary changes.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: "GCC Visa Stamping Updates for 2026", cat: "Consulate Updates", desc: "Read latest rules regarding biometrics collection schedules and attestation updates required by Saudi Arabian embassies." },
            { title: "Germany Sourcing Desk: Critical Nursing Credentials", cat: "Industry Insights", desc: "Detailing language training modules and credential attestation steps for nurses to report to Munich hospitals." },
          ].map((item, idx) => (
            <div key={idx} className="bg-luxury-light border border-gray-200 rounded-xl p-8 hover:border-gold-500 transition-colors flex flex-col justify-between h-64">
              <div className="space-y-3">
                <span className="text-gold-600 font-bold text-[9px] uppercase tracking-wider">{item.cat}</span>
                <h4 className="font-serif text-md font-bold text-navy-900">{item.title}</h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed">{item.desc}</p>
              </div>
              <Link href="/blog" className="text-navy-900 hover:text-gold-600 font-bold uppercase tracking-widest text-[9px] inline-flex items-center space-x-1 mt-4">
                <span>Read Full Article</span>
                <ChevronRight className="h-4.5 w-4.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 14. CRM Contact & Callback Form */}
      <section className="py-24 bg-luxury-light border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-gold-600 text-xs font-bold uppercase tracking-widest">Connect Today</span>
            <h2 className="font-serif text-3xl font-extrabold text-navy-900 leading-tight">
              Ready to Sourced Technical Candidates from India?
            </h2>
            <p className="text-xs sm:text-sm text-gray-550 leading-relaxed font-light">
              Submit your project specifications or callback number, and a RAMA client relations manager will contact you within 24 business hours.
            </p>
            <div className="flex flex-col gap-3 font-semibold text-xs text-navy-900 pt-2">
              <span className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gold-500" />
                <span>+91 11 4056 9385 / +91 98188 56000</span>
              </span>
              <span className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gold-500" />
                <span>corporate@ramainternational.in</span>
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            {contactSuccess ? (
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded text-xs font-semibold">
                Corporate callback logged successfully! A consultant will contact your office shortly.
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs font-semibold text-gray-500">
                <div>
                  <label className="block mb-1 text-navy-900">Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-luxury-light border border-gray-200 rounded p-2.5 outline-none focus:border-gold-500 text-navy-900 font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-navy-900">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-luxury-light border border-gray-200 rounded p-2.5 outline-none focus:border-gold-500 text-navy-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-navy-900">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={contactCompany}
                      onChange={(e) => setContactCompany(e.target.value)}
                      className="w-full bg-luxury-light border border-gray-200 rounded p-2.5 outline-none focus:border-gold-500 text-navy-900 font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-navy-900">Requirements Summary *</label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Outline number of workers needed, trade testing parameters, etc..."
                    className="w-full bg-luxury-light border border-gray-200 rounded p-2.5 outline-none focus:border-gold-500 text-navy-900 font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={contactLoading}
                  className="w-full bg-navy-900 hover:bg-navy-800 text-gold-500 font-bold uppercase tracking-wider py-4 rounded-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 text-[10px]"
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
