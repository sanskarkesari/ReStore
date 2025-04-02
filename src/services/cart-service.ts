
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import productService, { ProductCardData } from "./product-service";

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: ProductCardData;
}

const cartService = {
  async getCartItems(): Promise<CartItem[]> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return [];
    }

    const { data, error } = await supabase
      .from('carts')
      .select('id, product_id, quantity')
      .eq('user_id', user.user.id);

    if (error) {
      console.error('Error fetching cart items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cart items",
        variant: "destructive",
      });
      return [];
    }

    // Fetch product details for each cart item
    const cartItems: CartItem[] = data as CartItem[];
    
    for (const item of cartItems) {
      const productData = await productService.getProductById(item.product_id);
      if (productData) {
        item.product = productService.mapProductToCardData(productData);
      }
    }

    return cartItems;
  },

  async addToCart(product_id: string, quantity: number = 1): Promise<boolean> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      return false;
    }

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('carts')
      .select('id, quantity')
      .eq('user_id', user.user.id)
      .eq('product_id', product_id)
      .maybeSingle();

    if (existingItem) {
      // Update quantity if item exists
      const { error } = await supabase
        .from('carts')
        .update({ quantity: (existingItem?.quantity || 0) + quantity })
        .eq('id', existingItem?.id);

      if (error) {
        console.error('Error updating cart item:', error);
        toast({
          title: "Error",
          description: "Failed to update cart item",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Cart updated",
        description: "Item quantity updated in your cart",
      });
      return true;
    }

    // Add new item to cart
    const { error } = await supabase
      .from('carts')
      .insert([
        { 
          user_id: user.user.id, 
          product_id, 
          quantity 
        }
      ]);

    if (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Added to cart",
      description: "Item added to your cart",
    });
    return true;
  },

  async updateCartItemQuantity(cartItemId: string, quantity: number): Promise<boolean> {
    if (quantity < 1) {
      return this.removeFromCart(cartItemId);
    }

    const { error } = await supabase
      .from('carts')
      .update({ quantity })
      .eq('id', cartItemId);

    if (error) {
      console.error('Error updating cart item quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
      return false;
    }

    return true;
  },

  async removeFromCart(cartItemId: string): Promise<boolean> {
    const { error } = await supabase
      .from('carts')
      .delete()
      .eq('id', cartItemId);

    if (error) {
      console.error('Error removing item from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Item removed",
      description: "Item removed from your cart",
    });
    return true;
  },

  async clearCart(): Promise<boolean> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return false;
    }

    const { error } = await supabase
      .from('carts')
      .delete()
      .eq('user_id', user.user.id);

    if (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
    return true;
  }
};

export default cartService;
