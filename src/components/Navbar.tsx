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
                <div
                  key={link.label}
                  className="relative"
                  ref={dropdownRef}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActiveChild(link.children)
                        ? "text-primary bg-primary/5"
                        : "text-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                      <div className="w-96 rounded-2xl border border-border/60 bg-popover text-popover-foreground shadow-2xl shadow-black/10 p-1.5 animate-fade-in backdrop-blur-sm">
                        <div className="px-3 pt-2 pb-1.5 mb-1">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Datacenter Hizmetleri</p>
                        </div>
                        {link.children!.map((child, idx) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            onClick={() => setDropdownOpen(false)}
                            className={`flex items-center gap-3.5 rounded-xl px-3 py-3 transition-all duration-150 group ${
                              location.pathname === child.href
                                ? "bg-primary/8"
                                : "hover:bg-muted/60"
                            }`}
                          >
                            <span className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150 ${
                              location.pathname === child.href
                                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                            }`}>
                              {child.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-semibold leading-none mb-1 ${
                                location.pathname === child.href ? "text-primary" : "text-foreground"
                              }`}>{child.label}</p>
                              <p className="text-xs text-muted-foreground leading-snug">{child.description}</p>
                            </div>
                            <ChevronDown className={`h-3.5 w-3.5 -rotate-90 text-muted-foreground/40 group-hover:text-primary/60 transition-colors shrink-0`} />
                          </Link>
                        ))}
                      </div>
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
                      <div className="ml-2 flex flex-col gap-1 mt-1 border-l-2 border-primary/20 pl-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            onClick={() => { setMobileOpen(false); setMobileDropdownOpen(false); }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm ${
                              location.pathname === child.href
                                ? "text-primary bg-primary/5"
                                : "text-foreground hover:text-primary"
                            }`}
                          >
                            <span className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-lg ${
                              location.pathname === child.href ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                            }`}>
                              {child.icon}
                            </span>
                            <div>
                              <p className="font-medium leading-none mb-0.5">{child.label}</p>
                              <p className="text-[11px] text-muted-foreground">{child.description}</p>
                            </div>
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
