import { useNavigate } from 'react-router-dom';
import { ProductBrief } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, Bell, BellOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: ProductBrief;
  isSubscribed: boolean;
  onToggleSubscribe: (productKey: string) => void;
  index?: number;
}

export default function ProductCard({ product, isSubscribed, onToggleSubscribe, index = 0 }: ProductCardProps) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { availableCount, soldOutCount } = product.optionsSummary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group glass-card glow-border rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-primary">{product.brand}</p>
          <h3 className="text-sm font-bold font-display leading-tight text-foreground mt-0.5 line-clamp-1">{product.name}</h3>
        </div>
        {isSubscribed && (
          <div className="absolute top-3 right-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
              <Bell className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold font-display text-gradient">
            ₩{product.listPrice.toLocaleString()}
          </p>
          <div className="flex gap-1.5">
            {availableCount > 0 && (
              <Badge variant="outline" className="status-available text-[10px] font-semibold px-2 py-0.5">
                {availableCount} 재고
              </Badge>
            )}
            {soldOutCount > 0 && (
              <Badge variant="outline" className="status-soldout text-[10px] font-semibold px-2 py-0.5">
                {soldOutCount} 품절
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs border-border/60 bg-secondary/30 hover:bg-secondary hover:text-foreground"
            onClick={() => navigate(`/product/${product.productKey}`)}
          >
            <Eye className="mr-1 h-3.5 w-3.5" />
            상세보기
          </Button>
          {isLoggedIn && (
            <Button
              size="sm"
              className={`flex-1 text-xs font-semibold ${
                isSubscribed
                  ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20'
              }`}
              onClick={() => onToggleSubscribe(product.productKey)}
            >
              {isSubscribed ? <BellOff className="mr-1 h-3.5 w-3.5" /> : <Bell className="mr-1 h-3.5 w-3.5" />}
              {isSubscribed ? '해제' : '구독'}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
