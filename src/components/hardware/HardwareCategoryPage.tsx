import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, SlidersHorizontal } from "lucide-react";
import SEO from "@/components/SEO";
import { SITE_URL } from "@/config/site";
import HardwareSidebar from "./HardwareSidebar";

export interface HardwareProduct {
  id: string;
  name: string;
  image: string;
  specs: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  brand: string;
}

interface FilterConfig {
  label: string;
  key: string;
  options: string[];
}

interface HardwareCategoryPageProps {
  title: string;
  description: string;
  seoDescription: string;
  seoKeywords: string;
  canonical: string;
  products: HardwareProduct[];
  filters?: FilterConfig[];
}

export default function HardwareCategoryPage({
  title,
  description,
  seoDescription,
  seoKeywords,
  canonical,
  products,
  filters = [],
}: HardwareCategoryPageProps) {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [sort, setSort] = useState("default");

  const toggleFilter = (key: string, val: string) => {
    setActiveFilters((prev) => {
      const current = prev[key] || [];
      return {
        ...prev,
        [key]: current.includes(val)
          ? current.filter((v) => v !== val)
          : [...current, val],
      };
    });
  };

  const hasActiveFilters = search || Object.values(activeFilters).some((v) => v.length > 0);

  const clearAll = () => {
    setSearch("");
    setActiveFilters({});
    setSort("default");
  };

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      for (const [key, values] of Object.entries(activeFilters)) {
        if (values.length > 0 && !values.includes((p as any)[key])) return false;
      }
      return true;
    });

    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [search, activeFilters, sort, products]);

  return (
    <div className="py-10">
      <SEO
        title={title}
        description={seoDescription}
        keywords={seoKeywords}
        canonical={canonical}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: title,
          url: `${SITE_URL}${canonical}`,
          numberOfItems: filtered.length,
          itemListElement: filtered.slice(0, 10).map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Product",
              name: p.name,
              description: p.specs,
              brand: { "@type": "Brand", name: p.brand },
              offers: {
                "@type": "Offer",
                price: p.price.toString(),
                priceCurrency: "TRY",
                availability: "https://schema.org/InStock",
                seller: { "@type": "Organization", name: "ServerMarket" },
              },
            },
          })),
        }}
      />
      <div className="container">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>

        {/* Search + sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`${title} ara...`}
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
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="default">Varsayılan</option>
            <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
            <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
            <option value="name-asc">İsim: A-Z</option>
          </select>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar */}
          <HardwareSidebar />

          <div className="flex-1">
            {/* Filter sidebar for category-specific filters */}
            {filters.length > 0 && (
              <div className="flex flex-wrap gap-4 mb-6">
                {filters.map((filter) => (
                  <div key={filter.key} className="bg-card border rounded-lg p-3">
                    <h3 className="font-semibold text-foreground text-xs mb-2">{filter.label}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {filter.options.map((opt) => {
                        const selected = (activeFilters[filter.key] || []).includes(opt);
                        return (
                          <button
                            key={opt}
                            onClick={() => toggleFilter(filter.key, opt)}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                              selected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearAll} className="self-end">
                    <X className="h-3 w-3" /> Temizle
                  </Button>
                )}
              </div>
            )}

            <p className="text-sm text-muted-foreground mb-4">{filtered.length} ürün bulundu</p>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((p) => (
                  <div key={p.id} className="bg-card border rounded-xl p-4 hover:border-primary/30 transition-colors group">
                    <div className="aspect-[4/3] rounded-lg bg-muted/30 mb-3 flex items-center justify-center overflow-hidden">
                      <img src={p.image} alt={p.name} className="max-h-full object-contain group-hover:scale-105 transition-transform" loading="lazy" />
                    </div>
                    {p.badge && (
                      <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">{p.badge}</span>
                    )}
                    <h3 className="font-semibold text-sm text-foreground leading-tight mb-1">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{p.specs}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-primary">₺{p.price.toLocaleString("tr-TR")}</span>
                      {p.oldPrice && (
                        <span className="text-xs text-muted-foreground line-through">₺{p.oldPrice.toLocaleString("tr-TR")}</span>
                      )}
                    </div>
                  </div>
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
