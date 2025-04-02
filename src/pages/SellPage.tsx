import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Upload, Trash2, AlertCircle, PackageCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProductListing } from "@/types/database";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const sellFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100),
  category: z.string().min(1, { message: "Please select a category" }),
  condition: z.string().min(1, { message: "Please select a condition" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }).max(1000),
  originalPrice: z.string().min(1, { message: "Original price is required" })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Price must be a positive number",
    }),
  sellingPrice: z.string().min(1, { message: "Selling price is required" })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Price must be a positive number",
    }),
  purchaseDate: z.string().optional(),
  usagePeriod: z.string().min(1, { message: "Please specify how long you've used this item" }),
  brand: z.string().optional(),
  model: z.string().optional(),
  color: z.string().optional(),
  location: z.string().min(1, { message: "Location is required" }),
  preferredPayment: z.string().optional(),
});

type SellFormValues = z.infer<typeof sellFormSchema>;

const SellPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("p2p");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState("");

  const form = useForm<SellFormValues>({
    resolver: zodResolver(sellFormSchema),
    defaultValues: {
      title: "",
      category: "",
      condition: "",
      description: "",
      originalPrice: "",
      sellingPrice: "",
      purchaseDate: "",
      usagePeriod: "",
      brand: "",
      model: "",
      color: "",
      location: "",
      preferredPayment: "",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    setUploadError("");
    
    const fileArray = Array.from(fileList);
    
    const invalidFiles = fileArray.filter(
      file => file.size > MAX_FILE_SIZE || !ACCEPTED_IMAGE_TYPES.includes(file.type)
    );
    
    if (invalidFiles.length > 0) {
      setUploadError("Some files were rejected. Please ensure all files are images under 5MB.");
      return;
    }

    const newImages = [...images, ...fileArray];
    setImages(newImages);
    
    const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    URL.revokeObjectURL(previewUrls[index]);
    
    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  const onSubmit = async (data: SellFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit your listing",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (images.length === 0) {
      setUploadError("Please upload at least one image of your product");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: listing, error: listingError } = await supabase
        .from('product_listings' as any)
        .insert({
          user_id: user.id,
          title: data.title,
          category: data.category,
          condition: data.condition,
          description: data.description,
          original_price: parseFloat(data.originalPrice),
          selling_price: parseFloat(data.sellingPrice),
          purchase_date: data.purchaseDate || null,
          usage_period: data.usagePeriod,
          brand: data.brand || null,
          model: data.model || null,
          color: data.color || null,
          location: data.location,
          preferred_payment: data.preferredPayment || null,
          listing_type: activeTab,
          status: "pending",
        })
        .select()
        .single();

      if (listingError) throw listingError;

      const listingId = (listing as unknown as ProductListing).id;
      const imageUploadPromises = images.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${listingId}/${index}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        return filePath;
      });

      const imagePaths = await Promise.all(imageUploadPromises);

      const { error: updateError } = await supabase
        .from('product_listings' as any)
        .update({ images: imagePaths })
        .eq("id", listingId);

      if (updateError) throw updateError;

      toast({
        title: "Listing submitted successfully",
        description: "Your listing is now pending approval from our team",
      });

      navigate("/profile");
    } catch (error: any) {
      console.error("Error submitting listing:", error);
      toast({
        title: "Failed to submit listing",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authLoading && !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                You need to be logged in to create a listing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/login")} className="w-full">
                Sign In
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
      <motion.main 
        className="flex-grow container py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Sell Your Item</h1>
          <p className="text-muted-foreground mb-6">
            List your pre-owned items and give them a second life
          </p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="p2p">P2P Marketplace</TabsTrigger>
              <TabsTrigger value="open-box">Open Box</TabsTrigger>
            </TabsList>
            
            <TabsContent value="p2p" className="mt-6">
              <Alert className="mb-6 bg-indigo-50 border-indigo-200">
                <PackageCheck className="h-5 w-5 text-indigo-500" />
                <AlertTitle>Peer-to-Peer Marketplace</AlertTitle>
                <AlertDescription>
                  Sell directly to other users. All listings are reviewed by our team before going live.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="open-box" className="mt-6">
              <Alert className="mb-6 bg-teal-50 border-teal-200">
                <PackageCheck className="h-5 w-5 text-teal-500" />
                <AlertTitle>Open Box Program</AlertTitle>
                <AlertDescription>
                  We purchase your item, verify it, and resell it with a ReStore guarantee.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
              <CardDescription>
                Provide accurate details to attract potential buyers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Samsung Galaxy S22 Ultra 256GB" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="smartphones">Smartphones</SelectItem>
                              <SelectItem value="laptops">Laptops</SelectItem>
                              <SelectItem value="tablets">Tablets</SelectItem>
                              <SelectItem value="cameras">Cameras</SelectItem>
                              <SelectItem value="audio">Audio</SelectItem>
                              <SelectItem value="gaming">Gaming</SelectItem>
                              <SelectItem value="wearables">Wearables</SelectItem>
                              <SelectItem value="accessories">Accessories</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Condition</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="like-new">Like New</SelectItem>
                              <SelectItem value="excellent">Excellent</SelectItem>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="fair">Fair</SelectItem>
                              <SelectItem value="poor">Poor</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Mumbai, Maharashtra" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your item in detail, including any damages or issues" 
                            className="min-h-32" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="originalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Original Price (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 70000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sellingPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Selling Price (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 45000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="purchaseDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purchase Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription>Approximate date is fine</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="usagePeriod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usage Period</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 8 months" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Apple" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. iPhone 13 Pro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Graphite" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormLabel>Product Images</FormLabel>
                    <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
                      <Input 
                        type="file" 
                        id="images" 
                        multiple 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <label 
                        htmlFor="images" 
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium">Click to upload images</span>
                        <span className="text-xs text-muted-foreground mt-1">
                          PNG, JPG or WEBP (max. 5MB each)
                        </span>
                      </label>
                    </div>
                    {uploadError && (
                      <div className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" /> {uploadError}
                      </div>
                    )}
                    
                    {previewUrls.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={url} 
                              alt={`Preview ${index}`} 
                              className="h-24 w-full object-cover rounded-md" 
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-black/70 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="preferredPayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Payment Method</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="any">Any Method</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>For P2P listings only</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Alert className="bg-muted">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your listing will be reviewed by our team before it appears on the marketplace.
                      This usually takes 24-48 hours.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit for Review"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default SellPage;
