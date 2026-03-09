import HardwareCategoryPage from "@/components/hardware/HardwareCategoryPage";
import serverR740 from "@/assets/server-r740.png";

const products = [
  { id: "ram-16gb-ddr4", name: "16GB DDR4-2666 ECC RDIMM", image: serverR740, specs: "PC4-21300 · CL19 · 1.2V", price: 1200, brand: "Samsung" },
  { id: "ram-32gb-ddr4", name: "32GB DDR4-3200 ECC RDIMM", image: serverR740, specs: "PC4-25600 · CL22 · 1.2V", price: 2400, brand: "Samsung", badge: "Popüler" },
  { id: "ram-64gb-ddr4", name: "64GB DDR4-3200 ECC LRDIMM", image: serverR740, specs: "PC4-25600 · CL22 · 1.2V", price: 4800, brand: "Samsung" },
  { id: "ram-128gb-ddr4", name: "128GB DDR4-3200 ECC LRDIMM", image: serverR740, specs: "PC4-25600 · CL22 · 1.2V", price: 12000, oldPrice: 14000, brand: "Samsung" },
  { id: "ram-32gb-sk", name: "32GB DDR4-2933 ECC RDIMM", image: serverR740, specs: "PC4-23400 · CL21 · 1.2V", price: 2200, brand: "SK Hynix" },
  { id: "ram-64gb-sk", name: "64GB DDR4-3200 ECC RDIMM", image: serverR740, specs: "PC4-25600 · CL22 · 1.2V", price: 4500, brand: "SK Hynix" },
  { id: "ram-16gb-micron", name: "16GB DDR4-3200 ECC RDIMM", image: serverR740, specs: "PC4-25600 · CL22 · 1.2V", price: 1100, brand: "Micron" },
  { id: "ram-32gb-ddr5", name: "32GB DDR5-4800 ECC RDIMM", image: serverR740, specs: "PC5-38400 · CL40 · 1.1V", price: 3800, brand: "Samsung", badge: "Yeni" },
];

const filters = [
  { label: "Marka", key: "brand", options: ["Samsung", "SK Hynix", "Micron"] },
];

export default function RAMPage() {
  return (
    <HardwareCategoryPage
      title="RAM - Sunucu Bellek"
      description="DDR4 ve DDR5 ECC sunucu bellekleri."
      seoDescription="Sunucu RAM bellekleri. DDR4, DDR5 ECC RDIMM ve LRDIMM modüller. Samsung, SK Hynix, Micron sunucu bellek çözümleri."
      seoKeywords="sunucu ram, ddr4, ddr5, ecc bellek, rdimm, lrdimm, sunucu bellek"
      canonical="/hardware/ram"
      products={products}
      filters={filters}
    />
  );
}
