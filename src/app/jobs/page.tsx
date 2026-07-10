"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Bookmark,
  Share2,
  Bell,
  Layers,
  BookmarkCheck,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  benefits?: string | null;
  sector: string;
  country: string;
  salaryRange?: string | null;
  vacancies: number;
  employerId: string;
  employer: {
    companyName: string;
    isVerified: boolean;
  };
}

export default function CompleteJobPortal() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("jobsPage");

  // Advanced Search & Filter states
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedSalary, setSelectedSalary] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  // Metadata categories
  const [countries, setCountries] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  // Selection & action states
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // Bookmark/Save job states (Persisted in localStorage)
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Job Alerts states
  const [alertEmail, setAlertEmail] = useState("");
  const [alertSector, setAlertSector] = useState("");
  const [alertSuccess, setAlertSuccess] = useState(false);

  useEffect(() => {
    fetchMetadata();
    fetchJobs();
    checkUser();
    // Load saved jobs from localStorage
    const saved = localStorage.getItem("rama_saved_jobs");
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  }, []);

  const checkUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUserRole(data.user.role);
      }
    } catch (e) {}
  };

  const fetchMetadata = async () => {
    try {
      const res = await fetch("/api/jobs?meta=true");
      if (res.ok) {
        const data = await res.json();
        setSectors(data.sectors || []);
        setCountries(data.countries || []);
        // Seed some common skills for filtering
        setSkills(["Electrician", "Welding", "Nursing", "HVAC", "Scaffolding", "Inspection", "Safety"]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
        setFilteredJobs(data.jobs || []);
        // Auto-select the first job for a premium look
        if (data.jobs && data.jobs.length > 0) {
          setSelectedJob(data.jobs[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Client-side advanced filter pipeline
  useEffect(() => {
    let result = jobs;

    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.requirements.toLowerCase().includes(query)
      );
    }

    if (selectedCountry) {
      result = result.filter((job) => job.country === selectedCountry);
    }

    if (selectedSector) {
      result = result.filter((job) => job.sector === selectedSector);
    }

    // Filter by salary range
    if (selectedSalary) {
      result = result.filter((job) => {
        const range = job.salaryRange || "";
        if (selectedSalary === "low") return range.includes("SR") || range.includes("AED");
        if (selectedSalary === "high") return range.includes("€") || range.includes("USD") || range.includes("QAR");
        return true;
      });
    }

    // Filter by experience requirement
    if (selectedExperience) {
      result = result.filter((job) => {
        const req = job.requirements.toLowerCase();
        if (selectedExperience === "junior") return req.includes("1 year") || req.includes("2 years") || req.includes("minimum 2");
        if (selectedExperience === "senior") return req.includes("4 years") || req.includes("6+ years") || req.includes("senior");
        return true;
      });
    }

    // Filter by job type
    if (selectedJobType) {
      result = result.filter((job) => {
        if (selectedJobType === "permanent") return job.sector !== "Logistics";
        if (selectedJobType === "contract") return job.sector === "Oil & Gas" || job.sector === "Logistics";
        return true;
      });
    }

    // Filter by skill requirement match
    if (selectedSkill) {
      result = result.filter((job) =>
        job.requirements.toLowerCase().includes(selectedSkill.toLowerCase()) ||
        job.description.toLowerCase().includes(selectedSkill.toLowerCase())
      );
    }

    setFilteredJobs(result);
  }, [search, selectedCountry, selectedSector, selectedSalary, selectedExperience, selectedJobType, selectedSkill, jobs]);

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCountry("");
    setSelectedSector("");
    setSelectedSalary("");
    setSelectedExperience("");
    setSelectedJobType("");
    setSelectedSkill("");
  };

  const handleApply = async (jobId: string) => {
    if (!userRole) {
      setApplyMessage({ text: "Please log in as a candidate to apply.", isError: true });
      return;
    }
    if (userRole !== "CANDIDATE") {
      setApplyMessage({ text: "Only Candidate accounts can apply for jobs.", isError: true });
      return;
    }

    setApplying(true);
    setApplyMessage(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();

      if (res.ok) {
        setApplyMessage({ text: "Application submitted successfully! Track progress on your candidate dashboard.", isError: false });
      } else {
        setApplyMessage({ text: data.error || "Failed to apply.", isError: true });
      }
    } catch (e) {
      setApplyMessage({ text: "Network error occurred.", isError: true });
    } finally {
      setApplying(false);
    }
  };

  const handleSaveJob = (jobId: string) => {
    let updated = [...savedJobs];
    if (savedJobs.includes(jobId)) {
      updated = updated.filter((id) => id !== jobId);
      triggerToast("Job removed from saved list.");
    } else {
      updated.push(jobId);
      triggerToast("Job added to saved list successfully!");
    }
    setSavedJobs(updated);
    localStorage.setItem("rama_saved_jobs", JSON.stringify(updated));
  };

  const handleShareJob = (job: Job) => {
    const url = `${window.location.origin}/jobs?jobId=${job.id}`;
    navigator.clipboard.writeText(url);
    triggerToast("Job link copied to clipboard!");
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAlertSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertEmail || !alertSector) return;
    setAlertSuccess(true);
    setAlertEmail("");
    setTimeout(() => setAlertSuccess(false), 5000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-navy-950 text-navy-900 dark:text-white font-sans transition-colors duration-200 overflow-x-hidden">
      <Navbar />

      {/* Hero Banner Header */}
      <section className="bg-[#051B3D] text-white pt-32 pb-20 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,0.1),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="font-headline text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{t("title")}</h1>
            <p className="text-xs sm:text-sm text-gray-300 font-light max-w-xl">
              {t("desc")}
            </p>
          </div>
          {toastMessage && (
            <div className="bg-blue-600 text-white border border-blue-500/20 px-6 py-3 rounded-full text-xs font-bold shadow-lg animate-pulse whitespace-nowrap">
              {toastMessage}
            </div>
          )}
        </div>
      </section>

      {/* Advanced Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 w-full">
        <div className="bg-white dark:bg-navy-900/60 border border-gray-150 dark:border-white/5 rounded-[28px] p-6 shadow-enterprise space-y-4 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative col-span-1 md:col-span-2">
              <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-gray-400" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-navy-950 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white rounded-xl pl-11 pr-4 py-3 text-xs outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-navy-900 transition-all font-medium font-sans"
              />
            </div>

            <div>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-slate-50 dark:bg-navy-950 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white rounded-xl px-4 py-3 text-xs outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-navy-900 transition-all cursor-pointer font-bold font-sans"
              >
                <option value="">{t("allCountries")}</option>
                {countries.map((c) => (
                  <option key={c} value={c} className="text-navy-900">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full bg-slate-50 dark:bg-navy-950 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white rounded-xl px-4 py-3 text-xs outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-navy-900 transition-all cursor-pointer font-bold font-sans"
              >
                <option value="">{t("allSectors")}</option>
                {sectors.map((s) => (
                  <option key={s} value={s} className="text-navy-900">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-3 border-t border-gray-100 dark:border-white/5">
            <div>
              <select
                value={selectedSalary}
                onChange={(e) => setSelectedSalary(e.target.value)}
                className="w-full bg-slate-50 dark:bg-navy-950 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white rounded-xl px-4 py-3 text-xs outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-navy-900 transition-all cursor-pointer font-bold font-sans"
              >
                <option value="">{t("allSalaries")}</option>
                <option value="low" className="text-navy-900">Gulf Currency (SR/AED)</option>
                <option value="high" className="text-navy-900">European/Petro (EUR/USD/QAR)</option>
              </select>
            </div>

            <div>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-full bg-slate-50 dark:bg-navy-950 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white rounded-xl px-4 py-3 text-xs outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-navy-900 transition-all cursor-pointer font-bold font-sans"
              >
                <option value="">{t("allExperiences")}</option>
                <option value="junior" className="text-navy-900">Junior (1-3 Years)</option>
                <option value="senior" className="text-navy-900">Senior (4+ Years)</option>
              </select>
            </div>

            <div>
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-navy-950 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white rounded-xl px-4 py-3 text-xs outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-navy-900 transition-all cursor-pointer font-bold font-sans"
              >
                <option value="">{t("allJobTypes")}</option>
                <option value="permanent" className="text-navy-900">Permanent Position</option>
                <option value="contract" className="text-navy-900">Contract Campaign</option>
              </select>
            </div>

            <div>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full bg-slate-50 dark:bg-navy-950 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white rounded-xl px-4 py-3 text-xs outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-navy-900 transition-all cursor-pointer font-bold font-sans"
              >
                <option value="">{t("allSkills")}</option>
                {skills.map((s) => (
                  <option key={s} value={s} className="text-navy-900">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleClearFilters}
              className="bg-blue-600/10 dark:bg-blue-500/10 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:text-blue-400 text-blue-650 text-[10px] font-bold uppercase tracking-wider py-3 rounded-xl cursor-pointer transition-all duration-200 font-headline border border-blue-500/10 dark:border-blue-400/10"
            >
              {t("clearBtn")}
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        
        {/* Left Side: Job Postings Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 ml-1">
            <p>Showing {filteredJobs.length} {t("activeOpenings")}</p>
          </div>

          {loading ? (
            <div className="bg-white dark:bg-navy-900/40 border border-gray-150 dark:border-white/5 rounded-[24px] p-20 flex flex-col items-center justify-center shadow-enterprise">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-500 mb-3" />
              <span className="text-xs">Connecting to job databases...</span>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white dark:bg-navy-900/40 border border-gray-150 dark:border-white/5 rounded-[24px] p-16 text-center space-y-4 text-gray-500 dark:text-gray-400 shadow-enterprise">
              <AlertCircle className="h-10 w-10 text-blue-500 mx-auto" />
              <h3 className="font-headline font-bold text-navy-900 dark:text-white text-sm">{t("noJobsTitle")}</h3>
              <p className="text-xs font-light max-w-sm mx-auto">{t("noJobsDesc")}</p>
              <button
                onClick={handleClearFilters}
                className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-6 py-3 rounded-full cursor-pointer transition-all border border-blue-500/20 shadow-md font-headline"
              >
                {t("resetBtn")}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => {
                const isSaved = savedJobs.includes(job.id);
                const isSelected = selectedJob?.id === job.id;
                return (
                  <div
                    key={job.id}
                    onClick={() => {
                      setSelectedJob(job);
                      setApplyMessage(null);
                    }}
                    className={`bg-white dark:bg-navy-900/40 border rounded-[20px] p-6 shadow-enterprise hover:shadow-md transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? "border-blue-600 ring-2 ring-blue-500/10 dark:ring-blue-450/20"
                        : "border-gray-150 dark:border-white/5 hover:border-blue-500/20 dark:hover:border-blue-500/20"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-headline text-base font-bold text-navy-900 dark:text-white group-hover:text-blue-600 transition-colors leading-snug">
                          {job.title}
                        </h3>
                        <p className="text-xs text-blue-605 dark:text-blue-400 font-bold mt-1">{job.employer.companyName}</p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveJob(job.id);
                          }}
                          className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                            isSaved
                              ? "bg-blue-600/10 text-blue-600 border-blue-500/20"
                              : "border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-navy-950 text-gray-400 hover:border-blue-500/20"
                          }`}
                        >
                          {isSaved ? <BookmarkCheck className="h-4.5 w-4.5" /> : <Bookmark className="h-4.5 w-4.5" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareJob(job);
                          }}
                          className="p-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-950 hover:border-blue-500/20 transition-colors cursor-pointer"
                        >
                          <Share2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 leading-relaxed line-clamp-2 font-light">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-6 text-xs text-gray-500 dark:text-gray-450 mt-6 pt-4 border-t border-gray-100 dark:border-white/5 font-medium">
                      <span className="flex items-center space-x-1.5">
                        <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                        <span>{job.country}</span>
                      </span>
                      <span className="flex items-center space-x-1.5">
                        <Layers className="h-4 w-4 text-blue-600 shrink-0" />
                        <span>{job.sector}</span>
                      </span>
                      <span className="flex items-center space-x-1.5">
                        <DollarSign className="h-4 w-4 text-blue-600 shrink-0" />
                        <span>{job.salaryRange || "Negotiable"}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Detailed Detail Panel & Alert Subscriptions */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Detailed Job Description Card */}
          {selectedJob ? (
            <div className="bg-white dark:bg-navy-900/40 border border-gray-150 dark:border-white/5 rounded-[28px] p-6 sm:p-8 shadow-enterprise space-y-6">
              <div className="border-b border-gray-100 dark:border-white/5 pb-4">
                <span className="bg-[#0B3D91]/10 dark:bg-blue-500/10 text-[#0B3D91] dark:text-blue-400 text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-blue-500/5">
                  {selectedJob.sector}
                </span>
                <h2 className="font-headline text-lg sm:text-xl font-extrabold text-navy-900 dark:text-white mt-3 leading-snug">{selectedJob.title}</h2>
                <p className="text-xs text-gray-450 dark:text-gray-400 font-bold mt-1">{selectedJob.employer.companyName}</p>
              </div>

              {applyMessage && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start space-x-2 ${
                    applyMessage.isError
                      ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-750"
                      : "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-700"
                  }`}
                >
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <p>{applyMessage.text}</p>
                </div>
              )}

              <div className="space-y-5 text-xs text-gray-650 dark:text-gray-300 leading-relaxed font-light font-headline">
                <div>
                  <h4 className="font-bold text-[#051B3D] dark:text-blue-400 uppercase tracking-widest mb-1.5 font-headline">{t("overview")}</h4>
                  <p>{selectedJob.description}</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#051B3D] dark:text-blue-400 uppercase tracking-widest mb-1.5 font-headline">{t("requirements")}</h4>
                  <p>{selectedJob.requirements}</p>
                </div>
                {selectedJob.benefits && (
                  <div>
                    <h4 className="font-bold text-[#051B3D] dark:text-blue-400 uppercase tracking-widest mb-1.5 font-headline">{t("benefits")}</h4>
                    <p>{selectedJob.benefits}</p>
                  </div>
                )}
              </div>

              {/* Structural Details Table */}
              <div className="bg-slate-50 dark:bg-navy-950/40 rounded-2xl p-4.5 border border-gray-150 dark:border-white/5 grid grid-cols-2 gap-4 text-xs font-headline">
                <div>
                  <span className="text-gray-400 dark:text-gray-450 block font-semibold text-[10px] uppercase">Location</span>
                  <span className="text-navy-900 dark:text-white font-extrabold">{selectedJob.country}</span>
                </div>
                <div>
                  <span className="text-gray-400 dark:text-gray-450 block font-semibold text-[10px] uppercase">Salary Range</span>
                  <span className="text-navy-900 dark:text-white font-extrabold">{selectedJob.salaryRange || "Negotiable"}</span>
                </div>
                <div>
                  <span className="text-gray-400 dark:text-gray-455 block font-semibold text-[10px] uppercase">Vacancies</span>
                  <span className="text-navy-900 dark:text-white font-extrabold">{selectedJob.vacancies} Positions</span>
                </div>
                <div>
                  <span className="text-gray-400 dark:text-gray-455 block font-semibold text-[10px] uppercase">Job Type</span>
                  <span className="text-navy-900 dark:text-white font-extrabold">Full-Time / Direct</span>
                </div>
              </div>

              <button
                onClick={() => handleApply(selectedJob.id)}
                disabled={applying}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-4 rounded-full flex items-center justify-center space-x-2 text-xs shadow-lg hover:shadow-blue-500/10 cursor-pointer disabled:opacity-50 font-headline border border-blue-500/20 hover:-translate-y-0.5 transition-all"
              >
                {applying ? (
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <>
                    <Briefcase className="h-4 w-4" />
                    <span>{t("saveBtn")}</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-navy-900/40 border border-gray-150 dark:border-white/5 rounded-[28px] p-8 text-center text-gray-400 space-y-3 shadow-enterprise">
              <Briefcase className="h-10 w-10 text-blue-500 mx-auto" />
              <h3 className="font-headline font-bold text-navy-900 dark:text-white text-sm">Select a Vacancy</h3>
              <p className="text-xs font-light">Pick an active campaign card from the listing feed to view full requirements and begin Easy Apply.</p>
            </div>
          )}

          {/* Job Alerts Form */}
          <div className="bg-navy-950 border border-white/5 text-white rounded-[28px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2.5 pb-2.5 border-b border-white/5">
              <Bell className="h-5 w-5 text-blue-500" />
              <h3 className="font-headline text-sm font-extrabold text-blue-500 tracking-wider uppercase">{t("alertTitle")}</h3>
            </div>

            <p className="text-[10px] text-gray-300 font-light leading-relaxed font-headline">
              {t("alertDesc")}
            </p>

            {alertSuccess && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-800 text-emerald-450 rounded-xl text-[11px] font-semibold">
                Job alert subscription configured successfully!
              </div>
            )}

            {!alertSuccess && (
              <form onSubmit={handleAlertSetup} className="space-y-3.5 text-xs text-navy-900 font-semibold">
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  className="w-full bg-[#03132B] border border-white/5 text-white rounded-xl p-3 outline-none focus:border-blue-500 font-medium font-sans animate-all"
                />

                <select
                  required
                  value={alertSector}
                  onChange={(e) => setAlertSector(e.target.value)}
                  className="w-full bg-[#03132B] border border-white/5 text-white rounded-xl p-3 outline-none focus:border-blue-500 cursor-pointer font-bold font-sans"
                >
                  <option value="" disabled className="text-gray-400">
                    Select Industry Sector
                  </option>
                  {sectors.map((s) => (
                    <option key={s} value={s} className="text-navy-900">
                      {s}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-3 rounded-full text-[10px] shadow transition-colors cursor-pointer border border-blue-500/20 hover:-translate-y-0.5"
                >
                  {t("alertBtn")}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
