import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Package,
  HeadphonesIcon,
  LogOut,
  FileText,
  Activity,
  Shield,
  ShoppingCart,
} from "lucide-react";
import SEO from "@/components/SEO";
import ProfileTab from "@/components/dashboard/ProfileTab";
import OrdersTab from "@/components/dashboard/OrdersTab";
import SupportTab from "@/components/dashboard/SupportTab";
import InvoicesTab from "@/components/dashboard/InvoicesTab";
import ActivityTab from "@/components/dashboard/ActivityTab";
import SecurityTab from "@/components/dashboard/SecurityTab";

const tabs = [
  { value: "profile", label: "Profil", icon: User },
  { value: "orders", label: "Siparişler", icon: Package },
  { value: "support", label: "Destek", icon: HeadphonesIcon },
  { value: "invoices", label: "Faturalar", icon: FileText },
  { value: "activity", label: "Aktivite", icon: Activity },
  { value: "security", label: "Güvenlik", icon: Shield },
];

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [stats, setStats] = useState({ orders: 0, tickets: 0 });

  const activeTab = searchParams.get("tab") || "profile";

  useEffect(() => {
    if (!loading && !user) navigate("/giris", { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("support_tickets").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    ]).then(([o, t]) => {
      setStats({ orders: o.count ?? 0, tickets: t.count ?? 0 });
    });
  }, [user]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center">Yükleniyor...</div>;
  if (!user) return null;

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <>
      <SEO title="Müşteri Paneli | ServerMarket" description="Siparişlerinizi takip edin, profilinizi yönetin." />

      {/* Header */}
      <div className="gradient-navy text-white">
        <div className="container py-8 max-w-6xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold shadow-glow">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h1 className="text-2xl font-bold">Müşteri Paneli</h1>
                <p className="text-sm text-white/60">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <ShoppingCart className="h-4 w-4 text-accent" />
                  <span className="font-medium">{stats.orders}</span>
                  <span className="text-white/50">sipariş</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HeadphonesIcon className="h-4 w-4 text-accent" />
                  <span className="font-medium">{stats.tickets}</span>
                  <span className="text-white/50">talep</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10" onClick={() => { signOut(); navigate("/"); }}>
                <LogOut className="h-4 w-4 mr-2" /> Çıkış
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-6 max-w-6xl">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="h-auto p-1 bg-muted/50 w-full sm:w-auto flex gap-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="gap-2 px-4 py-2.5 text-xs sm:text-sm data-[state=active]:shadow-sm"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="mt-6">
            <TabsContent value="profile"><ProfileTab userId={user.id} /></TabsContent>
            <TabsContent value="orders"><OrdersTab userId={user.id} /></TabsContent>
            <TabsContent value="support"><SupportTab userId={user.id} /></TabsContent>
            <TabsContent value="invoices"><InvoicesTab userId={user.id} /></TabsContent>
            <TabsContent value="activity"><ActivityTab userId={user.id} /></TabsContent>
            <TabsContent value="security"><SecurityTab userId={user.id} email={user.email || ""} /></TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
}
