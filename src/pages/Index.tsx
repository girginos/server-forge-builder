import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { SITE_URL } from "@/config/site";
import { getProductUrl } from "@/config/hardware-categories";
import ServerCard from "@/components/ServerCard";
import HeroSlider from "@/components/HeroSlider";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import {
  Shield, Settings, Cpu, Zap, Truck, Headphones,
  Globe, Database, Layers, ArrowRight, CheckCircle2,
  Users, Award, Server, Clock, Package, Brain,
  HardDrive, ChevronRight, ShoppingCart
} from "lucide-react";
import colocationBg from "@/assets/colocation-bg.jpg";

interface FeaturedProduct {
  id: string;
  name: string;
  image_url: string | null;
  description: string | null;
  category: string;
  price: number;
  specs: Record<string, string>;
  in_stock: boolean;
  featured: boolean;
}

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
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    supabase
      .from("admin_products")
      .select("*")
      .eq("featured", true)
      .eq("in_stock", true)
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => {
        setFeaturedProducts(
          (data || []).map((p: any) => ({
            ...p,
            specs: typeof p.specs === "object" ? p.specs : {},
          }))
        );
      });
  }, []);

  return (
    <div>
      <SEO
        title="Kurumsal Sunucu Donanım Çözümleri"
        description="Türkiye'nin güvenilir sunucu donanım tedarikçisi. Dell, HP, Supermicro sunucu satışı, yapılandırma, colocation ve cloud hizmetleri."
        keywords="sunucu satış, server donanım, dell poweredge, hp proliant, supermicro, sunucu yapılandırma, colocation"
        canonical="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "ServerMarket",
          url: SITE_URL,
          description: "Türkiye'nin güvenilir sunucu donanım tedarikçisi.",
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/hardware?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
          publisher: {
            "@type": "Organization",
            name: "ServerMarket",
            url: SITE_URL,
            contactPoint: { "@type": "ContactPoint", telephone: "+90-212-555-0000", contactType: "sales", areaServed: "TR", availableLanguage: "Turkish" },
          },
        }}
      />
      {/* ── Hero Slider ── */}
      <HeroSlider />

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
              <h2 className="text-3xl font-bold text-foreground">Öne Çıkan Ürünler</h2>
              <p className="text-muted-foreground mt-2">Editör seçimi en popüler donanım ürünleri</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/hardware">Tümünü Gör <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <Link
                  key={p.id}
                  to={getProductUrl(p.category, (p as any).slug || p.id)}
                  className="group bg-card rounded-lg border shadow-card hover:shadow-glow transition-all duration-300 overflow-hidden flex flex-col h-full"
                >
                  <div className="relative p-4 flex items-center justify-center h-52 bg-muted/30">
                    {p.featured && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-primary text-primary-foreground text-[10px]">Öne Çıkan</Badge>
                      </div>
                    )}
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="max-h-44 object-contain group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    ) : (
                      <Server className="h-16 w-16 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    {p.specs?.brand && (
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{p.specs.brand}</span>
                    )}
                    <h3 className="font-semibold text-foreground leading-tight min-h-[2.5rem]">{p.name}</h3>
                    {p.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                    )}
                    <div className="flex items-baseline gap-2 mt-auto pt-3">
                      <span className="text-lg font-bold text-foreground">₺{p.price.toLocaleString("tr-TR")}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="hero" size="sm" className="flex-1" onClick={(e) => e.preventDefault()}>
                        Detayları Gör <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          addItem({ id: p.id, name: p.name, price: p.price, image: p.image_url || undefined });
                        }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg border h-80 animate-pulse" />
              ))}
            </div>
          )}
          <div className="text-center mt-6 sm:hidden">
            <Button variant="outline" asChild>
              <Link to="/hardware">Tüm Ürünleri Gör <ArrowRight className="h-4 w-4" /></Link>
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
