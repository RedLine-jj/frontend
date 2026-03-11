import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Package, Layers, Bell, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { sitesApi, subscriptionsApi } from "@/api";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

interface SummaryCardsProps {
  totalModels: number;
  totalBrands: number;
}

export default function SummaryCards({
  totalModels,
  totalBrands,
}: SummaryCardsProps) {
  const { isLoggedIn } = useAuth();

  const { data: sites } = useQuery({
    queryKey: ["sites"],
    queryFn: sitesApi.getSites,
    staleTime: 1000 * 60 * 5,
  });

  const { data: subscriptionCount } = useQuery({
    queryKey: ["subscriptions", "count"],
    queryFn: subscriptionsApi.getSubscriptionCount,
    staleTime: 1000 * 60,
    enabled: isLoggedIn,
  });

  const baseCards = [
    {
      label: "총 모델",
      value: totalModels,
      icon: Package,
    },
    {
      label: "브랜드",
      value: totalBrands,
      icon: Layers,
    },
    {
      label: "편집샵 목록",
      value: sites?.length ?? 0,
      icon: Globe,
    },
  ];

  const userCard = {
    label: "내 구독",
    value: subscriptionCount ?? 0,
    icon: Bell,
  };

  const cards = isLoggedIn
    ? [baseCards[0], userCard, baseCards[1], baseCards[2]]
    : baseCards;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {cards.map((c, i) => {
        const Icon = c.icon;

        return (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="group relative rounded-xl border bg-background p-4
                       shadow-sm hover:shadow-md
                       hover:-translate-y-0.5
                       transition-all duration-200"
          >
            {/* top section */}
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium text-muted-foreground tracking-wide">
                {c.label}
              </p>

              <Icon
                className="h-4 w-4 text-muted-foreground/60
                           group-hover:text-primary
                           transition-colors"
              />
            </div>

            {/* value */}
            <div className="mt-2">
              <p className="text-2xl font-bold font-display text-foreground">
                <AnimatedNumber value={c.value} />
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
