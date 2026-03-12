export interface RecentRestock {
  modelId: number;
  modelName: string;
  siteName: string;
  restockedAt: string;
}

const mockRestocks: RecentRestock[] = [
  {
    modelId: 1,
    modelName: "Levi's 501",
    siteName: "END Clothing",
    restockedAt: "2026-03-11T11:58:00Z",
  },
  {
    modelId: 2,
    modelName: "Iron Heart 634",
    siteName: "SSENSE",
    restockedAt: "2026-03-11T11:45:00Z",
  },
  {
    modelId: 3,
    modelName: "APC Petit New Standard",
    siteName: "MR PORTER",
    restockedAt: "2026-03-11T11:20:00Z",
  },
  {
    modelId: 4,
    modelName: "Nudie Grim Tim",
    siteName: "END Clothing",
    restockedAt: "2026-03-11T10:55:00Z",
  },
  {
    modelId: 5,
    modelName: "Levi's 505",
    siteName: "SSENSE",
    restockedAt: "2026-03-11T10:40:00Z",
  },
  {
    modelId: 6,
    modelName: "Iron Heart 777",
    siteName: "Blue Owl",
    restockedAt: "2026-03-11T10:25:00Z",
  },
  {
    modelId: 7,
    modelName: "APC Standard",
    siteName: "MR PORTER",
    restockedAt: "2026-03-11T10:10:00Z",
  },
  {
    modelId: 8,
    modelName: "Nudie Lean Dean",
    siteName: "END Clothing",
    restockedAt: "2026-03-11T09:55:00Z",
  },
  {
    modelId: 9,
    modelName: "Samurai S710",
    siteName: "Blue Owl",
    restockedAt: "2026-03-11T09:40:00Z",
  },
  {
    modelId: 10,
    modelName: "Pure Blue Japan 013",
    siteName: "Self Edge",
    restockedAt: "2026-03-11T09:20:00Z",
  },
];

export const restocksApi = {
  async getRecentRestocks(): Promise<RecentRestock[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockRestocks;
  },
};
