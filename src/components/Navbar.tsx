import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, Search, Phone, Mail, Server, User, LayoutDashboard, ChevronDown, Cloud, Building2, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";

interface NavChild {
  label: string;
  href: string;
  description: string;
  icon: React.ReactNode;
}

interface NavItem {
  label: string;
  href?: string;
  children?: NavChild[];
}

const datacenterChildren: NavChild[] = [
  { label: "Cloud", href: "/cloud", description: "Bulut sunucu ve altyapı hizmetleri", icon: <Cloud className="h-5 w-5" /> },
  { label: "Leasing", href: "/leasing", description: "Esnek ödeme ile sunucu kiralama", icon: <Monitor className="h-5 w-5" /> },
  { label: "Colocation", href: "/colocation", description: "Veri merkezinde sunucu barındırma", icon: <Building2 className="h-5 w-5" /> },
];

const navLinks: NavItem[] = [
  { label: "Anasayfa", href: "/" },
  { label: "Donanım", href: "/hardware" },
  { label: "Hazır Paketler", href: "/hazir-paketler" },
  { label: "Yapılandırıcı", href: "/yapilandirici" },
  { label: "Datacenter", children: datacenterChildren },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const location = useLocation();
  const { items } = useCart();
  const { user } = useAuth();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isActiveChild = (children?: { href: string }[]) =>
    children?.some((c) => location.pathname === c.href);

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
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActiveChild(link.children)
                        ? "text-primary bg-primary/5"
                        : "text-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-44 rounded-lg border bg-card shadow-lg py-1 animate-fade-in z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          onClick={() => setDropdownOpen(false)}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            location.pathname === child.href
                              ? "text-primary bg-primary/5"
                              : "text-foreground hover:text-primary hover:bg-primary/5"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  to={link.href!}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.href
                      ? "text-primary bg-primary/5"
                      : "text-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link to={user ? "/panel" : "/giris"}>
              <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1.5 text-sm">
                {user ? <LayoutDashboard className="h-4 w-4" /> : <User className="h-4 w-4" />}
                {user ? "Panel" : "Müşteri Paneli"}
              </Button>
              <Button variant="ghost" size="icon" className="sm:hidden">
                {user ? <LayoutDashboard className="h-5 w-5" /> : <User className="h-5 w-5" />}
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
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <button
                      onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${
                        isActiveChild(link.children)
                          ? "text-primary bg-primary/5"
                          : "text-foreground hover:text-primary"
                      }`}
                    >
                      {link.label}
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mobileDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    {mobileDropdownOpen && (
                      <div className="ml-4 flex flex-col gap-1 mt-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            onClick={() => { setMobileOpen(false); setMobileDropdownOpen(false); }}
                            className={`px-3 py-2 rounded-md text-sm ${
                              location.pathname === child.href
                                ? "text-primary bg-primary/5"
                                : "text-foreground hover:text-primary"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href!}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === link.href
                        ? "text-primary bg-primary/5"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
