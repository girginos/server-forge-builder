import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ServerCard from "@/components/ServerCard";
import {
  Shield, Settings, Cpu, Zap, Truck, Headphones,
  Globe, Database, Layers, ArrowRight, CheckCircle2,
  Users, Award, Server, Clock, Package, Brain,
  HardDrive, ChevronRight
} from "lucide-react";
import heroImage from "@/assets/hero-server.png";
import colocationBg from "@/assets/colocation-bg.jpg";
import serverR740 from "@/assets/server-r740.png";
import serverR640 from "@/assets/server-r640.png";
import serverDL380 from "@/assets/server-dl380.png";
import serverSupermicro from "@/assets/server-supermicro.png";

const servers = [
  { id: "dell-r740xd", name: "Dell PowerEdge R740xd", image: serverR740, formFactor: "2U Rack Mount", cpu: "2x Intel Xeon Scalable", maxRam: "3072 GB DDR4 (24 Slot)", price: 45000, oldPrice: 52000, badge: "Popüler" },
  { id: "dell-r640", name: "Dell PowerEdge R640", image: serverR640, formFactor: "1U Rack Mount", cpu: "2x Intel Xeon Scalable", maxRam: "2048 GB DDR4", price: 32000 },
  { id: "hp-dl380", name: "HP ProLiant DL380 Gen10", image: serverDL380, formFactor: "2U Rack Mount", cpu: "2x Intel Xeon Scalable", maxRam: "3072 GB DDR4", price: 38000, badge: "Yeni" },
  { id: "supermicro-2u", name: "Supermicro SuperServer 2U", image: serverSupermicro, formFactor: "2U Rack Mount", cpu: "2x Intel Xeon Scalable", maxRam: "4096 GB DDR4", price: 55000, oldPrice: 62000 },
];

const features = [
  { icon: Shield, title: "1 Yıl Garanti", desc: "Tüm sunucularda standart garanti" },
  { icon: Settings, title: "Esnek Yapılandırma", desc: "CPU, RAM ve depolama özelleştirme" },
  { icon: Cpu, title: "Test Edilmiş Donanım", desc: "Kapsamlı stres testi uygulanmış" },
  { icon: Zap, title: "Hızlı Kurulum", desc: "Siparişten sonra hızlı kargo" },
  { icon: Truck, title: "Ücretsiz Kargo", desc: "₺50.000 üzeri siparişlerde" },
  { icon: Headphones, title: "7/24 Destek", desc: "Teknik destek her zaman yanınızda" },
];

const categories = [
  { icon: Globe, title: "Web Sunucu", desc: "Yüksek trafikli web siteleri için", href: "/hazir-paketler", color: "text-primary" },
  { icon: Database, title: "Veritabanı Sunucu", desc: "IOPS odaklı yüksek performans", href: "/hazir-paketler", color: "text-teal" },
  { icon: Layers, title: "Sanallaştırma", desc: "VMware / Hyper-V platformları", href: "/hazir-paketler", color: "text-primary" },
  { icon: Brain, title: "AI / HPC", desc: "GPU destekli hesaplama", href: "/hazir-paketler", color: "text-teal" },
  { icon: HardDrive, title: "Depolama", desc: "Büyük veri ve yedekleme", href: "/hazir-paketler", color: "text-primary" },
  { icon: Package, title: "Özel Paket", desc: "Size özel yapılandırma", href: "/yapilandirici", color: "text-teal" },
];

const stats = [
  { value: "500+", label: "Mutlu Müşteri", icon: Users },
  { value: "15+", label: "Yıllık Deneyim", icon: Award },
  { value: "10.000+", label: "Satılan Sunucu", icon: Server },
  { value: "7/24", label: "Teknik Destek", icon: Clock },
];

const steps = [
  { step: "01", title: "Model Seçin", desc: "İhtiyacınıza uygun sunucu modelini belirleyin." },
  { step: "02", title: "Yapılandırın", desc: "CPU, RAM, depolama ve ağ seçeneklerini özelleştirin." },
  { step: "03", title: "Teklif Alın", desc: "Sepetinizi oluşturun ve teklif talebinizi gönderin." },
  { step: "04", title: "Teslim Alın", desc: "Test edilmiş sunucunuz kapınıza gelsin." },
];

const brands = [
  { name: "Dell", models: "PowerEdge R640, R740, R740xd" },
  { name: "HP", models: "ProLiant DL360, DL380 Gen10" },
  { name: "Supermicro", models: "SuperServer 1U, 2U" },
  { name: "Lenovo", models: "ThinkSystem SR630, SR650" },
];

const testimonials = [
  { name: "Ahmet Yılmaz", company: "TechCorp A.Ş.", text: "ServerMarket ile 50+ sunucu tedarik ettik. Hem fiyat hem kalite açısından çok memnunuz.", rating: 5 },
  { name: "Elif Kaya", company: "CloudNet Teknoloji", text: "Yapılandırıcı aracı ile ihtiyacımıza tam uygun sunucuları kolayca oluşturabildik.", rating: 5 },
  { name: "Mehmet Demir", company: "DataPro Bilişim", text: "7/24 teknik destek ve hızlı teslimat ile projelerimiz hiç aksamadı.", rating: 5 },
];

export default function Index() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="gradient-hero text-secondary-foreground relative overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="container py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center relative">
          <div className="space-y-7">
            <div className="flex flex-wrap gap-2 animate-fade-in opacity-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-medium text-teal">
                <Settings className="h-3 w-3" /> Esnek Yapılandırma
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-medium text-teal">
                <Shield className="h-3 w-3" /> Garantili Donanım
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-medium text-teal">
                <Cpu className="h-3 w-3" /> Stres Testli
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] animate-fade-in-delay-1 opacity-0">
              Kurumsal Sunucu{" "}
              <span className="text-gradient">Çözümleri</span>
              <br />
              <span className="text-2xl lg:text-3xl font-medium text-secondary-foreground/60 mt-2 block">
                Güç. Güvenilirlik. Performans.
              </span>
            </h1>
            <p className="text-lg text-secondary-foreground/70 max-w-lg animate-fade-in-delay-2 opacity-0">
              İşletmeniz için <strong className="text-secondary-foreground">enterprise sınıfı performans</strong>.
              Tamamen test edilmiş ve ihtiyacınıza göre yapılandırılmış sunucu donanımları.
            </p>
            <div className="flex flex-wrap gap-3 animate-fade-in-delay-2 opacity-0">
              <Button variant="hero" size="lg" asChild>
                <Link to="/yapilandirici"><Settings className="h-5 w-5" /> Sunucu Yapılandır</Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/hazir-paketler">Hazır Paketler</Link>
              </Button>
            </div>
            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-2 animate-fade-in-delay-2 opacity-0">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-navy-light border-2 border-navy flex items-center justify-center text-[10px] font-bold text-teal">
                    {["AY", "EK", "MD", "SK"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-warning text-sm">★</span>
                  ))}
                </div>
                <p className="text-xs text-secondary-foreground/50">500+ müşteri güveniyor</p>
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <img src={heroImage} alt="Sunucu donanımları" className="rounded-xl shadow-2xl animate-fade-in opacity-0" />
            <div className="absolute -bottom-5 -right-5 bg-teal rounded-xl px-6 py-4 text-center shadow-glow animate-pulse-glow">
              <p className="text-3xl font-bold text-accent-foreground">%40'a</p>
              <p className="text-xs font-medium text-accent-foreground/80">varan indirimler</p>
            </div>
            <div className="absolute -top-3 -left-3 bg-card rounded-lg px-4 py-3 shadow-card animate-float border">
              <p className="text-xs font-medium text-foreground flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> 72 Saat Stres Testi</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Bar ── */}
      <section className="border-b bg-card">
        <div className="container py-7">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="flex items-center gap-3 group"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{f.title}</p>
                  <p className="text-[11px] text-muted-foreground leading-tight">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">Kullanım Amacına Göre Sunucu Seçin</h2>
            <p className="text-muted-foreground mt-2">İş yükünüze uygun hazır paket kategorileri</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.title}
                to={cat.href}
                className="bg-card border rounded-xl p-5 text-center hover:shadow-glow hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <cat.icon className={`h-6 w-6 ${cat.color}`} />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{cat.title}</h3>
                <p className="text-[11px] text-muted-foreground mt-1">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Servers ── */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Popüler Sunucu Modelleri</h2>
              <p className="text-muted-foreground mt-2">Başlangıç noktanızı seçin, ardından ihtiyacınıza göre özelleştirin.</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/donanim">Tümünü Gör <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {servers.map((server) => (
              <ServerCard key={server.id} {...server} />
            ))}
          </div>
          <div className="text-center mt-6 sm:hidden">
            <Button variant="outline" asChild>
              <Link to="/donanim">Tüm Sunucuları Gör <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 bg-card border-y">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Nasıl Çalışır?</h2>
            <p className="text-muted-foreground mt-2">4 adımda sunucunuzu teslim alın</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary via-teal to-primary opacity-20" />
            {steps.map((s, i) => (
              <div key={s.step} className="relative text-center group">
                <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold text-lg shadow-glow group-hover:scale-110 transition-transform relative z-10">
                  {s.step}
                </div>
                <h3 className="font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-7 -right-3 h-5 w-5 text-primary/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="gradient-navy text-secondary-foreground py-14">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center group">
                <div className="h-12 w-12 rounded-xl bg-teal/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-teal/20 transition-colors">
                  <s.icon className="h-6 w-6 text-teal" />
                </div>
                <p className="text-3xl lg:text-4xl font-bold text-secondary-foreground">{s.value}</p>
                <p className="text-sm text-secondary-foreground/60 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brands ── */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">Çalıştığımız Markalar</h2>
            <p className="text-muted-foreground mt-2">Dünya lideri üreticilerin sunucu donanımları</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {brands.map((b) => (
              <div key={b.name} className="bg-card border rounded-xl p-6 text-center hover:shadow-card transition-shadow">
                <h3 className="text-2xl font-bold text-foreground">{b.name}</h3>
                <p className="text-xs text-muted-foreground mt-2 font-mono">{b.models}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">Müşterilerimiz Ne Diyor?</h2>
            <p className="text-muted-foreground mt-2">Güvenilir hizmetin kanıtı</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card border rounded-xl p-6 hover:shadow-card transition-shadow">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="text-warning text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed">"{t.text}"</p>
                <div className="mt-4 pt-4 border-t flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Colocation Banner ── */}
      <section className="relative h-72 overflow-hidden">
        <img src={colocationBg} alt="Veri merkezi" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-navy opacity-80" />
        <div className="relative container h-full flex items-center justify-between">
          <div className="text-secondary-foreground">
            <h2 className="text-3xl font-bold">Colocation Hizmetleri</h2>
            <p className="text-secondary-foreground/70 mt-2 max-w-lg">Tier III+ veri merkezlerimizde sunucularınızı güvenle barındırın.</p>
            <Button variant="hero" className="mt-4" asChild>
              <Link to="/colocation">Detaylı Bilgi <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-card">
        <div className="container text-center max-w-2xl">
          <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5 shadow-glow">
            <Headphones className="h-7 w-7 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Toplu Alımlarda Özel Fiyatlar</h2>
          <p className="text-muted-foreground mt-3 mb-6">
            10 adet ve üzeri sunucu siparişlerinde kurumsal indirimlerden yararlanın. Uzman ekibimiz projenize özel çözüm üretsin.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/iletisim">Teklif Alın</Link>
            </Button>
            <Button variant="navy" size="lg" asChild>
              <Link to="/hakkimizda">Bizi Tanıyın</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
