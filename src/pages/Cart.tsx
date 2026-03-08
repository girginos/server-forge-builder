import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Trash2, Plus, Minus, ShoppingCart, Send, CheckCircle2,
  ArrowRight, ArrowLeft, MapPin, User, FileText, Building2,
} from "lucide-react";
import SEO from "@/components/SEO";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import PhoneInput from "@/components/PhoneInput";
import { cn } from "@/lib/utils";

/* ── Validation schemas ── */
const contactSchema = z.object({
  name: z.string().trim().min(1, "Ad Soyad zorunludur").max(100),
  company: z.string().trim().max(100).optional(),
  email: z.string().trim().email("Geçerli bir e-posta girin").max(255),
  phone: z.string().trim().min(1, "Telefon zorunludur").max(20),
});

const billingSchema = z.object({
  billingType: z.enum(["individual", "corporate"]),
  address: z.string().trim().max(500).optional(),
  city: z.string().trim().max(100).optional(),
  taxOffice: z.string().trim().max(100).optional(),
  taxNumber: z.string().trim().max(30).optional(),
  note: z.string().trim().max(1000).optional(),
});

type ContactForm = z.infer<typeof contactSchema>;
type BillingForm = z.infer<typeof billingSchema>;

const STEPS = [
  { label: "Sepet Özeti", icon: ShoppingCart },
  { label: "İletişim", icon: User },
  { label: "Fatura / Adres", icon: MapPin },
  { label: "Onay", icon: FileText },
];

/* ── Stepper ── */
function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center gap-1 sm:gap-2">
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all",
              active && "bg-primary text-primary-foreground shadow-md",
              done && "bg-primary/20 text-primary",
              !active && !done && "bg-muted text-muted-foreground",
            )}>
              <s.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("w-6 sm:w-10 h-0.5 rounded-full", i < current ? "bg-primary" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Main Component ── */
export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [contact, setContact] = useState<ContactForm>({ name: "", company: "", email: "", phone: "" });
  const [billing, setBilling] = useState<BillingForm>({ billingType: "individual", address: "", city: "", taxOffice: "", taxNumber: "", note: "" });
  const [contactErrors, setContactErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [billingErrors, setBillingErrors] = useState<Partial<Record<keyof BillingForm, string>>>({});

  // Auto-fill from profile
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setContact((prev) => ({
          name: prev.name || data.full_name || "",
          company: prev.company || data.company || "",
          email: prev.email || user.email || "",
          phone: prev.phone || data.phone || "",
        }));
        setBilling((prev) => ({
          ...prev,
          address: prev.address || data.address || "",
          city: prev.city || data.city || "",
          taxOffice: prev.taxOffice || data.tax_office || "",
          taxNumber: prev.taxNumber || data.tax_number || "",
        }));
      }
    })();
  }, [user]);

  const validateContact = () => {
    const result = contactSchema.safeParse(contact);
    if (!result.success) {
      const errs: any = {};
      result.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setContactErrors(errs);
      return false;
    }
    setContactErrors({});
    return true;
  };

  const validateBilling = () => {
    const result = billingSchema.safeParse(billing);
    if (!result.success) {
      const errs: any = {};
      result.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setBillingErrors(errs);
      return false;
    }
    if (billing.billingType === "corporate" && (!billing.taxOffice?.trim() || !billing.taxNumber?.trim())) {
      setBillingErrors({
        taxOffice: !billing.taxOffice?.trim() ? "Vergi dairesi zorunludur" : undefined,
        taxNumber: !billing.taxNumber?.trim() ? "Vergi numarası zorunludur" : undefined,
      });
      return false;
    }
    setBillingErrors({});
    return true;
  };

  const next = () => {
    if (step === 1 && !validateContact()) return;
    if (step === 2 && !validateBilling()) return;
    setStep((s) => Math.min(s + 1, 3));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        user_id: user?.id || null,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image, specs: i.specs })),
        total_amount: total,
        name: contact.name,
        company: contact.company || null,
        email: contact.email,
        phone: contact.phone,
        address: billing.address || null,
        city: billing.city || null,
        tax_office: billing.taxOffice || null,
        tax_number: billing.taxNumber || null,
        billing_type: billing.billingType,
        note: billing.note || null,
      };

      const { error } = await supabase.from("quote_requests" as any).insert(payload as any);
      if (error) throw error;

      setSubmitted(true);
      clearCart();
      toast.success("Teklif talebiniz başarıyla gönderildi!");
    } catch (err: any) {
      toast.error("Bir hata oluştu: " + (err.message || "Bilinmeyen hata"));
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Empty cart ── */
  if (items.length === 0 && !submitted) {
    return (
      <div className="py-20 text-center">
        <SEO title="Sepetim" description="Sepetinizi inceleyin ve teklif talebinizi gönderin." canonical="/sepet" noIndex />
        <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground">Sepetiniz Boş</h1>
        <p className="text-muted-foreground mt-2">Henüz ürün eklemediniz.</p>
        <Button variant="hero" className="mt-6" asChild>
          <Link to="/hardware">Ürünleri İncele</Link>
        </Button>
      </div>
    );
  }

  /* ── Success ── */
  if (submitted) {
    return (
      <div className="py-20 text-center">
        <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground">Teklif Talebiniz Alındı</h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          En kısa sürede ekibimiz sizinle iletişime geçecektir.
        </p>
        <Button variant="hero" className="mt-6" asChild>
          <Link to="/">Ana Sayfaya Dön</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-10">
      <SEO title="Sepetim" description="Sepetinizi inceleyin ve teklif talebinizi gönderin." canonical="/sepet" noIndex />
      <div className="container max-w-4xl">
        <Stepper current={step} />

        {/* Step 0 — Cart Review */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Sepet Özeti</h2>
              <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{items.length} ürün</span>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="group relative bg-card border rounded-xl overflow-hidden transition-shadow hover:shadow-md">
                  <div className="p-5">
                    <div className="flex gap-5">
                      {/* Product image */}
                      {item.image && (
                        <div className="shrink-0 flex items-center justify-center w-24 h-20 rounded-lg bg-muted/40 p-2">
                          <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                        </div>
                      )}

                      {/* Product info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-bold text-foreground">{item.name}</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {/* Specs as tags */}
                        {item.specs && (
                          <div className="flex flex-wrap gap-2.5">
                            {item.specs.split("|").map((spec, i) => (
                              <span key={i} className="inline-flex items-center text-sm font-medium text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-lg">
                                {spec.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom bar: quantity + price */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
                      <div className="flex items-center gap-0 border rounded-lg overflow-hidden bg-background">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-none border-0 border-r text-foreground hover:text-foreground hover:bg-muted active:bg-muted/80 focus-visible:ring-1 focus-visible:ring-ring"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3.5 w-3.5 text-foreground" />
                        </Button>
                        <span className="w-10 text-center text-sm font-semibold text-foreground bg-background">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-none border-0 border-l text-foreground hover:text-foreground hover:bg-muted active:bg-muted/80 focus-visible:ring-1 focus-visible:ring-ring"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3.5 w-3.5 text-foreground" />
                        </Button>
                      </div>
                      <div className="text-right">
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-muted-foreground">Birim: ₺{item.price.toLocaleString("tr-TR")}</p>
                        )}
                        <span className="text-lg font-bold text-foreground">₺{(item.price * item.quantity).toLocaleString("tr-TR")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary bar */}
            <div className="bg-muted/30 border rounded-xl p-4 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground hover:text-destructive text-xs">
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Sepeti Temizle
              </Button>
              <div className="text-right">
                <span className="text-xs text-muted-foreground block">Toplam Tutar</span>
                <span className="text-2xl font-bold text-foreground">₺{total.toLocaleString("tr-TR")}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Contact */}
        {step === 1 && (
          <div className="max-w-lg mx-auto space-y-4">
            <h2 className="text-xl font-bold text-foreground">İletişim Bilgileri</h2>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Ad Soyad *</label>
              <Input value={contact.name} onChange={(e) => { setContact({ ...contact, name: e.target.value }); setContactErrors((p) => ({ ...p, name: undefined })); }} />
              {contactErrors.name && <p className="text-xs text-destructive mt-1">{contactErrors.name}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Şirket</label>
              <Input value={contact.company} onChange={(e) => setContact({ ...contact, company: e.target.value })} placeholder="Opsiyonel" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">E-posta *</label>
              <Input type="email" value={contact.email} onChange={(e) => { setContact({ ...contact, email: e.target.value }); setContactErrors((p) => ({ ...p, email: undefined })); }} />
              {contactErrors.email && <p className="text-xs text-destructive mt-1">{contactErrors.email}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Telefon *</label>
              <PhoneInput
                value={contact.phone}
                onChange={(v) => { setContact({ ...contact, phone: v }); setContactErrors((p) => ({ ...p, phone: undefined })); }}
                error={contactErrors.phone}
              />
            </div>
          </div>
        )}

        {/* Step 2 — Billing / Address */}
        {step === 2 && (
          <div className="max-w-lg mx-auto space-y-4">
            <h2 className="text-xl font-bold text-foreground">Fatura & Adres Bilgileri</h2>

            {/* Billing type toggle */}
            <div className="flex gap-2">
              {(["individual", "corporate"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setBilling({ ...billing, billingType: t })}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all",
                    billing.billingType === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {t === "individual" ? <User className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                  {t === "individual" ? "Bireysel" : "Kurumsal"}
                </button>
              ))}
            </div>

            {billing.billingType === "corporate" && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Vergi Dairesi *</label>
                  <Input value={billing.taxOffice} onChange={(e) => { setBilling({ ...billing, taxOffice: e.target.value }); setBillingErrors((p) => ({ ...p, taxOffice: undefined })); }} />
                  {billingErrors.taxOffice && <p className="text-xs text-destructive mt-1">{billingErrors.taxOffice}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Vergi Numarası *</label>
                  <Input value={billing.taxNumber} onChange={(e) => { setBilling({ ...billing, taxNumber: e.target.value }); setBillingErrors((p) => ({ ...p, taxNumber: undefined })); }} />
                  {billingErrors.taxNumber && <p className="text-xs text-destructive mt-1">{billingErrors.taxNumber}</p>}
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Adres</label>
              <Textarea value={billing.address} onChange={(e) => setBilling({ ...billing, address: e.target.value })} rows={2} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Şehir</label>
              <Input value={billing.city} onChange={(e) => setBilling({ ...billing, city: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Not</label>
              <Textarea value={billing.note} onChange={(e) => setBilling({ ...billing, note: e.target.value })} rows={2} placeholder="Ek bilgi veya özel istekleriniz..." />
            </div>
          </div>
        )}

        {/* Step 3 — Confirm */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-foreground">Sipariş Onayı</h2>

            {/* Items summary */}
            <div className="bg-card border rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-foreground text-sm mb-2">Ürünler</h3>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate mr-2">{item.name} x{item.quantity}</span>
                  <span className="font-mono shrink-0 text-foreground">₺{(item.price * item.quantity).toLocaleString("tr-TR")}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between">
                <span className="font-medium text-foreground">Toplam</span>
                <span className="text-lg font-bold text-foreground">₺{total.toLocaleString("tr-TR")}</span>
              </div>
            </div>

            {/* Contact summary */}
            <div className="bg-card border rounded-lg p-4 grid sm:grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Ad Soyad:</span> <span className="text-foreground font-medium">{contact.name}</span></div>
              {contact.company && <div><span className="text-muted-foreground">Şirket:</span> <span className="text-foreground font-medium">{contact.company}</span></div>}
              <div><span className="text-muted-foreground">E-posta:</span> <span className="text-foreground font-medium">{contact.email}</span></div>
              <div><span className="text-muted-foreground">Telefon:</span> <span className="text-foreground font-medium">{contact.phone}</span></div>
            </div>

            {/* Billing summary */}
            <div className="bg-card border rounded-lg p-4 grid sm:grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Fatura Tipi:</span> <span className="text-foreground font-medium">{billing.billingType === "individual" ? "Bireysel" : "Kurumsal"}</span></div>
              {billing.city && <div><span className="text-muted-foreground">Şehir:</span> <span className="text-foreground font-medium">{billing.city}</span></div>}
              {billing.address && <div className="sm:col-span-2"><span className="text-muted-foreground">Adres:</span> <span className="text-foreground font-medium">{billing.address}</span></div>}
              {billing.billingType === "corporate" && billing.taxOffice && (
                <div><span className="text-muted-foreground">Vergi Dairesi:</span> <span className="text-foreground font-medium">{billing.taxOffice}</span></div>
              )}
              {billing.billingType === "corporate" && billing.taxNumber && (
                <div><span className="text-muted-foreground">Vergi No:</span> <span className="text-foreground font-medium">{billing.taxNumber}</span></div>
              )}
              {billing.note && <div className="sm:col-span-2"><span className="text-muted-foreground">Not:</span> <span className="text-foreground font-medium">{billing.note}</span></div>}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t">
          <Button variant="outline" onClick={prev} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Geri
          </Button>

          {step < 3 ? (
            <Button variant="hero" onClick={next}>
              İleri <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button variant="hero" onClick={handleSubmit} disabled={submitting}>
              <Send className="h-4 w-4 mr-1" /> {submitting ? "Gönderiliyor..." : "Teklif Talebini Gönder"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
