import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { RefreshCw, LogIn, LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onRefresh?: () => void;
}

export default function Header({ onRefresh }: HeaderProps) {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground tracking-tight">DR</span>
          </div>
          <span className="text-sm font-semibold font-display tracking-tight text-foreground">
            DENIM RADAR
          </span>
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
              onClick={() => navigate('/subscriptions')}
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
              <span className="max-w-[80px] truncate">{user?.email?.split('@')[0]}</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => navigate('/login')}
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
