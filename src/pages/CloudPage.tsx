import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Cloud as CloudIcon, Database, Globe, Shield, Cpu, BarChart3 } from "lucide-react";
import cloudBg from "@/assets/cloud-bg.jpg";
import SEO from "@/components/SEO";

const services = [
  { icon: CloudIcon, title: "Cloud Sunucu", desc: "Ölçeklenebilir sanal sunucu çözümleri." },
  { icon: Database, title: "Cloud Depolama", desc: "Yüksek performanslı blok ve nesne depolama." },
  { icon: Globe, title: "CDN", desc: "Global içerik dağıtım ağı." },
  { icon: Shield, title: "Cloud Güvenlik", desc: "Güvenlik duvarı ve DDoS koruması." },
  { icon: Cpu, title: "Yönetilen Kubernetes", desc: "Container orkestrasyon hizmetleri." },
  { icon: BarChart3, title: "İzleme & Analitik", desc: "Gerçek zamanlı performans izleme." },
];

const plans = [
  { name: "Starter", vcpu: "2 vCPU", ram: "4 GB", disk: "80 GB SSD", bw: "2 TB", price: "₺750", period: "/ay" },
  { name: "Business", vcpu: "4 vCPU", ram: "8 GB", disk: "160 GB SSD", bw: "4 TB", price: "₺1.400", period: "/ay", popular: true },
  { name: "Enterprise", vcpu: "8 vCPU", ram: "16 GB", disk: "320 GB NVMe", bw: "8 TB", price: "₺2.600", period: "/ay" },
];

export default function CloudPage() {
  return (
    <div>
      <section className="relative h-80 overflow-hidden">
        <img src={cloudBg} alt="Cloud altyapı" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-navy opacity-70" />
        <div className="relative container h-full flex items-center">
          <div className="text-secondary-foreground">
            <h1 className="text-4xl font-bold">Cloud Çözümleri</h1>
            <p className="text-secondary-foreground/70 mt-2 max-w-lg">Esnek, güvenli ve ölçeklenebilir bulut altyapısı.</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Cloud Hizmetlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.title} className="bg-background border rounded-lg p-6 hover:shadow-card transition-shadow">
                <s.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Cloud Sunucu Planları</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((p) => (
              <div key={p.name} className={`bg-card border rounded-lg p-6 text-center ${p.popular ? "ring-2 ring-primary shadow-glow" : ""}`}>
                {p.popular && <span className="inline-block bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full mb-3 font-medium">Popüler</span>}
                <h3 className="font-semibold text-foreground text-lg">{p.name}</h3>
                <div className="my-4">
                  <span className="text-3xl font-bold text-foreground">{p.price}</span>
                  <span className="text-muted-foreground text-sm">{p.period}</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground font-mono mb-6">
                  <li>{p.vcpu}</li>
                  <li>{p.ram}</li>
                  <li>{p.disk}</li>
                  <li>{p.bw} Transfer</li>
                </ul>
                <Button variant={p.popular ? "hero" : "outline"} className="w-full" asChild>
                  <Link to="/iletisim">Başla</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
