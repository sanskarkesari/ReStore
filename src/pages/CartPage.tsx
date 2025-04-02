
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

// Mock cart data for Phase 1
const initialCartItems = [
  {
    id: "1",
    title: "Apple iPhone 13 Pro - 128GB - Graphite",
    price: 79999,
    image: "https://ola.tech/wp-content/uploads/apple-iphone-13-pro-graphite.webp",
    quantity: 1,
    type: "new",
  },
  {
    id: "2",
    title: "Samsung 4K QLED Smart TV - 55 inch",
    price: 54999,
    image: "https://images.samsung.com/is/image/samsung/p6pim/in/qa55q70daulxl/gallery/in-qled-q70d-qa55q70daulxl-539990475?$684_547_PNG$",
    quantity: 1,
    type: "open-box",
  },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const updateQuantity = (id: string, change: number) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const applyCoupon = () => {
    setIsApplyingCoupon(true);
    // Simulate API call to validate coupon
    setTimeout(() => {
      setIsApplyingCoupon(false);
      // Placeholder for actual coupon validation
      alert(`Coupon "${couponCode}" applied!`);
    }, 1000);
  };

  // Calculate cart summary
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 99 : 0;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="container">
          <div className="flex items-center gap-2 mb-8">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Your Cart</h1>
          </div>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div 
                className="lg:col-span-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {cartItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    variants={itemVariants}
                    className="mb-4"
                  >
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <div className="w-full sm:w-32 h-32">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-medium mb-1 line-clamp-2">
                                  <Link
                                    to={`/product/${item.id}`}
                                    className="hover:text-primary transition-colors"
                                  >
                                    {item.title}
                                  </Link>
                                </h3>
                                {item.type === "open-box" && (
                                  <span className="text-xs bg-eco-sky text-white px-2 py-0.5 rounded-full mr-2">
                                    Open Box
                                  </span>
                                )}
                                {item.type === "p2p" && (
                                  <span className="text-xs bg-eco-light-green text-white px-2 py-0.5 rounded-full">
                                    P2P
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">
                                  ₹{item.price.toLocaleString()}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  ₹{(item.price * item.quantity).toLocaleString()} total
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center border rounded-md">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-none"
                                  onClick={() => updateQuantity(item.id, -1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-none"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* Coupon Code */}
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Apply Coupon Code</h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button 
                      onClick={applyCoupon} 
                      disabled={!couponCode || isApplyingCoupon}
                    >
                      {isApplyingCoupon ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>{shipping > 0 ? `₹${shipping}` : "Free"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax (18% GST)</span>
                        <span>₹{tax.toLocaleString()}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>₹{total.toLocaleString()}</span>
                      </div>
                    </div>

                    <Button className="w-full mt-6" size="lg">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Secure checkout powered by ReStore
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6 space-y-4">
                  <h4 className="font-medium">Accepted Payment Methods</h4>
                  <div className="flex flex-wrap gap-2">
                    <div className="bg-muted/50 px-3 py-1 rounded text-sm">Credit Card</div>
                    <div className="bg-muted/50 px-3 py-1 rounded text-sm">Debit Card</div>
                    <div className="bg-muted/50 px-3 py-1 rounded text-sm">UPI</div>
                    <div className="bg-muted/50 px-3 py-1 rounded text-sm">Net Banking</div>
                    <div className="bg-muted/50 px-3 py-1 rounded text-sm">EMI</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Looks like you haven't added any products to your cart yet.
                Browse our collection to find what you're looking for.
              </p>
              <Button asChild>
                <Link to="/">
                  Continue Shopping
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

export default CartPage;
