
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "./use-toast";
import { User } from "@supabase/supabase-js";

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check if the user is an admin by querying the admin_users table
  const checkIsAdmin = async (user: User | null) => {
    if (!user) return false;
    
    try {
      // Use the is_admin function we created in the SQL migration
      const { data, error } = await supabase.rpc('is_admin', {
        user_id: user.id
      });
      
      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
      
      return data || false;
    } catch (error) {
      console.error("Error in admin check:", error);
      return false;
    }
  };

  useEffect(() => {
    // Check if the current user is an admin
    const checkAdminStatus = async () => {
      setIsLoading(true);
      
      const { data } = await supabase.auth.getSession();
      const adminStatus = await checkIsAdmin(data.session?.user || null);
      setIsAdmin(adminStatus);
      
      setIsLoading(false);
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const adminStatus = await checkIsAdmin(session?.user || null);
        setIsAdmin(adminStatus);
      }
    );

    checkAdminStatus();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Admin login function
  const adminLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Check if the logged in user is an admin
      const { data } = await supabase.auth.getSession();
      const adminStatus = await checkIsAdmin(data.session?.user || null);
      
      if (!adminStatus) {
        // If not admin, sign out and throw an error
        await supabase.auth.signOut();
        throw new Error("This account does not have administrator privileges");
      }
      
      // Redirect to admin dashboard after successful login
      navigate("/admin");
      
      toast({
        title: "Admin login successful",
        description: "Welcome to the admin dashboard",
      });
    } catch (error: any) {
      toast({
        title: "Admin login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Admin logout function
  const adminLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate("/");
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out from the admin account",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminContext.Provider value={{ isAdmin, isLoading, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
