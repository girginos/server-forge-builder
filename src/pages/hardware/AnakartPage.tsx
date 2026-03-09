import HardwareCategoryPage from "@/components/hardware/HardwareCategoryPage";
import serverR740 from "@/assets/server-r740.png";

const products = [
  { id: "mb-dell-r740", name: "Dell PowerEdge R740 Anakart", image: serverR740, specs: "LGA3647 · Dual Socket · DDR4 24-DIMM", price: 8500, brand: "Dell" },
  { id: "mb-dell-r640", name: "Dell PowerEdge R640 Anakart", image: serverR740, specs: "LGA3647 · Dual Socket · DDR4 24-DIMM", price: 7200, brand: "Dell" },
  { id: "mb-hp-dl380", name: "HP DL380 Gen10 System Board", image: serverR740, specs: "LGA3647 · Dual Socket · DDR4 24-DIMM", price: 9000, brand: "HP", badge: "Popüler" },
  { id: "mb-hp-dl360", name: "HP DL360 Gen10 System Board", image: serverR740, specs: "LGA3647 · Dual Socket · DDR4 24-DIMM", price: 7800, brand: "HP" },
  { id: "mb-sm-x11dph", name: "Supermicro X11DPH-T", image: serverR740, specs: "LGA3647 · Dual Socket · DDR4 16-DIMM · 10GbE", price: 12000, brand: "Supermicro", badge: "Yeni" },
  { id: "mb-sm-h12ssl", name: "Supermicro H12SSL-i", image: serverR740, specs: "SP3 · Single Socket · DDR4 8-DIMM · IPMI", price: 8000, oldPrice: 9500, brand: "Supermicro" },
];

const filters = [
  { label: "Marka", key: "brand", options: ["Dell", "HP", "Supermicro"] },
];

export default function AnakartPage() {
  return (
    <HardwareCategoryPage
      title="Anakart - System Board"
      description="Sunucu anakartları ve sistem kartları."
      seoDescription="Sunucu anakartları. Dell, HP, Supermicro system board ve anakart ürünleri. Yedek parça ve yükseltme çözümleri."
      seoKeywords="sunucu anakart, system board, dell anakart, hp anakart, supermicro anakart, sunucu yedek parça"
      canonical="/hardware/anakart"
      products={products}
      filters={filters}
    />
  );
}
