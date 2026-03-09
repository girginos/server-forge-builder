import HardwareCategoryPage from "@/components/hardware/HardwareCategoryPage";

const filters = [
  { label: "Marka", key: "brand", options: ["Intel", "Mellanox", "Broadcom"] },
  { label: "Hız", key: "speed", options: ["1GbE", "10GbE", "25GbE", "100GbE"] },
];

export default function EthernetPage() {
  return (
    <HardwareCategoryPage
      title="Ethernet Kartları"
      description="1G, 10G, 25G ve 100G sunucu ağ kartları."
      seoDescription="Sunucu ethernet kartları. Intel, Mellanox, Broadcom NIC kartları."
      seoKeywords="ethernet kartı, nic, sunucu ağ kartı, 10gbe, 25gbe"
      canonical="/hardware/ethernet-kartlari"
      categoryDbValue="ethernet"
      filters={filters}
    />
  );
}
