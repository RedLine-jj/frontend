import { useNavigate } from 'react-router-dom';
import { ProductBrief } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, BellOff } from 'lucide-react';
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="group glass-card rounded-xl overflow-hidden cursor-pointer"
      onClick={() => navigate(`/product/${product.productKey}`)}
    >
      {/* Large image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {isSubscribed && (
          <div className="absolute top-3 right-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-md">
              <Bell className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Minimal info */}
      <div className="p-4 space-y-2">
        <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-primary">{product.brand}</p>
        <h3 className="text-sm font-semibold font-display leading-snug text-foreground line-clamp-1">{product.name}</h3>

        <div className="flex items-center justify-between">
          <p className="text-base font-bold font-display text-foreground">
            ₩{product.listPrice.toLocaleString()}
          </p>
          <div className="flex gap-1">
            {availableCount > 0 && (
              <Badge variant="outline" className="status-available text-[10px] px-1.5 py-0">
                {availableCount}
              </Badge>
            )}
            {soldOutCount > 0 && (
              <Badge variant="outline" className="status-soldout text-[10px] px-1.5 py-0">
                {soldOutCount}
              </Badge>
            )}
          </div>
        </div>

        {isLoggedIn && (
          <Button
            size="sm"
            variant={isSubscribed ? 'outline' : 'default'}
            className="w-full h-8 text-xs font-medium mt-1"
            onClick={(e) => { e.stopPropagation(); onToggleSubscribe(product.productKey); }}
          >
            {isSubscribed ? <BellOff className="mr-1 h-3 w-3" /> : <Bell className="mr-1 h-3 w-3" />}
            {isSubscribed ? '구독 해제' : '구독'}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
