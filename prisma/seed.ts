import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing tables
  await prisma.galleryItem.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.inquiry.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.candidateProfile.deleteMany({});
  await prisma.employerProfile.deleteMany({});
  await prisma.user.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("Password123!", salt);

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      email: "admin@ramainternational.in",
      passwordHash,
      role: "ADMIN",
    },
  });

  const employerUser = await prisma.user.create({
    data: {
      email: "recruitment@almarai.com",
      passwordHash,
      role: "EMPLOYER",
    },
  });

  const candidateUser = await prisma.user.create({
    data: {
      email: "rahul.sharma@gmail.com",
      passwordHash,
      role: "CANDIDATE",
    },
  });

  console.log("Users created successfully.");

  // 2. Create Employer Profile
  const employerProfile = await prisma.employerProfile.create({
    data: {
      userId: employerUser.id,
      companyName: "Almarai Foods Group",
      industry: "FMCG / Manufacturing",
      website: "https://www.almarai.com",
      contactPerson: "Dr. Khaled Al-Mutairi",
      phone: "+966 11 470 0000",
      address: "Riyadh Head Office, Saudi Arabia",
      isVerified: true,
    },
  });

  // 3. Create Candidate Profile
  const candidateProfile = await prisma.candidateProfile.create({
    data: {
      userId: candidateUser.id,
      fullName: "Rahul Sharma",
      phone: "+91 9876543210",
      passportNumber: "Z1234567",
      resumeUrl: "",
      currentSalary: "₹45,000 / month",
      expectedSalary: "₹1,20,000 / month",
      skills: "Electrician, Maintenance, Industrial Wiring, Safety Standards",
      experienceYears: 5,
      education: "ITI Diploma in Electrical Engineering",
      location: "Delhi, India",
      status: "ACTIVE",
    },
  });

  console.log("Profiles created successfully.");

  // 4. Create Jobs
  const job1 = await prisma.job.create({
    data: {
      title: "Senior Industrial Electrician",
      description: "We are seeking experienced Industrial Electricians to maintain and troubleshoot production lines at our dairy packaging plants in Riyadh. Candidates must have extensive knowledge of electrical codes, schematics, and PLC diagnostics.",
      requirements: "Minimum 4 years of industrial experience. ITI or Diploma in Electrical. Ability to read blueprints and write maintenance logs. Knowledge of GCC safety regulations.",
      benefits: "Tax-free salary. Free sharing accommodation and transportation. Medical insurance and annual return ticket to India. 30 days paid leave.",
      sector: "Manufacturing",
      country: "Saudi Arabia",
      salaryRange: "SR 3,500 - SR 4,500 / month",
      vacancies: 15,
      status: "OPEN",
      employerId: employerProfile.id,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      title: "Registered Staff Nurse (ICU)",
      description: "A leading hospital network in Munich, Germany is hiring registered nurses for ICU departments. The candidate will manage critical care patients, coordinate with physicians, and maintain medical records. German language training will be sponsored for selected candidates.",
      requirements: "B.Sc Nursing or GNM. Minimum 2 years of clinical experience in ICU. Ready to learn German language up to B2 level.",
      benefits: "€3,200 - €4,000 / month gross. Complete relocation package. Hospital-subsidized housing. Standard European health & pension insurance.",
      sector: "Healthcare",
      country: "Germany",
      salaryRange: "€3,200 - €4,000 / month",
      vacancies: 8,
      status: "OPEN",
      employerId: employerProfile.id,
    },
  });

  const job3 = await prisma.job.create({
    data: {
      title: "Scaffolding Inspector",
      description: "Urgently required for an onshore Oil & Gas development project in Doha, Qatar. Responsible for inspecting all scaffold structures to ensure strict compliance with international safety protocols and client specifications.",
      requirements: "OSHA/NEBOSH certification preferred. 6+ years of scaffolding inspection experience in oil & gas projects. Excellent English communication skills.",
      benefits: "Free single room accommodation. Food allowance. 12-month renewable contract. Standard medical insurance.",
      sector: "Oil & Gas",
      country: "Qatar",
      salaryRange: "QAR 6,000 - QAR 7,500 / month",
      vacancies: 5,
      status: "OPEN",
      employerId: employerProfile.id,
    },
  });

  const job4 = await prisma.job.create({
    data: {
      title: "HVAC Commissioning Technician",
      description: "Looking for skilled HVAC technicians for a five-star luxury hotel expansion in Dubai Marina, UAE. Experience in installation, chiller commissioning, and building management systems (BMS) is required.",
      requirements: "Technical diploma in Air Conditioning & Refrigeration. 3+ years experience with high-capacity chiller systems and variable air volume units.",
      benefits: "AED 2,800 - AED 3,500 / month plus overtime. Free shared accommodation, utility allowances, and duty meals.",
      sector: "Hospitality",
      country: "UAE",
      salaryRange: "AED 2,800 - AED 3,500 / month",
      vacancies: 10,
      status: "OPEN",
      employerId: employerProfile.id,
    },
  });

  console.log("Jobs seeded successfully.");

  // 5. Create Mock Application & Visa Tracking
  await prisma.application.create({
    data: {
      jobId: job1.id,
      candidateId: candidateProfile.id,
      status: "VISA_STAGE",
      visaStatus: "DOCUMENT_VERIFICATION",
      notes: "Selected after Trade Test in Delhi on June 15, 2026. Documents submitted for verification.",
    },
  });

  // 6. Seed Inquiries (CRM Leads)
  await prisma.inquiry.createMany({
    data: [
      {
        name: "Marc Sterling",
        email: "m.sterling@sterlingconstruction.de",
        companyName: "Sterling Projects GmbH",
        phone: "+49 89 231456",
        message: "We need 50 skilled welders and 30 bricklayers for our new commercial site in Stuttgart. Please share your terms of business and trade testing capabilities in India.",
        status: "PENDING",
      },
      {
        name: "Yousef Al-Kuwari",
        email: "yousef@qatargas.com.qa",
        companyName: "Qatar Gas Logistics",
        phone: "+974 4455 6677",
        message: "Looking for an agency to source 100 heavy-duty truck drivers. Must have valid GCC license. Please reply with agency commission structure.",
        status: "CONTACTED",
      },
    ],
  });

  // 7. Seed Blog Posts
  await prisma.blogPost.createMany({
    data: [
      {
        title: "New GCC Visa Stamping Rules for Indian Workers in 2026",
        slug: "new-gcc-visa-stamping-rules-2026",
        summary: "An in-depth guide on the updated visa stamping guidelines, mandatory medical tests, and biometric requirements across Saudi Arabia, UAE, and Qatar.",
        content: `As of early 2026, the Gulf Cooperation Council (GCC) has updated its immigration screening policies for South Asian workers. If you are preparing for a job transition to Saudi Arabia or Qatar, here are the key updates:

### 1. Unified Biometrics Registration
All workers must complete biometric registration (iris scan and 10-fingerprint mapping) at designated centers in India prior to visa authorization. This replaces the on-arrival biometrics.

### 2. GAMCA Medical Clearance
The GAMCA (now Wafid) medical test is valid for 90 days. The list of chronic conditions restricting entry has been revised. Select candidates should ensure they undergo local screening before their official appointment.

### 3. Degree & Skill Attestation
All professional degree holders must get their documents verified by the Ministry of External Affairs (MEA) and the respective country's embassy in India. Trade skills are verified via authorized trade testing hubs like RAMA INTERNATIONAL.`,
        category: "Visa Update",
      },
      {
        title: "Bridging the Global Skilled Labor Shortage: The Indian Advantage",
        slug: "global-skilled-labor-shortage-indian-advantage",
        summary: "Why Europe, the Middle East, and Singapore are turning to India to meet their growing demand for engineering, healthcare, and construction talent.",
        content: `The global economy is facing a massive shortage of vocational, healthcare, and infrastructure talent. From Germany's nursing shortages to the megaprojects in Riyadh, companies are struggling to recruit skilled manpower locally.

### The Scale of Indian Migration
India is currently the largest source of skilled and semi-skilled labor globally. Thanks to a structured vocational program (ITI, PMKVY) and excellent work ethic, Indian candidates are highly preferred.

### Rama International's Vision
Founded in 2018 under Deepak Chauhan, Rama International has mobilized over 5,000 workers across the globe. Our focus remains on high-quality pre-screening and rigorous trade testing, matching candidates perfectly with global expectations.`,
        category: "Industry Insights",
      },
    ],
  });

  // 8. Seed Gallery Items
  await prisma.galleryItem.createMany({
    data: [
      {
        title: "Saudi Arabia Welder Trade Test - Delhi Center",
        imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop",
        category: "Trade Test",
      },
      {
        title: "Departure of 45-Candidate Logistics Batch to Dubai",
        imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop",
        category: "Departure",
      },
      {
        title: "Annual Global Recruiter Conference, Mumbai",
        imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop",
        category: "Event",
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding database: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
