-- Create storage buckets for avatars and content
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true),
       ('content', 'content', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to avatars bucket (SELECT for everyone)
CREATE POLICY "Public avatars access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow service_role and authenticated users to upload to avatars
CREATE POLICY "Authenticated upload to avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.role() IN ('authenticated', 'service_role'));

-- Allow public access to content bucket (SELECT for everyone)
CREATE POLICY "Public content access"
ON storage.objects FOR SELECT
USING (bucket_id = 'content');

-- Allow authenticated upload to content
CREATE POLICY "Authenticated upload to content"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'content' AND auth.role() IN ('authenticated', 'service_role'));
