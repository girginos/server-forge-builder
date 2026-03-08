import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, User, Building2, MapPin } from "lucide-react";

interface Profile {
  full_name: string | null;
  phone: string | null;
  company: string | null;
  tax_office: string | null;
  tax_number: string | null;
  address: string | null;
  city: string | null;
}

export default function ProfileTab({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile>({
    full_name: "", phone: "", company: "", tax_office: "", tax_number: "", address: "", city: "",
  });
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

  if (isLoading) return <ProfileSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xl font-bold">
          {(profile.full_name || "?").charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold">{profile.full_name || "İsimsiz Kullanıcı"}</h2>
          <p className="text-sm text-muted-foreground">{profile.company || "Şirket belirtilmemiş"}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-primary" /> Kişisel Bilgiler
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Ad Soyad</Label>
              <Input value={profile.full_name || ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Telefon</Label>
              <Input value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+90 5XX XXX XXXX" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4 text-primary" /> Şirket & Fatura Bilgileri
            </CardTitle>
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
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4 text-primary" /> Adres Bilgileri
            </CardTitle>
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

        <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" /> {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </Button>
      </form>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="h-4 w-28 bg-muted rounded" />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <Card key={i}><CardContent className="py-8"><div className="h-20 bg-muted rounded" /></CardContent></Card>
      ))}
    </div>
  );
}
