import { Link } from "react-router-dom"; 
import { Instagram, Youtube, Facebook, Twitter } from "lucide-react";
export function Footer() {  
  return (
    <footer className="mt-24 border-t border-border carbon-surface-deep">
      <div className="container py-12 grid md:grid-cols-5 gap-10">
        <div>
          <div className="font-display font-black text-2xl tracking-[0.2em] text-glow">AG7 Cars</div>
          {/* <div className="font-mono text-[10px] text-muted-foreground tracking-[0.3em] mt-1">SUPREMA</div> */}
          <p className="text-sm text-muted-foreground mt-4 max-w-xs">
            India's curated marketplace for the world's most exceptional pre-owned & new supercar and luxury machines.
          </p>
        </div>
        <div>
          <div className="font-display text-sm tracking-widest uppercase text-primary mb-4">Showroom</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Indore</li>
            <li>+91 72477 77724</li>
            <li>AG7Cars@gmail.com</li>
          </ul>
        </div>
        <div>
          
          <div className="font-display text-sm tracking-widest uppercase text-primary mb-4">Discover</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <ul className="space-y-2 text-sm text-muted-foreground">
  <li>
    <Link to="/collection?body=hypercar">Supercar</Link>
  </li>
  <li>
    <Link to="/collection?body=convertible">Convertibles</Link>
  </li>
  <li>
    <Link to="/collection?body=sedan">Sedans</Link>
  </li>
  <li>
    <Link to="/collection?fuel=electric">Electric</Link>
  </li>
</ul>



          </ul>
        </div>
        <div>
          <div className="font-display text-sm tracking-widest uppercase text-primary mb-4">Hours</div>
          <ul className="space-y-2 text-sm text-muted-foreground font-mono">
            <li>MON — SAT · 10:00 — 20:00</li>
            <li>SUN · By Appointment</li>
          </ul>
        </div>

        <div>
  <div className="font-display text-sm tracking-widest uppercase text-primary mb-4">
    Social
  </div>

  <ul className="space-y-2 text-sm text-muted-foreground">
    <li>
      <a href="https://www.instagram.com/ag7carsofficial?igsh=ZWN3dWlnenRvYjZh" target="_blank" className="hover:text-primary transition">
        Instagram
      </a>
    </li>
  </ul>
</div>
      </div>
      
      <div className="border-t border-border">
        <div className="container py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs font-mono text-muted-foreground">
          <div>© {new Date().getFullYear()} AG7 Cars · ALL RIGHTS RESERVED</div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-status-available animate-pulse" />
            <span>SYSTEM ONLINE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
