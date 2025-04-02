
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  Users,
  ShoppingCart,
  AlertTriangle,
  User,
  Search,
  Filter,
  Box,
  LogOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAdmin } from "@/hooks/use-admin";
import { AdminVerifications } from "@/components/admin/AdminVerifications";
import { supabase } from "@/integrations/supabase/client";

// Mock data for the admin dashboard
const recentOrders = [
  {
    id: "ord1",
    customer: "Priya Sharma",
    items: 2,
    total: 34999,
    status: "delivered",
    date: "2023-06-15",
  },
  {
    id: "ord2",
    customer: "Arjun Patel",
    items: 1,
    total: 79999,
    status: "shipped",
    date: "2023-06-14",
  },
  {
    id: "ord3",
    customer: "Meera Gupta",
    items: 3,
    total: 12599,
    status: "processing",
    date: "2023-06-14",
  },
  {
    id: "ord4",
    customer: "Karthik Reddy",
    items: 1,
    total: 54999,
    status: "cancelled",
    date: "2023-06-12",
  },
];

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingVerifications: 0,
    activeUsers: 0,
    recentOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin, adminLogout } = useAdmin();
  const navigate = useNavigate();

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Count pending verifications
        const { count: pendingCount, error: pendingError } = await supabase
          .from("product_listings")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");
        
        if (pendingError) throw pendingError;
        
        // For demonstration, we're setting mock stats
        // In a real app, you would fetch these from your database
        setStats({
          totalProducts: 487,
          pendingVerifications: pendingCount || 0,
          activeUsers: 1432,
          recentOrders: 24,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin && !isLoading) {
      navigate("/admin-login");
    }
  }, [isAdmin, isLoading, navigate]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Unauthorized Access</CardTitle>
              <CardDescription>
                You need to be an administrator to access this page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/admin-login")} className="w-full">
                Go to Admin Login
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage products, verifications, and platform operations
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button 
                variant="destructive" 
                onClick={adminLogout}
                className="ml-2"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{stats.totalProducts}</div>
                  <Box className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex gap-2 mt-2 text-sm">
                  <Badge>New: 252</Badge>
                  <Badge variant="outline" className="bg-eco-sky/10 text-eco-sky">Open Box: 143</Badge>
                  <Badge variant="outline" className="bg-eco-light-green/10 text-eco-light-green">P2P: 92</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pending Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{stats.pendingVerifications}</div>
                  <AlertTriangle className="h-8 w-8 text-amber-500" />
                </div>
                <div className="flex gap-2 mt-2 text-sm">
                  <Badge variant="outline" className="bg-eco-sky/10 text-eco-sky">Open Box: 4</Badge>
                  <Badge variant="outline" className="bg-eco-light-green/10 text-eco-light-green">P2P: 11</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{stats.activeUsers}</div>
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex gap-2 mt-2 text-sm">
                  <Badge>Buyers: 1,102</Badge>
                  <Badge>Sellers: 330</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{stats.recentOrders}</div>
                  <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex gap-2 mt-2 text-sm">
                  <Badge variant="outline" className="bg-green-100 text-green-800">Delivered: 12</Badge>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">Processing: 9</Badge>
                  <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled: 3</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Tabs */}
          <Tabs defaultValue="verifications">
            <TabsList className="mb-6">
              <TabsTrigger value="verifications" className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Verifications
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center">
                <Package className="mr-2 h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="verifications">
              <AdminVerifications />
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    Monitor and manage customer orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentOrders.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted text-muted-foreground">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium text-sm">Order ID</th>
                            <th className="px-4 py-3 text-left font-medium text-sm">Customer</th>
                            <th className="px-4 py-3 text-left font-medium text-sm">Items</th>
                            <th className="px-4 py-3 text-left font-medium text-sm">Total</th>
                            <th className="px-4 py-3 text-left font-medium text-sm">Date</th>
                            <th className="px-4 py-3 text-left font-medium text-sm">Status</th>
                            <th className="px-4 py-3 text-left font-medium text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {recentOrders.map((order) => (
                            <tr key={order.id}>
                              <td className="px-4 py-3 text-sm">{order.id}</td>
                              <td className="px-4 py-3">{order.customer}</td>
                              <td className="px-4 py-3 text-sm">{order.items}</td>
                              <td className="px-4 py-3 text-sm">₹{order.total.toLocaleString()}</td>
                              <td className="px-4 py-3 text-sm">{order.date}</td>
                              <td className="px-4 py-3 text-sm">
                                {order.status === "delivered" && (
                                  <Badge variant="outline" className="bg-green-100 text-green-800">
                                    Delivered
                                  </Badge>
                                )}
                                {order.status === "shipped" && (
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                    Shipped
                                  </Badge>
                                )}
                                {order.status === "processing" && (
                                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                    Processing
                                  </Badge>
                                )}
                                {order.status === "cancelled" && (
                                  <Badge variant="outline" className="bg-red-100 text-red-800">
                                    Cancelled
                                  </Badge>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center py-12 text-muted-foreground">
                      No orders to display.
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline">View All Orders</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>
                    Manage all products in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-center py-12 text-muted-foreground">
                    Product management interface will be developed in Phase 2.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage user accounts and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-center py-12 text-muted-foreground">
                    User management interface will be developed in Phase 2.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
