import { motion } from "framer-motion";
import AuthForm from "@/components/auth/AuthForm";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Leaf, ShieldCheck, Recycle, HandCoins } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          <motion.div 
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="inline-flex items-center justify-center gap-2 mb-6">
              <Leaf className="h-10 w-10 text-eco-green" />
              <span className="font-bold text-3xl">ReStore</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to ReStore!</h1>
            <p className="text-muted-foreground text-lg">
              Join our sustainable marketplace to buy and sell eco-friendly products.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-6 w-6 text-eco-green mt-0.5" />
                <div>
                  <h3 className="font-medium">Verified Quality</h3>
                  <p className="text-muted-foreground">All products are thoroughly checked for quality and authenticity.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Recycle className="h-6 w-6 text-eco-green mt-0.5" />
                <div>
                  <h3 className="font-medium">Reduce, Reuse, Recycle</h3>
                  <p className="text-muted-foreground">Support sustainable consumption and give products a second life.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <HandCoins className="h-6 w-6 text-eco-green mt-0.5" />
                <div>
                  <h3 className="font-medium">Save Money</h3>
                  <p className="text-muted-foreground">Get quality products at a fraction of the retail price.</p>
                </div>
              </div>
            </div>
            
            <Alert className="mt-8 bg-muted/50">
              <AlertTitle>First time here?</AlertTitle>
              <AlertDescription>
                Create an account to start your sustainable shopping journey. You can also browse as a guest.
              </AlertDescription>
            </Alert>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AuthForm />
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
