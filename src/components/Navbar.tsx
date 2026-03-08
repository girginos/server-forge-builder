import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, Search, Phone, Mail, Server, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Anasayfa", href: "/" },
  { label: "Donanım", href: "/donanim" },
  { label: "Hazır Paketler", href: "/hazir-paketler" },
  { label: "Yapılandırıcı", href: "/yapilandirici" },
  { label: "Cloud", href: "/cloud" },
  { label: "Colocation", href: "/colocation" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { items } = useCart();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      {/* Top bar */}
      <div className="gradient-navy text-secondary-foreground text-xs">
        <div className="container flex items-center justify-between py-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> info@servermarket.com.tr</span>
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> +90 212 555 0000</span>
          </div>
          <span className="hidden sm:block">Kurumsal Sunucu Çözümleri</span>
        </div>
      </div>

      {/* Main nav */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Server className="h-7 w-7 text-primary" />
            <span className="text-foreground">Server<span className="text-gradient">Market</span></span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? "text-primary bg-primary/5"
                    : "text-foreground hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/giris">
              <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1.5 text-sm">
                <User className="h-4 w-4" />
                Giriş Yap
              </Button>
              <Button variant="ghost" size="icon" className="sm:hidden">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/sepet" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t bg-card animate-fade-in">
            <nav className="container flex flex-col py-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === link.href
                      ? "text-primary bg-primary/5"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
