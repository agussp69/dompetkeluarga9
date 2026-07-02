-- Redefine helper functions to SECURITY DEFINER to bypass RLS and avoid infinite recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_family_member(_user_id uuid, _family_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(SELECT 1 FROM public.family_members WHERE user_id = _user_id AND family_id = _family_id);
$$;

CREATE OR REPLACE FUNCTION public.is_family_owner(_user_id uuid, _family_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(SELECT 1 FROM public.family_members WHERE user_id = _user_id AND family_id = _family_id AND role = 'owner');
$$;


-- Redefine RLS policies on public.user_roles
DROP POLICY IF EXISTS "user_roles self read" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles admin read" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles admin insert" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles admin update" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles admin delete" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles admin manage" ON public.user_roles;

CREATE POLICY "user_roles self read" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "user_roles admin manage" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- Redefine RLS policies on public.family_members
DROP POLICY IF EXISTS "fm read self" ON public.family_members;
DROP POLICY IF EXISTS "fm read group" ON public.family_members;
DROP POLICY IF EXISTS "fm read admin" ON public.family_members;
DROP POLICY IF EXISTS "fm insert self" ON public.family_members;
DROP POLICY IF EXISTS "fm insert owner" ON public.family_members;
DROP POLICY IF EXISTS "fm insert admin" ON public.family_members;
DROP POLICY IF EXISTS "fm update owner" ON public.family_members;
DROP POLICY IF EXISTS "fm update admin" ON public.family_members;
DROP POLICY IF EXISTS "fm delete self" ON public.family_members;
DROP POLICY IF EXISTS "fm delete owner" ON public.family_members;
DROP POLICY IF EXISTS "fm delete admin" ON public.family_members;
DROP POLICY IF EXISTS "fm read" ON public.family_members;
DROP POLICY IF EXISTS "fm insert" ON public.family_members;
DROP POLICY IF EXISTS "fm update" ON public.family_members;
DROP POLICY IF EXISTS "fm delete" ON public.family_members;

CREATE POLICY "fm read" ON public.family_members FOR SELECT TO authenticated
  USING (public.is_family_member(auth.uid(), family_id) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "fm insert" ON public.family_members FOR INSERT TO authenticated
  WITH CHECK (public.is_family_owner(auth.uid(), family_id) OR user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "fm update" ON public.family_members FOR UPDATE TO authenticated
  USING (public.is_family_owner(auth.uid(), family_id) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "fm delete" ON public.family_members FOR DELETE TO authenticated
  USING (public.is_family_owner(auth.uid(), family_id) OR user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
