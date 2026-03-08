import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Database, Layers, Brain, HardDrive, ShoppingCart, Check } from "lucide-react";
import SEO from "@/components/SEO";
import { useCart } from "@/context/CartContext";
import serverR740 from "@/assets/server-r740.png";
import serverR640 from "@/assets/server-r640.png";
import serverDL380 from "@/assets/server-dl380.png";
import serverSupermicro from "@/assets/server-supermicro.png";

const categories = [
  { id: "web", label: "Web Sunucu", icon: Globe, desc: "Yüksek trafikli web siteleri ve uygulamalar için optimize edilmiş sunucular." },
  { id: "db", label: "Veritabanı Sunucu", icon: Database, desc: "IOPS odaklı, yüksek bellek kapasiteli veritabanı sunucuları." },
  { id: "virt", label: "Sanallaştırma Sunucu", icon: Layers, desc: "VMware, Hyper-V ve KVM için çok çekirdekli sanallaştırma platformları." },
  { id: "ai", label: "AI / HPC Sunucu", icon: Brain, desc: "Yapay zeka ve yoğun hesaplama iş yükleri için GPU destekli sunucular." },
  { id: "storage", label: "Depolama Sunucu", icon: HardDrive, desc: "Büyük veri arşivleme ve yedekleme çözümleri." },
];

interface PackageData {
  id: string;
  name: string;
  category: string;
  image: string;
  popular?: boolean;
  price: number;
  oldPrice?: number;
  specs: string[];
}

const packages: PackageData[] = [
  // Web
  { id: "web-starter", name: "Web Starter", category: "web", image: serverR640, price: 28000, specs: ["1x Xeon Silver 4210 (10C/20T)", "64 GB DDR4 ECC", "2x 480GB SSD SATA", "4x 1GbE", "1U Rack Mount"] },
  { id: "web-pro", name: "Web Professional", category: "web", image: serverR640, price: 42000, oldPrice: 48000, popular: true, specs: ["2x Xeon Silver 4214 (12C/24T)", "128 GB DDR4 ECC", "4x 960GB SSD SATA", "2x 10GbE SFP+", "1U Rack Mount"] },
  { id: "web-enterprise", name: "Web Enterprise", category: "web", image: serverR740, price: 68000, specs: ["2x Xeon Gold 6230 (20C/40T)", "256 GB DDR4 ECC", "4x 1.92TB SSD NVMe", "2x 25GbE SFP28", "2U Rack Mount"] },
  // DB
  { id: "db-starter", name: "DB Starter", category: "db", image: serverR740, price: 45000, specs: ["2x Xeon Silver 4214 (12C/24T)", "128 GB DDR4 ECC", "4x 960GB SSD SAS", "PERC H740p 8GB", "2U Rack Mount"] },
  { id: "db-pro", name: "DB Professional", category: "db", image: serverDL380, price: 72000, oldPrice: 82000, popular: true, specs: ["2x Xeon Gold 6248 (20C/40T)", "256 GB DDR4 ECC", "8x 960GB SSD NVMe", "PERC H740p 8GB", "2U Rack Mount"] },
  { id: "db-enterprise", name: "DB Enterprise", category: "db", image: serverSupermicro, price: 120000, specs: ["2x Xeon Gold 6258R (28C/56T)", "512 GB DDR4 ECC", "12x 1.92TB SSD NVMe", "HBA330 + H740p", "2U Rack Mount"] },
  // Virt
  { id: "virt-starter", name: "Sanal Starter", category: "virt", image: serverR740, price: 52000, specs: ["2x Xeon Silver 4216 (16C/32T)", "128 GB DDR4 ECC", "2x 480GB SSD (Boot)", "4x 1.2TB SAS 10K", "2U Rack Mount"] },
  { id: "virt-pro", name: "Sanal Professional", category: "virt", image: serverDL380, price: 85000, oldPrice: 95000, popular: true, specs: ["2x Xeon Gold 6230 (20C/40T)", "256 GB DDR4 ECC", "2x 480GB SSD (Boot)", "8x 1.92TB SSD NVMe", "2U Rack Mount"] },
  { id: "virt-enterprise", name: "Sanal Enterprise", category: "virt", image: serverSupermicro, price: 145000, specs: ["2x Xeon Platinum 8280 (28C/56T)", "512 GB DDR4 ECC", "2x 960GB SSD (Boot)", "12x 3.84TB SSD NVMe", "2U Rack Mount"] },
  // AI
  { id: "ai-starter", name: "AI Starter", category: "ai", image: serverSupermicro, price: 95000, specs: ["2x Xeon Gold 6230 (20C/40T)", "256 GB DDR4 ECC", "2x 1.92TB SSD NVMe", "1x NVIDIA T4 16GB", "2U Rack Mount"] },
  { id: "ai-pro", name: "AI Professional", category: "ai", image: serverSupermicro, price: 185000, popular: true, specs: ["2x Xeon Gold 6248 (20C/40T)", "384 GB DDR4 ECC", "4x 3.84TB SSD NVMe", "2x NVIDIA A30 24GB", "2U Rack Mount"] },
  // Storage
  { id: "stor-starter", name: "Depolama Starter", category: "storage", image: serverR740, price: 38000, specs: ["1x Xeon Silver 4210 (10C/20T)", "64 GB DDR4 ECC", "12x 4TB SAS 7.2K (12LFF)", "PERC H730p 2GB", "2U Rack Mount"] },
  { id: "stor-pro", name: "Depolama Professional", category: "storage", image: serverDL380, price: 62000, oldPrice: 70000, popular: true, specs: ["2x Xeon Silver 4214 (12C/24T)", "128 GB DDR4 ECC", "12x 8TB SAS 7.2K (12LFF)", "PERC H740p 8GB", "2U Rack Mount"] },
];

import { useState } from "react";

export default function ReadyPackages() {
  const [activeCategory, setActiveCategory] = useState("web");
  const { addItem } = useCart();

  const filtered = packages.filter((p) => p.category === activeCategory);
  const activeCat = categories.find((c) => c.id === activeCategory)!;

  return (
    <div>
      <SEO
        title="Hazır Sunucu Paketleri"
        description="İş yükünüze göre optimize edilmiş hazır sunucu paketleri. Web, veritabanı, sanallaştırma, AI ve depolama sunucuları."
        keywords="hazır sunucu, sunucu paketi, web sunucu, veritabanı sunucu, sanallaştırma sunucu, AI sunucu"
        canonical="/hazir-paketler"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          name: "Hazır Sunucu Paketleri",
          url: `${SITE_URL}/hazir-paketler`,
          description: "İş yükünüze göre optimize edilmiş hazır sunucu paketleri.",
          itemListElement: categories.map((c) => ({
            "@type": "Offer",
            name: c.label,
            description: c.desc,
          })),
        }}
      />
      {/* Hero */}
      <section className="gradient-hero text-secondary-foreground py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-bold">Hazır Sunucu Paketleri</h1>
          <p className="text-secondary-foreground/70 mt-3 max-w-2xl mx-auto">
            İş yükünüze göre optimize edilmiş, test edilmiş ve hemen kullanıma hazır sunucu paketleri.
          </p>
        </div>
      </section>

      {/* Category tabs */}
      <section className="border-b bg-card sticky top-16 z-40">
        <div className="container">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <cat.icon className="h-4 w-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Category description */}
      <section className="py-8 bg-muted/30">
        <div className="container flex items-center gap-4">
          <activeCat.icon className="h-10 w-10 text-primary shrink-0" />
          <div>
            <h2 className="text-xl font-bold text-foreground">{activeCat.label} Paketleri</h2>
            <p className="text-sm text-muted-foreground">{activeCat.desc}</p>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-card border rounded-lg overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-glow ${
                  pkg.popular ? "ring-2 ring-primary" : ""
                }`}
              >
                {/* Image */}
                <div className="relative bg-muted/30 p-6 flex items-center justify-center h-44">
                  {pkg.popular && (
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px]">En Çok Tercih Edilen</Badge>
                  )}
                  <img src={pkg.image} alt={pkg.name} className="max-h-36 object-contain" />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-foreground">{pkg.name}</h3>

                  <ul className="mt-3 space-y-2 flex-1">
                    {pkg.specs.map((spec) => (
                      <li key={spec} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        <span className="font-mono text-xs">{spec}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-baseline gap-2 mt-4 pt-3 border-t">
                    <span className="text-2xl font-bold text-foreground">₺{pkg.price.toLocaleString("tr-TR")}</span>
                    {pkg.oldPrice && (
                      <span className="text-sm text-muted-foreground line-through">₺{pkg.oldPrice.toLocaleString("tr-TR")}</span>
                    )}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="hero"
                      className="flex-1"
                      onClick={() =>
                        addItem({
                          id: pkg.id,
                          name: pkg.name,
                          price: pkg.price,
                          image: pkg.image,
                          specs: pkg.specs.join(" | "),
                        })
                      }
                    >
                      <ShoppingCart className="h-4 w-4" /> Sepete Ekle
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/iletisim">Teklif Al</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-navy text-secondary-foreground py-12">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-3">Özel yapılandırma mı istiyorsunuz?</h2>
          <p className="text-secondary-foreground/70 mb-5">Sunucu yapılandırıcımızla ihtiyacınıza özel sunucu oluşturun.</p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/yapilandirici">Sunucu Yapılandır</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
