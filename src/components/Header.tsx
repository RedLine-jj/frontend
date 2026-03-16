import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "@/api";
import { RefreshCw, LogIn, LogOut, Bell, BellDot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onRefresh?: () => void;
}

export default function Header({ onRefresh }: HeaderProps) {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: notificationsApi.getUnreadCount,
    enabled: isLoggedIn,
    refetchInterval: 30_000,
  });

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container flex h-14 items-center justify-between">
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
              size="icon"
              onClick={() => navigate("/notifications")}
              title="알림"
              className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              {unreadCount > 0 ? (
                <>
                  <BellDot className="h-3.5 w-3.5" />
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                </>
              ) : (
                <Bell className="h-3.5 w-3.5" />
              )}
            </Button>
          )}

          {isLoggedIn && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/subscriptions")}
              className="h-8 text-muted-foreground hover:text-foreground text-xs"
            >
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
