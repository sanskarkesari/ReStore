
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Trash2, PlusCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

// Mock wishlist data for Phase 1
const initialWishlistItems = [
  {
    id: "3",
    title: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
    price: 22999,
    originalPrice: 29999,
    image: "https://images.unsplash.com/photo-1546435770-a3e429dcb388?q=80&w=2066&auto=format&fit=crop",
    type: "p2p",
    inStock: true,
  },
  {
    id: "5",
    title: "Apple AirPods Pro",
    price: 22990,
    originalPrice: 26900,
    image: "https://images.unsplash.com/photo-1606741965429-02a7f336e6f8?q=80&w=2070&auto=format&fit=crop",
    type: "new",
    inStock: true,
  },
  {
    id: "8",
    title: "Sony PlayStation 5",
    price: 44990,
    originalPrice: 49990,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=2070&auto=format&fit=crop",
    type: "open-box",
    inStock: false,
  },
];

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);

  const removeItem = (id: string) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your wishlist.",
    });
  };

  const addToCart = (item: any) => {
    // In a real app, this would add the item to the cart
    toast({
      title: "Added to cart",
      description: `${item.title} has been added to your cart.`,
    });
  };

  // Define animation variants for container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="container">
          <div className="flex items-center gap-2 mb-8">
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Your Wishlist</h1>
          </div>

          {wishlistItems.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {wishlistItems.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <Card className="h-full">
                    <CardContent className="p-0">
                      <div className="relative">
                        <Link to={`/product/${item.id}`}>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                          />
                          {item.type === "open-box" && (
                            <span className="absolute top-2 left-2 text-xs bg-eco-sky text-white px-2 py-0.5 rounded-full">
                              Open Box
                            </span>
                          )}
                          {item.type === "p2p" && (
                            <span className="absolute top-2 left-2 text-xs bg-eco-light-green text-white px-2 py-0.5 rounded-full">
                              P2P
                            </span>
                          )}
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-background/60 backdrop-blur-sm hover:bg-background/80"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <Link
                          to={`/product/${item.id}`}
                          className="font-medium hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.title}
                        </Link>
                        <div className="flex items-baseline mt-2">
                          <span className="text-lg font-semibold">
                            ₹{item.price.toLocaleString()}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through ml-2">
                              ₹{item.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {item.inStock ? (
                          <Button
                            className="w-full mt-4"
                            onClick={() => addToCart(item)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        ) : (
                          <Button
                            className="w-full mt-4"
                            variant="outline"
                            disabled
                          >
                            Out of Stock
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You don't have any items in your wishlist yet. Browse our products and 
                save your favorites for later.
              </p>
              <Button asChild>
                <Link to="/">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Discover Products
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WishlistPage;
