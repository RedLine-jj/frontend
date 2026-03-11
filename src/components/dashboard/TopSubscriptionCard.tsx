import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
      title="🔔 알림 설정 TOP10"
      items={items}
      onItemClick={(id) => navigate(`/model/${id}`)}
      showRank
    />
  );
}
