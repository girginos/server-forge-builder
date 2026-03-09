import HardwareCategoryPage from "@/components/hardware/HardwareCategoryPage";

const filters = [
  { label: "Marka", key: "brand", options: ["Samsung", "SK Hynix", "Micron"] },
  { label: "Tip", key: "type", options: ["DDR4", "DDR5"] },
  { label: "Kapasite", key: "capacity", options: ["16GB", "32GB", "64GB", "128GB"] },
];

export default function RAMPage() {
  return (
    <HardwareCategoryPage
      title="RAM - Sunucu Bellek"
      description="DDR4 ve DDR5 ECC sunucu bellekleri."
      seoDescription="Sunucu RAM bellekleri. DDR4, DDR5 ECC RDIMM ve LRDIMM modüller."
      seoKeywords="sunucu ram, ddr4, ddr5, ecc bellek, rdimm, lrdimm"
      canonical="/hardware/ram"
      categoryDbValue="ram"
      filters={filters}
    />
  );
}
