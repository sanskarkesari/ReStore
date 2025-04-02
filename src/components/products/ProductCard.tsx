
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, CheckCircle, Package, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import cartService from "@/services/cart-service";
import wishlistService from "@/services/wishlist-service";
import { toast } from "@/hooks/use-toast";

export interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  type: string; // 'new', 'open-box', 'p2p'
  rating?: number;
  inStock: boolean;
  isVerified?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  originalPrice,
  image,
  category,
  type,
  rating,
  inStock = true,
  isVerified = false,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check if product is in wishlist when component mounts
    const checkWishlist = async () => {
      if (user) {
        const inWishlist = await wishlistService.isInWishlist(id);
        setIsWishlisted(inWishlist);
      }
    };
    
    checkWishlist();
  }, [id, user]);

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      await cartService.addToCart(id);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your wishlist",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToWishlist(true);
    try {
      if (isWishlisted) {
        // We don't have the wishlist item ID here, so we'll refetch wishlist items
        const wishlistItems = await wishlistService.getWishlistItems();
        const item = wishlistItems.find(item => item.product_id === id);
        if (item) {
          await wishlistService.removeFromWishlist(item.id);
          setIsWishlisted(false);
        }
      } else {
        await wishlistService.addToWishlist(id);
        setIsWishlisted(true);
      }
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-all">
      <div className="relative">
        <Link to={`/product/${id}`} className="block">
          <img
            src={image}
            alt={title}
            className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="bg-white/90">
            {category}
          </Badge>
        </div>

        {/* Type Badge */}
        <div className="absolute top-2 right-2">
          {type === "open-box" && (
            <Badge className="bg-eco-sky/90 hover:bg-eco-sky">
              <Package className="mr-1 h-3 w-3" />
              Open Box
            </Badge>
          )}
          {type === "p2p" && (
            <Badge className="bg-eco-light-green/90 hover:bg-eco-light-green">
              <Users className="mr-1 h-3 w-3" />
              P2P
            </Badge>
          )}
          {isVerified && type !== "new" && (
            <Badge className="ml-1 bg-green-500/90 hover:bg-green-500">
              <CheckCircle className="h-3 w-3" />
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={`absolute bottom-2 right-2 p-2 rounded-full bg-white shadow-sm transition-colors ${
            isWishlisted
              ? "text-red-500 hover:text-red-600"
              : "text-gray-400 hover:text-red-500"
          }`}
          onClick={handleToggleWishlist}
          disabled={isAddingToWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="p-4">
        <Link to={`/product/${id}`} className="block">
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[48px]">
            {title}
          </h3>
        </Link>

        <div className="mt-2 flex justify-between items-end">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-lg">
                ₹{price.toLocaleString()}
              </span>
              {originalPrice && (
                <span className="text-muted-foreground line-through text-sm">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {discountPercentage > 0 && (
              <span className="text-green-600 text-sm font-medium">
                {discountPercentage}% off
              </span>
            )}
          </div>

          <Button
            size="sm"
            variant="outline"
            className="flex-shrink-0"
            onClick={handleAddToCart}
            disabled={!inStock || isAddingToCart}
          >
            {isAddingToCart ? (
              "Adding..."
            ) : (
              <>
                <ShoppingCart className="mr-1 h-4 w-4" />
                {inStock ? "Add" : "Sold Out"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
