import { useMemo } from "react";
import { BarChart3, Music2, Star, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMusics } from "@/hooks/useMusics";
import { getRatingColor } from "@/utils/formatters";

export function StatsPage() {
  const { musics, loading } = useMusics();

  const stats = useMemo(() => {
    if (!musics.length) return null;

    const genreCount: Record<string, number> = {};
    const artistCount: Record<string, number> = {};
    const ratingDistribution: Record<string, number> = {
      "9-10": 0, "7-8": 0, "5-6": 0, "3-4": 0, "0-2": 0,
    };

    let ratingSum = 0;

    for (const m of musics) {
      genreCount[m.genre] = (genreCount[m.genre] || 0) + 1;
      artistCount[m.artist] = (artistCount[m.artist] || 0) + 1;
      ratingSum += m.rating;

      if (m.rating >= 9) ratingDistribution["9-10"]++;
      else if (m.rating >= 7) ratingDistribution["7-8"]++;
      else if (m.rating >= 5) ratingDistribution["5-6"]++;
      else if (m.rating >= 3) ratingDistribution["3-4"]++;
      else ratingDistribution["0-2"]++;
    }

    const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
    const sortedArtists = Object.entries(artistCount).sort((a, b) => b[1] - a[1]);
    const avgRating = ratingSum / musics.length;

    const bestMusic = [...musics].sort((a, b) => b.rating - a.rating)[0];
    const worstMusic = [...musics].sort((a, b) => a.rating - b.rating)[0];

    return {
      total: musics.length,
      avgRating: Math.round(avgRating * 10) / 10,
      topGenres: sortedGenres.slice(0, 5),
      topArtists: sortedArtists.slice(0, 5),
      ratingDistribution,
      bestMusic,
      worstMusic,
      withLinks: musics.filter(m => m.url).length,
    };
  }, [musics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-16">
        <BarChart3 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-muted-foreground">Sem dados ainda</h2>
        <p className="text-sm text-muted-foreground mt-1">Adicione músicas para ver suas estatísticas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Estatísticas
        </h1>
        <p className="text-muted-foreground mt-1">Insights sobre sua biblioteca musical</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Music2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Músicas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${getRatingColor(stats.avgRating)}`}>{stats.avgRating}</p>
                <p className="text-xs text-muted-foreground">Nota Média</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.topGenres[0]?.[0] || "—"}</p>
                <p className="text-xs text-muted-foreground">Top Gênero</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.withLinks}</p>
                <p className="text-xs text-muted-foreground">Com Link</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Genres */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Gêneros</CardTitle>
            <CardDescription>Distribuição por gênero musical</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.topGenres.map(([genre, count], i) => (
              <div key={genre} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs w-4">#{i + 1}</span>
                    <span className="font-medium">{genre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">{count} música{count !== 1 ? "s" : ""}</span>
                    <Badge variant="secondary" className="text-xs">{Math.round((count / stats.total) * 100)}%</Badge>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all"
                    style={{ width: `${(count / stats.topGenres[0][1]) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Artists */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Artistas</CardTitle>
            <CardDescription>Artistas mais presentes na biblioteca</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.topArtists.map(([artist, count], i) => (
              <div key={artist} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs w-4">#{i + 1}</span>
                    <span className="font-medium truncate max-w-32">{artist}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">{count} música{count !== 1 ? "s" : ""}</span>
                    <Badge variant="outline" className="text-xs">{Math.round((count / stats.total) * 100)}%</Badge>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all"
                    style={{ width: `${(count / stats.topArtists[0][1]) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição de Notas</CardTitle>
            <CardDescription>Como você avalia suas músicas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(stats.ratingDistribution).map(([range, count]) => (
              <div key={range} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">⭐ {range}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">{count} música{count !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      range === "9-10" ? "bg-green-500" :
                      range === "7-8" ? "bg-emerald-400" :
                      range === "5-6" ? "bg-yellow-400" :
                      range === "3-4" ? "bg-orange-400" : "bg-red-400"
                    }`}
                    style={{ width: `${stats.total ? (count / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Highlights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Destaques</CardTitle>
            <CardDescription>Melhores e piores avaliações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.bestMusic && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">🏆 Melhor Avaliada</p>
                <p className="font-semibold text-sm">{stats.bestMusic.name}</p>
                <p className="text-xs text-muted-foreground">{stats.bestMusic.artist}</p>
                <p className={`text-sm font-bold mt-1 ${getRatingColor(stats.bestMusic.rating)}`}>
                  {stats.bestMusic.rating}/10
                </p>
              </div>
            )}
            {stats.worstMusic && stats.bestMusic?.id !== stats.worstMusic?.id && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">📉 Menor Avaliação</p>
                <p className="font-semibold text-sm">{stats.worstMusic.name}</p>
                <p className="text-xs text-muted-foreground">{stats.worstMusic.artist}</p>
                <p className={`text-sm font-bold mt-1 ${getRatingColor(stats.worstMusic.rating)}`}>
                  {stats.worstMusic.rating}/10
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
