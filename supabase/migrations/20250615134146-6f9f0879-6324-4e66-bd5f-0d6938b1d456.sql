
-- Create a table for legal cases
CREATE TABLE public.cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  court TEXT NOT NULL,
  date DATE NOT NULL,
  jurisdiction TEXT,
  act_name TEXT,
  section TEXT,
  summary TEXT,
  full_text TEXT,
  citations TEXT[], -- Array of citation strings
  status TEXT CHECK (status IN ('landmark', 'recent', 'precedent')) DEFAULT 'recent',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create an index for faster searching
CREATE INDEX idx_cases_title ON public.cases USING gin(to_tsvector('english', title));
CREATE INDEX idx_cases_summary ON public.cases USING gin(to_tsvector('english', summary));
CREATE INDEX idx_cases_act_name ON public.cases (act_name);
CREATE INDEX idx_cases_court ON public.cases (court);
CREATE INDEX idx_cases_status ON public.cases (status);
CREATE INDEX idx_cases_date ON public.cases (date DESC);

-- Insert some sample data
INSERT INTO public.cases (title, court, date, jurisdiction, act_name, section, summary, citations, status) VALUES
('Maneka Gandhi vs Union of India', 'Supreme Court', '1978-01-25', 'Pan India', 'Constitution of India', 'Article 21', 'Landmark case that expanded the interpretation of Article 21 to include procedural due process and the right to travel abroad.', ARRAY['AIR 1978 SC 597', '(1978) 1 SCC 248'], 'landmark'),
('Vishaka vs State of Rajasthan', 'Supreme Court', '1997-08-13', 'Pan India', 'Constitution of India', 'Article 14, 19, 21', 'Established guidelines for prevention of sexual harassment at workplace until specific legislation was enacted.', ARRAY['AIR 1997 SC 3011', '(1997) 6 SCC 241'], 'landmark'),
('K.S. Puttaswamy vs Union of India', 'Supreme Court', '2017-08-24', 'Pan India', 'Constitution of India', 'Article 21', 'Nine-judge bench decision recognizing privacy as a fundamental right under Article 21 of the Constitution.', ARRAY['(2017) 10 SCC 1', 'AIR 2017 SC 4161'], 'landmark'),
('State of Kerala vs N.M. Thomas', 'Supreme Court', '2024-03-15', 'Pan India', 'Criminal Procedure Code', 'Section 482', 'Recent interpretation of Section 482 CrPC powers for quashing criminal proceedings in cases of abuse of process.', ARRAY['2024 SCC OnLine SC 456'], 'recent'),
('Mohd. Ahmed Khan vs Shah Bano Begum', 'Supreme Court', '1985-04-23', 'Pan India', 'Criminal Procedure Code', 'Section 125', 'Important precedent on maintenance rights under Section 125 CrPC that influenced subsequent family law decisions.', ARRAY['AIR 1985 SC 945', '(1985) 2 SCC 556'], 'precedent'),
('Indra Sawhney vs Union of India', 'Supreme Court', '1992-11-16', 'Pan India', 'Constitution of India', 'Article 16', 'Mandal Commission case that upheld reservations for OBCs with the 50% ceiling and creamy layer exclusion.', ARRAY['AIR 1993 SC 477', '(1992) Supp (3) SCC 217'], 'landmark');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON public.cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
