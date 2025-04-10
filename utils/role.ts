import { createClient } from "@/utils/supabase/server";

export async function getUserRole() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) return null;

  return data.user.app_metadata?.role ?? "user";
}

export async function requireRole(roles: string[]) {
  const role = await getUserRole();
  if (!role || !roles.includes(role)) {
    throw new Error("Unauthorized");
  }
}
