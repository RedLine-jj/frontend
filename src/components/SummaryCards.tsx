import { Package, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

interface SummaryCardsProps {
  totalModels: number;
  totalBrands: number;
}

export default function SummaryCards({ totalModels, totalBrands }: SummaryCardsProps) {
  const cards = [
    { label: '총 모델', value: totalModels, icon: Package, iconBg: 'bg-denim-light text-primary' },
    { label: '브랜드', value: totalBrands, icon: Layers, iconBg: 'bg-muted text-muted-foreground' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
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
