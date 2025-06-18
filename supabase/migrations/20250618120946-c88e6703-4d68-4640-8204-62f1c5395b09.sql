
-- Create storage bucket for case documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('case-documents', 'case-documents', true);

-- Create storage policies for case documents
CREATE POLICY "Anyone can view case documents" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'case-documents');

CREATE POLICY "Authenticated users can upload case documents" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'case-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update case documents" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'case-documents' AND auth.role() = 'authenticated');

-- Add columns to cases table to store file information
ALTER TABLE public.cases 
ADD COLUMN file_path TEXT,
ADD COLUMN file_name TEXT,
ADD COLUMN file_type TEXT;
