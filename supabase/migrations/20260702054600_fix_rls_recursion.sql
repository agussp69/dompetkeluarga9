-- Fix infinite recursion in public.user_roles RLS policies
DROP POLICY IF EXISTS "user_roles self read" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles admin manage" ON public.user_roles;

CREATE POLICY "user_roles self read" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "user_roles admin read" ON public.user_roles FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "user_roles admin insert" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "user_roles admin update" ON public.user_roles FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "user_roles admin delete" ON public.user_roles FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));


-- Fix infinite recursion in public.family_members RLS policies
DROP POLICY IF EXISTS "fm read" ON public.family_members;
DROP POLICY IF EXISTS "fm insert" ON public.family_members;
DROP POLICY IF EXISTS "fm update" ON public.family_members;
DROP POLICY IF EXISTS "fm delete" ON public.family_members;

-- SELECT policies
CREATE POLICY "fm read self" ON public.family_members FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "fm read group" ON public.family_members FOR SELECT TO authenticated
  USING (family_id IN (SELECT fm.family_id FROM public.family_members fm WHERE fm.user_id = auth.uid()));

CREATE POLICY "fm read admin" ON public.family_members FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- INSERT policies
CREATE POLICY "fm insert self" ON public.family_members FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "fm insert owner" ON public.family_members FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.family_members WHERE user_id = auth.uid() AND family_id = family_id AND role = 'owner'));

CREATE POLICY "fm insert admin" ON public.family_members FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- UPDATE policies
CREATE POLICY "fm update owner" ON public.family_members FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.family_members WHERE user_id = auth.uid() AND family_id = family_id AND role = 'owner'));

CREATE POLICY "fm update admin" ON public.family_members FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- DELETE policies
CREATE POLICY "fm delete self" ON public.family_members FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "fm delete owner" ON public.family_members FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.family_members WHERE user_id = auth.uid() AND family_id = family_id AND role = 'owner'));

CREATE POLICY "fm delete admin" ON public.family_members FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
