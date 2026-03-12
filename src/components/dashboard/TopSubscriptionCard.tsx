import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import RollingCard from "./RollingCard";
import { subscriptionStatsApi } from "@/api/subscriptionStatsApi";

interface TopSubscription {
  modelId: number;
  modelName: string;
  count: number;
}

export default function TopSubscriptionCard() {
  const navigate = useNavigate();

  const { data } = useQuery<TopSubscription[]>({
    queryKey: ["top-subscriptions"],
    queryFn: () => subscriptionStatsApi.getTopSubscriptions(),
  });

  const items =
    data?.slice(0, 10).map((s) => ({
      id: s.modelId,
      label: s.modelName,
      subLabel: `${s.count}명`,
    })) ?? [];

  return (
    <RollingCard
      title="알림 설정 TOP 10"
      icon={Star}
      items={items}
      showRank
      onItemClick={(id) => navigate(`/model/${id}`)}
    />
  );
}
