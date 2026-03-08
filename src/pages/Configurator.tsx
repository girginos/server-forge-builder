import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
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
    // Show server selection
    return (
      <div className="py-12">
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground mb-2">Sunucu Yapılandırıcı</h1>
          <p className="text-muted-foreground mb-8">Yapılandırmak istediğiniz sunucu modelini seçin.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(serverData).map(([id, s]) => (
              <button
                key={id}
                onClick={() => navigate(`/yapilandirici/${id}`)}
                className="bg-card border rounded-lg p-6 text-left hover:shadow-glow hover:border-primary/30 transition-all group"
              >
                <img src={s.image} alt={s.name} className="h-32 mx-auto mb-4 object-contain group-hover:scale-105 transition-transform" />
                <h3 className="font-semibold text-foreground">{s.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">₺{s.basePrice.toLocaleString("tr-TR")}'den başlayan</p>
              </button>
            ))}
          </div>
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
