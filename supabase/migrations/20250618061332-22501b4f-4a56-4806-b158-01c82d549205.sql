
-- Add admin role for the existing user
INSERT INTO public.user_roles (user_id, role) 
VALUES ('5455c0dd-1f38-4c05-b43b-953ca002847b', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
