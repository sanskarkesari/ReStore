
// Define the ProductListing type that matches the structure in Supabase
export type ProductListing = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  condition: string;
  description: string;
  original_price: number;
  selling_price: number;
  purchase_date: string | null;
  usage_period: string;
  brand: string | null;
  model: string | null;
  color: string | null;
  location: string;
  preferred_payment: string | null;
  listing_type: string;
  status: string;
  images: string[] | null;
  created_at: string;
  updated_at: string;
};
