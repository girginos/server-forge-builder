import HardwareCategoryPage from "@/components/hardware/HardwareCategoryPage";

const filters = [
  { label: "Marka", key: "brand", options: ["Samsung", "Seagate", "Intel", "Micron", "Toshiba"] },
  { label: "Disk Tipi", key: "type", options: ["SSD", "NVMe", "HDD"] },
];

export default function DiskPage() {
  return (
    <HardwareCategoryPage
      title="Disk & Depolama"
      description="SSD, NVMe ve HDD sunucu depolama çözümleri."
      seoDescription="Sunucu disk ve depolama çözümleri. Samsung, Seagate, Intel SSD, NVMe ve HDD diskler."
      seoKeywords="sunucu disk, ssd, nvme, hdd, samsung ssd, seagate exos, enterprise ssd"
      canonical="/hardware/disk"
      categoryDbValue="disk"
      filters={filters}
    />
  );
}
