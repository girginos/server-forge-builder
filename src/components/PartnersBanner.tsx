import logoSupermicro from "@/assets/logo-supermicro.png";
import logoIntel from "@/assets/logo-intel.png";
import logoCisco from "@/assets/logo-cisco.png";
import logoNvidia from "@/assets/logo-nvidia.png";
import logoDell from "@/assets/logo-dell.png";
import logoHp from "@/assets/logo-hp.png";
import logoLenovo from "@/assets/logo-lenovo.png";
import logoAmd from "@/assets/logo-amd.png";

const partners = [
  { name: "Dell Technologies", logo: logoDell },
  { name: "HP Enterprise", logo: logoHp },
  { name: "Supermicro", logo: logoSupermicro },
  { name: "Intel", logo: logoIntel },
  { name: "NVIDIA", logo: logoNvidia },
  { name: "Cisco", logo: logoCisco },
  { name: "Lenovo", logo: logoLenovo },
  { name: "AMD", logo: logoAmd },
];

export default function PartnersBanner() {
  return (
    <section className="border-t bg-card py-12">
      <div className="container">
        <h3 className="text-center text-lg font-bold text-foreground mb-2">Çözüm Ortaklarımız</h3>
        <p className="text-center text-sm text-muted-foreground mb-8">Dünya lideri teknoloji üreticileriyle güçlü iş birlikleri</p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map((p) => (
            <div
              key={p.name}
              className="group flex flex-col items-center gap-2 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <div className="h-14 w-28 flex items-center justify-center">
                <img
                  src={p.logo}
                  alt={p.name}
                  className="max-h-12 max-w-24 object-contain"
                />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
