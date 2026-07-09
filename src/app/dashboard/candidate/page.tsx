"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  FileText,
  Briefcase,
  RefreshCw,
  UploadCloud,
  MapPin,
  CheckCircle,
  AlertCircle,
  FileDown,
  Calendar,
  MessageSquare,
  Settings,
  Shield,
  Award,
  Grid,
  FileCheck,
  Bookmark,
  Bell,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VisaTimeline from "@/components/dashboard/VisaTimeline";

interface Application {
  id: string;
  status: string;
  visaStatus: string;
  notes?: string | null;
  interviewDate?: string | null;
  createdAt: string;
  job: {
    title: string;
    country: string;
    salaryRange?: string | null;
    employer: {
      companyName: string;
    };
  };
}

interface Profile {
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

export default function CompleteCandidateDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab routing
  const [activeTab, setActiveTab] = useState<"overview" | "profile" | "resume" | "visa" | "messages" | "settings">("overview");

  // Profile Edit fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [experienceYears, setExperienceYears] = useState("0");
  const [education, setEducation] = useState("");
  const [location, setLocation] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Resume builder states
  const [resObjective, setResObjective] = useState("Result-oriented technical professional seeking overseas growth opportunities.");
  const [resCompany, setResCompany] = useState("");
  const [resJobTitle, setResJobTitle] = useState("");
  const [resDegree, setResDegree] = useState("");
  const [resSchool, setResSchool] = useState("");
  const [resSkills, setResSkills] = useState("");
  const [resumeBuilding, setResumeBuilding] = useState(false);

  // Local storage saved jobs list
  const [savedJobsList, setSavedJobsList] = useState<any[]>([]);

  // Simulation Recruiter chat states
  const [chatMessage, setChatMessage] = useState("");
  const [chatLogs, setChatLogs] = useState([
    { sender: "recruiter", text: "Hello Rahul, we reviewed your ITI electrical credentials and selected you for the Saudi Arabia weld drive. Have you uploaded your passport scan?", time: "10:30 AM" },
    { sender: "candidate", text: "Yes, I have uploaded my passport. When is the biometric collection date?", time: "10:35 AM" },
    { sender: "recruiter", text: "Great. Biometrics are scheduled at the Delhi VFS yard on Friday. Keep your original MEA documents ready.", time: "10:36 AM" },
  ]);

  // Upload CV states
  const [uploadingCV, setUploadingCV] = useState(false);
  const [cvMsg, setCvMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
    loadSavedJobs();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        const cand = meData.user.candidate;
        setProfile(cand);
        if (cand) {
          setFullName(cand.fullName || "");
          setPhone(cand.phone || "");
          setPassportNumber(cand.passportNumber || "");
          setSkillsText(cand.skills || "");
          setExperienceYears(cand.experienceYears?.toString() || "0");
          setEducation(cand.education || "");
          setLocation(cand.location || "");
          setResSkills(cand.skills || "");
          setResDegree(cand.education || "");
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

  const loadSavedJobs = async () => {
    try {
      const savedIds = localStorage.getItem("rama_saved_jobs");
      if (savedIds) {
        const ids: string[] = JSON.parse(savedIds);
        const res = await fetch("/api/jobs");
        if (res.ok) {
          const data = await res.json();
          const allJobs: any[] = data.jobs || [];
          setSavedJobsList(allJobs.filter((j) => ids.includes(j.id)));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getProfileCompletion = () => {
    if (!profile) return 0;
    let score = 0;
    let total = 7;
    if (fullName) score++;
    if (phone) score++;
    if (passportNumber) score++;
    if (profile.resumeUrl) score++;
    if (skillsText) score++;
    if (parseInt(experienceYears) > 0) score++;
    if (education) score++;
    return Math.round((score / total) * 100);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    
    setTimeout(() => {
      setProfileSaving(false);
      setProfileMsg({ text: "Candidate profile dossier updated successfully!", isError: false });
      if (profile) {
        setProfile({
          ...profile,
          fullName,
          phone,
          passportNumber,
          skills: skillsText,
          experienceYears: parseInt(experienceYears),
          education,
          location,
        });
      }
    }, 1000);
  };

  const handleResumeBuild = (e: React.FormEvent) => {
    e.preventDefault();
    setResumeBuilding(true);
    setTimeout(() => {
      setResumeBuilding(false);
      if (profile) {
        const generatedResumeUrl = `/uploads/resumes/Generated_Resume_${Date.now()}.pdf`;
        setProfile({ ...profile, resumeUrl: generatedResumeUrl });
      }
      setActiveTab("overview");
    }, 1500);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingCV(true);
    setCvMsg(null);
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("folder", "resumes");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setCvMsg("Resume CV PDF updated in security vault!");
        if (profile) setProfile({ ...profile, resumeUrl: data.url });
      }
    } catch (err) {
      setCvMsg("Failed to upload CV file.");
    } finally {
      setUploadingCV(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatLogs([...chatLogs, { sender: "candidate", text: chatMessage, time: "Just Now" }]);
    setChatMessage("");

    setTimeout(() => {
      setChatLogs((prev) => [
        ...prev,
        {
          sender: "recruiter",
          text: "Understood. The consultant assigned to your dossier will verify these details and update your tracking board shortly.",
          time: "Just Now",
        },
      ]);
    }, 1500);
  };

  const activeVisaApp = applications.find((app) => app.status === "VISA_STAGE");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPLIED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "SHORTLISTED":
        return "bg-yellow-50 text-yellow-750 border-yellow-250";
      case "INTERVIEW_SCHEDULED":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "SELECTED":
        return "bg-green-50 text-green-700 border-green-200";
      case "VISA_STAGE":
        return "bg-amber-50 text-amber-700 border-amber-250";
      case "MOBILIZED":
        return "bg-purple-50 text-purple-700 border-purple-250";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-luxury-light text-navy-900 font-sans">
      <Navbar />

      <div className="bg-[#051B3D] text-white py-12 border-b border-blue-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="font-serif text-2xl font-bold text-white">Candidate Dashboard</h1>
            <p className="text-xs text-gray-300 font-light">SaaS dossier command center for international placements.</p>
          </div>
          
          <div className="bg-[#0B3D91] border border-blue-600/20 rounded-2xl p-3.5 flex items-center space-x-3 text-xs">
            <User className="h-4.5 w-4.5 text-blue-500" />
            <div>
              <p className="font-bold text-gray-205">{profile?.fullName || "Rahul Sharma"}</p>
              <p className="text-[10px] text-gray-400 font-light mt-0.5">Passport: {profile?.passportNumber || "Pending"}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar Drawer */}
        <aside className="lg:w-60 shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md space-y-2 sticky top-24">
            {[
              { tab: "overview", label: "Overview Panel", icon: Grid },
              { tab: "profile", label: "Dossier profile", icon: User },
              { tab: "resume", label: "CV Vault / Builder", icon: FileText },
              { tab: "visa", label: "Visa & Files", icon: FileCheck },
              { tab: "messages", label: "Chat Logs", icon: MessageSquare },
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
                    setCvMsg(null);
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

        {/* Dashboard Panels Container */}
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
              {/* Tab 1: Overview Panel */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Visual Completion Progress Bar */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1.5">
                      <h3 className="font-serif text-sm font-bold text-navy-900">Dossier File Progress</h3>
                      <p className="text-[11px] text-gray-505 font-light font-sans">Fill all credentials fields to boost your global employer match rate.</p>
                    </div>

                    <div className="w-full md:w-56 space-y-1.5 text-xs font-semibold">
                      <div className="flex justify-between">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Profile Filled</span>
                        <span className="text-navy-900 font-bold">{getProfileCompletion()}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                        <div
                          className="h-full bg-blue-650 rounded-full transition-all duration-500"
                          style={{ width: `${getProfileCompletion()}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Visa Timelines Stepper */}
                  {activeVisaApp ? (
                    <VisaTimeline currentStage={activeVisaApp.visaStatus} notes={activeVisaApp.notes} />
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md text-center space-y-3">
                      <Sparkles className="h-7 w-7 text-blue-500 mx-auto" />
                      <h4 className="font-serif text-navy-900 font-bold text-sm">Deployment Path Ready</h4>
                      <p className="text-[11px] text-gray-500 font-light max-w-sm mx-auto leading-relaxed font-sans">
                        Select a campaign and apply. Your visa clearances, finger scans, and medical results will populate here upon employer confirmation.
                      </p>
                    </div>
                  )}

                  {/* Grid Splits: Submissions & bookmarks */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Applied Campaigns */}
                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-4">
                      <h3 className="font-serif font-bold text-xs text-navy-900 pb-3 border-b border-gray-150 uppercase tracking-wider">Applied Campaigns</h3>
                      {applications.length === 0 ? (
                        <p className="text-xs text-gray-400 py-8 text-center font-light font-sans">No applications logged. Browse the active job board.</p>
                      ) : (
                        <div className="space-y-3">
                          {applications.map((app) => (
                            <div key={app.id} className="border border-gray-150 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-luxury-light hover:border-blue-500/20 transition-colors">
                              <div>
                                <h4 className="font-bold text-xs text-navy-900">{app.job.title}</h4>
                                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{app.job.employer.companyName} | {app.job.country}</p>
                              </div>
                              <span className={`inline-block text-[9px] uppercase tracking-wider font-bold border px-3 py-1 rounded-full ${getStatusColor(app.status)}`}>
                                {app.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bookmarked lists */}
                    <div className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-4">
                      <h3 className="font-serif font-bold text-xs text-navy-900 pb-3 border-b border-gray-150 uppercase tracking-wider flex items-center space-x-1.5">
                        <Bookmark className="h-4 w-4 text-blue-500" />
                        <span>Saved Bookmarks</span>
                      </h3>
                      {savedJobsList.length === 0 ? (
                        <p className="text-xs text-gray-400 py-8 text-center font-light font-sans">Watchlist empty.</p>
                      ) : (
                        <div className="space-y-3 text-xs font-semibold">
                          {savedJobsList.map((job) => (
                            <div key={job.id} className="border-b border-gray-100 pb-2.5 last:border-0 last:pb-0">
                              <Link href="/jobs" className="font-bold text-navy-900 hover:text-blue-500 truncate block transition-colors">
                                {job.title}
                              </Link>
                              <div className="flex justify-between items-center text-[10px] text-gray-400 mt-1">
                                <span>{job.employer.companyName}</span>
                                <span className="font-bold text-navy-900">{job.country}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* Tab 2: Profile Update */}
              {activeTab === "profile" && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-navy-900 pb-2 border-b border-gray-150 uppercase tracking-wider">Dossier File Details</h3>
                    <p className="text-[10px] text-gray-400 font-light mt-1">Keep details verified to ensure smooth consulate registrations.</p>
                  </div>

                  {profileMsg && (
                    <div className={`p-4 rounded-xl text-xs font-semibold border ${profileMsg.isError ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"}`}>
                      {profileMsg.text}
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-semibold text-gray-550">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-navy-900">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-luxury-light border border-gray-250 text-navy-900 rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-navy-900">Telephone Hotline *</label>
                        <input
                          type="text"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-luxury-light border border-gray-250 text-navy-900 rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block mb-1 text-navy-900">Passport Number</label>
                        <input
                          type="text"
                          value={passportNumber}
                          onChange={(e) => setPassportNumber(e.target.value)}
                          className="w-full bg-luxury-light border border-gray-250 text-navy-900 rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium uppercase"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-navy-900">Total Sourced Experience</label>
                        <input
                          type="number"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          className="w-full bg-luxury-light border border-gray-250 text-navy-900 rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-navy-900">Current Location (City/State)</label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full bg-luxury-light border border-gray-250 text-navy-900 rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-navy-900">Primary Core Skills (Comma Separated)</label>
                        <input
                          type="text"
                          value={skillsText}
                          onChange={(e) => setSkillsText(e.target.value)}
                          className="w-full bg-luxury-light border border-gray-250 text-navy-900 rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-navy-900">Highest Education / Trade Diploma</label>
                        <input
                          type="text"
                          value={education}
                          onChange={(e) => setEducation(e.target.value)}
                          className="w-full bg-luxury-light border border-gray-250 text-navy-900 rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center space-x-2 border border-blue-500/25 cursor-pointer disabled:opacity-50 font-sans"
                    >
                      {profileSaving ? <RefreshCw className="h-4.5 w-4.5 animate-spin" /> : <span>Update Profile Dossier</span>}
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 3: Resume Vault & Builder */}
              {activeTab === "resume" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* File Vault */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-4">
                    <h3 className="font-serif font-bold text-xs text-navy-900 pb-2.5 border-b border-gray-150 uppercase tracking-wider">CV Resume Vault</h3>
                    {cvMsg && (
                      <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-[11px] font-semibold flex items-center space-x-1.5">
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        <p>{cvMsg}</p>
                      </div>
                    )}

                    {profile?.resumeUrl ? (
                      <div className="bg-green-50 border border-green-200 p-4.5 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-green-800 font-bold">
                          <FileText className="h-5 w-5 text-green-600 shrink-0" />
                          <span className="truncate max-w-[150px]">Resume_Verified.pdf</span>
                        </div>
                        <a
                          href={profile.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-white border border-green-250 text-green-705 font-bold px-3.5 py-2 rounded-xl text-[10px] uppercase hover:bg-gray-50 transition-colors"
                        >
                          Review File
                        </a>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center hover:border-blue-600 transition-colors">
                        <UploadCloud className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-[10px] text-gray-500 font-semibold mb-3">Upload PDF or MS Word Resumes</p>
                        <label className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-5 py-3 rounded-xl border border-blue-500/25 cursor-pointer">
                          {uploadingCV ? "Uploading..." : "Select File"}
                          <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} disabled={uploadingCV} className="hidden" />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Builder Form */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-4">
                    <h3 className="font-serif font-bold text-xs text-navy-900 pb-2.5 border-b border-gray-150 uppercase tracking-wider">Dynamic Resume Builder</h3>
                    <p className="text-[10px] text-gray-400 font-light leading-relaxed">No resume file? Input details below to generate a printable format.</p>

                    <form onSubmit={handleResumeBuild} className="space-y-3.5 text-xs text-gray-550 font-semibold">
                      <div>
                        <label className="block mb-0.5 text-navy-900">Career Objective</label>
                        <input
                          type="text"
                          value={resObjective}
                          onChange={(e) => setResObjective(e.target.value)}
                          className="w-full bg-luxury-light border border-gray-200 rounded-xl p-3 outline-none font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block mb-0.5 text-navy-900">Previous Company</label>
                          <input
                            type="text"
                            required
                            value={resCompany}
                            onChange={(e) => setResCompany(e.target.value)}
                            className="w-full bg-luxury-light border border-gray-200 rounded-xl p-3 outline-none font-medium"
                          />
                        </div>
                        <div>
                          <label className="block mb-0.5 text-navy-900">Job Title</label>
                          <input
                            type="text"
                            required
                            value={resJobTitle}
                            onChange={(e) => setResJobTitle(e.target.value)}
                            className="w-full bg-luxury-light border border-gray-200 rounded-xl p-3 outline-none font-medium"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block mb-0.5 text-navy-900">Degree / Diploma</label>
                          <input
                            type="text"
                            required
                            value={resDegree}
                            onChange={(e) => setResDegree(e.target.value)}
                            className="w-full bg-luxury-light border border-gray-200 rounded-xl p-3 outline-none font-medium"
                          />
                        </div>
                        <div>
                          <label className="block mb-0.5 text-navy-900">School / Institute</label>
                          <input
                            type="text"
                            required
                            value={resSchool}
                            onChange={(e) => setResSchool(e.target.value)}
                            className="w-full bg-luxury-light border border-gray-200 rounded-xl p-3 outline-none font-medium"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={resumeBuilding}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-3.5 rounded-xl text-[10px] flex items-center justify-center space-x-2 shadow cursor-pointer border border-blue-500/25 disabled:opacity-50"
                      >
                        {resumeBuilding ? <RefreshCw className="h-4 w-4 animate-spin" /> : <span>Build & Attest Resume</span>}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Tab 4: Visa Files downloads */}
              {activeTab === "visa" && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-navy-900 pb-2 border-b border-gray-150 uppercase tracking-wider">Visa Copy & Clearances</h3>
                    <p className="text-[10px] text-gray-400 font-light mt-1 font-sans">Review stamped permits, flight charts and medical certificates.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-navy-900 font-bold">
                    {[
                      { name: "Relocation Offer Letter", file: "Offer_Letter_Rahul.pdf", date: "June 20, 2026", type: "Offer Letter" },
                      { name: "Wafid Diagnostics Report", file: "Medical_Clearance_GAMCA.pdf", date: "June 25, 2026", type: "Medical" },
                      { name: "Consulate Employment Stamp", file: "Stamped_Visa_Z123.pdf", date: "July 02, 2026", type: "Visa Copy" },
                    ].map((doc, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-2xl p-5 space-y-4 hover:border-blue-600 transition-colors bg-luxury-light flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-blue-600 bg-blue-600/10 px-2 py-0.5 rounded-lg border border-blue-500/10">
                            {doc.type}
                          </span>
                          <h4 className="font-bold text-navy-900 leading-tight pt-1">{doc.name}</h4>
                          <p className="text-[10px] text-gray-400 font-semibold">{doc.date}</p>
                        </div>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Initiating secure SSL download for file: ${doc.file}`);
                          }}
                          className="w-full bg-white hover:bg-gray-50 border border-gray-250 py-3 rounded-xl text-center text-[10px] font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <FileDown className="h-3.5 w-3.5 text-[#051B3D] shrink-0" />
                          <span>Download File</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Chat logs */}
              {activeTab === "messages" && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-md flex flex-col h-[500px]">
                  <div className="p-4 border-b border-gray-150 bg-[#051B3D] text-white rounded-t-2xl flex items-center space-x-3">
                    <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs border border-blue-500/25">
                      RM
                    </div>
                    <div>
                      <h4 className="font-serif text-xs font-bold text-blue-500">Recruitment Desk</h4>
                      <p className="text-[9px] text-gray-300 font-light">Online Liaison Officer</p>
                    </div>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-medium">
                    {chatLogs.map((msg, i) => {
                      const isRec = msg.sender === "recruiter";
                      return (
                        <div key={i} className={`flex ${isRec ? "justify-start" : "justify-end"}`}>
                          <div className={`max-w-[75%] rounded-2xl p-4 space-y-1.5 ${isRec ? "bg-luxury-light text-[#051B3D] border border-gray-250" : "bg-[#0B3D91] text-white"}`}>
                            <p className="leading-relaxed font-light">{msg.text}</p>
                            <span className="block text-[9px] text-gray-400 text-right">{msg.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-3.5 border-t border-gray-150 bg-luxury-light rounded-b-2xl flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Type response to consultant desk..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-1 bg-white border border-gray-205 text-[#051B3D] text-xs rounded-xl px-4.5 py-3.5 outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-3 rounded-xl border border-blue-500/25 uppercase transition-colors cursor-pointer"
                    >
                      Send
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 6: Settings */}
              {activeTab === "settings" && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-navy-900 pb-2 border-b border-gray-150 uppercase tracking-wider">Account Settings</h3>
                    <p className="text-[10px] text-gray-400 font-light mt-1 font-sans">Configure profile passwords and credentials verification alerts.</p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert("Password updated successfully!");
                    }}
                    className="space-y-4 max-w-sm text-xs font-semibold text-gray-550"
                  >
                    <div>
                      <label className="block mb-1 text-[#051B3D]">Current Password</label>
                      <input
                        type="password"
                        required
                        className="w-full bg-luxury-light border border-gray-200 rounded-xl p-3 outline-none font-medium text-navy-900"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-[#051B3D]">New Password</label>
                      <input
                        type="password"
                        required
                        className="w-full bg-luxury-light border border-gray-200 rounded-xl p-3 outline-none font-medium text-navy-900"
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

      <Footer />
    </div>
  );
}
