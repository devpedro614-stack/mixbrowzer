import { useState } from "react";
import { Plus } from "lucide-react";
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
import type { MusicFormData } from "@/types/music";

interface AddMusicModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const defaultForm: MusicFormData = { name: "", artist: "", genre: "", rating: 7, url: "" };

export function AddMusicModal({ open, onClose, onSuccess }: AddMusicModalProps) {
  const { user } = useAuth();
  const [form, setForm] = useState<MusicFormData>(defaultForm);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof MusicFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    const errors: Partial<Record<keyof MusicFormData, string>> = {};
    const nameError = validateRequired(form.name, "Nome");
    if (nameError) errors.name = nameError;
    else if (form.name.length > 100) errors.name = "Nome deve ter no máximo 100 caracteres.";

    const artistError = validateRequired(form.artist, "Artista");
    if (artistError) errors.artist = artistError;
    else if (form.artist.length > 100) errors.artist = "Artista deve ter no máximo 100 caracteres.";

    if (!form.genre) errors.genre = "Selecione um gênero.";

    if (Number.isNaN(form.rating)) {
      errors.rating = "Nota inválida.";
    } else {
      const ratingError = validateRating(form.rating);
      if (ratingError) errors.rating = ratingError;
    }

    if (form.url) {
      const urlError = validateUrl(form.url);
      if (urlError) errors.url = urlError;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!user) {
      setError("Usuário não autenticado. Faça login novamente.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await musicsService.addMusic(user.id, form);
      setForm(defaultForm);
      setFieldErrors({});
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Add music error:", err);
      const message = err instanceof Error ? err.message : JSON.stringify(err);
      setError(`Erro ao adicionar música. ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setForm(defaultForm);
      setFieldErrors({});
      setError(null);
      onClose();
    }
  };

  const clearFieldError = (field: keyof MusicFormData) => {
    setFieldErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Adicionar Nova Música
          </DialogTitle>
          <DialogDescription>Preencha os dados da música que deseja adicionar à sua biblioteca.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="add-name">Nome da Música *</Label>
              <Input
                id="add-name"
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
              <Label htmlFor="add-artist">Artista *</Label>
              <Input
                id="add-artist"
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
              <Label htmlFor="add-rating">Nota (0-10) *</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="add-rating"
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
                    id="add-rating-range"
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={form.rating}
                    onChange={(e) => { setForm(p => ({ ...p, rating: parseFloat(e.target.value) })); clearFieldError("rating"); }}
                    className="w-full accent-purple-600"
                    disabled={loading}
                    aria-labelledby="add-rating"
                    title="Nota"
                  />
                </div>
              </div>
              {fieldErrors.rating && <p className="text-destructive text-xs">{fieldErrors.rating}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-url">Link da Música (opcional)</Label>
              <Input
                id="add-url"
                type="url"
                placeholder="https://open.spotify.com/..."
                value={form.url}
                onChange={(e) => { setForm(p => ({ ...p, url: e.target.value })); clearFieldError("url"); }}
                className={fieldErrors.url ? "border-destructive" : ""}
                disabled={loading}
              />
              {fieldErrors.url && <p className="text-destructive text-xs">{fieldErrors.url}</p>}
              <p className="text-xs text-muted-foreground">Spotify, YouTube, Apple Music, SoundCloud, etc.</p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <><span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />Salvando...</>
              ) : (
                <><Plus className="w-4 h-4 mr-2" />Adicionar Música</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
