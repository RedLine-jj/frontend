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
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-sm font-bold text-primary-foreground">DR</span>
          </div>
          <span className="text-lg font-bold tracking-tight">DENIM Restock Radar</span>
        </Link>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button variant="ghost" size="icon" onClick={onRefresh} title="새로고침">
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          {isLoggedIn && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/subscriptions')}>
              <Bell className="mr-1.5 h-4 w-4" />
              내 구독
            </Button>
          )}
          {isLoggedIn ? (
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="mr-1.5 h-4 w-4" />
              {user?.email?.split('@')[0]}
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate('/login')}>
              <LogIn className="mr-1.5 h-4 w-4" />
              로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
