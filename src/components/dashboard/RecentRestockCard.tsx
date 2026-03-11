import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BellRing } from "lucide-react";
import RollingCard from "./RollingCard";
import { restocksApi } from "@/api/restocksApi";

interface Restock {
  modelId: number;
  modelName: string;
  siteName: string;
  restockedAt: string;
}

function formatTimeAgo(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);

  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diff < 60) return "방금 전";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export default function RecentRestockCard() {
  const navigate = useNavigate();

  const { data } = useQuery<Restock[]>({
    queryKey: ["recent-restocks"],
    queryFn: () => restocksApi.getRecentRestocks(),
  });

  const items =
    data?.slice(0, 10).map((r) => ({
      id: r.modelId,
      label: r.modelName,
      subLabel: `${r.siteName} • ${formatTimeAgo(r.restockedAt)}`,
    })) ?? [];

  return (
    <RollingCard
      title="최근 재입고"
      icon={BellRing}
      items={items}
      onItemClick={(id) => navigate(`/model/${id}`)}
    />
  );
}
