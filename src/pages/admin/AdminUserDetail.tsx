import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import TicketChat from "@/components/TicketChat";
import { useUnreadCounts } from "@/hooks/useUnreadCounts";
import {
  ArrowLeft, User, Package, HeadphonesIcon, FileText, Activity,
  Shield, Save, ShoppingCart, MessageSquare, Clock, Loader2,
  Building2, MapPin, ChevronDown, ChevronUp,
} from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  company: string | null;
  tax_office: string | null;
  tax_number: string | null;
  address: string | null;
  city: string | null;
  created_at: string;
  updated_at: string;
}

interface Order {
  id: string;
  items: any;
  total_amount: number;
  status: string;
  notes: string | null;
  created_at: string;
}

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const tabs = [
  { value: "profile", label: "Profil", icon: User },
  { value: "orders", label: "Siparişler", icon: Package },
  { value: "tickets", label: "Destek", icon: HeadphonesIcon },
  { value: "invoices", label: "Faturalar", icon: FileText },
  { value: "activity", label: "Aktivite", icon: Activity },
];

export default function AdminUserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!userId) return;
    supabase.from("profiles").select("*").eq("id", userId).single().then(({ data, error }) => {
      if (error || !data) {
        toast({ title: "Kullanıcı bulunamadı", variant: "destructive" });
        navigate("/admin/kullanicilar");
        return;
      }
      setProfile(data as unknown as Profile);
      setLoading(false);
    });
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/kullanicilar")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3 flex-1">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-lg font-bold">
            {(profile.full_name || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold">{profile.full_name || "İsimsiz Kullanıcı"}</h1>
            <p className="text-sm text-muted-foreground">
              {profile.company || "Bireysel"} • Kayıt: {new Date(profile.created_at).toLocaleDateString("tr-TR")}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="h-auto p-1 bg-muted/50 w-full sm:w-auto flex gap-1">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-2 px-3 py-2 text-xs sm:text-sm">
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="mt-6">
          <TabsContent value="profile">
            <UserProfileSection profile={profile} setProfile={setProfile} />
          </TabsContent>
          <TabsContent value="orders">
            <UserOrdersSection userId={profile.id} />
          </TabsContent>
          <TabsContent value="tickets">
            <UserTicketsSection userId={profile.id} />
          </TabsContent>
          <TabsContent value="invoices">
            <UserInvoicesSection userId={profile.id} />
          </TabsContent>
          <TabsContent value="activity">
            <UserActivitySection userId={profile.id} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

/* ── Profile ── */
function UserProfileSection({ profile, setProfile }: { profile: Profile; setProfile: (p: Profile) => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name,
      phone: profile.phone,
      company: profile.company,
      tax_office: profile.tax_office,
      tax_number: profile.tax_number,
      address: profile.address,
      city: profile.city,
      updated_at: new Date().toISOString(),
    } as any).eq("id", profile.id);
    setIsSaving(false);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else toast({ title: "Kaydedildi" });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><User className="h-4 w-4 text-primary" /> Kişisel Bilgiler</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Ad Soyad</Label>
            <Input value={profile.full_name || ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Telefon</Label>
            <Input value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Building2 className="h-4 w-4 text-primary" /> Şirket & Fatura</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Şirket Adı</Label>
            <Input value={profile.company || ""} onChange={(e) => setProfile({ ...profile, company: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Vergi Dairesi</Label>
            <Input value={profile.tax_office || ""} onChange={(e) => setProfile({ ...profile, tax_office: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Vergi Numarası</Label>
            <Input value={profile.tax_number || ""} onChange={(e) => setProfile({ ...profile, tax_number: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><MapPin className="h-4 w-4 text-primary" /> Adres</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Şehir</Label>
            <Input value={profile.city || ""} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Adres</Label>
            <Textarea value={profile.address || ""} onChange={(e) => setProfile({ ...profile, address: e.target.value })} rows={3} />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSaving}>
        <Save className="h-4 w-4 mr-2" /> {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
      </Button>
    </form>
  );
}

/* ── Orders ── */
function UserOrdersSection({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false }).then(({ data }) => {
      setOrders((data as unknown as Order[]) || []);
      setLoading(false);
    });
  }, [userId]);

  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    pending: { label: "Beklemede", variant: "secondary" },
    processing: { label: "İşleniyor", variant: "default" },
    shipped: { label: "Kargoda", variant: "outline" },
    delivered: { label: "Teslim Edildi", variant: "default" },
    cancelled: { label: "İptal", variant: "destructive" },
  };

  if (loading) return <p className="text-muted-foreground">Yükleniyor...</p>;

  if (orders.length === 0) {
    return (
      <Card><CardContent className="py-12 text-center">
        <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
        <p className="text-muted-foreground">Bu kullanıcının siparişi bulunmamaktadır.</p>
      </CardContent></Card>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{orders.length} sipariş</p>
      {orders.map((order) => {
        const status = statusMap[order.status] || { label: order.status, variant: "secondary" as const };
        const isOpen = expanded === order.id;
        const items = Array.isArray(order.items) ? order.items : [];
        return (
          <Card key={order.id}>
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setExpanded(isOpen ? null : order.id)}>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString("tr-TR")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={status.variant}>{status.label}</Badge>
                <span className="font-semibold text-sm">{order.total_amount.toLocaleString("tr-TR")} ₺</span>
                {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </div>
            </div>
            {isOpen && (
              <div className="border-t px-4 pb-4 pt-3 bg-muted/20">
                {items.length > 0 ? (
                  <Table>
                    <TableHeader><TableRow><TableHead>Ürün</TableHead><TableHead className="text-right">Adet</TableHead><TableHead className="text-right">Tutar</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {items.map((item: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell className="text-sm">{item.name || "Ürün"}</TableCell>
                          <TableCell className="text-right text-sm">{item.quantity || 1}</TableCell>
                          <TableCell className="text-right text-sm">{(item.price || 0).toLocaleString("tr-TR")} ₺</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : <p className="text-sm text-muted-foreground">Detay mevcut değil.</p>}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

/* ── Tickets ── */
function UserTicketsSection({ userId }: { userId: string }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatTicket, setChatTicket] = useState<Ticket | null>(null);
  const { user } = useAuth();
  const ticketIds = tickets.map((t) => t.id);
  const { counts: unreadCounts, markAsRead } = useUnreadCounts(ticketIds, user?.id);

  const openChat = (t: Ticket) => {
    setChatTicket(t);
    markAsRead(t.id);
  };

  useEffect(() => {
    supabase.from("support_tickets").select("*").eq("user_id", userId).order("created_at", { ascending: false }).then(({ data }) => {
      setTickets((data as unknown as Ticket[]) || []);
      setLoading(false);
    });
  }, [userId]);

  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
    open: { label: "Açık", variant: "default" },
    in_progress: { label: "İşlemde", variant: "outline" },
    closed: { label: "Kapalı", variant: "secondary" },
  };

  if (loading) return <p className="text-muted-foreground">Yükleniyor...</p>;

  if (tickets.length === 0) {
    return (
      <Card><CardContent className="py-12 text-center">
        <HeadphonesIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
        <p className="text-muted-foreground">Bu kullanıcının destek talebi bulunmamaktadır.</p>
      </CardContent></Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">{tickets.length} talep</p>
        {tickets.map((t) => {
          const status = statusMap[t.status] || { label: t.status, variant: "secondary" as const };
          return (
            <Card key={t.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setChatTicket(t)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-lg bg-accent/50 flex items-center justify-center mt-0.5">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{t.subject}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{t.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString("tr-TR")}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!chatTicket} onOpenChange={(open) => !open && setChatTicket(null)}>
        <DialogContent className="max-w-lg h-[70vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-3 border-b shrink-0">
            <div className="flex items-center justify-between gap-2">
              <DialogTitle className="text-base truncate">{chatTicket?.subject}</DialogTitle>
              {chatTicket && (
                <Badge variant={statusMap[chatTicket.status]?.variant || "secondary"}>
                  {statusMap[chatTicket.status]?.label || chatTicket.status}
                </Badge>
              )}
            </div>
          </DialogHeader>
          {chatTicket && user && (
            <TicketChat
              ticketId={chatTicket.id}
              currentUserId={user.id}
              currentUserRole="admin"
              ticketStatus={chatTicket.status}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ── Invoices ── */
function UserInvoicesSection({ userId }: { userId: string }) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("orders").select("id, total_amount, status, created_at").eq("user_id", userId)
      .in("status", ["delivered", "processing", "shipped"]).order("created_at", { ascending: false })
      .then(({ data }) => {
        setInvoices(((data as any[]) || []).map((o) => ({
          id: `INV-${o.id.slice(0, 8).toUpperCase()}`,
          total_amount: o.total_amount,
          status: o.status === "delivered" ? "paid" : "pending",
          created_at: o.created_at,
        })));
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p className="text-muted-foreground">Yükleniyor...</p>;

  if (invoices.length === 0) {
    return (
      <Card><CardContent className="py-12 text-center">
        <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
        <p className="text-muted-foreground">Bu kullanıcının faturası bulunmamaktadır.</p>
      </CardContent></Card>
    );
  }

  return (
    <div className="space-y-3">
      {invoices.map((inv: any) => (
        <Card key={inv.id}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-accent/50 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{inv.id}</p>
                <p className="text-xs text-muted-foreground">{new Date(inv.created_at).toLocaleDateString("tr-TR")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={inv.status === "paid" ? "default" : "secondary"}>{inv.status === "paid" ? "Ödendi" : "Beklemede"}</Badge>
              <span className="font-semibold text-sm">{inv.total_amount.toLocaleString("tr-TR")} ₺</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ── Activity ── */
function UserActivitySection({ userId }: { userId: string }) {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("orders").select("id, status, created_at, total_amount").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
      supabase.from("support_tickets").select("id, subject, status, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
    ]).then(([ordersRes, ticketsRes]) => {
      const items: any[] = [];
      const statusLabels: Record<string, string> = { pending: "oluşturuldu", processing: "işleme alındı", shipped: "kargoya verildi", delivered: "teslim edildi", cancelled: "iptal edildi" };

      ((ordersRes.data as any[]) || []).forEach((o) => {
        items.push({ id: `o-${o.id}`, icon: ShoppingCart, title: `Sipariş ${statusLabels[o.status] || o.status}`, detail: `#${o.id.slice(0, 8).toUpperCase()} — ${o.total_amount.toLocaleString("tr-TR")} ₺`, time: o.created_at, color: "text-primary" });
      });

      ((ticketsRes.data as any[]) || []).forEach((t) => {
        items.push({ id: `t-${t.id}`, icon: HeadphonesIcon, title: `Destek: ${t.subject}`, detail: t.status === "closed" ? "Kapatıldı" : t.status === "in_progress" ? "İşlemde" : "Açıldı", time: t.created_at, color: "text-accent" });
      });

      items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setActivities(items.slice(0, 30));
      setLoading(false);
    });
  }, [userId]);

  if (loading) return <p className="text-muted-foreground">Yükleniyor...</p>;

  if (activities.length === 0) {
    return (
      <Card><CardContent className="py-12 text-center">
        <Activity className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
        <p className="text-muted-foreground">Henüz aktivite kaydı yok.</p>
      </CardContent></Card>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-5 top-5 bottom-5 w-px bg-border" />
      <div className="space-y-1">
        {activities.map((item) => {
          const Icon = item.icon;
          const date = new Date(item.time);
          const isToday = new Date().toDateString() === date.toDateString();
          return (
            <div key={item.id} className="flex items-start gap-4 py-3 relative">
              <div className="h-10 w-10 shrink-0 rounded-full bg-card border-2 border-border flex items-center justify-center z-10">
                <Icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {isToday ? date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
