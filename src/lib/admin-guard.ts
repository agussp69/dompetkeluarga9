import { redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const adminGuard = async () => {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw redirect({ to: "/auth" });
  const { data: r } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", u.user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (!r) throw redirect({ to: "/app" });
};
