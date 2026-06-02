import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, useAuthState } from "@/hooks/useAuth";
import { ToastProvider } from "@/components/ui/toast";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHome } from "@/pages/DashboardHome";
import { MusicsPage } from "@/pages/MusicsPage";
import { StatsPage } from "@/pages/StatsPage";
import { useEffect } from "react";
import { isSupabaseConfigured } from "@/services/supabase";

function AppWithAuth() {
  const authState = useAuthState();

  // Apply dark mode on initial load
  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isDark) document.documentElement.classList.add("dark");
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
        <div className="w-full max-w-2xl rounded-3xl border border-red-200 bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-semibold text-red-700">Configuração do Supabase faltando</h1>
          <p className="mt-4 text-base text-slate-700 leading-relaxed">
            O aplicativo não conseguiu carregar porque as credenciais do Supabase não estão configuradas.
            Atualize o arquivo <code className="rounded bg-slate-100 px-1 py-0.5">.env.local</code> com os valores reais de
            <span className="font-semibold"> VITE_SUPABASE_URL </span> e <span className="font-semibold">VITE_SUPABASE_ANON_KEY</span>.
          </p>
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-800">
            Certifique-se de usar os valores do seu projeto Supabase e reinicie o servidor.
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authState}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/reset-password" element={<ResetPasswordForm />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="musics" element={<MusicsPage />} />
              <Route path="stats" element={<StatsPage />} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthContext.Provider>
  );
}

export default AppWithAuth;
