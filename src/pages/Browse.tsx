
import { useState } from "react";
import Header from "@/components/Header";
import CaseCard from "@/components/CaseCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, Grid, List, Loader2 } from "lucide-react";
import { useCases, type SearchFilters } from "@/hooks/useCases";

const Browse = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    actName: "",
    section: "",
    court: "",
    year: "",
    jurisdiction: ""
  });
  
  const [sortBy, setSortBy] = useState("date-desc");
  const [filterBy, setFilterBy] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: allCases = [], isLoading, error } = useCases();

  const filteredCases = allCases.filter(case_ => {
    if (filterBy === "all") return true;
    return case_.status === filterBy;
  }).sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "title":
        return a.title.localeCompare(b.title);
      case "court":
        return a.court.localeCompare(b.court);
      default:
        return 0;
    }
  });

  const handleViewDetails = (caseId: string) => {
    console.log("Viewing case details for:", caseId);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Filter className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">Error loading cases</h3>
            <p className="text-muted-foreground">There was an error loading the cases. Please try again later.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-slate-800">Browse Case Law</h1>
            <p className="text-muted-foreground">
              Explore our comprehensive database of legal cases organized by various categories
            </p>
          </div>

          {/* Filters and Controls */}
          <div className="bg-white/80 backdrop-blur rounded-lg p-4 border space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
            <div className="flex flex-wrap items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-legal-600" />
                <span className="text-sm font-medium">Filter by:</span>
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cases</SelectItem>
                    <SelectItem value="landmark">Landmark Cases</SelectItem>
                    <SelectItem value="recent">Recent Cases</SelectItem>
                    <SelectItem value="precedent">Precedents</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="court">Court</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {isLoading ? "Loading..." : `${filteredCases.length} cases`}
              </span>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Category Stats */}
          {!isLoading && allCases.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-gold-50 border-gold-200">
                {allCases.filter(c => c.status === 'landmark').length} Landmark Cases
              </Badge>
              <Badge variant="outline" className="bg-green-50 border-green-200">
                {allCases.filter(c => c.status === 'recent').length} Recent Cases
              </Badge>
              <Badge variant="outline" className="bg-blue-50 border-blue-200">
                {allCases.filter(c => c.status === 'precedent').length} Precedents
              </Badge>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-legal-600" />
              <span className="ml-2 text-muted-foreground">Loading cases...</span>
            </div>
          )}

          {/* Cases Grid/List */}
          {!isLoading && (
            <div className={`
              ${viewMode === "grid" 
                ? "grid grid-cols-1 lg:grid-cols-2 gap-6" 
                : "space-y-4"
              }
            `}>
              {filteredCases.map((caseData) => (
                <div key={caseData.id} className="animate-fade-in">
                  <CaseCard 
                    caseData={caseData} 
                    onViewDetails={handleViewDetails}
                  />
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredCases.length === 0 && allCases.length > 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No cases found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Browse;
