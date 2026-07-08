import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { User, Landmark, Award, ShieldAlert, CheckCircle, Mail, MapPin } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Page Header */}
      <section className="bg-navy-900 text-white py-20 text-center relative overflow-hidden border-b-2 border-gold-500">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-4">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gold-500 tracking-wider">
            About RAMA INTERNATIONAL
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-light max-w-xl mx-auto uppercase tracking-widest">
            India's Most Trusted Global Manpower Consultant Since 2018
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
        {/* Founder & Vision */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-gold-500/10 border border-gold-500/30 px-3 py-1 rounded text-gold-500 text-xs font-semibold uppercase tracking-wider">
              Leadership Message
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-navy-900 leading-tight">
              Leading the Way in Global Talent Mobilization
            </h2>
            <div className="w-12 h-1 bg-gold-500" />
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              Founded in 2018 by **Deepak Chauhan**, RAMA INTERNATIONAL-INDIA was established with a singular mission: to streamline the international recruitment lifecycle and bridge the gap between Indian talent and premier overseas employers.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              Our unique value proposition lies in our tagline: **"From Interview to Visa."** Unlike traditional agencies that stop at selection, we coordinate every stage of trade testing, medical checks, biometric indexing, consulate stamping, travel booking, and local onboarding.
            </p>
            <div className="border-l-4 border-gold-500 pl-4 bg-luxury-light p-4 rounded-r-lg">
              <p className="text-xs text-navy-900 italic font-medium leading-relaxed">
                "Our commitment is to absolute transparency, compliance, and speed. We don't just fill job roles; we empower careers and catalyze development for global contracting leaders."
              </p>
              <p className="text-xs text-gold-600 font-bold mt-2 uppercase tracking-wide">— Deepak Chauhan, Founder & MD</p>
            </div>
          </div>

          {/* Profile Visual Card */}
          <div className="bg-navy-900 rounded-2xl border border-gold-500/25 p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl" />
            
            <h3 className="font-serif text-lg font-bold text-gold-500 mb-6 tracking-wide">Key Corporate Milestones</h3>
            <div className="space-y-6 text-xs font-light">
              <div className="flex items-start space-x-3.5">
                <div className="h-7 w-7 rounded bg-navy-800 border border-gold-500/20 flex items-center justify-center text-gold-500 shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-gray-200 text-sm">2018 - Inception</h4>
                  <p className="text-gray-400 mt-1">Established headquarters in New Delhi. Obtained recruitment authorization license from the Ministry of External Affairs.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3.5">
                <div className="h-7 w-7 rounded bg-navy-800 border border-gold-500/20 flex items-center justify-center text-gold-500 shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-gray-200 text-sm">2020 - Trade Hub Expansion</h4>
                  <p className="text-gray-400 mt-1">Built state-of-the-art trade testing yards in Delhi and Mumbai for heavy fabrication, industrial electrical, and HVAC assessments.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3.5">
                <div className="h-7 w-7 rounded bg-navy-800 border border-gold-500/20 flex items-center justify-center text-gold-500 shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-gray-200 text-sm">2023 - 5,000+ Placements</h4>
                  <p className="text-gray-400 mt-1">Surpassed 5,000 active candidate mobilizations across UAE, Saudi Arabia, Oman, Germany, and Singapore.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Corporate Values */}
        <section className="bg-luxury-light rounded-2xl border border-gray-150 p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="font-serif text-2xl font-bold text-navy-900">Our Operational Pillars</h2>
            <div className="w-8 h-0.5 bg-gold-500 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-xs">
            <div className="bg-white border border-gray-200 p-6 rounded-xl space-y-3 shadow-sm">
              <Landmark className="h-8 w-8 text-gold-500 mx-auto" />
              <h3 className="font-bold text-sm text-navy-900">Legal Compliance</h3>
              <p className="text-gray-500 leading-relaxed font-light">Adhering 100% to eMigrate rules, Ministry guidelines, and local destination labor laws.</p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-xl space-y-3 shadow-sm">
              <Award className="h-8 w-8 text-gold-500 mx-auto" />
              <h3 className="font-bold text-sm text-navy-900">Quality Screening</h3>
              <p className="text-gray-500 leading-relaxed font-light">Rejecting shortcuts. Every worker undergoes strict practical evaluation before travel submission.</p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-xl space-y-3 shadow-sm">
              <User className="h-8 w-8 text-gold-500 mx-auto" />
              <h3 className="font-bold text-sm text-navy-900">Welfare & Support</h3>
              <p className="text-gray-500 leading-relaxed font-light">Conducting pre-departure briefings and housing audits to guarantee fair candidate treatment overseas.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
