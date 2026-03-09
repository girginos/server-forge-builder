import HardwareCategoryPage from "@/components/hardware/HardwareCategoryPage";
import serverR740 from "@/assets/server-r740.png";

const products = [
  { id: "xeon-4314", name: "Intel Xeon Silver 4314 2.4GHz", image: serverR740, specs: "16 Core · 24MB Cache · LGA4189", price: 8500, brand: "Intel", series: "Silver" },
  { id: "xeon-6330", name: "Intel Xeon Gold 6330 2.0GHz", image: serverR740, specs: "28 Core · 42MB Cache · LGA4189", price: 18000, brand: "Intel", series: "Gold", badge: "Popüler" },
  { id: "xeon-8380", name: "Intel Xeon Platinum 8380 2.3GHz", image: serverR740, specs: "40 Core · 60MB Cache · LGA4189", price: 42000, brand: "Intel", series: "Platinum", badge: "Premium" },
  { id: "xeon-e2388g", name: "Intel Xeon E-2388G 3.2GHz", image: serverR740, specs: "8 Core · 16MB Cache · LGA1200", price: 5200, brand: "Intel", series: "E-Series" },
  { id: "epyc-7313", name: "AMD EPYC 7313 3.0GHz", image: serverR740, specs: "16 Core · 128MB Cache · SP3", price: 9500, brand: "AMD", series: "EPYC 7003" },
  { id: "epyc-7443", name: "AMD EPYC 7443 2.85GHz", image: serverR740, specs: "24 Core · 128MB Cache · SP3", price: 16000, brand: "AMD", series: "EPYC 7003" },
  { id: "epyc-7713", name: "AMD EPYC 7713 2.0GHz", image: serverR740, specs: "64 Core · 256MB Cache · SP3", price: 38000, oldPrice: 45000, brand: "AMD", series: "EPYC 7003", badge: "Yeni" },
  { id: "epyc-9354", name: "AMD EPYC 9354 3.25GHz", image: serverR740, specs: "32 Core · 256MB Cache · SP5", price: 28000, brand: "AMD", series: "EPYC 9004" },
];

const filters = [
  { label: "Marka", key: "brand", options: ["Intel", "AMD"] },
  { label: "Seri", key: "series", options: ["Silver", "Gold", "Platinum", "E-Series", "EPYC 7003", "EPYC 9004"] },
];

export default function CPUPage() {
  return (
    <HardwareCategoryPage
      title="CPU - İşlemci"
      description="Intel Xeon ve AMD EPYC sunucu işlemcileri."
      seoDescription="Sunucu işlemcileri. Intel Xeon Scalable ve AMD EPYC işlemciler. Kurumsal düzeyde performans ve güvenilirlik."
      seoKeywords="sunucu işlemci, cpu, intel xeon, amd epyc, xeon scalable, sunucu cpu"
      canonical="/hardware/cpu"
      products={products}
      filters={filters}
    />
  );
}
