import { Package, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SummaryCardsProps {
  totalProducts: number;
  soldOutOptions: number;
  updatedAt: string;
}

export default function SummaryCards({ totalProducts, soldOutOptions, updatedAt }: SummaryCardsProps) {
  const formattedTime = updatedAt
    ? new Date(updatedAt).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '-';

  const cards = [
    { label: '총 상품 수', value: totalProducts, icon: Package, color: 'text-primary' },
    { label: '품절 옵션', value: soldOutOptions, icon: AlertTriangle, color: 'text-destructive' },
    { label: '최근 업데이트', value: formattedTime, icon: Clock, color: 'text-muted-foreground' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map(c => (
        <Card key={c.label} className="animate-fade-in">
          <CardContent className="flex items-center gap-4 p-5">
            <div className={`rounded-lg bg-muted p-2.5 ${c.color}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="text-xl font-semibold">{c.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
