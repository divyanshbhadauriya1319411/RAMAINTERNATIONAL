"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PipelineBoard from "@/components/dashboard/PipelineBoard";
import {
  Users,
  Landmark,
  Briefcase,
  Mail,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Shield,
  Activity,
  DollarSign,
  FileDown,
  Trash2,
  Lock,
  Search,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  Database,
  Globe,
  Grid,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Employer {
  id: string;
  companyName: string;
  email: string;
  industry?: string | null;
  isVerified: boolean;
  createdAt: string;
}

interface Candidate {
  id: string;
  fullName: string;
  email: string;
  location?: string | null;
  passportNumber?: string | null;
  resumeUrl?: string | null;
  isVerified: boolean;
}

interface Job {
  id: string;
  title: string;
  sector: string;
  country: string;
  vacancies: number;
  employer: {
    companyName: string;
  };
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
    employer: {
      companyName: string;
    };
  };
  candidate: {
    fullName: string;
    phone: string | null;
    resumeUrl: string | null;
    experienceYears: number | null;
    skills: string | null;
  };
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  companyName?: string | null;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "employers"
    | "candidates"
    | "jobs"
    | "applications"
    | "ats"
    | "crm"
    | "cms"
    | "communications"
    | "system"
  >("overview");

  // Data arrays
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [crmFilter, setCrmFilter] = useState("ALL");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Forms
  const [blogTitle, setBlogTitle] = useState("");
  const [blogCat, setBlogCat] = useState("Visa Update");
  const [blogSummary, setBlogSummary] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [cmsMsg, setCmsMsg] = useState<string | null>(null);

  const [seoTitle, setSeoTitle] = useState("RAMA INTERNATIONAL-INDIA | Leading Overseas Manpower Sourcing");
  const [seoKeywords, setSeoKeywords] = useState("overseas recruitment, gcc jobs, trade testing india");
  const [seoMsg, setSeoMsg] = useState<string | null>(null);

  const t = useTranslations("adminDashboard");
  const tCountries = useTranslations("countries");

  // Aggregate Stats
  const systemStats = {
    totalPlaced: 1242,
    annualRevenue: "₹1.84 Crores",
  };

  useEffect(() => {
    fetchAdminData();
  }, [refreshTrigger]);

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/dashboard/admin");
      if (res.ok) {
        const data = await res.json();
        setEmployers(data.employers || []);
        setCandidates(data.candidates || []);
        setJobs(data.jobs || []);
        setApplications(data.applications || []);
        setInquiries(data.inquiries || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmployer = async (empId: string) => {
    try {
      const res = await fetch(`/api/dashboard/admin/verify-employer?id=${empId}`, {
        method: "PATCH",
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerifyCandidate = async (candId: string) => {
    try {
      const res = await fetch(`/api/dashboard/admin/verify-candidate?id=${candId}`, {
        method: "PATCH",
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleInquiryStatus = async (inqId: string, status: string) => {
    try {
      const res = await fetch(`/api/dashboard/admin/crm-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: inqId, status }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBackupDatabase = () => {
    alert(t("alertDbBackup"));
  };

  const handlePublishNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim()) return;
    alert(t("alertPublishNews").replace("{title}", blogTitle).replace("{category}", blogCat));
    setBlogTitle("");
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setCmsMsg(null);
    try {
      const res = await fetch("/api/dashboard/admin/cms-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: blogTitle,
          category: blogCat,
          summary: blogSummary,
          content: blogContent,
        }),
      });

      if (res.ok) {
        setCmsMsg(t("cmsMsgSuccess"));
        setBlogTitle("");
        setBlogSummary("");
        setBlogContent("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSEO = (e: React.FormEvent) => {
    e.preventDefault();
    setSeoMsg(null);
    setTimeout(() => {
      setSeoMsg(t("seoMsgSuccess"));
    }, 800);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPLIED":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-450 dark:border-blue-800";
      case "SHORTLISTED":
        return "bg-yellow-50 text-yellow-750 border-yellow-250 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-800";
      case "INTERVIEW_SCHEDULED":
        return "bg-indigo-50 text-indigo-705 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-800";
      case "SELECTED":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800";
      case "VISA_STAGE":
        return "bg-amber-50 text-amber-705 border-amber-250 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800";
      case "MOBILIZED":
        return "bg-purple-50 text-purple-700 border-purple-250 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-light dark:bg-navy-950 text-xs font-semibold text-navy-900 dark:text-white transition-colors duration-200">
        <RefreshCw className="h-5 w-5 animate-spin text-gold-500 mr-2" />
        <span>{t("booting")}</span>
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
            <p className="text-xs text-gray-305 font-light">{t("welcomeDesc")}</p>
          </div>
          
          <div className="bg-[#0B3D91] border border-blue-600/20 rounded-2xl p-3.5 flex items-center space-x-3 text-xs">
            <Shield className="h-4.5 w-4.5 text-blue-500" />
            <div>
              <p className="text-gray-205">Deepak Chauhan</p>
              <p className="text-[10px] text-gray-400 font-light mt-0.5 uppercase tracking-wider">{t("superAdmin")}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:w-60 w-full shrink-0">
          <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-4 shadow-md flex flex-row overflow-x-auto lg:flex-col lg:space-y-2 gap-2 scrollbar-hide sticky top-24">
            {[
              { tab: "overview", label: t("tabOverview"), icon: Grid },
              { tab: "employers", label: t("tabEmployers"), icon: Landmark },
              { tab: "candidates", label: t("tabCandidates"), icon: Users },
              { tab: "jobs", label: t("tabJobs"), icon: Briefcase },
              { tab: "applications", label: t("tabApplications"), icon: FileText },
              { tab: "ats", label: t("tabAts"), icon: TrendingUp },
              { tab: "crm", label: t("crmHeading"), icon: Mail },
              { tab: "cms", label: t("tabCms"), icon: BookOpen },
              { tab: "communications", label: t("tabCommunications"), icon: MessageSquare },
              { tab: "system", label: t("tabSettings"), icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => {
                    setActiveTab(item.tab as any);
                    setCmsMsg(null);
                    setSeoMsg(null);
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
                    <div>
                      <h3 className="font-headline text-sm font-bold text-navy-900 dark:text-white uppercase tracking-wider">{t("bizOverview")}</h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-light font-sans font-medium">{t("bizOverviewDesc")}</p>
                    </div>
                    <button
                      onClick={() => setRefreshTrigger((prev) => prev + 1)}
                      className="border border-blue-600/30 dark:border-blue-500/20 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>{t("refreshMetrics")}</span>
                    </button>
                  </div>

                  {/* Operational stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-semibold">
                    <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-md space-y-1">
                      <span className="text-[10px] text-gray-400 dark:text-gray-400 font-bold uppercase tracking-wider block font-sans">{t("activeDrives")}</span>
                      <span className="text-2xl font-serif font-extrabold text-navy-900 dark:text-white">{jobs.length}</span>
                    </div>
                    <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-md space-y-1">
                      <span className="text-[10px] text-gray-400 dark:text-gray-400 font-bold uppercase tracking-wider block font-sans">{t("pendingVisa")}</span>
                      <span className="text-2xl font-serif font-extrabold text-navy-900 dark:text-white">{applications.filter((a) => a.status === "VISA_STAGE").length}</span>
                    </div>
                    <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-md space-y-1">
                      <span className="text-[10px] text-gray-400 dark:text-gray-400 font-bold uppercase tracking-wider block font-sans">{t("totalPlaced")}</span>
                      <span className="text-2xl font-serif font-extrabold text-[#051B3D] dark:text-white">{systemStats.totalPlaced}</span>
                    </div>
                    <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-md space-y-1">
                      <span className="text-[10px] text-gray-400 dark:text-gray-400 font-bold uppercase tracking-wider block font-sans">{t("grossRevenue")}</span>
                      <span className="text-2xl font-serif font-extrabold text-blue-600 dark:text-blue-400">{systemStats.annualRevenue}</span>
                    </div>
                  </div>

                  {/* Summary ratio panels */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md space-y-4">
                      <h4 className="font-bold text-navy-900 dark:text-white font-sans">{t("deploymentsTarget")}</h4>
                      <div className="space-y-3 font-bold text-[11px] text-navy-900 dark:text-white">
                        <div className="flex justify-between"><span>{tCountries("countryKSA")}</span><span className="text-blue-600 dark:text-blue-400">65% (806)</span></div>
                        <div className="flex justify-between"><span>{tCountries("countryUAE")}</span><span className="text-blue-600 dark:text-blue-400">20% (248)</span></div>
                        <div className="flex justify-between"><span>{tCountries("countryQatar")}</span><span className="text-blue-600 dark:text-blue-400">10% (124)</span></div>
                        <div className="flex justify-between"><span>{tCountries("countryEurope")}</span><span className="text-blue-600 dark:text-blue-400">5% (62)</span></div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md space-y-4">
                      <h4 className="font-bold text-navy-900 dark:text-white font-sans">{t("activePipelineRatios")}</h4>
                      <div className="space-y-3 font-bold text-[11px] text-navy-900 dark:text-white">
                        <div className="flex justify-between"><span>{t("biometricsComplete")}</span><span className="text-blue-600 dark:text-blue-400">45 {t("cases")}</span></div>
                        <div className="flex justify-between"><span>{t("embassyQueue")}</span><span className="text-blue-600 dark:text-blue-400">30 {t("cases")}</span></div>
                        <div className="flex justify-between"><span>{t("flightQueue")}</span><span className="text-blue-600 dark:text-blue-400">15 {t("cases")}</span></div>
                        <div className="flex justify-between"><span>{t("medicalPending")}</span><span className="text-blue-600 dark:text-blue-400">25 {t("cases")}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}              {/* Tab 2: Employers */}
              {activeTab === "employers" && (
                <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md space-y-6">
                  <h3 className="font-headline text-sm font-bold text-navy-900 dark:text-white pb-3 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider">{t("registeredClients")}</h3>
                  
                  <div className="overflow-x-auto text-xs font-semibold">
                    <table className="w-full text-left border-collapse text-navy-900 dark:text-white">
                      <thead>
                        <tr className="border-b border-gray-150 dark:border-white/5 text-gray-400">
                          <th className="pb-3.5">{t("companyName")}</th>
                          <th className="pb-3.5">{t("contactEmail")}</th>
                          <th className="pb-3.5">{t("industry")}</th>
                          <th className="pb-3.5">{t("regDate")}</th>
                          <th className="pb-3.5">{t("status")}</th>
                          <th className="pb-3.5 text-right">{t("verifyAction")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-medium">
                        {employers.map((emp) => (
                          <tr key={emp.id} className="text-navy-900 dark:text-white">
                            <td className="py-4 font-bold">{emp.companyName}</td>
                            <td className="py-4 text-gray-500 dark:text-gray-400">{emp.email}</td>
                            <td className="py-4 text-gray-555 dark:text-gray-400">{emp.industry || "General"}</td>
                            <td className="py-4 text-gray-450 dark:text-gray-500">{new Date(emp.createdAt).toLocaleDateString()}</td>
                            <td className="py-4">
                              <span className={`inline-block text-[9px] uppercase tracking-wider font-bold border px-2 py-0.5 rounded ${
                                emp.isVerified ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800" : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800"
                              }`}>
                                {emp.isVerified ? t("verified") : t("pending")}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              {!emp.isVerified && (
                                <button
                                  onClick={() => handleVerifyEmployer(emp.id)}
                                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase cursor-pointer transition-colors border-none"
                                >
                                  {t("verifyBtn")}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 3: Candidates */}
              {activeTab === "candidates" && (
                <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md space-y-6">
                  <h3 className="font-headline text-sm font-bold text-navy-900 dark:text-white pb-3 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider">{t("tabCandidates")}</h3>
                  
                  <div className="overflow-x-auto text-xs font-semibold">
                    <table className="w-full text-left border-collapse text-navy-900 dark:text-white">
                      <thead>
                        <tr className="border-b border-gray-150 dark:border-white/5 text-gray-400">
                          <th className="pb-3.5">{t("candidateName")}</th>
                          <th className="pb-3.5">{t("contactEmail")}</th>
                          <th className="pb-3.5">{t("passportNumber")}</th>
                          <th className="pb-3.5">{t("location")}</th>
                          <th className="pb-3.5">{t("status")}</th>
                          <th className="pb-3.5 text-right">{t("verifyAction")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-medium">
                        {candidates.map((cand) => (
                          <tr key={cand.id} className="text-navy-900 dark:text-white">
                            <td className="py-4 font-bold">{cand.fullName}</td>
                            <td className="py-4 text-gray-500 dark:text-gray-400">{cand.email}</td>
                            <td className="py-4 text-gray-450 dark:text-gray-400 uppercase">{cand.passportNumber || t("notLogged")}</td>
                            <td className="py-4 text-gray-500 dark:text-gray-400">{cand.location || t("pending")}</td>
                            <td className="py-4">
                              <span className={`inline-block text-[9px] uppercase tracking-wider font-bold border px-2 py-0.5 rounded ${
                                cand.isVerified ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800" : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800"
                              }`}>
                                {cand.isVerified ? t("verified") : t("pending")}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              {!cand.isVerified && (
                                <button
                                  onClick={() => handleVerifyCandidate(cand.id)}
                                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase cursor-pointer transition-colors border-none"
                                >
                                  {t("verifyBtn")}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 4: Active jobs drives */}
              {activeTab === "jobs" && (
                <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md space-y-6">
                  <h3 className="font-headline text-sm font-bold text-navy-900 dark:text-white pb-3 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider">{t("activeJobsRegistry")}</h3>
                  
                  <div className="overflow-x-auto text-xs font-semibold">
                    <table className="w-full text-left border-collapse text-navy-900 dark:text-white">
                      <thead>
                        <tr className="border-b border-gray-150 dark:border-white/5 text-gray-400">
                          <th className="pb-3.5">{t("jobTitle")}</th>
                          <th className="pb-3.5">{t("corpClient")}</th>
                          <th className="pb-3.5">{t("targetDest")}</th>
                          <th className="pb-3.5">{t("manpowerSector")}</th>
                          <th className="pb-3.5">{t("slots")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-medium">
                        {jobs.map((job) => (
                          <tr key={job.id} className="text-navy-900 dark:text-white">
                            <td className="py-4 font-bold">{job.title}</td>
                            <td className="py-4 text-gray-500 dark:text-gray-400">{job.employer.companyName}</td>
                            <td className="py-4 text-blue-600 dark:text-blue-400 font-bold">{job.country}</td>
                            <td className="py-4 text-gray-500 dark:text-gray-450">{job.sector}</td>
                            <td className="py-4 font-bold">{job.vacancies}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 5: Applications tracker */}
              {activeTab === "applications" && (
                <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md space-y-6">
                  <h3 className="font-headline text-sm font-bold text-navy-900 dark:text-white pb-3 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider">{t("applicationsTracker")}</h3>
                  
                  <div className="overflow-x-auto text-xs font-semibold">
                    <table className="w-full text-left border-collapse text-navy-900 dark:text-white">
                      <thead>
                        <tr className="border-b border-gray-150 dark:border-white/5 text-gray-400">
                          <th className="pb-3.5">{t("candidate")}</th>
                          <th className="pb-3.5">{t("targetVacancy")}</th>
                          <th className="pb-3.5">{t("employerClient")}</th>
                          <th className="pb-3.5">{t("targetDest")}</th>
                          <th className="pb-3.5">{t("sourcingStage")}</th>
                          <th className="pb-3.5">{t("loggedDate")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-medium">
                        {applications.map((app) => (
                          <tr key={app.id} className="text-navy-900 dark:text-white">
                            <td className="py-4 font-bold">{app.candidate.fullName}</td>
                            <td className="py-4 text-gray-500 dark:text-gray-400">{app.job.title}</td>
                            <td className="py-4 text-gray-500 dark:text-gray-400">{app.job.employer.companyName}</td>
                            <td className="py-4 text-gray-450 dark:text-gray-400">{app.job.country}</td>
                            <td className="py-4">
                              <span className={`inline-block text-[9px] uppercase tracking-wider font-bold border px-2.5 py-0.5 rounded-full ${getStatusBadge(app.status)}`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="py-4 text-gray-400 dark:text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 6: ATS board */}
              {activeTab === "ats" && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-gray-200 dark:border-white/5">
                    <h3 className="font-headline text-sm font-bold text-navy-900 dark:text-white uppercase tracking-wider">{t("atsBoardTitle")}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-sans">{t("atsBoardDesc")}</p>
                  </div>
                  <PipelineBoard applications={applications} onRefresh={fetchAdminData} />
                </div>
              )}

              {/* Tab 7: CRM Leads */}
              {activeTab === "crm" && (
                <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-150 dark:border-white/5">
                    <h3 className="font-headline text-sm font-bold text-[#051B3D] dark:text-white uppercase tracking-wider">{t("crmInboxTitle")}</h3>
                    
                    <select
                      value={crmFilter}
                      onChange={(e) => setCrmFilter(e.target.value)}
                      className="bg-luxury-light dark:bg-navy-950 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white rounded-xl p-1.5 text-[11px] font-semibold cursor-pointer outline-none"
                    >
                      <option value="ALL">{t("allLeads")}</option>
                      <option value="PENDING">PENDING</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    {inquiries
                      .filter((i) => crmFilter === "ALL" || i.status === crmFilter)
                      .map((inq) => (
                        <div
                          key={inq.id}
                          className={`border rounded-2xl p-5 space-y-3 text-xs ${
                            inq.status === "PENDING" ? "bg-amber-50/20 border-amber-200 dark:border-amber-800" : "bg-gray-50 dark:bg-navy-950/40 border-gray-200 dark:border-white/5"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-navy-900 dark:text-white text-sm font-headline">{inq.name}</h4>
                              <p className="text-gray-400 font-semibold mt-0.5">{inq.companyName || t("noCompany")}</p>
                            </div>
                            <select
                              value={inq.status}
                              onChange={(e) => handleInquiryStatus(inq.id, e.target.value)}
                              className="bg-white dark:bg-navy-900 border border-gray-205 dark:border-white/10 text-navy-900 dark:text-white rounded-lg p-1 text-[10px] font-bold outline-none cursor-pointer"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="ARCHIVED">ARCHIVED</option>
                            </select>
                          </div>

                          <p className="text-gray-655 dark:text-gray-300 leading-relaxed font-light bg-white dark:bg-navy-900 p-3.5 rounded-xl border border-gray-150 dark:border-white/5 font-sans">
                            "{inq.message}"
                          </p>

                          <div className="flex flex-wrap gap-4 text-gray-400 font-semibold text-[9px] uppercase tracking-wider font-sans">
                            <span>{t("emailLabel")}: {inq.email}</span>
                            {inq.phone && <span>{t("telLabel")}: {inq.phone}</span>}
                            <span>{t("loggedLabel")}: {new Date(inq.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Tab 8: Blog CMS */}
              {activeTab === "cms" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md space-y-4">
                    <h3 className="font-headline font-bold text-xs text-navy-900 dark:text-white pb-2 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider">{t("cmsHeading")}</h3>

                    {cmsMsg && (
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-450 rounded-xl text-xs font-semibold">
                        {cmsMsg}
                      </div>
                    )}

                    <form onSubmit={handleAddBlog} className="space-y-3.5 text-xs text-gray-550 dark:text-gray-300 font-semibold font-sans">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-0.5 text-navy-900 dark:text-gray-300">{t("articleTitle")} *</label>
                          <input
                            type="text"
                            required
                            value={blogTitle}
                            onChange={(e) => setBlogTitle(e.target.value)}
                            placeholder="e.g. GCC visa stamping updates"
                            className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white rounded-xl p-2.5 outline-none font-medium"
                          />
                        </div>
                        <div>
                          <label className="block mb-0.5 text-navy-900 dark:text-gray-300">{t("category")} *</label>
                          <select
                            value={blogCat}
                            onChange={(e) => setBlogCat(e.target.value)}
                            className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-200 dark:border-white/10 text-[#051B3D] dark:text-white rounded-xl p-2.5 outline-none font-medium cursor-pointer"
                          >
                            <option value="Visa Update">Visa Update</option>
                            <option value="Industry Insights">Industry Insights</option>
                            <option value="Hiring Tips">Hiring Tips</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-0.5 text-navy-900 dark:text-gray-300">{t("briefSummary")} *</label>
                        <input
                          type="text"
                          required
                          value={blogSummary}
                          onChange={(e) => setBlogSummary(e.target.value)}
                          className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white rounded-xl p-2.5 outline-none font-medium"
                        />
                      </div>

                      <div>
                        <label className="block mb-0.5 text-navy-900 dark:text-gray-300">{t("bodyContent")} *</label>
                        <textarea
                          rows={6}
                          required
                          value={blogContent}
                          onChange={(e) => setBlogContent(e.target.value)}
                          className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white rounded-xl p-2.5 outline-none font-medium resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-3.5 rounded-xl border border-blue-500/25 cursor-pointer text-[10px] font-headline"
                      >
                        {t("btnPublish")}
                      </button>
                    </form>
                  </div>

                  {/* Gallery */}
                  <div className="lg:col-span-1 bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md space-y-4">
                    <h3 className="font-headline font-bold text-xs text-navy-900 dark:text-white pb-2 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider flex items-center space-x-1.5">
                      <ImageIcon className="h-4.5 w-4.5 text-blue-500" />
                      <span>{t("cmsGallery")}</span>
                    </h3>
                    <p className="text-[10px] text-gray-450 dark:text-gray-400 font-light leading-relaxed">{t("cmsGalleryDesc")}</p>

                    <div className="border-2 border-dashed border-gray-200 dark:border-white/5 rounded-3xl p-10 text-center hover:border-blue-600 transition-colors">
                      <ImageIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <button
                        onClick={() => alert(t("alertPhotoUpload"))}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-3 rounded-xl border border-blue-500/25 cursor-pointer font-headline"
                      >
                        {t("btnSelectImage")}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 9: Communications Templates */}
              {activeTab === "communications" && (
                <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md space-y-6">
                  <div>
                    <h3 className="font-headline text-sm font-bold text-navy-900 dark:text-white pb-2 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider">{t("tabCommunications")}</h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-400 font-light mt-1 font-sans">{t("configureCommDesc")}</p>
                  </div>

                  <div className="space-y-4 text-xs font-semibold text-gray-555 dark:text-gray-300 font-sans">
                    {[
                      { channel: "EMAIL", name: "Candidate Shortlisted Notification", preview: "Subject: Congratulations! You have been shortlisted for [JobTitle]. Please review VFS biometrics schedule..." },
                      { channel: "WHATSAPP", name: "Visa Stamped Notification", preview: "WhatsApp: Dear [Name], your visa stamp for [Country] has been verified. Pack and report to Delhi HQ..." },
                    ].map((temp, i) => (
                      <div key={i} className="border border-gray-150 dark:border-white/5 rounded-2xl p-4 bg-luxury-light dark:bg-navy-950/30 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 bg-blue-600/10 px-2.5 py-0.5 rounded-lg border border-blue-550/15">
                            {temp.channel}
                          </span>
                          <h4 className="font-bold text-navy-900 dark:text-white text-xs font-headline">{temp.name}</h4>
                        </div>
                        <p className="text-[11px] text-gray-450 dark:text-gray-400 font-light italic bg-white dark:bg-navy-900 p-3.5 rounded-xl border border-gray-100 dark:border-white/5 font-sans">
                          "{temp.preview}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 10: System Settings */}
              {activeTab === "system" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Permissions */}
                  <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md space-y-4">
                    <h3 className="font-headline font-bold text-xs text-[#051B3D] dark:text-white pb-2 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider">{t("rolePermissions")}</h3>
                    <div className="space-y-3 text-xs font-semibold text-navy-900 dark:text-white">
                      {[
                        { role: "ADMIN", desc: "Full permissions: CRM, ATS, CMS and systems configs." },
                        { role: "EMPLOYER", desc: "Campaign posting, ATS drag/drop boards, schedule interviews." },
                        { role: "CANDIDATE", desc: "Profile dossier editing, easy applies, visa steppers." },
                      ].map((perm, i) => (
                        <div key={i} className="border border-gray-200 dark:border-white/5 p-3.5 rounded-xl bg-luxury-light dark:bg-navy-950/30 flex justify-between items-center text-navy-900 dark:text-white">
                          <div>
                            <h4 className="font-bold font-headline">{perm.role}</h4>
                            <p className="text-[10px] text-gray-400 dark:text-gray-400 font-light mt-0.5 font-sans leading-normal">{perm.desc}</p>
                          </div>
                          <Lock className="h-4 w-4 text-blue-500 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SEO & Backups */}
                  <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md space-y-6 font-sans">
                    <div className="space-y-4">
                      <h3 className="font-headline font-bold text-xs text-navy-900 dark:text-white pb-2 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider">{t("seoHeading")}</h3>
                      {seoMsg && (
                        <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl text-[11px] font-semibold">
                          {seoMsg}
                        </div>
                      )}
                      <form onSubmit={handleSaveSEO} className="space-y-3.5 text-xs text-gray-500 dark:text-gray-300 font-semibold">
                        <div>
                          <label className="block mb-0.5 text-[#051B3D] dark:text-gray-350">{t("metaTitle")} *</label>
                          <input
                            type="text"
                            required
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-205 dark:border-white/10 text-navy-900 dark:text-white rounded-xl p-3 outline-none font-medium focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block mb-0.5 text-[#051B3D] dark:text-gray-350">{t("metaKeywords")} *</label>
                          <input
                            type="text"
                            required
                            value={seoKeywords}
                            onChange={(e) => setSeoKeywords(e.target.value)}
                            className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-205 text-navy-900 dark:text-white rounded-xl p-3 outline-none font-medium focus:border-blue-500"
                          />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-3 rounded-xl border border-blue-500/20 cursor-pointer text-[9px] font-headline">
                          {t("saveMeta")}
                        </button>
                      </form>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-white/5">
                      <h4 className="font-headline text-xs font-bold text-navy-900 dark:text-white uppercase tracking-wider">{t("sysBackupTitle")}</h4>
                      <p className="text-[10px] text-gray-400 dark:text-gray-400 font-light leading-relaxed">{t("sysBackupDesc")}</p>
                      <button
                        onClick={handleBackupDatabase}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-3.5 rounded-xl text-[10px] shadow flex items-center justify-center space-x-1.5 cursor-pointer border border-blue-500/25 font-sans font-headline"
                      >
                        <Database className="h-4 w-4" />
                        <span>{t("sysBackupBtn")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </section>

      </main>

      <Footer />
    </div>
  );
}
