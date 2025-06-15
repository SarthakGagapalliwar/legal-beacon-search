
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SearchFilters {
  query: string;
  actName: string;
  section: string;
  court: string;
  year: string;
  jurisdiction: string;
}

interface CaseSearchProps {
  onSearch: (filters: SearchFilters) => void;
  initialQuery?: string;
}

const CaseSearch = ({ onSearch, initialQuery = "" }: CaseSearchProps) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialQuery,
    actName: "",
    section: "",
    court: "",
    year: "",
    jurisdiction: "",
  });

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      query: "",
      actName: "",
      section: "",
      court: "",
      year: "",
      jurisdiction: "",
    });
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-legal-600" />
          <span>Search Case Law</span>
        </CardTitle>
        <CardDescription>
          Find legal cases by keywords, act names, sections, and more
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="main-search">Search Terms</Label>
          <div className="relative">
            <Input
              id="main-search"
              placeholder="Enter keywords, case names, or legal terms..."
              value={filters.query}
              onChange={(e) => handleInputChange("query", e.target.value)}
              className="pr-12"
            />
            <Button
              onClick={handleSearch}
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-legal-600 hover:bg-legal-700"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Search Options
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="act-name">Act Name</Label>
                <Input
                  id="act-name"
                  placeholder="e.g., Criminal Procedure Code"
                  value={filters.actName}
                  onChange={(e) => handleInputChange("actName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  placeholder="e.g., Section 482"
                  value={filters.section}
                  onChange={(e) => handleInputChange("section", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="court">Court</Label>
                <Select value={filters.court} onValueChange={(value) => handleInputChange("court", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select court" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supreme-court">Supreme Court</SelectItem>
                    <SelectItem value="high-court">High Court</SelectItem>
                    <SelectItem value="district-court">District Court</SelectItem>
                    <SelectItem value="sessions-court">Sessions Court</SelectItem>
                    <SelectItem value="magistrate-court">Magistrate Court</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  placeholder="e.g., 2024"
                  type="number"
                  value={filters.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jurisdiction">Jurisdiction</Label>
                <Select value={filters.jurisdiction} onValueChange={(value) => handleInputChange("jurisdiction", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pan-india">Pan India</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="kolkata">Kolkata</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={handleSearch}
                className="bg-legal-600 hover:bg-legal-700"
              >
                Search Cases
              </Button>
              <Button 
                onClick={handleReset}
                variant="outline"
              >
                Reset Filters
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default CaseSearch;
