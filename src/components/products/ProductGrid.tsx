
import React from "react";
import ProductCard, { ProductCardProps } from "./ProductCard";

interface ProductGridProps {
  products: ProductCardProps[];
  title?: string;
  emptyMessage?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  emptyMessage = "No products found",
}) => {
  return (
    <div className="space-y-4">
      {title && <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>}
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center py-12 border rounded-md bg-muted/50">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
