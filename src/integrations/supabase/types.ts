export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      carts: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "carts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string
          listing_id: string | null
          message: string
          message_id: string
          read: boolean | null
          recipient_id: string | null
          sender_id: string | null
        }
        Insert: {
          created_at?: string
          listing_id?: string | null
          message: string
          message_id?: string
          read?: boolean | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Update: {
          created_at?: string
          listing_id?: string | null
          message?: string
          message_id?: string
          read?: boolean | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "p2p_listings"
            referencedColumns: ["listing_id"]
          },
          {
            foreignKeyName: "chat_messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      condition_reports: {
        Row: {
          admin_id: string | null
          condition_notes: string | null
          created_at: string
          product_id: string | null
          report_id: string
          verification_badge: boolean | null
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_at: string | null
        }
        Insert: {
          admin_id?: string | null
          condition_notes?: string | null
          created_at?: string
          product_id?: string | null
          report_id?: string
          verification_badge?: boolean | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
        }
        Update: {
          admin_id?: string | null
          condition_notes?: string | null
          created_at?: string
          product_id?: string | null
          report_id?: string
          verification_badge?: boolean | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "condition_reports_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "condition_reports_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      disputes: {
        Row: {
          admin_response: string | null
          created_at: string
          dispute_id: string
          reason: string
          resolved_at: string | null
          status: Database["public"]["Enums"]["dispute_status"]
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          admin_response?: string | null
          created_at?: string
          dispute_id?: string
          reason: string
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          admin_response?: string | null
          created_at?: string
          dispute_id?: string
          reason?: string
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disputes_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
          {
            foreignKeyName: "disputes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          charity_partner: string
          donation_date: string
          donation_id: string
          donation_status: Database["public"]["Enums"]["donation_status"]
          product_id: string | null
          seller_id: string | null
        }
        Insert: {
          charity_partner: string
          donation_date?: string
          donation_id?: string
          donation_status?: Database["public"]["Enums"]["donation_status"]
          product_id?: string | null
          seller_id?: string | null
        }
        Update: {
          charity_partner?: string
          donation_date?: string
          donation_id?: string
          donation_status?: Database["public"]["Enums"]["donation_status"]
          product_id?: string | null
          seller_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "donations_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      p2p_listings: {
        Row: {
          created_at: string
          description: string | null
          expected_price: number
          images: string[] | null
          listing_id: string
          product_id: string | null
          seller_id: string | null
          status: Database["public"]["Enums"]["verification_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          expected_price: number
          images?: string[] | null
          listing_id?: string
          product_id?: string | null
          seller_id?: string | null
          status?: Database["public"]["Enums"]["verification_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          expected_price?: number
          images?: string[] | null
          listing_id?: string
          product_id?: string | null
          seller_id?: string | null
          status?: Database["public"]["Enums"]["verification_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "p2p_listings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "p2p_listings_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          payment_id: string
          payment_method: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          payment_id?: string
          payment_method: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          payment_id?: string
          payment_method?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_listings: {
        Row: {
          brand: string | null
          category: string
          color: string | null
          condition: string
          created_at: string
          description: string
          id: string
          images: string[] | null
          listing_type: string
          location: string
          model: string | null
          original_price: number
          preferred_payment: string | null
          purchase_date: string | null
          selling_price: number
          status: string
          title: string
          updated_at: string
          usage_period: string
          user_id: string
        }
        Insert: {
          brand?: string | null
          category: string
          color?: string | null
          condition: string
          created_at?: string
          description: string
          id?: string
          images?: string[] | null
          listing_type: string
          location: string
          model?: string | null
          original_price: number
          preferred_payment?: string | null
          purchase_date?: string | null
          selling_price: number
          status?: string
          title: string
          updated_at?: string
          usage_period: string
          user_id: string
        }
        Update: {
          brand?: string | null
          category?: string
          color?: string | null
          condition?: string
          created_at?: string
          description?: string
          id?: string
          images?: string[] | null
          listing_type?: string
          location?: string
          model?: string | null
          original_price?: number
          preferred_payment?: string | null
          purchase_date?: string | null
          selling_price?: number
          status?: string
          title?: string
          updated_at?: string
          usage_period?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          condition_rating: Database["public"]["Enums"]["product_condition"]
          created_at: string
          description: string | null
          image: string | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          original_price: number | null
          price: number
          product_id: string
          product_name: string
          seller_id: string | null
          status: Database["public"]["Enums"]["product_status"]
          updated_at: string
          warranty_info: string | null
        }
        Insert: {
          category: string
          condition_rating?: Database["public"]["Enums"]["product_condition"]
          created_at?: string
          description?: string | null
          image?: string | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          original_price?: number | null
          price: number
          product_id?: string
          product_name: string
          seller_id?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
          warranty_info?: string | null
        }
        Update: {
          category?: string
          condition_rating?: Database["public"]["Enums"]["product_condition"]
          created_at?: string
          description?: string | null
          image?: string | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          original_price?: number | null
          price?: number
          product_id?: string
          product_name?: string
          seller_id?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
          warranty_info?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          govt_id: string | null
          id: string
          name: string
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          created_at?: string
          govt_id?: string | null
          id: string
          name: string
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          created_at?: string
          govt_id?: string | null
          id?: string
          name?: string
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          product_id: string | null
          rating: number
          review_id: string
          review_text: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          product_id?: string | null
          rating: number
          review_id?: string
          review_text?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          product_id?: string | null
          rating?: number
          review_id?: string
          review_text?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping: {
        Row: {
          courier_partner: string | null
          created_at: string
          delivery_status: Database["public"]["Enums"]["delivery_status"]
          expected_delivery: string | null
          product_id: string | null
          shipping_address: string
          shipping_id: string
          tracking_id: string | null
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          courier_partner?: string | null
          created_at?: string
          delivery_status?: Database["public"]["Enums"]["delivery_status"]
          expected_delivery?: string | null
          product_id?: string | null
          shipping_address: string
          shipping_id?: string
          tracking_id?: string | null
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          courier_partner?: string | null
          created_at?: string
          delivery_status?: Database["public"]["Enums"]["delivery_status"]
          expected_delivery?: string | null
          product_id?: string | null
          shipping_address?: string
          shipping_id?: string
          tracking_id?: string | null
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipping_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "shipping_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          buyer_id: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          product_id: string | null
          seller_id: string | null
          shipping_method: string
          status: Database["public"]["Enums"]["shipping_status"]
          transaction_date: string
          transaction_id: string
        }
        Insert: {
          amount: number
          buyer_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          product_id?: string | null
          seller_id?: string | null
          shipping_method: string
          status?: Database["public"]["Enums"]["shipping_status"]
          transaction_date?: string
          transaction_id?: string
        }
        Update: {
          amount?: number
          buyer_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          product_id?: string | null
          seller_id?: string | null
          shipping_method?: string
          status?: Database["public"]["Enums"]["shipping_status"]
          transaction_date?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "transactions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "wishlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      delivery_status: "in_transit" | "delivered"
      dispute_status: "pending" | "resolved" | "rejected"
      donation_status: "initiated" | "completed"
      listing_type: "new" | "open_box" | "p2p"
      payment_status: "pending" | "completed" | "failed"
      product_condition: "new" | "excellent" | "good" | "fair" | "poor"
      product_status: "available" | "sold" | "reserved"
      shipping_status: "processing" | "shipped" | "delivered" | "disputed"
      user_role: "buyer" | "seller" | "admin"
      verification_status: "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
