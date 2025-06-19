import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Case {
  id: string;
  title: string;
  court: string;
  date: string;
  jurisdiction: string | null;
  act_name: string | null;
  section: string | null;
  summary: string | null;
  full_text: string | null;
  citations: string[] | null;
  status: 'landmark' | 'recent' | 'precedent';
  file_path: string | null;
  file_name: string | null;
  file_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface SearchFilters {
  query: string;
  actName: string;
  section: string;
  court: string;
  year: string;
  jurisdiction: string;
}

export interface CaseFormData {
  title: string;
  court: string;
  date: string;
  jurisdiction: string;
  actName: string;
  section: string;
  summary: string;
  fullText: string;
  citations: string;
  status: string;
}

export const useCases = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: ['cases', filters],
    queryFn: async () => {
      console.log('Fetching cases with filters:', filters);
      
      let query = supabase
        .from('cases')
        .select('*')
        .order('date', { ascending: false });

      // Apply filters
      if (filters?.query) {
        query = query.or(`title.ilike.%${filters.query}%,summary.ilike.%${filters.query}%,act_name.ilike.%${filters.query}%`);
      }
      
      if (filters?.actName) {
        query = query.ilike('act_name', `%${filters.actName}%`);
      }
      
      if (filters?.section) {
        query = query.ilike('section', `%${filters.section}%`);
      }
      
      if (filters?.court) {
        query = query.ilike('court', `%${filters.court}%`);
      }
      
      if (filters?.year) {
        query = query.gte('date', `${filters.year}-01-01`).lte('date', `${filters.year}-12-31`);
      }
      
      if (filters?.jurisdiction) {
        query = query.eq('jurisdiction', filters.jurisdiction);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching cases:', error);
        throw error;
      }
      
      console.log('Fetched cases:', data);
      return data as Case[];
    },
  });
};

export const useCreateCase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (caseData: CaseFormData) => {
      console.log('Creating case:', caseData);
      
      const citationsArray = caseData.citations
        ? caseData.citations.split(',').map(c => c.trim()).filter(c => c)
        : [];

      const { data, error } = await supabase
        .from('cases')
        .insert([
          {
            title: caseData.title,
            court: caseData.court,
            date: caseData.date,
            jurisdiction: caseData.jurisdiction || null,
            act_name: caseData.actName || null,
            section: caseData.section || null,
            summary: caseData.summary || null,
            full_text: caseData.fullText || null,
            citations: citationsArray.length > 0 ? citationsArray : null,
            status: (caseData.status as 'landmark' | 'recent' | 'precedent') || 'recent'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating case:', error);
        throw error;
      }

      console.log('Created case:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      toast({
        title: "Case uploaded successfully",
        description: "The case has been added to the database and is now searchable.",
      });
    },
    onError: (error) => {
      console.error('Failed to create case:', error);
      toast({
        title: "Failed to upload case",
        description: "There was an error uploading the case. Please try again.",
        variant: "destructive"
      });
    },
  });
};

export const useUpdateCase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, caseData }: { id: string; caseData: CaseFormData }) => {
      console.log('Updating case:', id, caseData);
      
      const citationsArray = caseData.citations
        ? caseData.citations.split(',').map(c => c.trim()).filter(c => c)
        : [];

      const { data, error } = await supabase
        .from('cases')
        .update({
          title: caseData.title,
          court: caseData.court,
          date: caseData.date,
          jurisdiction: caseData.jurisdiction || null,
          act_name: caseData.actName || null,
          section: caseData.section || null,
          summary: caseData.summary || null,
          full_text: caseData.fullText || null,
          citations: citationsArray.length > 0 ? citationsArray : null,
          status: (caseData.status as 'landmark' | 'recent' | 'precedent') || 'recent'
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating case:', error);
        throw error;
      }

      console.log('Updated case:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      toast({
        title: "Case updated successfully",
        description: "The case has been updated in the database.",
      });
    },
    onError: (error) => {
      console.error('Failed to update case:', error);
      toast({
        title: "Failed to update case",
        description: "There was an error updating the case. Please try again.",
        variant: "destructive"
      });
    },
  });
};
