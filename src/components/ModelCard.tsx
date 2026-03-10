import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import type { ModelDto } from '@/types/api';

interface ModelCardProps {
  model: ModelDto;
}

export default function ModelCard({ model }: ModelCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group glass-card rounded-xl overflow-hidden cursor-pointer"
      onClick={() => navigate(`/model/${model.id}`)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        {model.imageUrl ? (
          <img
            src={model.imageUrl}
            alt={model.modelName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
            No Image
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-primary">
          {model.brandNameKo || model.brandName}
        </p>
        <h3 className="text-sm font-semibold font-display leading-snug text-foreground line-clamp-1">
          {model.modelName}
        </h3>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">
          {model.type}
        </Badge>
      </div>
    </motion.div>
  );
}
