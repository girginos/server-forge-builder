import logoSupermicro from "@/assets/logo-supermicro.png";
import logoIntel from "@/assets/logo-intel.png";
import logoCisco from "@/assets/logo-cisco.png";
import logoNvidia from "@/assets/logo-nvidia.png";

const imagePartners = [
  { name: "Supermicro", logo: logoSupermicro },
  { name: "Intel", logo: logoIntel },
  { name: "Cisco", logo: logoCisco },
  { name: "NVIDIA", logo: logoNvidia },
];

const textPartners = [
  { name: "Dell Technologies" },
  { name: "HP Enterprise" },
  { name: "Lenovo" },
  { name: "AMD" },
];

export default function PartnersBanner() {
  return (
    <section className="border-t bg-card py-12">
      <div className="container">
        <h3 className="text-center text-lg font-bold text-foreground mb-2">Çözüm Ortaklarımız</h3>
        <p className="text-center text-sm text-muted-foreground mb-8">Dünya lideri teknoloji üreticileriyle güçlü iş birlikleri</p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {/* Image logos */}
          {imagePartners.map((p) => (
            <div
              key={p.name}
              className="group flex flex-col items-center gap-2 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <div className="h-14 w-28 flex items-center justify-center">
                <img src={p.logo} alt={p.name} className="max-h-12 max-w-24 object-contain" />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{p.name}</span>
            </div>
          ))}
          {/* Text-based logos for brands whose generated images didn't render well */}
          {textPartners.map((p) => (
            <div
              key={p.name}
              className="group flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-all duration-300"
            >
              <div className="h-14 w-28 flex items-center justify-center">
                <span className="text-xl font-bold text-muted-foreground group-hover:text-foreground transition-colors tracking-tight">
                  {p.name.split(" ")[0]}
                </span>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
