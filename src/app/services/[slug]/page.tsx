"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import SchemaMarkup from "@/components/seo/SchemaMarkup";
import { SERVICES_DATA_HI } from "./servicesDataHi";
import {
  ChevronRight,
  CheckCircle,
  HelpCircle,
  Briefcase,
  Users,
  Award,
  ArrowLeft,
  Mail,
  Send,
  RefreshCw,
} from "lucide-react";

interface ServiceData {
  title: string;
  tagline: string;
  overview: string;
  benefits: string[];
  process: string[];
  industries: string[];
  faqs: { q: string; a: string }[];
  related: { title: string; slug: string }[];
}

const SERVICES_DATA: Record<string, ServiceData> = {
  "permanent-recruitment": {
    title: "Permanent Recruitment",
    tagline: "Secure long-term stability with premium Indian professionals.",
    overview:
      "Permanent Recruitment is the foundation of structural corporate growth. At RAMA INTERNATIONAL-INDIA, we connect leading multinational employers with pre-screened, highly qualified Indian professionals for permanent roles. Our deep database of over 100,000 active CVs and rigorous interviewing frameworks ensure candidate-client alignment.",
    benefits: [
      "Rigorous practical skill evaluations at our Delhi & Mumbai yards.",
      "Access to premium passive talent pools not visible on standard boards.",
      "90-day candidate replacement warranty for total employer peace of mind.",
      "Complete MEA credential validation and background audits.",
    ],
    process: [
      "Job Specification Alignment & demand logging.",
      "Targeted sourcing and pre-screening calls.",
      "Authorized trade evaluations and technical gradings.",
      "Client interview delegations (video or physical).",
      "Visa stamping, immigration check, and flights.",
    ],
    industries: ["Healthcare & Nursing", "Construction & Engineering", "Oil & Gas", "Hospitality"],
    faqs: [
      {
        q: "What is your replacement warranty period?",
        a: "We offer a standard 90-day replacement warranty. If a placed candidate leaves due to performance or resignation, we provide a pre-screened replacement at zero additional consultancy cost.",
      },
      {
        q: "How do you source permanent candidates?",
        a: "We leverage our proprietary database, direct vocational network partnerships, and targeted sourcing desks specialized by industry vertical.",
      },
    ],
    related: [
      { title: "Executive Search", slug: "executive-search" },
      { title: "White Collar Hiring", slug: "white-collar-hiring" },
    ],
  },
  "temporary-staffing": {
    title: "Temporary Staffing",
    tagline: "Flexible workforce solutions to scale on-demand.",
    overview:
      "Handle workload spikes, seasonal projects, or short-term vacancies without increasing permanent headcount. Our temporary staffing desk provides qualified personnel mobilized quickly to support ongoing project phases.",
    benefits: [
      "Rapid turnaround times to fulfill critical field vacancies.",
      "Reduces permanent employee liability and overhead structures.",
      "Flexible contract terms tailored to specific project timelines.",
      "All payroll and compliance handled directly by RAMA.",
    ],
    process: [
      "Intake request logging of temporary roles.",
      "Database mapping for immediately available candidates.",
      "Compliance checks and mobilization routing.",
      "Deployment to site with ongoing support logistics.",
    ],
    industries: ["Logistics & Fleet Ops", "Manufacturing", "Hospitality", "Construction"],
    faqs: [
      {
        q: "How quickly can temporary staff be deployed?",
        a: "Depending on visa status and locations, local candidates can report to site in 48-72 hours. Overseas temporary staff take approximately 15-20 days.",
      },
      {
        q: "Can temporary staff be converted to permanent roles?",
        a: "Yes, we support temp-to-perm transitions under structured buyout guidelines.",
      },
    ],
    related: [
      { title: "Contract Staffing", slug: "contract-staffing" },
      { title: "Skilled Labour Supply", slug: "skilled-labour-supply" },
    ],
  },
  "executive-search": {
    title: "Executive Search",
    tagline: "Headhunting leadership boards to guide your enterprise.",
    overview:
      "Critical roles require custom, high-security headhunting. Our executive search desk focuses on C-suite, senior director, and specialized medical/engineering lead recruitment. Led by Deepak Chauhan, we act as branding ambassadors to present your opportunity to key leaders.",
    benefits: [
      "Deep vetting of corporate leadership credentials.",
      "Confidential search execution safeguarding client privacy.",
      "Detailed candidate portfolios including cultural fit analysis.",
      "Global reach connecting with Indian diaspora leaders.",
    ],
    process: [
      "Partner alignment & corporate profile mapping.",
      "Confidential market research and mapping of leaders.",
      "Discreet outreach and preliminary consultations.",
      "Comprehensive panel presentations to partner boards.",
    ],
    industries: ["Healthcare (Clinicians)", "Infrastructure Directors", "Petrochemical Leads"],
    faqs: [
      {
        q: "What is your methodology for executive search?",
        a: "We utilize direct headhunting, referencing boards, and an extensive network of senior advisors to source leaders who aren't active job seekers.",
      },
      {
        q: "How do you guarantee candidate confidentiality?",
        a: "All candidate profiles are shared anonymously during the initial phases, and NDAs are executed before sharing client specifics.",
      },
    ],
    related: [
      { title: "HR Consultancy", slug: "hr-consultancy" },
      { title: "White Collar Hiring", slug: "white-collar-hiring" },
    ],
  },
  "bulk-hiring": {
    title: "Bulk Hiring",
    tagline: "Large-scale mobilization campaigns for heavy industries.",
    overview:
      "Mobilizing hundreds of workers for infrastructure, oil & gas, or manufacturing projects requires robust logistical systems. RAMA INTERNATIONAL-INDIA coordinates large-scale campaigns, organizing testing yards, biometric collections, Wafid medicals, and group visa stampings.",
    benefits: [
      "Single-source management for major project manpower needs.",
      "Substantial cost optimizations on visa and flight packages.",
      "Uniform practical trade grading across large cohorts.",
      "Coordinated group flight schedules to match project starts.",
    ],
    process: [
      "Demand audit and MEA visa registration checks.",
      "Advertising and sourcing across Indian industrial hubs.",
      "Practical trade test yards setups in Delhi/Mumbai.",
      "Group medical clearances, biometrics, and stamping.",
    ],
    industries: ["Construction & Engineering", "Manufacturing", "Oil & Gas", "Logistics"],
    faqs: [
      {
        q: "What volume of candidates can you process in a single drive?",
        a: "Our yards can accommodate up to 300 candidates per day for practical evaluations (electrical, piping, welding, masonry).",
      },
      {
        q: "Do you handle candidate travel coordination in groups?",
        a: "Yes, we coordinate charter flight booking options, group airport pickups, and local site reporting.",
      },
    ],
    related: [
      { title: "Skilled Labour Supply", slug: "skilled-labour-supply" },
      { title: "Blue Collar Hiring", slug: "blue-collar-hiring" },
    ],
  },
  "international-recruitment": {
    title: "International Recruitment",
    tagline: "Bridging the gap between Indian talent and global giants.",
    overview:
      "International recruitment is our core competency. Since 2018, RAMA INTERNATIONAL-INDIA has mobilized thousands of workers. We connect international employers with qualified candidates in India and handle all MEA, embassy, and consulate compliance.",
    benefits: [
      "100% compliance with MEA eMigrate portal regulations.",
      "Established networks with consulates in New Delhi & Mumbai.",
      "Decades of expertise in regional immigration workflows.",
      "Local liaison support in target destination countries.",
    ],
    process: [
      "Filing demand letter via target embassy channels.",
      "Multi-state sourcing campaigns inside India.",
      "Technical pre-screening and Wafid medicals.",
      "Consulate visa stamping and biometric tracking.",
    ],
    industries: ["Construction", "Healthcare", "Hospitality", "Logistics", "Energy"],
    faqs: [
      {
        q: "Are you licensed to recruit workers for all global countries?",
        a: "Yes, our MEA license authorizes recruitment globally, with specific desks for GCC countries, the Schengen zone, and Singapore.",
      },
      {
        q: "Who bears the cost of the recruitment process?",
        a: "Costs are managed based on bilateral employer service agreements, adhering to all MEA and local labor regulations.",
      },
    ],
    related: [
      { title: "Overseas Placement", slug: "overseas-placement" },
      { title: "HR Consultancy", slug: "hr-consultancy" },
    ],
  },
  "overseas-placement": {
    title: "Overseas Placement",
    tagline: "Seamless deployment pathways for global careers.",
    overview:
      "We assist candidates at every step of their overseas placement journey. From interview selects to biometric registration, document attestation, medical reports, visa stamping, and flights, we ensure a smooth transition to international roles.",
    benefits: [
      "Step-by-step guidance through complex immigration rules.",
      "Wafid/GAMCA medical coordination and travel bookings.",
      "Pre-departure orientation briefings on local customs and laws.",
      "Ensures transparent labor contract signing.",
    ],
    process: [
      "Recruiter interview select and contract offer.",
      "Document collection (passport, MEA attestations).",
      "Medical checkups and biometric registrations.",
      "Embassy visa stamping and flight mobilization.",
    ],
    industries: ["Healthcare", "Construction", "Logistics", "Hospitality"],
    faqs: [
      {
        q: "How do I track my visa processing status?",
        a: "Candidates can log into the RAMA ATS portal and access their active stepper timeline for live progress updates.",
      },
      {
        q: "What documents are required for degree attestation?",
        a: "Standard requirements include original degree certificates, transcripts, passport copies, and employment select letters.",
      },
    ],
    related: [
      { title: "International Recruitment", slug: "international-recruitment" },
      { title: "Skilled Labour Supply", slug: "skilled-labour-supply" },
    ],
  },
  "payroll-management": {
    title: "Payroll Management",
    tagline: "Streamlined salary compliance for global workforces.",
    overview:
      "Manage tax structures, compliance, and multi-currency distributions for international projects. Our payroll management desk handles contract worker compliance and salary payouts, allowing you to focus on project execution.",
    benefits: [
      "Full compliance with local tax and labor regulations.",
      "Accurate multi-currency distributions for global sites.",
      "Slashes internal administrative overhead structures.",
      "Structured welfare allocations and insurance cover.",
    ],
    process: [
      "Timesheet integrations and verification configurations.",
      "Multi-rate payroll processing and tax audits.",
      "Disbursement via secure international banking channels.",
      "Reports delivery to client finance departments.",
    ],
    industries: ["Engineering Projects", "Contract Construction", "Corporate Offices"],
    faqs: [
      {
        q: "How do you handle multi-currency payments?",
        a: "We coordinate with banking networks to process disbursements using real-time currency conversions complying with local regulations.",
      },
      {
        q: "Is your payroll process audited for compliance?",
        a: "Yes, our payroll operations undergo external compliance audits to ensure alignment with destination labor rules.",
      },
    ],
    related: [
      { title: "Contract Staffing", slug: "contract-staffing" },
      { title: "HR Consultancy", slug: "hr-consultancy" },
    ],
  },
  "hr-consultancy": {
    title: "HR Consultancy",
    tagline: "Compliance auditing and market benchmark strategies.",
    overview:
      "Navigate complex international labor markets with confidence. Our HR consultancy desk provides salary benchmarking, labor law updates, compliance assessments, and custom visa path strategies for target regions.",
    benefits: [
      "Access to real-time salary metrics across major GCC sectors.",
      "Ensures full compliance with MEA and local labor regulations.",
      "Mitigates recruitment risks and deployment delays.",
      "Assists in designing robust local onboarding templates.",
    ],
    process: [
      "Project scope definition and client needs assessment.",
      "Market research and compliance audits.",
      "Delivery of custom guidelines and strategy reports.",
      "Implementation support and relationship audits.",
    ],
    industries: ["Healthcare Networks", "Oil & Gas Consortia", "Construction Groups"],
    faqs: [
      {
        q: "Do you offer localized labor market research?",
        a: "Yes, we specialize in GCC and European labor markets, providing custom reports on salary levels, skills availability, and visa paths.",
      },
      {
        q: "How do your consultancy audits mitigate risk?",
        a: "By reviewing recruitment documents, credentials validation, and visa applications before submission to prevent consulate rejections.",
      },
    ],
    related: [
      { title: "Executive Search", slug: "executive-search" },
      { title: "Payroll Management", slug: "payroll-management" },
    ],
  },
  "contract-staffing": {
    title: "Contract Staffing",
    tagline: "Structured contract personnel for project campaigns.",
    overview:
      "Deliver infrastructure, energy, or hospitality projects on time. Our contract staffing desk manages the sourcing, visa stamping, payroll, and logistics of qualified personnel for specific project durations.",
    benefits: [
      "Aligns staff overheads directly with active project budgets.",
      "Complete end-to-end recruitment and logistics managed by RAMA.",
      "Reduces permanent headcount liabilities and compliance audits.",
      "Ensures qualified staff report to site on time.",
    ],
    process: [
      "Contract specs definition and campaign schedule.",
      "Sourcing, vetting, and technical evaluations.",
      "Visa stamping, flight mobilization, and site deployment.",
      "Ongoing payroll and worker welfare management.",
    ],
    industries: ["Oil & Gas Projects", "Infrastructure Works", "Hospitality Campaigns"],
    faqs: [
      {
        q: "Who is the primary employer of contract staff?",
        a: "RAMA acts as the primary agency employer, managing payroll, compliance, and logistics, while staff report to client site leads.",
      },
      {
        q: "What contract periods do you support?",
        a: "We support project contracts ranging from 6 months to 3 years, with option terms.",
      },
    ],
    related: [
      { title: "Temporary Staffing", slug: "temporary-staffing" },
      { title: "Payroll Management", slug: "payroll-management" },
    ],
  },
  "blue-collar-hiring": {
    title: "Blue Collar Hiring",
    tagline: "Sourcing certified, trade-tested skilled tradespeople.",
    overview:
      "Skilled manual labor is the backbone of heavy industries. We run large-scale recruitment drives for certified welders, electrical technicians, pipe fitters, riggers, and masonry trades. Every candidate is evaluated at our practical trade centers.",
    benefits: [
      "Rigorous practical skill verification and grading records.",
      "Access to large pools of experienced industrial tradespeople.",
      "Pre-screened candidates holding necessary certifications.",
      "Complete medical checks and visa stampings.",
    ],
    process: [
      "Demand validation and trade spec alignment.",
      "Sourcing across vocational networks and industrial hubs.",
      "Practical trade evaluations at our Delhi/Mumbai yards.",
      "Consulate visa stamping and travel mobilization.",
    ],
    industries: ["Construction", "Manufacturing", "Oil & Gas", "Logistics"],
    faqs: [
      {
        q: "What trades do you test at your yards?",
        a: "We evaluate structural fitters, industrial electricians, HVAC techs, 6G pipe welders, brick masons, and scaffolding riggers.",
      },
      {
        q: "Do you verify trade certifications?",
        a: "Yes, we verify all ITI diplomas, safety certs (OSHA/NEBOSH), and previous GCC experience logs.",
      },
    ],
    related: [
      { title: "Skilled Labour Supply", slug: "skilled-labour-supply" },
      { title: "Bulk Hiring", slug: "bulk-hiring" },
    ],
  },
  "white-collar-hiring": {
    title: "White Collar Hiring",
    tagline: "Professional placements for technical and clinical roles.",
    overview:
      "White Collar Hiring focuses on professional, managerial, and clinical positions. We source staff nurses, site estimators, design engineers, financial officers, and IT coordinators, ensuring credentials match client needs.",
    benefits: [
      "Thorough verification of educational credentials.",
      "Screening for professional communication and skills.",
      "Access to premium candidates across major industries.",
      "Complete assistance with degree attestations.",
    ],
    process: [
      "Role specification review and profile alignment.",
      "Targeted sourcing and pre-screening calls.",
      "Client interview coordination (video or physical).",
      "MEA attestations, visa stamping, and flights.",
    ],
    industries: ["Healthcare", "Engineering Offices", "Corporate Sectors", "Hospitality Management"],
    faqs: [
      {
        q: "How do you verify medical credentials?",
        a: "We coordinate with verification agencies and verify registrations with the Indian Nursing Council or state medical councils.",
      },
      {
        q: "What is your process for degree attestation?",
        a: "We coordinate MEA attestations and respective embassy stampings in New Delhi on behalf of candidates.",
      },
    ],
    related: [
      { title: "Permanent Recruitment", slug: "permanent-recruitment" },
      { title: "Executive Search", slug: "executive-search" },
    ],
  },
  "skilled-labour-supply": {
    title: "Skilled Labour Supply",
    tagline: "Technical technicians vetted by certified test masters.",
    overview:
      "Skilled Labour Supply ensures your project has qualified technical professionals. We provide HVAC commissioners, instrumentation technicians, millwright fitters, and crane operators who have passed practical testing at our yards.",
    benefits: [
      "Rigorous practical skill evaluations at our Delhi & Mumbai yards.",
      "Pre-screened candidates holding necessary technical certs.",
      "Minimizes training costs and site safety issues.",
      "Complete visa, medical, and travel coordination.",
    ],
    process: [
      "Technical role review and trade yard prep.",
      "Multi-state sourcing of qualified technicians.",
      "Practical trade yard testing and grading.",
      "Biometrics, Wafid medicals, and visa stamping.",
    ],
    industries: ["Manufacturing", "Oil & Gas", "Construction", "Logistics"],
    faqs: [
      {
        q: "Do you supply certified safety operators?",
        a: "Yes, we source operators holding international safety certifications (OSHA, NEBOSH, etc.) and valid licenses.",
      },
      {
        q: "How do you handle candidates who fail the trade tests?",
        a: "Only candidates who meet or exceed our grading criteria are progressed to travel queues.",
      },
    ],
    related: [
      { title: "Blue Collar Hiring", slug: "blue-collar-hiring" },
      { title: "Bulk Hiring", slug: "bulk-hiring" },
    ],
  },
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { language } = useLanguage();
  const [data, setData] = useState<ServiceData | null>(null);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const t = useTranslations("servicesPage");
  const tForm = useTranslations("callbackForm");
  const tNavbar = useTranslations("navbar");

  // Lead capture states
  const [inqName, setInqName] = useState("");
  const [inqEmail, setInqEmail] = useState("");
  const [inqMsg, setInqMsg] = useState("");
  const [inqLoading, setInqLoading] = useState(false);
  const [inqSuccess, setInqSuccess] = useState(false);

  useEffect(() => {
    if (slug) {
      const serviceInfo = language === "hi" ? SERVICES_DATA_HI[slug] : SERVICES_DATA[slug];
      if (serviceInfo) {
        setData(serviceInfo);
      } else {
        router.push("/services");
      }
    }
  }, [slug, language]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInqLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inqName,
          email: inqEmail,
          companyName: `Inquiry for service: ${data?.title}`,
          message: inqMsg,
        }),
      });
      if (res.ok) {
        setInqSuccess(true);
        setInqName("");
        setInqEmail("");
        setInqMsg("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInqLoading(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-light dark:bg-navy-950 text-xs font-semibold text-navy-900 dark:text-white transition-colors duration-200">
        <RefreshCw className="h-5 w-5 animate-spin text-gold-500 mr-2" />
        <span>{t("resolving")}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-navy-950 text-navy-900 dark:text-white transition-colors duration-200 overflow-x-hidden">
      <SchemaMarkup type="Organization" data={{}} />
      <SchemaMarkup type="LocalBusiness" data={{}} />
      <Navbar />
      <Breadcrumbs items={[{ label: tNavbar("services"), href: "/services" }, { label: data.title, href: `/services/${slug}` }]} />

      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white py-24 sm:py-32 overflow-hidden border-b-2 border-gold-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_65%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <Link
            href="/services"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-gold-500 hover:text-gold-400 uppercase tracking-widest"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("backLink")}</span>
          </Link>

          <div className="space-y-2">
            <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gold-500 tracking-wider">
              {data.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-300 font-light max-w-2xl leading-relaxed">
              {data.tagline}
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
        {/* 2. Overview & Benefits */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <h2 className="font-headline text-xl sm:text-2xl font-bold text-navy-900 dark:text-white pb-2 border-b border-gray-150 dark:border-white/5">
              {t("serviceOverview")}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">
              {data.overview}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="font-headline text-md font-bold text-navy-900 dark:text-white">{t("keyBenefits")}</h3>
            <ul className="space-y-3.5 text-xs text-gray-600 dark:text-gray-400 font-light">
              {data.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3. Process & Industries Served */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <h2 className="font-headline text-xl sm:text-2xl font-bold text-navy-900 dark:text-white pb-2 border-b border-gray-150 dark:border-white/5">
              {t("blueprint")}
            </h2>
            <div className="space-y-4 text-xs font-light text-gray-600 dark:text-gray-400">
              {data.process.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-4 bg-slate-50 dark:bg-navy-900/40 border border-gray-150 dark:border-white/5 p-4 rounded-xl">
                  <span className="font-headline text-2xl font-extrabold text-gold-500/20 mt-0.5">0{idx + 1}</span>
                  <div>
                    <h4 className="font-bold text-navy-900 dark:text-white mb-1">{step.split(" - ")[0]}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{step.split(" - ")[1] || step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-headline text-xl sm:text-2xl font-bold text-navy-900 dark:text-white pb-2 border-b border-gray-150 dark:border-white/5">
              {t("sectorsServed")}
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs text-navy-900 dark:text-white text-center font-bold font-headline">
              {data.industries.map((ind, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-navy-900/40 border border-gray-150 dark:border-white/5 rounded-xl p-5 hover:border-gold-500 transition-colors">
                  <span>{ind}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. FAQs Section */}
        <section className="space-y-6 max-w-4xl mx-auto">
          <h2 className="font-headline text-xl sm:text-2xl font-bold text-navy-900 dark:text-white text-center pb-2 border-b border-gray-150 dark:border-white/5">
            {t("faqsTitle")}
          </h2>
          <div className="space-y-4 text-xs font-medium font-sans">
            {data.faqs.map((faq, idx) => {
              const isOpen = activeFAQ === idx;
              return (
                <div key={idx} className="border border-gray-200 dark:border-white/5 rounded-xl p-5 select-none transition-all">
                  <div
                    onClick={() => setActiveFAQ(isOpen ? null : idx)}
                    className="flex justify-between items-center cursor-pointer font-bold text-navy-900 dark:text-white text-sm font-headline"
                  >
                    <span>{faq.q}</span>
                    <span className="text-gold-500 font-bold">{isOpen ? "−" : "+"}</span>
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
        </section>

        {/* 5. Related Services */}
        <section className="space-y-6">
          <h2 className="font-headline text-xl sm:text-2xl font-bold text-navy-900 dark:text-white pb-2 border-b border-gray-150 dark:border-white/5">
            {t("relatedTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.related.map((rel) => (
              <div key={rel.slug} className="bg-slate-50 dark:bg-navy-900/40 border border-gray-150 dark:border-white/5 rounded-xl p-6 hover:border-gold-500 transition-colors flex justify-between items-center text-navy-900 dark:text-white">
                <div>
                  <h4 className="font-headline text-sm font-bold text-navy-900 dark:text-white">{rel.title}</h4>
                  <p className="text-[10px] text-gray-400 dark:text-gray-400 font-light mt-0.5">{t("relatedDesc")}</p>
                </div>
                <Link
                  href={`/services/${rel.slug}`}
                  className="text-xs font-bold text-gold-605 dark:text-gold-450 uppercase tracking-widest flex items-center space-x-0.5 hover:underline font-headline"
                >
                  <span>{t("explore")}</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 6. CTA & Call-back Request */}
        <section className="bg-navy-900 rounded-2xl border border-gold-500/25 p-8 sm:p-12 text-white shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h3 className="font-headline text-xl sm:text-2xl font-bold text-gold-500 tracking-wider">
              {t("ctaTitle")}
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed font-light">
              {t("ctaDesc")}
            </p>
          </div>

          <div className="bg-navy-850 p-6 rounded-xl border border-gold-500/10">
            {inqSuccess ? (
              <div className="p-4 bg-green-950/20 border border-green-800 text-green-400 rounded-lg text-xs flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{t("successTitle")}</p>
                  <p className="mt-1">{t("successDesc")}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3.5 text-xs text-white">
                <div>
                  <label className="block mb-1 text-gray-300 font-semibold">{tForm("name")} *</label>
                  <input
                    type="text"
                    required
                    value={inqName}
                    onChange={(e) => setInqName(e.target.value)}
                    placeholder={t("placeholderName")}
                    className="w-full bg-navy-900 border border-gold-500/20 text-white rounded p-2.5 outline-none focus:border-gold-500 font-sans"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-300 font-semibold">{tForm("email")} *</label>
                  <input
                    type="email"
                    required
                    value={inqEmail}
                    onChange={(e) => setInqEmail(e.target.value)}
                    placeholder={t("placeholderEmail")}
                    className="w-full bg-navy-900 border border-gold-500/20 text-white rounded p-2.5 outline-none focus:border-gold-500 font-sans"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-300 font-semibold">{tForm("message")} *</label>
                  <textarea
                    rows={3}
                    required
                    value={inqMsg}
                    onChange={(e) => setInqMsg(e.target.value)}
                    placeholder={t("placeholderMsg")}
                    className="w-full bg-navy-900 border border-gold-500/20 text-white rounded p-2.5 outline-none focus:border-gold-500 resize-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={inqLoading}
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold uppercase tracking-wider py-3 rounded flex items-center justify-center space-x-2 text-[10px] shadow-lg transition-all cursor-pointer disabled:opacity-50 font-headline"
                >
                  {inqLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>{t("submitRequest")}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
