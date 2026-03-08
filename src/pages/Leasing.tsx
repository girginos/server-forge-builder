import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  Check,
  ShieldCheck,
  Clock,
  Banknote,
  TrendingDown,
  ArrowRight,
  Server,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import SEO from "@/components/SEO";
import { SITE_URL } from "@/config/site";
import serverR740 from "@/assets/server-r740.png";
import serverR640 from "@/assets/server-r640.png";
import serverDL380 from "@/assets/server-dl380.png";
import serverSupermicro from "@/assets/server-supermicro.png";

/* ── Leasing Paketleri ──────────────────────────── */
const leasingPackages = [
  {
    id: "lease-web",
    name: "Web Sunucu Paketi",
    image: serverR640,
    specs: ["1x Intel Xeon Silver 4210", "64 GB DDR4 ECC", "2x 480GB SSD", "1U Rack Mount"],
    totalPrice: 28000,
    popular: false,
  },
  {
    id: "lease-business",
    name: "Kurumsal İş Paketi",
    image: serverR740,
    specs: ["2x Intel Xeon Gold 6230", "256 GB DDR4 ECC", "4x 1.92TB NVMe", "2U Rack Mount"],
    totalPrice: 68000,
    popular: true,
  },
  {
    id: "lease-db",
    name: "Veritabanı Paketi",
    image: serverDL380,
    specs: ["2x Intel Xeon Gold 6248", "256 GB DDR4 ECC", "8x 960GB SSD NVMe", "2U Rack Mount"],
    totalPrice: 72000,
    popular: false,
  },
  {
    id: "lease-hpc",
    name: "AI / HPC Paketi",
    image: serverSupermicro,
    specs: ["2x AMD EPYC 7003", "512 GB DDR4 ECC", "4x 3.84TB NVMe", "GPU Ready", "2U Rack Mount"],
    totalPrice: 120000,
    popular: false,
  },
];

const termOptions = [
  { months: 12, label: "12 Ay", multiplier: 1.0 },
  { months: 24, label: "24 Ay", multiplier: 1.0 },
  { months: 36, label: "36 Ay", multiplier: 1.0 },
  { months: 48, label: "48 Ay", multiplier: 1.0 },
];

/* ── Avantajlar ──────────────────────────────────── */
const advantages = [
  { icon: Banknote, title: "Peşinatsız Başlangıç", desc: "Yüksek başlangıç yatırımı olmadan enterprise sınıfı sunuculara sahip olun." },
  { icon: TrendingDown, title: "Vergi Avantajı", desc: "Aylık kira bedelleri gider olarak yazılabilir, vergi matrahınızı düşürür." },
  { icon: ShieldCheck, title: "Garanti & Bakım Dahil", desc: "Kira süresi boyunca donanım garantisi ve teknik destek hizmetimizden yararlanın." },
  { icon: Clock, title: "Süre Sonunda Mülkiyet", desc: "Taksit süresi dolduğunda sunucu tamamen size ait olur, ek bir ücret ödenmez." },
];

/* ── SSS ─────────────────────────────────────────── */
const faqItems = [
  { q: "Kirala Senin Olsun nasıl çalışır?", a: "İhtiyacınıza uygun sunucuyu seçer, vade süresini belirlersiniz. Aylık sabit taksitlerle ödeme yaparsınız. Süre sonunda sunucu size devredilir." },
  { q: "Peşinat gerekiyor mu?", a: "Hayır, standart paketlerimizde peşinat gerekmez. Kurumsal müşterilerimiz için özel ödeme planları da sunabiliyoruz." },
  { q: "Kira süresi içinde sunucuyu iade edebilir miyim?", a: "İlk 12 aydan sonra erken kapama seçeneği mevcuttur. Kalan taksitlerin %80'i ödenerek sözleşme kapatılabilir." },
  { q: "Garanti kapsamı nedir?", a: "Kira süresi boyunca donanım garantisi, yerinde teknik destek ve yedek parça değişimi dahildir." },
  { q: "Vergi avantajı nasıl sağlanır?", a: "Aylık kira bedelleri kurumlar vergisi matrahından gider olarak düşülebilir. Detaylı bilgi için mali müşavirinize danışmanızı öneririz." },
  { q: "Süre sonunda ne olur?", a: "Son taksitin ödenmesiyle birlikte sunucu mülkiyeti tarafınıza devredilir. Devir süreci tamamen ücretsizdir." },
];

/* ── Hesaplayıcı ─────────────────────────────────── */
function PriceCalculator() {
  const [selectedPkg, setSelectedPkg] = useState(leasingPackages[1].id);
  const [term, setTerm] = useState(36);

  const pkg = leasingPackages.find((p) => p.id === selectedPkg)!;
  const monthly = Math.round(pkg.totalPrice / term);
  const totalSaving = Math.round(pkg.totalPrice * 0.15); // simulated saving vs outright purchase with financing

  return (
    <div className="bg-card border rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Taksit Hesaplayıcı</h3>
      </div>

      {/* Sunucu seçimi */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-foreground mb-2">Sunucu Paketi</label>
        <select
          value={selectedPkg}
          onChange={(e) => setSelectedPkg(e.target.value)}
          className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {leasingPackages.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — ₺{p.totalPrice.toLocaleString("tr-TR")}
            </option>
          ))}
        </select>
      </div>

      {/* Vade seçimi */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">Vade Süresi</label>
        <div className="grid grid-cols-4 gap-2">
          {termOptions.map((t) => (
            <button
              key={t.months}
              onClick={() => setTerm(t.months)}
              className={`rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                term === t.months
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-input hover:border-primary/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sonuç */}
      <div className="rounded-xl bg-muted/50 p-5 space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Aylık Taksit</span>
          <span className="text-3xl font-bold text-foreground">
            ₺{monthly.toLocaleString("tr-TR")}
            <span className="text-sm font-normal text-muted-foreground">/ay</span>
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Toplam Tutar</span>
          <span className="text-lg font-semibold text-foreground">₺{pkg.totalPrice.toLocaleString("tr-TR")}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Tahmini Vergi Avantajı</span>
          <span className="text-lg font-semibold text-success">₺{totalSaving.toLocaleString("tr-TR")}</span>
        </div>
      </div>

      <Button variant="hero" size="lg" className="w-full mt-5" asChild>
        <Link to="/iletisim">Hemen Başvur <ArrowRight className="h-4 w-4" /></Link>
      </Button>
    </div>
  );
}

/* ── SSS Bileşeni ────────────────────────────────── */
function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqItems.map((item, i) => (
        <div key={i} className="bg-card border rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <span className="text-sm font-semibold text-foreground">{item.q}</span>
            {openIndex === i ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
          </button>
          {openIndex === i && (
            <div className="px-5 pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Ana Sayfa Bileşeni ──────────────────────────── */
export default function Leasing() {
  return (
    <div>
      <SEO
        title="Kirala Senin Olsun - Sunucu Kiralama"
        description="Peşinatsız, sabit taksitlerle sunucu sahibi olun. 12-48 ay vade, garanti dahil. Kurumsal sunucu kiralama çözümleri."
        keywords="sunucu kiralama, kirala senin olsun, sunucu leasing, sunucu taksit, kurumsal kiralama"
        canonical="/leasing"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "ServerMarket Kirala Senin Olsun",
            provider: { "@type": "Organization", name: "ServerMarket", url: SITE_URL },
            description: "Peşinatsız, sabit taksitlerle sunucu sahibi olun. 12-48 ay vade seçenekleri.",
            url: `${SITE_URL}/leasing`,
            areaServed: "TR",
            serviceType: "Server Leasing",
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />

      {/* Hero */}
      <section className="gradient-hero text-secondary-foreground py-20">
        <div className="container">
          <div className="max-w-2xl">
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">Kirala Senin Olsun</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Sunucunu Kirala,{" "}
              <span className="text-gradient">Sahibi Ol</span>
            </h1>
            <p className="text-lg text-secondary-foreground/70 mb-6">
              Peşinat ödemeden, sabit aylık taksitlerle enterprise sınıfı sunuculara sahip olun.
              Süre sonunda sunucu tamamen sizin.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" size="lg" asChild>
                <a href="#paketler">Paketleri İncele</a>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <a href="#hesaplayici">Taksit Hesapla</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Avantajlar */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground text-center mb-3">Neden Kirala Senin Olsun?</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
            Peşin alıma göre avantajlarını keşfedin
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((adv) => (
              <div key={adv.title} className="bg-card border rounded-xl p-6 text-center hover:shadow-glow transition-shadow">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                  <adv.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{adv.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Nasıl Çalışır?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Sunucu Seçin", desc: "İhtiyacınıza uygun sunucu paketini belirleyin." },
              { step: "2", title: "Vade Belirleyin", desc: "12, 24, 36 veya 48 aylık ödeme planı seçin." },
              { step: "3", title: "Sözleşme", desc: "Online başvuru yapın, hızlı onay alın." },
              { step: "4", title: "Sahibi Olun", desc: "Süre sonunda sunucu tamamen sizin!" },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full gradient-primary text-primary-foreground text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paketler */}
      <section id="paketler" className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground text-center mb-3">Kiralama Paketleri</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
            Her bütçeye uygun hazır kiralama paketleri
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leasingPackages.map((pkg) => {
              const monthly36 = Math.round(pkg.totalPrice / 36);
              return (
                <div
                  key={pkg.id}
                  className={`bg-card border rounded-xl overflow-hidden flex flex-col transition-all hover:shadow-glow ${
                    pkg.popular ? "ring-2 ring-primary" : ""
                  }`}
                >
                  {pkg.popular && (
                    <div className="gradient-primary text-primary-foreground text-center text-xs font-semibold py-1.5">
                      En Çok Tercih Edilen
                    </div>
                  )}
                  <div className="p-4 flex items-center justify-center h-40 bg-muted/30">
                    <img src={pkg.image} alt={pkg.name} className="max-h-32 object-contain" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-3">{pkg.name}</h3>
                    <ul className="space-y-1.5 flex-1">
                      {pkg.specs.map((spec) => (
                        <li key={spec} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span className="font-mono">{spec}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-3 border-t">
                      <div className="text-xs text-muted-foreground mb-1">36 ay taksitle</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-foreground">₺{monthly36.toLocaleString("tr-TR")}</span>
                        <span className="text-sm text-muted-foreground">/ay</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Toplam: ₺{pkg.totalPrice.toLocaleString("tr-TR")}
                      </div>
                    </div>
                    <Button variant="hero" className="w-full mt-4" asChild>
                      <Link to="/iletisim">Başvur</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hesaplayıcı + SSS */}
      <section id="hesaplayici" className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Taksit Hesaplayıcı</h2>
              <p className="text-muted-foreground mb-6">
                Sunucu paketinizi ve vade sürenizi seçerek aylık taksit tutarınızı hesaplayın.
              </p>
              <PriceCalculator />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Sıkça Sorulan Sorular</h2>
              <p className="text-muted-foreground mb-6">
                Kirala Senin Olsun hakkında merak edilenler
              </p>
              <FaqSection />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-navy text-secondary-foreground py-14">
        <div className="container text-center">
          <Server className="h-10 w-10 text-teal mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Hemen Başvurun</h2>
          <p className="text-secondary-foreground/70 max-w-lg mx-auto mb-6">
            Uzman ekibimiz size özel kiralama planı oluştursun. İlk taksitinizi 30 gün sonra ödeyin.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="hero" size="lg" asChild>
              <Link to="/iletisim">İletişime Geç <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to="/hardware">Sunucuları İncele</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
