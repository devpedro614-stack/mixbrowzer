import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const isPlaceholderKey =
  supabaseUrl.toLowerCase().includes("placeholder") ||
  supabaseAnonKey.toLowerCase().includes("placeholder");

export const isSupabaseConfigured =
  Boolean(supabaseUrl && supabaseAnonKey && !isPlaceholderKey);

if (!isSupabaseConfigured) {
  const message = !supabaseUrl || !supabaseAnonKey
    ? "Supabase URL or Anon Key is missing."
    : "Supabase URL or Anon Key is still a placeholder.";
  console.error(
    `${message} Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file with your Supabase project credentials.`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      musics: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          artist: string;
          genre: string;
          rating: number;
          url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          artist: string;
          genre: string;
          rating: number;
          url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          artist?: string;
          genre?: string;
          rating?: number;
          url?: string | null;
          updated_at?: string;
        };
      };
    };
  };
};
