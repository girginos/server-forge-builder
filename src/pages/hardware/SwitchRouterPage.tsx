import HardwareCategoryPage from "@/components/hardware/HardwareCategoryPage";

const filters = [
  { label: "Marka", key: "brand", options: ["Cisco", "Arista", "Juniper", "MikroTik"] },
  { label: "Cihaz Tipi", key: "type", options: ["Switch", "Router"] },
];

export default function SwitchRouterPage() {
  return (
    <HardwareCategoryPage
      title="Switch & Router"
      description="Kurumsal ağ anahtarları ve yönlendiriciler."
      seoDescription="Kurumsal switch ve router çözümleri. Cisco, Arista, Juniper, MikroTik."
      seoKeywords="switch, router, cisco catalyst, arista, juniper, mikrotik"
      canonical="/hardware/switch-router"
      categoryDbValue="switch-router"
      filters={filters}
    />
  );
}
