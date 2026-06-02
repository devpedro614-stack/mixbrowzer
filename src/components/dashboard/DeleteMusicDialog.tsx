import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { musicsService } from "@/services/musicsService";
import { useAuth } from "@/hooks/useAuth";
import type { Music } from "@/types/music";

interface DeleteMusicDialogProps {
  music: Music | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteMusicDialog({ music, open, onClose, onSuccess }: DeleteMusicDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user || !music) return;
    setLoading(true);
    try {
      await musicsService.deleteMusic(music.id, user.id);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Delete music error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && !loading && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar Música</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar{" "}
            <strong className="text-foreground">"{music?.name}"</strong>?
            {" "}Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? (
              <><span className="animate-spin rounded-full h-4 w-4 border-2 border-destructive-foreground border-t-transparent mr-2" />Deletando...</>
            ) : (
              "Confirmar Exclusão"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
