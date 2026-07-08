"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, KeyRound, User, Landmark, ShieldCheck, ArrowRight, RefreshCw, UserCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"CANDIDATE" | "EMPLOYER">("CANDIDATE");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (role === "CANDIDATE" && !fullName) || (role === "EMPLOYER" && !companyName)) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role,
          fullName: role === "CANDIDATE" ? fullName : undefined,
          companyName: role === "EMPLOYER" ? companyName : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setEmail("");
        setPassword("");
        setFullName("");
        setCompanyName("");
      } else {
        setError(data.error || "Failed to register.");
      }
    } catch (e) {
      setError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-luxury-light">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md w-full shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-serif text-2xl font-bold text-navy-900 tracking-wide">Create Rama Account</h1>
            <p className="text-xs text-gray-500 font-light font-sans">
              Choose your profile type to register for the platform.
            </p>
          </div>

          {/* Toggle Role Selector */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-luxury-light border border-gray-200 rounded-lg text-xs font-semibold uppercase tracking-wider text-navy-900">
            <button
              onClick={() => {
                setRole("CANDIDATE");
                setError("");
              }}
              className={`py-2.5 rounded-md text-center transition-colors cursor-pointer ${
                role === "CANDIDATE" ? "bg-navy-900 text-gold-500 shadow-sm" : "hover:text-gold-600"
              }`}
            >
              Candidate
            </button>
            <button
              onClick={() => {
                setRole("EMPLOYER");
                setError("");
              }}
              className={`py-2.5 rounded-md text-center transition-colors cursor-pointer ${
                role === "EMPLOYER" ? "bg-navy-900 text-gold-500 shadow-sm" : "hover:text-gold-600"
              }`}
            >
              Employer
            </button>
          </div>

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs flex items-start space-x-2">
              <ShieldCheck className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Account created successfully!</p>
                <p className="mt-1 font-light">You can now proceed to login to access your portal.</p>
                <Link
                  href="/login"
                  className="mt-3 inline-flex items-center space-x-1 text-gold-600 font-bold hover:underline uppercase tracking-wider"
                >
                  <span>Go to Login</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
              {error}
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-navy-900 font-medium">
              {role === "CANDIDATE" ? (
                <div>
                  <label className="block text-gray-500 font-semibold mb-1">Full Candidate Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-luxury-light border border-gray-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-gold-500 transition-colors"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-gray-500 font-semibold mb-1">Company / Group Name *</label>
                  <div className="relative">
                    <Landmark className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Almarai Foods Group"
                      className="w-full bg-luxury-light border border-gray-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-gold-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-gray-500 font-semibold mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@domain.com"
                    className="w-full bg-luxury-light border border-gray-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-500 font-semibold mb-1">Password *</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full bg-luxury-light border border-gray-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold uppercase tracking-wider py-4 rounded-lg flex items-center justify-center space-x-2 text-xs shadow-lg hover:shadow-gold-500/10 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <>
                    <UserCheck className="h-4 w-4" />
                    <span>Create Profile</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center text-[11px] text-gray-500 pt-4 border-t border-gray-150">
            <span>Already have an account? </span>
            <Link href="/login" className="text-gold-600 hover:underline font-semibold inline-flex items-center">
              <span>Login here</span>
              <ArrowRight className="h-3 w-3 ml-0.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
