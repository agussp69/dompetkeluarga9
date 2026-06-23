import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  active_family_id: string | null;
  timezone: string;
  language: string;
  notif_prefs: { email?: boolean; in_app?: boolean };
};

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<Profile | null> => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", u.user.id)
        .single();
      if (error) throw error;
      return data as Profile;
    },
  });
}

export function useIsAdmin() {
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return false;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      return !!data;
    },
  });
}

export function useMyFamilies() {
  return useQuery({
    queryKey: ["my-families"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("family_members")
        .select("role, family_id, families:family_id(id, name, currency, created_by)")
        .order("joined_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}
