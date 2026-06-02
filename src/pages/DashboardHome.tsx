import { useMemo } from "react";
import { Music2, TrendingUp, Star, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useMusics } from "@/hooks/useMusics";
import { AddMusicModal } from "@/components/dashboard/AddMusicModal";
import { useToast } from "@/components/ui/toast";
import { MESSAGES } from "@/utils/constants";
import { getRatingColor, getRatingEmoji, formatDate } from "@/utils/formatters";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function DashboardHome() {
  const { user } = useAuth();
  const { musics, loading, refetch } = useMusics();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [addOpen, setAddOpen] = useState(false);

  const displayName = user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuário";

  const stats = useMemo(() => {
    if (!musics.length) return { total: 0, topGenre: "—", topArtist: "—", avgRating: 0 };

    // Top genre
    const genreCount: Record<string, number> = {};
    const artistCount: Record<string, number> = {};
    let ratingSum = 0;

    for (const m of musics) {
      genreCount[m.genre] = (genreCount[m.genre] || 0) + 1;
      artistCount[m.artist] = (artistCount[m.artist] || 0) + 1;
      ratingSum += m.rating;
    }

    const topGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
    const topArtist = Object.entries(artistCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
    const avgRating = ratingSum / musics.length;

    return { total: musics.length, topGenre, topArtist, avgRating: Math.round(avgRating * 10) / 10 };
  }, [musics]);

  const recentMusics = useMemo(() => {
    return [...musics].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
  }, [musics]);

  const handleAddSuccess = () => {
    showToast(MESSAGES.success.musicAdded, "success");
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 sm:p-8">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">
            Bem-vindo, {displayName}! 👋
          </h1>
          <p className="text-purple-100 mb-4">
            {musics.length === 0
              ? "Comece adicionando suas músicas favoritas"
              : `Você tem ${musics.length} música${musics.length !== 1 ? "s" : ""} na sua biblioteca`}
          </p>
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-white text-purple-700 hover:bg-purple-50 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Nova Música
          </Button>
        </div>
        {/* Decorative elements */}
        <div className="absolute right-4 top-4 opacity-10">
          <Music2 className="w-32 h-32" />
        </div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/10" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Music2 className="w-4 h-4" />
              Total de Músicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {loading ? <span className="animate-pulse">—</span> : stats.total}
            </div>
            <p className="text-xs text-muted-foreground mt-1">na sua biblioteca</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Gênero Top
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">
              {loading ? <span className="animate-pulse">—</span> : stats.topGenre}
            </div>
            <p className="text-xs text-muted-foreground mt-1">mais frequente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Artista Top
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">
              {loading ? <span className="animate-pulse">—</span> : stats.topArtist}
            </div>
            <p className="text-xs text-muted-foreground mt-1">mais frequente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              Nota Média
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${musics.length ? getRatingColor(stats.avgRating) : ""}`}>
              {loading ? <span className="animate-pulse">—</span> : musics.length ? `${stats.avgRating}` : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">de 10 pontos</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Musics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Músicas Recentes
            </CardTitle>
            <CardDescription>Últimas 5 músicas adicionadas</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/musics")}>
            Ver todas
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentMusics.length === 0 ? (
            <div className="text-center py-8">
              <Music2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Nenhuma música adicionada ainda.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setAddOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar primeira música
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {recentMusics.map(music => (
                <div key={music.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary shrink-0">
                    <Music2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{music.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{music.artist}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant="secondary" className="hidden sm:flex text-xs">{music.genre}</Badge>
                    <span className={`font-semibold text-sm ${getRatingColor(music.rating)}`}>
                      {getRatingEmoji(music.rating)} {music.rating}
                    </span>
                    <span className="text-xs text-muted-foreground hidden md:block">{formatDate(music.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddMusicModal open={addOpen} onClose={() => setAddOpen(false)} onSuccess={handleAddSuccess} />
    </div>
  );
}
