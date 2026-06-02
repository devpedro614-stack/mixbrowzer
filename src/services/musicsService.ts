import { supabase } from "./supabase";
import type { MusicFormData } from "@/types/music";

export const musicsService = {
  async getMusics(userId: string) {
    const { data, error } = await supabase
      .from("musics")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async addMusic(userId: string, formData: MusicFormData) {
    const { data, error } = await supabase
      .from("musics")
      .insert([
        {
          user_id: userId,
          name: formData.name.trim(),
          artist: formData.artist.trim(),
          genre: formData.genre,
          rating: formData.rating,
          url: formData.url?.trim() || null,
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateMusic(id: string, userId: string, formData: MusicFormData) {
    const { data, error } = await supabase
      .from("musics")
      .update({
        name: formData.name.trim(),
        artist: formData.artist.trim(),
        genre: formData.genre,
        rating: formData.rating,
        url: formData.url?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteMusic(id: string, userId: string) {
    const { error } = await supabase
      .from("musics")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (error) throw error;
  },
};
