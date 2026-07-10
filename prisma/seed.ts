import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Clean existing tables in correct order
  console.log("Cleaning existing database tables...");
  await prisma.activityLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.savedJob.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.interview.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.inquiry.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.galleryItem.deleteMany({});
  await prisma.country.deleteMany({});
  await prisma.industry.deleteMany({});
  await prisma.adminProfile.deleteMany({});
  await prisma.employerProfile.deleteMany({});
  await prisma.candidateProfile.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.user.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("Password123!", salt);

  console.log("Creating metadata: Countries...");
  // Countries list
  const countriesData = [
    { name: "Saudi Arabia", code: "SA", region: "Gulf Countries" },
    { name: "United Arab Emirates", code: "AE", region: "Gulf Countries" },
    { name: "Qatar", code: "QA", region: "Gulf Countries" },
    { name: "Kuwait", code: "KW", region: "Gulf Countries" },
    { name: "Oman", code: "OM", region: "Gulf Countries" },
    { name: "Bahrain", code: "BH", region: "Gulf Countries" },
    { name: "Germany", code: "DE", region: "Europe" },
    { name: "Poland", code: "PL", region: "Europe" },
    { name: "Romania", code: "RO", region: "Europe" },
    { name: "Croatia", code: "HR", region: "Europe" },
    { name: "Malta", code: "MT", region: "Europe" },
    { name: "Canada", code: "CA", region: "Americas" },
    { name: "Australia", code: "AU", region: "Australasia" },
    { name: "South Africa", code: "ZA", region: "Africa" },
    { name: "Kenya", code: "KE", region: "Africa" },
  ];
  for (const c of countriesData) {
    await prisma.country.create({ data: { name: c.name, code: c.code, region: c.region, isActive: true } });
  }

  console.log("Creating metadata: Industries...");
  // Industries list
  const industriesData = [
    { name: "Healthcare", slug: "healthcare", description: "Medical, nursing, and clinical jobs", iconName: "Heart" },
    { name: "Construction", slug: "construction", description: "Civil, engineering, and vocational building roles", iconName: "HardHat" },
    { name: "Oil & Gas", slug: "oil-gas", description: "Onshore, offshore, drilling and inspection projects", iconName: "Droplet" },
    { name: "Hospitality", slug: "hospitality", description: "Hotels, dining, events, and tourism services", iconName: "Coffee" },
    { name: "Logistics", slug: "logistics", description: "Warehouse operations, driving, supply chain, and transport", iconName: "Truck" },
    { name: "Manufacturing", slug: "manufacturing", description: "Industrial plants, assembly, wiring, and packaging", iconName: "Settings" },
    { name: "Engineering", slug: "engineering", description: "Mechanical, electrical, structural, and process design", iconName: "Cpu" },
    { name: "IT & Software", slug: "it-software", description: "Development, infrastructure, cloud, and technical support", iconName: "Laptop" },
    { name: "Marine Services", slug: "marine", description: "Offshore shipping, port operations, and naval labor", iconName: "Ship" },
    { name: "Aviation", slug: "aviation", description: "Ground crew, maintenance engineers, and cabin staff", iconName: "Plane" },
  ];
  for (const ind of industriesData) {
    await prisma.industry.create({ data: ind });
  }

  console.log("Creating Companies...");
  // Companies list
  const companies = [
    { name: "Almarai Foods Group", website: "https://www.almarai.com", location: "Riyadh, Saudi Arabia", logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=200&auto=format&fit=crop" },
    { name: "Sterling Projects GmbH", website: "https://www.sterlingprojects.de", location: "Munich, Germany", logoUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=200&auto=format&fit=crop" },
    { name: "Qatar Gas Logistics", website: "https://www.qatargas.com", location: "Doha, Qatar", logoUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&auto=format&fit=crop" }
  ];
  const companyMap: Record<string, any> = {};
  for (const c of companies) {
    const created = await prisma.company.create({ data: c });
    companyMap[c.name] = created;
  }

  console.log("Creating Users (Admin, Employers, Candidates)...");
  // 1 Admin
  const adminUser = await prisma.user.create({
    data: { email: "admin@ramainternational.in", passwordHash, role: "ADMIN" }
  });
  await prisma.adminProfile.create({
    data: { userId: adminUser.id, fullName: "Deepak Chauhan" }
  });

  // 2 Employers
  const empUser1 = await prisma.user.create({
    data: { email: "recruitment@almarai.com", passwordHash, role: "EMPLOYER" }
  });
  const empProfile1 = await prisma.employerProfile.create({
    data: {
      userId: empUser1.id,
      companyName: "Almarai Foods Group",
      industry: "Manufacturing",
      website: "https://www.almarai.com",
      contactPerson: "Dr. Khaled Al-Mutairi",
      phone: "+966 11 470 0000",
      address: "Riyadh, Saudi Arabia",
      isVerified: true,
      companyId: companyMap["Almarai Foods Group"].id
    }
  });

  const empUser2 = await prisma.user.create({
    data: { email: "hr@sterlingprojects.de", passwordHash, role: "EMPLOYER" }
  });
  const empProfile2 = await prisma.employerProfile.create({
    data: {
      userId: empUser2.id,
      companyName: "Sterling Projects GmbH",
      industry: "Construction",
      website: "https://www.sterlingprojects.de",
      contactPerson: "Marc Sterling",
      phone: "+49 89 231456",
      address: "Munich, Germany",
      isVerified: true,
      companyId: companyMap["Sterling Projects GmbH"].id
    }
  });

  // 10 Candidates
  const candidatesData = [
    { email: "rahul.sharma@gmail.com", fullName: "Rahul Sharma", phone: "+91 9876543210", passport: "Z1234567", skills: "Electrician, Maintenance, Industrial Wiring", exp: 5, edu: "ITI Diploma in Electrical", loc: "Delhi, India" },
    { email: "amit.kumar@gmail.com", fullName: "Amit Kumar", phone: "+91 9876543211", passport: "Z7654321", skills: "Scaffolding, Rigging, Construction Safety", exp: 4, edu: "Senior Secondary (12th)", loc: "Patna, India" },
    { email: "priya.nair@gmail.com", fullName: "Priya Nair", phone: "+91 9876543212", passport: "Y8765432", skills: "ICU Nursing, Patient Care, Medical Charting", exp: 3, edu: "B.Sc in Nursing", loc: "Kochi, India" },
    { email: "mohammad.ali@gmail.com", fullName: "Mohammad Ali", phone: "+91 9876543213", passport: "X9876543", skills: "TIG/MIG Welding, Structural Fabrication, Pipe Welding", exp: 6, edu: "ITI Certification in Welding", loc: "Lucknow, India" },
    { email: "vikram.singh@gmail.com", fullName: "Vikram Singh", phone: "+91 9876543214", passport: "W1234567", skills: "Heavy Truck Driving, GCC License, Cargo Transport", exp: 7, edu: "High School (10th)", loc: "Chandigarh, India" },
    { email: "sanjay.patel@gmail.com", fullName: "Sanjay Patel", phone: "+91 9876543215", passport: "V8765432", skills: "Civil Site Engineering, Autocad, Concrete Testing", exp: 5, edu: "B.Tech in Civil Engineering", loc: "Ahmedabad, India" },
    { email: "deepa.joseph@gmail.com", fullName: "Deepa Joseph", phone: "+91 9876543216", passport: "U1234567", skills: "Pediatric Nursing, Caregiving, Hospital Operations", exp: 4, edu: "GNM Diploma in Nursing", loc: "Kottayam, India" },
    { email: "arjun.rao@gmail.com", fullName: "Arjun Rao", phone: "+91 9876543217", passport: "T8765432", skills: "HVAC Technician, Chiller Maintenance, Airflow Controls", exp: 5, edu: "ITI Mechanical", loc: "Hyderabad, India" },
    { email: "rajesh.gupta@gmail.com", fullName: "Rajesh Gupta", phone: "+91 9876543218", passport: "S1234567", skills: "CNC Milling, Lathe Operator, Machine Maintenance", exp: 3, edu: "Diploma in Mechanical Engineering", loc: "Jaipur, India" },
    { email: "neha.reddy@gmail.com", fullName: "Neha Reddy", phone: "+91 9876543219", passport: "R8765432", skills: "Java, Spring Boot, PostgreSQL, Git", exp: 2, edu: "B.Tech in Computer Science", loc: "Bangalore, India" }
  ];

  const candidateProfiles: any[] = [];
  for (const c of candidatesData) {
    const user = await prisma.user.create({
      data: { email: c.email, passwordHash, role: "CANDIDATE" }
    });
    const cp = await prisma.candidateProfile.create({
      data: {
        userId: user.id,
        fullName: c.fullName,
        phone: c.phone,
        passportNumber: c.passport,
        skills: c.skills,
        experienceYears: c.exp,
        education: c.edu,
        location: c.loc,
        status: "ACTIVE"
      }
    });
    candidateProfiles.push(cp);
  }

  console.log("Creating 25 Jobs...");
  const jobsData = [
    // Manufacturing / Almarai
    { title: "Senior Industrial Electrician", sector: "Manufacturing", country: "Saudi Arabia", salary: "SR 3,500 - 4,500", vac: 15, empId: empProfile1.id },
    { title: "Production Line Operator", sector: "Manufacturing", country: "Saudi Arabia", salary: "SR 2,200 - 2,800", vac: 30, empId: empProfile1.id },
    { title: "Quality Assurance Inspector", sector: "Manufacturing", country: "Saudi Arabia", salary: "SR 4,000 - 5,000", vac: 5, empId: empProfile1.id },
    { title: "Warehouse Team Leader", sector: "Logistics", country: "Saudi Arabia", salary: "SR 3,000 - 3,800", vac: 10, empId: empProfile1.id },
    { title: "Heavy Duty Forklift Driver", sector: "Logistics", country: "Saudi Arabia", salary: "SR 2,500 - 3,000", vac: 20, empId: empProfile1.id },
    { title: "HVAC Maintenance Engineer", sector: "Engineering", country: "Saudi Arabia", salary: "SR 5,500 - 7,000", vac: 4, empId: empProfile1.id },
    { title: "Boiler Plant Operator", sector: "Manufacturing", country: "Saudi Arabia", salary: "SR 3,200 - 4,000", vac: 6, empId: empProfile1.id },
    { title: "Maintenance Fitter", sector: "Manufacturing", country: "Saudi Arabia", salary: "SR 2,800 - 3,500", vac: 12, empId: empProfile1.id },

    // Construction / Sterling Projects
    { title: "Registered Staff Nurse (ICU)", sector: "Healthcare", country: "Germany", salary: "€3,200 - 4,000", vac: 8, empId: empProfile2.id },
    { title: "Civil Site Engineer", sector: "Construction", country: "Germany", salary: "€4,200 - 5,000", vac: 5, empId: empProfile2.id },
    { title: "Structural Welder (TIG/MIG)", sector: "Construction", country: "Poland", salary: "PLN 5,500 - 7,000", vac: 25, empId: empProfile2.id },
    { title: "Scaffolding Supervisor", sector: "Construction", country: "Romania", salary: "RON 4,500 - 5,500", vac: 12, empId: empProfile2.id },
    { title: "Concrete Finisher", sector: "Construction", country: "Croatia", salary: "€1,800 - 2,200", vac: 15, empId: empProfile2.id },
    { title: "Plumber & Pipefitter", sector: "Construction", country: "Malta", salary: "€1,600 - 2,000", vac: 20, empId: empProfile2.id },
    { title: "Electrical Wireman", sector: "Construction", country: "Germany", salary: "€2,500 - 3,200", vac: 18, empId: empProfile2.id },
    { title: "Project Manager (Civil)", sector: "Engineering", country: "Germany", salary: "€6,000 - 7,500", vac: 2, empId: empProfile2.id },
    
    // Middle East Oil & Gas
    { title: "Scaffolding Inspector", sector: "Oil & Gas", country: "Qatar", salary: "QAR 6,000 - 7,500", vac: 5, empId: empProfile2.id },
    { title: "Pipeline Welder (6G)", sector: "Oil & Gas", country: "UAE", salary: "AED 4,500 - 6,000", vac: 14, empId: empProfile2.id },
    { title: "Nondestructive Testing (NDT) Tech", sector: "Oil & Gas", country: "Kuwait", salary: "KWD 550 - 700", vac: 8, empId: empProfile1.id },
    { title: "Drilling Rig Safety Officer", sector: "Oil & Gas", country: "Oman", salary: "OMR 650 - 800", vac: 10, empId: empProfile1.id },
    { title: "Offshore Rigger", sector: "Marine Services", country: "Bahrain", salary: "BHD 350 - 450", vac: 22, empId: empProfile1.id },
    
    // Canada / Australia
    { title: "Heavy Machinery Mechanic", sector: "Engineering", country: "Canada", salary: "$32 - $40 / hr", vac: 6, empId: empProfile2.id },
    { title: "Registered Nurse (Aged Care)", sector: "Healthcare", country: "Australia", salary: "$38 - $46 / hr", vac: 10, empId: empProfile2.id },
    { title: "Software Engineer (Full Stack)", sector: "IT & Software", country: "Canada", salary: "$80,000 - $95,000 / yr", vac: 3, empId: empProfile2.id },
    { title: "Hospitality Duty Manager", sector: "Hospitality", country: "Australia", salary: "$55,000 - $65,000 / yr", vac: 4, empId: empProfile1.id }
  ];

  const jobs: any[] = [];
  for (const j of jobsData) {
    const job = await prisma.job.create({
      data: {
        title: j.title,
        description: `Exciting job opportunity for a ${j.title} based in ${j.country}. Join our world-class client offering highly competitive wages, career progression, and complete welfare perks. Apply today for immediate screening!`,
        requirements: "Candidate must possess 3+ years experience, relevant technical diploma/certifications, and positive safety attitude.",
        benefits: "Accommodation, transport, health insurance, and duty meals are provided as per local labor codes.",
        sector: j.sector,
        country: j.country,
        salaryRange: j.salary,
        vacancies: j.vac,
        employerId: j.empId,
        status: "OPEN"
      }
    });
    jobs.push(job);
  }

  console.log("Creating 10 Testimonials...");
  const testimonials = [
    { name: "Suresh Pillai", role: "Industrial Electrician", company: "Almarai Co.", content: "RAMA INTERNATIONAL-INDIA guided me through every step of my mobilization to Riyadh. Highly professional and MEA approved!", rating: 5 },
    { name: "Dr. Khaled Al-Mutairi", role: "HR Director", company: "Almarai Foods", content: "We sourced over 200 skilled operators from RAMA INTERNATIONAL-INDIA. Their pre-screening and trade testing is outstanding.", rating: 5 },
    { name: "Priya Nair", role: "ICU Staff Nurse", company: "Munich Clinical Group", content: "Relocating to Germany was a dream come true. The visa guidance and language coaching support were incredibly helpful.", rating: 5 },
    { name: "Marc Sterling", role: "Managing Director", company: "Sterling Projects GmbH", content: "Excellent partners for bulk European recruitment. Sourced highly dedicated vocational professionals for our Germany sites.", rating: 5 },
    { name: "Gurpreet Singh", role: "Rig Welder", company: "Qatar Gas Logistics", content: "The trade tests in Delhi were rigorous but fair. I've been with Qatar Gas for 3 years now. Kudos to Rama Team!", rating: 5 },
    { name: "John Miller", role: "Operations Lead", company: "Miller Construction Australia", content: "Prompt responses, structured recruitment, and transparent pricing. Sourced exceptional technical fitters.", rating: 5 },
    { name: "Amit Kumar", role: "Rigging Supervisor", company: "Sterling Projects", content: "Everything was transparent. I got my visa stamped on time, flight booked, and mobilized with no hassle.", rating: 5 },
    { name: "Yousef Al-Kuwari", role: "Supply Chain Manager", company: "Qatar Gas Logistics", content: "Sourced 100 truck drivers within short notice. Excellent work by RAMA INTERNATIONAL-INDIA.", rating: 5 },
    { name: "Manoj Dwivedi", role: "CNC Operator", company: "Apex Engineering", content: "Rama team helped me secure a high-paying mechanical job in Poland. Highly recommend this MEA agency.", rating: 5 },
    { name: "Sarah Connor", role: "Welfare Coordinator", company: "HealthCare Malta", content: "Highly reliable recruiters. The nurses provided were extremely competent and had excellent clinical training.", rating: 5 }
  ];
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  console.log("Creating Applications and Interviews...");
  // Create applications for first 5 candidates
  for (let i = 0; i < 5; i++) {
    const app = await prisma.application.create({
      data: {
        jobId: jobs[i].id,
        candidateId: candidateProfiles[i].id,
        status: i === 0 ? "VISA_STAGE" : i === 1 ? "SHORTLISTED" : i === 2 ? "INTERVIEW_SCHEDULED" : "APPLIED",
        visaStatus: i === 0 ? "DOCUMENT_VERIFICATION" : "NOT_STARTED",
        notes: "Candidate pre-screened and found highly qualified."
      }
    });

    if (i === 2) {
      // Schedule an interview
      await prisma.interview.create({
        data: {
          applicationId: app.id,
          title: "Technical Round - Almarai HR",
          scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
          location: "Microsoft Teams Link",
          notes: "Focus on industrial electrical schematics and troubleshooting.",
          status: "SCHEDULED"
        }
      });
    }

    // Add Saved Job
    await prisma.savedJob.create({
      data: {
        candidateId: candidateProfiles[i].id,
        jobId: jobs[i + 5].id
      }
    });

    // Create Candidate Document
    await prisma.document.create({
      data: {
        candidateId: candidateProfiles[i].id,
        type: "RESUME",
        fileUrl: "/uploads/resumes/dummy_cv.pdf",
        fileName: `${candidateProfiles[i].fullName}_CV.pdf`
      }
    });

    // Create Notification for User
    await prisma.notification.create({
      data: {
        userId: candidateProfiles[i].userId,
        title: "Application Received",
        message: `Your application for ${jobs[i].title} has been received successfully.`
      }
    });
  }

  console.log("Creating inquiries...");
  await prisma.inquiry.create({
    data: {
      name: "Marc Sterling",
      email: "m.sterling@sterlingconstruction.de",
      companyName: "Sterling Projects GmbH",
      phone: "+49 89 231456",
      message: "We need 50 skilled welders and 30 bricklayers for our new commercial site in Stuttgart. Please share your terms of business and trade testing capabilities in India.",
      status: "PENDING"
    }
  });

  console.log("Creating BlogPosts...");
  await prisma.blogPost.create({
    data: {
      title: "New GCC Visa Stamping Rules for Indian Workers in 2026",
      slug: "new-gcc-visa-stamping-rules-2026",
      summary: "An in-depth guide on the updated visa stamping guidelines, mandatory medical tests, and biometric requirements across Saudi Arabia, UAE, and Qatar.",
      content: "Unified Biometrics: Designating centers in India. GAMCA medical rules are now stricter. Trade skills must be verified at MEA accredited trade hubs like RAMA INTERNATIONAL-INDIA.",
      category: "Visa Update"
    }
  });

  console.log("Creating GalleryItems...");
  await prisma.galleryItem.create({
    data: {
      title: "Saudi Arabia Welder Trade Test - Delhi Center",
      imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop",
      category: "Trade Test"
    }
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
