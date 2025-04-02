
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ProductListing } from "@/types/database";

interface PendingListingRowProps {
  listing: ProductListing;
  onAction: () => void;
}

export const PendingListingRow = ({ listing, onAction }: PendingListingRowProps) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      // Type assertion to handle the table not being properly typed in Supabase client
      const { error } = await supabase
        .from('product_listings' as any)
        .update({ status: "approved" })
        .eq("id", listing.id);
        
      if (error) throw error;
      
      toast({
        title: "Listing approved",
        description: "The listing has been approved and is now live",
      });
      onAction();
    } catch (error: any) {
      toast({
        title: "Error approving listing",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsRejecting(true);
      // Type assertion to handle the table not being properly typed in Supabase client
      const { error } = await supabase
        .from('product_listings' as any)
        .update({ status: "rejected" })
        .eq("id", listing.id);
        
      if (error) throw error;
      
      toast({
        title: "Listing rejected",
        description: "The listing has been rejected",
      });
      onAction();
    } catch (error: any) {
      toast({
        title: "Error rejecting listing",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <tr className="border-b hover:bg-muted/40 transition-colors">
      <td className="px-4 py-3 text-sm font-mono">{listing.id.slice(0, 8)}...</td>
      <td className="px-4 py-3 font-medium">{listing.title}</td>
      <td className="px-4 py-3 text-sm">₹{listing.selling_price.toLocaleString()}</td>
      <td className="px-4 py-3 text-sm">
        {listing.listing_type === "p2p" ? (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            P2P
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
            Open Box
          </Badge>
        )}
      </td>
      <td className="px-4 py-3 text-sm">
        {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
      </td>
      <td className="px-4 py-3 text-sm">
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
          Pending
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-1" /> View
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-4xl">
              <AlertDialogHeader>
                <AlertDialogTitle>{listing.title}</AlertDialogTitle>
                <AlertDialogDescription>
                  Review the details of this listing before approving or rejecting.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 py-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Category</h4>
                  <p>{listing.category}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Condition</h4>
                  <p>{listing.condition}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Brand & Model</h4>
                  <p>{listing.brand || 'N/A'} {listing.model ? `- ${listing.model}` : ''}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Location</h4>
                  <p>{listing.location}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Usage Period</h4>
                  <p>{listing.usage_period}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Price</h4>
                  <p>₹{listing.selling_price.toLocaleString()} <span className="text-sm text-muted-foreground">(Original: ₹{listing.original_price.toLocaleString()})</span></p>
                </div>
                <div className="col-span-2">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Description</h4>
                  <p className="text-sm">{listing.description}</p>
                </div>
                
                {listing.images && listing.images.length > 0 && (
                  <div className="col-span-2 mt-2">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Images</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {listing.images.map((imgPath, index) => (
                        <img 
                          key={index}
                          src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/${imgPath}`}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                          onError={(e) => {
                            // Fallback if image fails to load
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleReject}>
                  Reject
                </AlertDialogAction>
                <AlertDialogAction className="bg-green-600 hover:bg-green-700" onClick={handleApprove}>
                  Approve
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={handleApprove}
            disabled={isApproving}
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleReject}
            disabled={isRejecting}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};
