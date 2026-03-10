import { Package, AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

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
    { label: '총 상품', value: totalProducts, icon: Package, iconBg: 'bg-denim-light text-primary' },
    { label: '품절 옵션', value: soldOutOptions, icon: AlertTriangle, iconBg: 'bg-destructive/10 text-destructive' },
    { label: '최근 업데이트', value: formattedTime, icon: Clock, iconBg: 'bg-muted text-muted-foreground' },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.35 }}
          className="glass-card rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${c.iconBg}`}>
              <c.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{c.label}</p>
              <p className="text-xl font-bold font-display mt-0.5 text-foreground">{c.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
