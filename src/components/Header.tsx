
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Scale, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import AdminHeader from "@/components/AdminHeader";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  // Debug logging
  console.log('Header - User:', user?.email);
  console.log('Header - IsAdmin:', isAdmin);

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Scale className="w-8 h-8 text-legal-600" />
            <span className="text-xl font-bold text-slate-800">LegalDB</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-legal-600 ${
                isActive("/") ? "text-legal-600" : "text-slate-600"
              }`}
            >
              Home
            </Link>
            <Link
              to="/browse"
              className={`text-sm font-medium transition-colors hover:text-legal-600 ${
                isActive("/browse") ? "text-legal-600" : "text-slate-600"
              }`}
            >
              Browse Cases
            </Link>
            {isAdmin && (
              <Link
                to="/upload"
                className={`text-sm font-medium transition-colors hover:text-legal-600 ${
                  isActive("/upload") ? "text-legal-600" : "text-slate-600"
                }`}
              >
                Upload Case
              </Link>
            )}
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors hover:text-legal-600 ${
                isActive("/about") ? "text-legal-600" : "text-slate-600"
              }`}
            >
              About
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <AdminHeader />
            ) : (
              <Link to="/auth">
                <Button className="bg-legal-600 hover:bg-legal-700">
                  Admin Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMenu}
            className="md:hidden"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-legal-600 ${
                  isActive("/") ? "text-legal-600" : "text-slate-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/browse"
                className={`text-sm font-medium transition-colors hover:text-legal-600 ${
                  isActive("/browse") ? "text-legal-600" : "text-slate-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Cases
              </Link>
              {isAdmin && (
                <Link
                  to="/upload"
                  className={`text-sm font-medium transition-colors hover:text-legal-600 ${
                    isActive("/upload") ? "text-legal-600" : "text-slate-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Upload Case
                </Link>
              )}
              <Link
                to="/about"
                className={`text-sm font-medium transition-colors hover:text-legal-600 ${
                  isActive("/about") ? "text-legal-600" : "text-slate-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              {/* Mobile Auth */}
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <AdminHeader />
                ) : (
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button className="bg-legal-600 hover:bg-legal-700">
                      Admin Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
