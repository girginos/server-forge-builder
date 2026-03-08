import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <SEO title="Sayfa Bulunamadı - 404" description="Aradığınız sayfa bulunamadı." noIndex />
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">Aradığınız sayfa bulunamadı</p>
        <Button variant="hero" asChild>
          <Link to="/">Ana Sayfaya Dön</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
