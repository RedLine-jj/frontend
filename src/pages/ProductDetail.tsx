import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import Header from '@/components/Header';
import OptionsTable from '@/components/OptionsTable';
import PriceChart from '@/components/PriceChart';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ExternalLink, Bell, BellOff, Clock, Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

export default function ProductDetailPage() {
  const { productKey } = useParams<{ productKey: string }>();
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productKey],
    queryFn: () => api.getProduct(productKey!),
    enabled: !!productKey,
  });

  const { data: priceHistory } = useQuery({
    queryKey: ['priceHistory', productKey],
    queryFn: () => api.getPriceHistory(productKey!),
    enabled: !!productKey,
  });

  const { data: subs } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => api.getSubscriptions(),
    enabled: isLoggedIn,
  });

  const currentSub = subs?.find(s => s.productKey === productKey);
  const isSubscribed = !!currentSub;

  const [mode, setMode] = useState<'ALL_OPTIONS' | 'SELECTED_OPTIONS'>(currentSub?.mode ?? 'ALL_OPTIONS');
  const [selectedIds, setSelectedIds] = useState<string[]>(currentSub?.selectedOptionIds ?? []);

  const handleToggleOption = (optionId: string) => {
    setSelectedIds(prev => prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]);
  };

  const handleSubscribe = async () => {
    if (!productKey) return;
    try {
      await api.subscribe({ productKey, mode, selectedOptionIds: mode === 'SELECTED_OPTIONS' ? selectedIds : [] });
      toast({ title: '구독 완료' });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    } catch {
      toast({ title: '오류 발생', variant: 'destructive' });
    }
  };

  const handleUnsubscribe = async () => {
    if (!productKey) return;
    try {
      await api.unsubscribe(productKey);
      toast({ title: '구독 해제됨' });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    } catch {
      toast({ title: '오류 발생', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container flex items-center justify-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center text-muted-foreground text-sm">
          상품을 찾을 수 없습니다.
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-noise">
      <Header />
      <main className="container py-6 space-y-5 relative z-10">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> 목록으로
        </Link>

        <div className="flex flex-col gap-6 lg:flex-row">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-xl lg:w-96 flex-shrink-0"
          >
            <img
              src={product.mainImage}
              alt={product.name}
              className="h-80 w-full object-cover lg:h-[420px]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex-1 space-y-5"
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-primary">{product.brand}</p>
              <h1 className="text-2xl font-bold font-display mt-1 text-foreground">{product.name}</h1>
              <p className="mt-1.5 text-xl font-bold font-display text-foreground">₩{product.listPrice.toLocaleString()}</p>
            </div>
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
            >
              모드맨에서 보기 <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <OptionsTable
              siteOptions={product.siteOptions}
              selectable={isLoggedIn && mode === 'SELECTED_OPTIONS'}
              selectedIds={selectedIds}
              onToggle={handleToggleOption}
            />

            {priceHistory && priceHistory.length > 0 && (
              <PriceChart data={priceHistory} listPrice={product.listPrice} />
            )}

            {isLoggedIn && (
              <div className="glass-card rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold font-display text-foreground">알림 구독 설정</h3>
                <RadioGroup value={mode} onValueChange={(v) => setMode(v as any)} className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="ALL_OPTIONS" id="all" />
                    <Label htmlFor="all" className="text-sm cursor-pointer">전체 옵션</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="SELECTED_OPTIONS" id="selected" />
                    <Label htmlFor="selected" className="text-sm cursor-pointer">선택 옵션만</Label>
                  </div>
                </RadioGroup>
                {mode === 'SELECTED_OPTIONS' && (
                  <p className="text-xs text-muted-foreground">위 테이블에서 알림 받을 옵션을 선택하세요.</p>
                )}
                <div className="flex gap-2">
                  {isSubscribed ? (
                    <>
                      <Button size="sm" className="font-medium" onClick={handleSubscribe}>설정 저장</Button>
                      <Button size="sm" variant="outline" onClick={handleUnsubscribe}>
                        <BellOff className="mr-1 h-3.5 w-3.5" /> 해제
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" className="font-medium" onClick={handleSubscribe}>
                      <Bell className="mr-1 h-3.5 w-3.5" /> 구독하기
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>마지막 크롤링: {new Date(product.updatedAt).toLocaleString('ko-KR')}</span>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
