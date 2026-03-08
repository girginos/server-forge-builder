import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ServerCardProps {
  id: string;
  name: string;
  image: string;
  formFactor: string;
  cpu: string;
  maxRam: string;
  price: number;
  oldPrice?: number;
  badge?: string;
}

export default function ServerCard({ id, name, image, formFactor, cpu, maxRam, price, oldPrice, badge }: ServerCardProps) {
  const { addItem } = useCart();

  return (
    <div className="group bg-card rounded-lg border shadow-card hover:shadow-glow transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="relative p-4 flex items-center justify-center h-52 bg-muted/30">
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-sale text-primary-foreground text-[10px]">{badge}</Badge>
          </div>
        )}
        <img src={image} alt={name} className="max-h-44 object-contain group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-foreground leading-tight min-h-[2.5rem]">{name}</h3>
        <div className="space-y-1 text-xs text-muted-foreground font-mono mt-2">
          <p>{formFactor}</p>
          <p>{cpu}</p>
          <p>{maxRam}</p>
        </div>
        <div className="flex items-baseline gap-2 mt-auto pt-3">
          <span className="text-lg font-bold text-foreground">₺{price.toLocaleString("tr-TR")}</span>
          {oldPrice && (
            <span className="text-sm text-muted-foreground line-through">₺{oldPrice.toLocaleString("tr-TR")}</span>
          )}
        </div>
        <div className="flex gap-2 mt-3">
          <Button variant="hero" size="sm" className="flex-1" asChild>
            <Link to={`/yapilandirici/${id}`}>
              <Settings className="h-4 w-4" /> Yapılandır
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addItem({ id, name, price, image })}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
