import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { supabase as cloudSupabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/RichTextEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { HARDWARE_CATEGORIES, slugify } from "@/config/hardware-categories";

interface SpecFields {
  cpu: string;
  ram: string;
  storage: string;
  network: string;
  form_factor: string;
  warranty: string;
  power: string;
  os: string;
}

interface ProductForm {
  name: string;
  short_description: string;
  description: string;
  category: string;
  price: number;
  specs: SpecFields;
  image_url: string;
  images: string[];
  in_stock: boolean;
  featured: boolean;
}

const emptySpecs: SpecFields = {
  cpu: "",
  ram: "",
  storage: "",
  network: "",
  form_factor: "",
  warranty: "",
  power: "",
  os: "",
};

const specLabels: Record<keyof SpecFields, string> = {
  cpu: "İşlemci",
  ram: "RAM",
  storage: "Disk / Depolama",
  network: "Ağ",
  form_factor: "Form Faktörü",
  warranty: "Garanti",
  power: "Güç Kaynağı",
  os: "İşletim Sistemi",
};

const emptyForm: ProductForm = {
  name: "",
  description: "",
  category: "server",
  price: 0,
  specs: { ...emptySpecs },
  image_url: "",
  images: [],
  in_stock: true,
  featured: false,
};

export default function AdminProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (isEditing) {
      supabase
        .from("admin_products")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            toast({ title: "Ürün bulunamadı", variant: "destructive" });
            navigate("/admin/urunler");
            return;
          }
          setForm({
            name: data.name,
            description: data.description || "",
            category: data.category,
            price: data.price,
            specs: { ...emptySpecs, ...(typeof data.specs === 'object' ? data.specs as Record<string, string> : {}) },
            image_url: data.image_url || "",
            images: (data as any).images || [],
            in_stock: data.in_stock,
            featured: data.featured,
          });
          setLoading(false);
        });
    }
  }, [id, isEditing, navigate, toast]);

  const uploadImages = async (files: FileList | File[]) => {
    setUploading(true);
    const newImages: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;

      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const filePath = `products/${fileName}`;

      const { error } = await cloudSupabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (error) {
        toast({ title: "Yükleme hatası", description: error.message, variant: "destructive" });
        continue;
      }

      const { data: urlData } = cloudSupabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      newImages.push(urlData.publicUrl);
    }

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
      image_url: prev.image_url || newImages[0] || "",
    }));
    setUploading(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) {
      uploadImages(e.dataTransfer.files);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const removeImage = (index: number) => {
    setForm((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        image_url: newImages[0] || "",
      };
    });
  };

  const setMainImage = (url: string) => {
    setForm((prev) => ({ ...prev, image_url: url }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: "Ürün adı gerekli", variant: "destructive" });
      return;
    }

    setSaving(true);
    // Filter out empty spec values
    const specs: Record<string, string> = {};
    for (const [key, value] of Object.entries(form.specs)) {
      if (value.trim()) specs[key] = value.trim();
    }

    const payload: Record<string, any> = {
      name: form.name,
      slug: slugify(form.name),
      description: form.description || null,
      category: form.category,
      price: form.price,
      specs,
      image_url: form.image_url || null,
      images: form.images,
      in_stock: form.in_stock,
      featured: form.featured,
      updated_at: new Date().toISOString(),
    };

    const { error } = isEditing
      ? await supabase.from("admin_products").update(payload).eq("id", id)
      : await supabase.from("admin_products").insert(payload);

    setSaving(false);

    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: isEditing ? "Ürün güncellendi" : "Ürün oluşturuldu" });
    navigate("/admin/urunler");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/urunler")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{isEditing ? "Ürün Düzenle" : "Yeni Ürün"}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Temel Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Ürün Adı *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Dell PowerEdge R740"
                />
              </div>

              <div className="space-y-2">
                <Label>Açıklama</Label>
                <RichTextEditor
                  content={form.description}
                  onChange={(html) => setForm({ ...form, description: html })}
                  placeholder="Ürün hakkında detaylı açıklama..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Specs */}
          <Card>
            <CardHeader>
              <CardTitle>Teknik Özellikler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {(Object.keys(specLabels) as Array<keyof SpecFields>).map((key) => (
                  <div key={key} className="space-y-2">
                    <Label>{specLabels[key]}</Label>
                    <Input
                      value={form.specs[key]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          specs: { ...form.specs, [key]: e.target.value },
                        })
                      }
                      placeholder={
                        key === "cpu" ? "2x Intel Xeon E5-2680 v4" :
                        key === "ram" ? "64GB DDR4 ECC" :
                        key === "storage" ? "2x 1TB SSD NVMe" :
                        key === "network" ? "4x 1GbE + 2x 10GbE" :
                        key === "form_factor" ? "2U Rack" :
                        key === "warranty" ? "3 Yıl" :
                        key === "power" ? "2x 750W Redundant" :
                        "Yok"
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Görseller</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                  dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Yükleniyor...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Görselleri sürükleyip bırakın veya tıklayın
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP</p>
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && uploadImages(e.target.files)}
                />
              </div>

              {form.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {form.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "relative group rounded-lg overflow-hidden border-2 transition-colors",
                        form.image_url === img ? "border-primary" : "border-transparent"
                      )}
                    >
                      <img
                        src={img}
                        alt={`Ürün görseli ${idx + 1}`}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setMainImage(img)}
                          disabled={form.image_url === img}
                        >
                          {form.image_url === img ? "Ana" : "Ana Yap"}
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8"
                          onClick={() => removeImage(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {form.image_url === img && (
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          Ana Görsel
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Yayınla</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Stokta</Label>
                <Switch
                  checked={form.in_stock}
                  onCheckedChange={(v) => setForm({ ...form, in_stock: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Öne Çıkan</Label>
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) => setForm({ ...form, featured: v })}
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={saving || !form.name}
                className="w-full"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : isEditing ? (
                  "Güncelle"
                ) : (
                  "Oluştur"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fiyat & Kategori</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {HARDWARE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fiyat (₺)</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
