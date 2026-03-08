import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/hooks/useAuth";
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
import Leasing from "./pages/Leasing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSupport from "./pages/admin/AdminSupport";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
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
                    <Route path="/hardware" element={<Hardware />} />
                    <Route path="/hazir-paketler" element={<ReadyPackages />} />
                    <Route path="/yapilandirici" element={<Configurator />} />
                    <Route path="/yapilandirici/:serverId" element={<Configurator />} />
                    <Route path="/colocation" element={<Colocation />} />
                    <Route path="/cloud" element={<CloudPage />} />
                    <Route path="/hakkimizda" element={<About />} />
                    <Route path="/iletisim" element={<Contact />} />
                    <Route path="/sepet" element={<Cart />} />
                    <Route path="/leasing" element={<Leasing />} />
                    <Route path="/giris" element={<Auth />} />
                    <Route path="/panel" element={<Dashboard />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <PartnersBanner />
                <Footer />
              </div>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
