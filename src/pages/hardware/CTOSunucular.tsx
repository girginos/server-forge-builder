import HardwareCategoryPage from "@/components/hardware/HardwareCategoryPage";

const filters = [
  { label: "Marka", key: "brand", options: ["Dell", "HPE", "IBM", "Supermicro"] },
  { label: "Form Faktörü", key: "form_factor", options: ["1U", "2U", "4U"] },
];

export default function CTOSunucular() {
  return (
    <HardwareCategoryPage
      title="CTO Sunucular"
      description="Configure-to-Order: İhtiyacınıza göre yapılandırılabilir boş sunucu kasaları."
      seoDescription="CTO (Configure-to-Order) sunucular. Dell, HPE, IBM, Supermicro boş kasa sunucular. İhtiyacınıza göre özel yapılandırma imkanı."
      seoKeywords="cto sunucu, configure to order, boş kasa sunucu, dell cto, hpe cto, ibm cto, supermicro cto"
      canonical="/hardware/cto-sunucular"
      categoryDbValue="cto-sunucular"
      filters={filters}
    />
  );
}
