import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Calendar, Building, Scale, FileText, MapPin, Tag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import { useCases } from "@/hooks/useCases";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: cases = [], isLoading } = useCases();
  
  const caseData = cases.find(c => c.id === id);

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
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadPDF = () => {
    if (!caseData) return;
    
    const content = `
CASE DETAILS
============

Title: ${caseData.title}
Court: ${caseData.court}
Date: ${formatDate(caseData.date)}
${caseData.jurisdiction ? `Jurisdiction: ${caseData.jurisdiction}` : ''}
${caseData.act_name ? `Act: ${caseData.act_name}` : ''}
${caseData.section ? `Section: ${caseData.section}` : ''}
Status: ${caseData.status}

SUMMARY
=======
${caseData.summary || 'No summary available'}

FULL TEXT
=========
${caseData.full_text || 'No full text available'}

${caseData.citations && caseData.citations.length > 0 ? `
CITATIONS
=========
${caseData.citations.join('\n')}
` : ''}

Generated on: ${new Date().toLocaleDateString('en-IN')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${caseData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Download started",
      description: "Case document has been downloaded successfully.",
    });
  };

  const handleDownloadJSON = () => {
    if (!caseData) return;
    
    const jsonData = {
      case_details: {
        id: caseData.id,
        title: caseData.title,
        court: caseData.court,
        date: caseData.date,
        jurisdiction: caseData.jurisdiction,
        act_name: caseData.act_name,
        section: caseData.section,
        status: caseData.status,
        summary: caseData.summary,
        full_text: caseData.full_text,
        citations: caseData.citations,
        created_at: caseData.created_at,
        updated_at: caseData.updated_at
      },
      exported_on: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${caseData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "JSON Export completed",
      description: "Case data has been exported as JSON file.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-legal-600"></div>
            <span className="ml-2 text-muted-foreground">Loading case details...</span>
          </div>
        </main>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Case Not Found</h2>
            <p className="text-muted-foreground mb-4">The case you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/browse')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Browse
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header with Back Button and Download Options */}
          <div className="flex items-center justify-between">
            <Button 
              onClick={() => navigate('/browse')} 
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Browse</span>
            </Button>
            
            <div className="flex items-center space-x-3">
              {/* View Full Text Dialog */}
              {caseData.full_text && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>View Full Text</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl">{caseData.title}</DialogTitle>
                      <DialogDescription>
                        Complete case text - {caseData.court} | {formatDate(caseData.date)}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <div className="bg-slate-50 rounded-lg p-6 border max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-mono">
                          {caseData.full_text}
                        </pre>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Download Options */}
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={handleDownloadPDF}
                  className="bg-legal-600 hover:bg-legal-700 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download TXT</span>
                </Button>
                
                <Button 
                  onClick={handleDownloadJSON}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export JSON</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Case Title and Status */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-3">{caseData.title}</CardTitle>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-legal-600" />
                      <span>{caseData.court}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-legal-600" />
                      <span>{formatDate(caseData.date)}</span>
                    </div>
                    {caseData.jurisdiction && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-legal-600" />
                        <span>{caseData.jurisdiction}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Badge className={`${getStatusColor(caseData.status)} text-sm`}>
                  {getStatusIcon(caseData.status)} {caseData.status}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Legal Details */}
          {(caseData.act_name || caseData.section) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Scale className="w-5 h-5 text-legal-600" />
                  <span>Legal References</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {caseData.act_name && (
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-muted-foreground min-w-[80px]">Act:</span>
                    <span className="text-foreground">{caseData.act_name}</span>
                  </div>
                )}
                {caseData.section && (
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-muted-foreground min-w-[80px]">Section:</span>
                    <span className="text-foreground">{caseData.section}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Case Summary */}
          {caseData.summary && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Case Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{caseData.summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Citations */}
          {caseData.citations && caseData.citations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Tag className="w-5 h-5 text-legal-600" />
                  <span>Citations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {caseData.citations.map((citation, index) => (
                    <Badge key={index} variant="outline" className="text-sm py-1 px-3">
                      {citation}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Full Text Preview */}
          {caseData.full_text && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-legal-600" />
                  <span>Full Case Text</span>
                </CardTitle>
                <CardDescription>
                  Preview of the complete case text (click "View Full Text" above to see the complete document)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 rounded-lg p-6 border">
                  <div className="max-h-40 overflow-hidden relative">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-mono">
                      {caseData.full_text.substring(0, 500)}
                      {caseData.full_text.length > 500 && '...'}
                    </pre>
                    {caseData.full_text.length > 500 && (
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-50 to-transparent"></div>
                    )}
                  </div>
                  {caseData.full_text.length > 500 && (
                    <div className="mt-3 text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" className="text-legal-600">
                            Click to view complete text
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl">{caseData.title}</DialogTitle>
                            <DialogDescription>
                              Complete case text - {caseData.court} | {formatDate(caseData.date)}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4">
                            <div className="bg-slate-50 rounded-lg p-6 border max-h-96 overflow-y-auto">
                              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-mono">
                                {caseData.full_text}
                              </pre>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Case Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Case Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Added on:</span>
                  <span className="text-foreground">{formatDate(caseData.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Last updated:</span>
                  <span className="text-foreground">{formatDate(caseData.updated_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Case ID:</span>
                  <span className="text-foreground font-mono text-xs">{caseData.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CaseDetail;
