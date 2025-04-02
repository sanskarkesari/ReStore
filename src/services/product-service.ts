
import { supabase } from "@/integrations/supabase/client";

export interface ProductDto {
  product_id: string;
  product_name: string;
  description: string | null;
  category: string;
  price: number;
  original_price: number | null;
  image: string | null;
  condition_rating: 'new' | 'excellent' | 'good' | 'fair' | 'poor';
  warranty_info: string | null;
  listing_type: 'new' | 'open_box' | 'p2p';
  status: 'available' | 'sold' | 'reserved';
  created_at: string;
  updated_at: string;
  seller_id: string | null;
}

export interface ProductCardData {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  type: string;
  rating?: number;
  inStock: boolean;
  isVerified?: boolean;
}

// Helper function to convert from DB format to UI format
export function mapProductToCardData(product: ProductDto): ProductCardData {
  return {
    id: product.product_id,
    title: product.product_name,
    price: product.price,
    originalPrice: product.original_price || undefined,
    image: product.image || 'https://placekitten.com/300/200', // Fallback image
    category: product.category,
    type: mapListingTypeToUiType(product.listing_type),
    inStock: product.status === 'available',
    isVerified: true // We could get this from condition_reports in the future
  };
}

// Helper function to map listing_type to UI type
function mapListingTypeToUiType(listingType: string): string {
  switch (listingType) {
    case 'new': return 'new';
    case 'open_box': return 'open-box';
    case 'p2p': return 'p2p';
    default: return 'new';
  }
}

const productService = {
  async getProducts(): Promise<ProductCardData[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return (data as ProductDto[]).map(mapProductToCardData);
  },

  async getOpenBoxProducts(): Promise<ProductCardData[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('listing_type', 'open_box')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching open box products:', error);
      return [];
    }

    return (data as ProductDto[]).map(mapProductToCardData);
  },

  async getP2PProducts(): Promise<ProductCardData[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('listing_type', 'p2p')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching P2P products:', error);
      return [];
    }

    return (data as ProductDto[]).map(mapProductToCardData);
  },

  async getProductById(id: string): Promise<ProductDto | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('product_id', id)
      .single();

    if (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      return null;
    }

    return data as ProductDto;
  },
  
  // Expose the mapProductToCardData function
  mapProductToCardData
};

export default productService;
