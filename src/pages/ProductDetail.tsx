import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { SITE_URL } from "@/config/site";
import { getCategoryLabel, HARDWARE_CATEGORIES, getProductUrl } from "@/config/hardware-categories";
import {
  ArrowLeft,
  ShoppingCart,
  Check,
  XCircle,
  ChevronRight,
  Star,
  Loader2,
  ZoomIn,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  price: number;
  specs: Record<string, string>;
  image_url: string | null;
  images: string[] | null;
  in_stock: boolean;
  featured: boolean;
}

const specLabels: Record<string, string> = {
  cpu: "İşlemci",
  ram: "RAM / Bellek",
  storage: "Disk / Depolama",
  network: "Ağ",
  form_factor: "Form Faktörü",
  warranty: "Garanti",
  power: "Güç Kaynağı",
  os: "İşletim Sistemi",
  brand: "Marka",
  type: "Tip",
  series: "Seri",
  socket: "Soket",
  speed: "Hız",
  capacity: "Kapasite",
};

export default function ProductDetail() {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!productSlug) return;
    setLoading(true);

    supabase
      .from("admin_products")
      .select("*")
      .eq("slug", productSlug)
      .single()
      .then(({ data, error }: any) => {
        if (error || !data) {
          navigate("/hardware", { replace: true });
          return;
        }
        const p = {
          ...data,
          slug: data.slug || "",
          specs: typeof data.specs === "object" && data.specs !== null ? (data.specs as Record<string, string>) : {},
          images: data.images || [],
        } as Product;
        setProduct(p);
        setSelectedImage(0);
        setLoading(false);

        // Load related products
        supabase
          .from("admin_products")
          .select("*")
          .eq("category", data.category)
          .neq("id", data.id)
          .limit(4)
          .then(({ data: related }: any) => {
            setRelatedProducts(
              (related || []).map((r: any) => ({
                ...r,
                slug: r.slug || "",
                specs: typeof r.specs === "object" ? r.specs : {},
                images: r.images || [],
              }))
            );
          });
      });
  }, [productSlug, navigate]);

  if (loading || !product) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const allImages = product.images?.length
    ? product.images
    : product.image_url
    ? [product.image_url]
    : [];

  const categorySlug =
    HARDWARE_CATEGORIES.find((c) => c.value === product.category)?.slug || product.category;

  const displaySpecs = Object.entries(product.specs).filter(
    ([key]) => !["brand", "type", "series", "socket", "speed", "capacity"].includes(key)
  );

  return (
    <div className="py-8">
      <SEO
        title={`${product.name} | ServerMarket`}
        description={product.description || `${product.name} - ${getCategoryLabel(product.category)}`}
        canonical={`/urun/${categorySlug}/${product.slug}`}
        ogImage={allImages[0] || undefined}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description || "",
          image: allImages[0] || "",
          offers: {
            "@type": "Offer",
            price: product.price.toString(),
            priceCurrency: "TRY",
            availability: product.in_stock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          },
        }}
      />

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link to="/" className="hover:text-foreground transition-colors">
            Ana Sayfa
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/hardware" className="hover:text-foreground transition-colors">
            Donanım
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            to={`/hardware/${categorySlug}`}
            className="hover:text-foreground transition-colors"
          >
            {getCategoryLabel(product.category)}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Main Layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <div className="space-y-3">
            {/* Main Image */}
            <div
              className="relative aspect-square bg-card border rounded-2xl flex items-center justify-center overflow-hidden cursor-zoom-in group"
              onClick={() => allImages.length > 0 && setLightbox(true)}
            >
              {allImages.length > 0 ? (
                <>
                  <img
                    src={allImages[selectedImage]}
                    alt={product.name}
                    className="max-h-[90%] max-w-[90%] object-contain transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="h-4 w-4 text-foreground" />
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground text-sm">Görsel yok</div>
              )}
              {product.featured && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary text-primary-foreground gap-1">
                    <Star className="h-3 w-3" /> Öne Çıkan
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden bg-card flex items-center justify-center transition-colors",
                      selectedImage === i
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground/30"
                    )}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title + badges */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="outline">{getCategoryLabel(product.category)}</Badge>
                {product.specs.brand && (
                  <Badge variant="secondary">{product.specs.brand}</Badge>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price + Stock */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                ₺{product.price.toLocaleString("tr-TR")}
              </span>
              {product.in_stock ? (
                <span className="flex items-center gap-1 text-sm font-medium text-[hsl(var(--success))]">
                  <Check className="h-4 w-4" /> Stokta
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sm font-medium text-destructive">
                  <XCircle className="h-4 w-4" /> Stok Dışı
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.description && (
              <div
                className="text-muted-foreground leading-relaxed text-sm [&_a]:text-primary [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
              />
            )}

            {/* Add to cart */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 gap-2"
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
                <ShoppingCart className="h-5 w-5" />
                Sepete Ekle
              </Button>
            </div>

            {/* Specs Table */}
            {displaySpecs.length > 0 && (
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-muted/50 px-4 py-2.5 border-b">
                  <h2 className="font-semibold text-sm text-foreground">
                    Teknik Özellikler
                  </h2>
                </div>
                <div className="divide-y">
                  {displaySpecs.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start px-4 py-3 text-sm"
                    >
                      <span className="w-40 shrink-0 text-muted-foreground font-medium">
                        {specLabels[key] || key}
                      </span>
                      <span className="text-foreground">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Description Section */}
            {product.description && (
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-muted/50 px-4 py-2.5 border-b">
                  <h2 className="font-semibold text-sm text-foreground">
                    Ürün Açıklaması
                  </h2>
                </div>
                <div className="px-4 py-4">
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Benzer Ürünler
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={getProductUrl(p.category, p.slug)}
                  className="bg-card border rounded-xl p-3 hover:border-primary/30 transition-colors group"
                >
                  {p.image_url && (
                    <div className="aspect-square rounded-lg bg-muted/30 mb-2 flex items-center justify-center overflow-hidden">
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="max-h-full object-contain group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <h3 className="text-xs font-semibold text-foreground leading-tight line-clamp-2 mb-1">
                    {p.name}
                  </h3>
                  <span className="text-sm font-bold text-primary">
                    ₺{p.price.toLocaleString("tr-TR")}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && allImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl font-light"
          >
            ×
          </button>
          <img
            src={allImages[selectedImage]}
            alt={product.name}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {allImages.length > 1 && (
            <div className="absolute bottom-6 flex gap-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(i);
                  }}
                  className={cn(
                    "w-16 h-16 rounded-lg border-2 overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center",
                    selectedImage === i ? "border-white" : "border-white/20"
                  )}
                >
                  <img
                    src={img}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
