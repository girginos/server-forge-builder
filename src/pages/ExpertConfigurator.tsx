import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import SEO from "@/components/SEO";
import { ArrowLeft, Users, Globe, Database, Cpu, Server, Shield, CheckCircle2, MessageCircle, Phone, Mail } from "lucide-react";
import { PhoneInput } from "@/components/PhoneInput";

const useCases = [
  { id: "web", icon: <Globe className="h-5 w-5" />, label: "Web Hosting", desc: "Web sitesi / e-ticaret barındırma" },
  { id: "db", icon: <Database className="h-5 w-5" />, label: "Veritabanı", desc: "Yüksek kapasiteli veri yönetimi" },
  { id: "vm", icon: <Cpu className="h-5 w-5" />, label: "Sanallaştırma", desc: "VMware / Hyper-V ortamı" },
  { id: "ai", icon: <Server className="h-5 w-5" />, label: "AI / HPC", desc: "Makine öğrenmesi ve hesaplama" },
  { id: "storage", icon: <Shield className="h-5 w-5" />, label: "Yedekleme", desc: "Veri depolama ve yedekleme" },
  { id: "other", icon: <Users className="h-5 w-5" />, label: "Diğer", desc: "Farklı bir kullanım amacı" },
];

const contactMethods = [
  { value: "whatsapp", label: "WhatsApp", icon: <MessageCircle className="h-4 w-4" /> },
  { value: "phone", label: "Telefon", icon: <Phone className="h-4 w-4" /> },
  { value: "email", label: "E-posta", icon: <Mail className="h-4 w-4" /> },
];

export default function ExpertConfigurator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [contactMethod, setContactMethod] = useState("whatsapp");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isValid = selectedUseCase && details.trim().length >= 10 && name.trim() && phone.trim() && email.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);

    const useCaseLabel = useCases.find((u) => u.id === selectedUseCase)?.label || selectedUseCase;

    const { error } = await supabase.from("support_tickets").insert({
      user_id: user?.id || null,
      subject: `Uzman Yapılandırma Talebi - ${useCaseLabel}`,
      message: `Kullanım Amacı: ${useCaseLabel}\n\nDetaylar:\n${details.trim()}\n\nİletişim Bilgileri:\nAd: ${name.trim()}\nTelefon: ${phone.trim()}\nE-posta: ${email.trim()}\nTercih Edilen İletişim: ${contactMethod}`,
      status: "open",
    } as any);

    setIsSubmitting(false);

    if (error) {
      toast({ title: "Hata", description: "Talep gönderilemedi. Lütfen tekrar deneyin.", variant: "destructive" });
      return;
    }

    setIsSubmitted(true);
    toast({ title: "Talebiniz alındı!", description: "Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir." });
  };

  if (isSubmitted) {
    return (
      <div className="py-20 min-h-[70vh]">
        <SEO title="Talep Gönderildi" canonical="/yapilandirici/uzman" />
        <div className="container max-w-lg text-center">
          <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Talebiniz Alındı!</h1>
          <p className="text-muted-foreground mb-8">
            Uzman ekibimiz talebinizi inceleyecek ve seçtiğiniz iletişim yöntemiyle en kısa sürede size dönüş yapacaktır.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link to="/yapilandirici">Yapılandırıcıya Dön</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/">Anasayfa</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 min-h-[80vh]">
      <SEO
        title="Uzman Sunucu Danışmanlığı"
        description="Kullanım amacınızı anlatın, uzman ekibimiz size en uygun sunucu yapılandırmasını önersin."
        canonical="/yapilandirici/uzman"
      />
      <div className="container max-w-3xl">
        <div className="mb-8">
          <Link to="/yapilandirici" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 mb-4">
            <ArrowLeft className="h-3.5 w-3.5" /> Yapılandırıcıya Dön
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Uzman Yapılandırma Desteği</h1>
              <p className="text-sm text-muted-foreground">İhtiyacınızı anlatın, uzman ekibimiz sizin için en uygun sunucuyu yapılandırsın</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Use case */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">1. Kullanım Amacınız</h2>
            <p className="text-sm text-muted-foreground mb-4">Sunucuyu ne amaçla kullanacaksınız?</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {useCases.map((uc) => (
                <button
                  type="button"
                  key={uc.id}
                  onClick={() => setSelectedUseCase(uc.id)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all text-center ${
                    selectedUseCase === uc.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30 hover:bg-primary/5"
                  }`}
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                    selectedUseCase === uc.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {uc.icon}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{uc.label}</p>
                    <p className="text-[11px] text-muted-foreground">{uc.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Details */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">2. Detaylı Bilgi</h2>
            <p className="text-sm text-muted-foreground mb-4">Beklediğiniz trafik, kullanıcı sayısı, özel gereksinimler vb. hakkında bilgi verin.</p>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Örn: E-ticaret sitemiz günlük 10.000+ ziyaretçi alıyor. 500GB+ ürün görseli barındırmamız gerekiyor. Yüksek uptime ve yedekleme istiyoruz..."
              rows={5}
              maxLength={2000}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">{details.length}/2000</p>
          </div>

          {/* Step 3: Contact info */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">3. İletişim Bilgileriniz</h2>
            <p className="text-sm text-muted-foreground mb-4">Size nasıl ulaşmamızı istersiniz?</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div className="space-y-2">
                <Label>Ad Soyad *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Adınız Soyadınız" maxLength={100} required />
              </div>
              <div className="space-y-2">
                <Label>E-posta *</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@firma.com" maxLength={255} required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Telefon *</Label>
                <PhoneInput value={phone} onChange={setPhone} />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Tercih Ettiğiniz İletişim Yöntemi *</Label>
              <RadioGroup value={contactMethod} onValueChange={setContactMethod} className="flex gap-3">
                {contactMethods.map((cm) => (
                  <label
                    key={cm.value}
                    className={`flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 cursor-pointer transition-all flex-1 ${
                      contactMethod === cm.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <RadioGroupItem value={cm.value} />
                    <span className="text-muted-foreground">{cm.icon}</span>
                    <span className="text-sm font-medium text-foreground">{cm.label}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={!isValid || isSubmitting}>
            {isSubmitting ? "Gönderiliyor..." : "Uzman Ekibe Gönder"}
          </Button>
        </form>
      </div>
    </div>
  );
}
