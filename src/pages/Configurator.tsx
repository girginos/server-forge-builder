import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Settings, Bot, ArrowRight, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import SEO from "@/components/SEO";
import serverR740 from "@/assets/server-r740.png";
import serverR640 from "@/assets/server-r640.png";
import serverDL380 from "@/assets/server-dl380.png";
import serverSupermicro from "@/assets/server-supermicro.png";

const serverData: Record<string, { name: string; image: string; basePrice: number }> = {
  "dell-r740xd": { name: "Dell PowerEdge R740xd", image: serverR740, basePrice: 25000 },
  "dell-r640": { name: "Dell PowerEdge R640", image: serverR640, basePrice: 18000 },
  "hp-dl380": { name: "HP ProLiant DL380 Gen10", image: serverDL380, basePrice: 22000 },
  "supermicro-2u": { name: "Supermicro SuperServer 2U", image: serverSupermicro, basePrice: 28000 },
};

interface ConfigOption {
  label: string;
  value: string;
  price: number;
}

interface ConfigSection {
  id: string;
  title: string;
  options: ConfigOption[];
}

const configSections: ConfigSection[] = [
  {
    id: "chassis",
    title: "Kasa",
    options: [
      { label: "24SFF (Standart)", value: "24sff", price: 0 },
      { label: "24SFF (12 NVMe)", value: "24sff-12nvme", price: 8000 },
      { label: "12LFF", value: "12lff", price: 4000 },
    ],
  },
  {
    id: "cpu",
    title: "İşlemci (CPU)",
    options: [
      { label: "1x Intel Xeon Silver 4110 (8C/16T, 2.1GHz)", value: "4110", price: 0 },
      { label: "2x Intel Xeon Silver 4110 (8C/16T, 2.1GHz)", value: "2x4110", price: 3500 },
      { label: "2x Intel Xeon Gold 6130 (16C/32T, 2.1GHz)", value: "2x6130", price: 12000 },
      { label: "2x Intel Xeon Gold 6248 (20C/40T, 2.5GHz)", value: "2x6248", price: 22000 },
      { label: "2x Intel Xeon Platinum 8280 (28C/56T, 2.7GHz)", value: "2x8280", price: 45000 },
    ],
  },
  {
    id: "ram",
    title: "Bellek (RAM)",
    options: [
      { label: "32 GB (2x 16GB DDR4 2400MHz)", value: "32gb", price: 0 },
      { label: "64 GB (4x 16GB DDR4 2666MHz)", value: "64gb", price: 3000 },
      { label: "128 GB (8x 16GB DDR4 2666MHz)", value: "128gb", price: 8000 },
      { label: "256 GB (16x 16GB DDR4 2666MHz)", value: "256gb", price: 18000 },
      { label: "512 GB (16x 32GB DDR4 2666MHz)", value: "512gb", price: 38000 },
    ],
  },
  {
    id: "storage",
    title: "Depolama",
    options: [
      { label: "Disksiz", value: "none", price: 0 },
      { label: "2x 480GB SSD SATA", value: "2x480ssd", price: 2500 },
      { label: "4x 480GB SSD SATA", value: "4x480ssd", price: 5000 },
      { label: "2x 960GB SSD SATA", value: "2x960ssd", price: 4500 },
      { label: "2x 1.92TB SSD SATA", value: "2x1920ssd", price: 8000 },
      { label: "4x 1.2TB SAS 10K", value: "4x1200sas", price: 4000 },
    ],
  },
  {
    id: "raid",
    title: "RAID Kartı",
    options: [
      { label: "Dell PERC H730p 2GB", value: "h730p", price: 0 },
      { label: "Dell PERC H740p 8GB", value: "h740p", price: 5000 },
    ],
  },
  {
    id: "network",
    title: "Ağ Kartı",
    options: [
      { label: "4x 1GbE BASE-T (Dahili)", value: "4x1gbe", price: 0 },
      { label: "2x 10GbE SFP+", value: "2x10gbe", price: 4000 },
      { label: "2x 25GbE SFP28", value: "2x25gbe", price: 8000 },
    ],
  },
  {
    id: "psu",
    title: "Güç Kaynağı",
    options: [
      { label: "2x 750W", value: "2x750w", price: 0 },
      { label: "2x 1100W", value: "2x1100w", price: 2000 },
      { label: "2x 1600W", value: "2x1600w", price: 3500 },
    ],
  },
];

export default function Configurator() {
  const { serverId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const server = serverId ? serverData[serverId] : null;

  const defaultSelections = Object.fromEntries(configSections.map((s) => [s.id, s.options[0].value]));
  const [selections, setSelections] = useState<Record<string, string>>(defaultSelections);
  const [showManualSelection, setShowManualSelection] = useState(false);

  const totalPrice = useMemo(() => {
    const base = server?.basePrice ?? 25000;
    const extra = configSections.reduce((sum, section) => {
      const selected = section.options.find((o) => o.value === selections[section.id]);
      return sum + (selected?.price ?? 0);
    }, 0);
    return base + extra;
  }, [selections, server]);

  const summaryLines = configSections.map((section) => {
    const opt = section.options.find((o) => o.value === selections[section.id]);
    return { title: section.title, value: opt?.label ?? "" };
  });

  if (!serverId) {
    return (
      <div className="py-12">
        <SEO
          title="Sunucu Yapılandırıcı"
          description="Sunucunuzu özelleştirin. CPU, RAM, depolama, RAID, ağ kartı ve güç kaynağı seçenekleriyle ihtiyacınıza özel sunucu yapılandırın."
          keywords="sunucu yapılandırma, server configurator, özel sunucu, sunucu özelleştirme"
          canonical="/yapilandirici"
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "ServerMarket Sunucu Yapılandırıcı",
            url: "https://servermarket.com.tr/yapilandirici",
            description: "CPU, RAM, depolama ve daha fazlasını seçerek ihtiyacınıza özel sunucu yapılandırın.",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            provider: { "@type": "Organization", name: "ServerMarket" },
          }}
        />
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground mb-2">Sunucu Yapılandırıcı</h1>
          <p className="text-muted-foreground mb-10">Sunucu yapılandırma yönteminizi seçin.</p>

          {/* 2-card selection grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Card 1: Manuel */}
            <button
              onClick={() => setShowManualSelection(true)}
              className="bg-card border-2 border-border rounded-2xl p-8 text-left hover:border-primary/50 hover:shadow-glow transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Settings className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Kendim Yapılandıracağım</h2>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  CPU, RAM, depolama ve diğer bileşenleri kendiniz seçerek sunucunuzu tamamen özelleştirin. Teknik bilginiz varsa bu seçenek tam size göre.
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
                  Sunucu Seç <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </button>

            {/* Card 2: AI */}
            <button
              onClick={() => navigate("/yapilandirici/ai")}
              className="bg-card border-2 border-border rounded-2xl p-8 text-left hover:border-accent/50 hover:shadow-glow transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent px-2 py-1 rounded-full">
                  <Sparkles className="h-3 w-3" /> Yeni
                </span>
              </div>
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                  <Bot className="h-7 w-7 text-accent" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">AI ile Yapılandır</h2>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  Sunucu konusunda bilginiz yok mu? Kullanım amacınızı anlatın, yapay zeka danışmanımız size en uygun yapılandırmayı önersin.
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent group-hover:gap-2.5 transition-all">
                  AI Danışmana Sor <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </button>
          </div>

          {/* Manual server selection (shown when card 1 is clicked) */}
          {showManualSelection && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground mb-2">Yapılandırmak istediğiniz sunucu modelini seçin</h2>
              <p className="text-muted-foreground text-sm mb-6">Bir sunucu modeli seçtikten sonra bileşenleri özelleştirebilirsiniz.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(serverData).map(([id, s]) => (
                  <button
                    key={id}
                    onClick={() => navigate(`/yapilandirici/${id}`)}
                    className="bg-card border rounded-xl p-6 text-left hover:shadow-glow hover:border-primary/30 transition-all group"
                  >
                    <img src={s.image} alt={s.name} className="h-32 mx-auto mb-4 object-contain group-hover:scale-105 transition-transform" />
                    <h3 className="font-semibold text-foreground">{s.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">₺{s.basePrice.toLocaleString("tr-TR")}'den başlayan</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!server) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">Sunucu bulunamadı</h1>
        <Button className="mt-4" onClick={() => navigate("/yapilandirici")}>Geri Dön</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    const specs = summaryLines.map((l) => `${l.title}: ${l.value}`).join(" | ");
    addItem({
      id: `${serverId}-${Date.now()}`,
      name: server.name,
      price: totalPrice,
      image: server.image,
      specs,
    });
  };

  return (
    <div className="py-8">
      <SEO
        title={`${server.name} Yapılandır`}
        description={`${server.name} sunucusunu özelleştirin. CPU, RAM, depolama ve daha fazlasını seçin.`}
        canonical={`/yapilandirici/${serverId}`}
      />
      <div className="container">
        <h1 className="text-2xl font-bold text-foreground mb-6">{server.name}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Image + Config */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border rounded-lg p-8 flex items-center justify-center">
              <img src={server.image} alt={server.name} className="max-h-56 object-contain" />
            </div>

            {/* Config sections */}
            {configSections.map((section) => (
              <div key={section.id} className="bg-card border rounded-lg p-5">
                <h3 className="font-semibold text-foreground mb-3">{section.title}</h3>
                <div className="space-y-2">
                  {section.options.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-colors ${
                        selections[section.id] === opt.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={section.id}
                          value={opt.value}
                          checked={selections[section.id] === opt.value}
                          onChange={() => setSelections((prev) => ({ ...prev, [section.id]: opt.value }))}
                          className="accent-primary"
                        />
                        <span className="text-sm text-foreground">{opt.label}</span>
                      </div>
                      {opt.price > 0 && (
                        <span className="text-sm font-mono font-medium text-primary">
                          + ₺{opt.price.toLocaleString("tr-TR")}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Summary sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-card border rounded-lg p-5 space-y-4">
              <h3 className="font-bold text-primary text-lg">{server.name}</h3>
              <div className="space-y-2 text-sm">
                {summaryLines.map((line) => (
                  <div key={line.title} className="flex justify-between border-b border-border/50 pb-2">
                    <span className="font-medium text-foreground">{line.title}</span>
                    <span className="text-muted-foreground text-right max-w-[180px] font-mono text-xs">{line.value}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-foreground">Toplam:</span>
                  <span className="text-2xl font-bold text-primary">₺{totalPrice.toLocaleString("tr-TR")}</span>
                </div>
              </div>
              <Button variant="hero" size="lg" className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5" /> Sepete Ekle
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
