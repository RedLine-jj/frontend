import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { modelsApi, siteOptionsApi, subscriptionsApi } from '@/api';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Bell, BellOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ModelDetailPage() {
  const { modelId } = useParams<{ modelId: string }>();
  const modelIdNum = Number(modelId);
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: model, isLoading } = useQuery({
    queryKey: ['model', modelIdNum],
    queryFn: () => modelsApi.getModel(modelIdNum),
    enabled: !!modelId && !isNaN(modelIdNum),
  });

  const { data: siteOptions } = useQuery({
    queryKey: ['siteOptions', modelIdNum],
    queryFn: () => siteOptionsApi.getSiteOptions({ modelId: modelIdNum }),
    enabled: !!modelId && !isNaN(modelIdNum),
  });

  // 구독 상태
  const { data: subs } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => subscriptionsApi.getSubscriptions(),
    enabled: isLoggedIn,
  });

  const currentSub = subs?.content.find((s) => s.modelId === modelIdNum);
  const isSubscribed = !!currentSub;

  const handleSubscribe = async () => {
    try {
      await subscriptionsApi.subscribe({ modelId: modelIdNum });
      toast({ title: '구독 완료' });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    } catch {
      toast({ title: '오류 발생', variant: 'destructive' });
    }
  };

  const handleUnsubscribe = async () => {
    if (!currentSub) return;
    try {
      await subscriptionsApi.unsubscribe(currentSub.id);
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

  if (!model) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center text-muted-foreground text-sm">
          모델을 찾을 수 없습니다.
        </main>
      </div>
    );
  }

  const options = siteOptions?.content ?? [];

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
            {model.imageUrl ? (
              <img
                src={model.imageUrl}
                alt={model.modelName}
                className="h-80 w-full object-cover lg:h-[420px]"
              />
            ) : (
              <div className="h-80 w-full flex items-center justify-center bg-secondary text-muted-foreground text-sm lg:h-[420px]">
                No Image
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex-1 space-y-5"
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-primary">
                {model.brandNameKo || model.brandName}
              </p>
              <h1 className="text-2xl font-bold font-display mt-1 text-foreground">{model.modelName}</h1>
              {model.lowestPrice != null && (
                <p className="mt-1.5 text-xl font-bold font-display text-foreground">
                  ₩{model.lowestPrice.toLocaleString()}
                </p>
              )}
            </div>

            {/* 사이트별 옵션 */}
            {options.length > 0 && (
              <div className="glass-card rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs">
                      <th className="text-left p-3 font-medium">편집샵</th>
                      <th className="text-left p-3 font-medium">옵션</th>
                      <th className="text-right p-3 font-medium">가격</th>
                      <th className="text-center p-3 font-medium">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {options.map((opt) => (
                      <tr key={opt.id} className="border-b border-border/50 last:border-0">
                        <td className="p-3 font-medium">{opt.siteName}</td>
                        <td className="p-3 text-muted-foreground">{opt.optionLabel}</td>
                        <td className="p-3 text-right font-display font-semibold">
                          ₩{opt.price.toLocaleString()}
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className={opt.status ? 'status-available' : 'status-soldout'}>
                            {opt.status ? '재고' : '품절'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 구독 */}
            {isLoggedIn && (
              <div className="flex gap-2">
                {isSubscribed ? (
                  <Button size="sm" variant="outline" onClick={handleUnsubscribe}>
                    <BellOff className="mr-1 h-3.5 w-3.5" /> 구독 해제
                  </Button>
                ) : (
                  <Button size="sm" className="font-medium" onClick={handleSubscribe}>
                    <Bell className="mr-1 h-3.5 w-3.5" /> 구독하기
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
