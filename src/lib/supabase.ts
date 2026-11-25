import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Read-only client against the Ruang Iman app's Supabase project.
 *
 * This site never writes and never authenticates anyone — the anon key plus the
 * app's existing "Public can read published posts" RLS policy is all it needs.
 * Session persistence is off so nothing leaks into browser storage.
 *
 * Returns `null` when the env vars are missing so the blog can render a calm
 * empty state locally instead of crashing the whole build.
 */
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const isSupabaseConfigured = Boolean(url && anonKey);
