import HardwareCategoryPage from "@/components/hardware/HardwareCategoryPage";
import serverR740 from "@/assets/server-r740.png";

const products = [
  { id: "mb-dell-r740", name: "Dell PowerEdge R740 Anakart", image: serverR740, specs: "LGA3647 · Dual Socket · DDR4 24-DIMM", price: 8500, brand: "Dell", socket: "LGA3647" },
  { id: "mb-dell-r640", name: "Dell PowerEdge R640 Anakart", image: serverR740, specs: "LGA3647 · Dual Socket · DDR4 24-DIMM", price: 7200, brand: "Dell", socket: "LGA3647" },
  { id: "mb-hp-dl380", name: "HPE DL380 Gen10 System Board", image: serverR740, specs: "LGA3647 · Dual Socket · DDR4 24-DIMM", price: 9000, brand: "HPE", socket: "LGA3647", badge: "Popüler" },
  { id: "mb-hp-dl360", name: "HPE DL360 Gen10 System Board", image: serverR740, specs: "LGA3647 · Dual Socket · DDR4 24-DIMM", price: 7800, brand: "HPE", socket: "LGA3647" },
  { id: "mb-sm-x11dph", name: "Supermicro X11DPH-T", image: serverR740, specs: "LGA3647 · Dual Socket · DDR4 16-DIMM · 10GbE", price: 12000, brand: "Supermicro", socket: "LGA3647", badge: "Yeni" },
  { id: "mb-sm-h12ssl", name: "Supermicro H12SSL-i", image: serverR740, specs: "SP3 · Single Socket · DDR4 8-DIMM · IPMI", price: 8000, oldPrice: 9500, brand: "Supermicro", socket: "SP3" },
  { id: "mb-sm-h12dsi", name: "Supermicro H12DSi-N6", image: serverR740, specs: "SP3 · Dual Socket · DDR4 16-DIMM", price: 14000, brand: "Supermicro", socket: "SP3" },
];

const filters = [
  { label: "Marka", key: "brand", options: ["Dell", "HPE", "Supermicro"] },
  { label: "Soket", key: "socket", options: ["LGA3647", "SP3"] },
];

export default function AnakartPage() {
  return (
    <HardwareCategoryPage
      title="Anakart - System Board"
      description="Sunucu anakartları ve sistem kartları."
      seoDescription="Sunucu anakartları. Dell, HPE, Supermicro system board ve anakart ürünleri. Yedek parça ve yükseltme çözümleri."
      seoKeywords="sunucu anakart, system board, dell anakart, hp anakart, supermicro anakart, sunucu yedek parça"
      canonical="/hardware/anakart"
      products={products}
      filters={filters}
    />
  );
}
