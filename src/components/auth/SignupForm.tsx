import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Music2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/authService";
import { validateEmail, validatePassword, validateRequired } from "@/utils/validation";

export function SignupForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const nameError = validateRequired(name, "Nome");
    if (nameError) errors.name = nameError;
    else if (name.trim().length < 3) errors.name = "Nome deve ter no mínimo 3 caracteres.";

    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;

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
    setSuccess(null);

    try {
      const result = await authService.signUp(email, password, name);
      const hasSession = result?.session != null;

      if (hasSession) {
        setSuccess("Conta criada com sucesso! Redirecionando...");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setSuccess(
          "Conta criada com sucesso! Verifique seu email para confirmar o acesso e faça login."
        );
        setTimeout(() => navigate("/login"), 2500);
      }
    } catch (err: unknown) {
      console.error("Signup error:", err);
      const message = err instanceof Error ? err.message : "";
      if (message.includes("already registered") || message.includes("already been registered")) {
        setError("Email já cadastrado. Tente fazer login.");
      } else if (message.includes("password")) {
        setError("Senha fraca. Use uma combinação de letras, números e símbolos.");
      } else {
        setError("Erro ao processar requisição. Tente novamente.");
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
            <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
            <CardDescription className="mt-1">Junte-se ao MixBrowzer e organize suas músicas</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            {success && <Alert variant="success"><AlertDescription>{success}</AlertDescription></Alert>}

            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => { setName(e.target.value); clearFieldError("name"); }}
                className={fieldErrors.name ? "border-destructive" : ""}
                disabled={loading}
                autoComplete="name"
              />
              {fieldErrors.name && <p className="text-destructive text-xs">{fieldErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                className={fieldErrors.email ? "border-destructive" : ""}
                disabled={loading}
                autoComplete="email"
              />
              {fieldErrors.email && <p className="text-destructive text-xs">{fieldErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
                  className={fieldErrors.password ? "border-destructive pr-10" : "pr-10"}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-destructive text-xs">{fieldErrors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repita sua senha"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError("confirmPassword"); }}
                  className={fieldErrors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                  disabled={loading}
                  autoComplete="new-password"
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
                <><span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />Criando conta...</>
              ) : (
                <><UserPlus className="w-4 h-4 mr-2" />Criar Conta</>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Fazer login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
