import HardwareCategoryPage from "@/components/hardware/HardwareCategoryPage";

const filters = [
  { label: "Marka", key: "brand", options: ["Dell", "HPE", "Supermicro"] },
  { label: "Soket", key: "socket", options: ["LGA3647", "LGA4189", "SP3"] },
];

export default function AnakartPage() {
  return (
    <HardwareCategoryPage
      title="Anakart - System Board"
      description="Sunucu anakartları ve sistem kartları."
      seoDescription="Sunucu anakartları. Dell, HPE, Supermicro system board ve anakart ürünleri."
      seoKeywords="sunucu anakart, system board, dell anakart, supermicro anakart"
      canonical="/hardware/anakart"
      categoryDbValue="anakart"
      filters={filters}
    />
  );
}
