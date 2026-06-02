import { useState, useEffect, useCallback } from "react";
import type { Music } from "@/types/music";
import { musicsService } from "@/services/musicsService";
import { useAuth } from "./useAuth";

export function useMusics() {
  const { user } = useAuth();
  const [musics, setMusics] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMusics = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const data = await musicsService.getMusics(user.id);
      setMusics((data as Music[]) || []);
    } catch (err) {
      console.error("Error fetching musics:", err);
      setError("Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchMusics();
    } else {
      setMusics([]);
      setLoading(false);
    }
  }, [user, fetchMusics]);

  return { musics, loading, error, refetch: fetchMusics, setMusics };
}
