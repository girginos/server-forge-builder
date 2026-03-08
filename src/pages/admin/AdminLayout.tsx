import { useEffect } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, Users, ShoppingCart, HeadphonesIcon, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import SEO from "@/components/SEO";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Genel Bakış", path: "/admin", icon: LayoutDashboard },
  { label: "Ürünler", path: "/admin/urunler", icon: Package },
  { label: "Siparişler", path: "/admin/siparisler", icon: ShoppingCart },
  { label: "Kullanıcılar", path: "/admin/kullanicilar", icon: Users },
  { label: "Destek", path: "/admin/destek", icon: HeadphonesIcon },
];

export default function AdminLayout() {
  const { isAdmin, loading } = useAdminCheck();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/giris", { replace: true });
  }, [isAdmin, loading, navigate]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center">Yükleniyor...</div>;
  if (!isAdmin) return null;

  return (
    <>
      <SEO title="Admin Panel | ServerMarket" description="ServerMarket admin yönetim paneli." />
      <div className="container py-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <Button variant="outline" size="sm" onClick={() => { signOut(); navigate("/"); }}>
            <LogOut className="h-4 w-4 mr-2" /> Çıkış
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <nav className="md:w-52 flex md:flex-col gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
