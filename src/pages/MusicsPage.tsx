import { Music2 } from "lucide-react";
import { MusicsTable } from "@/components/dashboard/MusicsTable";
import { useMusics } from "@/hooks/useMusics";

export function MusicsPage() {
  const { musics, loading, refetch } = useMusics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Music2 className="w-6 h-6 text-primary" />
          Minhas Músicas
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie toda a sua biblioteca musical
        </p>
      </div>

      <MusicsTable musics={musics} loading={loading} onRefetch={refetch} />
    </div>
  );
}
