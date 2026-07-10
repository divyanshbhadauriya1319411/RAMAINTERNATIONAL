"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PipelineBoard from "@/components/dashboard/PipelineBoard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Settings,
  Grid,
  FileText,
  Users,
  Plus,
  Sparkles,
  CreditCard,
  CheckCircle,
  FileDown,
  RefreshCw,
  Activity,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  country: string;
  sector: string;
  vacancies: number;
  salaryRange?: string | null;
  createdAt: string;
}

interface Application {
  id: string;
  status: string;
  visaStatus: string;
  notes?: string | null;
  createdAt: string;
  interviewDate?: string | null;
  job: {
    title: string;
    country: string;
  };
  candidate: {
    fullName: string;
    phone: string | null;
    resumeUrl: string | null;
    experienceYears: number | null;
    skills: string | null;
  };
}

interface Profile {
  companyName: string;
  industry: string | null;
  website: string | null;
  logoUrl: string | null;
}

export default function EmployerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "profile" | "jobs" | "applicants" | "billing" | "settings">("overview");
  
  // Data States
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Form States (New Job)
  const [showJobForm, setShowJobForm] = useState(false);
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("Saudi Arabia");
  const [sector, setSector] = useState("Construction");
  const [salaryRange, setSalaryRange] = useState("");
  const [vacancies, setVacancies] = useState("10");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");

  // Form States (Profile)
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");

  // Action feedback states
  const [formLoading, setFormLoading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [formMsg, setFormMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  const t = useTranslations("employerDashboard");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard/employer");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setJobs(data.jobs || []);
        setApplications(data.applications || []);
        
        if (data.profile) {
          setProfile(data.profile);
          setCompanyName(data.profile.companyName || "");
          setIndustry(data.profile.industry || "");
          setWebsite(data.profile.website || "");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMsg(null);

    try {
      const res = await fetch("/api/dashboard/employer/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          country,
          sector,
          salaryRange,
          vacancies: parseInt(vacancies),
          description,
          requirements,
        }),
      });

      if (res.ok) {
        setFormMsg({ text: t("postSuccessMsg"), isError: false });
        setTitle("");
        setSalaryRange("");
        setDescription("");
        setRequirements("");
        fetchDashboardData();
        setTimeout(() => setShowJobForm(false), 1200);
      } else {
        setFormMsg({ text: t("postFailedMsg"), isError: true });
      }
    } catch (err) {
      setFormMsg({ text: t("networkErrorMsg"), isError: true });
    } finally {
      setFormLoading(false);
    }
  };

  const handleAIGenerateJob = async () => {
    if (!title) {
      setFormMsg({ text: t("seedAiMsg"), isError: true });
      return;
    }

    setGeneratingAI(true);
    setFormMsg(null);

    try {
      const res = await fetch("/api/ai/generate-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, sector, country }),
      });

      const data = await res.json();

      if (res.ok) {
        setDescription(data.description);
        setRequirements(data.requirements);
        setFormMsg({ text: t("aiSuccessMsg"), isError: false });
      } else {
        setFormMsg({ text: t("aiFailedMsg"), isError: true });
      }
    } catch (e) {
      setFormMsg({ text: t("networkErrorMsg"), isError: true });
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);

    try {
      const res = await fetch("/api/dashboard/employer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, industry, website }),
      });

      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setProfileMsg(t("profileSuccessMsg"));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-light dark:bg-navy-950 text-xs font-semibold text-navy-900 dark:text-white transition-colors duration-200">
        <RefreshCw className="h-5 w-5 animate-spin text-gold-500 mr-2" />
        <span>{t("resolving")}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-luxury-light dark:bg-navy-950 text-navy-900 dark:text-white transition-colors duration-200 overflow-x-hidden">
      <Navbar />

      <div className="bg-[#051B3D] text-white py-12 border-b border-blue-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="font-headline text-2xl font-bold text-white">{t("welcomeTitle")}</h1>
            <p className="text-xs text-gray-300 font-light">{t("welcomeDesc")}</p>
          </div>
          
          <div className="bg-[#0B3D91] border border-blue-600/20 rounded-2xl p-3.5 flex items-center space-x-3 text-xs">
            <Building2 className="h-4.5 w-4.5 text-blue-500" />
            <div>
              <p className="font-bold text-gray-200">{profile?.companyName || "Saudi Engineering Co."}</p>
              <p className="text-[10px] text-gray-400 font-light mt-0.5">{t("verifyBadge")}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar Drawer */}
        <aside className="lg:w-60 w-full shrink-0">
          <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-4 shadow-md flex flex-row overflow-x-auto lg:flex-col lg:space-y-2 gap-2 scrollbar-hide sticky top-24">
            {[
              { tab: "overview", label: t("tabOverview"), icon: Grid },
              { tab: "profile", label: t("tabProfile"), icon: Building2 },
              { tab: "jobs", label: t("tabJobs"), icon: FileText },
              { tab: "applicants", label: t("tabApplicants"), icon: Users },
              { tab: "billing", label: t("tabBilling"), icon: CreditCard },
              { tab: "settings", label: t("tabSettings"), icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => {
                    setActiveTab(item.tab as any);
                    setProfileMsg(null);
                    setFormMsg(null);
                  }}
                  className={`w-auto lg:w-full flex items-center space-x-2.5 px-4 py-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-blue-600 text-white shadow border-l-4 border-white font-bold"
                      : "text-gray-500 dark:text-gray-400 hover:bg-luxury-light dark:hover:bg-navy-900 hover:text-[#051B3D] dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Dynamic Panels */}
        <section className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              
              {/* Tab 1: Overview */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <h3 className="font-headline text-sm font-bold text-navy-900 dark:text-white">{t("controlPanelOverview")}</h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-light font-sans">{t("controlPanelDesc")}</p>
                    </div>
                    <button
                      onClick={() => setShowJobForm(true)}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded-xl border border-blue-500/25 flex items-center space-x-1.5 shadow-sm cursor-pointer transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{t("btnPostJob")}</span>
                    </button>
                  </div>

                  {/* Counters */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-semibold">
                    <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-md space-y-1">
                      <span className="text-[10px] text-gray-400 dark:text-gray-400 font-bold uppercase tracking-wider block font-sans">{t("activeCampaigns")}</span>
                      <span className="text-2xl font-serif font-extrabold text-navy-900 dark:text-white">{jobs.length}</span>
                    </div>
                    <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-md space-y-1">
                      <span className="text-[10px] text-gray-400 dark:text-gray-400 font-bold uppercase tracking-wider block font-sans">{t("sourcedApplicants")}</span>
                      <span className="text-2xl font-serif font-extrabold text-navy-900 dark:text-white">{applications.length}</span>
                    </div>
                    <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-md space-y-1">
                      <span className="text-[10px] text-gray-400 dark:text-gray-400 font-bold uppercase tracking-wider block font-sans">{t("activeVisas")}</span>
                      <span className="text-2xl font-serif font-extrabold text-navy-900 dark:text-white">{applications.filter(a => a.status === "VISA_STAGE").length}</span>
                    </div>
                    <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-md space-y-1">
                      <span className="text-[10px] text-gray-400 dark:text-gray-400 font-bold uppercase tracking-wider block font-sans">{t("subscriptionTier")}</span>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block pt-2">{t("enterpriseCore")}</span>
                    </div>
                  </div>

                  {/* Activity Log */}
                  <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md space-y-4">
                    <h3 className="font-headline font-bold text-xs text-navy-900 dark:text-white pb-3 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider flex items-center space-x-2">
                      <Activity className="h-4.5 w-4.5 text-blue-500" />
                      <span>{t("reportsTitle")}</span>
                    </h3>

                    <div className="space-y-4 text-xs font-light">
                      {[
                        { time: t("timeLog1"), desc: t("log1") },
                        { time: t("timeLog2"), desc: t("log2") },
                        { time: t("timeLog3"), desc: t("log3") },
                      ].map((item, i) => (
                        <div key={i} className="flex space-x-3 items-start">
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold shrink-0 w-20">{item.time}</span>
                          <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-sans font-medium">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Profile */}
              {activeTab === "profile" && (
                <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
                  <div>
                    <h3 className="font-headline text-sm font-bold text-navy-900 dark:text-white pb-2 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider">{t("companyProfile")}</h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-400 font-light mt-1">{t("companyProfileDesc")}</p>
                  </div>

                  {profileMsg && (
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl text-xs font-semibold">
                      {profileMsg}
                    </div>
                  )}

                  <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-semibold text-gray-550 dark:text-gray-300 font-sans">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-navy-900 dark:text-gray-300">{t("fieldCompanyName")} *</label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-205 dark:border-white/10 text-navy-900 dark:text-white rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium font-sans"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-navy-900 dark:text-gray-300">{t("industrySector")}</label>
                        <input
                          type="text"
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-205 dark:border-white/10 text-navy-900 dark:text-white rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium font-sans"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block mb-1 text-navy-900 dark:text-gray-300">{t("corporateWebsite")}</label>
                        <input
                          type="text"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-205 dark:border-white/10 text-navy-900 dark:text-white rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium font-sans"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-4 px-8 rounded-xl border border-blue-500/25 cursor-pointer font-headline"
                    >
                      {t("saveCorporate")}
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 3: Active drives */}
              {activeTab === "jobs" && (
                <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-150 dark:border-white/5">
                    <h3 className="font-headline font-bold text-xs text-navy-900 dark:text-white uppercase tracking-wider">{t("activeCampaigns")}</h3>
                    <button
                      onClick={() => setShowJobForm(true)}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-blue-500/25 flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{t("btnPostJob")}</span>
                    </button>
                  </div>

                  {jobs.length === 0 ? (
                    <p className="text-xs text-gray-400 py-10 text-center font-light font-sans">{t("noJobsCreated")}</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {jobs.map((job) => (
                        <div key={job.id} className="border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-3 bg-luxury-light dark:bg-navy-950/30">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 bg-blue-600/10 px-2.5 py-0.5 rounded-lg border border-blue-500/10">
                              {job.sector}
                            </span>
                            <h4 className="font-headline text-sm font-bold text-navy-900 dark:text-white pt-1">{job.title}</h4>
                            <p className="text-[10px] text-gray-400 font-semibold">{job.country}</p>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-150 dark:border-white/5">
                            <span>{t("openSlots")}<strong className="text-navy-900 dark:text-white font-bold">{job.vacancies}</strong></span>
                            <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Applicants ATS */}
              {activeTab === "applicants" && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md">
                    <h3 className="font-headline font-bold text-xs text-navy-900 dark:text-white pb-3 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider">{t("applicantsTitle")}</h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-400 font-light mt-1">{t("applicantsDesc")}</p>
                  </div>
                  <PipelineBoard applications={applications} onRefresh={fetchDashboardData} />
                </div>
              )}

              {/* Tab 5: Billing */}
              {activeTab === "billing" && (
                <div className="space-y-6">
                  {/* Subscription card */}
                  <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-2">
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-lg border border-blue-500/20 uppercase font-bold tracking-wider">{t("activeTier")}</span>
                      <h3 className="font-headline text-sm font-bold text-navy-900 dark:text-white uppercase tracking-wider">{t("enterpriseCorePlan")}</h3>
                      <p className="text-xs text-gray-505 dark:text-gray-400 leading-relaxed font-light font-sans">{t("enterprisePlanDesc")}</p>
                    </div>
                    <div className="text-center md:text-right text-xs font-semibold">
                      <p className="text-gray-400">{t("nextRenewal")}</p>
                      <p className="text-navy-900 dark:text-white text-lg font-bold">September 15, 2026</p>
                      <p className="text-blue-600 dark:text-blue-400 font-bold tracking-widest mt-1">{t("renewalCost")}</p>
                    </div>
                  </div>

                  {/* Invoices */}
                  <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md space-y-4">
                    <h3 className="font-headline font-bold text-xs text-navy-900 dark:text-white pb-3 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider">{t("invoiceHistory")}</h3>
                    <div className="overflow-x-auto text-xs font-semibold">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-150 dark:border-white/5 text-gray-400">
                            <th className="pb-3.5">{t("invoiceId")}</th>
                            <th className="pb-3.5">{t("billingPeriod")}</th>
                            <th className="pb-3.5">{t("amountPaid")}</th>
                            <th className="pb-3.5">{t("status")}</th>
                            <th className="pb-3.5 text-right">{t("download")}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-medium text-navy-900 dark:text-white">
                          {[
                            { id: "INV-2026-904", period: "Sept 2025 - Sept 2026", amount: "₹1,50,000", status: "PAID" },
                            { id: "INV-2024-812", period: "Sept 2024 - Sept 2025", amount: "₹1,20,000", status: "PAID" },
                          ].map((inv) => (
                            <tr key={inv.id} className="text-[#051B3D] dark:text-white">
                              <td className="py-4 font-bold">{inv.id}</td>
                              <td className="py-4 text-gray-500 dark:text-gray-400">{inv.period}</td>
                              <td className="py-4 text-blue-600 dark:text-blue-455 font-bold">{inv.amount}</td>
                              <td className="py-4">
                                <span className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase">
                                  {inv.status}
                                </span>
                              </td>
                              <td className="py-4 text-right">
                                <button
                                  onClick={() => alert(t("alertDlInvoice").replace("{id}", inv.id))}
                                  className="text-navy-900 dark:text-white hover:text-blue-500 font-bold uppercase tracking-wider inline-flex items-center space-x-1 cursor-pointer border-none bg-transparent"
                                >
                                  <FileDown className="h-4 w-4 shrink-0" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 7: Settings */}
              {activeTab === "settings" && (
                <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
                  <div>
                    <h3 className="font-headline text-sm font-bold text-navy-900 dark:text-white pb-2 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider">{t("tabSettings")}</h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-400 font-light mt-1 font-sans">{t("settingsDesc")}</p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert(t("alertPasswordSuccess"));
                    }}
                    className="space-y-4 max-w-sm text-xs font-semibold text-gray-555 dark:text-gray-300 font-sans"
                  >
                    <div>
                      <label className="block mb-1 text-navy-900 dark:text-gray-300">{t("currentPassword")}</label>
                      <input
                        type="password"
                        required
                        className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 outline-none font-medium text-navy-900 dark:text-white font-sans"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-navy-900 dark:text-gray-300">{t("newPassword")}</label>
                      <input
                        type="password"
                        required
                        className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 outline-none font-medium text-navy-900 dark:text-white font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl border border-blue-500/25 cursor-pointer font-headline"
                    >
                      {t("updatePassword")}
                    </button>
                  </form>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </section>

      </main>

      {/* Post job Drawer Form Overlay */}
      <AnimatePresence>
        {showJobForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#051B3D] border border-blue-600/30 rounded-3xl max-w-2xl w-full text-white shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-start border-b border-blue-600/20 pb-4 mb-4">
                <div>
                  <h3 className="font-headline text-sm font-bold text-white uppercase tracking-wider">{t("formPostJobTitle")}</h3>
                  <p className="text-[10px] text-gray-300 font-light">{t("formPostJobDesc")}</p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleAIGenerateJob}
                    disabled={generatingAI}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer transition-colors border border-blue-500/25 font-headline"
                  >
                    {generatingAI ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                    <span>{t("aiGenerateDetails")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowJobForm(false);
                      setFormMsg(null);
                    }}
                    className="text-gray-400 hover:text-white font-bold p-1.5 text-xs cursor-pointer border border-blue-600/20 rounded-xl bg-navy-900"
                  >
                    {t("close")}
                  </button>
                </div>
              </div>

              {formMsg && (
                <div className={`mb-6 p-4 rounded-xl border text-xs font-semibold ${formMsg.isError ? "bg-red-950/20 border-red-800 text-red-300" : "bg-green-950/20 border-green-800 text-green-300"}`}>
                  {formMsg.text}
                </div>
              )}

              <form onSubmit={handlePostJob} className="space-y-4 text-xs font-semibold text-gray-300 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-white">{t("fieldJobTitle")} *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. HVAC Commissioning Technician"
                      className="w-full bg-[#03132B] border border-blue-600/20 text-white rounded-xl p-3 outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-white">{t("sourcingSector")}</label>
                    <select
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full bg-[#03132B] border border-blue-600/20 text-white rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium cursor-pointer"
                    >
                      <option value="Healthcare">Healthcare & Nursing</option>
                      <option value="Construction">Construction & Engineering</option>
                      <option value="Oil & Gas">Oil, Gas & Energy</option>
                      <option value="Hospitality">Hospitality & Tourism</option>
                      <option value="Manufacturing">Manufacturing & Assembly</option>
                      <option value="Logistics">Logistics & Fleet Ops</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 text-white">{t("destinationCountry")}</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-[#03132B] border border-blue-600/20 text-white rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium cursor-pointer"
                    >
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="UAE">United Arab Emirates</option>
                      <option value="Qatar">Qatar</option>
                      <option value="Oman">Oman</option>
                      <option value="Kuwait">Kuwait</option>
                      <option value="Germany">Germany</option>
                      <option value="Singapore">Singapore</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-white">{t("fieldSalary")}</label>
                    <input
                      type="text"
                      value={salaryRange}
                      onChange={(e) => setSalaryRange(e.target.value)}
                      placeholder="e.g. SR 3,000 - 4,000 / mo"
                      className="w-full bg-[#03132B] border border-blue-600/20 text-white rounded-xl p-3 outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-white">{t("fieldVacancies")} *</label>
                    <input
                      type="number"
                      required
                      value={vacancies}
                      onChange={(e) => setVacancies(e.target.value)}
                      className="w-full bg-[#03132B] border border-blue-600/20 text-white rounded-xl p-3 outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-white">{t("fieldDesc")} *</label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#03132B] border border-blue-600/20 text-white rounded-xl p-3 outline-none focus:border-blue-500 font-medium resize-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-white">{t("fieldReq")} *</label>
                  <textarea
                    rows={3}
                    required
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="w-full bg-[#03132B] border border-blue-600/20 text-white rounded-xl p-3 outline-none focus:border-blue-500 font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center space-x-2 text-xs shadow cursor-pointer disabled:opacity-50 border border-blue-500/20 font-headline"
                >
                  {formLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <span>{t("btnPost")}</span>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
