
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy for user_roles - users can view their own roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create function to check admin role
CREATE OR REPLACE FUNCTION public.has_admin_role(uid uuid)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = uid AND role = 'admin'
  );
$$;

-- Enable RLS on cases table
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- Admin-only policies for cases table
CREATE POLICY "Admin can insert cases"
  ON public.cases
  FOR INSERT
  WITH CHECK (public.has_admin_role(auth.uid()));

CREATE POLICY "Admin can update cases"
  ON public.cases
  FOR UPDATE
  USING (public.has_admin_role(auth.uid()))
  WITH CHECK (public.has_admin_role(auth.uid()));

CREATE POLICY "Admin can delete cases"
  ON public.cases
  FOR DELETE
  USING (public.has_admin_role(auth.uid()));

-- Public read access for cases
CREATE POLICY "Anyone can view cases"
  ON public.cases
  FOR SELECT
  USING (true);
