import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Music2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/authService";
import { supabase } from "@/services/supabase";
import { validatePassword } from "@/utils/validation";
import { Link } from "react-router-dom";

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    async function verifyRecoverySession() {
      try {
        const url = window.location.href;
        const hasRecoveryParams =
          url.includes("type=recovery") ||
          url.includes("access_token=");

        if (hasRecoveryParams) {
          const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
          if (error) {
            setTokenValid(false);
            setError("Token expirado ou inválido. Solicite um novo link de recuperação.");
            return;
          }

          if (data?.session) {
            setTokenValid(true);
            window.history.replaceState({}, "", window.location.pathname);
            return;
          }

          setTokenValid(false);
          setError("Token expirado ou inválido. Solicite um novo link de recuperação.");
          return;
        }

        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setError("Token expirado ou inválido. Solicite um novo link de recuperação.");
        }
      } catch (err) {
        console.error("Error verifying recovery session:", err);
        setTokenValid(false);
        setError("Erro ao verificar token. Tente novamente.");
      }
    }

    verifyRecoverySession();
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const passwordError = validatePassword(password, 8);
    if (passwordError) errors.password = passwordError;
    if (!confirmPassword) errors.confirmPassword = "Campo obrigatório.";
    else if (password !== confirmPassword) errors.confirmPassword = "As senhas não coincidem.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      await authService.updatePassword(password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: unknown) {
      console.error("Reset password error:", err);
      const message = err instanceof Error ? err.message : "";
      if (message.includes("expired") || message.includes("invalid")) {
        setError("Token expirado ou inválido. Solicite um novo link de recuperação.");
      } else {
        setError("Erro ao redefinir senha. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = (field: string) => {
    setFieldErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 dark:border">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <Music2 className="w-8 h-8" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Nova Senha</CardTitle>
            <CardDescription className="mt-1">
              {success ? "Senha redefinida com sucesso!" : "Defina sua nova senha"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="text-center space-y-4">
              <Alert variant="success">
                <AlertDescription>Senha redefinida com sucesso! Redirecionando para o login...</AlertDescription>
              </Alert>
            </div>
          ) : tokenValid === false ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>{error || "Token inválido ou expirado."}</AlertDescription>
              </Alert>
              <Link to="/forgot-password">
                <Button className="w-full">Solicitar novo link</Button>
              </Link>
            </div>
          ) : tokenValid === null ? (
            <div className="flex justify-center py-8">
              <span className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

              <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
                    className={fieldErrors.password ? "border-destructive pr-10" : "pr-10"}
                    disabled={loading}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && <p className="text-destructive text-xs">{fieldErrors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repita sua nova senha"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError("confirmPassword"); }}
                    className={fieldErrors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                    disabled={loading}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && <p className="text-destructive text-xs">{fieldErrors.confirmPassword}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <><span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />Redefinindo...</>
                ) : (
                  <><KeyRound className="w-4 h-4 mr-2" />Redefinir Senha</>
                )}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Lembrou sua senha?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Fazer login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
