import HardwareCategoryPage from "@/components/hardware/HardwareCategoryPage";
import serverR740 from "@/assets/server-r740.png";

const products = [
  { id: "ssd-960gb", name: "Samsung PM893 960GB SATA SSD", image: serverR740, specs: "2.5\" · SATA III · 550MB/s Read", price: 3200, brand: "Samsung", badge: "Popüler" },
  { id: "ssd-1920gb", name: "Samsung PM893 1.92TB SATA SSD", image: serverR740, specs: "2.5\" · SATA III · 550MB/s Read", price: 5800, brand: "Samsung" },
  { id: "nvme-1tb", name: "Samsung PM9A3 1TB NVMe", image: serverR740, specs: "U.2 · PCIe Gen4 · 6900MB/s Read", price: 4500, brand: "Samsung", badge: "Yeni" },
  { id: "hdd-4tb", name: "Seagate Exos 4TB SAS", image: serverR740, specs: "3.5\" · 12Gbps SAS · 7200RPM", price: 2800, brand: "Seagate" },
  { id: "hdd-8tb", name: "Seagate Exos 8TB SAS", image: serverR740, specs: "3.5\" · 12Gbps SAS · 7200RPM", price: 4200, brand: "Seagate" },
  { id: "hdd-16tb", name: "Seagate Exos 16TB SAS", image: serverR740, specs: "3.5\" · 12Gbps SAS · 7200RPM", price: 7500, oldPrice: 8500, brand: "Seagate" },
  { id: "nvme-3tb", name: "Intel P5510 3.84TB NVMe", image: serverR740, specs: "U.2 · PCIe Gen4 · 7000MB/s", price: 12000, brand: "Intel" },
  { id: "ssd-480", name: "Micron 5300 480GB SATA SSD", image: serverR740, specs: "2.5\" · SATA III · Boot Drive", price: 1800, brand: "Micron" },
];

const filters = [
  { label: "Marka", key: "brand", options: ["Samsung", "Seagate", "Intel", "Micron"] },
];

export default function DiskPage() {
  return (
    <HardwareCategoryPage
      title="Disk & Depolama"
      description="SSD, NVMe ve HDD sunucu depolama çözümleri."
      seoDescription="Sunucu disk ve depolama çözümleri. Samsung, Seagate, Intel SSD, NVMe ve HDD diskler. Kurumsal depolama ürünleri."
      seoKeywords="sunucu disk, ssd, nvme, hdd, samsung ssd, seagate exos, sunucu depolama, enterprise ssd"
      canonical="/hardware/disk"
      products={products}
      filters={filters}
    />
  );
}
