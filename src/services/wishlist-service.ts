
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import productService, { ProductCardData } from "./product-service";

export interface WishlistItem {
  id: string;
  product_id: string;
  product?: ProductCardData;
}

const wishlistService = {
  async getWishlistItems(): Promise<WishlistItem[]> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return [];
    }

    const { data, error } = await supabase
      .from('wishlists')
      .select('id, product_id')
      .eq('user_id', user.user.id);

    if (error) {
      console.error('Error fetching wishlist items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch wishlist items",
        variant: "destructive",
      });
      return [];
    }

    // Fetch product details for each wishlist item
    const wishlistItems: WishlistItem[] = data as WishlistItem[];
    
    for (const item of wishlistItems) {
      const productData = await productService.getProductById(item.product_id);
      if (productData) {
        item.product = productService.mapProductToCardData(productData);
      }
    }

    return wishlistItems;
  },

  async addToWishlist(product_id: string): Promise<boolean> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your wishlist",
        variant: "destructive",
      });
      return false;
    }

    // Check if item already exists in wishlist
    const { data: existingItem } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.user.id)
      .eq('product_id', product_id)
      .maybeSingle();

    if (existingItem) {
      toast({
        title: "Already in wishlist",
        description: "This item is already in your wishlist",
      });
      return true;
    }

    // Add new item to wishlist
    const { error } = await supabase
      .from('wishlists')
      .insert([
        { 
          user_id: user.user.id, 
          product_id
        }
      ]);

    if (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Added to wishlist",
      description: "Item added to your wishlist",
    });
    return true;
  },

  async removeFromWishlist(wishlistItemId: string): Promise<boolean> {
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('id', wishlistItemId);

    if (error) {
      console.error('Error removing item from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Item removed",
      description: "Item removed from your wishlist",
    });
    return true;
  },

  async clearWishlist(): Promise<boolean> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return false;
    }

    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', user.user.id);

    if (error) {
      console.error('Error clearing wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to clear wishlist",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist",
    });
    return true;
  },
  
  async isInWishlist(product_id: string): Promise<boolean> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return false;
    }

    const { data, error } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.user.id)
      .eq('product_id', product_id)
      .maybeSingle();

    if (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }

    return !!data;
  }
};

export default wishlistService;
