import HardwareCategoryPage from "@/components/hardware/HardwareCategoryPage";

const filters = [
  { label: "Kablo Tipi", key: "type", options: ["DAC", "Fiber", "Bakır", "Güç"] },
];

export default function KabloPage() {
  return (
    <HardwareCategoryPage
      title="Kablo & Bağlantı"
      description="DAC, fiber optik ve patch kablolar."
      seoDescription="Sunucu kablo ve bağlantı çözümleri. DAC, fiber optik, Cat6A, güç kabloları."
      seoKeywords="dac kablo, fiber optik kablo, patch kablo, sfp+ kablo"
      canonical="/hardware/kablo"
      categoryDbValue="kablo"
      filters={filters}
    />
  );
}
