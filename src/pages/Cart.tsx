import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  if (items.length === 0) {
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

  return (
    <div className="py-12">
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">Sepetim ({items.length})</h1>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-card border rounded-lg p-4 flex items-center gap-4">
              {item.image && <img src={item.image} alt={item.name} className="h-20 w-20 object-contain shrink-0" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                {item.specs && <p className="text-xs text-muted-foreground mt-1 font-mono truncate">{item.specs}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <span className="font-bold text-foreground w-32 text-right">₺{(item.price * item.quantity).toLocaleString("tr-TR")}</span>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeItem(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-card border rounded-lg p-6 flex items-center justify-between">
          <div>
            <Button variant="ghost" size="sm" onClick={clearCart}>Sepeti Temizle</Button>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Toplam</p>
            <p className="text-3xl font-bold text-foreground">₺{total.toLocaleString("tr-TR")}</p>
            <Button variant="hero" size="lg" className="mt-3">Siparişi Tamamla</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
