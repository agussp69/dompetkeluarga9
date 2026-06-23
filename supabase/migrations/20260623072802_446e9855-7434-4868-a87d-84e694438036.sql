
-- Fix savings_contributions: split ALL into INSERT/UPDATE/DELETE with owner restriction
DROP POLICY IF EXISTS "sc write" ON public.savings_contributions;

CREATE POLICY "sc insert" ON public.savings_contributions
FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (SELECT 1 FROM public.savings_goals g
    WHERE g.id = goal_id AND public.is_family_member(auth.uid(), g.family_id))
);

CREATE POLICY "sc update own" ON public.savings_contributions
FOR UPDATE TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "sc delete own or owner" ON public.savings_contributions
FOR DELETE TO authenticated
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
  OR EXISTS (SELECT 1 FROM public.savings_goals g
    WHERE g.id = goal_id AND public.is_family_owner(auth.uid(), g.family_id))
);

-- Fix family_members: prevent self-insert into arbitrary family without invitation
DROP POLICY IF EXISTS "fm insert" ON public.family_members;

CREATE POLICY "fm insert" ON public.family_members
FOR INSERT TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
  OR public.is_family_owner(auth.uid(), family_id)
  OR (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.invitations i
      WHERE i.family_id = family_members.family_id
        AND i.status = 'pending'
        AND lower(i.email) = lower((SELECT email FROM public.profiles WHERE id = auth.uid()))
    )
  )
);

-- Receipts: add UPDATE policy
CREATE POLICY "receipts update own family" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'receipts'
  AND (storage.foldername(name))[1] IN (
    SELECT family_id::text FROM public.family_members WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  bucket_id = 'receipts'
  AND (storage.foldername(name))[1] IN (
    SELECT family_id::text FROM public.family_members WHERE user_id = auth.uid()
  )
);

-- Lock down SECURITY DEFINER functions: revoke EXECUTE from public/anon/authenticated;
-- helpers are called via other security-definer functions/policies which run as definer owner.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_family_member(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_family_owner(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.audit_txn() FROM PUBLIC, anon, authenticated;

-- Re-grant EXECUTE to authenticated for helpers used directly in client RLS-evaluated checks
-- (RLS policies evaluate with the calling role's privileges for function calls inside USING).
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_family_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_family_owner(uuid, uuid) TO authenticated;

-- Fix mutable search_path on touch_updated_at
ALTER FUNCTION public.touch_updated_at() SET search_path = public;
