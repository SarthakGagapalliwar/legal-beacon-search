import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import CaseSearch from "@/components/CaseSearch";
import CaseCard from "@/components/CaseCard";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Scale, Users, BookOpen, Loader2 } from "lucide-react";
import { useCases, type SearchFilters } from "@/hooks/useCases";

const Index = () => {
  const [searchParams] = useSearchParams();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: "",
    actName: "",
    section: "",
    court: "",
    year: "",
    jurisdiction: ""
  });
  
  const initialQuery = searchParams.get('search') || '';
  const { data: searchResults = [], isLoading } = useCases(searchFilters);

  const handleSearch = (filters: SearchFilters) => {
    console.log('Search filters:', filters);
    setSearchFilters(filters);
  };

  const handleViewDetails = (caseId: string) => {
    console.log("Viewing case details for:", caseId);
    // Navigate to case details page (to be implemented)
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch({ 
        query: initialQuery, 
        actName: "", 
        section: "", 
        court: "", 
        year: "", 
        jurisdiction: "" 
      });
    }
  }, [initialQuery]);

  // Get stats from all cases (without filters)
  const { data: allCases = [] } = useCases();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="legal-text-gradient">Legal Research</span>
              <br />
              <span className="text-slate-700">Made Simple</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Search through thousands of legal cases, find relevant precedents, and access comprehensive case law database
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 border">
              <div className="flex items-center justify-center space-x-2 text-legal-600 mb-2">
                <BookOpen className="w-5 h-5" />
                <span className="font-bold text-lg">{allCases.length}+</span>
              </div>
              <p className="text-sm text-muted-foreground">Cases</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 border">
              <div className="flex items-center justify-center space-x-2 text-legal-600 mb-2">
                <Scale className="w-5 h-5" />
                <span className="font-bold text-lg">20+</span>
              </div>
              <p className="text-sm text-muted-foreground">Acts</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 border">
              <div className="flex items-center justify-center space-x-2 text-legal-600 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-bold text-lg">98%</span>
              </div>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 border">
              <div className="flex items-center justify-center space-x-2 text-legal-600 mb-2">
                <Users className="w-5 h-5" />
                <span className="font-bold text-lg">5K+</span>
              </div>
              <p className="text-sm text-muted-foreground">Users</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto">
          <CaseSearch onSearch={handleSearch} initialQuery={initialQuery} />
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {searchResults.length > 0 || searchFilters.query ? 'Search Results' : 'Featured Cases'}
              </h2>
              <p className="text-muted-foreground">
                {isLoading ? 'Searching...' : `${searchResults.length} cases found`}
              </p>
            </div>
            
            {searchResults.length > 0 && (
              <div className="flex space-x-2">
                <Badge variant="outline">
                  {searchResults.filter(c => c.status === 'landmark').length} Landmark
                </Badge>
                <Badge variant="outline">
                  {searchResults.filter(c => c.status === 'recent').length} Recent
                </Badge>
                <Badge variant="outline">
                  {searchResults.filter(c => c.status === 'precedent').length} Precedent
                </Badge>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-legal-600" />
              <span className="ml-2 text-muted-foreground">Searching cases...</span>
            </div>
          )}

          {/* Results */}
          {!isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {searchResults.map((caseData) => (
                <div key={caseData.id} className="animate-fade-in">
                  <CaseCard 
                    caseData={caseData} 
                  />
                </div>
              ))}
            </div>
          )}

          {!isLoading && searchResults.length === 0 && (searchFilters.query || searchFilters.actName || searchFilters.court) && (
            <div className="text-center py-12">
              <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No cases found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or browse all cases.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
