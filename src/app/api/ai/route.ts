import { NextResponse } from "next/server";
import {
  parseResumeAI,
  scoreResumeAI,
  generateInterviewQuestionsAI,
  generateJobDescriptionAI,
  generateOutreachEmailAI,
  getHiringInsightsAI,
} from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: "Missing required parameter 'action'." }, { status: 400 });
    }

    switch (action) {
      case "parse-resume": {
        const { fileName, textContent } = body;
        const parsed = parseResumeAI(fileName || "Resume.pdf", textContent || "");
        return NextResponse.json({ parsed });
      }

      case "score-resume": {
        const { skills, requirements } = body;
        if (!skills || !requirements) {
          return NextResponse.json({ error: "Missing 'skills' or 'requirements' parameters." }, { status: 400 });
        }
        const scoring = scoreResumeAI(skills, requirements);
        return NextResponse.json({ scoring });
      }

      case "interview-questions": {
        const { jobTitle, skills } = body;
        if (!jobTitle) {
          return NextResponse.json({ error: "Missing 'jobTitle'." }, { status: 400 });
        }
        const questions = generateInterviewQuestionsAI(jobTitle, skills || []);
        return NextResponse.json({ questions });
      }

      case "job-description": {
        const { title, sector, country } = body;
        if (!title || !sector || !country) {
          return NextResponse.json({ error: "Missing parameters 'title', 'sector', or 'country'." }, { status: 400 });
        }
        const jd = generateJobDescriptionAI(title, sector, country);
        return NextResponse.json({ jd });
      }

      case "email-generator": {
        const { candidateName, jobTitle, companyName } = body;
        if (!candidateName || !jobTitle || !companyName) {
          return NextResponse.json({ error: "Missing parameters 'candidateName', 'jobTitle', or 'companyName'." }, { status: 400 });
        }
        const email = generateOutreachEmailAI(candidateName, jobTitle, companyName);
        return NextResponse.json({ email });
      }

      case "hiring-insights": {
        const insights = getHiringInsightsAI();
        return NextResponse.json({ insights });
      }

      case "chat-assistant": {
        const { message } = body;
        if (!message) {
          return NextResponse.json({ error: "Missing message." }, { status: 400 });
        }
        // Simulated AI Bot logic
        let reply = "I am RAMA's Global Recruitment AI. How can I assist you with your visa tracking, trade test yards, or active job applications?";
        const msgLower = message.toLowerCase();
        if (msgLower.includes("visa") || msgLower.includes("status")) {
          reply = "You can track your visa stages (VFS appointment, medical report, consulate stamp) live on the Candidate Dashboard stepper.";
        } else if (msgLower.includes("licence") || msgLower.includes("license")) {
          reply = "RAMA INTERNATIONAL is certified by the Ministry of External Affairs (MEA), Government of India. MEA License: RC-B-0850/DEL/COM/1000+/5/9385/2018.";
        } else if (msgLower.includes("apply") || msgLower.includes("jobs")) {
          reply = "Browse our live jobs feed on the Job Portal, configure your sector notifications, and click 'Easy Apply' to submit your dossier.";
        }
        return NextResponse.json({ reply });
      }

      default:
        return NextResponse.json({ error: `Action '${action}' not supported.` }, { status: 400 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
