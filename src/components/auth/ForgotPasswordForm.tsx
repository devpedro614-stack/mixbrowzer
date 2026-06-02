import { useState } from "react";
import { Link } from "react-router-dom";
import { Music2, Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/authService";
import { validateEmail } from "@/utils/validation";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) { setEmailError(err); return; }
    setEmailError(null);
    setLoading(true);
    setError(null);

    try {
      await authService.resetPasswordForEmail(email);
      setSuccess(true);
    } catch (err: unknown) {
      console.error("Forgot password error:", err);
      const message = err instanceof Error ? err.message : "";
      if (message.includes("rate limit")) {
        setError("Muitas tentativas. Aguarde alguns minutos e tente novamente.");
      } else {
        setError("Erro ao enviar email. Verifique o endereço e tente novamente.");
      }
    } finally {
      setLoading(false);
    }
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
            <CardTitle className="text-2xl font-bold">Recuperar Senha</CardTitle>
            <CardDescription className="mt-1">
              {success
                ? "Verifique seu email para continuar"
                : "Insira seu email para receber um link de recuperação"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <Alert variant="success">
                <AlertDescription>
                  Link de recuperação enviado para <strong>{email}</strong>. Verifique sua caixa de entrada e spam.
                </AlertDescription>
              </Alert>
              <p className="text-sm text-muted-foreground">
                Não recebeu o email? Verifique a pasta de spam ou tente novamente.
              </p>
              <Button variant="outline" className="w-full" onClick={() => setSuccess(false)}>
                Tentar novamente
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
                  className={emailError ? "border-destructive" : ""}
                  disabled={loading}
                  autoComplete="email"
                />
                {emailError && <p className="text-destructive text-xs">{emailError}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <><span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />Enviando...</>
                ) : (
                  <><Send className="w-4 h-4 mr-2" />Enviar Link de Recuperação</>
                )}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="justify-center">
          <Link to="/login" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
