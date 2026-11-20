import { useState } from "react";
import { useCrmAuth } from "@/lib/crm/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, Building2, UserCheck, AlertCircle } from "lucide-react";

export function LoginScreen() {
  const { signIn } = useCrmAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    const res = await signIn(email, password);
    setIsSubmitting(false);

    if (!res.success) {
      setError(res.error || "Authentication failed. Check your credentials.");
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setError(null);
    setIsSubmitting(true);
    await signIn(demoEmail, demoPass);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#087BEA] text-white shadow-lg shadow-[#087BEA]/25 mb-4">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#092B55]">DMA Agency CRM</h1>
          <p className="text-sm text-slate-500 mt-1">Driving Digital Growth. Delivering Real Results.</p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#087BEA] border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5" /> Internal Agency Portal
          </div>
        </div>

        {/* Login Form Container */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-7 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#092B55]">Sign in to your account</h2>
            <p className="text-xs text-slate-500 mt-0.5">Enter your agency credentials to access client records.</p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">Business Email</Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="email"
                  placeholder="admin@dma.agency"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 bg-slate-50/50 border-slate-200 focus:bg-white text-sm rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-slate-700">Password</Label>
                <button
                  type="button"
                  onClick={() => setError("Password reset is managed via Supabase Auth dashboard.")}
                  className="text-xs text-[#087BEA] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-10 bg-slate-50/50 border-slate-200 focus:bg-white text-sm rounded-xl"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[#087BEA] hover:bg-[#087BEA]/90 text-white font-medium rounded-xl shadow-md shadow-[#087BEA]/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? "Authenticating..." : "Sign In to CRM"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Quick Demo Sign-in Helper for Agency Staff */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5 text-center flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#087BEA]" /> Quick Demo Logins
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@dma.agency", "admin123")}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 text-[#092B55] text-xs font-semibold transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#087BEA]" />
                Admin (Full Access)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("team@dma.agency", "team123")}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[#092B55] text-xs font-semibold transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                Team Member
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Digital Marketing Agency • Internal CRM Portal • Connected to Supabase
        </p>
      </div>
    </div>
  );
}
