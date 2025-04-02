
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container flex flex-col items-center justify-center py-20">
        <div className="text-center max-w-md">
          <h1 className="text-7xl font-bold text-eco-green mb-6">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you are looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>
            <Button variant="outline" asChild onClick={() => window.history.back()}>
              <button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </button>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
