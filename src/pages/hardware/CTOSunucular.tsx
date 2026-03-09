import HardwareCategoryPage from "@/components/hardware/HardwareCategoryPage";
import serverR740 from "@/assets/server-r740.png";
import serverR640 from "@/assets/server-r640.png";
import serverDL380 from "@/assets/server-dl380.png";
import serverSupermicro from "@/assets/server-supermicro.png";

const products = [
  { id: "cto-r740", name: "Dell PowerEdge R740xd CTO", image: serverR740, specs: "2U Rack · Boş Kasa · Çift PSU", price: 28000, brand: "Dell", formFactor: "2U", badge: "Popüler" },
  { id: "cto-r640", name: "Dell PowerEdge R640 CTO", image: serverR640, specs: "1U Rack · Boş Kasa · 8 SFF Bay", price: 22000, brand: "Dell", formFactor: "1U" },
  { id: "cto-r630", name: "Dell PowerEdge R630 CTO", image: serverR640, specs: "1U Rack · Boş Kasa · 10 SFF Bay", price: 16000, brand: "Dell", formFactor: "1U" },
  { id: "cto-dl380", name: "HPE ProLiant DL380 Gen10 CTO", image: serverDL380, specs: "2U Rack · Boş Kasa · 24 SFF Bay", price: 25000, brand: "HPE", formFactor: "2U", badge: "Yeni" },
  { id: "cto-dl360", name: "HPE ProLiant DL360 Gen10 CTO", image: serverDL380, specs: "1U Rack · Boş Kasa · 8 SFF Bay", price: 20000, brand: "HPE", formFactor: "1U" },
  { id: "cto-dl580", name: "HPE ProLiant DL580 Gen10 CTO", image: serverDL380, specs: "4U Rack · 4-Socket · 48 DIMM", price: 45000, brand: "HPE", formFactor: "4U" },
  { id: "cto-ibm-3650", name: "IBM System x3650 M5 CTO", image: serverSupermicro, specs: "2U Rack · Boş Kasa · 16 SFF Bay", price: 18000, brand: "IBM", formFactor: "2U" },
  { id: "cto-ibm-3550", name: "IBM System x3550 M5 CTO", image: serverSupermicro, specs: "1U Rack · Boş Kasa · 8 SFF Bay", price: 14000, brand: "IBM", formFactor: "1U" },
  { id: "cto-sm-2u", name: "Supermicro 2U CTO Chassis", image: serverSupermicro, specs: "2U Rack · 12 LFF Bay · Redundant PSU", price: 32000, oldPrice: 36000, brand: "Supermicro", formFactor: "2U" },
  { id: "cto-sm-1u", name: "Supermicro 1U CTO Chassis", image: serverSupermicro, specs: "1U Rack · 4 LFF Bay · Single PSU", price: 18000, brand: "Supermicro", formFactor: "1U" },
];

const filters = [
  { label: "Marka", key: "brand", options: ["Dell", "HPE", "IBM", "Supermicro"] },
  { label: "Form Faktörü", key: "formFactor", options: ["1U", "2U", "4U"] },
];

export default function CTOSunucular() {
  return (
    <HardwareCategoryPage
      title="CTO Sunucular"
      description="Configure-to-Order: İhtiyacınıza göre yapılandırılabilir boş sunucu kasaları."
      seoDescription="CTO (Configure-to-Order) sunucular. Dell, HPE, IBM, Supermicro boş kasa sunucular. İhtiyacınıza göre özel yapılandırma imkanı."
      seoKeywords="cto sunucu, configure to order, boş kasa sunucu, dell cto, hpe cto, ibm cto, supermicro cto"
      canonical="/hardware/cto-sunucular"
      products={products}
      filters={filters}
    />
  );
}
