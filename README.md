# mixbrowzer

## Supabase setup

This app expects a `public.musics` table in your Supabase project.

To create it, run the SQL in `supabase/create_musics_table.sql` in the Supabase SQL editor.

Make sure your `.env.local` contains the correct Supabase credentials:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
