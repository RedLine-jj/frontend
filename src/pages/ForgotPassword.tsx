import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.resetPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || '요청에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="glass-card rounded-xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                {sent ? (
                  <CheckCircle className="h-6 w-6 text-primary-foreground" />
                ) : (
                  <span className="text-lg font-bold text-primary-foreground">DR</span>
                )}
              </div>
              <h1 className="text-xl font-bold font-display text-foreground">
                {sent ? '이메일 전송 완료' : '비밀번호 찾기'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {sent
                  ? '비밀번호 재설정 링크가 전송되었습니다.'
                  : '가입한 이메일을 입력해주세요.'}
              </p>
            </div>

            {sent ? (
              <div className="space-y-4">
                <p className="text-center text-xs text-muted-foreground">(MVP: 실제 이메일은 전송되지 않습니다)</p>
                <Link to="/login">
                  <Button variant="outline" className="w-full h-10">로그인으로 돌아가기</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">이메일</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="h-10" />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full h-10 font-semibold" disabled={loading}>
                  {loading ? '전송 중...' : '재설정 링크 보내기'}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  <Link to="/login" className="text-primary hover:underline font-medium">로그인으로 돌아가기</Link>
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
