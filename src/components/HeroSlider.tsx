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

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent(index);
      setTimeout(() => setIsAnimating(false), 700);
    },
    [isAnimating]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative gradient-navy overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[520px] lg:min-h-[580px]">
          {/* Left — Text Content */}
          <div className="flex flex-col justify-center py-14 lg:py-20 lg:pr-12 relative z-10">
            {/* Badge */}
            <div
              key={`badge-${current}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/10 px-4 py-1.5 text-xs font-medium text-teal mb-5 w-fit"
              style={{ animation: "heroSlideUp 0.5s ease-out 0.1s both" }}
            >
              <slide.badgeIcon className="h-3.5 w-3.5" />
              {slide.badge}
            </div>

            {/* Title */}
            <h1
              key={`title-${current}`}
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-secondary-foreground leading-[1.1] mb-3"
              style={{ animation: "heroSlideUp 0.6s ease-out 0.2s both" }}
            >
              {slide.title}{" "}
              <span className="text-gradient">{slide.highlight}</span>
            </h1>

            {/* Subtitle */}
            <p
              key={`sub-${current}`}
              className="text-xl lg:text-2xl font-medium text-secondary-foreground/70 mb-4"
              style={{ animation: "heroSlideUp 0.6s ease-out 0.3s both" }}
            >
              {slide.subtitle}
            </p>

            {/* Description */}
            <p
              key={`desc-${current}`}
              className="text-base text-secondary-foreground/50 max-w-md mb-8"
              style={{ animation: "heroSlideUp 0.6s ease-out 0.35s both" }}
            >
              {slide.description}
            </p>

            {/* Buttons */}
            <div
              key={`btns-${current}`}
              className="flex flex-wrap gap-3"
              style={{ animation: "heroSlideUp 0.6s ease-out 0.45s both" }}
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

            {/* Dots + Counter */}
            <div className="flex items-center gap-4 mt-10">
              <div className="flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="relative h-2 rounded-full overflow-hidden transition-all duration-300"
                    style={{ width: i === current ? "48px" : "12px" }}
                    aria-label={`Slayt ${i + 1}`}
                  >
                    <div className="absolute inset-0 bg-secondary-foreground/30 rounded-full" />
                    {i === current && (
                      <div
                        className="absolute inset-y-0 left-0 bg-teal rounded-full"
                        style={{ animation: "sliderProgress 6s linear forwards" }}
                      />
                    )}
                  </button>
                ))}
              </div>
              <span className="text-secondary-foreground/40 text-sm font-mono">
                <span className="text-teal font-bold">{String(current + 1).padStart(2, "0")}</span>
                <span className="mx-1">/</span>
                <span>{String(slides.length).padStart(2, "0")}</span>
              </span>
            </div>
          </div>

          {/* Right — Animated Image */}
          <div className="relative hidden lg:flex items-center justify-center">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20"
                style={{
                  background: "radial-gradient(circle, hsl(192 85% 45% / 0.3) 0%, transparent 70%)",
                  animation: "heroGlow 4s ease-in-out infinite alternate",
                }}
              />
              <div
                className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full border border-teal/10"
                style={{ animation: "heroOrbit 12s linear infinite" }}
              />
              <div
                className="absolute bottom-1/4 left-1/4 w-32 h-32 rounded-full border border-primary/10"
                style={{ animation: "heroOrbit 8s linear infinite reverse" }}
              />
            </div>

            {/* Main image */}
            {slides.map((s, i) => (
              <div
                key={s.id}
                className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out"
                style={{
                  opacity: i === current ? 1 : 0,
                  transform: i === current
                    ? "scale(1) translateY(0)"
                    : "scale(0.9) translateY(20px)",
                }}
              >
                <div
                  className="relative w-full h-full flex items-center justify-center"
                  style={i === current ? { animation: "heroFloat 3s ease-in-out infinite" } : {}}
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-[90%] h-[75%] object-cover rounded-2xl shadow-2xl"
                    style={{
                      boxShadow: "0 25px 60px -12px hsl(192 85% 45% / 0.2), 0 0 0 1px hsl(192 85% 45% / 0.1)",
                    }}
                  />
                  {/* Floating accent card */}
                  <div
                    className="absolute -bottom-2 -left-2 bg-card/90 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 shadow-lg"
                    style={i === current ? { animation: "heroSlideUp 0.6s ease-out 0.5s both" } : { opacity: 0 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                        <s.badgeIcon className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{s.badge}</p>
                        <p className="text-[10px] text-muted-foreground">Enterprise Grade</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation arrows */}
            <div className="absolute bottom-6 right-6 flex gap-2 z-10">
              <button
                onClick={prev}
                className="h-10 w-10 rounded-full bg-secondary-foreground/10 backdrop-blur-sm border border-secondary-foreground/20 flex items-center justify-center text-secondary-foreground/70 hover:bg-secondary-foreground/20 hover:text-secondary-foreground transition-all"
                aria-label="Önceki slayt"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                className="h-10 w-10 rounded-full bg-secondary-foreground/10 backdrop-blur-sm border border-secondary-foreground/20 flex items-center justify-center text-secondary-foreground/70 hover:bg-secondary-foreground/20 hover:text-secondary-foreground transition-all"
                aria-label="Sonraki slayt"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
