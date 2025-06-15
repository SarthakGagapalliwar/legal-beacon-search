
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Building, Scale, FileText } from "lucide-react";
import { type Case } from "@/hooks/useCases";

interface CaseCardProps {
  caseData: Case;
  onViewDetails?: (caseId: string) => void;
}

const CaseCard = ({ caseData, onViewDetails }: CaseCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "landmark":
        return "bg-gold-100 text-gold-800 border-gold-200";
      case "recent":
        return "bg-green-100 text-green-800 border-green-200";
      case "precedent":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "landmark":
        return "⭐";
      case "recent":
        return "🆕";
      case "precedent":
        return "📜";
      default:
        return "📄";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="case-card-hover border-l-4 border-l-legal-500 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 line-clamp-2">
              {caseData.title}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {caseData.summary}
            </CardDescription>
          </div>
          <Badge className={`ml-2 ${getStatusColor(caseData.status)}`}>
            {getStatusIcon(caseData.status)} {caseData.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-legal-600" />
            <span className="font-medium text-muted-foreground">Court:</span>
            <span className="text-foreground">{caseData.court}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <CalendarDays className="w-4 h-4 text-legal-600" />
            <span className="font-medium text-muted-foreground">Date:</span>
            <span className="text-foreground">{formatDate(caseData.date)}</span>
          </div>
          
          {caseData.act_name && (
            <div className="flex items-center space-x-2">
              <Scale className="w-4 h-4 text-legal-600" />
              <span className="font-medium text-muted-foreground">Act:</span>
              <span className="text-foreground">{caseData.act_name}</span>
            </div>
          )}
          
          {caseData.section && (
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-legal-600" />
              <span className="font-medium text-muted-foreground">Section:</span>
              <span className="text-foreground">{caseData.section}</span>
            </div>
          )}
        </div>

        {caseData.citations && caseData.citations.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {caseData.citations.map((citation, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {citation}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          {caseData.jurisdiction && (
            <Badge variant="secondary" className="text-xs">
              {caseData.jurisdiction}
            </Badge>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails?.(caseData.id)}
            className="hover:bg-legal-50 hover:border-legal-300"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseCard;
