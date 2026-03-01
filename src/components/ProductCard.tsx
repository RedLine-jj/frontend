import { useNavigate } from 'react-router-dom';
import { ProductBrief } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, Bell, BellOff } from 'lucide-react';

interface ProductCardProps {
  product: ProductBrief;
  isSubscribed: boolean;
  onToggleSubscribe: (productKey: string) => void;
}

export default function ProductCard({ product, isSubscribed, onToggleSubscribe }: ProductCardProps) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { availableCount, soldOutCount } = product.optionsSummary;

  return (
    <Card className="group animate-fade-in overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-24 w-24 flex-shrink-0 rounded-md object-cover"
            loading="lazy"
          />
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{product.brand}</p>
              <h3 className="truncate text-sm font-semibold leading-tight">{product.name}</h3>
              <p className="mt-1 text-sm font-bold text-primary">
                ₩{product.listPrice.toLocaleString()}
              </p>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {availableCount > 0 && (
                <Badge variant="outline" className="status-available text-xs">
                  재고 {availableCount}
                </Badge>
              )}
              {soldOutCount > 0 && (
                <Badge variant="outline" className="status-soldout text-xs">
                  품절 {soldOutCount}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex border-t">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 rounded-none text-xs"
            onClick={() => navigate(`/product/${product.productKey}`)}
          >
            <Eye className="mr-1 h-3.5 w-3.5" />
            상세보기
          </Button>
          {isLoggedIn && (
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 rounded-none border-l text-xs ${isSubscribed ? 'text-primary' : ''}`}
              onClick={() => onToggleSubscribe(product.productKey)}
            >
              {isSubscribed ? <BellOff className="mr-1 h-3.5 w-3.5" /> : <Bell className="mr-1 h-3.5 w-3.5" />}
              {isSubscribed ? '구독 해제' : '구독'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
