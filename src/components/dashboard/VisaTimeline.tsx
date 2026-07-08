"use client";

import { Check, Clock, FileText, Send, Stamp, Plane, ShieldCheck } from "lucide-react";

interface VisaTimelineProps {
  currentStage: string;
  notes?: string | null;
}

const STAGES = [
  {
    key: "DOCUMENT_VERIFICATION",
    label: "Document Verification",
    description: "Recruiter checks passport validity, trade credentials, and police clearance certificates (PCC).",
    icon: FileText,
  },
  {
    key: "EMBASSY_SUBMISSION",
    label: "Embassy Submission",
    description: "Documents and medical reports sent to the respective GCC consulate or destination embassy.",
    icon: Send,
  },
  {
    key: "VISA_STAMPED",
    label: "Visa Stamped",
    description: "Consulate issues the official overseas employment stamp in the candidate's passport.",
    icon: Stamp,
  },
  {
    key: "FLIGHT_BOOKED",
    label: "Flight Booked",
    description: "Flight tickets booked. Travel itinerary sent and pre-departure briefing completed.",
    icon: Plane,
  },
  {
    key: "DEPLOYED",
    label: "Mobilized & Deployed",
    description: "Candidate reports to the international employer. Local onboarding initiated.",
    icon: ShieldCheck,
  },
];

export default function VisaTimeline({ currentStage, notes }: VisaTimelineProps) {
  const getStageIndex = (stage: string) => {
    return STAGES.findIndex((s) => s.key === stage);
  };

  const currentIndex = getStageIndex(currentStage);

  return (
    <div className="bg-navy-900 border border-gold-500/20 rounded-xl p-6 sm:p-8 text-white shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gold-500/10 gap-3">
        <div>
          <h3 className="font-serif text-lg font-bold text-gold-500 tracking-wider">Visa Processing Status</h3>
          <p className="text-xs text-gray-400">Track your overseas immigration and mobilization timeline.</p>
        </div>
        <div className="bg-navy-800 border border-gold-500/30 px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase text-gold-400 flex items-center space-x-1.5 animate-pulse-gold">
          <Clock className="h-3.5 w-3.5" />
          <span>
            {currentStage === "NOT_STARTED" || currentIndex === -1
              ? "Pending Initial Clearance"
              : STAGES[currentIndex].label}
          </span>
        </div>
      </div>

      {/* Stepper Pipeline */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-navy-700/60">
        {STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isPending = index > currentIndex;
          const Icon = stage.icon;

          return (
            <div key={stage.key} className="relative flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Stepper Node Indicator */}
              <div
                className={`absolute -left-[30px] sm:-left-[34px] flex items-center justify-center h-7 w-7 rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-gold-500 border-gold-500 text-navy-950 shadow-lg shadow-gold-500/20"
                    : isActive
                    ? "bg-navy-900 border-gold-400 text-gold-400 scale-110 shadow-lg"
                    : "bg-navy-900 border-navy-700 text-gray-500"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 stroke-[3px]" />
                ) : (
                  <Icon className="h-3.5 w-3.5" />
                )}
              </div>

              {/* Text content */}
              <div className="flex-1">
                <h4
                  className={`text-sm font-semibold tracking-wide ${
                    isActive ? "text-gold-400" : isCompleted ? "text-gray-200" : "text-gray-500"
                  }`}
                >
                  {stage.label}
                </h4>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{stage.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {notes && (
        <div className="mt-8 pt-6 border-t border-gold-500/10 bg-navy-950/40 p-4 rounded-lg border border-gold-500/5">
          <p className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-1">Recruiter Logs & Notes</p>
          <p className="text-xs text-gray-300 leading-relaxed italic">"{notes}"</p>
        </div>
      )}
    </div>
  );
}
