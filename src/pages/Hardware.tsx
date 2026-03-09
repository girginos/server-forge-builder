import { useState, useMemo, useEffect } from "react";
import ServerCard from "@/components/ServerCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, SlidersHorizontal, Loader2, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import SEO from "@/components/SEO";
import { SITE_URL } from "@/config/site";
import HardwareSidebar from "@/components/hardware/HardwareSidebar";
import { supabase } from "@/lib/supabase";

const sortOptions = [
  { label: "Varsayılan", value: "default" },
  { label: "Fiyat: Düşükten Yükseğe", value: "price-asc" },
  { label: "Fiyat: Yüksekten Düşüğe", value: "price-desc" },
  { label: "İsim: A-Z", value: "name-asc" },
];

interface DBProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  images: string[] | null;
  category: string;
  price: number;
  specs: Record<string, string>;
  in_stock: boolean;
  featured: boolean;
}

export default function Hardware() {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sort, setSort] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    supabase
      .from("admin_products")
      .select("*")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProducts((data as unknown as DBProduct[]) || []);
        setLoading(false);
      });
  }, []);

  const toggleFilter = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const allBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach((p) => {
      const brand = (p.specs as any)?.brand || (p.specs as any)?.marka;
      if (brand) brands.add(brand);
    });
    return Array.from(brands).sort();
  }, [products]);

  const hasActiveFilters = search || selectedBrands.length > 0;

  const clearAll = () => {
    setSearch("");
    setSelectedBrands([]);
    setSort("default");
  };

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedBrands.length > 0) {
        const brand = (p.specs as any)?.brand || (p.specs as any)?.marka || "";
        if (!selectedBrands.includes(brand)) return false;
      }
      return true;
    });

    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [search, selectedBrands, sort, products]);

  return (
    <div className="py-10">
      <SEO
        title="Sunucu Donanımları"
        description="Dell, HP, Supermicro sunucu donanımları. Marka, fiyat ve form faktörüne göre filtreleyin."
        keywords="sunucu donanım, dell poweredge, hp proliant, supermicro, rack sunucu"
        canonical="/hardware"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Sunucu Donanımları",
          url: `${SITE_URL}/hardware`,
          numberOfItems: filtered.length,
        }}
      />
      <div className="container">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Sunucu Donanımları</h1>
          <p className="text-muted-foreground mt-1">Tüm ürünlerimizi inceleyin ve ihtiyacınıza uygun olanı seçin.</p>
        </div>

        {/* Search + controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Ürün ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {allBrands.length > 0 && (
              <Button variant={showFilters ? "default" : "outline"} size="default" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal className="h-4 w-4" /> Filtreler
              </Button>
            )}
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-56 shrink-0 space-y-4">
            <HardwareSidebar />

            {showFilters && allBrands.length > 0 && (
              <div className="bg-card border rounded-xl p-3 space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">Filtreler</p>
                <div>
                  <h3 className="font-semibold text-foreground text-xs mb-2 px-1">Marka</h3>
                  <div className="space-y-1">
                    {allBrands.map((brand) => {
                      const selected = selectedBrands.includes(brand);
                      return (
                        <button key={brand} onClick={() => toggleFilter(selectedBrands, brand, setSelectedBrands)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${selected ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}>
                          <span className="flex items-center gap-2">
                            <span className={`h-3.5 w-3.5 rounded border flex items-center justify-center transition-colors ${selected ? "bg-primary border-primary" : "border-border"}`}>
                              {selected && <span className="text-primary-foreground text-[8px]">✓</span>}
                            </span>
                            {brand}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearAll} className="w-full text-xs"><X className="h-3 w-3" /> Temizle</Button>
                )}
              </div>
            )}
          </div>

          <div className="flex-1">
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedBrands.map((b) => (
                  <span key={b} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                    {b} <button onClick={() => toggleFilter(selectedBrands, b, setSelectedBrands)}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">{filtered.length} ürün bulundu</p>
                {filtered.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((p) => (
                      <div key={p.id} className="bg-card border rounded-xl p-4 hover:border-primary/30 transition-colors group">
                        {p.image_url && (
                          <div className="aspect-[4/3] rounded-lg bg-muted/30 mb-3 flex items-center justify-center overflow-hidden">
                            <img src={p.image_url} alt={p.name} className="max-h-full object-contain group-hover:scale-105 transition-transform" loading="lazy" />
                          </div>
                        )}
                        {p.featured && <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">Öne Çıkan</span>}
                        <h3 className="font-semibold text-sm text-foreground leading-tight mb-1">{p.name}</h3>
                        {p.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{p.description}</p>}
                        {p.specs && Object.keys(p.specs).length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {Object.entries(p.specs).slice(0, 3).map(([k, v]) => (
                              <span key={k} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{String(v)}</span>
                            ))}
                          </div>
                        )}
                        <span className="text-lg font-bold text-primary">₺{p.price.toLocaleString("tr-TR")}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-card border rounded-lg">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-foreground">Henüz ürün eklenmemiş</h3>
                    <p className="text-sm text-muted-foreground mt-1">Admin panelinden ürün ekleyebilirsiniz.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
