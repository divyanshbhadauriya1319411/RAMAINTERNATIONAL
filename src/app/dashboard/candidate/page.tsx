"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VisaTimeline from "@/components/dashboard/VisaTimeline";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Settings,
  Grid,
  FileText,
  MessageSquare,
  Sparkles,
  Bookmark,
  CheckCircle,
  UploadCloud,
  FileDown,
  RefreshCw,
  FileCheck,
} from "lucide-react";

interface Application {
  id: string;
  status: string;
  visaStatus: string;
  notes?: string | null;
  createdAt: string;
  job: {
    id: string;
    title: string;
    country: string;
    employer: {
      companyName: string;
    };
  };
}

interface SavedJob {
  id: string;
  title: string;
  country: string;
  employer: {
    companyName: string;
  };
}

interface Profile {
  fullName: string;
  phone: string | null;
  passportNumber: string | null;
  experienceYears: number | null;
  skills: string | null;
  education: string | null;
  location: string | null;
  resumeUrl: string | null;
}

export default function CandidateDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "profile" | "resume" | "visa" | "messages" | "settings">("overview");
  
  // Data States
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobsList, setSavedJobsList] = useState<SavedJob[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Form States
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [location, setLocation] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [education, setEducation] = useState("");

  // Resume Builder States
  const [resObjective, setResObjective] = useState("");
  const [resCompany, setResCompany] = useState("");
  const [resJobTitle, setResJobTitle] = useState("");
  const [resDegree, setResDegree] = useState("");
  const [resSchool, setResSchool] = useState("");

  // UI Action states
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ text: string; isError: boolean } | null>(null);
  
  const [uploadingCV, setUploadingCV] = useState(false);
  const [cvMsg, setCvMsg] = useState<string | null>(null);
  const [resumeBuilding, setResumeBuilding] = useState(false);

  // Simulation chat logs
  const [chatMessage, setChatMessage] = useState("");
  const [chatLogs, setChatLogs] = useState<any[]>([]);

  const t = useTranslations("candidateDashboard");

  useEffect(() => {
    fetchDashboardData();
    setChatLogs([
      {
        sender: "recruiter",
        text: t("chatMsg1"),
        time: "10:00 AM",
      },
      {
        sender: "candidate",
        text: t("chatMsg2"),
        time: "10:05 AM",
      },
      {
        sender: "recruiter",
        text: t("chatMsg3"),
        time: "10:10 AM",
      },
    ]);
  }, [t]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard/candidate");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setApplications(data.applications || []);
        setSavedJobsList(data.savedJobs || []);
        
        if (data.profile) {
          setProfile(data.profile);
          setFullName(data.profile.fullName || "");
          setPhone(data.profile.phone || "");
          setPassportNumber(data.profile.passportNumber || "");
          setExperienceYears(data.profile.experienceYears?.toString() || "");
          setLocation(data.profile.location || "");
          setSkillsText(data.profile.skills || "");
          setEducation(data.profile.education || "");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getProfileCompletion = () => {
    if (!profile) return 0;
    let filled = 0;
    const fields = [
      profile.fullName,
      profile.phone,
      profile.passportNumber,
      profile.experienceYears,
      profile.location,
      profile.skills,
      profile.education,
      profile.resumeUrl,
    ];
    fields.forEach((f) => {
      if (f !== null && f !== undefined && f !== "") filled++;
    });
    return Math.round((filled / fields.length) * 100);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);

    try {
      const res = await fetch("/api/dashboard/candidate/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          passportNumber,
          experienceYears: experienceYears ? parseInt(experienceYears) : null,
          location,
          skills: skillsText,
          education,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setProfileMsg({ text: "Profile details updated successfully!", isError: false });
      } else {
        setProfileMsg({ text: "Failed to update profile.", isError: true });
      }
    } catch (err) {
      setProfileMsg({ text: "A network error occurred.", isError: true });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleResumeBuild = async (e: React.FormEvent) => {
    e.preventDefault();
    setResumeBuilding(true);
    setCvMsg(null);

    try {
      // Simulate build processing
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const skillsConcat = skillsText ? `${skillsText}, ${resJobTitle}` : resJobTitle;
      const eduConcat = education ? `${education} | ${resDegree}` : `${resDegree} at ${resSchool}`;

      const res = await fetch("/api/dashboard/candidate/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          passportNumber,
          experienceYears: experienceYears ? parseInt(experienceYears) : null,
          location,
          skills: skillsConcat,
          education: eduConcat,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setSkillsText(skillsConcat);
        setEducation(eduConcat);
        setCvMsg("Resume built and attested inside Profile dossier!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResumeBuilding(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingCV(true);
    setCvMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/dashboard/candidate/resume", {
        method: "POST",
        body: formData,
      });

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
          text: t("chatReply"),
          time: "Just Now",
        },
      ]);
    }, 1500);
  };

  const activeVisaApp = applications.find((app) => app.status === "VISA_STAGE");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPLIED":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800";
      case "SHORTLISTED":
        return "bg-yellow-50 text-yellow-750 border-yellow-250 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-800";
      case "INTERVIEW_SCHEDULED":
        return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-800";
      case "SELECTED":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800";
      case "VISA_STAGE":
        return "bg-amber-50 text-amber-700 border-amber-250 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800";
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
        <span>Loading dossier console...</span>
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
            <p className="text-xs text-gray-305 font-light">{t("desc")}</p>
          </div>
          
          <div className="bg-[#0B3D91] border border-blue-600/20 rounded-2xl p-3.5 flex items-center space-x-3 text-xs">
            <User className="h-4.5 w-4.5 text-blue-500" />
            <div>
              <p className="font-bold text-gray-200">{profile?.fullName || "Rahul Sharma"}</p>
              <p className="text-[10px] text-gray-400 font-light mt-0.5">{t("fieldPassport")}: {profile?.passportNumber || "Pending"}</p>
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
              { tab: "profile", label: t("tabProfile"), icon: User },
              { tab: "resume", label: t("tabResume"), icon: FileText },
              { tab: "visa", label: t("tabVisa"), icon: FileCheck },
              { tab: "messages", label: t("tabMessages"), icon: MessageSquare },
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
                    setCvMsg(null);
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
                  <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1.5">
                      <h3 className="font-headline text-sm font-bold text-navy-900 dark:text-white">{t("progressTitle")}</h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-light font-sans">{t("progressDesc")}</p>
                    </div>

                    <div className="w-full md:w-56 space-y-1.5 text-xs font-semibold">
                      <div className="flex justify-between">
                        <span className="text-[10px] text-gray-400 dark:text-gray-400 uppercase tracking-widest font-bold">{t("profileFilled")}</span>
                        <span className="text-navy-900 dark:text-white font-bold">{getProfileCompletion()}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-navy-950 rounded-full overflow-hidden border border-gray-200 dark:border-white/5">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${getProfileCompletion()}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Visa Timelines Stepper */}
                  {activeVisaApp ? (
                    <VisaTimeline currentStage={activeVisaApp.visaStatus} notes={activeVisaApp.notes} />
                  ) : (
                    <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md text-center space-y-3">
                      <Sparkles className="h-7 w-7 text-blue-500 mx-auto" />
                      <h4 className="font-headline text-navy-900 dark:text-white font-bold text-sm">{t("pathReady")}</h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-light max-w-sm mx-auto leading-relaxed font-sans">
                        {t("pathReadyDesc")}
                      </p>
                    </div>
                  )}

                  {/* Grid Splits: Submissions & bookmarks */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Applied Campaigns */}
                    <div className="lg:col-span-2 bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md space-y-4">
                      <h3 className="font-headline font-bold text-xs text-navy-900 dark:text-white pb-3 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider">{t("appliedCampaigns")}</h3>
                      {applications.length === 0 ? (
                        <p className="text-xs text-gray-400 py-8 text-center font-light font-sans">{t("noApplications")}</p>
                      ) : (
                        <div className="space-y-3">
                          {applications.map((app) => (
                            <div key={app.id} className="border border-gray-150 dark:border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-luxury-light dark:bg-navy-950/30 hover:border-blue-500/20 transition-colors text-navy-900 dark:text-white">
                              <div>
                                <h4 className="font-bold text-xs text-navy-900 dark:text-white">{app.job.title}</h4>
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
                    <div className="lg:col-span-1 bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md space-y-4">
                      <h3 className="font-headline font-bold text-xs text-navy-900 dark:text-white pb-3 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider flex items-center space-x-1.5">
                        <Bookmark className="h-4 w-4 text-blue-500" />
                        <span>{t("savedBookmarks")}</span>
                      </h3>
                      {savedJobsList.length === 0 ? (
                        <p className="text-xs text-gray-400 py-8 text-center font-light font-sans">{t("watchlistEmpty")}</p>
                      ) : (
                        <div className="space-y-3 text-xs font-semibold">
                          {savedJobsList.map((job) => (
                            <div key={job.id} className="border-b border-gray-100 dark:border-white/5 pb-2.5 last:border-0 last:pb-0">
                              <Link href="/jobs" className="font-bold text-navy-900 dark:text-white hover:text-blue-500 truncate block transition-colors">
                                {job.title}
                              </Link>
                              <div className="flex justify-between items-center text-[10px] text-gray-400 mt-1">
                                <span>{job.employer.companyName}</span>
                                <span className="font-bold text-navy-900 dark:text-white">{job.country}</span>
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
                <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
                  <div>
                    <h3 className="font-headline text-sm font-bold text-navy-900 dark:text-white pb-2 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider">{t("fileDetails")}</h3>
                    <p className="text-[10px] text-gray-400 font-light mt-1">{t("fileDetailsDesc")}</p>
                  </div>

                  {profileMsg && (
                    <div className={`p-4 rounded-xl text-xs font-semibold border ${profileMsg.isError ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-700" : "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-700"}`}>
                      {profileMsg.text}
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-semibold text-gray-550 dark:text-gray-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-navy-900 dark:text-gray-300">{t("fieldFullName")} *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-250 dark:border-white/10 text-navy-900 dark:text-white rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium font-sans"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-navy-900 dark:text-gray-300">{t("fieldPhone")} *</label>
                        <input
                          type="text"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-250 dark:border-white/10 text-navy-900 dark:text-white rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium font-sans"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block mb-1 text-navy-900 dark:text-gray-300">{t("fieldPassport")}</label>
                        <input
                          type="text"
                          value={passportNumber}
                          onChange={(e) => setPassportNumber(e.target.value)}
                          className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-250 dark:border-white/10 text-navy-900 dark:text-white rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium uppercase font-sans"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-navy-900 dark:text-gray-300">{t("fieldExperience")}</label>
                        <input
                          type="number"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-250 dark:border-white/10 text-navy-900 dark:text-white rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium font-sans"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-navy-900 dark:text-gray-300">{t("fieldLocation")}</label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-250 dark:border-white/10 text-navy-900 dark:text-white rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium font-sans"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-navy-900 dark:text-gray-300">{t("fieldSkills")}</label>
                        <input
                          type="text"
                          value={skillsText}
                          onChange={(e) => setSkillsText(e.target.value)}
                          className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-250 dark:border-white/10 text-navy-900 dark:text-white rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium font-sans"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-navy-900 dark:text-gray-300">{t("fieldEducation")}</label>
                        <input
                          type="text"
                          value={education}
                          onChange={(e) => setEducation(e.target.value)}
                          className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-250 dark:border-white/10 text-navy-900 dark:text-white rounded-xl p-3.5 outline-none focus:border-blue-500 font-medium font-sans"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center space-x-2 border border-blue-500/25 cursor-pointer disabled:opacity-50 font-headline"
                    >
                      {profileSaving ? <RefreshCw className="h-4.5 w-4.5 animate-spin" /> : <span>{t("btnSaveProfile")}</span>}
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 3: Resume Vault & Builder */}
              {activeTab === "resume" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* File Vault */}
                  <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md space-y-4">
                    <h3 className="font-headline font-bold text-xs text-navy-900 dark:text-white pb-2.5 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider">{t("cvVault")}</h3>
                    {cvMsg && (
                      <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-[11px] font-semibold flex items-center space-x-1.5">
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        <p>{cvMsg}</p>
                      </div>
                    )}

                    {profile?.resumeUrl ? (
                      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4.5 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-green-800 dark:text-green-400 font-bold">
                          <FileText className="h-5 w-5 text-green-600 shrink-0" />
                          <span className="truncate max-w-[150px]">{t("resumeVerified")}</span>
                        </div>
                        <a
                          href={profile.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-white dark:bg-navy-950 border border-green-250 dark:border-white/10 text-green-700 dark:text-green-400 font-bold px-3.5 py-2 rounded-xl text-[10px] uppercase hover:bg-gray-50 dark:hover:bg-navy-900 transition-colors"
                        >
                          {t("reviewFile")}
                        </a>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-200 dark:border-white/5 rounded-3xl p-10 text-center hover:border-blue-600 transition-colors">
                        <UploadCloud className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-[10px] text-gray-505 dark:text-gray-400 font-semibold mb-3">{t("uploadHeader")}</p>
                        <label className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-5 py-3 rounded-xl border border-blue-500/25 cursor-pointer inline-block">
                          {uploadingCV ? "Uploading..." : t("selectFile")}
                          <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} disabled={uploadingCV} className="hidden" />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Builder Form */}
                  <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-md space-y-4">
                    <h3 className="font-headline font-bold text-xs text-navy-900 dark:text-white pb-2.5 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider">{t("cvBuilder")}</h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-400 font-light leading-relaxed">{t("cvBuilderDesc")}</p>

                    <form onSubmit={handleResumeBuild} className="space-y-3.5 text-xs text-gray-550 dark:text-gray-300 font-semibold">
                      <div>
                        <label className="block mb-0.5 text-navy-900 dark:text-gray-300">{t("cvObjective")}</label>
                        <input
                          type="text"
                          value={resObjective}
                          onChange={(e) => setResObjective(e.target.value)}
                          className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white rounded-xl p-3 outline-none font-medium font-sans"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block mb-0.5 text-navy-900 dark:text-gray-300">{t("cvCompanyName")}</label>
                          <input
                            type="text"
                            required
                            value={resCompany}
                            onChange={(e) => setResCompany(e.target.value)}
                            className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white rounded-xl p-3 outline-none font-medium font-sans"
                          />
                        </div>
                        <div>
                          <label className="block mb-0.5 text-navy-900 dark:text-gray-300">{t("cvTargetTitle")}</label>
                          <input
                            type="text"
                            required
                            value={resJobTitle}
                            onChange={(e) => setResJobTitle(e.target.value)}
                            className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white rounded-xl p-3 outline-none font-medium font-sans"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block mb-0.5 text-navy-900 dark:text-gray-300">{t("cvCredentials")}</label>
                          <input
                            type="text"
                            required
                            value={resDegree}
                            onChange={(e) => setResDegree(e.target.value)}
                            className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white rounded-xl p-3 outline-none font-medium font-sans"
                          />
                        </div>
                        <div>
                          <label className="block mb-0.5 text-navy-900 dark:text-gray-300">{t("cvAcademicInstitution")}</label>
                          <input
                            type="text"
                            required
                            value={resSchool}
                            onChange={(e) => setResSchool(e.target.value)}
                            className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white rounded-xl p-3 outline-none font-medium font-sans"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={resumeBuilding}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-3.5 rounded-xl text-[10px] flex items-center justify-center space-x-2 shadow cursor-pointer border border-blue-500/25 disabled:opacity-50 font-headline"
                      >
                        {resumeBuilding ? <RefreshCw className="h-4 w-4 animate-spin" /> : <span>{t("cvBuildBtn")}</span>}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Tab 4: Visa Files downloads */}
              {activeTab === "visa" && (
                <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
                  <div>
                    <h3 className="font-headline text-sm font-bold text-navy-900 dark:text-white pb-2 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider">{t("visaCopyClearances")}</h3>
                    <p className="text-[10px] text-gray-400 font-light mt-1 font-sans">{t("visaClearancesDesc")}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-navy-900 dark:text-white font-bold">
                    {[
                      { name: t("docOfferLetterName"), file: "Offer_Letter_Rahul.pdf", date: "June 20, 2026", type: t("docOfferLetter") },
                      { name: t("docMedicalName"), file: "Medical_Clearance_GAMCA.pdf", date: "June 25, 2026", type: t("docMedical") },
                      { name: t("docVisaCopyName"), file: "Stamped_Visa_Z123.pdf", date: "July 02, 2026", type: t("docVisaCopy") },
                    ].map((doc, idx) => (
                      <div key={idx} className="border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-4 hover:border-blue-600 transition-colors bg-luxury-light dark:bg-navy-950/30 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 bg-blue-600/10 px-2 py-0.5 rounded-lg border border-blue-500/10">
                            {doc.type}
                          </span>
                          <h4 className="font-bold text-navy-900 dark:text-white leading-tight pt-1 font-headline">{doc.name}</h4>
                          <p className="text-[10px] text-gray-400 font-semibold">{doc.date}</p>
                        </div>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (idx === 0) alert(t("alertDlOffer"));
                            else if (idx === 1) alert(t("alertDlMedical"));
                            else alert(t("alertDlVisa"));
                          }}
                          className="w-full bg-white dark:bg-navy-900 hover:bg-gray-50 dark:hover:bg-navy-850 border border-gray-250 dark:border-white/10 py-3 rounded-xl text-center text-[10px] font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-sm transition-colors cursor-pointer text-navy-900 dark:text-white font-headline"
                        >
                          <FileDown className="h-3.5 w-3.5 text-[#051B3D] dark:text-white shrink-0" />
                          <span>{t("downloadFile")}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Chat logs */}
              {activeTab === "messages" && (
                <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl shadow-md flex flex-col h-[500px]">
                  <div className="p-4 border-b border-gray-150 dark:border-white/5 bg-[#051B3D] text-white rounded-t-2xl flex items-center space-x-3">
                    <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs border border-blue-500/25">
                      RM
                    </div>
                    <div>
                      <h4 className="font-headline text-xs font-bold text-blue-500">{t("recruitmentDesk")}</h4>
                      <p className="text-[9px] text-gray-300 font-light">{t("onlineLiaison")}</p>
                    </div>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-medium text-navy-900 dark:text-white">
                    {chatLogs.map((msg, i) => {
                      const isRec = msg.sender === "recruiter";
                      return (
                        <div key={i} className={`flex ${isRec ? "justify-start" : "justify-end"}`}>
                          <div className={`max-w-[75%] rounded-2xl p-4 space-y-1.5 ${isRec ? "bg-luxury-light dark:bg-navy-950/60 text-[#051B3D] dark:text-white border border-gray-250 dark:border-white/5" : "bg-[#0B3D91] text-white"}`}>
                            <p className="leading-relaxed font-light font-sans">{msg.text}</p>
                            <span className="block text-[9px] text-gray-400 text-right">{msg.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-3.5 border-t border-gray-150 dark:border-white/5 bg-luxury-light dark:bg-navy-950/20 rounded-b-2xl flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder={t("chatPlaceholder")}
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-1 bg-white dark:bg-navy-900 border border-gray-205 dark:border-white/10 text-[#051B3D] dark:text-white text-xs rounded-xl px-4.5 py-3.5 outline-none focus:border-blue-500 font-sans"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-3 rounded-xl border border-blue-500/25 uppercase transition-colors cursor-pointer font-headline"
                    >
                      {t("chatSend")}
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 6: Settings */}
              {activeTab === "settings" && (
                <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
                  <div>
                    <h3 className="font-headline text-sm font-bold text-navy-900 dark:text-white pb-2 border-b border-gray-150 dark:border-white/5 uppercase tracking-wider">{t("accountSettings")}</h3>
                    <p className="text-[10px] text-gray-400 font-light mt-1 font-sans">{t("accountSettingsDesc")}</p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert("Password updated successfully!");
                    }}
                    className="space-y-4 max-w-sm text-xs font-semibold text-gray-550 dark:text-gray-300"
                  >
                    <div>
                      <label className="block mb-1 text-[#051B3D] dark:text-gray-300">{t("currentPassword")}</label>
                      <input
                        type="password"
                        required
                        className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none font-medium text-navy-900 dark:text-white font-sans"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-[#051B3D] dark:text-gray-300">{t("newPassword")}</label>
                      <input
                        type="password"
                        required
                        className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none font-medium text-navy-900 dark:text-white font-sans"
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

      <Footer />
    </div>
  );
}
