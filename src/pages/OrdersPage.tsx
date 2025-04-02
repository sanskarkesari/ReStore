
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, FileText, Package, TruckIcon, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";

interface Order {
  transaction_id: string;
  transaction_date: string;
  amount: number;
  status: 'processing' | 'shipped' | 'delivered' | 'disputed';
  product: {
    product_id: string;
    product_name: string;
    image: string | null;
    price: number;
  } | null;
}

const OrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            transaction_id,
            transaction_date,
            amount,
            status,
            product:product_id (
              product_id,
              product_name,
              image,
              price
            )
          `)
          .eq('buyer_id', user.id)
          .order('transaction_date', { ascending: false });

        if (error) {
          throw error;
        }

        setOrders(data || []);
      } catch (error: any) {
        console.error("Error fetching orders:", error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load order history.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate, toast]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Shipped</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Delivered</Badge>;
      case 'disputed':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Disputed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Package className="w-8 h-8 text-yellow-600" />;
      case 'shipped':
        return <TruckIcon className="w-8 h-8 text-blue-600" />;
      case 'delivered':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'disputed':
        return <FileText className="w-8 h-8 text-red-600" />;
      default:
        return <ShoppingBag className="w-8 h-8 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container py-8">
          <div className="flex items-center justify-center h-full">
            <p>Loading orders...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Orders</h1>
          
          {orders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">You haven't made any purchases yet.</p>
                <Button asChild>
                  <a href="/">Browse Products</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.transaction_id}>
                  <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Order ID</p>
                        <CardTitle className="text-base font-medium">
                          {order.transaction_id}
                        </CardTitle>
                      </div>
                      <div className="flex flex-col md:items-end">
                        <p className="text-sm text-muted-foreground">Order Date</p>
                        <p className="font-medium">{formatDate(order.transaction_date)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex items-center justify-center bg-muted p-4 rounded-md">
                        {getStatusIcon(order.status)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-2">
                          <h3 className="font-semibold">
                            {order.product?.product_name || "Unknown Product"}
                          </h3>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Total: {formatCurrency(order.amount)}
                        </p>
                        <Separator className="mb-4" />
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                          <Button variant="outline" asChild>
                            <a href={`/product/${order.product?.product_id}`}>View Product</a>
                          </Button>
                          <Button variant="outline" asChild>
                            <a href={`/orders/${order.transaction_id}/details`}>Order Details</a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;
