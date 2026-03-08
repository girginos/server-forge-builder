import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PartnersBanner from "@/components/PartnersBanner";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Hardware from "./pages/Hardware";
import Configurator from "./pages/Configurator";
import Colocation from "./pages/Colocation";
import CloudPage from "./pages/CloudPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ReadyPackages from "./pages/ReadyPackages";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/donanim" element={<Hardware />} />
                  <Route path="/hazir-paketler" element={<ReadyPackages />} />
                  <Route path="/yapilandirici" element={<Configurator />} />
                  <Route path="/yapilandirici/:serverId" element={<Configurator />} />
                  <Route path="/colocation" element={<Colocation />} />
                  <Route path="/cloud" element={<CloudPage />} />
                  <Route path="/hakkimizda" element={<About />} />
                  <Route path="/iletisim" element={<Contact />} />
                  <Route path="/sepet" element={<Cart />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <PartnersBanner />
              <Footer />
            </div>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
