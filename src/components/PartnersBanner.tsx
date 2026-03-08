import logoSupermicro from "@/assets/logo-supermicro.png";
import logoIntel from "@/assets/logo-intel.png";
import logoCisco from "@/assets/logo-cisco.png";
import logoNvidia from "@/assets/logo-nvidia.png";

interface Partner {
  name: string;
  logo?: string;
}

const partners: Partner[] = [
  { name: "Supermicro", logo: logoSupermicro },
  { name: "Intel", logo: logoIntel },
  { name: "Dell Technologies" },
  { name: "Cisco", logo: logoCisco },
  { name: "HP Enterprise" },
  { name: "NVIDIA", logo: logoNvidia },
  { name: "Lenovo" },
  { name: "AMD" },
];

function PartnerItem({ partner }: { partner: Partner }) {
  return (
    <div className="flex flex-col items-center gap-2 mx-8 shrink-0 group hover:opacity-100 opacity-60 transition-all duration-300">
      <div className="h-14 w-28 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
        {partner.logo ? (
          <img src={partner.logo} alt={partner.name} className="max-h-12 max-w-24 object-contain" />
        ) : (
          <span className="text-xl font-bold text-muted-foreground group-hover:text-foreground transition-colors tracking-tight">
            {partner.name.split(" ")[0]}
          </span>
        )}
      </div>
      <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
        {partner.name}
      </span>
    </div>
  );
}

export default function PartnersBanner() {
  return (
    <section className="border-t bg-card py-12 overflow-hidden">
      <div className="container mb-8">
        <h3 className="text-center text-lg font-bold text-foreground mb-2">Çözüm Ortaklarımız</h3>
        <p className="text-center text-sm text-muted-foreground">Dünya lideri teknoloji üreticileriyle güçlü iş birlikleri</p>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {/* Duplicate the list for seamless loop */}
          {[...partners, ...partners].map((p, i) => (
            <PartnerItem key={`${p.name}-${i}`} partner={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
