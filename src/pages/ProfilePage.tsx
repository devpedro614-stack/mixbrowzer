import { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/services/supabase";
import { profilesService, type Profile } from "@/services/profilesService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ProfilePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [formData, setFormData] = useState({
        fullName: user?.user_metadata?.name || user?.user_metadata?.full_name || "",
        email: user?.email || "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        if (!user?.id) return;

        const loadProfile = async () => {
            try {
                const profileData = await profilesService.getProfile(user.id);
                setProfile(profileData);
                setFormData(prev => ({
                    ...prev,
                    fullName: profileData?.full_name || user.user_metadata?.name || user.user_metadata?.full_name || "",
                    email: user.email || "",
                }));
            } catch (error) {
                console.error("Error loading profile:", error);
            }
        };

        loadProfile();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (formData.fullName.trim().length === 0) {
                setMessage({ type: "error", text: "Nome completo não pode estar vazio." });
                setLoading(false);
                return;
            }

            // Update user metadata in Supabase
            const { error } = await supabase.auth.updateUser({
                data: { name: formData.fullName }
            });

            if (error) {
                throw error;
            }

            await profilesService.upsertProfile(user.id, {
                full_name: formData.fullName,
                avatar_url: profile?.avatar_url ?? null,
                website: profile?.website ?? null,
                bio: profile?.bio ?? null,
            });

            setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);
        } catch (error) {
            console.error("Error updating profile:", error);
            const errorMessage = error instanceof Error ? error.message : "Erro ao atualizar perfil. Tente novamente.";
            setMessage({ type: "error", text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header with back button */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/dashboard")}
                        className="rounded-full"
                        aria-label="Voltar"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Meu Perfil</h1>
                        <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
                    </div>
                </div>

                {/* Profile Card */}
                <Card className="p-6 space-y-6">
                    {message && (
                        <Alert variant={message.type === "success" ? "default" : "destructive"}>
                            <AlertDescription>{message.text}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Nome Completo</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                type="text"
                                placeholder="Seu nome completo"
                                value={formData.fullName}
                                onChange={handleChange}
                                disabled={loading}
                                maxLength={100}
                            />
                        </div>

                        {/* Email - Read Only */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                disabled
                                className="bg-muted cursor-not-allowed"
                            />
                            <p className="text-xs text-muted-foreground">Email não pode ser alterado diretamente. Contate o suporte se precisar alterar.</p>
                        </div>

                        {/* User ID - Read Only */}
                        {user?.id && (
                            <div className="space-y-2">
                                <Label htmlFor="userId">ID do Usuário</Label>
                                <Input
                                    id="userId"
                                    type="text"
                                    value={user.id}
                                    disabled
                                    className="bg-muted cursor-not-allowed font-mono text-xs"
                                />
                            </div>
                        )}

                        {/* Account Created Date */}
                        {user?.created_at && (
                            <div className="space-y-2">
                                <Label htmlFor="createdAt">Data de Cadastro</Label>
                                <Input
                                    id="createdAt"
                                    type="text"
                                    value={new Date(user.created_at).toLocaleDateString("pt-BR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                    disabled
                                    className="bg-muted cursor-not-allowed"
                                />
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {loading ? "Salvando..." : "Salvar Alterações"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/dashboard")}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
