
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [quickSearch, setQuickSearch] = useState("");
  const navigate = useNavigate();

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/?search=${encodeURIComponent(quickSearch)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-legal-600 to-legal-800 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚖</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl legal-text-gradient">LegalSearch</span>
              <span className="text-xs text-muted-foreground">Case Law Database</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-legal-600 transition-colors">
              Search
            </Link>
            <Link to="/browse" className="text-sm font-medium hover:text-legal-600 transition-colors">
              Browse Cases
            </Link>
            <Link to="/upload" className="text-sm font-medium hover:text-legal-600 transition-colors">
              Upload Case
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-legal-600 transition-colors">
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <form onSubmit={handleQuickSearch} className="hidden sm:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Quick search..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </form>
          
          <Button 
            variant="default" 
            size="sm"
            className="bg-gradient-to-r from-legal-600 to-legal-700 hover:from-legal-700 hover:to-legal-800"
          >
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
