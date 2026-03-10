import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { ModelDto } from '@/types/api';

interface ModelCardProps {
  model: ModelDto;
}

export default function ModelCard({ model }: ModelCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="group glass-card rounded-xl overflow-hidden cursor-pointer"
      onClick={() => navigate(`/model/${model.id}`)}
    >
      {/* Large image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {model.imageUrl ? (
          <img
            src={model.imageUrl}
            alt={model.modelName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs bg-secondary">
            No Image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-primary">
          {model.brandNameKo || model.brandName}
        </p>
        <h3 className="text-sm font-semibold font-display leading-snug text-foreground line-clamp-1">
          {model.modelName}
        </h3>

        <div className="flex items-center justify-between">
          {model.lowestPrice != null ? (
            <p className="text-base font-bold font-display text-foreground">
              ₩{model.lowestPrice.toLocaleString()}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">가격 정보 없음</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
