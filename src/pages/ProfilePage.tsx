
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  ShoppingBag,
  Edit,
  Save
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface ProfileData {
  id: string;
  name: string;
  phone_number: string | null;
  role: string;
  verification_status: string;
  created_at: string;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
  });

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) {
      navigate("/login");
      return;
    }

    // Fetch user profile from Supabase
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProfile(data);
          setFormData({
            name: data.name || "",
            phone_number: data.phone_number || "",
          });
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: formData.name,
          phone_number: formData.phone_number,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      // Update the local profile state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          name: formData.name,
          phone_number: formData.phone_number,
        };
      });

      setEditMode(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile.",
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container py-8">
          <div className="flex items-center justify-center h-full">
            <p>Loading profile data...</p>
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
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          
          <Tabs defaultValue="personal-info">
            <TabsList className="mb-8">
              <TabsTrigger value="personal-info">Personal Information</TabsTrigger>
              <TabsTrigger value="my-listings">My Listings</TabsTrigger>
              <TabsTrigger value="my-purchases">Purchase History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal-info">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  {editMode ? (
                    <Button variant="outline" onClick={handleSaveProfile}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => setEditMode(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center">
                        <User className="h-10 w-10 text-muted-foreground" />
                      </div>
                      {editMode ? (
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="max-w-xs"
                          placeholder="Your name"
                        />
                      ) : (
                        <div>
                          <h3 className="text-xl font-medium">{profile?.name}</h3>
                          <p className="text-muted-foreground capitalize">{profile?.role}</p>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">Email Address</span>
                        </div>
                        <p>{user?.email}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">Phone Number</span>
                        </div>
                        {editMode ? (
                          <Input
                            name="phone_number"
                            value={formData.phone_number || ""}
                            onChange={handleInputChange}
                            placeholder="Your phone number"
                          />
                        ) : (
                          <p>{profile?.phone_number || "Not provided"}</p>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">Account Created</span>
                        </div>
                        <p>{profile?.created_at ? formatDate(profile.created_at) : "Unknown"}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <ShoppingBag className="h-4 w-4" />
                          <span className="text-sm">Verification Status</span>
                        </div>
                        <p className="capitalize">{profile?.verification_status}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="my-listings">
              <Card>
                <CardHeader>
                  <CardTitle>My Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No listings yet</h3>
                    <p className="text-muted-foreground mb-4">You haven't listed any products for sale yet.</p>
                    <Button asChild>
                      <a href="/sell">Start Selling</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="my-purchases">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No purchases yet</h3>
                    <p className="text-muted-foreground mb-4">You haven't made any purchases yet.</p>
                    <Button asChild>
                      <a href="/">Browse Products</a>
                    </Button>
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

export default ProfilePage;
