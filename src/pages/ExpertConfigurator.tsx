import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import SEO from "@/components/SEO";
import {
  ArrowLeft, ArrowRight, Users, Globe, Database, Cpu, Server, Shield,
  CheckCircle2, MessageCircle, Phone, Mail, FileText, HardDrive, Check,
} from "lucide-react";
import PhoneInput from "@/components/PhoneInput";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 4;

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

const stepLabels = [
  { label: "Amaç", icon: <Globe className="h-4 w-4" /> },
  { label: "Detay", icon: <FileText className="h-4 w-4" /> },
  { label: "Kaynak", icon: <HardDrive className="h-4 w-4" /> },
  { label: "İletişim", icon: <Phone className="h-4 w-4" /> },
];

export default function ExpertConfigurator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [contactMethod, setContactMethod] = useState("whatsapp");
  const [cpu, setCpu] = useState("bilmiyorum");
  const [ram, setRam] = useState("bilmiyorum");
  const [storage, setStorage] = useState("bilmiyorum");
  const [storageType, setStorageType] = useState("bilmiyorum");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const canProceed = [
    () => !!selectedUseCase,
    () => details.trim().length >= 10,
    () => true, // resources are optional
    () => name.trim() && phone.trim() && email.trim(),
  ];

  const goNext = () => {
    if (step < TOTAL_STEPS - 1 && canProceed[step]()) {
      setDirection("next");
      setStep((s) => s + 1);
    }
  };

  const goPrev = () => {
    if (step > 0) {
      setDirection("prev");
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed[3]() || isSubmitting) return;
    setIsSubmitting(true);

    const useCaseLabel = useCases.find((u) => u.id === selectedUseCase)?.label || selectedUseCase;

    const { error } = await supabase.from("support_tickets").insert({
      user_id: user?.id || null,
      subject: `Uzman Yapılandırma Talebi - ${useCaseLabel}`,
      message: `Kullanım Amacı: ${useCaseLabel}\n\nDetaylar:\n${details.trim()}\n\nKaynak İhtiyacı:\nCPU: ${cpu}\nRAM: ${ram}\nDepolama: ${storage} (${storageType})\n\nİletişim Bilgileri:\nAd: ${name.trim()}\nTelefon: ${phone.trim()}\nE-posta: ${email.trim()}\nTercih Edilen İletişim: ${contactMethod}`,
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
        <SEO title="Talep Gönderildi" description="Uzman yapılandırma talebiniz alındı." canonical="/yapilandirici/uzman" />
        <div className="container max-w-lg text-center animate-scale-in">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-primary" />
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

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="py-8 min-h-[80vh]">
      <SEO
        title="Uzman Sunucu Danışmanlığı"
        description="Kullanım amacınızı anlatın, uzman ekibimiz size en uygun sunucu yapılandırmasını önersin."
        canonical="/yapilandirici/uzman"
      />
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/yapilandirici" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 mb-4">
            <ArrowLeft className="h-3.5 w-3.5" /> Yapılandırıcıya Dön
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Uzman Yapılandırma Desteği</h1>
              <p className="text-sm text-muted-foreground">4 adımda sunucu ihtiyacınızı belirleyelim</p>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {stepLabels.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { if (i < step) { setDirection("prev"); setStep(i); } }}
                className={cn(
                  "flex items-center gap-2 transition-all",
                  i <= step ? "opacity-100" : "opacity-40",
                  i < step && "cursor-pointer hover:opacity-80"
                )}
              >
                <span className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 shrink-0",
                  i < step && "bg-primary text-primary-foreground",
                  i === step && "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110",
                  i > step && "bg-muted text-muted-foreground"
                )}>
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span className={cn(
                  "text-sm font-medium hidden sm:block transition-colors",
                  i === step ? "text-foreground" : "text-muted-foreground"
                )}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
          {/* Progress bar */}
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step content with animation */}
        <div
          key={step}
          className={cn(
            "min-h-[340px]",
            direction === "next" ? "animate-fade-in" : "animate-fade-in"
          )}
        >
          {/* Step 1: Use case */}
          {step === 0 && (
            <div className="bg-card border rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-foreground mb-1">Kullanım Amacınız</h2>
              <p className="text-sm text-muted-foreground mb-6">Sunucuyu ne amaçla kullanacaksınız?</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {useCases.map((uc) => (
                  <button
                    type="button"
                    key={uc.id}
                    onClick={() => setSelectedUseCase(uc.id)}
                    className={cn(
                      "flex flex-col items-center gap-2.5 rounded-xl border-2 p-5 transition-all text-center group",
                      selectedUseCase === uc.id
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-border hover:border-primary/30 hover:bg-primary/5"
                    )}
                  >
                    <span className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200",
                      selectedUseCase === uc.id
                        ? "bg-primary text-primary-foreground scale-110"
                        : "bg-muted text-muted-foreground group-hover:scale-105"
                    )}>
                      {uc.icon}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{uc.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{uc.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 1 && (
            <div className="bg-card border rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-foreground mb-1">Detaylı Bilgi</h2>
              <p className="text-sm text-muted-foreground mb-6">Beklediğiniz trafik, kullanıcı sayısı, özel gereksinimler hakkında bilgi verin.</p>
              <Textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Örn: E-ticaret sitemiz günlük 10.000+ ziyaretçi alıyor. 500GB+ ürün görseli barındırmamız gerekiyor. Yüksek uptime ve yedekleme istiyoruz..."
                rows={7}
                maxLength={2000}
                className="resize-none text-base"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">En az 10 karakter yazın</p>
                <p className="text-xs text-muted-foreground">{details.length}/2000</p>
              </div>
            </div>
          )}

          {/* Step 3: Resources */}
          {step === 2 && (
            <div className="bg-card border rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-foreground mb-1">Kaynak İhtiyacı</h2>
              <p className="text-sm text-muted-foreground mb-6">Tahmini kaynak ihtiyacınızı seçin. Emin değilseniz "Bilmiyorum" bırakabilirsiniz.</p>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Cpu className="h-4 w-4 text-primary" /> İşlemci (CPU)</Label>
                  <Select value={cpu} onValueChange={setCpu}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bilmiyorum">Bilmiyorum</SelectItem>
                      <SelectItem value="1-4 Çekirdek">1-4 Çekirdek</SelectItem>
                      <SelectItem value="8-16 Çekirdek">8-16 Çekirdek</SelectItem>
                      <SelectItem value="16-32 Çekirdek">16-32 Çekirdek</SelectItem>
                      <SelectItem value="32-64 Çekirdek">32-64 Çekirdek</SelectItem>
                      <SelectItem value="64+ Çekirdek">64+ Çekirdek</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Server className="h-4 w-4 text-primary" /> Bellek (RAM)</Label>
                  <Select value={ram} onValueChange={setRam}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bilmiyorum">Bilmiyorum</SelectItem>
                      <SelectItem value="16-32 GB">16-32 GB</SelectItem>
                      <SelectItem value="32-64 GB">32-64 GB</SelectItem>
                      <SelectItem value="64-128 GB">64-128 GB</SelectItem>
                      <SelectItem value="128-256 GB">128-256 GB</SelectItem>
                      <SelectItem value="256-512 GB">256-512 GB</SelectItem>
                      <SelectItem value="512 GB+">512 GB+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><HardDrive className="h-4 w-4 text-primary" /> Depolama Kapasitesi</Label>
                  <Select value={storage} onValueChange={setStorage}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bilmiyorum">Bilmiyorum</SelectItem>
                      <SelectItem value="500 GB - 1 TB">500 GB - 1 TB</SelectItem>
                      <SelectItem value="1 - 4 TB">1 - 4 TB</SelectItem>
                      <SelectItem value="4 - 10 TB">4 - 10 TB</SelectItem>
                      <SelectItem value="10 - 50 TB">10 - 50 TB</SelectItem>
                      <SelectItem value="50 TB+">50 TB+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Database className="h-4 w-4 text-primary" /> Depolama Tipi</Label>
                  <Select value={storageType} onValueChange={setStorageType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bilmiyorum">Bilmiyorum</SelectItem>
                      <SelectItem value="SSD (Hızlı)">SSD (Hızlı)</SelectItem>
                      <SelectItem value="NVMe (Çok Hızlı)">NVMe (Çok Hızlı)</SelectItem>
                      <SelectItem value="HDD (Büyük Kapasite)">HDD (Büyük Kapasite)</SelectItem>
                      <SelectItem value="Karma (SSD + HDD)">Karma (SSD + HDD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Contact */}
          {step === 3 && (
            <div className="bg-card border rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-foreground mb-1">İletişim Bilgileriniz</h2>
              <p className="text-sm text-muted-foreground mb-6">Size nasıl ulaşmamızı istersiniz?</p>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label>Ad Soyad *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Adınız Soyadınız" maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label>E-posta *</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@firma.com" maxLength={255} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Telefon *</Label>
                  <PhoneInput value={phone} onChange={setPhone} />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Tercih Ettiğiniz İletişim Yöntemi *</Label>
                <RadioGroup value={contactMethod} onValueChange={setContactMethod} className="grid grid-cols-3 gap-3">
                  {contactMethods.map((cm) => (
                    <label
                      key={cm.value}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-4 cursor-pointer transition-all",
                        contactMethod === cm.value
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <RadioGroupItem value={cm.value} className="sr-only" />
                      <span className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                        contactMethod === cm.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {cm.icon}
                      </span>
                      <span className="text-sm font-medium text-foreground">{cm.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={goPrev}
            disabled={step === 0}
            className={cn("gap-2 transition-opacity", step === 0 && "opacity-0 pointer-events-none")}
          >
            <ArrowLeft className="h-4 w-4" /> Geri
          </Button>

          <p className="text-sm text-muted-foreground">
            {step + 1} / {TOTAL_STEPS}
          </p>

          {step < TOTAL_STEPS - 1 ? (
            <Button
              type="button"
              onClick={goNext}
              disabled={!canProceed[step]()}
              className="gap-2"
            >
              İleri <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="hero"
              onClick={handleSubmit}
              disabled={!canProceed[3]() || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? "Gönderiliyor..." : "Gönder"} <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
