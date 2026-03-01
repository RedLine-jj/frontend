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
    { label: '총 상품', value: totalProducts, icon: Package, accent: 'from-primary/20 to-primary/5', iconColor: 'text-primary' },
    { label: '품절 옵션', value: soldOutOptions, icon: AlertTriangle, accent: 'from-destructive/20 to-destructive/5', iconColor: 'text-destructive' },
    { label: '최근 업데이트', value: formattedTime, icon: Clock, accent: 'from-accent/40 to-accent/10', iconColor: 'text-muted-foreground' },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="glass-card glow-border rounded-xl p-5 relative overflow-hidden"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${c.accent} pointer-events-none`} />
          <div className="relative flex items-center gap-4">
            <div className={`rounded-lg bg-secondary/80 p-2.5 ${c.iconColor}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{c.label}</p>
              <p className="text-2xl font-bold font-display mt-0.5">{c.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
