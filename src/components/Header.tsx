import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { RefreshCw, LogIn, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onRefresh?: () => void;
}

export default function Header({ onRefresh }: HeaderProps) {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container flex h-14 items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center group">
          <img
            src="/images/logo.png"
            alt="Denim Radar Logo"
            className="h-20 w-auto transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        <div className="flex items-center gap-1.5">
          {onRefresh && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              title="새로고침"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          )}

          {isLoggedIn && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/subscriptions")}
              className="h-8 text-muted-foreground hover:text-foreground text-xs"
            >
              <Bell className="mr-1 h-3.5 w-3.5" />
              <span className="hidden sm:inline">내 구독</span>
            </Button>
          )}

          {isLoggedIn ? (
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="h-8 text-xs"
            >
              <LogOut className="mr-1 h-3 w-3" />
              <span className="max-w-[80px] truncate">{user?.userId}</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => navigate("/login")}
              className="h-8 text-xs font-semibold"
            >
              <LogIn className="mr-1 h-3 w-3" />
              로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
