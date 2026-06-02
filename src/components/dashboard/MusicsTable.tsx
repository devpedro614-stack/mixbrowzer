import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, ExternalLink, Search, Filter, X, Music2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddMusicModal } from "./AddMusicModal";
import { EditMusicModal } from "./EditMusicModal";
import { DeleteMusicDialog } from "./DeleteMusicDialog";
import { useToast } from "@/components/ui/toast";
import { MUSIC_GENRES, ITEMS_PER_PAGE, MESSAGES } from "@/utils/constants";
import { getRatingColor, getRatingEmoji, formatDate, truncateText } from "@/utils/formatters";
import type { Music } from "@/types/music";

interface MusicsTableProps {
  musics: Music[];
  loading: boolean;
  onRefetch: () => void;
}

export function MusicsTable({ musics, loading, onRefetch }: MusicsTableProps) {
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editMusic, setEditMusic] = useState<Music | null>(null);
  const [deleteMusic, setDeleteMusic] = useState<Music | null>(null);
  const [page, setPage] = useState(1);

  const filteredMusics = useMemo(() => {
    return musics.filter(m => {
      const matchSearch = !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.artist.toLowerCase().includes(search.toLowerCase());
      const matchGenre = genreFilter === "all" || m.genre === genreFilter;
      return matchSearch && matchGenre;
    });
  }, [musics, search, genreFilter]);

  const totalPages = Math.ceil(filteredMusics.length / ITEMS_PER_PAGE);
  const paginatedMusics = filteredMusics.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleClearFilters = () => {
    setSearch("");
    setGenreFilter("all");
    setPage(1);
  };

  const hasFilters = search || genreFilter !== "all";

  const handleAddSuccess = () => {
    showToast(MESSAGES.success.musicAdded, "success");
    onRefetch();
  };

  const handleEditSuccess = () => {
    showToast(MESSAGES.success.musicUpdated, "success");
    onRefetch();
  };

  const handleDeleteSuccess = () => {
    showToast(MESSAGES.success.musicDeleted, "success");
    onRefetch();
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou artista..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select value={genreFilter} onValueChange={(v) => { setGenreFilter(v); setPage(1); }}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Gênero" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os gêneros</SelectItem>
              {MUSIC_GENRES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="outline" size="icon" onClick={handleClearFilters} title="Limpar filtros">
              <X className="w-4 h-4" />
            </Button>
          )}

          <Button onClick={() => setAddOpen(true)} className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Adicionar Música</span>
            <span className="sm:hidden">Adicionar</span>
          </Button>
        </div>
      </div>

      {/* Results info */}
      {hasFilters && (
        <p className="text-sm text-muted-foreground">
          {filteredMusics.length} resultado{filteredMusics.length !== 1 ? "s" : ""} encontrado{filteredMusics.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <span className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Carregando músicas...</p>
          </div>
        </div>
      ) : filteredMusics.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Music2 className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            {hasFilters ? "Nenhuma música encontrada" : "Sua biblioteca está vazia"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {hasFilters
              ? "Tente ajustar os filtros de busca."
              : "Adicione suas músicas favoritas para começar!"}
          </p>
          {!hasFilters && (
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar primeira música
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Música</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Artista</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Gênero</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Nota</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Link</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Adicionada</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedMusics.map(music => (
                  <tr key={music.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium" title={music.name}>{truncateText(music.name, 35)}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{truncateText(music.artist, 25)}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="font-normal">{music.genre}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-semibold ${getRatingColor(music.rating)}`}>
                        {getRatingEmoji(music.rating)} {music.rating}/10
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {music.url ? (
                        <a href={music.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline text-xs">
                          <ExternalLink className="w-3.5 h-3.5" />
                          Ouça
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground text-xs">
                      {formatDate(music.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditMusic(music)} title="Editar">
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteMusic(music)} title="Deletar">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {paginatedMusics.map(music => (
              <div key={music.id} className="rounded-lg border bg-card p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{music.name}</h3>
                    <p className="text-sm text-muted-foreground">{music.artist}</p>
                  </div>
                  <span className={`font-bold text-lg shrink-0 ${getRatingColor(music.rating)}`}>
                    {music.rating}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{music.genre}</Badge>
                  {music.url && (
                    <a href={music.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline text-xs">
                      <ExternalLink className="w-3 h-3" />
                      Ouça agora
                    </a>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{formatDate(music.created_at)}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditMusic(music)}>
                      <Pencil className="w-3.5 h-3.5 mr-1" />Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteMusic(music)}>
                      <Trash2 className="w-3.5 h-3.5 mr-1" />Deletar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Página {page} de {totalPages} ({filteredMusics.length} músicas)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (page <= 3) pageNum = i + 1;
                  else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = page - 2 + i;
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      className="w-9"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <AddMusicModal open={addOpen} onClose={() => setAddOpen(false)} onSuccess={handleAddSuccess} />
      <EditMusicModal music={editMusic} open={!!editMusic} onClose={() => setEditMusic(null)} onSuccess={handleEditSuccess} />
      <DeleteMusicDialog music={deleteMusic} open={!!deleteMusic} onClose={() => setDeleteMusic(null)} onSuccess={handleDeleteSuccess} />
    </div>
  );
}
