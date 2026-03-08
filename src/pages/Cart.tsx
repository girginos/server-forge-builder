import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Minus, ShoppingCart, Send, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const quoteSchema = z.object({
  name: z.string().trim().min(1, "Ad Soyad zorunludur").max(100),
  company: z.string().trim().max(100).optional(),
  email: z.string().trim().email("Geçerli bir e-posta adresi girin").max(255),
  phone: z.string().trim().min(1, "Telefon zorunludur").max(20),
  note: z.string().trim().max(1000).optional(),
});

type QuoteForm = z.infer<typeof quoteSchema>;

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteForm, string>>>({});
  const [form, setForm] = useState<QuoteForm>({ name: "", company: "", email: "", phone: "", note: "" });

  const updateField = (field: keyof QuoteForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = quoteSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof QuoteForm, string>> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof QuoteForm;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
    toast.success("Teklif talebiniz başarıyla gönderildi!");
  };

  if (items.length === 0 && !submitted) {
    return (
      <div className="py-20 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground">Sepetiniz Boş</h1>
        <p className="text-muted-foreground mt-2">Henüz ürün eklemediniz.</p>
        <Button variant="hero" className="mt-6" asChild>
          <Link to="/donanim">Ürünleri İncele</Link>
        </Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="py-20 text-center">
        <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground">Teklif Talebiniz Alındı</h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          En kısa sürede ekibimiz sizinle iletişime geçecektir. Teklif detaylarınız e-posta adresinize gönderilecektir.
        </p>
        <Button variant="hero" className="mt-6" asChild>
          <Link to="/" onClick={() => { clearCart(); setSubmitted(false); }}>Ana Sayfaya Dön</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container max-w-5xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">Sepetim ({items.length})</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-3 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-card border rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {item.image && <img src={item.image} alt={item.name} className="h-16 w-16 object-contain shrink-0" />}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">{item.name}</h3>
                  {item.specs && <p className="text-[11px] text-muted-foreground mt-1 font-mono line-clamp-2">{item.specs}</p>}
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-1.5">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-7 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="font-bold text-foreground text-sm whitespace-nowrap">₺{(item.price * item.quantity).toLocaleString("tr-TR")}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground">Sepeti Temizle</Button>
              <div className="text-right">
                <span className="text-sm text-muted-foreground">Toplam: </span>
                <span className="text-2xl font-bold text-foreground">₺{total.toLocaleString("tr-TR")}</span>
              </div>
            </div>
          </div>

          {/* Quote / Checkout panel */}
          <div className="lg:col-span-2">
            {!showQuoteForm ? (
              <div className="bg-card border rounded-lg p-6 space-y-4 sticky top-20">
                <h2 className="font-bold text-foreground text-lg">Sipariş Özeti</h2>
                <div className="space-y-2 text-sm">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-muted-foreground">
                      <span className="truncate mr-2">{item.name} x{item.quantity}</span>
                      <span className="shrink-0 font-mono">₺{(item.price * item.quantity).toLocaleString("tr-TR")}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-medium text-foreground">Toplam</span>
                  <span className="text-xl font-bold text-foreground">₺{total.toLocaleString("tr-TR")}</span>
                </div>
                <Button variant="hero" size="lg" className="w-full" onClick={() => setShowQuoteForm(true)}>
                  <Send className="h-4 w-4" /> Teklif İste
                </Button>
                <p className="text-[11px] text-muted-foreground text-center">Formu doldurduktan sonra ekibimiz sizinle iletişime geçecektir.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card border rounded-lg p-6 space-y-4 sticky top-20">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-foreground text-lg">Teklif Formu</h2>
                  <button type="button" onClick={() => setShowQuoteForm(false)} className="text-xs text-muted-foreground hover:text-foreground">
                    Geri
                  </button>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Ad Soyad *</label>
                  <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Adınız Soyadınız" />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Şirket</label>
                  <Input value={form.company} onChange={(e) => updateField("company", e.target.value)} placeholder="Şirket Adı (opsiyonel)" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">E-posta *</label>
                  <Input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="ornek@firma.com" />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Telefon *</label>
                  <Input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+90 5XX XXX XXXX" />
                  {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Not</label>
                  <Textarea value={form.note} onChange={(e) => updateField("note", e.target.value)} placeholder="Ek bilgi veya özel istekleriniz..." rows={3} />
                </div>

                <div className="border-t pt-3 flex justify-between mb-2">
                  <span className="font-medium text-foreground text-sm">Toplam</span>
                  <span className="text-lg font-bold text-foreground">₺{total.toLocaleString("tr-TR")}</span>
                </div>

                <Button variant="hero" size="lg" className="w-full" type="submit">
                  <Send className="h-4 w-4" /> Teklif Talebini Gönder
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
