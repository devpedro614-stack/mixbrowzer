import { useState } from "react";
import { Music2, LogOut, User, Menu, X, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onMenuToggle: () => void;
  menuOpen: boolean;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({ onMenuToggle, menuOpen, darkMode, onToggleDarkMode }: HeaderProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const displayName = user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuário";

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-background border-b flex items-center px-4 gap-4">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-md hover:bg-accent transition-colors"
        aria-label="Toggle menu"
      >
        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 flex-1 lg:flex-none">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
          <Music2 className="w-4 h-4" />
        </div>
        <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          MixBrowzer
        </span>
      </div>

      <div className="flex-1" />

      {/* Dark mode toggle */}
      <button
        onClick={onToggleDarkMode}
        className="p-2 rounded-md hover:bg-accent transition-colors"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 px-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              {getInitials(displayName)}
            </div>
            <span className="hidden sm:block text-sm font-medium max-w-32 truncate">{displayName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2" onClick={() => navigate("/profile")}>
            <User className="w-4 h-4" /> Meu Perfil
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 text-destructive focus:text-destructive"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            <LogOut className="w-4 h-4" />
            {signingOut ? "Saindo..." : "Sair"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
