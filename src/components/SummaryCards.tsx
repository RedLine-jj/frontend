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
    staleTime: 1000 * 60 * 5, // 5분
  });

  const { data: subscriptionCount } = useQuery({
    queryKey: ["subscriptions", "count"],
    queryFn: subscriptionsApi.getSubscriptionCount,
    staleTime: 1000 * 60, // 1분
    enabled: isLoggedIn, // 로그인 상태일 때만 쿼리 실행
  });

  const baseCards = [
    {
      label: "총 모델",
      value: totalModels,
      icon: Package,
      iconBg: "bg-sky-100 text-sky-600",
    },
    {
      label: "브랜드",
      value: totalBrands,
      icon: Layers,
      iconBg: "bg-amber-100 text-amber-600",
    },
    {
      label: "편집샵 목록",
      value: sites?.length ?? 0,
      icon: Globe,
      iconBg: "bg-teal-100 text-teal-600",
    },
  ];

  const userCard = {
    label: "내 구독",
    value: subscriptionCount ?? 0,
    icon: Bell,
    iconBg: "bg-indigo-100 text-indigo-600",
  };

  const cards = isLoggedIn
    ? [baseCards[0], userCard, baseCards[1], baseCards[2]]
    : baseCards;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                {c.label}
              </p>
              <p className="text-xl font-bold font-display mt-0.5 text-foreground">
                <AnimatedNumber value={c.value} />
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
