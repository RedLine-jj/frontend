import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RollingItem {
  id: number;
  label: string;
  subLabel?: string;
}

interface Props {
  title: string;
  items: RollingItem[];
  onItemClick?: (id: number) => void;
  showRank?: boolean;
}

const VISIBLE_COUNT = 2;

export default function RollingCard({
  title,
  items,
  onItemClick,
  showRank = false,
}: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!items?.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + VISIBLE_COUNT) % items.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [items]);

  if (!items?.length) return null;

  const visibleItems = Array.from({ length: VISIBLE_COUNT }, (_, i) => {
    const itemIndex = (index + i) % items.length;
    return {
      ...items[itemIndex],
      rank: itemIndex + 1,
    };
  });

  return (
    <div className="rounded-xl border bg-background p-5 h-28 flex flex-col justify-between hover:shadow-md transition">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>

      <div className="relative overflow-hidden space-y-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-1"
          >
            {visibleItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onItemClick?.(item.id)}
                className="flex justify-between items-center text-sm cursor-pointer hover:text-primary transition"
              >
                <span className="flex items-center gap-2 truncate max-w-[70%]">
                  {showRank && (
                    <span className="text-xs font-semibold text-muted-foreground w-6">
                      {item.rank}위
                    </span>
                  )}

                  <span className="font-medium truncate">{item.label}</span>
                </span>

                {item.subLabel && (
                  <span className="text-xs text-muted-foreground">
                    {item.subLabel}
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
