
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import CaseSearch from "@/components/CaseSearch";
import CaseCard from "@/components/CaseCard";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Scale, Users, BookOpen } from "lucide-react";

interface SearchFilters {
  query: string;
  actName: string;
  section: string;
  court: string;
  year: string;
  jurisdiction: string;
}

// Sample case data
const sampleCases = [
  {
    id: "1",
    title: "Maneka Gandhi vs Union of India",
    court: "Supreme Court",
    date: "1978-01-25",
    jurisdiction: "Pan India",
    actName: "Constitution of India",
    section: "Article 21",
    summary: "Landmark case that expanded the interpretation of Article 21 to include procedural due process and the right to travel abroad.",
    citations: ["AIR 1978 SC 597", "(1978) 1 SCC 248"],
    status: "landmark" as const
  },
  {
    id: "2",
    title: "Vishaka vs State of Rajasthan",
    court: "Supreme Court", 
    date: "1997-08-13",
    jurisdiction: "Pan India",
    actName: "Constitution of India",
    section: "Article 14, 19, 21",
    summary: "Established guidelines for prevention of sexual harassment at workplace until specific legislation was enacted.",
    citations: ["AIR 1997 SC 3011", "(1997) 6 SCC 241"],
    status: "landmark" as const
  },
  {
    id: "3",
    title: "K.S. Puttaswamy vs Union of India",
    court: "Supreme Court",
    date: "2017-08-24", 
    jurisdiction: "Pan India",
    actName: "Constitution of India",
    section: "Article 21",
    summary: "Nine-judge bench decision recognizing privacy as a fundamental right under Article 21 of the Constitution.",
    citations: ["(2017) 10 SCC 1", "AIR 2017 SC 4161"],
    status: "landmark" as const
  },
  {
    id: "4",
    title: "State of Kerala vs N.M. Thomas",
    court: "Supreme Court",
    date: "2024-03-15",
    jurisdiction: "Pan India", 
    actName: "Criminal Procedure Code",
    section: "Section 482",
    summary: "Recent interpretation of Section 482 CrPC powers for quashing criminal proceedings in cases of abuse of process.",
    citations: ["2024 SCC OnLine SC 456"],
    status: "recent" as const
  }
];

const Index = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState(sampleCases);
  const [isSearching, setIsSearching] = useState(false);
  const initialQuery = searchParams.get('search') || '';

  const handleSearch = (filters: SearchFilters) => {
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      let filtered = sampleCases;
      
      if (filters.query) {
        filtered = filtered.filter(case_ =>
          case_.title.toLowerCase().includes(filters.query.toLowerCase()) ||
          case_.summary.toLowerCase().includes(filters.query.toLowerCase()) ||
          case_.actName.toLowerCase().includes(filters.query.toLowerCase())
        );
      }
      
      if (filters.actName) {
        filtered = filtered.filter(case_ =>
          case_.actName.toLowerCase().includes(filters.actName.toLowerCase())
        );
      }
      
      if (filters.section) {
        filtered = filtered.filter(case_ =>
          case_.section.toLowerCase().includes(filters.section.toLowerCase())
        );
      }
      
      if (filters.court) {
        filtered = filtered.filter(case_ =>
          case_.court.toLowerCase().includes(filters.court.toLowerCase())
        );
      }
      
      if (filters.year) {
        filtered = filtered.filter(case_ =>
          case_.date.includes(filters.year)
        );
      }
      
      if (filters.jurisdiction) {
        filtered = filtered.filter(case_ =>
          case_.jurisdiction.toLowerCase() === filters.jurisdiction.toLowerCase()
        );
      }
      
      setSearchResults(filtered);
      setIsSearching(false);
    }, 800);
  };

  const handleViewDetails = (caseId: string) => {
    console.log("Viewing case details for:", caseId);
    // Navigate to case details page (to be implemented)
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch({ query: initialQuery, actName: "", section: "", court: "", year: "", jurisdiction: "" });
    }
  }, [initialQuery]);

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
                <span className="font-bold text-lg">10K+</span>
              </div>
              <p className="text-sm text-muted-foreground">Cases</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 border">
              <div className="flex items-center justify-center space-x-2 text-legal-600 mb-2">
                <Scale className="w-5 h-5" />
                <span className="font-bold text-lg">500+</span>
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
                {searchResults.length > 0 ? 'Search Results' : 'Featured Cases'}
              </h2>
              <p className="text-muted-foreground">
                {isSearching ? 'Searching...' : `${searchResults.length} cases found`}
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

          {isSearching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {searchResults.map((caseData) => (
                <div key={caseData.id} className="animate-fade-in">
                  <CaseCard 
                    caseData={caseData} 
                    onViewDetails={handleViewDetails}
                  />
                </div>
              ))}
            </div>
          )}

          {!isSearching && searchResults.length === 0 && (
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
