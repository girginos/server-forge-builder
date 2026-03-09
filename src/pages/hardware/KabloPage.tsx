import HardwareCategoryPage from "@/components/hardware/HardwareCategoryPage";
import serverR740 from "@/assets/server-r740.png";

const products = [
  { id: "dac-1m-10g", name: "10G SFP+ DAC Kablo 1m", image: serverR740, specs: "Twinax · Passive · 10Gbps", price: 350, brand: "Generic" },
  { id: "dac-3m-10g", name: "10G SFP+ DAC Kablo 3m", image: serverR740, specs: "Twinax · Passive · 10Gbps", price: 450, brand: "Generic", badge: "Popüler" },
  { id: "dac-1m-25g", name: "25G SFP28 DAC Kablo 1m", image: serverR740, specs: "Twinax · Passive · 25Gbps", price: 550, brand: "Generic" },
  { id: "fiber-lc-3m", name: "LC-LC OM4 Fiber Patch Kablo 3m", image: serverR740, specs: "Multimode · Duplex · OM4", price: 120, brand: "Generic" },
  { id: "fiber-lc-10m", name: "LC-LC OM4 Fiber Patch Kablo 10m", image: serverR740, specs: "Multimode · Duplex · OM4", price: 250, brand: "Generic" },
  { id: "cat6a-3m", name: "Cat6A Patch Kablo 3m", image: serverR740, specs: "S/FTP · 10Gbps · LSZH", price: 65, brand: "Generic" },
  { id: "power-c13", name: "C13-C14 Güç Kablosu 2m", image: serverR740, specs: "IEC · 10A · 250V", price: 45, brand: "Generic" },
  { id: "dac-5m-40g", name: "40G QSFP+ DAC Kablo 5m", image: serverR740, specs: "Twinax · Active · 40Gbps", price: 1200, brand: "Generic" },
];

export default function KabloPage() {
  return (
    <HardwareCategoryPage
      title="Kablo & Bağlantı"
      description="DAC, fiber optik ve patch kablolar."
      seoDescription="Sunucu kablo ve bağlantı çözümleri. DAC kablo, fiber optik patch, Cat6A, güç kabloları. Veri merkezi kablolama ürünleri."
      seoKeywords="dac kablo, fiber optik kablo, patch kablo, sfp+ kablo, sunucu kablo, veri merkezi kablo"
      canonical="/hardware/kablo"
      products={products}
    />
  );
}
