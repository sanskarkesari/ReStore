
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import OpenBoxPage from "./pages/OpenBoxPage";
import P2PPage from "./pages/P2PPage";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import ProfilePage from "./pages/ProfilePage";
import OrdersPage from "./pages/OrdersPage";
import SellPage from "./pages/SellPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { AdminProvider } from "@/hooks/use-admin";

const queryClient = new QueryClient();

// AnimatedRoutes component to handle page transitions
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/open-box" element={<OpenBoxPage />} />
        <Route path="/p2p" element={<P2PPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="restore-theme">
        <BrowserRouter>
          <AuthProvider>
            <AdminProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <AnimatedRoutes />
              </TooltipProvider>
            </AdminProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
