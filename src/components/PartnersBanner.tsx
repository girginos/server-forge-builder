import logoSupermicro from "@/assets/logo-supermicro.png";
import logoIntel from "@/assets/logo-intel.png";
import logoCisco from "@/assets/logo-cisco.png";
import logoNvidia from "@/assets/logo-nvidia.png";
import logoDell from "@/assets/logo-dell.png";
import logoHp from "@/assets/logo-hp.png";
import logoLenovo from "@/assets/logo-lenovo.png";
import logoAmd from "@/assets/logo-amd.png";

interface Partner {
  name: string;
  logo: string;
}

const partners: Partner[] = [
  { name: "Dell Technologies", logo: logoDell },
  { name: "HP Enterprise", logo: logoHp },
  { name: "Supermicro", logo: logoSupermicro },
  { name: "Intel", logo: logoIntel },
  { name: "NVIDIA", logo: logoNvidia },
  { name: "Cisco", logo: logoCisco },
  { name: "Lenovo", logo: logoLenovo },
  { name: "AMD", logo: logoAmd },
];

function PartnerItem({ partner }: { partner: Partner }) {
  return (
    <div className="flex items-center justify-center mx-16 shrink-0 group hover:opacity-100 opacity-50 transition-all duration-300">
      <div className="h-20 w-44 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
        <img src={partner.logo} alt={partner.name} className="h-12 w-auto object-contain" />
      </div>
    </div>
  );
}

export default function PartnersBanner() {
  return (
    <section className="border-t bg-card py-8 overflow-hidden">

      {/* Marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {[...partners, ...partners].map((p, i) => (
            <PartnerItem key={`${p.name}-${i}`} partner={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
