import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Radar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-noise bg-grid">
      <Header />
      <main className="container flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="glass-card glow-border rounded-2xl p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30 animate-pulse-glow">
                <Radar className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display text-gradient">로그인</h1>
                <p className="text-sm text-muted-foreground mt-1">DENIM Restock Radar</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="h-11 bg-secondary/50 border-border/60 focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="h-11 bg-secondary/50 border-border/60 focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button 
                type="submit" 
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/25" 
                disabled={loading}
              >
                {loading ? '로그인 중...' : '로그인'}
              </Button>
              <div className="text-center space-y-2">
                <Link to="/forgot-password" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  비밀번호를 잊으셨나요?
                </Link>
                <p className="text-sm text-muted-foreground">
                  계정이 없으신가요?{' '}
                  <Link to="/signup" className="text-primary hover:underline font-medium">회원가입</Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
