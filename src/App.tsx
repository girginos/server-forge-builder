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
import CTOSunucular from "./pages/hardware/CTOSunucular";
import DiskPage from "./pages/hardware/DiskPage";
import CPUPage from "./pages/hardware/CPUPage";
import RAMPage from "./pages/hardware/RAMPage";
import EthernetPage from "./pages/hardware/EthernetPage";
import SwitchRouterPage from "./pages/hardware/SwitchRouterPage";
import KabloPage from "./pages/hardware/KabloPage";
import AnakartPage from "./pages/hardware/AnakartPage";
import Configurator from "./pages/Configurator";
import ExpertConfigurator from "./pages/ExpertConfigurator";
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
import AdminProductEditor from "./pages/admin/AdminProductEditor";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminDbTools from "./pages/admin/AdminDbTools";
import AdminQuotes from "./pages/admin/AdminQuotes";

const queryClient = new QueryClient();

function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hardware" element={<Hardware />} />
          <Route path="/hardware/cto-sunucular" element={<CTOSunucular />} />
          <Route path="/hardware/disk" element={<DiskPage />} />
          <Route path="/hardware/cpu" element={<CPUPage />} />
          <Route path="/hardware/ram" element={<RAMPage />} />
          <Route path="/hardware/ethernet-kartlari" element={<EthernetPage />} />
          <Route path="/hardware/switch-router" element={<SwitchRouterPage />} />
          <Route path="/hardware/kablo" element={<KabloPage />} />
          <Route path="/hardware/anakart" element={<AnakartPage />} />
          <Route path="/hazir-paketler" element={<ReadyPackages />} />
          <Route path="/yapilandirici" element={<Configurator />} />
          <Route path="/yapilandirici/uzman" element={<ExpertConfigurator />} />
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
  );
}

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
              <Routes>
                {/* Admin panel — standalone layout, no site navbar/footer */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="urunler" element={<AdminProducts />} />
                  <Route path="urunler/yeni" element={<AdminProductEditor />} />
                  <Route path="urunler/:id" element={<AdminProductEditor />} />
                  <Route path="siparisler" element={<AdminOrders />} />
                  <Route path="teklifler" element={<AdminQuotes />} />
                  <Route path="kullanicilar" element={<AdminUsers />} />
                  <Route path="kullanicilar/:userId" element={<AdminUserDetail />} />
                  <Route path="destek" element={<AdminSupport />} />
                  <Route path="db" element={<AdminDbTools />} />
                </Route>
                {/* Main site layout */}
                <Route path="/*" element={<SiteLayout />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
