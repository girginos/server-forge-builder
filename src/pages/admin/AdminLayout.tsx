import { useEffect } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useAuth } from "@/hooks/useAuth";
import SEO from "@/components/SEO";
import { cn } from "@/lib/utils";
import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  HeadphonesIcon,
  LogOut,
  Database,
  PanelLeft,
  Server,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Genel Bakış", path: "/admin", icon: LayoutDashboard },
  { label: "Ürünler", path: "/admin/urunler", icon: Package },
  { label: "Siparişler", path: "/admin/siparisler", icon: ShoppingCart },
  { label: "Kullanıcılar", path: "/admin/kullanicilar", icon: Users },
  { label: "Destek", path: "/admin/destek", icon: HeadphonesIcon },
  { label: "DB Araçları", path: "/admin/db", icon: Database },
];

function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-primary">
            <Server className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
                ServerMarket
              </span>
              <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50">
                Admin Panel
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-widest">
            Yönetim
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={item.label}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Siteye Dön">
              <Link to="/">
                <Home className="h-4 w-4" />
                <span>Siteye Dön</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Çıkış Yap"
              onClick={() => {
                signOut();
                navigate("/");
              }}
              className="text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Çıkış Yap</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function AdminHeader() {
  const location = useLocation();

  const getPageTitle = () => {
    const map: Record<string, string> = {
      "/admin": "Genel Bakış",
      "/admin/urunler": "Ürün Yönetimi",
      "/admin/siparisler": "Sipariş Yönetimi",
      "/admin/kullanicilar": "Kullanıcı Yönetimi",
      "/admin/destek": "Destek Talepleri",
      "/admin/db": "Veritabanı Araçları",
    };
    // Check for sub-routes like /admin/urunler/yeni
    if (location.pathname.startsWith("/admin/urunler/")) return "Ürün Editörü";
    return map[location.pathname] || "Admin Panel";
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background px-4">
      <SidebarTrigger className="text-sidebar-foreground/70 hover:text-sidebar-foreground" />
      <div className="flex-1">
        <h1 className="text-sm font-semibold text-sidebar-foreground tracking-tight">
          {getPageTitle()}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />
        <span className="text-xs text-sidebar-foreground/50 hidden sm:inline">Sistem Aktif</span>
      </div>
    </header>
  );
}

export default function AdminLayout() {
  const { isAdmin, loading } = useAdminCheck();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/giris", { replace: true });
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="admin-theme min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent animate-pulse" />
          <p className="text-sm text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <>
      <SEO title="Admin Panel | ServerMarket" description="ServerMarket admin yönetim paneli." />
      <SidebarProvider>
        <div className="admin-theme min-h-screen flex w-full bg-background">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AdminHeader />
            <main className="flex-1 p-6 overflow-auto">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
