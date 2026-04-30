import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrationssupabase/client";
import { toast } from "sonner";
import { Shield, Lock, Mail, Loader2 } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Real Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error("Invalid email or password.");
        return;
      }

      // Check if this user has admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        await supabase.auth.signOut();
        toast.error("You are not an admin.");
        return;
      }

      toast.success("Welcome, Admin.");
      navigate("/admin", { replace: true });
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center container">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-6">
          <div className="font-display font-black text-3xl tracking-[0.2em] text-glow">AG7 Cars</div>
          {/* <div className="font-mono text-[10px] text-muted-foreground tracking-[0.3em]">SUPREMA</div> */}
        </Link>

        <div className="carbon-surface border border-border p-8 corner-brackets">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <div>
              <div className="font-display font-bold tracking-widest">ADMIN PORTAL</div>
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">RESTRICTED ACCESS</div>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Email</label>
              <div className="mt-1 flex items-center gap-2 carbon-surface-deep border border-border focus-within:border-primary px-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent py-3 outline-none font-mono text-sm"
                  placeholder="admin@velocita.in"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Password</label>
              <div className="mt-1 flex items-center gap-2 carbon-surface-deep border border-border focus-within:border-primary px-3">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent py-3 outline-none font-mono text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-crimson font-display font-bold tracking-widest uppercase text-sm shadow-crimson disabled:opacity-50"
              style={{ clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)" }}
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              ACCESS PORTAL
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-[10px] font-mono text-muted-foreground text-center leading-relaxed">
            New accounts have no admin role by default. To grant admin, insert a row into{" "}
            <span className="text-primary">user_roles</span> via the Cloud database.
          </div>
        </div>
      </div>
    </div>
  );
}
