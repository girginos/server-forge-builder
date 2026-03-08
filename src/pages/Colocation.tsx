import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Server, Shield, Zap, Wifi, Lock, Clock } from "lucide-react";
import colocationBg from "@/assets/colocation-bg.jpg";
import SEO from "@/components/SEO";

const features = [
  { icon: Server, title: "Tier III+ Veri Merkezi", desc: "%99.98 uptime garantisi ile kesintisiz hizmet." },
  { icon: Shield, title: "Fiziksel Güvenlik", desc: "24/7 güvenlik, biyometrik erişim kontrolü." },
  { icon: Zap, title: "Yedekli Güç", desc: "UPS ve dizel jeneratör ile kesintisiz enerji." },
  { icon: Wifi, title: "Yüksek Bant Genişliği", desc: "10Gbps+ bağlantı seçenekleri." },
  { icon: Lock, title: "DDoS Koruması", desc: "Gelişmiş DDoS koruma altyapısı." },
  { icon: Clock, title: "7/24 Destek", desc: "NOC ekibi ile anında müdahale." },
];

const plans = [
  { name: "1U Colocation", price: "₺2.500", period: "/ay", specs: ["1U Alan", "1 IP Adresi", "1Gbps Port", "1kW Güç"] },
  { name: "2U Colocation", price: "₺4.000", period: "/ay", specs: ["2U Alan", "2 IP Adresi", "1Gbps Port", "1.5kW Güç"], popular: true },
  { name: "Quarter Rack", price: "₺8.000", period: "/ay", specs: ["10U Alan", "8 IP Adresi", "10Gbps Port", "3kW Güç"] },
  { name: "Half Rack", price: "₺14.000", period: "/ay", specs: ["21U Alan", "16 IP Adresi", "10Gbps Port", "5kW Güç"] },
];

export default function Colocation() {
  return (
    <div>
      <SEO
        title="Colocation Hizmetleri"
        description="Tier III+ veri merkezlerinde sunucu barındırma. Yedekli güç, 7/24 güvenlik, yüksek bant genişliği ile kesintisiz colocation hizmetleri."
        keywords="colocation, sunucu barındırma, veri merkezi, datacenter, server hosting, rack kirala"
        canonical="/colocation"
      />
      <section className="relative h-80 overflow-hidden">
        <img src={colocationBg} alt="Colocation veri merkezi" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-navy opacity-80" />
        <div className="relative container h-full flex items-center">
          <div className="text-secondary-foreground">
            <h1 className="text-4xl font-bold">Colocation Hizmetleri</h1>
            <p className="text-secondary-foreground/70 mt-2 max-w-lg">Sunucularınızı Türkiye'nin en güvenilir veri merkezlerinde barındırın.</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Neden Biz?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-background border rounded-lg p-6 hover:shadow-card transition-shadow">
                <f.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Colocation Planları</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((p) => (
              <div key={p.name} className={`bg-card border rounded-lg p-6 text-center ${p.popular ? "ring-2 ring-primary shadow-glow" : ""}`}>
                {p.popular && <span className="inline-block bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full mb-3 font-medium">Popüler</span>}
                <h3 className="font-semibold text-foreground text-lg">{p.name}</h3>
                <div className="my-4">
                  <span className="text-3xl font-bold text-foreground">{p.price}</span>
                  <span className="text-muted-foreground text-sm">{p.period}</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  {p.specs.map((s) => <li key={s}>{s}</li>)}
                </ul>
                <Button variant={p.popular ? "hero" : "outline"} className="w-full" asChild>
                  <Link to="/iletisim">Teklif Al</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
