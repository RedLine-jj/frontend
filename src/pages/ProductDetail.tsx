import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import Header from '@/components/Header';
import OptionsTable from '@/components/OptionsTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ExternalLink, Bell, BellOff, Clock } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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
      toast({ title: '구독 완료!' });
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
        <main className="container py-6 space-y-4">
          <Skeleton className="h-8 w-40" />
          <div className="flex gap-6">
            <Skeleton className="h-64 w-64 rounded-lg" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12 text-center text-muted-foreground">
          상품을 찾을 수 없습니다.
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> 목록으로
        </Link>

        <div className="flex flex-col gap-6 lg:flex-row">
          <img
            src={product.mainImage}
            alt={product.name}
            className="h-72 w-72 flex-shrink-0 rounded-lg object-cover"
          />
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{product.brand}</p>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="mt-1 text-xl font-bold text-primary">₩{product.listPrice.toLocaleString()}</p>
            </div>
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              원문 보기 <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <OptionsTable
              options={product.options}
              selectable={isLoggedIn && mode === 'SELECTED_OPTIONS'}
              selectedIds={selectedIds}
              onToggle={handleToggleOption}
            />

            {isLoggedIn && (
              <div className="space-y-3 rounded-lg border bg-card p-4">
                <h3 className="text-sm font-semibold">알림 구독 설정</h3>
                <RadioGroup value={mode} onValueChange={(v) => setMode(v as any)} className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="ALL_OPTIONS" id="all" />
                    <Label htmlFor="all" className="text-sm">전체 옵션 알림</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="SELECTED_OPTIONS" id="selected" />
                    <Label htmlFor="selected" className="text-sm">선택 옵션만</Label>
                  </div>
                </RadioGroup>
                {mode === 'SELECTED_OPTIONS' && (
                  <p className="text-xs text-muted-foreground">위 테이블에서 알림 받을 옵션을 선택하세요.</p>
                )}
                <div className="flex gap-2">
                  {isSubscribed ? (
                    <>
                      <Button size="sm" onClick={handleSubscribe}>설정 저장</Button>
                      <Button size="sm" variant="outline" onClick={handleUnsubscribe}>
                        <BellOff className="mr-1 h-3.5 w-3.5" /> 구독 해제
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={handleSubscribe}>
                      <Bell className="mr-1 h-3.5 w-3.5" /> 구독하기
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>마지막 크롤링: {new Date(product.updatedAt).toLocaleString('ko-KR')}</span>
              <span className="text-border">|</span>
              <span>다음 업데이트: 약 30분 후</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
