
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Leaf,
  ShoppingBag,
  Menu,
  X,
  Package,
  Users,
  Search,
  Heart,
  User,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { useAdmin } from "@/hooks/use-admin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Will implement search functionality in the future
    console.log("Searching for:", searchQuery);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="bg-background border-b">
      <div className="container py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-eco-green" />
            <span className="font-semibold text-xl tracking-tight hidden md:inline-block">
              ReStore
            </span>
          </Link>

          {/* Search Bar (Desktop) */}
          {!isMobile && (
            <form
              onSubmit={handleSearch}
              className="w-full max-w-md mx-4 relative"
            >
              <Input
                type="search"
                placeholder="Search for products..."
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          )}

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex items-center gap-1">
              <Button variant="ghost" asChild>
                <Link to="/open-box" className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <span>Open Box</span>
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/p2p" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>P2P</span>
                </Link>
              </Button>
              
              {user ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/sell" className="flex items-center gap-1">
                      <ShoppingBag className="h-4 w-4" />
                      <span>Start Selling</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/wishlist">
                      <Heart className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/cart">
                      <ShoppingBag className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <User className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/orders">Orders</Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin">
                            <ShieldCheck className="h-4 w-4 mr-2" /> Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" /> Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="default" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/admin-login" className="flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  </Button>
                </>
              )}
            </nav>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/search">
                  <Search className="h-5 w-5" />
                </Link>
              </Button>
              
              {user && (
                <>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/wishlist">
                      <Heart className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/cart">
                      <ShoppingBag className="h-5 w-5" />
                    </Link>
                  </Button>
                </>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                      <Link
                        to="/"
                        className="flex items-center gap-2"
                        onClick={() => document.body.click()}
                      >
                        <Leaf className="h-5 w-5 text-eco-green" />
                        <span className="font-semibold">ReStore</span>
                      </Link>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon">
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetClose>
                    </div>

                    <div className="space-y-6 flex-1">
                      <div className="space-y-2">
                        <SheetClose asChild>
                          <Link
                            to="/open-box"
                            className="flex items-center gap-2 py-2 px-3 hover:bg-muted rounded-md transition-colors"
                          >
                            <Package className="h-5 w-5" />
                            <span>Open Box Products</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            to="/p2p"
                            className="flex items-center gap-2 py-2 px-3 hover:bg-muted rounded-md transition-colors"
                          >
                            <Users className="h-5 w-5" />
                            <span>P2P Marketplace</span>
                          </Link>
                        </SheetClose>
                        {user && (
                          <SheetClose asChild>
                            <Link
                              to="/sell"
                              className="flex items-center gap-2 py-2 px-3 hover:bg-muted rounded-md transition-colors"
                            >
                              <ShoppingBag className="h-5 w-5" />
                              <span>Start Selling</span>
                            </Link>
                          </SheetClose>
                        )}
                      </div>

                      <div className="space-y-2 border-t pt-4">
                        {user ? (
                          <>
                            <SheetClose asChild>
                              <Link
                                to="/profile"
                                className="flex items-center gap-2 py-2 px-3 hover:bg-muted rounded-md transition-colors"
                              >
                                <User className="h-5 w-5" />
                                <span>My Profile</span>
                              </Link>
                            </SheetClose>
                            <SheetClose asChild>
                              <Link
                                to="/orders"
                                className="flex items-center gap-2 py-2 px-3 hover:bg-muted rounded-md transition-colors"
                              >
                                <ShoppingBag className="h-5 w-5" />
                                <span>My Orders</span>
                              </Link>
                            </SheetClose>
                            {isAdmin && (
                              <SheetClose asChild>
                                <Link
                                  to="/admin"
                                  className="flex items-center gap-2 py-2 px-3 hover:bg-muted rounded-md transition-colors"
                                >
                                  <ShieldCheck className="h-5 w-5" />
                                  <span>Admin Dashboard</span>
                                </Link>
                              </SheetClose>
                            )}
                            <button
                              onClick={() => {
                                handleSignOut();
                                document.body.click(); // Close the sheet
                              }}
                              className="w-full flex items-center gap-2 py-2 px-3 hover:bg-muted rounded-md transition-colors text-left"
                            >
                              <LogOut className="h-5 w-5" />
                              <span>Sign Out</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <SheetClose asChild>
                              <Link to="/login">
                                <Button className="w-full">Sign In</Button>
                              </Link>
                            </SheetClose>
                            <SheetClose asChild>
                              <Link to="/admin-login">
                                <Button variant="outline" className="w-full flex items-center gap-2 mt-2">
                                  <ShieldCheck className="h-4 w-4" />
                                  <span>Admin Access</span>
                                </Button>
                              </Link>
                            </SheetClose>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
