
import React from "react";
import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted py-10 border-t">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-eco-green" />
            <span className="font-bold text-xl">ReStore</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Promoting sustainability through our innovative return processing and
            resale system. Reducing waste, one purchase at a time.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/open-box"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Open Box Products
              </Link>
            </li>
            <li>
              <Link
                to="/p2p"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                P2P Marketplace
              </Link>
            </li>
            <li>
              <Link
                to="/sell"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Start Selling
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-foreground">Help & Support</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/faq"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                to="/shipping"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link
                to="/returns"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Returns & Refunds
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-foreground">About Us</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Our Mission
              </Link>
            </li>
            <li>
              <Link
                to="/sustainability"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sustainability Efforts
              </Link>
            </li>
            <li>
              <Link
                to="/partners"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Our Partners
              </Link>
            </li>
            <li>
              <Link
                to="/careers"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Careers
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mt-10 pt-6 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2023 ReStore. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
