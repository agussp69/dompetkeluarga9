
CREATE POLICY "receipts read own family" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'receipts' AND (storage.foldername(name))[1] IN (
  SELECT family_id::text FROM public.family_members WHERE user_id = auth.uid()
));
CREATE POLICY "receipts insert own family" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'receipts' AND (storage.foldername(name))[1] IN (
  SELECT family_id::text FROM public.family_members WHERE user_id = auth.uid()
));
CREATE POLICY "receipts delete own family" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'receipts' AND (storage.foldername(name))[1] IN (
  SELECT family_id::text FROM public.family_members WHERE user_id = auth.uid()
));

CREATE POLICY "avatars read all" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'avatars');
CREATE POLICY "avatars manage own" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
