/**
 * RAMA INTERNATIONAL - AI Cognitive Sourcing Engine
 * Lightweight high-performance heuristics simulated engine.
 * Ready for easy hookup to OpenAI/Gemini/Anthropic API keys.
 */

export interface ParsedResume {
  fullName: string;
  email: string;
  phone: string;
  skills: string[];
  education: string;
  experienceYears: number;
}

export function parseResumeAI(fileName: string, textContent?: string): ParsedResume {
  const cleanName = fileName.replace(/_|-/g, " ").replace(/\.pdf|\.docx/gi, "");
  
  // Heuristic extraction rules
  const skillsList = ["Welding", "Electrical Maintenance", "Nursing", "Critical Care", "HVAC COMMISSIONING", "Rigging", "Safety Audit"];
  const extractedSkills = skillsList.filter(s => 
    textContent?.toLowerCase().includes(s.toLowerCase()) || 
    cleanName.toLowerCase().includes(s.toLowerCase().split(" ")[0])
  );
  if (extractedSkills.length === 0) {
    extractedSkills.push("Technical Operations", "Industrial Safety");
  }

  return {
    fullName: cleanName.split(" ").slice(0, 2).join(" ") || "Rahul Sharma",
    email: `${cleanName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
    phone: "+91 " + Math.floor(7000000000 + Math.random() * 2900000000),
    skills: extractedSkills,
    education: textContent?.includes("B.Sc") ? "B.Sc Nursing" : "ITI Vocational Diploma",
    experienceYears: textContent?.includes("8") ? 8 : 4,
  };
}

export function scoreResumeAI(candidateSkills: string[], jobRequirements: string): { score: number; matchNotes: string[] } {
  let score = 50;
  const notes: string[] = [];

  const reqLower = jobRequirements.toLowerCase();
  
  candidateSkills.forEach(skill => {
    if (reqLower.includes(skill.toLowerCase())) {
      score += 10;
      notes.push(`Direct skill alignment detected: ${skill}`);
    } else {
      score += 2;
    }
  });

  if (reqLower.includes("diploma") || reqLower.includes("iti")) {
    score += 10;
    notes.push("Meets trade qualification educational thresholds.");
  }

  score = Math.min(score, 100);

  if (score > 80) {
    notes.push("Highly recommended for rapid mobilization select.");
  } else if (score > 60) {
    notes.push("Adequate alignment; trade yard check recommended.");
  } else {
    notes.push("Requires further vetting checks.");
  }

  return { score, matchNotes: notes };
}

export function generateInterviewQuestionsAI(jobTitle: string, skills: string[]): string[] {
  return [
    `Can you describe a challenging task you faced as a ${jobTitle} and how you applied ${skills[0] || "technical safety rules"} to resolve it?`,
    `What specific certifications or practical evaluations do you hold relevant to international standards for ${skills[1] || "general operations"}?`,
    `How do you manage team communications when deployed in overseas environments like GCC or Europe?`,
    `Describe your understanding of safety protocols (e.g. OSHA, safety audits) during bulk project mobilizations.`,
  ];
}

export function generateJobDescriptionAI(title: string, sector: string, country: string): { description: string; requirements: string; benefits: string } {
  return {
    description: `We are actively hiring a qualified ${title} for a leading client operating in ${country}'s ${sector} sector. This is a dynamic, long-term deployment offering career stability.`,
    requirements: `1. Certified ITI Diploma or equivalent qualifications.\n2. Minimum of 3-5 years of direct field experience in the ${sector} industry.\n3. Passport valid for at least 2 years is mandatory.`,
    benefits: `- Competitive tax-free salary structures.\n- Client-provided accommodation & food coordinates.\n- Completed visa stampings & return flight travel coordinates.`,
  };
}

export function generateOutreachEmailAI(candidateName: string, jobTitle: string, companyName: string): string {
  return `Subject: Interview Selection Drive - RAMA INTERNATIONAL-INDIA\n\nDear ${candidateName},\n\nWe reviewed your credentials and found excellent alignment with our active campaign: ${jobTitle} at ${companyName}.\n\nYour profile has been advanced to our physical trade yard testing phase in Delhi/Mumbai. Please verify your passport details on the portal.\n\nWarm regards,\nDeepak Chauhan\nRAMA INTERNATIONAL`;
}

export function getHiringInsightsAI(): { pipelineSpeed: string; bottlenecks: string[]; recommendations: string[] } {
  return {
    pipelineSpeed: "Average 28 days from interview select to deployment flights.",
    bottlenecks: [
      "consulate_stamping: Delhi embassy stamping queues average 8 days delays.",
      "medical_gamca: GAMCA center appointments take 3 days.",
    ],
    recommendations: [
      "Initiate degree MEA attestations concurrently with interviews to save 6 calendar days.",
      "Pre-book biometric appointment slots in bulk at VFS offices.",
    ],
  };
}
