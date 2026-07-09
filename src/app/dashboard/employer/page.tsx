"use client";

import { useEffect, useState } from "react";
import {
  Landmark,
  Briefcase,
  Plus,
  FileText,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Grid,
  Users,
  Calendar,
  CreditCard,
  Settings,
  Shield,
  Activity,
  DollarSign,
  TrendingUp,
  FileDown,
  Compass,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PipelineBoard from "@/components/dashboard/PipelineBoard";

interface Job {
  id: string;
  title: string;
  sector: string;
  country: string;
  vacancies: number;
  status: string;
  createdAt: string;
}

export default function CompleteEmployerDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab routing
  const [activeTab, setActiveTab] = useState<"overview" | "profile" | "jobs" | "applicants" | "reports" | "billing" | "settings">("overview");

  // Post job form states
  const [showJobForm, setShowJobForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formMsg, setFormMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const [title, setTitle] = useState("");
  const [sector, setSector] = useState("Construction");
  const [country, setCountry] = useState("Saudi Arabia");
  const [salaryRange, setSalaryRange] = useState("");
  const [vacancies, setVacancies] = useState("1");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");

  // Company Profile form states
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        const emp = meData.user.employer;
        setProfile(emp);
        if (emp) {
          setCompanyName(emp.companyName || "");
          setIndustry(emp.industry || "");
          setWebsite(emp.website || "");
          setContactPerson(emp.contactPerson || "");
          setPhone(emp.phone || "");
          setAddress(emp.address || "");
        }
      }

      const appRes = await fetch("/api/applications");
      if (appRes.ok) {
        const appData = await appRes.json();
        setApplications(appData.applications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      fetch("/api/jobs")
        .then((res) => res.json())
        .then((data) => {
          setJobs(data.jobs.filter((j: any) => j.employerId === profile.id) || []);
        });
    }
  }, [profile]);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMsg(null);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, requirements, benefits, sector, country, salaryRange, vacancies }),
      });
      const data = await res.json();
      if (res.ok) {
        setFormMsg({ text: "Vacancy published successfully!", isError: false });
        setTitle("");
        setSalaryRange("");
        setVacancies("1");
        setDescription("");
        setRequirements("");
        setBenefits("");
        setShowJobForm(false);
        fetchDashboardData();
      } else {
        setFormMsg({ text: data.error || "Failed to post job.", isError: true });
      }
    } catch (e) {
      setFormMsg({ text: "A network error occurred.", isError: true });
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    setTimeout(() => {
      setProfileSaving(false);
      setProfileMsg("Corporate profile updated successfully!");
      if (profile) {
        setProfile({ ...profile, companyName, industry, website, contactPerson, phone, address });
      }
    }, 1000);
  };

  const [generatingAI, setGeneratingAI] = useState(false);
  const handleAIGenerateJob = async () => {
    if (!title) {
      alert("Please enter a Job Title first (e.g. HVAC Commissioning Technician).");
      return;
    }
    setGeneratingAI(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "job-description", title, sector, country }),
      });
      if (res.ok) {
        const data = await res.json();
        setDescription(data.jd.description);
        setRequirements(data.jd.requirements);
        setBenefits(data.jd.benefits);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingAI(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-luxury-light text-navy-900 font-sans">
      <Navbar />

      <div className="bg-[#051B3D] text-white py-12 border-b border-blue-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="font-serif text-2xl font-bold text-white">Recruiter Command Desk</h1>
            <p className="text-xs text-gray-300 font-light">Publish jobs, screen trade grades, and mobilize applicants.</p>
          </div>

          <div className="bg-[#0B3D91] border border-blue-600/20 rounded-2xl p-3.5 flex items-center space-x-3 text-xs font-bold">
            <Landmark className="h-4.5 w-4.5 text-blue-500" />
            <div>
              <p className="text-gray-205">{profile?.companyName || "Almarai Foods"}</p>
              <p className="text-[10px] text-gray-400 font-light mt-0.5 uppercase tracking-wider">{profile?.industry || "FMCG Partner"}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:w-60 shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md space-y-2 sticky top-24">
            {[
              { tab: "overview", label: "Control Center", icon: Grid },
              { tab: "profile", label: "Client Profile", icon: Landmark },
              { tab: "jobs", label: "Active Postings", icon: Briefcase },
              { tab: "applicants", label: "ATS board", icon: Users },
              { tab: "reports", label: "Reports Desk", icon: TrendingUp },
              { tab: "billing", label: "Billing & Invoices", icon: CreditCard },
              { tab: "settings", label: "Settings Desk", icon: Settings },
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
                  className={`w-full flex items-center space-x-2.5 px-4 py-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow border-l-4 border-white font-bold"
                      : "text-gray-500 hover:bg-luxury-light hover:text-[#051B3D]"
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
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <h3 className="font-serif text-sm font-bold text-navy-900">Control Panel Overview</h3>
                      <p className="text-[11px] text-gray-505 font-light font-sans">Monitor active hiring drives, screening pipelines and visa steps.</p>
                    </div>
                    <button
                      onClick={() => setShowJobForm(true)}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded-xl border border-blue-500/25 flex items-center space-x-1.5 shadow-sm cursor-pointer transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Post Vacancy</span>
                    </button>
                  </div>

                  {/* Counters */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-semibold">
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block font-sans">Active campaigns</span>
                      <span className="text-2xl font-serif font-extrabold text-navy-900">{jobs.length}</span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block font-sans">Sourced Applicants</span>
                      <span className="text-2xl font-serif font-extrabold text-navy-900">{applications.length}</span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block font-sans">Active Visas</span>
                      <span className="text-2xl font-serif font-extrabold text-navy-900">{applications.filter(a => a.status === "VISA_STAGE").length}</span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block font-sans">Subscription Tier</span>
                      <span className="text-xs font-bold text-blue-650 uppercase tracking-widest block pt-2">Enterprise Core</span>
                    </div>
                  </div>

                  {/* Activity Log */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-4">
                    <h3 className="font-serif font-bold text-xs text-navy-900 pb-3 border-b border-gray-150 uppercase tracking-wider flex items-center space-x-2">
                      <Activity className="h-4.5 w-4.5 text-blue-500" />
                      <span>Activity Log</span>
                    </h3>

                    <div className="space-y-4 text-xs font-light">
                      {[
                        { time: "2 hours ago", desc: "Shortlisted Candidate Rahul Sharma for Senior Industrial Electrician drive." },
                        { time: "Yesterday", desc: "Scheduled Zoom Interview for candidate Rahul Sharma on Thursday 11:00 AM." },
                        { time: "3 days ago", desc: "Published new global vacancy campaign: Senior Industrial Electrician (15 open slots)." },
                      ].map((item, i) => (
                        <div key={i} className="flex space-x-3 items-start">
                          <span className="text-[10px] text-blue-600 font-bold shrink-0 w-20">{item.time}</span>
                          <p className="text-gray-500 leading-relaxed font-sans font-medium">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Profile */}
              {activeTab === "profile" && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-navy-900 pb-2 border-b border-gray-150 uppercase tracking-wider">Company Profile</h3>
                    <p className="text-[10px] text-gray-400 font-light mt-1">Configure company profiles to present on vacancy boards.</p>
                  </div>

                  {profileMsg && (
                    <div className="p-4 bg-green-50 border border-green-200 text-green-705 rounded-xl text-xs font-semibold">
                      {profileMsg}
                    </div>
                  )}

                  <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-semibold text-gray-550">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-navy-900">Company Name *</label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full bg-luxury-light border border-gray-200 text-[#051B3D] rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-navy-900">Industry Sector</label>
                        <input
                          type="text"
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          className="w-full bg-luxury-light border border-gray-200 text-[#051B3D] rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block mb-1 text-navy-900">Corporate Website</label>
                        <input
                          type="text"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="w-full bg-luxury-light border border-gray-200 text-[#051B3D] rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-navy-900">Contact Officer</label>
                        <input
                          type="text"
                          value={website}
                          onChange={(e) => setContactPerson(e.target.value)}
                          className="w-full bg-luxury-light border border-gray-200 text-[#051B3D] rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-navy-900">Telephone Hotlines</label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-luxury-light border border-gray-200 text-[#051B3D] rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 text-navy-900">Corporate Address</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-luxury-light border border-gray-200 text-[#051B3D] rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-3.5 rounded-xl border border-blue-500/25 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      {profileSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <span>Save Company Profile</span>}
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 3: Active Postings */}
              {activeTab === "jobs" && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-150">
                    <h3 className="font-serif text-sm font-bold text-navy-900 uppercase tracking-wider">Hiring Campaigns</h3>
                    <span className="text-xs text-gray-500 font-semibold">{jobs.length} Published vacancies</span>
                  </div>

                  {jobs.length === 0 ? (
                    <div className="py-16 text-center text-gray-400 text-xs font-semibold">
                      <Briefcase className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                      <p>No active postings cataloged.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto text-xs font-semibold">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-150 text-gray-400">
                            <th className="pb-3.5">Position Title</th>
                            <th className="pb-3.5">Sector</th>
                            <th className="pb-3.5">Country</th>
                            <th className="pb-3.5">Vacancies</th>
                            <th className="pb-3.5">Status</th>
                            <th className="pb-3.5 text-right">Date Created</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                          {jobs.map((job) => (
                            <tr key={job.id} className="text-[#051B3D]">
                              <td className="py-4 font-bold">{job.title}</td>
                              <td className="py-4 text-gray-500">{job.sector}</td>
                              <td className="py-4 text-gray-500">{job.country}</td>
                              <td className="py-4">{job.vacancies} Positions</td>
                              <td className="py-4">
                                <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase">
                                  {job.status}
                                </span>
                              </td>
                              <td className="py-4 text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: ATS Pipeline board */}
              {activeTab === "applicants" && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-gray-200">
                    <h3 className="font-serif text-sm font-bold text-navy-900 uppercase tracking-wider">Hiring Pipeline Board</h3>
                    <p className="text-xs text-gray-500 mt-0.5 font-sans">Click candidate cards to update logs, schedule interviews, select or reject.</p>
                  </div>
                  <PipelineBoard applications={applications} onRefresh={fetchDashboardData} />
                </div>
              )}

              {/* Tab 5: Reports Desk */}
              {activeTab === "reports" && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-6">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[#051B3D] pb-2 border-b border-gray-150 uppercase tracking-wider">Recruitment Analytics</h3>
                    <p className="text-[10px] text-gray-400 font-light mt-1 font-sans">Visual metrics of screening ratios and mobilizations.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-500 font-medium">
                    <div className="bg-luxury-light border border-gray-200 p-5 rounded-2xl space-y-4">
                      <h4 className="font-bold text-navy-900">Campaign Screening Funnel</h4>
                      <div className="space-y-3.5 font-semibold text-[11px] text-[#051B3D]">
                        <div className="flex justify-between"><span>Applied CVs</span><span className="text-[#051B3D]">100% (25)</span></div>
                        <div className="flex justify-between"><span>Shortlisted candidates</span><span className="text-[#051B3D]">60% (15)</span></div>
                        <div className="flex justify-between"><span>Interviews Scheduled</span><span className="text-[#051B3D]">40% (10)</span></div>
                        <div className="flex justify-between"><span>Consulate Selects</span><span className="text-[#051B3D]">20% (5)</span></div>
                      </div>
                    </div>

                    <div className="bg-luxury-light border border-gray-200 p-5 rounded-2xl space-y-4">
                      <h4 className="font-bold text-navy-900">Hiring Average Timing</h4>
                      <div className="space-y-3.5 font-semibold text-[11px] text-[#051B3D]">
                        <div className="flex justify-between"><span>Time to select candidates</span><span className="text-[#051B3D]">12 Days</span></div>
                        <div className="flex justify-between"><span>Medical & Wafid clearance</span><span className="text-[#051B3D]">8 Days</span></div>
                        <div className="flex justify-between"><span>Consulate visa stamping</span><span className="text-[#051B3D]">14 Days</span></div>
                        <div className="flex justify-between"><span>Average time to deploy</span><span className="text-[#051B3D]">34 Days</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 6: Billing */}
              {activeTab === "billing" && (
                <div className="space-y-6">
                  {/* Subscription card */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-2">
                      <span className="text-[10px] text-blue-600 bg-blue-500/10 px-2.5 py-0.5 rounded-lg border border-blue-500/20 uppercase font-bold tracking-wider">Active Tier</span>
                      <h3 className="font-serif text-sm font-bold text-navy-900 uppercase tracking-wider">Enterprise Core Plan</h3>
                      <p className="text-xs text-gray-500 leading-relaxed font-light font-sans">Includes unlimited job postings, complete access to database CV searches, and custom visa tracking pipelines.</p>
                    </div>
                    <div className="text-center md:text-right text-xs font-semibold">
                      <p className="text-gray-400">Next Renewal Date</p>
                      <p className="text-[#051B3D] text-lg font-bold">September 15, 2026</p>
                      <p className="text-blue-600 font-bold tracking-widest mt-1">₹1,50,000 / Annual</p>
                    </div>
                  </div>

                  {/* Invoices */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-4">
                    <h3 className="font-serif font-bold text-xs text-[#051B3D] pb-3 border-b border-gray-150 uppercase tracking-wider">Invoice History</h3>
                    <div className="overflow-x-auto text-xs font-semibold">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-150 text-gray-400">
                            <th className="pb-3.5">Invoice ID</th>
                            <th className="pb-3.5">Billing Period</th>
                            <th className="pb-3.5">Amount Paid</th>
                            <th className="pb-3.5">Status</th>
                            <th className="pb-3.5 text-right">Download</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                          {[
                            { id: "INV-2026-904", period: "Sept 2025 - Sept 2026", amount: "₹1,50,000", status: "PAID" },
                            { id: "INV-2024-812", period: "Sept 2024 - Sept 2025", amount: "₹1,20,000", status: "PAID" },
                          ].map((inv) => (
                            <tr key={inv.id} className="text-[#051B3D]">
                              <td className="py-4 font-bold">{inv.id}</td>
                              <td className="py-4 text-gray-500">{inv.period}</td>
                              <td className="py-4 text-blue-600 font-bold">{inv.amount}</td>
                              <td className="py-4">
                                <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase">
                                  {inv.status}
                                </span>
                              </td>
                              <td className="py-4 text-right">
                                <button
                                  onClick={() => alert(`Downloading invoice receipt: ${inv.id}.pdf`)}
                                  className="text-navy-900 hover:text-blue-500 font-bold uppercase tracking-wider inline-flex items-center space-x-1 cursor-pointer"
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
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-navy-900 pb-2 border-b border-gray-150 uppercase tracking-wider">Account Settings</h3>
                    <p className="text-[10px] text-gray-400 font-light mt-1 font-sans">Configure portal passwords and credential alerts.</p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert("Recruiter portal password updated successfully!");
                    }}
                    className="space-y-4 max-w-sm text-xs font-semibold text-gray-550"
                  >
                    <div>
                      <label className="block mb-1 text-navy-900">Current Password</label>
                      <input
                        type="password"
                        required
                        className="w-full bg-luxury-light border border-gray-200 rounded-xl p-3.5 outline-none font-medium text-navy-900"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-navy-900">New Password</label>
                      <input
                        type="password"
                        required
                        className="w-full bg-luxury-light border border-gray-200 rounded-xl p-3.5 outline-none font-medium text-navy-900"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl border border-blue-500/25 cursor-pointer"
                    >
                      Update Password
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
                  <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Publish Sourced Position</h3>
                  <p className="text-[10px] text-gray-300 font-light">Input technical qualifications to list on Job Board.</p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleAIGenerateJob}
                    disabled={generatingAI}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer transition-colors border border-blue-500/25"
                  >
                    {generatingAI ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                    <span>AI Generate Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowJobForm(false);
                      setFormMsg(null);
                    }}
                    className="text-gray-400 hover:text-white font-bold p-1.5 text-xs cursor-pointer border border-blue-600/20 rounded-xl bg-navy-900"
                  >
                    ✕ Close
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
                    <label className="block mb-1 text-white">Job Title *</label>
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
                    <label className="block mb-1 text-white">Sourcing Sector *</label>
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
                    <label className="block mb-1 text-white">Destination Country *</label>
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
                    <label className="block mb-1 text-white">Salary Range</label>
                    <input
                      type="text"
                      value={salaryRange}
                      onChange={(e) => setSalaryRange(e.target.value)}
                      placeholder="e.g. SR 3,000 - 4,000 / mo"
                      className="w-full bg-[#03132B] border border-blue-600/20 text-white rounded-xl p-3 outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-white">Vacancies *</label>
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
                  <label className="block mb-1 text-white">Description *</label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#03132B] border border-blue-600/20 text-white rounded-xl p-3 outline-none focus:border-blue-500 font-medium resize-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-white">Requirements *</label>
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
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center space-x-2 text-xs shadow cursor-pointer disabled:opacity-50 border border-blue-500/20"
                >
                  {formLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <span>Publish Vacancy Campaign</span>}
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
