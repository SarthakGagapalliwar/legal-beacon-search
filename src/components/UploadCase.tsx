
import { useState } from "react";
import { Upload, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCreateCase, type CaseFormData } from "@/hooks/useCases";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const UploadCase = () => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const createCaseMutation = useCreateCase();
  
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

  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You need admin privileges to upload cases.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleInputChange = (field: keyof CaseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.type === "application/pdf" || file.type === "text/plain") {
      setIsUploading(true);
      setUploadedFile(file);
      
      try {
        // Extract text content for display
        if (file.type === "text/plain") {
          const text = await file.text();
          setFormData(prev => ({
            ...prev,
            fullText: text
          }));
        } else {
          // For PDF files, we'll just note that it's been uploaded
          setFormData(prev => ({
            ...prev,
            fullText: `[PDF Document uploaded: ${file.name}]\n\nThe PDF content will be available for viewing after the case is saved.`
          }));
        }

        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been processed and is ready to be saved with the case.`,
        });
      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          title: "Error processing file",
          description: "There was an error processing the uploaded file.",
          variant: "destructive"
        });
      } finally {
        setIsUploading(false);
      }
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or text file.",
        variant: "destructive"
      });
    }
  };

  const uploadFileToStorage = async (file: File, caseId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${caseId}-${Date.now()}.${fileExt}`;
    const filePath = `${caseId}/${fileName}`;

    const { error } = await supabase.storage
      .from('case-documents')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    return { filePath, fileName };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.court || !formData.date) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create the case first to get the ID
      const newCase = await createCaseMutation.mutateAsync(formData);
      
      // If there's an uploaded file, upload it to storage and update the case
      if (uploadedFile && newCase) {
        try {
          const { filePath, fileName } = await uploadFileToStorage(uploadedFile, newCase.id);
          
          // Update the case with file information
          const { error: updateError } = await supabase
            .from('cases')
            .update({
              file_path: filePath,
              file_name: fileName,
              file_type: uploadedFile.type
            })
            .eq('id', newCase.id);

          if (updateError) {
            console.error('Error updating case with file info:', updateError);
            toast({
              title: "Warning",
              description: "Case created but file upload failed. You can try uploading the file again.",
              variant: "destructive"
            });
          }
        } catch (fileError) {
          console.error('Error uploading file:', fileError);
          toast({
            title: "Warning", 
            description: "Case created but file upload failed. You can try uploading the file again.",
            variant: "destructive"
          });
        }
      }
      
      // Reset form on success
      setFormData({
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
      setUploadedFile(null);
      
    } catch (error) {
      // Error is handled by the mutation
      console.error('Submit error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-legal-600" />
            <span>Upload New Case (Admin Only)</span>
          </CardTitle>
          <CardDescription>
            Add a new legal case to the database. Upload PDF or text files for easy access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Area */}
            <div className="space-y-2">
              <Label>Case Document (Optional)</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? "border-legal-500 bg-legal-50" 
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700">
                  Drop your case document here
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to browse (PDF, TXT files supported)
                </p>
                {uploadedFile && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✓ {uploadedFile.name} ready to upload
                    </p>
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  disabled={isUploading}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Processing..." : "Choose File"}
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.txt"
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                />
              </div>
            </div>

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
                placeholder="Enter the full case text or it will be extracted from uploaded document"
                value={formData.fullText}
                onChange={(e) => handleInputChange("fullText", e.target.value)}
                rows={8}
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <Button 
                type="submit"
                className="bg-legal-600 hover:bg-legal-700"
                disabled={createCaseMutation.isPending}
              >
                {createCaseMutation.isPending ? "Uploading..." : "Upload Case"}
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
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
                  setUploadedFile(null);
                }}
              >
                Reset Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadCase;
