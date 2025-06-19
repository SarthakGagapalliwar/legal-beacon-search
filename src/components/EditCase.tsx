
import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateCase, type Case, type CaseFormData } from "@/hooks/useCases";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EditCaseProps {
  caseData: Case;
}

const EditCase = ({ caseData }: EditCaseProps) => {
  const { isAdmin } = useAuth();
  const updateCaseMutation = useUpdateCase();
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState<CaseFormData>({
    title: "",
    court: "",
    date: "",
    jurisdiction: "",
    actName: "",
    section: "",
    summary: "",
    fullText: "",
    citations: "",
    status: ""
  });

  useEffect(() => {
    if (caseData) {
      setFormData({
        title: caseData.title,
        court: caseData.court,
        date: caseData.date,
        jurisdiction: caseData.jurisdiction || "",
        actName: caseData.act_name || "",
        section: caseData.section || "",
        summary: caseData.summary || "",
        fullText: caseData.full_text || "",
        citations: caseData.citations ? caseData.citations.join(', ') : "",
        status: caseData.status
      });
    }
  }, [caseData]);

  // Don't render if user is not admin
  if (!isAdmin) {
    return null;
  }

  const handleInputChange = (field: keyof CaseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.court || !formData.date) {
      return;
    }

    try {
      await updateCaseMutation.mutateAsync({ id: caseData.id, caseData: formData });
      setOpen(false);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Edit className="w-4 h-4" />
          <span>Edit Case</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit className="w-5 h-5 text-legal-600" />
            <span>Edit Case (Admin Only)</span>
          </DialogTitle>
          <DialogDescription>
            Update case information. This action is only available to administrators.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Case Title *</Label>
              <Input
                id="title"
                placeholder="Enter case title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="court">Court *</Label>
              <Select value={formData.court} onValueChange={(value) => handleInputChange("court", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select court" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Supreme Court">Supreme Court</SelectItem>
                  <SelectItem value="High Court">High Court</SelectItem>
                  <SelectItem value="District Court">District Court</SelectItem>
                  <SelectItem value="Sessions Court">Sessions Court</SelectItem>
                  <SelectItem value="Magistrate Court">Magistrate Court</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jurisdiction">Jurisdiction</Label>
              <Select value={formData.jurisdiction} onValueChange={(value) => handleInputChange("jurisdiction", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pan India">Pan India</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                  <SelectItem value="Kolkata">Kolkata</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="act-name">Act Name</Label>
              <Input
                id="act-name"
                placeholder="e.g., Criminal Procedure Code"
                value={formData.actName}
                onChange={(e) => handleInputChange("actName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                placeholder="e.g., Section 482"
                value={formData.section}
                onChange={(e) => handleInputChange("section", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="citations">Citations</Label>
            <Input
              id="citations"
              placeholder="Enter citations separated by commas"
              value={formData.citations}
              onChange={(e) => handleInputChange("citations", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Case Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select case status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="landmark">Landmark Case</SelectItem>
                <SelectItem value="recent">Recent Case</SelectItem>
                <SelectItem value="precedent">Precedent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Case Summary</Label>
            <Textarea
              id="summary"
              placeholder="Enter a brief summary of the case"
              value={formData.summary}
              onChange={(e) => handleInputChange("summary", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="full-text">Full Case Text</Label>
            <Textarea
              id="full-text"
              placeholder="Enter the full case text"
              value={formData.fullText}
              onChange={(e) => handleInputChange("fullText", e.target.value)}
              rows={8}
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <Button 
              type="submit"
              className="bg-legal-600 hover:bg-legal-700"
              disabled={updateCaseMutation.isPending}
            >
              {updateCaseMutation.isPending ? "Updating..." : "Update Case"}
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCase;
