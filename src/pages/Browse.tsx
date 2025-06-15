
import { useState } from "react";
import Header from "@/components/Header";
import CaseCard from "@/components/CaseCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, Grid, List } from "lucide-react";

// Extended sample data for browsing
const allCases = [
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
  },
  {
    id: "5",
    title: "Mohd. Ahmed Khan vs Shah Bano Begum",
    court: "Supreme Court",
    date: "1985-04-23",
    jurisdiction: "Pan India",
    actName: "Criminal Procedure Code",
    section: "Section 125",
    summary: "Controversial case dealing with maintenance rights of Muslim women and uniform civil code.",
    citations: ["AIR 1985 SC 945", "(1985) 2 SCC 556"],
    status: "precedent" as const
  },
  {
    id: "6",
    title: "Indra Sawhney vs Union of India",
    court: "Supreme Court",
    date: "1992-11-16",
    jurisdiction: "Pan India",
    actName: "Constitution of India",
    section: "Article 16",
    summary: "Mandal Commission case that upheld reservations for OBCs with the 50% ceiling and creamy layer exclusion.",
    citations: ["AIR 1993 SC 477", "(1992) Supp (3) SCC 217"],
    status: "landmark" as const
  }
];

const Browse = () => {
  const [filteredCases, setFilteredCases] = useState(allCases);
  const [sortBy, setSortBy] = useState("date-desc");
  const [filterBy, setFilterBy] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleSort = (value: string) => {
    setSortBy(value);
    let sorted = [...filteredCases];
    
    switch (value) {
      case "date-desc":
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "date-asc":
        sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "court":
        sorted.sort((a, b) => a.court.localeCompare(b.court));
        break;
    }
    
    setFilteredCases(sorted);
  };

  const handleFilter = (value: string) => {
    setFilterBy(value);
    let filtered = allCases;
    
    if (value !== "all") {
      filtered = allCases.filter(case_ => case_.status === value);
    }
    
    setFilteredCases(filtered);
  };

  const handleViewDetails = (caseId: string) => {
    console.log("Viewing case details for:", caseId);
  };

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
                <Select value={filterBy} onValueChange={handleFilter}>
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
                <Select value={sortBy} onValueChange={handleSort}>
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
                {filteredCases.length} cases
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

          {/* Cases Grid/List */}
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

          {filteredCases.length === 0 && (
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
