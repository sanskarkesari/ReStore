
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAdmin } from "@/hooks/use-admin";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const adminLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

const AdminLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { adminLogin } = useAdmin();
  const navigate = useNavigate();

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AdminLoginFormValues) => {
    setIsLoading(true);
    try {
      await adminLogin(data.email, data.password);
    } catch (error) {
      console.error("Admin login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const useTestAdmin = () => {
    form.setValue("email", "admin@restore.com");
    form.setValue("password", "adminpassword123");
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <motion.div 
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <Card>
            <CardHeader className="space-y-1 flex flex-col items-center text-center">
              <Shield className="h-12 w-12 text-primary mb-2" />
              <CardTitle className="text-2xl">Admin Access</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6 bg-amber-50 text-amber-800 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription>
                  This page is restricted to authorized administrators only.
                </AlertDescription>
              </Alert>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Email</FormLabel>
                        <FormControl>
                          <Input placeholder="admin@restore.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Authenticating..." : "Login as Administrator"}
                  </Button>
                </form>
              </Form>

              <div className="mt-6">
                <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="flex flex-col space-y-2">
                    <p>For testing, you can use the demo admin account:</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-blue-200 text-blue-700 hover:bg-blue-100"
                      onClick={useTestAdmin}
                    >
                      Use Test Admin Credentials
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <p className="text-xs text-muted-foreground mt-2">
                If you need an admin account, please contact the system administrator.
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLoginPage;
