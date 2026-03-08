import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Server, Shield, Zap, Wifi, Lock, Clock,
  CheckCircle2, ArrowRight, Building2, Thermometer, Eye, Wrench,
  ChevronDown, ChevronUp, MapPin, Rocket
} from "lucide-react";
import { useState } from "react";
import colocationBg from "@/assets/colocation-bg.jpg";
import SEO from "@/components/SEO";
import { SITE_URL } from "@/config/site";

const features = [
  { icon: Server, title: "Tier III+ Veri Merkezi", desc: "%99.98 uptime garantisi ile kesintisiz hizmet. Uluslararası standartlarda sertifikalı altyapı.", highlights: ["ISO 27001 sertifikalı", "Uptime Institute Tier III"] },
  { icon: Shield, title: "Fiziksel Güvenlik", desc: "Çok katmanlı güvenlik sistemi ile sunucularınız 7/24 koruma altında.", highlights: ["Biyometrik erişim", "CCTV kayıt sistemi"] },
  { icon: Zap, title: "Yedekli Güç Sistemi", desc: "N+1 UPS yapılandırması ve dizel jeneratörlerle 72 saate kadar kesintisiz enerji.", highlights: ["N+1 UPS yapılandırma", "72 saat jeneratör kapasitesi"] },
  { icon: Thermometer, title: "Hassas Soğutma", desc: "Sıcak/soğuk koridor mimarisi ile optimum çalışma sıcaklığı garantisi.", highlights: ["Sıcak/soğuk koridor", "Çevresel izleme sensörleri"] },
  { icon: Wifi, title: "Yüksek Bant Genişliği", desc: "Çoklu carrier bağlantıları ile yedekli, düşük gecikmeli internet altyapısı.", highlights: ["10Gbps+ port seçenekleri", "Çoklu carrier desteği"] },
  { icon: Lock, title: "DDoS Koruması", desc: "Gelişmiş L3-L7 DDoS koruma altyapısı ile saldırılara karşı tam güvence.", highlights: ["L3-L7 koruma", "Otomatik trafik temizleme"] },
];

const plans = [
  { name: "1U Colocation", price: "₺2.500", period: "/ay", specs: ["1U Rack Alanı", "1 IP Adresi", "1Gbps Port", "1kW Güç", "Temel izleme", "Email destek"] },
  { name: "2U Colocation", price: "₺4.000", period: "/ay", specs: ["2U Rack Alanı", "2 IP Adresi", "1Gbps Port", "1.5kW Güç", "Gelişmiş izleme", "7/24 destek"], popular: true },
  { name: "Quarter Rack", price: "₺8.000", period: "/ay", specs: ["10U Rack Alanı", "8 IP Adresi", "10Gbps Port", "3kW Güç", "Premium izleme", "Öncelikli destek"] },
  { name: "Half Rack", price: "₺14.000", period: "/ay", specs: ["21U Rack Alanı", "16 IP Adresi", "10Gbps Port", "5kW Güç", "Premium izleme", "Dedike TAM"] },
];

const stats = [
  { value: "99.98%", label: "Uptime Garantisi" },
  { value: "3+", label: "Veri Merkezi Lokasyonu" },
  { value: "500+", label: "Aktif Müşteri" },
  { value: "10Gbps+", label: "Bant Genişliği" },
];

const steps = [
  { num: "01", title: "İhtiyaç Analizi", desc: "Uzmanlarımız sunucu sayısı, güç ve bant genişliği ihtiyaçlarınızı analiz eder." },
  { num: "02", title: "Plan Seçimi", desc: "İhtiyaçlarınıza en uygun colocation planını birlikte belirleriz." },
  { num: "03", title: "Kurulum", desc: "Sunucularınızı veri merkezimize güvenli şekilde taşır ve kurulumunu yaparız." },
  { num: "04", title: "7/24 İzleme", desc: "NOC ekibimiz sunucularınızı kesintisiz olarak izler ve yönetir." },
];

const dcFeatures = [
  { icon: Building2, title: "İstanbul Anadolu DC", location: "Kartal, İstanbul", specs: "Tier III+, 2.000 m²" },
  { icon: Building2, title: "İstanbul Avrupa DC", location: "Başakşehir, İstanbul", specs: "Tier III, 1.500 m²" },
  { icon: Building2, title: "Ankara DC", location: "Çankaya, Ankara", specs: "Tier III, 800 m²" },
];

const faqs = [
  { q: "Sunucularımı veri merkezine nasıl taşıyabilirim?", a: "Kargo veya elden teslim seçenekleri mevcuttur. Ekibimiz sunucularınızı rack'e monte eder, kablolamayı yapar ve uzaktan erişiminizi yapılandırır." },
  { q: "Veri merkezine fiziksel erişim sağlayabilir miyim?", a: "Evet, önceden randevu alarak 7/24 veri merkezimize erişebilirsiniz. Biyometrik kimlik doğrulama ve refakatçi eşliğinde erişim sağlanır." },
  { q: "Güç kesintisi olursa ne olur?", a: "N+1 UPS sistemi anlık devreye girer. Uzun süreli kesintilerde dizel jeneratörlerimiz 72 saate kadar kesintisiz enerji sağlar." },
  { q: "Cross-connect hizmeti var mı?", a: "Evet, veri merkezlerimizdeki diğer müşteriler veya carrier'larla doğrudan fiber bağlantı (cross-connect) kurulabilir." },
  { q: "Remote hands hizmeti nedir?", a: "Veri merkezindeki teknisyenlerimiz sizin adınıza kablo bağlama, sunucu yeniden başlatma, disk değişimi gibi fiziksel işlemleri gerçekleştirir." },
  { q: "SLA kapsamında ne garanti ediliyor?", a: "Güç, soğutma, ağ erişimi ve fiziksel güvenlik %99.98 uptime ile garanti altındadır. SLA ihlallerinde otomatik kredi uygulanır." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors">
        <span className="font-medium text-foreground text-sm">{q}</span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 ml-2" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />}
      </button>
      {open && <div className="px-4 pb-4 text-sm text-muted-foreground">{a}</div>}
    </div>
  );
}

export default function Colocation() {
  return (
    <div>
      <SEO
        title="Colocation Hizmetleri"
        description="Tier III+ veri merkezlerinde sunucu barındırma. Yedekli güç, 7/24 güvenlik, yüksek bant genişliği ile kesintisiz colocation hizmetleri."
        keywords="colocation, sunucu barındırma, veri merkezi, datacenter, server hosting, rack kirala"
        canonical="/colocation"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "ServerMarket Colocation Hizmetleri",
            provider: { "@type": "Organization", name: "ServerMarket", url: SITE_URL },
            description: "Tier III+ veri merkezlerinde sunucu barındırma hizmetleri.",
            url: `${SITE_URL}/colocation`,
            areaServed: "TR",
            serviceType: "Colocation Hosting",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Colocation Planları",
              itemListElement: [
                { "@type": "Offer", name: "1U Sunucu", price: "2.500", priceCurrency: "TRY", description: "1U alan, 1kW güç, 1Gbps port" },
                { "@type": "Offer", name: "2U Sunucu", price: "4.000", priceCurrency: "TRY", description: "2U alan, 1.5kW güç, 1Gbps port" },
                { "@type": "Offer", name: "Quarter Rack", price: "8.000", priceCurrency: "TRY", description: "10U alan, 3kW güç, 10Gbps port" },
                { "@type": "Offer", name: "Half Rack", price: "14.000", priceCurrency: "TRY", description: "21U alan, 5kW güç, 10Gbps port" },
              ],
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />

      {/* Hero */}
      <section className="relative h-96 overflow-hidden">
        <img src={colocationBg} alt="Colocation veri merkezi" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-navy opacity-85" />
        <div className="relative container h-full flex items-center">
          <div className="text-secondary-foreground max-w-2xl">
            <span className="inline-block bg-primary/20 text-primary-foreground text-xs px-3 py-1 rounded-full mb-4 font-medium border border-primary/30">
              🏢 Veri Merkezi
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">Colocation Hizmetleri</h1>
            <p className="text-secondary-foreground/80 mt-4 text-lg max-w-lg">
              Sunucularınızı Türkiye'nin en güvenilir Tier III+ veri merkezlerinde barındırın.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Button variant="hero" size="lg" asChild>
                <Link to="/iletisim">Teklif Al <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white/50 text-white bg-white/10 hover:bg-white/20">
                Veri Merkezini Gezin
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-12 z-10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-card border rounded-lg p-6 text-center shadow-card">
                <p className="text-2xl md:text-3xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Neden ServerMarket Colocation?</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Kurumsal düzeyde altyapı ve güvenlik ile sunucularınız emin ellerde.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-background border rounded-lg p-6 hover:shadow-card hover:border-primary/30 transition-all group">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {f.highlights.map((h) => (
                    <span key={h} className="inline-flex items-center gap-1 text-xs bg-primary/5 text-primary px-2 py-1 rounded-full">
                      <CheckCircle2 className="h-3 w-3" /> {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Centers */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Veri Merkezlerimiz</h2>
            <p className="text-muted-foreground mt-2">Stratejik lokasyonlarda konumlanmış, sertifikalı veri merkezleri.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {dcFeatures.map((dc) => (
              <div key={dc.title} className="bg-card border rounded-lg p-6 text-center hover:shadow-card transition-shadow">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <dc.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{dc.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {dc.location}
                </p>
                <p className="text-xs text-primary mt-2 font-medium">{dc.specs}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Nasıl Çalışır?</h2>
            <p className="text-muted-foreground mt-2">4 adımda colocation hizmetiniz hazır.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <div key={step.num} className="relative text-center">
                <div className="text-5xl font-bold text-primary/15 mb-2">{step.num}</div>
                <h3 className="font-semibold text-foreground text-lg -mt-4">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{step.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-8 -right-3 h-5 w-5 text-primary/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Colocation Planları</h2>
            <p className="text-muted-foreground mt-2">İhtiyacınıza uygun planı seçin, özel teklif alın.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((p) => (
              <div key={p.name} className={`bg-card border rounded-xl p-6 text-center flex flex-col ${p.popular ? "ring-2 ring-primary shadow-glow relative" : ""}`}>
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-4 py-1 rounded-full font-medium">
                    En Popüler
                  </span>
                )}
                <h3 className="font-semibold text-foreground text-lg">{p.name}</h3>
                <div className="my-4">
                  <span className="text-3xl font-bold text-foreground">{p.price}</span>
                  <span className="text-muted-foreground text-sm">{p.period}</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6 flex-1">
                  {p.specs.map((s) => (
                    <li key={s} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
                <Button variant={p.popular ? "hero" : "outline"} className="w-full" asChild>
                  <Link to="/iletisim">Teklif Al</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-card">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Sıkça Sorulan Sorular</h2>
            <p className="text-muted-foreground mt-2">Colocation hizmetimiz hakkında merak ettikleriniz.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="gradient-navy rounded-2xl p-10 md:p-16 text-center text-secondary-foreground">
            <Rocket className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl font-bold">Veri Merkezimizi Keşfedin</h2>
            <p className="text-secondary-foreground/70 mt-3 max-w-lg mx-auto">
              Veri merkezimizi yerinde görün, uzmanlarımızla ihtiyaçlarınızı konuşun. Ücretsiz tur ve danışmanlık için hemen iletişime geçin.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Button variant="hero" size="lg" asChild>
                <Link to="/iletisim">Ücretsiz Tur Rezervasyonu <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white/50 text-white bg-white/10 hover:bg-white/20" asChild>
                <Link to="/iletisim">Teklif Al</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
