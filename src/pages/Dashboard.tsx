import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { User, Package, HeadphonesIcon, LogOut, Save } from "lucide-react";
import SEO from "@/components/SEO";

interface Profile {
  full_name: string | null;
  phone: string | null;
  company: string | null;
  tax_office: string | null;
  tax_number: string | null;
  address: string | null;
  city: string | null;
}

interface Order {
  id: string;
  items: any;
  total_amount: number;
  status: string;
  created_at: string;
}

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/giris", { replace: true });
  }, [user, loading, navigate]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center">Yükleniyor...</div>;
  if (!user) return null;

  return (
    <>
      <SEO title="Müşteri Paneli | ServerMarket" description="Siparişlerinizi takip edin, profilinizi yönetin." />
      <div className="container py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Müşteri Paneli</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" onClick={() => { signOut(); navigate("/"); }}>
            <LogOut className="h-4 w-4 mr-2" /> Çıkış Yap
          </Button>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" /> Profil</TabsTrigger>
            <TabsTrigger value="orders" className="gap-2"><Package className="h-4 w-4" /> Siparişler</TabsTrigger>
            <TabsTrigger value="support" className="gap-2"><HeadphonesIcon className="h-4 w-4" /> Destek</TabsTrigger>
          </TabsList>
          <TabsContent value="profile"><ProfileTab userId={user.id} /></TabsContent>
          <TabsContent value="orders"><OrdersTab userId={user.id} /></TabsContent>
          <TabsContent value="support"><SupportTab userId={user.id} /></TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function ProfileTab({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile>({ full_name: "", phone: "", company: "", tax_office: "", tax_number: "", address: "", city: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("profiles").select("*").eq("id", userId).single().then(({ data }) => {
      if (data) setProfile(data as unknown as Profile);
      setIsLoading(false);
    });
  }, [userId]);

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
    } as any).eq("id", userId);
    setIsSaving(false);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else toast({ title: "Kaydedildi", description: "Profil bilgileriniz güncellendi." });
  };

  if (isLoading) return <p>Yükleniyor...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil Bilgileri</CardTitle>
        <CardDescription>Kişisel ve şirket bilgilerinizi güncelleyin</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Ad Soyad</Label>
            <Input value={profile.full_name || ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Telefon</Label>
            <Input value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Şirket</Label>
            <Input value={profile.company || ""} onChange={(e) => setProfile({ ...profile, company: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Şehir</Label>
            <Input value={profile.city || ""} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Vergi Dairesi</Label>
            <Input value={profile.tax_office || ""} onChange={(e) => setProfile({ ...profile, tax_office: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Vergi Numarası</Label>
            <Input value={profile.tax_number || ""} onChange={(e) => setProfile({ ...profile, tax_number: e.target.value })} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Adres</Label>
            <Textarea value={profile.address || ""} onChange={(e) => setProfile({ ...profile, address: e.target.value })} rows={3} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" /> {isSaving ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function OrdersTab({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false }).then(({ data }) => {
      setOrders((data as unknown as Order[]) || []);
      setIsLoading(false);
    });
  }, [userId]);

  const statusMap: Record<string, string> = {
    pending: "Beklemede",
    processing: "İşleniyor",
    shipped: "Kargoda",
    delivered: "Teslim Edildi",
    cancelled: "İptal",
  };

  if (isLoading) return <p>Yükleniyor...</p>;

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Henüz siparişiniz bulunmamaktadır.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sipariş Geçmişi</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarih</TableHead>
              <TableHead>Sipariş No</TableHead>
              <TableHead>Tutar</TableHead>
              <TableHead>Durum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{new Date(order.created_at).toLocaleDateString("tr-TR")}</TableCell>
                <TableCell className="mono text-xs">{order.id.slice(0, 8).toUpperCase()}</TableCell>
                <TableCell>{order.total_amount.toLocaleString("tr-TR")} ₺</TableCell>
                <TableCell>
                  <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                    {statusMap[order.status] || order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function SupportTab({ userId }: { userId: string }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const loadTickets = () => {
    supabase.from("support_tickets").select("*").eq("user_id", userId).order("created_at", { ascending: false }).then(({ data }) => {
      setTickets((data as unknown as Ticket[]) || []);
      setIsLoading(false);
    });
  };

  useEffect(() => { loadTickets(); }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.from("support_tickets").insert({ user_id: userId, subject, message } as any);
    setIsSubmitting(false);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Talep oluşturuldu", description: "Destek talebiniz alındı." });
      setSubject("");
      setMessage("");
      loadTickets();
    }
  };

  const statusMap: Record<string, string> = { open: "Açık", in_progress: "İşlemde", closed: "Kapalı" };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Yeni Destek Talebi</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Konu</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="Destek talebinizin konusu" />
            </div>
            <div className="space-y-2">
              <Label>Mesaj</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} placeholder="Detaylı açıklama yazın..." />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Gönderiliyor..." : "Talep Oluştur"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Destek Taleplerim</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Yükleniyor...</p>
          ) : tickets.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Henüz destek talebiniz bulunmamaktadır.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Konu</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{new Date(ticket.created_at).toLocaleDateString("tr-TR")}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>
                      <Badge variant={ticket.status === "closed" ? "secondary" : "default"}>
                        {statusMap[ticket.status] || ticket.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
