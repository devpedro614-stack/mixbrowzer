import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { musicsService } from "@/services/musicsService";
import { useAuth } from "@/hooks/useAuth";
import { MUSIC_GENRES } from "@/utils/constants";
import { validateRequired, validateUrl, validateRating } from "@/utils/validation";
import type { Music, MusicFormData } from "@/types/music";

interface EditMusicModalProps {
  music: Music | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditMusicModal({ music, open, onClose, onSuccess }: EditMusicModalProps) {
  const { user } = useAuth();
  const [form, setForm] = useState<MusicFormData>({ name: "", artist: "", genre: "", rating: 7, url: "" });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof MusicFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (music) {
      setForm({
        name: music.name,
        artist: music.artist,
        genre: music.genre,
        rating: music.rating,
        url: music.url || "",
      });
      setFieldErrors({});
      setError(null);
    }
  }, [music]);

  const validateForm = () => {
    const errors: Partial<Record<keyof MusicFormData, string>> = {};
    const nameError = validateRequired(form.name, "Nome");
    if (nameError) errors.name = nameError;
    else if (form.name.length > 100) errors.name = "Nome deve ter no máximo 100 caracteres.";

    const artistError = validateRequired(form.artist, "Artista");
    if (artistError) errors.artist = artistError;

    if (!form.genre) errors.genre = "Selecione um gênero.";

    const ratingError = validateRating(form.rating);
    if (ratingError) errors.rating = ratingError;

    if (form.url) {
      const urlError = validateUrl(form.url);
      if (urlError) errors.url = urlError;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user || !music) return;

    setLoading(true);
    setError(null);
    try {
      await musicsService.updateMusic(music.id, user.id, form);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Edit music error:", err);
      setError("Erro ao atualizar música. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) onClose();
  };

  const clearFieldError = (field: keyof MusicFormData) => {
    setFieldErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" />
            Editar Música
          </DialogTitle>
          <DialogDescription>Atualize os dados da música selecionada.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="edit-name">Nome da Música *</Label>
              <Input
                id="edit-name"
                placeholder="Ex: Bohemian Rhapsody"
                value={form.name}
                onChange={(e) => { setForm(p => ({ ...p, name: e.target.value })); clearFieldError("name"); }}
                className={fieldErrors.name ? "border-destructive" : ""}
                disabled={loading}
                maxLength={100}
              />
              {fieldErrors.name && <p className="text-destructive text-xs">{fieldErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-artist">Artista *</Label>
              <Input
                id="edit-artist"
                placeholder="Ex: Queen"
                value={form.artist}
                onChange={(e) => { setForm(p => ({ ...p, artist: e.target.value })); clearFieldError("artist"); }}
                className={fieldErrors.artist ? "border-destructive" : ""}
                disabled={loading}
                maxLength={100}
              />
              {fieldErrors.artist && <p className="text-destructive text-xs">{fieldErrors.artist}</p>}
            </div>

            <div className="space-y-2">
              <Label>Gênero *</Label>
              <Select
                value={form.genre}
                onValueChange={(v) => { setForm(p => ({ ...p, genre: v })); clearFieldError("genre"); }}
                disabled={loading}
              >
                <SelectTrigger className={fieldErrors.genre ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {MUSIC_GENRES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
              {fieldErrors.genre && <p className="text-destructive text-xs">{fieldErrors.genre}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-rating">Nota (0-10) *</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="edit-rating"
                  type="number"
                  min={0}
                  max={10}
                  step={0.5}
                  value={form.rating}
                  onChange={(e) => { setForm(p => ({ ...p, rating: parseFloat(e.target.value) || 0 })); clearFieldError("rating"); }}
                  className={`w-24 ${fieldErrors.rating ? "border-destructive" : ""}`}
                  disabled={loading}
                />
                <div className="flex-1">
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={form.rating}
                    onChange={(e) => { setForm(p => ({ ...p, rating: parseFloat(e.target.value) })); clearFieldError("rating"); }}
                    className="w-full accent-purple-600"
                    disabled={loading}
                  />
                </div>
              </div>
              {fieldErrors.rating && <p className="text-destructive text-xs">{fieldErrors.rating}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-url">Link da Música (opcional)</Label>
              <Input
                id="edit-url"
                type="url"
                placeholder="https://open.spotify.com/..."
                value={form.url}
                onChange={(e) => { setForm(p => ({ ...p, url: e.target.value })); clearFieldError("url"); }}
                className={fieldErrors.url ? "border-destructive" : ""}
                disabled={loading}
              />
              {fieldErrors.url && <p className="text-destructive text-xs">{fieldErrors.url}</p>}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <><span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />Salvando...</>
              ) : (
                <><Pencil className="w-4 h-4 mr-2" />Salvar Alterações</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
