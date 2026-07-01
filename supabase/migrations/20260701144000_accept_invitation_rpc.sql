-- Create RPC accept_invitation to join a family via invitation token
CREATE OR REPLACE FUNCTION public.accept_invitation(p_token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_invitation record;
  v_user_email text;
  v_user_id uuid;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get email of current user from profiles, fall back to auth.users
  v_user_email := COALESCE(
    (SELECT email FROM public.profiles WHERE id = v_user_id),
    (SELECT email FROM auth.users WHERE id = v_user_id)
  );

  IF v_user_email IS NULL THEN
    RAISE EXCEPTION 'User email not found';
  END IF;

  -- Look up the pending invitation by token and email (case-insensitive email match)
  SELECT * INTO v_invitation
  FROM public.invitations
  WHERE token = p_token
    AND status = 'pending'
    AND expires_at > now()
    AND lower(email) = lower(v_user_email);

  -- If no matching pending invitation exists, return false
  IF v_invitation IS NULL THEN
    RETURN false;
  END IF;

  -- Insert the user into the family_members table
  -- Ignore if they are already a member (ON CONFLICT)
  INSERT INTO public.family_members (family_id, user_id, role)
  VALUES (v_invitation.family_id, v_user_id, v_invitation.role)
  ON CONFLICT (family_id, user_id) DO NOTHING;

  -- Update the invitation status to accepted
  UPDATE public.invitations
  SET status = 'accepted'
  WHERE id = v_invitation.id;

  -- Automatically set this family as the active family for the profile
  UPDATE public.profiles
  SET active_family_id = v_invitation.family_id
  WHERE id = v_user_id;

  RETURN true;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.accept_invitation(text) TO authenticated;
