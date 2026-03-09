import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import SEO from "@/components/SEO";
import { SITE_URL } from "@/config/site";
import HardwareSidebar from "./HardwareSidebar";
import { supabase } from "@/lib/supabase";

export interface HardwareProduct {
  id: string;
  name: string;
  image_url: string | null;
  description: string | null;
  specs: Record<string, string>;
  price: number;
  in_stock: boolean;
  featured: boolean;
  category: string;
  brand?: string;
  [key: string]: any;
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
  categoryDbValue: string;
  filters?: FilterConfig[];
}

function AddToCartButton({ product }: { product: HardwareProduct }) {
  const { addItem } = useCart();
  return (
    <Button
      size="sm"
      variant="outline"
      className="shrink-0 gap-1.5 text-xs"
      disabled={!product.in_stock}
      onClick={() =>
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image_url || undefined,
          specs: product.description || undefined,
        })
      }
    >
      <ShoppingCart className="h-3.5 w-3.5" />
      Sepete Ekle
    </Button>
  );
}

export default function HardwareCategoryPage({
  title,
  description,
  seoDescription,
  seoKeywords,
  canonical,
  categoryDbValue,
  filters = [],
}: HardwareCategoryPageProps) {
  const [products, setProducts] = useState<HardwareProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [sort, setSort] = useState("default");

  useEffect(() => {
    setLoading(true);
    supabase
      .from("admin_products")
      .select("*")
      .eq("category", categoryDbValue)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const mapped = (data || []).map((p: any) => ({
          ...p,
          specs: typeof p.specs === "object" ? p.specs : {},
          brand: p.specs?.brand || p.specs?.marka || "",
        }));
        setProducts(mapped);
        setLoading(false);
      });
  }, [categoryDbValue]);

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
        if (values.length > 0) {
          const productVal = p.specs?.[key] || (p as any)[key] || "";
          if (!values.includes(productVal)) return false;
        }
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
              description: p.description || "",
              offers: {
                "@type": "Offer",
                price: p.price.toString(),
                priceCurrency: "TRY",
                availability: p.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
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
          {filters.length > 0 && (
            <div className="w-full lg:w-56 shrink-0">
              <div className="bg-card border rounded-xl p-3 space-y-4 sticky top-20">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
                  Filtreler
                </p>
                {filters.map((filter) => (
                  <div key={filter.key}>
                    <h3 className="font-semibold text-foreground text-xs mb-2 px-1">{filter.label}</h3>
                    <div className="space-y-1">
                      {filter.options.map((opt) => {
                        const selected = (activeFilters[filter.key] || []).includes(opt);
                        const count = products.filter((p) => {
                          const val = p.specs?.[filter.key] || (p as any)[filter.key] || "";
                          return val === opt;
                        }).length;
                        return (
                          <button
                            key={opt}
                            onClick={() => toggleFilter(filter.key, opt)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              selected
                                ? "bg-primary/10 text-primary"
                                : "text-foreground hover:bg-muted"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className={`h-3.5 w-3.5 rounded border flex items-center justify-center transition-colors ${
                                selected ? "bg-primary border-primary" : "border-border"
                              }`}>
                                {selected && <span className="text-primary-foreground text-[8px]">✓</span>}
                              </span>
                              {opt}
                            </span>
                            <span className="text-muted-foreground">({count})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearAll} className="w-full text-xs">
                    <X className="h-3 w-3" /> Filtreleri Temizle
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="flex-1">
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
                      <div key={p.id} className="bg-card border rounded-xl p-4 hover:border-primary/30 transition-colors group flex flex-col">
                        <Link to={getProductUrl(p.category, (p as any).slug || p.id)} className="block">
                          {p.image_url && (
                            <div className="aspect-[4/3] rounded-lg bg-muted/30 mb-3 flex items-center justify-center overflow-hidden">
                              <img src={p.image_url} alt={p.name} className="max-h-full object-contain group-hover:scale-105 transition-transform" loading="lazy" />
                            </div>
                          )}
                          {p.featured && (
                            <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">Öne Çıkan</span>
                          )}
                          {!p.in_stock && (
                            <span className="inline-block bg-destructive/10 text-destructive text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">Stok Dışı</span>
                          )}
                          <h3 className="font-semibold text-sm text-foreground leading-tight mb-1">{p.name}</h3>
                          {p.description && (
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{p.description}</p>
                          )}
                          {Object.keys(p.specs).length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {Object.entries(p.specs).slice(0, 3).map(([k, v]) => (
                                <span key={k} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{String(v)}</span>
                              ))}
                            </div>
                          )}
                        </Link>
                        <div className="flex items-center justify-between gap-2 mt-auto pt-1">
                          <span className="text-lg font-bold text-primary">₺{p.price.toLocaleString("tr-TR")}</span>
                          <AddToCartButton product={p} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-card border rounded-lg">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-foreground">Henüz ürün eklenmemiş</h3>
                    <p className="text-sm text-muted-foreground mt-1">Bu kategoriye admin panelinden ürün ekleyebilirsiniz.</p>
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
