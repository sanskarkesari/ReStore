import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import CategoryFilter from "@/components/products/CategoryFilter";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, CheckCircle, ShieldCheck, ShoppingBag, MessageCircle } from "lucide-react";
import { ProductCardProps } from "@/components/products/ProductCard";
import { Card, CardContent } from "@/components/ui/card";
import ChatInterface from "@/components/chat/ChatInterface";

// Mock P2P products data with updated images
const p2pProducts: ProductCardProps[] = [
  {
    id: "3",
    title: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
    price: 22999,
    originalPrice: 29999,
    image: "https://www.sony.co.in/image/5d02da5df552836db894cead8a68f5f3?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF&auto=format&fit=crop",
    category: "Electronics",
    type: "p2p",
    rating: 4.7,
    inStock: true,
    isVerified: true,
  },
  {
    id: "7",
    title: "Apple Watch Series 7",
    price: 32999,
    originalPrice: 41900,
    image: "https://rukminim3.flixcart.com/image/720/864/ku8pbbk0/smartwatch/x/2/p/ios-mkjt3hn-a-apple-yes-original-imag7erwk4buzyew.jpeg?q=60&crop=true",
    category: "Electronics",
    type: "p2p",
    rating: 4.6,
    inStock: true,
    isVerified: true,
  },
  {
    id: "9",
    title: "MacBook Pro 14-inch M1 Pro",
    price: 159999,
    originalPrice: 189900,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2026&auto=format&fit=crop",
    category: "Electronics",
    type: "p2p",
    rating: 4.9,
    inStock: true,
    isVerified: true,
  },
  {
    id: "10",
    title: "Canon EOS R5 Mirrorless Camera",
    price: 299999,
    originalPrice: 359999,
    image: "https://images.unsplash.com/photo-1516724562728-afc824a36e84?q=80&w=1951&auto=format&fit=crop",
    category: "Electronics",
    type: "p2p",
    rating: 4.8,
    inStock: true,
    isVerified: true,
  },
];

// Mock sellers data
const sellers = [
  {
    id: "seller1",
    name: "Priya M.",
    avatar: "https://randomuser.me/api/portraits/women/42.jpg",
    lastActive: "Online now",
    productId: "3",
  },
  {
    id: "seller2",
    name: "Rahul S.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    lastActive: "Last seen 20 min ago",
    productId: "7",
  },
  {
    id: "seller3",
    name: "Ananya K.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    lastActive: "Last seen 1 hour ago",
    productId: "9",
  },
  {
    id: "seller4",
    name: "Vikram T.",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    lastActive: "Last seen 2 hours ago",
    productId: "10",
  },
];

const P2PPage = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["p2p"]);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentSeller, setCurrentSeller] = useState(sellers[0]);
  const [currentProduct, setCurrentProduct] = useState<ProductCardProps | null>(null);

  // Available categories from products
  const categories = Array.from(
    new Set(p2pProducts.map((product) => product.category))
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleTypeChange = (type: string) => {
    // For this page, we always keep "p2p" selected
    if (type === "p2p") return;
    
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  // Filter products based on selected filters
  const filteredProducts = p2pProducts.filter((product) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesCategory && matchesPrice;
  });

  const handleChatWithSeller = (productId: string) => {
    const product = p2pProducts.find(p => p.id === productId);
    const seller = sellers.find(s => s.productId === productId);
    
    if (seller && product) {
      setCurrentSeller(seller);
      setCurrentProduct(product);
      setChatOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-eco-light-green/10 py-12">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold flex items-center mb-4">
                <Users className="mr-3 h-8 w-8 text-eco-light-green" />
                P2P Marketplace
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Buy and sell directly with our verified community members. 
                All P2P listings undergo thorough verification by our admin team, 
                ensuring quality, authenticity, and accurate descriptions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <a href="#products">
                    Browse P2P Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/sell">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Start Selling
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 bg-background">
          <div className="container">
            <h2 className="text-2xl font-semibold text-center mb-8">How P2P Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-eco-light-green/10 rounded-full flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-eco-light-green" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Seller Submission</h3>
                    <p className="text-muted-foreground">
                      Sellers submit product details, photos, usage info, and verify their
                      identity with government ID for trust and security.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-eco-light-green/10 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-6 w-6 text-eco-light-green" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Admin Verification</h3>
                    <p className="text-muted-foreground">
                      Our admin team carefully reviews each listing, checking photos, 
                      condition information, and seller credentials.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-eco-light-green/10 rounded-full flex items-center justify-center mb-4">
                      <ShieldCheck className="h-6 w-6 text-eco-light-green" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Safe Transactions</h3>
                    <p className="text-muted-foreground">
                      Buyers purchase with confidence knowing each listing is verified.
                      Our platform handles payments securely with buyer protection.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12" id="products">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <CategoryFilter
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onCategoryChange={handleCategoryChange}
                  priceRange={priceRange}
                  maxPrice={150000}
                  onPriceChange={setPriceRange}
                  showProductTypes={false}
                  selectedTypes={selectedTypes}
                  onTypeChange={handleTypeChange}
                />
              </div>
              <div className="md:col-span-3">
                <h2 className="text-2xl font-semibold mb-6">P2P Marketplace Listings</h2>
                <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="flex gap-2 items-center text-sm text-muted-foreground mb-2">
                    <MessageCircle className="h-4 w-4 text-eco-light-green" />
                    <span>Chat directly with sellers for any questions about their products</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {sellers.map(seller => (
                      <Button 
                        key={seller.id} 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleChatWithSeller(seller.productId)}
                      >
                        <MessageCircle className="h-3 w-3" />
                        Chat with {seller.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {filteredProducts.map(product => (
                    <Card key={product.id} className="relative overflow-hidden group">
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Button 
                          size="sm" 
                          className="bg-primary/90 hover:bg-primary"
                          onClick={() => handleChatWithSeller(product.id)}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                      </div>
                      <CardContent className="p-0">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="p-4">
                          <div className="text-sm font-medium mb-1">{product.title}</div>
                          <div className="flex items-baseline">
                            <span className="text-lg font-semibold">₹{product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through ml-2">
                                ₹{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <div className="mt-3 flex justify-between items-center">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <CheckCircle className="h-3 w-3 text-eco-green mr-1" />
                              Verified Seller
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              asChild
                              className="text-xs"
                            >
                              <a href={`/product/${product.id}`}>View Details</a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {filteredProducts.length === 0 && (
                  <div className="mt-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      No P2P products match your filters. Try changing your selection or check back later.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Why not list your own items for sale?
                    </p>
                    <Button asChild>
                      <a href="/sell">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Start Selling
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      {/* Chat Interface */}
      {chatOpen && currentSeller && (
        <ChatInterface 
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          seller={currentSeller}
          productId={currentProduct?.id}
          productName={currentProduct?.title}
        />
      )}
    </div>
  );
};

export default P2PPage;
