import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ServerCard from "@/components/ServerCard";
import { Shield, Settings, Cpu, Zap, Truck, Headphones } from "lucide-react";
import heroImage from "@/assets/hero-server.png";
import serverR740 from "@/assets/server-r740.png";
import serverR640 from "@/assets/server-r640.png";
import serverDL380 from "@/assets/server-dl380.png";
import serverSupermicro from "@/assets/server-supermicro.png";

const servers = [
  {
    id: "dell-r740xd",
    name: "Dell PowerEdge R740xd",
    image: serverR740,
    formFactor: "2U Rack Mount",
    cpu: "2x Intel Xeon Scalable",
    maxRam: "3072 GB DDR4 (24 Slot)",
    price: 45000,
    oldPrice: 52000,
    badge: "Popüler",
  },
  {
    id: "dell-r640",
    name: "Dell PowerEdge R640",
    image: serverR640,
    formFactor: "1U Rack Mount",
    cpu: "2x Intel Xeon Scalable",
    maxRam: "2048 GB DDR4",
    price: 32000,
  },
  {
    id: "hp-dl380",
    name: "HP ProLiant DL380 Gen10",
    image: serverDL380,
    formFactor: "2U Rack Mount",
    cpu: "2x Intel Xeon Scalable",
    maxRam: "3072 GB DDR4",
    price: 38000,
    badge: "Yeni",
  },
  {
    id: "supermicro-2u",
    name: "Supermicro SuperServer 2U",
    image: serverSupermicro,
    formFactor: "2U Rack Mount",
    cpu: "2x Intel Xeon Scalable",
    maxRam: "4096 GB DDR4",
    price: 55000,
    oldPrice: 62000,
  },
];

const features = [
  { icon: Shield, title: "1 Yıl Garanti", desc: "Tüm sunucularda standart garanti" },
  { icon: Settings, title: "Esnek Yapılandırma", desc: "CPU, RAM ve depolama özelleştirme" },
  { icon: Cpu, title: "Test Edilmiş Donanım", desc: "Kapsamlı stres testi uygulanmış" },
  { icon: Zap, title: "Hızlı Kurulum", desc: "Siparişten sonra hızlı kargo" },
  { icon: Truck, title: "Ücretsiz Kargo", desc: "₺50.000 üzeri siparişlerde" },
  { icon: Headphones, title: "7/24 Destek", desc: "Teknik destek her zaman yanınızda" },
];

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero text-secondary-foreground relative overflow-hidden">
        <div className="container py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-medium text-teal">
                <Settings className="h-3 w-3" /> Esnek Yapılandırma
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-medium text-teal">
                <Shield className="h-3 w-3" /> Garantili Donanım
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              Kurumsal Sunucu{" "}
              <span className="text-gradient">Çözümleri</span>
            </h1>
            <p className="text-lg text-secondary-foreground/70 max-w-lg">
              İşletmeniz için <strong className="text-secondary-foreground">enterprise sınıfı performans</strong>. 
              Tamamen test edilmiş ve ihtiyacınıza göre yapılandırılmış sunucu donanımları.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" size="lg" asChild>
                <Link to="/yapilandirici"><Settings className="h-5 w-5" /> Sunucu Yapılandır</Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/donanim">Hazır Sunucular</Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden lg:block animate-slide-in-right">
            <img src={heroImage} alt="Sunucu donanımları" className="rounded-xl shadow-2xl" />
            <div className="absolute -bottom-4 -right-4 bg-teal rounded-lg px-5 py-3 text-center shadow-glow">
              <p className="text-2xl font-bold text-accent-foreground">%40'a</p>
              <p className="text-xs font-medium text-accent-foreground/80">varan indirimler</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="border-b bg-card">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <f.icon className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular servers */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">Popüler Sunucu Modelleri</h2>
            <p className="text-muted-foreground mt-2">Başlangıç noktanızı seçin, ardından ihtiyacınıza göre özelleştirin.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {servers.map((server) => (
              <ServerCard key={server.id} {...server} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-navy text-secondary-foreground py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Toplu Alımlarda Özel Fiyatlar</h2>
          <p className="text-secondary-foreground/70 mb-6 max-w-lg mx-auto">
            10 adet ve üzeri sunucu siparişlerinde kurumsal indirimlerden yararlanın.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/iletisim">Teklif Alın</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
