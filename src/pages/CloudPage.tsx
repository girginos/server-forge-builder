import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Cloud as CloudIcon, Database, Globe, Shield, Cpu, BarChart3,
  CheckCircle2, ArrowRight, Layers, HardDrive, Network, Headphones,
  TrendingUp, Clock, Rocket, ChevronDown, ChevronUp
} from "lucide-react";
import { useState } from "react";
import cloudBg from "@/assets/cloud-bg.jpg";
import SEO from "@/components/SEO";

const services = [
  { icon: CloudIcon, title: "Cloud Sunucu", desc: "Saniyeler içinde ölçeklenebilir sanal sunucular. CPU, RAM ve disk kaynaklarını ihtiyacınıza göre ayarlayın.", features: ["Anında ölçekleme", "Saatlik faturalandırma", "Otomatik yedekleme"] },
  { icon: Database, title: "Cloud Depolama", desc: "Yüksek performanslı NVMe SSD blok depolama ve S3 uyumlu nesne depolama.", features: ["NVMe SSD performans", "S3 uyumlu API", "Coğrafi yedekleme"] },
  { icon: Globe, title: "CDN", desc: "50+ lokasyonda global içerik dağıtım ağı ile kullanıcılarınıza en yakın noktadan hizmet.", features: ["50+ PoP noktası", "SSL/TLS desteği", "DDoS koruması"] },
  { icon: Shield, title: "Cloud Güvenlik", desc: "Kurumsal düzeyde güvenlik duvarı, IDS/IPS ve gelişmiş DDoS koruma çözümleri.", features: ["L3-L7 güvenlik duvarı", "IDS/IPS sistemi", "WAF koruması"] },
  { icon: Cpu, title: "Yönetilen Kubernetes", desc: "Tam yönetilen Kubernetes kümeleri ile container uygulamalarınızı kolayca orkestre edin.", features: ["Otomatik ölçekleme", "Helm desteği", "CI/CD entegrasyonu"] },
  { icon: BarChart3, title: "İzleme & Analitik", desc: "Gerçek zamanlı performans izleme, log yönetimi ve akıllı uyarı sistemi.", features: ["Gerçek zamanlı metrikler", "Özel dashboard", "Slack/Teams uyarıları"] },
];

const plans = [
  { name: "Starter", vcpu: "2 vCPU", ram: "4 GB RAM", disk: "80 GB SSD", bw: "2 TB", price: "₺750", period: "/ay", features: ["1 Snapshot", "Temel izleme", "Email destek", "99.5% SLA"] },
  { name: "Business", vcpu: "4 vCPU", ram: "8 GB RAM", disk: "160 GB SSD", bw: "4 TB", price: "₺1.400", period: "/ay", popular: true, features: ["5 Snapshot", "Gelişmiş izleme", "7/24 destek", "99.9% SLA", "Otomatik yedekleme"] },
  { name: "Enterprise", vcpu: "8 vCPU", ram: "16 GB RAM", disk: "320 GB NVMe", bw: "8 TB", price: "₺2.600", period: "/ay", features: ["Sınırsız Snapshot", "Premium izleme", "Öncelikli destek", "99.99% SLA", "Otomatik yedekleme", "DDoS koruması"] },
];

const stats = [
  { value: "99.99%", label: "Uptime Garantisi" },
  { value: "50+", label: "PoP Noktası" },
  { value: "<10ms", label: "Ortalama Gecikme" },
  { value: "7/24", label: "Teknik Destek" },
];

const advantages = [
  { icon: TrendingUp, title: "Esnek Ölçekleme", desc: "İhtiyacınız arttığında saniyeler içinde kaynaklarınızı artırın, azaldığında düşürün." },
  { icon: Clock, title: "Saatlik Faturalandırma", desc: "Yalnızca kullandığınız kadar ödeyin. Aylık taahhüt yok, istediğiniz zaman iptal." },
  { icon: Layers, title: "Çoklu Bölge", desc: "İstanbul, Ankara ve Frankfurt veri merkezlerinde sunucularınızı konumlandırın." },
  { icon: HardDrive, title: "NVMe Performans", desc: "Tüm planlarda NVMe SSD disk ile yüksek I/O performansı garantisi." },
  { icon: Network, title: "Özel Ağ", desc: "VLAN ve VPN ile tamamen izole özel ağ altyapısı kurun." },
  { icon: Headphones, title: "Uzman Destek", desc: "Sertifikalı sistem yöneticileri ile 7/24 teknik destek ve danışmanlık." },
];

const faqs = [
  { q: "Cloud sunucu ne kadar sürede hazır olur?", a: "Siparişiniz onaylandıktan sonra cloud sunucunuz 30 saniye içinde otomatik olarak oluşturulur ve kullanıma hazır hale gelir." },
  { q: "Sunucumu istediğim zaman ölçekleyebilir miyim?", a: "Evet, kontrol panelinizden CPU, RAM ve disk kaynaklarınızı istediğiniz zaman artırabilir veya azaltabilirsiniz. Değişiklikler anında uygulanır." },
  { q: "Veri yedekleme nasıl yapılıyor?", a: "Business ve Enterprise planlarda otomatik günlük yedekleme mevcuttur. Ayrıca istediğiniz zaman manuel snapshot alabilirsiniz." },
  { q: "Hangi işletim sistemlerini destekliyorsunuz?", a: "Ubuntu, CentOS, Debian, AlmaLinux, Rocky Linux, Windows Server 2019/2022 ve özel ISO yükleme desteği sunuyoruz." },
  { q: "DDoS saldırılarına karşı korumalı mıyım?", a: "Tüm cloud sunucularımız temel DDoS koruması altındadır. Enterprise planda gelişmiş L7 DDoS koruması dahildir." },
  { q: "Mevcut sunucumu cloud'a taşıyabilir misiniz?", a: "Evet, uzman ekibimiz mevcut fiziksel veya sanal sunucularınızı sıfır kesinti ile cloud altyapımıza taşıyabilir." },
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

export default function CloudPage() {
  return (
    <div>
      <SEO
        title="Cloud Çözümleri"
        description="Ölçeklenebilir cloud sunucu, depolama ve CDN hizmetleri. Esnek, güvenli ve yüksek performanslı bulut altyapısı."
        keywords="cloud sunucu, bulut hizmetleri, vps, sanal sunucu, cloud depolama, CDN, kubernetes"
        canonical="/cloud"
      />

      {/* Hero */}
      <section className="relative h-96 overflow-hidden">
        <img src={cloudBg} alt="Cloud altyapı" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-navy opacity-80" />
        <div className="relative container h-full flex items-center">
          <div className="text-secondary-foreground max-w-2xl">
            <span className="inline-block bg-primary/20 text-primary-foreground text-xs px-3 py-1 rounded-full mb-4 font-medium border border-primary/30">
              ☁️ Bulut Altyapı
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">Kurumsal Cloud Çözümleri</h1>
            <p className="text-secondary-foreground/80 mt-4 text-lg max-w-lg">
              Esnek, güvenli ve yüksek performanslı bulut altyapısı ile işletmenizi geleceğe taşıyın.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Button variant="hero" size="lg" asChild>
                <Link to="/iletisim">Ücretsiz Danışmanlık <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
              <Button variant="outline" size="lg" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
                Planları İncele
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

      {/* Services */}
      <section className="py-20 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Cloud Hizmetlerimiz</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">İşletmenizin ihtiyaçlarına özel kapsamlı bulut çözümleri sunuyoruz.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.title} className="bg-background border rounded-lg p-6 hover:shadow-card hover:border-primary/30 transition-all group">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-lg">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
                <ul className="mt-4 space-y-1.5">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Neden ServerMarket Cloud?</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Kurumsal düzeyde altyapı, rekabetçi fiyatlarla.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((a) => (
              <div key={a.title} className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <a.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{a.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Cloud Sunucu Planları</h2>
            <p className="text-muted-foreground mt-2">İhtiyacınıza en uygun planı seçin, hemen başlayın.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((p) => (
              <div key={p.name} className={`bg-background border rounded-xl p-8 flex flex-col ${p.popular ? "ring-2 ring-primary shadow-glow relative" : ""}`}>
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-4 py-1 rounded-full font-medium">
                    En Popüler
                  </span>
                )}
                <h3 className="font-semibold text-foreground text-xl text-center">{p.name}</h3>
                <div className="my-6 text-center">
                  <span className="text-4xl font-bold text-foreground">{p.price}</span>
                  <span className="text-muted-foreground text-sm">{p.period}</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground font-mono mb-4 bg-muted/30 rounded-lg p-4">
                  <p>{p.vcpu}</p>
                  <p>{p.ram}</p>
                  <p>{p.disk}</p>
                  <p>{p.bw} Transfer</p>
                </div>
                <ul className="space-y-2 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant={p.popular ? "hero" : "outline"} className="w-full" size="lg" asChild>
                  <Link to="/iletisim">Hemen Başla</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Sıkça Sorulan Sorular</h2>
            <p className="text-muted-foreground mt-2">Cloud hizmetlerimiz hakkında merak ettikleriniz.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card">
        <div className="container">
          <div className="gradient-navy rounded-2xl p-10 md:p-16 text-center text-secondary-foreground">
            <Rocket className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl font-bold">Cloud Yolculuğunuza Başlayın</h2>
            <p className="text-secondary-foreground/70 mt-3 max-w-lg mx-auto">
              Uzman ekibimiz işletmeniz için en uygun cloud çözümünü birlikte tasarlasın. İlk ay %20 indirimle başlayın.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Button variant="hero" size="lg" asChild>
                <Link to="/iletisim">Ücretsiz Teklif Al <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
              <Button variant="outline" size="lg" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10" asChild>
                <Link to="/iletisim">Demo Talep Et</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
