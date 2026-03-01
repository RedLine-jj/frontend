import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { RefreshCw, LogIn, LogOut, Bell, Radar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface HeaderProps {
  onRefresh?: () => void;
}

export default function Header({ onRefresh }: HeaderProps) {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div 
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary animate-pulse-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Radar className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-sm font-bold font-display tracking-tight text-gradient leading-none">
              DENIM RESTOCK
            </span>
            <span className="text-[10px] font-medium text-muted-foreground tracking-[0.2em] uppercase">
              Radar
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5">
          {onRefresh && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onRefresh} 
              title="새로고침"
              className="text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          {isLoggedIn && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/subscriptions')}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <Bell className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">내 구독</span>
            </Button>
          )}
          {isLoggedIn ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="border-border/60 bg-secondary/50 text-secondary-foreground hover:bg-secondary"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              <span className="max-w-[80px] truncate text-xs">{user?.email?.split('@')[0]}</span>
            </Button>
          ) : (
            <Button 
              size="sm" 
              onClick={() => navigate('/login')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20"
            >
              <LogIn className="mr-1.5 h-3.5 w-3.5" />
              로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
