import { supabase } from "./supabase";

export interface Profile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    website: string | null;
    bio: string | null;
    created_at: string;
    updated_at: string;
}

export const profilesService = {
    async getProfile(userId: string) {
        const { data, error } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url, website, bio, created_at, updated_at")
            .eq("id", userId)
            .maybeSingle();

        if (error) throw error;
        return data as Profile | null;
    },

    async upsertProfile(userId: string, profile: {
        full_name: string;
        avatar_url?: string | null;
        website?: string | null;
        bio?: string | null;
    }) {
        const { data, error } = await supabase
            .from("profiles")
            .insert([
                {
                    id: userId,
                    full_name: profile.full_name,
                    avatar_url: profile.avatar_url ?? null,
                    website: profile.website ?? null,
                    bio: profile.bio ?? null,
                    updated_at: new Date().toISOString(),
                },
            ])
            .onConflict("id")
            .merge()
            .select()
            .single();

        if (error) throw error;
        return data as Profile;
    },
};
