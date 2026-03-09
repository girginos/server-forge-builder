import HardwareCategoryPage from "@/components/hardware/HardwareCategoryPage";
import serverR740 from "@/assets/server-r740.png";

const products = [
  { id: "nic-1g-4p", name: "Intel I350-T4 1GbE 4-Port", image: serverR740, specs: "PCIe x4 · RJ45 · 1Gbps", price: 1800, brand: "Intel", speed: "1GbE" },
  { id: "nic-10g-2p", name: "Intel X710-DA2 10GbE 2-Port", image: serverR740, specs: "PCIe x8 · SFP+ · 10Gbps", price: 3500, brand: "Intel", speed: "10GbE", badge: "Popüler" },
  { id: "nic-25g-2p", name: "Mellanox ConnectX-4 Lx 25GbE", image: serverR740, specs: "PCIe x8 · SFP28 · 25Gbps", price: 5200, brand: "Mellanox", speed: "25GbE" },
  { id: "nic-100g", name: "Mellanox ConnectX-5 100GbE", image: serverR740, specs: "PCIe x16 · QSFP28 · 100Gbps", price: 12000, brand: "Mellanox", speed: "100GbE", badge: "Premium" },
  { id: "nic-10g-bcom", name: "Broadcom 57412 10GbE 2-Port", image: serverR740, specs: "PCIe x8 · SFP+ · 10Gbps", price: 3200, brand: "Broadcom", speed: "10GbE" },
  { id: "nic-25g-bcom", name: "Broadcom 57414 25GbE 2-Port", image: serverR740, specs: "PCIe x8 · SFP28 · 25Gbps", price: 4800, oldPrice: 5500, brand: "Broadcom", speed: "25GbE" },
];

const filters = [
  { label: "Marka", key: "brand", options: ["Intel", "Mellanox", "Broadcom"] },
  { label: "Hız", key: "speed", options: ["1GbE", "10GbE", "25GbE", "100GbE"] },
];

export default function EthernetPage() {
  return (
    <HardwareCategoryPage
      title="Ethernet Kartları"
      description="1G, 10G, 25G ve 100G sunucu ağ kartları."
      seoDescription="Sunucu ethernet kartları. Intel, Mellanox, Broadcom NIC kartları. 1GbE, 10GbE, 25GbE, 100GbE ağ adaptörleri."
      seoKeywords="ethernet kartı, nic, sunucu ağ kartı, 10gbe, 25gbe, intel x710, mellanox connectx"
      canonical="/hardware/ethernet-kartlari"
      products={products}
      filters={filters}
    />
  );
}
