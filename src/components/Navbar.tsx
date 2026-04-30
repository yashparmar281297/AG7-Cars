import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Shield, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import logo from "../assets/logo.jpg";


const links = [
  { to: "/", label: "Home" },
  { to: "/collection", label: "Collection" },
  { to: "/deliveries", label: "Deliveries" },
  { to: "/about", label: "About" },
];

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      {/* Top crimson strip */}
      <div className="h-0.5 w-full bg-gradient-crimson" />
      <nav className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-9 h-9 carbon-surface border border-primary/40 flex items-center justify-center">
            <span className="flex items-center"><img src={logo} alt="V logo" className="h-5 w-auto" /></span>
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full animate-pulse-glow" />
          </div>
          <div className="leading-none">
            <div className="font-display font-black text-lg tracking-[0.2em]">AG7 Cars</div>
            {/* <div className="font-mono text-[9px] text-muted-foreground tracking-[0.3em]">SUPREMA</div> */}
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative font-display text-sm tracking-widest uppercase transition-smooth",
                  isActive ? "text-primary" : "text-foreground/70 hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-px bg-primary shadow-crimson" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {isAdmin && (
                <button
                  onClick={() => navigate("/admin")}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-crimson text-primary-foreground font-display font-bold tracking-widest uppercase text-xs shadow-crimson hover:opacity-90 transition-smooth"
                  style={{ clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}
                >
                  <Shield className="w-4 h-4" /> Admin Console
                </button>
              )}
              <button
                onClick={signOut}
                className="p-2 border border-border hover:border-primary transition-smooth"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link to="/auth" className="crimson-tag hover:opacity-90 transition-smooth">
              <Shield className="w-3 h-3" /> Admin Login
            </Link>
          )}
        </div>

        <button
          className="md:hidden p-2 border border-border"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border carbon-surface-deep">
          <div className="container py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="font-display tracking-widest uppercase text-sm py-2"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="crimson-tag w-fit">
                    <Shield className="w-3 h-3" /> Admin
                  </Link>
                )}
                <button onClick={signOut} className="text-left text-sm font-mono uppercase">
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="crimson-tag w-fit">
                <Shield className="w-3 h-3" /> Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
