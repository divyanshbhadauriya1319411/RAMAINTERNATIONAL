"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  ChevronRight,
  User,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Bookmark,
  Share2,
  Bell,
  FileText,
  BookmarkCheck,
  Clipboard,
  Layers,
  GraduationCap,
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
  
  // Bookmark/Save job states (Persisted in localStorage for fast local response)
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

    // Filter by salary range (simple heuristics)
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

    // Filter by job type (mapped by sector/tag in template)
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
    <div className="flex flex-col min-h-screen bg-luxury-light text-navy-900">
      <Navbar />

      {/* Hero Banner Header */}
      <section className="bg-navy-900 text-white py-16 border-b border-gold-500/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="font-serif text-3xl font-extrabold text-gold-500 tracking-wider">Enterprise Job Board</h1>
            <p className="text-xs text-gray-300 mt-1.5 font-light">
              Filter campaigns, configure job alerts, and apply instantly to premium international positions.
            </p>
          </div>
          {toastMessage && (
            <div className="bg-gold-500 text-navy-950 px-4 py-2 rounded-lg text-xs font-bold shadow-lg animate-bounce">
              {toastMessage}
            </div>
          )}
        </div>
      </section>

      {/* Advanced Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-navy-900 border border-gold-500/30 rounded-xl p-5 shadow-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative col-span-1 md:col-span-2">
              <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search job title, keywords or requirements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-navy-850 border border-gold-500/10 text-white rounded-lg pl-10 pr-4 py-3 text-xs outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-navy-850 border border-gold-500/10 text-white rounded-lg px-4 py-3 text-xs outline-none focus:border-gold-500 cursor-pointer"
              >
                <option value="">Country: All</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full bg-navy-850 border border-gold-500/10 text-white rounded-lg px-4 py-3 text-xs outline-none focus:border-gold-500 cursor-pointer"
              >
                <option value="">Industry: All</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2 border-t border-gold-500/5">
            <div>
              <select
                value={selectedSalary}
                onChange={(e) => setSelectedSalary(e.target.value)}
                className="w-full bg-navy-850 border border-gold-500/10 text-white rounded-lg px-4.5 py-3 text-xs outline-none focus:border-gold-500 cursor-pointer"
              >
                <option value="">Salary: All</option>
                <option value="low">Gulf Currency (SR/AED)</option>
                <option value="high">European/Petro (EUR/USD/QAR)</option>
              </select>
            </div>

            <div>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-full bg-navy-850 border border-gold-500/10 text-white rounded-lg px-4.5 py-3 text-xs outline-none focus:border-gold-500 cursor-pointer"
              >
                <option value="">Experience: All</option>
                <option value="junior">Junior (1-3 Years)</option>
                <option value="senior">Senior (4+ Years)</option>
              </select>
            </div>

            <div>
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="w-full bg-navy-850 border border-gold-500/10 text-white rounded-lg px-4.5 py-3 text-xs outline-none focus:border-gold-500 cursor-pointer"
              >
                <option value="">Job Type: All</option>
                <option value="permanent">Permanent Position</option>
                <option value="contract">Contract Campaign</option>
              </select>
            </div>

            <div>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full bg-navy-850 border border-gold-500/10 text-white rounded-lg px-4.5 py-3 text-xs outline-none focus:border-gold-500 cursor-pointer"
              >
                <option value="">Skills Match: All</option>
                {skills.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleClearFilters}
              className="bg-navy-800 hover:bg-navy-750 text-gold-500 text-[10px] font-bold uppercase tracking-wider py-3 rounded-lg border border-gold-500/20 cursor-pointer transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Job Postings Feed */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center text-xs text-gray-500 font-semibold mb-4">
            <p>Showing {filteredJobs.length} open recruitment campaigns</p>
          </div>

          {loading ? (
            <div className="bg-white border border-gray-200 rounded-xl p-16 flex items-center justify-center">
              <RefreshCw className="h-5 w-5 animate-spin text-gold-500 mr-2" />
              <span className="text-xs">Connecting to job databases...</span>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-16 text-center space-y-3 text-gray-500">
              <AlertCircle className="h-8 w-8 text-gold-500 mx-auto" />
              <h3 className="font-serif font-bold text-navy-900">No vacancies matched your criteria</h3>
              <p className="text-xs font-light">Try expanding your search parameters or clearing filters.</p>
              <button
                onClick={handleClearFilters}
                className="bg-navy-900 text-gold-500 text-[10px] font-bold uppercase tracking-wider px-6 py-2.5 rounded border border-gold-500/10"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isSaved = savedJobs.includes(job.id);
              return (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJob(job);
                    setApplyMessage(null);
                  }}
                  className={`bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                    selectedJob?.id === job.id ? "border-gold-500 ring-1 ring-gold-500/50" : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-navy-900 hover:text-gold-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-xs text-gold-600 font-semibold mt-0.5">{job.employer.companyName}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveJob(job.id);
                        }}
                        className={`p-2 rounded border border-gray-150 hover:bg-gray-50 hover:border-gold-500/35 transition-colors cursor-pointer ${
                          isSaved ? "bg-gold-500/10 text-gold-600 border-gold-500/30" : "text-gray-400"
                        }`}
                      >
                        {isSaved ? <BookmarkCheck className="h-4.5 w-4.5" /> : <Bookmark className="h-4.5 w-4.5" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareJob(job);
                        }}
                        className="p-2 rounded border border-gray-150 text-gray-400 hover:bg-gray-50 hover:border-gold-500/35 transition-colors cursor-pointer"
                      >
                        <Share2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-4 leading-relaxed line-clamp-2 font-light">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-6 text-xs text-gray-500 pt-4 border-t border-gray-100 font-medium">
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="h-4 w-4 text-navy-800" />
                      <span>{job.country}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <Layers className="h-4 w-4 text-navy-800" />
                      <span>{job.sector}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <DollarSign className="h-4 w-4 text-navy-800" />
                      <span>{job.salaryRange || "Negotiable"}</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Detailed Detail Panel & Alert Subscriptions */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Detailed Job Description Card */}
          {selectedJob ? (
            <div className="bg-white border border-gray-250 rounded-xl p-6 sm:p-8 shadow-lg space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <span className="bg-navy-900 text-gold-500 text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">
                  {selectedJob.sector}
                </span>
                <h2 className="font-serif text-xl font-bold text-navy-900 mt-3">{selectedJob.title}</h2>
                <p className="text-xs text-gray-400 font-semibold mt-1">{selectedJob.employer.companyName}</p>
              </div>

              {applyMessage && (
                <div
                  className={`p-3 rounded border text-xs flex items-start space-x-2 ${
                    applyMessage.isError
                      ? "bg-red-50 border-red-200 text-red-750"
                      : "bg-green-50 border-green-200 text-green-705"
                  }`}
                >
                  {applyMessage.isError ? (
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  )}
                  <p>{applyMessage.text}</p>
                </div>
              )}

              <div className="space-y-4 text-xs text-gray-600 leading-relaxed font-light">
                <div>
                  <h4 className="font-bold text-navy-900 uppercase tracking-widest mb-1.5">Overview</h4>
                  <p>{selectedJob.description}</p>
                </div>
                <div>
                  <h4 className="font-bold text-navy-900 uppercase tracking-widest mb-1.5">Qualifications & Experience</h4>
                  <p>{selectedJob.requirements}</p>
                </div>
                {selectedJob.benefits && (
                  <div>
                    <h4 className="font-bold text-navy-900 uppercase tracking-widest mb-1.5">Benefits package</h4>
                    <p>{selectedJob.benefits}</p>
                  </div>
                )}
              </div>

              {/* Structural Details Table */}
              <div className="bg-luxury-light rounded-lg p-4 border border-gray-200 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block font-semibold">Location</span>
                  <span className="text-navy-900 font-bold">{selectedJob.country}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">Salary Range</span>
                  <span className="text-navy-900 font-bold">{selectedJob.salaryRange || "Negotiable"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">Vacancies</span>
                  <span className="text-navy-900 font-bold">{selectedJob.vacancies} Positions</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">Job Type</span>
                  <span className="text-navy-900 font-bold">Full-Time / Direct</span>
                </div>
              </div>

              <button
                onClick={() => handleApply(selectedJob.id)}
                disabled={applying}
                className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold uppercase tracking-wider py-4 rounded-lg flex items-center justify-center space-x-2 text-xs shadow-lg hover:shadow-gold-500/10 cursor-pointer disabled:opacity-50 font-sans"
              >
                {applying ? (
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <>
                    <Briefcase className="h-4 w-4" />
                    <span>One-Click Easy Apply</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 space-y-3">
              <Briefcase className="h-8 w-8 text-gold-500 mx-auto" />
              <h3 className="font-serif font-bold text-navy-900 text-sm">Select a Vacancy</h3>
              <p className="text-xs font-light">Pick an active campaign card from the left listing feed to view full requirements and begin Easy Apply.</p>
            </div>
          )}

          {/* Job Alerts Form */}
          <div className="bg-navy-900 border border-gold-500/20 text-white rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-gold-500/10">
              <Bell className="h-5 w-5 text-gold-500" />
              <h3 className="font-serif text-sm font-bold text-gold-500 tracking-wider">Configure Job Alerts</h3>
            </div>

            <p className="text-[10px] text-gray-300 font-light leading-relaxed">
              Register your email and target sector to receive instant updates when new international drives are published.
            </p>

            {alertSuccess && (
              <div className="p-3 bg-green-950/20 border border-green-800 text-green-450 rounded text-[11px] font-semibold">
                Job alert subscription configured successfully!
              </div>
            )}

            {!alertSuccess && (
              <form onSubmit={handleAlertSetup} className="space-y-3 text-xs text-navy-900 font-semibold">
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  className="w-full bg-navy-850 border border-gold-500/20 text-white rounded p-2.5 outline-none focus:border-gold-500"
                />

                <select
                  required
                  value={alertSector}
                  onChange={(e) => setAlertSector(e.target.value)}
                  className="w-full bg-navy-850 border border-gold-500/20 text-white rounded p-2.5 outline-none focus:border-gold-500 cursor-pointer font-medium"
                >
                  <option value="" disabled className="text-gray-400">
                    Select Industry Sector
                  </option>
                  {sectors.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold uppercase tracking-wider py-2.5 rounded text-[10px] shadow transition-colors cursor-pointer"
                >
                  Setup Alert
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
