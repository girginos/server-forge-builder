import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Settings, Shield, Cpu, Cloud, Server } from "lucide-react";
import slideDatacenter from "@/assets/slide-datacenter.jpg";
import slideServer from "@/assets/slide-server.jpg";
import slideCloud from "@/assets/slide-cloud.jpg";

interface Slide {
  id: number;
  image: string;
  badge: string;
  badgeIcon: React.ElementType;
  title: string;
  highlight: string;
  subtitle: string;
  description: string;
  primaryBtn: { label: string; href: string; icon: React.ElementType };
  secondaryBtn: { label: string; href: string };
}

const slides: Slide[] = [
  {
    id: 1,
    image: slideDatacenter,
    badge: "Kurumsal Çözümler",
    badgeIcon: Server,
    title: "Kurumsal Sunucu",
    highlight: "Çözümleri",
    subtitle: "Güç. Güvenilirlik. Performans.",
    description: "Enterprise sınıfı sunucu donanımları ile iş süreçlerinizi hızlandırın.",
    primaryBtn: { label: "Sunucu Yapılandır", href: "/yapilandirici", icon: Settings },
    secondaryBtn: { label: "Hazır Paketler", href: "/hazir-paketler" },
  },
  {
    id: 2,
    image: slideServer,
    badge: "Test Edilmiş Donanım",
    badgeIcon: Shield,
    title: "Dell, HP &",
    highlight: "Supermicro",
    subtitle: "72 Saat Stres Testi Uygulanmış",
    description: "Tüm sunucular kapsamlı stres testinden geçirilir. 1 yıl garanti ile güvenle satın alın.",
    primaryBtn: { label: "Donanımları İncele", href: "/hardware", icon: Cpu },
    secondaryBtn: { label: "Teklif Al", href: "/iletisim" },
  },
  {
    id: 3,
    image: slideCloud,
    badge: "Cloud & Colocation",
    badgeIcon: Cloud,
    title: "Cloud",
    highlight: "Hizmetleri",
    subtitle: "Esnek ve Ölçeklenebilir Altyapı",
    description: "Tier III+ veri merkezlerinde güvenli barındırma ve yönetilen cloud çözümleri.",
    primaryBtn: { label: "Cloud Çözümleri", href: "/cloud", icon: Cloud },
    secondaryBtn: { label: "Colocation", href: "/colocation" },
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const goTo = useCallback(
    (index: number, dir: "left" | "right") => {
      if (isAnimating) return;
      setIsAnimating(true);
      setDirection(dir);
      setCurrent(index);
      setTimeout(() => setIsAnimating(false), 700);
    },
    [isAnimating]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, "right");
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, "left");
  }, [current, goTo]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative h-[550px] lg:h-[620px] overflow-hidden">
      {/* Background images */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-all duration-700 ease-in-out"
          style={{
            opacity: i === current ? 1 : 0,
            transform: i === current
              ? "scale(1)"
              : "scale(1.08)",
          }}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,30%,6%)/0.92] via-[hsl(220,30%,8%)/0.75] to-[hsl(220,30%,10%)/0.5]" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full container flex items-center">
        <div className="max-w-2xl">
          {/* Badge */}
          <div
            key={`badge-${current}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/10 px-4 py-1.5 text-xs font-medium text-teal mb-5"
            style={{
              animation: "heroSlideUp 0.5s ease-out 0.1s both",
            }}
          >
            <slide.badgeIcon className="h-3.5 w-3.5" />
            {slide.badge}
          </div>

          {/* Title */}
          <h1
            key={`title-${current}`}
            className="text-4xl lg:text-5xl xl:text-6xl font-bold text-secondary-foreground leading-[1.1] mb-3"
            style={{
              animation: "heroSlideUp 0.6s ease-out 0.2s both",
            }}
          >
            {slide.title}{" "}
            <span className="text-gradient">{slide.highlight}</span>
          </h1>

          {/* Subtitle */}
          <p
            key={`sub-${current}`}
            className="text-xl lg:text-2xl font-medium text-secondary-foreground/60 mb-4"
            style={{
              animation: "heroSlideUp 0.6s ease-out 0.3s both",
            }}
          >
            {slide.subtitle}
          </p>

          {/* Description */}
          <p
            key={`desc-${current}`}
            className="text-base text-secondary-foreground/50 max-w-lg mb-7"
            style={{
              animation: "heroSlideUp 0.6s ease-out 0.35s both",
            }}
          >
            {slide.description}
          </p>

          {/* Buttons */}
          <div
            key={`btns-${current}`}
            className="flex flex-wrap gap-3"
            style={{
              animation: "heroSlideUp 0.6s ease-out 0.45s both",
            }}
          >
            <Button variant="hero" size="lg" asChild>
              <Link to={slide.primaryBtn.href}>
                <slide.primaryBtn.icon className="h-5 w-5" />
                {slide.primaryBtn.label}
              </Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to={slide.secondaryBtn.href}>{slide.secondaryBtn.label}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-secondary-foreground/10 backdrop-blur-sm border border-secondary-foreground/20 flex items-center justify-center text-secondary-foreground/70 hover:bg-secondary-foreground/20 hover:text-secondary-foreground transition-all z-10"
        aria-label="Önceki slayt"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-secondary-foreground/10 backdrop-blur-sm border border-secondary-foreground/20 flex items-center justify-center text-secondary-foreground/70 hover:bg-secondary-foreground/20 hover:text-secondary-foreground transition-all z-10"
        aria-label="Sonraki slayt"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots + Progress */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? "right" : "left")}
            className="relative h-2 rounded-full overflow-hidden transition-all duration-300"
            style={{ width: i === current ? "48px" : "12px" }}
            aria-label={`Slayt ${i + 1}`}
          >
            <div className="absolute inset-0 bg-secondary-foreground/30 rounded-full" />
            {i === current && (
              <div
                className="absolute inset-y-0 left-0 bg-teal rounded-full"
                style={{
                  animation: "sliderProgress 6s linear forwards",
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-6 text-secondary-foreground/40 text-sm font-mono z-10">
        <span className="text-teal font-bold">{String(current + 1).padStart(2, "0")}</span>
        <span className="mx-1">/</span>
        <span>{String(slides.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
