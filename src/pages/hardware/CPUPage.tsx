import HardwareCategoryPage from "@/components/hardware/HardwareCategoryPage";

const filters = [
  { label: "Marka", key: "brand", options: ["Intel", "AMD"] },
  { label: "Seri", key: "series", options: ["Silver", "Gold", "Platinum", "E-Series", "EPYC 7003", "EPYC 9004"] },
];

export default function CPUPage() {
  return (
    <HardwareCategoryPage
      title="CPU - İşlemci"
      description="Intel Xeon ve AMD EPYC sunucu işlemcileri."
      seoDescription="Sunucu işlemcileri. Intel Xeon Scalable ve AMD EPYC işlemciler."
      seoKeywords="sunucu işlemci, cpu, intel xeon, amd epyc, xeon scalable"
      canonical="/hardware/cpu"
      categoryDbValue="cpu"
      filters={filters}
    />
  );
}
