import { useState, useMemo } from "react";
import ServerCard from "@/components/ServerCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, SlidersHorizontal } from "lucide-react";
import SEO from "@/components/SEO";
import serverR740 from "@/assets/server-r740.png";
import serverR640 from "@/assets/server-r640.png";
import serverDL380 from "@/assets/server-dl380.png";
import serverSupermicro from "@/assets/server-supermicro.png";

const allServers = [
  { id: "dell-r740xd", name: "Dell PowerEdge R740xd", image: serverR740, formFactor: "2U Rack Mount", cpu: "2x Intel Xeon Scalable", maxRam: "3072 GB DDR4", price: 45000, oldPrice: 52000, badge: "Popüler", brand: "Dell", cpuBrand: "Intel" },
  { id: "dell-r640", name: "Dell PowerEdge R640", image: serverR640, formFactor: "1U Rack Mount", cpu: "2x Intel Xeon Scalable", maxRam: "2048 GB DDR4", price: 32000, brand: "Dell", cpuBrand: "Intel" },
  { id: "hp-dl380", name: "HP ProLiant DL380 Gen10", image: serverDL380, formFactor: "2U Rack Mount", cpu: "2x Intel Xeon Scalable", maxRam: "3072 GB DDR4", price: 38000, badge: "Yeni", brand: "HP", cpuBrand: "Intel" },
  { id: "supermicro-2u", name: "Supermicro SuperServer 2U", image: serverSupermicro, formFactor: "2U Rack Mount", cpu: "2x Intel Xeon Scalable", maxRam: "4096 GB DDR4", price: 55000, oldPrice: 62000, brand: "Supermicro", cpuBrand: "Intel" },
  { id: "dell-r740xd-12lff", name: "Dell PowerEdge R740xd 12LFF", image: serverR740, formFactor: "2U Rack Mount", cpu: "2x Intel Xeon Scalable", maxRam: "3072 GB DDR4", price: 48000, brand: "Dell", cpuBrand: "Intel" },
  { id: "hp-dl360", name: "HP ProLiant DL360 Gen10", image: serverDL380, formFactor: "1U Rack Mount", cpu: "2x Intel Xeon Scalable", maxRam: "2048 GB DDR4", price: 35000, badge: "İndirimli", oldPrice: 40000, brand: "HP", cpuBrand: "Intel" },
  { id: "dell-r630", name: "Dell PowerEdge R630", image: serverR640, formFactor: "1U Rack Mount", cpu: "2x Intel Xeon E5-2600 v4", maxRam: "1536 GB DDR4", price: 22000, brand: "Dell", cpuBrand: "Intel" },
  { id: "supermicro-1u", name: "Supermicro SuperServer 1U", image: serverSupermicro, formFactor: "1U Rack Mount", cpu: "2x Intel Xeon Scalable", maxRam: "2048 GB DDR4", price: 42000, brand: "Supermicro", cpuBrand: "Intel" },
  { id: "dell-r7525", name: "Dell PowerEdge R7525", image: serverR740, formFactor: "2U Rack Mount", cpu: "2x AMD EPYC 7003", maxRam: "4096 GB DDR4", price: 58000, badge: "Yeni", brand: "Dell", cpuBrand: "AMD" },
  { id: "hp-dl325", name: "HP ProLiant DL325 Gen10 Plus", image: serverDL380, formFactor: "1U Rack Mount", cpu: "1x AMD EPYC 7003", maxRam: "2048 GB DDR4", price: 36000, brand: "HP", cpuBrand: "AMD" },
  { id: "supermicro-amd-2u", name: "Supermicro H12DSU-iN 2U", image: serverSupermicro, formFactor: "2U Rack Mount", cpu: "2x AMD EPYC 7003", maxRam: "4096 GB DDR4", price: 62000, oldPrice: 70000, brand: "Supermicro", cpuBrand: "AMD" },
];

const brands = ["Dell", "HP", "Supermicro"];
const cpuBrands = ["Intel", "AMD"];
const formFactors = ["1U Rack Mount", "2U Rack Mount"];
const priceRanges = [
  { label: "Tümü", min: 0, max: Infinity },
  { label: "₺20.000 - ₺35.000", min: 20000, max: 35000 },
  { label: "₺35.000 - ₺50.000", min: 35000, max: 50000 },
  { label: "₺50.000+", min: 50000, max: Infinity },
];
const sortOptions = [
  { label: "Varsayılan", value: "default" },
  { label: "Fiyat: Düşükten Yükseğe", value: "price-asc" },
  { label: "Fiyat: Yüksekten Düşüğe", value: "price-desc" },
  { label: "İsim: A-Z", value: "name-asc" },
];

export default function Hardware() {
  const [search, setSearch] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFormFactors, setSelectedFormFactors] = useState<string[]>([]);
  const [selectedCpuBrands, setSelectedCpuBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(0);
  const [sort, setSort] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilter = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const hasActiveFilters = search || selectedBrands.length > 0 || selectedFormFactors.length > 0 || selectedCpuBrands.length > 0 || priceRange > 0;

  const clearAll = () => {
    setSearch("");
    setSelectedBrands([]);
    setSelectedFormFactors([]);
    setSelectedCpuBrands([]);
    setPriceRange(0);
    setSort("default");
  };

  const filtered = useMemo(() => {
    let result = allServers.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(s.brand)) return false;
      if (selectedFormFactors.length > 0 && !selectedFormFactors.includes(s.formFactor)) return false;
      if (selectedCpuBrands.length > 0 && !selectedCpuBrands.includes(s.cpuBrand)) return false;
      const range = priceRanges[priceRange];
      if (s.price < range.min || s.price > range.max) return false;
      return true;
    });

    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [search, selectedBrands, selectedFormFactors, selectedCpuBrands, priceRange, sort]);

  return (
    <div className="py-10">
      <SEO
        title="Sunucu Donanımları"
        description="Dell, HP, Supermicro sunucu donanımları. Marka, fiyat ve form faktörüne göre filtreleyin, ihtiyacınıza uygun sunucuyu bulun."
        keywords="sunucu donanım, dell poweredge, hp proliant, supermicro, rack sunucu, 1u sunucu, 2u sunucu"
        canonical="/hardware"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Sunucu Donanımları",
          url: "https://servermarket.com.tr/hardware",
          numberOfItems: filtered.length,
          itemListElement: filtered.slice(0, 10).map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Product",
              name: s.name,
              description: `${s.formFactor} - ${s.cpu} - ${s.maxRam}`,
              brand: { "@type": "Brand", name: s.brand },
              offers: {
                "@type": "Offer",
                price: s.price.toString(),
                priceCurrency: "TRY",
                availability: "https://schema.org/InStock",
                seller: { "@type": "Organization", name: "ServerMarket" },
              },
            },
          })),
        }}
      />
      <div className="container">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Sunucu Donanımları</h1>
          <p className="text-muted-foreground mt-1">Tüm sunucu modellerimizi inceleyin ve ihtiyacınıza uygun olanı seçin.</p>
        </div>

        {/* Search + controls bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sunucu ara (ör. Dell R740, HP DL380...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              size="default"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filtreler
            </Button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar filters */}
          {showFilters && (
          <aside className="w-full lg:w-60 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {/* Brand */}
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-semibold text-foreground text-sm mb-3">Marka</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleFilter(selectedBrands, brand, setSelectedBrands)}
                      className="accent-primary rounded"
                    />
                    <span className="text-sm text-foreground">{brand}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      ({allServers.filter((s) => s.brand === brand).length})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* CPU Brand */}
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-semibold text-foreground text-sm mb-3">İşlemci</h3>
              <div className="space-y-2">
                {cpuBrands.map((cpuBrand) => (
                  <label key={cpuBrand} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCpuBrands.includes(cpuBrand)}
                      onChange={() => toggleFilter(selectedCpuBrands, cpuBrand, setSelectedCpuBrands)}
                      className="accent-primary rounded"
                    />
                    <span className="text-sm text-foreground">{cpuBrand}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      ({allServers.filter((s) => s.cpuBrand === cpuBrand).length})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Form Factor */}
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-semibold text-foreground text-sm mb-3">Form Faktörü</h3>
              <div className="space-y-2">
                {formFactors.map((ff) => (
                  <label key={ff} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFormFactors.includes(ff)}
                      onChange={() => toggleFilter(selectedFormFactors, ff, setSelectedFormFactors)}
                      className="accent-primary rounded"
                    />
                    <span className="text-sm text-foreground">{ff}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      ({allServers.filter((s) => s.formFactor === ff).length})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-semibold text-foreground text-sm mb-3">Fiyat Aralığı</h3>
              <div className="space-y-2">
                {priceRanges.map((range, i) => (
                  <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === i}
                      onChange={() => setPriceRange(i)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-foreground">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <div className="sm:col-span-2 lg:col-span-1">
                <Button variant="outline" size="sm" className="w-full" onClick={clearAll}>
                  <X className="h-3 w-3" /> Filtreleri Temizle
                </Button>
              </div>
            )}
            </div>
          </aside>
          )}

          {/* Products */}
          <div className="flex-1">
            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedBrands.map((b) => (
                  <span key={b} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                    {b}
                    <button onClick={() => toggleFilter(selectedBrands, b, setSelectedBrands)}><X className="h-3 w-3" /></button>
                  </span>
                ))}
                {selectedCpuBrands.map((cb) => (
                  <span key={cb} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                    {cb}
                    <button onClick={() => toggleFilter(selectedCpuBrands, cb, setSelectedCpuBrands)}><X className="h-3 w-3" /></button>
                  </span>
                ))}
                {selectedFormFactors.map((ff) => (
                  <span key={ff} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                    {ff}
                    <button onClick={() => toggleFilter(selectedFormFactors, ff, setSelectedFormFactors)}><X className="h-3 w-3" /></button>
                  </span>
                ))}
                {priceRange > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                    {priceRanges[priceRange].label}
                    <button onClick={() => setPriceRange(0)}><X className="h-3 w-3" /></button>
                  </span>
                )}
              </div>
            )}

            <p className="text-sm text-muted-foreground mb-4">{filtered.length} ürün bulundu</p>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((s) => (
                  <ServerCard key={s.id} {...s} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card border rounded-lg">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-foreground">Sonuç bulunamadı</h3>
                <p className="text-sm text-muted-foreground mt-1">Filtrelerinizi değiştirerek tekrar deneyin.</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={clearAll}>Filtreleri Temizle</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
