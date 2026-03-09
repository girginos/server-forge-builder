import HardwareCategoryPage from "@/components/hardware/HardwareCategoryPage";
import serverR740 from "@/assets/server-r740.png";

const products = [
  { id: "sw-24p-1g", name: "Cisco Catalyst 2960-X 24-Port", image: serverR740, specs: "24x 1GbE · 4x SFP · Managed L2", price: 8500, brand: "Cisco" },
  { id: "sw-48p-1g", name: "Cisco Catalyst 2960-X 48-Port", image: serverR740, specs: "48x 1GbE · 4x SFP+ · Managed L2", price: 14000, brand: "Cisco", badge: "Popüler" },
  { id: "sw-24p-10g", name: "Cisco Nexus 3048TP 48-Port 10G", image: serverR740, specs: "48x 10GbE · 4x QSFP+ · L3", price: 28000, brand: "Cisco" },
  { id: "sw-arista-48", name: "Arista 7050TX-48 48-Port", image: serverR740, specs: "48x 10GbE RJ45 · 4x QSFP+ · L3", price: 32000, brand: "Arista", badge: "Premium" },
  { id: "rt-isr-4331", name: "Cisco ISR 4331 Router", image: serverR740, specs: "3x GbE · 2x NIM · 100Mbps Throughput", price: 12000, brand: "Cisco" },
  { id: "sw-juniper-24", name: "Juniper EX2300-24T", image: serverR740, specs: "24x 1GbE · 4x SFP+ · L2/L3", price: 7500, brand: "Juniper" },
  { id: "rt-mikrotik", name: "MikroTik CCR2004-1G-12S+2XS", image: serverR740, specs: "12x SFP+ · 2x 25G SFP28 · RouterOS", price: 9800, oldPrice: 11000, brand: "MikroTik" },
];

const filters = [
  { label: "Marka", key: "brand", options: ["Cisco", "Arista", "Juniper", "MikroTik"] },
];

export default function SwitchRouterPage() {
  return (
    <HardwareCategoryPage
      title="Switch & Router"
      description="Kurumsal ağ anahtarları ve yönlendiriciler."
      seoDescription="Kurumsal switch ve router çözümleri. Cisco, Arista, Juniper, MikroTik ağ cihazları. Managed switch ve enterprise router."
      seoKeywords="switch, router, cisco catalyst, arista, juniper, mikrotik, ağ anahtarı, yönlendirici"
      canonical="/hardware/switch-router"
      products={products}
      filters={filters}
    />
  );
}
