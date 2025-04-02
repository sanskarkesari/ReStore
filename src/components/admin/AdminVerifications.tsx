
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { PendingListingRow } from "./PendingListingRow";
import { toast } from "@/hooks/use-toast";
import { ProductListing } from "@/types/database";

export const AdminVerifications = () => {
  const [pendingListings, setPendingListings] = useState<ProductListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchPendingListings = async () => {
    try {
      setIsLoading(true);
      // Use a more specific type assertion to handle the Supabase client limitations
      const { data, error } = await supabase
        .from('product_listings')
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      // Use proper type assertion here
      setPendingListings((data || []) as ProductListing[]);
    } catch (error: any) {
      console.error("Error fetching pending listings:", error);
      toast({
        title: "Failed to load listings",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingListings();
  }, []);

  const handleApproveAll = async () => {
    try {
      if (pendingListings.length === 0) return;
      
      // Use proper type handling
      const { error } = await supabase
        .from('product_listings')
        .update({ status: "approved" })
        .in("id", pendingListings.map(listing => listing.id));
        
      if (error) throw error;
      
      toast({
        title: "All listings approved",
        description: `${pendingListings.length} listings have been approved`,
      });
      
      // Refresh the list
      fetchPendingListings();
    } catch (error: any) {
      toast({
        title: "Error approving listings",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Verifications</CardTitle>
        <CardDescription>
          Review and approve or reject submitted items
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : pendingListings.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-sm">ID</th>
                  <th className="px-4 py-3 text-left font-medium text-sm">Product</th>
                  <th className="px-4 py-3 text-left font-medium text-sm">Price</th>
                  <th className="px-4 py-3 text-left font-medium text-sm">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-sm">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-sm">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pendingListings.map((listing) => (
                  <PendingListingRow 
                    key={listing.id} 
                    listing={listing} 
                    onAction={fetchPendingListings} 
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex justify-center items-center py-12 text-muted-foreground">
            No pending verifications at the moment.
          </div>
        )}
      </CardContent>
      {pendingListings.length > 0 && (
        <CardFooter className="flex justify-between">
          <Button variant="outline">View All Verifications</Button>
          <Button onClick={handleApproveAll}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve All
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
