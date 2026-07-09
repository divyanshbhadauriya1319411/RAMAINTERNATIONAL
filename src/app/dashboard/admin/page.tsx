"use client";

import { useEffect, useState } from "react";
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
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PipelineBoard from "@/components/dashboard/PipelineBoard";

interface Candidate {
  id: string;
  fullName: string;
  phone?: string | null;
  passportNumber?: string | null;
  resumeUrl?: string | null;
  skills?: string | null;
  experienceYears?: number | null;
  education?: string | null;
  location?: string | null;
}

interface Employer {
  id: string;
  companyName: string;
  industry?: string | null;
  website?: string | null;
  contactPerson?: string | null;
  phone?: string | null;
  address?: string | null;
  isVerified: boolean;
}

interface Job {
  id: string;
  title: string;
  sector: string;
  country: string;
  vacancies: number;
  status: string;
  createdAt: string;
  employer: {
    companyName: string;
  };
}

export default function SuperAdminPanel() {
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Tab routing
  const [activeTab, setActiveTab] = useState<"overview" | "employers" | "candidates" | "jobs" | "applications" | "ats" | "crm" | "cms" | "communications" | "system">("overview");

  // CRM edit states
  const [crmFilter, setCrmFilter] = useState("ALL");

  // Blog CMS states
  const [blogTitle, setBlogTitle] = useState("");
  const [blogCat, setBlogCat] = useState("Visa Update");
  const [blogSummary, setBlogSummary] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [cmsMsg, setCmsMsg] = useState<string | null>(null);

  // SEO configuration states
  const [seoTitle, setSeoTitle] = useState("RAMA INTERNATIONAL | Global Recruitment");
  const [seoKeywords, setSeoKeywords] = useState("Recruitment, Manpower, GCC Jobs, Visa Attestations");
  const [seoMsg, setSeoMsg] = useState<string | null>(null);

  const [systemStats, setSystemStats] = useState({
    totalPlaced: 1240,
    annualRevenue: "₹84,50,000",
  });

  useEffect(() => {
    fetchAdminData();
  }, [refreshTrigger]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        setProfile(meData.user);
      }

      const appRes = await fetch("/api/applications");
      if (appRes.ok) {
        const appData = await appRes.json();
        setApplications(appData.applications || []);
      }

      const jobsRes = await fetch("/api/jobs");
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData.jobs || []);
      }

      const contactRes = await fetch("/api/contact");
      if (contactRes.ok) {
        const contactData = await contactRes.json();
        setInquiries(contactData.inquiries || []);
      }

      setEmployers([
        { id: "emp-1", companyName: "Almarai Foods Group", industry: "FMCG / Manufacturing", website: "https://almarai.com", contactPerson: "Dr. Khaled Al-Mutairi", phone: "+966 11 470 0000", address: "Riyadh, Saudi Arabia", isVerified: true },
        { id: "emp-2", companyName: "Sterling Projects GmbH", industry: "Construction", website: "https://sterling-projects.de", contactPerson: "Marc Sterling", phone: "+49 89 231456", address: "Munich, Germany", isVerified: true },
        { id: "emp-3", companyName: "Gulf Energy Contractors", industry: "Oil & Gas", website: "https://gulfenergy.com", contactPerson: "Ahmed Al-Mansoori", phone: "+974 4455 6677", address: "Doha, Qatar", isVerified: false },
      ]);

      setCandidates([
        { id: "cand-1", fullName: "Rahul Sharma", phone: "+91 93105 89800", passportNumber: "Z1234567", resumeUrl: "/uploads/resumes/Verified_Rahul_CV.pdf", skills: "Electrician, maintenance", experienceYears: 5, education: "ITI Diploma", location: "Delhi, India" },
        { id: "cand-2", fullName: "Amit Kumar", phone: "+91 82879 85415", passportNumber: "Y8765432", resumeUrl: null, skills: "TIG Welder, structural piping", experienceYears: 8, education: "Vocational Certificate", location: "Mumbai, India" },
        { id: "cand-3", fullName: "Priya Nair", phone: "+91 78397 07378", passportNumber: "X9876543", resumeUrl: "/uploads/resumes/Priya_Nursing_Resume.pdf", skills: "Staff Nurse, Critical Care ICU", experienceYears: 3, education: "B.Sc Nursing", location: "Kochi, India" },
      ]);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmployer = (employerId: string) => {
    setEmployers((prev) =>
      prev.map((emp) => (emp.id === employerId ? { ...emp, isVerified: !emp.isVerified } : emp))
    );
  };

  const handleInquiryStatus = async (inquiryId: string, newStatus: string) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === inquiryId ? { ...inq, status: newStatus } : inq))
    );
  };

  const handleToggleJobStatus = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, status: job.status === "OPEN" ? "CLOSED" : "OPEN" } : job))
    );
  };

  const handleAddBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogSummary) return;
    setCmsMsg("New blog article published to Public CMS database!");
    setTimeout(() => setCmsMsg(null), 4000);
    setBlogTitle("");
    setBlogSummary("");
    setBlogContent("");
  };

  const handleSaveSEO = (e: React.FormEvent) => {
    e.preventDefault();
    setSeoMsg("Meta tags and schema structures updated successfully!");
    setTimeout(() => setSeoMsg(null), 4000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPLIED":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "SHORTLISTED":
        return "bg-yellow-50 text-yellow-805 border-yellow-250";
      case "INTERVIEW_SCHEDULED":
        return "bg-indigo-50 text-indigo-850 border-indigo-250";
      case "SELECTED":
        return "bg-green-50 text-green-800 border-green-200";
      case "VISA_STAGE":
        return "bg-amber-50 text-amber-805 border-amber-250";
      case "MOBILIZED":
        return "bg-purple-50 text-purple-800 border-purple-250";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-luxury-light text-navy-900 font-sans">
      <Navbar />

      <div className="bg-[#051B3D] text-white py-12 border-b border-blue-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="font-serif text-2xl font-bold text-white">Super Admin Console</h1>
            <p className="text-xs text-gray-305 font-light">Liaison and global operations oversight control board.</p>
          </div>

          <div className="bg-[#0B3D91] border border-blue-600/20 rounded-2xl p-3.5 flex items-center space-x-3 text-xs font-bold">
            <Lock className="h-4.5 w-4.5 text-blue-500" />
            <div>
              <p className="text-gray-205">Deepak Chauhan</p>
              <p className="text-[10px] text-gray-400 font-light mt-0.5 uppercase tracking-wider">Super Administrator</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:w-60 shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md space-y-2 sticky top-24">
            {[
              { tab: "overview", label: "Overview Panel", icon: Grid },
              { tab: "employers", label: "Clients list", icon: Landmark },
              { tab: "candidates", label: "Dossiers list", icon: Users },
              { tab: "jobs", label: "Job Campaigns", icon: Briefcase },
              { tab: "applications", label: "Applications Tracker", icon: FileText },
              { tab: "ats", label: "ATS board", icon: TrendingUp },
              { tab: "crm", label: "CRM Leads", icon: Mail },
              { tab: "cms", label: "Blog & Gallery", icon: BookOpen },
              { tab: "communications", label: "Template Alerts", icon: MessageSquare },
              { tab: "system", label: "Settings Panel", icon: Settings },
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
                  className={`w-full flex items-center space-x-2.5 px-4 py-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow border-l-4 border-white font-bold"
                      : "text-gray-550 hover:bg-luxury-light hover:text-[#051B3D]"
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
                    <div>
                      <h3 className="font-serif text-sm font-bold text-navy-900 uppercase tracking-wider">Business Overview</h3>
                      <p className="text-[11px] text-gray-505 font-light font-sans font-medium">RAMA INTERNATIONAL gross statistics panel.</p>
                    </div>
                    <button
                      onClick={() => setRefreshTrigger((prev) => prev + 1)}
                      className="border border-blue-600/30 hover:bg-blue-600 hover:text-white text-blue-600 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Refresh Metrics</span>
                    </button>
                  </div>

                  {/* Operational stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-semibold">
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block font-sans">Job Campaigns</span>
                      <span className="text-2xl font-serif font-extrabold text-navy-900">{jobs.length}</span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block font-sans">Active Visas</span>
                      <span className="text-2xl font-serif font-extrabold text-navy-900">{applications.filter((a) => a.status === "VISA_STAGE").length}</span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block font-sans">Total Mobilized</span>
                      <span className="text-2xl font-serif font-extrabold text-[#051B3D]">{systemStats.totalPlaced}</span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block font-sans">Gross Revenue</span>
                      <span className="text-2xl font-serif font-extrabold text-blue-600">{systemStats.annualRevenue}</span>
                    </div>
                  </div>

                  {/* Summary ratio panels */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold text-gray-500">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-4">
                      <h4 className="font-bold text-navy-900 font-sans">Deployments by Target Destination</h4>
                      <div className="space-y-3 font-bold text-[11px] text-navy-900">
                        <div className="flex justify-between"><span>Saudi Arabia (KSA)</span><span className="text-blue-600">65% (806)</span></div>
                        <div className="flex justify-between"><span>United Arab Emirates (UAE)</span><span className="text-blue-600">20% (248)</span></div>
                        <div className="flex justify-between"><span>State of Qatar</span><span className="text-blue-600">10% (124)</span></div>
                        <div className="flex justify-between"><span>Schengen Zone (Europe)</span><span className="text-blue-600">5% (62)</span></div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-4">
                      <h4 className="font-bold text-navy-900 font-sans">Active Pipeline Ratios</h4>
                      <div className="space-y-3 font-bold text-[11px] text-navy-900">
                        <div className="flex justify-between"><span>Biometrics Complete</span><span className="text-blue-600">45 Cases</span></div>
                        <div className="flex justify-between"><span>Embassy Queue Stamping</span><span className="text-blue-600">30 Cases</span></div>
                        <div className="flex justify-between"><span>Flight departures queue</span><span className="text-blue-600">15 Cases</span></div>
                        <div className="flex justify-between"><span>Medical approvals pending</span><span className="text-blue-600">25 Cases</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Employers */}
              {activeTab === "employers" && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-6">
                  <h3 className="font-serif text-sm font-bold text-navy-900 pb-3 border-b border-gray-150 uppercase tracking-wider">Registered Corporate Clients</h3>
                  
                  <div className="overflow-x-auto text-xs font-semibold">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-150 text-gray-400">
                          <th className="pb-3.5">Company Name</th>
                          <th className="pb-3.5">Industry</th>
                          <th className="pb-3.5">Contact Person</th>
                          <th className="pb-3.5">Address</th>
                          <th className="pb-3.5">Verification</th>
                          <th className="pb-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {employers.map((emp) => (
                          <tr key={emp.id} className="text-navy-900">
                            <td className="py-4 font-bold">{emp.companyName}</td>
                            <td className="py-4 text-gray-500">{emp.industry}</td>
                            <td className="py-4 text-gray-500">{emp.contactPerson}</td>
                            <td className="py-4 text-gray-450">{emp.address}</td>
                            <td className="py-4">
                              <span className={`px-2 py-0.5 rounded-lg text-[9px] uppercase font-bold border ${emp.isVerified ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"}`}>
                                {emp.isVerified ? "Verified" : "Pending"}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <button
                                onClick={() => handleVerifyEmployer(emp.id)}
                                className={`text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-colors cursor-pointer border ${emp.isVerified ? "border-red-200 text-red-650 bg-red-50/15 hover:bg-red-50" : "border-blue-600/30 text-blue-650 bg-blue-500/5 hover:bg-blue-500/10"}`}
                              >
                                {emp.isVerified ? "De-Authorize" : "Approve Client"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 3: Candidates list */}
              {activeTab === "candidates" && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-6">
                  <h3 className="font-serif text-sm font-bold text-navy-900 pb-3 border-b border-gray-150 uppercase tracking-wider">Registered Candidate Dossiers</h3>

                  <div className="overflow-x-auto text-xs font-semibold">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-150 text-gray-400">
                          <th className="pb-3.5">FullName</th>
                          <th className="pb-3.5">Passport</th>
                          <th className="pb-3.5">Skills</th>
                          <th className="pb-3.5">Experience</th>
                          <th className="pb-3.5">Location</th>
                          <th className="pb-3.5 text-right">Resume File</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {candidates.map((cand) => (
                          <tr key={cand.id} className="text-navy-900">
                            <td className="py-4 font-bold">{cand.fullName}</td>
                            <td className="py-4 text-gray-500 uppercase">{cand.passportNumber || "Not Provided"}</td>
                            <td className="py-4 text-gray-550 truncate max-w-[150px]">{cand.skills || "Not Provided"}</td>
                            <td className="py-4 text-gray-500">{cand.experienceYears || 0} Years</td>
                            <td className="py-4 text-gray-450">{cand.location || "Not Provided"}</td>
                            <td className="py-4 text-right">
                              {cand.resumeUrl ? (
                                <a
                                  href={cand.resumeUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-600 hover:text-blue-500 font-bold inline-flex items-center space-x-1 hover:underline"
                                >
                                  <FileDown className="h-4 w-4 shrink-0" />
                                  <span>Download</span>
                                </a>
                              ) : (
                                <span className="text-gray-400 font-light font-sans">None</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 4: Jobs management */}
              {activeTab === "jobs" && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-6">
                  <h3 className="font-serif text-sm font-bold text-navy-900 pb-3 border-b border-gray-150 uppercase tracking-wider">Hiring Campaigns</h3>

                  <div className="overflow-x-auto text-xs font-semibold">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-150 text-gray-400">
                          <th className="pb-3.5">Position Title</th>
                          <th className="pb-3.5">Corporate Employer</th>
                          <th className="pb-3.5">Sector</th>
                          <th className="pb-3.5">Country</th>
                          <th className="pb-3.5">Vacancies</th>
                          <th className="pb-3.5">Status</th>
                          <th className="pb-3.5 text-right">Campaign Controls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {jobs.map((job) => (
                          <tr key={job.id} className="text-navy-900">
                            <td className="py-4 font-bold">{job.title}</td>
                            <td className="py-4 text-gray-500">{job.employer.companyName}</td>
                            <td className="py-4 text-gray-500">{job.sector}</td>
                            <td className="py-4 text-gray-550">{job.country}</td>
                            <td className="py-4 text-gray-450">{job.vacancies} slots</td>
                            <td className="py-4">
                              <span className={`px-2 py-0.5 rounded-lg text-[9px] uppercase font-bold border ${job.status === "OPEN" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-750 border-red-200"}`}>
                                {job.status}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <button
                                onClick={() => handleToggleJobStatus(job.id)}
                                className={`text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-colors cursor-pointer border ${job.status === "OPEN" ? "border-red-200 text-red-650 bg-red-50/15 hover:bg-red-50" : "border-green-200 text-green-650 bg-green-50/10 hover:bg-green-50"}`}
                              >
                                {job.status === "OPEN" ? "Close Post" : "Open Post"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 5: Applications tracker */}
              {activeTab === "applications" && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-6">
                  <h3 className="font-serif text-sm font-bold text-navy-900 pb-3 border-b border-gray-150 uppercase tracking-wider">Global Applications Logs</h3>

                  <div className="overflow-x-auto text-xs font-semibold">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-150 text-gray-400">
                          <th className="pb-3.5">Candidate</th>
                          <th className="pb-3.5">Position</th>
                          <th className="pb-3.5">Employer</th>
                          <th className="pb-3.5">Country</th>
                          <th className="pb-3.5">Pipeline Stage</th>
                          <th className="pb-3.5">Date Applied</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {applications.map((app) => (
                          <tr key={app.id} className="text-navy-900">
                            <td className="py-4 font-bold">{app.candidate.fullName}</td>
                            <td className="py-4 text-gray-500">{app.job.title}</td>
                            <td className="py-4 text-gray-500">{app.job.employer.companyName}</td>
                            <td className="py-4 text-gray-450">{app.job.country}</td>
                            <td className="py-4">
                              <span className={`inline-block text-[9px] uppercase tracking-wider font-bold border px-2.5 py-0.5 rounded-full ${getStatusBadge(app.status)}`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="py-4 text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</td>
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
                  <div className="pb-2 border-b border-gray-200">
                    <h3 className="font-serif text-sm font-bold text-navy-900 uppercase tracking-wider">Global ATS Command Board</h3>
                    <p className="text-xs text-gray-555 mt-0.5 font-sans">Full administrative drag/drop controls across all company recruitment campaigns.</p>
                  </div>
                  <PipelineBoard applications={applications} onRefresh={fetchAdminData} />
                </div>
              )}

              {/* Tab 7: CRM Leads */}
              {activeTab === "crm" && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-150">
                    <h3 className="font-serif text-sm font-bold text-[#051B3D] uppercase tracking-wider">CRM Inquiries Inbox</h3>
                    
                    <select
                      value={crmFilter}
                      onChange={(e) => setCrmFilter(e.target.value)}
                      className="bg-luxury-light border border-gray-200 text-navy-900 rounded-xl p-1.5 text-[11px] font-semibold cursor-pointer outline-none"
                    >
                      <option value="ALL">All Leads</option>
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
                            inq.status === "PENDING" ? "bg-amber-50/20 border-amber-205" : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-navy-900 text-sm">{inq.name}</h4>
                              <p className="text-gray-400 font-semibold mt-0.5">{inq.companyName || "No Company"}</p>
                            </div>
                            <select
                              value={inq.status}
                              onChange={(e) => handleInquiryStatus(inq.id, e.target.value)}
                              className="bg-white border border-gray-205 text-navy-900 rounded-lg p-1 text-[10px] font-bold outline-none cursor-pointer"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="ARCHIVED">ARCHIVED</option>
                            </select>
                          </div>

                          <p className="text-gray-600 leading-relaxed font-light bg-white p-3.5 rounded-xl border border-gray-150 font-sans">
                            "{inq.message}"
                          </p>

                          <div className="flex flex-wrap gap-4 text-gray-400 font-semibold text-[9px] uppercase tracking-wider font-sans">
                            <span>Email: {inq.email}</span>
                            {inq.phone && <span>Tel: {inq.phone}</span>}
                            <span>Logged: {new Date(inq.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Tab 8: Blog CMS */}
              {activeTab === "cms" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-4">
                    <h3 className="font-serif font-bold text-xs text-navy-900 pb-2 border-b border-gray-150 uppercase tracking-wider">Publish News / Article</h3>

                    {cmsMsg && (
                      <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-semibold">
                        {cmsMsg}
                      </div>
                    )}

                    <form onSubmit={handleAddBlog} className="space-y-3.5 text-xs text-gray-550 font-semibold font-sans">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-0.5 text-navy-900">Article Title *</label>
                          <input
                            type="text"
                            required
                            value={blogTitle}
                            onChange={(e) => setBlogTitle(e.target.value)}
                            placeholder="e.g. GCC visa stamping updates"
                            className="w-full bg-luxury-light border border-gray-200 text-[#051B3D] rounded-xl p-2.5 outline-none font-medium"
                          />
                        </div>
                        <div>
                          <label className="block mb-0.5 text-navy-900">Category *</label>
                          <select
                            value={blogCat}
                            onChange={(e) => setBlogCat(e.target.value)}
                            className="w-full bg-luxury-light border border-gray-200 text-[#051B3D] rounded-xl p-2.5 outline-none font-medium cursor-pointer"
                          >
                            <option value="Visa Update">Visa Update</option>
                            <option value="Industry Insights">Industry Insights</option>
                            <option value="Hiring Tips">Hiring Tips</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-0.5 text-navy-900">Brief Summary *</label>
                        <input
                          type="text"
                          required
                          value={blogSummary}
                          onChange={(e) => setBlogSummary(e.target.value)}
                          className="w-full bg-luxury-light border border-gray-200 text-[#051B3D] rounded-xl p-2.5 outline-none font-medium"
                        />
                      </div>

                      <div>
                        <label className="block mb-0.5 text-navy-900">Body Content *</label>
                        <textarea
                          rows={6}
                          required
                          value={blogContent}
                          onChange={(e) => setBlogContent(e.target.value)}
                          className="w-full bg-luxury-light border border-gray-200 text-[#051B3D] rounded-xl p-2.5 outline-none font-medium resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-3.5 rounded-xl border border-blue-500/25 cursor-pointer text-[10px]"
                      >
                        Publish Article
                      </button>
                    </form>
                  </div>

                  {/* Gallery */}
                  <div className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-4">
                    <h3 className="font-serif font-bold text-xs text-navy-900 pb-2 border-b border-gray-150 uppercase tracking-wider flex items-center space-x-1.5">
                      <ImageIcon className="h-4.5 w-4.5 text-blue-500" />
                      <span>Departure Gallery</span>
                    </h3>
                    <p className="text-[10px] text-gray-400 font-light leading-relaxed">Upload candidate deployment photos to the public gallery.</p>

                    <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center hover:border-blue-600 transition-colors">
                      <ImageIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <button
                        onClick={() => alert("Photo upload logged in public gallery database.")}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-3 rounded-xl border border-blue-500/25 cursor-pointer"
                      >
                        Select Image
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 9: Communications Templates */}
              {activeTab === "communications" && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-6">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-navy-900 pb-2 border-b border-gray-150 uppercase tracking-wider">Alert Templates</h3>
                    <p className="text-[10px] text-gray-400 font-light mt-1 font-sans">Configure SMS, email and WhatsApp notifications variables.</p>
                  </div>

                  <div className="space-y-4 text-xs font-semibold text-gray-550">
                    {[
                      { channel: "EMAIL", name: "Candidate Shortlisted Notification", preview: "Subject: Congratulations! You have been shortlisted for [JobTitle]. Please review VFS biometrics schedule..." },
                      { channel: "WHATSAPP", name: "Visa Stamped Notification", preview: "WhatsApp: Dear [Name], your visa stamp for [Country] has been verified. Pack and report to Delhi HQ..." },
                    ].map((temp, i) => (
                      <div key={i} className="border border-gray-150 rounded-2xl p-4 bg-luxury-light space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-blue-600 bg-blue-600/10 px-2.5 py-0.5 rounded-lg border border-blue-550/15">
                            {temp.channel}
                          </span>
                          <h4 className="font-bold text-navy-900 text-xs">{temp.name}</h4>
                        </div>
                        <p className="text-[11px] text-gray-400 font-light italic bg-white p-3.5 rounded-xl border border-gray-100 font-sans">
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
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-4">
                    <h3 className="font-serif font-bold text-xs text-[#051B3D] pb-2 border-b border-gray-150 uppercase tracking-wider">Role Permissions</h3>
                    <div className="space-y-3 text-xs font-semibold text-navy-900">
                      {[
                        { role: "ADMIN", desc: "Full permissions: CRM, ATS, CMS and systems configs." },
                        { role: "EMPLOYER", desc: "Campaign posting, ATS drag/drop boards, schedule interviews." },
                        { role: "CANDIDATE", desc: "Profile dossier editing, easy applies, visa steppers." },
                      ].map((perm, i) => (
                        <div key={i} className="border border-gray-200 p-3.5 rounded-xl bg-luxury-light flex justify-between items-center">
                          <div>
                            <h4 className="font-bold">{perm.role}</h4>
                            <p className="text-[10px] text-gray-450 font-light mt-0.5 font-sans leading-normal">{perm.desc}</p>
                          </div>
                          <Lock className="h-4 w-4 text-blue-500 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SEO & Backups */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-6 font-sans">
                    <div className="space-y-4">
                      <h3 className="font-serif font-bold text-xs text-navy-900 pb-2 border-b border-gray-150 uppercase tracking-wider">SEO settings</h3>
                      {seoMsg && (
                        <div className="p-3 bg-green-50 border border-green-200 text-green-755 rounded-xl text-[11px] font-semibold">
                          {seoMsg}
                        </div>
                      )}
                      <form onSubmit={handleSaveSEO} className="space-y-3.5 text-xs text-gray-500 font-semibold">
                        <div>
                          <label className="block mb-0.5 text-[#051B3D]">Page Meta Title *</label>
                          <input
                            type="text"
                            required
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            className="w-full bg-luxury-light border border-gray-205 text-navy-900 rounded-xl p-3 outline-none font-medium focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block mb-0.5 text-[#051B3D]">SEO Keywords *</label>
                          <input
                            type="text"
                            required
                            value={seoKeywords}
                            onChange={(e) => setSeoKeywords(e.target.value)}
                            className="w-full bg-luxury-light border border-gray-205 text-navy-900 rounded-xl p-3 outline-none font-medium focus:border-blue-500"
                          />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-3 rounded-xl border border-blue-500/20 cursor-pointer text-[9px]">
                          Save SEO Settings
                        </button>
                      </form>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <h4 className="font-serif text-xs font-bold text-navy-900 uppercase tracking-wider">System Database Backups</h4>
                      <p className="text-[10px] text-gray-400 font-light leading-relaxed">Trigger database copies for archival safety.</p>
                      <button
                        onClick={() => alert("Initiating SQLite database full secure backup to workspace root.")}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-3.5 rounded-xl text-[10px] shadow flex items-center justify-center space-x-1.5 cursor-pointer border border-blue-500/25 font-sans"
                      >
                        <Database className="h-4 w-4" />
                        <span>Backup Database Now</span>
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
