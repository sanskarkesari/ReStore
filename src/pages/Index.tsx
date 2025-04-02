import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Package, Users, ArrowRight, Leaf, ShoppingBag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import { ProductCardProps } from "@/components/products/ProductCard";
import { useToast } from "@/hooks/use-toast";

// Hero carousel items
const heroItems = [
  {
    id: 1,
    title: "Shop Sustainable, Save More",
    description: "Discover verified Open Box and P2P products at unbeatable prices",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1887&auto=format&fit=crop",
    buttonText: "Shop Now",
    buttonLink: "/products",
    color: "bg-eco-green/10",
  },
  {
    id: 2,
    title: "Verified Open Box Products",
    description: "Quality-checked returns at 10-30% off original prices",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1974&auto=format&fit=crop",
    buttonText: "Explore Open Box",
    buttonLink: "/open-box",
    color: "bg-eco-sky/10",
  },
  {
    id: 3,
    title: "Peer-to-Peer Marketplace",
    description: "Buy and sell directly with verified users in our community",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1887&auto=format&fit=crop",
    buttonText: "P2P Marketplace",
    buttonLink: "/p2p",
    color: "bg-eco-light-green/10",
  },
];

// Hardcoded product data
const hardcodedProducts = [
  {
    id: "p1",
    title: "Smartphone XYZ Pro",
    price: 45999,
    originalPrice: 54999,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2070&auto=format&fit=crop",
    category: "Smartphones",
    type: "new",
    inStock: true,
    isVerified: true,
  },
  {
    id: "p2",
    title: "Laptop Pro 14-inch",
    price: 89999,
    originalPrice: 99999,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=2070&auto=format&fit=crop",
    category: "Laptops",
    type: "open-box",
    inStock: true,
    isVerified: true,
  },
  {
    id: "p3",
    title: "Wireless Earbuds",
    price: 8999,
    originalPrice: 12999,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1932&auto=format&fit=crop",
    category: "Electronics",
    type: "p2p",
    inStock: true,
  },
  {
    id: "p4",
    title: "Smart Watch Ultra",
    price: 32999,
    originalPrice: 39999,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1972&auto=format&fit=crop",
    category: "Electronics",
    type: "new",
    inStock: true,
    isVerified: true,
  },
  {
    id: "p5",
    title: "Tablet Air 10.9-inch",
    price: 49999,
    originalPrice: 59999,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1974&auto=format&fit=crop",
    category: "Tablets",
    type: "open-box",
    inStock: true,
    isVerified: true,
  },
  {
    id: "p6",
    title: "Gaming Console XS",
    price: 34999,
    originalPrice: 39999,
    image: "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?q=80&w=2072&auto=format&fit=crop",
    category: "Electronics",
    type: "p2p",
    inStock: true,
  },
  {
    id: "p7",
    title: "Professional Camera",
    price: 74999,
    originalPrice: 89999,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1938&auto=format&fit=crop",
    category: "Cameras",
    type: "new",
    inStock: true,
    isVerified: true,
  },
  {
    id: "p8",
    title: "Smart Home Speaker",
    price: 8999,
    originalPrice: 12999,
    image: "https://images.unsplash.com/photo-1558089687-db9280020dcb?q=80&w=1931&auto=format&fit=crop",
    category: "Electronics",
    type: "open-box",
    inStock: true,
    isVerified: true,
  },
];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<ProductCardProps[]>([]);
  const [openBoxProducts, setOpenBoxProducts] = useState<ProductCardProps[]>([]);
  const [p2pProducts, setP2PProducts] = useState<ProductCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      try {
        // Use hardcoded data instead of fetching from database
        setFeaturedProducts(hardcodedProducts);
        setOpenBoxProducts(hardcodedProducts.filter(p => p.type === 'open-box'));
        setP2PProducts(hardcodedProducts.filter(p => p.type === 'p2p'));
      } catch (error) {
        console.error("Error setting products:", error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 500); // Simulate a small delay for loading state

    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-6 md:py-10">
          <div className="container">
            <Carousel className="w-full">
              <CarouselContent>
                {heroItems.map((item) => (
                  <CarouselItem key={item.id}>
                    <div className={`${item.color} rounded-lg overflow-hidden`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 md:p-10">
                        <div className="flex flex-col justify-center space-y-4">
                          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                            {item.title}
                          </h1>
                          <p className="text-lg text-muted-foreground md:pr-12">
                            {item.description}
                          </p>
                          <div className="pt-4">
                            <Button asChild size="lg">
                              <Link to={item.buttonLink}>
                                {item.buttonText}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                        <div className="order-first md:order-last">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-64 md:h-80 object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-muted">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              How ReStore Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-eco-green/10 rounded-full flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-eco-green" />
                </div>
                <h3 className="text-xl font-semibold">Sustainable Shopping</h3>
                <p className="text-muted-foreground">
                  Our eco-friendly approach helps reduce waste and gives products
                  a second life, while you save money.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-eco-sky/10 rounded-full flex items-center justify-center">
                  <Package className="h-8 w-8 text-eco-sky" />
                </div>
                <h3 className="text-xl font-semibold">Open Box Products</h3>
                <p className="text-muted-foreground">
                  Returned items are thoroughly checked, verified, and resold at
                  10-30% discounts with quality guarantees.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-eco-light-green/10 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-eco-light-green" />
                </div>
                <h3 className="text-xl font-semibold">P2P Marketplace</h3>
                <p className="text-muted-foreground">
                  Connect directly with verified sellers to buy and sell pre-owned
                  products with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <Button variant="outline" asChild>
                <Link to="/products">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <ProductGrid 
              products={featuredProducts} 
              emptyMessage="Loading products..." 
            />
          </div>
        </section>

        {/* Open Box Section */}
        <section className="py-12 bg-eco-sky/5">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center">
                  <Package className="mr-2 h-6 w-6 text-eco-sky" />
                  Open Box Products
                </h2>
                <p className="text-muted-foreground mt-1">
                  Quality-checked returns at discounted prices
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/open-box">
                  View All Open Box
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <ProductGrid 
              products={openBoxProducts} 
              emptyMessage={isLoading ? "Loading open box products..." : "Open Box products coming soon!"} 
            />
          </div>
        </section>

        {/* P2P Marketplace Section */}
        <section className="py-12 bg-eco-light-green/5">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center">
                  <Users className="mr-2 h-6 w-6 text-eco-light-green" />
                  P2P Marketplace
                </h2>
                <p className="text-muted-foreground mt-1">
                  Buy and sell directly with our verified community
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/p2p">
                  View P2P Marketplace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <ProductGrid 
              products={p2pProducts} 
              emptyMessage={isLoading ? "Loading P2P products..." : "P2P listings coming soon!"} 
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-eco-forest text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Start Selling on ReStore
              </h2>
              <p className="text-lg text-white/80">
                List your unused items and contribute to a more sustainable future.
                Get verified and reach thousands of potential buyers.
              </p>
              <Button size="lg" variant="secondary" asChild className="mt-4">
                <Link to="/sell">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Start Selling
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
