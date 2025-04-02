import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import CategoryFilter from "@/components/products/CategoryFilter";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight } from "lucide-react";
import { ProductCardProps } from "@/components/products/ProductCard";
import productService from "@/services/product-service";
import { useToast } from "@/hooks/use-toast";

const OpenBoxPage = () => {
  const [openBoxProducts, setOpenBoxProducts] = useState<ProductCardProps[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["open-box"]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOpenBoxProducts = async () => {
      try {
        const products = await productService.getOpenBoxProducts();
        setOpenBoxProducts(products);
        
        // Extract unique categories
        const categorySet = new Set(products.map(product => product.category));
        setCategories(Array.from(categorySet));
      } catch (error) {
        console.error('Error fetching open box products:', error);
        toast({
          title: "Error",
          description: "Failed to load open box products. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpenBoxProducts();
  }, [toast]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleTypeChange = (type: string) => {
    // For this page, we always keep "open-box" selected
    if (type === "open-box") return;
    
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  // Filter products based on selected filters
  const filteredProducts = openBoxProducts.filter((product) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-eco-sky/10 py-12">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold flex items-center mb-4">
                <Package className="mr-3 h-8 w-8 text-eco-sky" />
                Open Box Products
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                High-quality returned items, thoroughly inspected and verified, available at 10-30% discounts. 
                Each product undergoes rigorous testing to ensure perfect functionality.
              </p>
              <Button asChild>
                <a href="#products">
                  Browse Open Box Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Information Cards */}
        <section className="py-12 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-6 bg-card">
                <h3 className="font-semibold text-lg mb-2">What are Open Box Products?</h3>
                <p className="text-muted-foreground">
                  These are items that were returned by customers in excellent condition.
                  Each item is thoroughly checked by our warehouse team before being
                  listed again at a discounted price.
                </p>
              </div>
              <div className="border rounded-lg p-6 bg-card">
                <h3 className="font-semibold text-lg mb-2">Our Verification Process</h3>
                <p className="text-muted-foreground">
                  Every Open Box product undergoes a detailed inspection by our
                  specialists. We test all functions, check for cosmetic issues,
                  and ensure all accessories are included.
                </p>
              </div>
              <div className="border rounded-lg p-6 bg-card">
                <h3 className="font-semibold text-lg mb-2">Warranty & Returns</h3>
                <p className="text-muted-foreground">
                  Open Box products come with a 30-day warranty against functional issues.
                  You also get our standard 7-day return period if you're not completely
                  satisfied.
                </p>
              </div>
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
                <h2 className="text-2xl font-semibold mb-6">Available Open Box Products</h2>
                <ProductGrid 
                  products={filteredProducts} 
                  emptyMessage={isLoading 
                    ? "Loading open box products..." 
                    : "No open box products match your filters. Try changing your selection."
                  }
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OpenBoxPage;
