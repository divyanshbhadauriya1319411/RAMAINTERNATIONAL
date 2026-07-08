import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Users,
  Briefcase,
  Globe,
  Award,
  TrendingUp,
  Activity,
  ShieldCheck,
  Landmark,
  Plane,
  Heart,
  Hammer,
  Truck,
  ArrowRight,
} from "lucide-react";

const SERVICES_LIST = [
  {
    slug: "permanent-recruitment",
    title: "Permanent Recruitment",
    desc: "Long-term staffing solutions connecting your organization with high-caliber Indian professionals.",
    icon: Users,
  },
  {
    slug: "temporary-staffing",
    title: "Temporary Staffing",
    desc: "Flexible, short-term personnel solutions to handle sudden workloads and project expansions.",
    icon: Activity,
  },
  {
    slug: "executive-search",
    title: "Executive Search",
    desc: "C-suite and senior leadership headhunting for critical healthcare, engineering, and energy boards.",
    icon: Award,
  },
  {
    slug: "bulk-hiring",
    title: "Bulk Hiring",
    desc: "Large-scale mobilization campaigns for heavy industries, including testing and stamping.",
    icon: TrendingUp,
  },
  {
    slug: "international-recruitment",
    title: "International Recruitment",
    desc: "Bridging the gap between domestic Indian skills and global corporations.",
    icon: Globe,
  },
  {
    slug: "overseas-placement",
    title: "Overseas Placement",
    desc: "Guiding Indian candidates through overseas deployments, medical checks, and visa gates.",
    icon: Plane,
  },
  {
    slug: "payroll-management",
    title: "Payroll Management",
    desc: "Streamlined salary distribution, compliance checks, and welfare management for mobilizations.",
    icon: Landmark,
  },
  {
    slug: "hr-consultancy",
    title: "HR Consultancy",
    desc: "Advising global partners on salary benchmarking, MEA clearances, and labor compliance.",
    icon: ShieldCheck,
  },
  {
    slug: "contract-staffing",
    title: "Contract Staffing",
    desc: "Structured contractor supply pipelines with defined periods and output verification.",
    icon: Briefcase,
  },
  {
    slug: "blue-collar-hiring",
    title: "Blue Collar Hiring",
    desc: "Sourcing certified welders, electrical techs, riggers, and pipe fitters.",
    icon: Hammer,
  },
  {
    slug: "white-collar-hiring",
    title: "White Collar Hiring",
    desc: "Sourcing clinicians, designers, estimators, accounting boards, and tech coordinators.",
    icon: Heart,
  },
  {
    slug: "skilled-labour-supply",
    title: "Skilled Labour Supply",
    desc: "Sourcing highly-qualified technicians backed by rigorous physical trade testing grades.",
    icon: Truck,
  },
];

export default function ServicesDirectoryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-luxury-light">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-navy-900 text-white py-20 text-center border-b border-gold-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_65%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-4">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gold-500 tracking-wider">
            Our Recruitment Services
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-light max-w-xl mx-auto uppercase tracking-widest">
            Complete Talent solutions from sourcing to visa stamping
          </p>
        </div>
      </section>

      {/* Directory Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_LIST.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.slug}
                className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between h-72 group"
              >
                <div className="space-y-4">
                  <div className="h-10 w-10 bg-navy-900 text-gold-500 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">{svc.desc}</p>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <Link
                    href={`/services/${svc.slug}`}
                    className="text-xs font-bold text-gold-600 uppercase tracking-widest flex items-center space-x-1 hover:underline"
                  >
                    <span>Read Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
