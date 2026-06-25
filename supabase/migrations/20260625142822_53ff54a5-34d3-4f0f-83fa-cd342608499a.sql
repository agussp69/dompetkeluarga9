-- Switch helper predicates from SECURITY DEFINER to SECURITY INVOKER so they
-- no longer trigger the "signed-in users can execute SECURITY DEFINER function" linter.
-- These functions only read user_roles / family_members; RLS on those tables already
-- allows authenticated users to see their own membership/role rows.

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $$
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_family_member(_user_id uuid, _family_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $$
  SELECT EXISTS(SELECT 1 FROM public.family_members WHERE user_id = _user_id AND family_id = _family_id)
$$;

CREATE OR REPLACE FUNCTION public.is_family_owner(_user_id uuid, _family_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $$
  SELECT EXISTS(SELECT 1 FROM public.family_members WHERE user_id = _user_id AND family_id = _family_id AND role = 'owner')
$$;
