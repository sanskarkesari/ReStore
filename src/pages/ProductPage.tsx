
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Heart, Check, Info, ArrowLeft, Package, Users } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import { ProductCardProps } from "@/components/products/ProductCard";

// Mock data for Phase 1
const mockProducts: Record<string, any> = {
  "1": {
    id: "1",
    title: "Apple iPhone 13 Pro - 128GB - Graphite",
    price: 79999,
    originalPrice: 99999,
    discountPercentage: 20,
    images: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=200",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=300",
    ],
    category: "Electronics",
    type: "new",
    brand: "Apple",
    rating: 4.8,
    inStock: true,
    description: "Experience the power of Apple's A15 Bionic chip and a pro camera system that takes stunning photos in any light. With a 6.1-inch Super Retina XDR display and Ceramic Shield, this iPhone is as durable as it is beautiful.",
    features: [
      "6.1-inch Super Retina XDR display",
      "A15 Bionic chip",
      "Pro camera system: 12MP wide, ultra wide, and telephoto",
      "Ceramic Shield front",
      "Face ID",
      "5G capable",
      "iOS 15",
    ],
    specifications: {
      "Storage": "128GB",
      "Color": "Graphite",
      "Screen Size": "6.1 inches",
      "Battery": "Up to 22 hours video playback",
      "Water Resistance": "IP68 (6 meters for up to 30 minutes)",
      "Dimensions": "146.7 x 71.5 x 7.65 mm",
      "Weight": "204 grams",
    },
  },
  "2": {
    id: "2",
    title: "Samsung 4K QLED Smart TV - 55 inch",
    price: 54999,
    originalPrice: 69999,
    discountPercentage: 21,
    images: [
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=200",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=300",
    ],
    category: "Electronics",
    type: "open-box",
    brand: "Samsung",
    rating: 4.5,
    inStock: true,
    isVerified: true,
    description: "This open box Samsung QLED TV delivers stunning 4K resolution with Quantum Dot technology for vibrant colors and deep blacks. Smart TV capabilities let you stream your favorite content with ease.",
    openBoxCondition: "Like New - Box opened but product is in perfect working condition with minimal signs of handling. All accessories included and original packaging.",
    features: [
      "4K UHD QLED display (3840 x 2160)",
      "Quantum Processor 4K",
      "HDR10+ and HLG support",
      "Smart TV with Tizen OS",
      "Voice assistant compatibility",
      "Multiple HDMI and USB ports",
    ],
    specifications: {
      "Screen Size": "55 inches",
      "Resolution": "4K UHD (3840 x 2160)",
      "Display Type": "QLED",
      "Refresh Rate": "120Hz",
      "Smart Platform": "Tizen",
      "HDR": "HDR10+",
      "Connectivity": "HDMI x4, USB x2, Wi-Fi, Bluetooth",
    },
    verificationDetails: {
      date: "2023-05-15",
      inspector: "Warehouse Team Lead",
      notes: "All functions tested and working perfectly. Remote and stand included. Minor scuff on back panel (not visible during use).",
    },
  },
  "3": {
    id: "3",
    title: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
    price: 22999,
    originalPrice: 29999,
    discountPercentage: 23,
    images: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?q=80&w=200",
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?q=80&w=300",
    ],
    category: "Electronics",
    type: "p2p",
    brand: "Sony",
    rating: 4.7,
    inStock: true,
    isVerified: true,
    description: "Industry-leading noise cancellation with premium sound quality. These wireless Bluetooth headphones deliver exceptional audio with long battery life and comfortable design for all-day wear.",
    p2pDetails: {
      seller: "Priya M.",
      sellerRating: 4.9,
      purchaseDate: "January 2023",
      usageTime: "6 months",
      reasonForSelling: "Upgraded to newer model",
    },
    features: [
      "Industry-leading noise cancellation",
      "30-hour battery life with quick charging",
      "Touch controls",
      "Speak-to-chat technology",
      "Wearing detection",
      "Multipoint connection",
    ],
    specifications: {
      "Type": "Over-ear wireless headphones",
      "Battery Life": "30 hours",
      "Noise Cancellation": "Active Noise Cancellation",
      "Connectivity": "Bluetooth 5.0, 3.5mm audio cable",
      "Weight": "254 grams",
      "Color": "Black",
    },
    verificationDetails: {
      date: "2023-06-10",
      inspector: "Admin Verifier",
      condition: "Excellent - Very minimal signs of use",
      notes: "All functions working perfectly. Ear cushions in great condition. Original packaging, cables, and carrying case included.",
    },
  },
  "4": {
    id: "4",
    title: "MacBook Air M2 - 8GB RAM - 256GB SSD",
    price: 89999,
    originalPrice: 109999,
    discountPercentage: 18,
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=200",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300",
    ],
    category: "Electronics",
    type: "open-box",
    brand: "Apple",
    rating: 4.9,
    inStock: true,
    isVerified: true,
    description: "The redesigned MacBook Air with the powerful M2 chip. Supercharged performance in a thin and light design with up to 18 hours of battery life.",
    openBoxCondition: "Excellent - Item is in like-new condition with very minor cosmetic imperfections. Fully tested and working perfectly.",
    features: [
      "Apple M2 chip with 8-core CPU and 8-core GPU",
      "8GB unified memory",
      "256GB SSD storage",
      "13.6-inch Liquid Retina display",
      "1080p FaceTime HD camera",
      "MagSafe charging port",
      "Two Thunderbolt ports",
    ],
    specifications: {
      "Processor": "Apple M2 chip",
      "Memory": "8GB unified memory",
      "Storage": "256GB SSD",
      "Display": "13.6-inch Liquid Retina",
      "Battery": "Up to 18 hours",
      "Weight": "1.24 kg",
      "Color": "Space Gray",
    },
    verificationDetails: {
      date: "2023-04-22",
      inspector: "Senior Tech Specialist",
      notes: "Full diagnostic test passed. Battery cycle count: 12. Very minor scratch on bottom (not visible during use). Original charger included.",
    },
  },
};

// Sample related products
const relatedProducts: ProductCardProps[] = [
  {
    id: "5",
    title: "Apple AirPods Pro",
    price: 22990,
    originalPrice: 26900,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    category: "Electronics",
    type: "new",
    rating: 4.8,
    inStock: true,
  },
  {
    id: "6",
    title: "Samsung Galaxy S22 Ultra",
    price: 79999,
    originalPrice: 109999,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    category: "Electronics",
    type: "open-box",
    rating: 4.7,
    inStock: true,
    isVerified: true,
  },
  {
    id: "7",
    title: "Apple Watch Series 7",
    price: 32999,
    originalPrice: 41900,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    category: "Electronics",
    type: "p2p",
    rating: 4.6,
    inStock: true,
    isVerified: true,
  },
  {
    id: "8",
    title: "Sony PlayStation 5",
    price: 44990,
    originalPrice: 49990,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    category: "Electronics",
    type: "open-box",
    rating: 4.9,
    inStock: false,
    isVerified: true,
  },
];

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const product = mockProducts[id || "1"];

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The product you are looking for does not exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Determine product type badge
  const TypeBadge = () => {
    if (product.type === "open-box") {
      return (
        <Badge className="bg-eco-sky hover:bg-eco-ocean">
          <Package className="mr-1 h-3 w-3" />
          Open Box
        </Badge>
      );
    } else if (product.type === "p2p") {
      return (
        <Badge className="bg-eco-light-green hover:bg-eco-leaf">
          <Users className="mr-1 h-3 w-3" />
          P2P
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="p-0">
            <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border border-border bg-muted">
              <img
                src={product.images[0]}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((image: string, i: number) => (
                <div
                  key={i}
                  className="aspect-square cursor-pointer overflow-hidden rounded-md border border-border bg-muted"
                >
                  <img
                    src={image}
                    alt={`${product.title} - view ${i + 2}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <TypeBadge />
                {product.isVerified && product.type !== "new" && (
                  <Badge variant="outline" className="border-eco-green text-eco-green">
                    <Check className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                )}
                <Badge variant="outline">{product.category}</Badge>
                <Badge variant="outline">{product.brand}</Badge>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>
              
              <div className="flex items-end gap-2 mt-2">
                <span className="text-2xl font-bold">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-eco-green font-medium">
                      {product.discountPercentage}% off
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Verification Details for Open Box or P2P */}
            {product.type !== "new" && product.isVerified && (
              <Card className="bg-muted/50 border-eco-green/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Info className="h-4 w-4 mr-1 text-eco-green" />
                    {product.type === "open-box"
                      ? "Open Box Condition"
                      : "P2P Seller Information"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  {product.type === "open-box" && (
                    <div className="space-y-2">
                      <p className="text-sm">{product.openBoxCondition}</p>
                      <div className="text-xs text-muted-foreground">
                        <div>Verified on: {product.verificationDetails.date}</div>
                        <div>Inspector: {product.verificationDetails.inspector}</div>
                        <div>Notes: {product.verificationDetails.notes}</div>
                      </div>
                    </div>
                  )}

                  {product.type === "p2p" && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Seller: {product.p2pDetails.seller}</div>
                        <Badge variant="outline" className="text-eco-green border-eco-green">
                          {product.p2pDetails.sellerRating} ★
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Usage: {product.p2pDetails.usageTime}</div>
                        <div>Purchased: {product.p2pDetails.purchaseDate}</div>
                      </div>
                      <div className="text-xs text-muted-foreground pt-1">
                        <div>Condition: {product.verificationDetails.condition}</div>
                        <div>Verified on: {product.verificationDetails.date}</div>
                        <div>Notes: {product.verificationDetails.notes}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="pt-2 pb-4">
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <Button className="flex-1" size="lg">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon" className="h-11 w-11">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Add to Wishlist</span>
                </Button>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Check className="mr-1 h-4 w-4 text-eco-green" />
                  In Stock
                </div>
                <div className="flex items-center">
                  <Check className="mr-1 h-4 w-4 text-eco-green" />
                  Free Shipping
                </div>
                <div className="flex items-center">
                  <Check className="mr-1 h-4 w-4 text-eco-green" />
                  Easy Returns
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="features">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            <TabsContent value="features" className="pt-4">
              <div className="space-y-4">
                <p>{product.description}</p>
                <ul className="list-disc pl-5 space-y-1">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="text-muted-foreground">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="pt-4">
              <div className="border rounded-md divide-y">
                {Object.entries(product.specifications).map(
                  ([key, value]: [string, any], index: number) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 px-4 py-3 odd:bg-muted/30"
                    >
                      <div className="font-medium">{key}</div>
                      <div className="text-muted-foreground">{value}</div>
                    </div>
                  )
                )}
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="space-y-4 pt-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Shipping Information</h3>
                <p className="text-muted-foreground">
                  Free shipping is available for all orders within India. Standard
                  delivery typically takes 3-5 business days, depending on your
                  location.
                </p>
                <p className="text-muted-foreground">
                  For Open Box items, shipping is handled directly from our
                  warehouse. For P2P items, the seller will arrange shipping
                  through our approved shipping partners.
                </p>

                <h3 className="font-semibold pt-2">Return Policy</h3>
                <p className="text-muted-foreground">
                  All products can be returned within 7 days of delivery if they
                  don't meet your expectations or arrive damaged. Open Box items
                  carry a 30-day warranty against functional defects. P2P items
                  have return policies set by the seller, but our platform
                  guarantee ensures you're protected against misrepresented items.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <section className="mb-12">
          <ProductGrid
            title="Related Products"
            products={relatedProducts}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
