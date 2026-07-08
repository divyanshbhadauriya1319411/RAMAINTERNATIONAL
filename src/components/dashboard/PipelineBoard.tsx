"use client";

import { useState } from "react";
import { ChevronRight, Calendar, User, FileText, ClipboardList, RefreshCw, Send, CheckSquare } from "lucide-react";

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

interface PipelineBoardProps {
  applications: Application[];
  onRefresh: () => void;
}

const COLUMNS = [
  { key: "APPLIED", label: "Applied", color: "border-blue-500 bg-blue-500/10 text-blue-400" },
  { key: "SHORTLISTED", label: "Shortlisted", color: "border-yellow-500 bg-yellow-500/10 text-yellow-400" },
  { key: "INTERVIEW_SCHEDULED", label: "Interviewing", color: "border-indigo-500 bg-indigo-500/10 text-indigo-400" },
  { key: "SELECTED", label: "Selected", color: "border-green-500 bg-green-500/10 text-green-400" },
  { key: "VISA_STAGE", label: "Visa Processing", color: "border-gold-500 bg-gold-500/10 text-gold-400" },
  { key: "MOBILIZED", label: "Mobilized", color: "border-purple-500 bg-purple-500/10 text-purple-400" },
];

export default function PipelineBoard({ applications, onRefresh }: PipelineBoardProps) {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [updating, setUpdating] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [editVisaStatus, setEditVisaStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editInterviewDate, setEditInterviewDate] = useState("");

  const openEditModal = (app: Application) => {
    setSelectedApp(app);
    setEditStatus(app.status);
    setEditVisaStatus(app.visaStatus);
    setEditNotes(app.notes || "");
    setEditInterviewDate(app.interviewDate ? new Date(app.interviewDate).toISOString().slice(0, 16) : "");
  };

  const handleUpdate = async () => {
    if (!selectedApp) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/applications/${selectedApp.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          visaStatus: editStatus === "VISA_STAGE" ? editVisaStatus || "DOCUMENT_VERIFICATION" : "NOT_STARTED",
          notes: editNotes,
          interviewDate: editStatus === "INTERVIEW_SCHEDULED" && editInterviewDate ? editInterviewDate : null,
        }),
      });

      if (res.ok) {
        setSelectedApp(null);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const getAppsForCol = (colKey: string) => {
    return applications.filter((app) => app.status === colKey);
  };

  return (
    <div className="w-full">
      {/* Board Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colApps = getAppsForCol(col.key);
          return (
            <div key={col.key} className="bg-navy-900 border border-gold-500/10 rounded-xl p-4 min-w-[220px] flex flex-col">
              <div className="flex justify-between items-center pb-3 mb-3 border-b border-gold-500/5">
                <h3 className="font-semibold text-xs text-gold-500 uppercase tracking-widest">{col.label}</h3>
                <span className="bg-navy-800 text-[10px] text-gray-400 font-semibold px-2 py-0.5 rounded-full">
                  {colApps.length}
                </span>
              </div>

              {/* Card List */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[450px]">
                {colApps.length === 0 ? (
                  <div className="h-20 border border-dashed border-navy-800 rounded-lg flex items-center justify-center text-[10px] text-gray-500">
                    No applicants
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => openEditModal(app)}
                      className="group cursor-pointer bg-navy-850 hover:bg-navy-800 border border-gold-500/10 hover:border-gold-500/30 rounded-lg p-3 transition-all shadow-md duration-200"
                    >
                      <h4 className="font-semibold text-xs text-gray-100 group-hover:text-gold-400 transition-colors">
                        {app.candidate.fullName}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1 truncate">{app.job.title}</p>
                      <div className="flex items-center justify-between mt-3 text-[9px] text-gray-500">
                        <span className="bg-navy-800 border border-gold-500/10 px-1.5 py-0.5 rounded text-gold-500">
                          {app.job.country}
                        </span>
                        <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Candidate Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-gold-500/30 rounded-xl max-w-lg w-full text-white shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start border-b border-gold-500/15 pb-4 mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-gold-500">Recruitment & ATS Action Center</h3>
                <p className="text-xs text-gray-400">Update status, logs, or schedules for this application.</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gold-500 text-sm font-semibold p-1"
              >
                ✕ Close
              </button>
            </div>

            {/* Candidate Summary */}
            <div className="bg-navy-850 rounded-lg p-4 mb-6 border border-gold-500/10 text-xs grid grid-cols-2 gap-3">
              <div>
                <span className="text-gray-400 block font-semibold mb-0.5">Candidate</span>
                <span className="text-gray-100 font-semibold">{selectedApp.candidate.fullName}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold mb-0.5">Target Vacancy</span>
                <span className="text-gray-100 font-semibold">{selectedApp.job.title}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold mb-0.5">Experience</span>
                <span className="text-gray-200">{selectedApp.candidate.experienceYears || 0} Years</span>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold mb-0.5">Resume / CV</span>
                {selectedApp.candidate.resumeUrl ? (
                  <a
                    href={selectedApp.candidate.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold-500 hover:underline font-semibold flex items-center space-x-1"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>View CV</span>
                  </a>
                ) : (
                  <span className="text-gray-500">Not Uploaded</span>
                )}
              </div>
            </div>

            {/* Form Updates */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-semibold mb-1">Recruitment Stage</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-navy-800 border border-gold-500/20 text-gray-100 rounded-lg p-2.5 outline-none focus:border-gold-500 transition-colors"
                >
                  {COLUMNS.map((col) => (
                    <option key={col.key} value={col.key}>
                      {col.label}
                    </option>
                  ))}
                  <option value="REJECTED">REJECTED (Not Selected)</option>
                </select>
              </div>

              {editStatus === "INTERVIEW_SCHEDULED" && (
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Interview Date & Time</label>
                  <input
                    type="datetime-local"
                    value={editInterviewDate}
                    onChange={(e) => setEditInterviewDate(e.target.value)}
                    className="w-full bg-navy-800 border border-gold-500/20 text-gray-100 rounded-lg p-2.5 outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
              )}

              {editStatus === "VISA_STAGE" && (
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Visa Processing Sub-Stage</label>
                  <select
                    value={editVisaStatus}
                    onChange={(e) => setEditVisaStatus(e.target.value)}
                    className="w-full bg-navy-800 border border-gold-500/20 text-gray-100 rounded-lg p-2.5 outline-none focus:border-gold-500 transition-colors"
                  >
                    <option value="DOCUMENT_VERIFICATION">Document Verification</option>
                    <option value="EMBASSY_SUBMISSION">Embassy Submission</option>
                    <option value="VISA_STAMPED">Visa Stamped</option>
                    <option value="FLIGHT_BOOKED">Flight Booked</option>
                    <option value="DEPLOYED">Deployed</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Consultant Notes & Logs</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Record trade tests score, interviewer comments, or visa references..."
                  className="w-full bg-navy-800 border border-gold-500/20 text-gray-100 rounded-lg p-2.5 outline-none focus:border-gold-500 transition-colors resize-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                disabled={updating}
                onClick={handleUpdate}
                className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold py-3 rounded-lg flex items-center justify-center space-x-2 text-sm transition-all shadow-lg hover:shadow-gold-500/10 cursor-pointer"
              >
                {updating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckSquare className="h-4 w-4" />
                    <span>Apply Updates</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
