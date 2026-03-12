import axios from "axios";

export interface TopSubscription {
  modelId: number;
  modelName: string;
  count: number;
}

const mockTopSubscriptions: TopSubscription[] = [
  { modelId: 1, modelName: "Levi's 501", count: 142 },
  { modelId: 2, modelName: "Iron Heart 634", count: 98 },
  { modelId: 3, modelName: "APC Petit New Standard", count: 87 },
  { modelId: 4, modelName: "Nudie Grim Tim", count: 65 },
  { modelId: 5, modelName: "Samurai S710", count: 54 },
  { modelId: 6, modelName: "Pure Blue Japan 013", count: 49 },
  { modelId: 7, modelName: "Momotaro 0105SP", count: 41 },
  { modelId: 8, modelName: "Studio D’Artisan SD-103", count: 37 },
  { modelId: 9, modelName: "Sugar Cane 1947", count: 29 },
  { modelId: 10, modelName: "Resolute 710", count: 24 },
];

export const subscriptionStatsApi = {
  async getTopSubscriptions(): Promise<TopSubscription[]> {
    try {
      const res = await axios.get("/subscriptions/top");

      const data = res.data;

      // API 구조가 무엇이든 배열로 변환
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.content)) return data.content;

      return mockTopSubscriptions;
    } catch (err) {
      console.warn("TopSubscriptions API not ready, using mock data");
      return mockTopSubscriptions;
    }
  },
};
