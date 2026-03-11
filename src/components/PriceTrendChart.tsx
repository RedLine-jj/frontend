import { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { BarChart3, TrendingDown, TrendingUp } from 'lucide-react';
import type { SitePriceHistoryDto } from '@/types/api';

const SITE_COLORS = ['#1a1a2e', '#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed'];

type Tab = 'compare' | 'trend' | 'range';

interface PriceTrendChartProps {
  sites: SitePriceHistoryDto[];
}

export default function PriceTrendChart({ sites }: PriceTrendChartProps) {
  const [activeTab, setActiveTab] = useState<Tab>('compare');

  // 최저가 사이트 계산
  const lowestSite = useMemo(() => {
    let best: SitePriceHistoryDto | null = null;
    for (const s of sites) {
      if (s.currentPrice != null && (best == null || s.currentPrice < best.currentPrice!)) {
        best = s;
      }
    }
    return best;
  }, [sites]);

  // 차트 데이터: date → { date, 사이트1: price, 사이트2: price, ... }
  const chartData = useMemo(() => {
    const dateMap = new Map<string, Record<string, number | string>>();
    for (const site of sites) {
      for (const dp of site.history) {
        const row = dateMap.get(dp.date) ?? { date: dp.date };
        row[site.siteName] = dp.price;
        dateMap.set(dp.date, row);
      }
    }
    return Array.from(dateMap.values()).sort((a, b) =>
      (a.date as string).localeCompare(b.date as string)
    );
  }, [sites]);

  // 전체 추이: 전 사이트 평균
  const avgData = useMemo(() => {
    return chartData.map((row) => {
      const prices = sites
        .map((s) => row[s.siteName] as number)
        .filter((p) => p != null);
      return {
        date: row.date,
        avg: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null,
      };
    });
  }, [chartData, sites]);

  // 가격 범위: min-max
  const rangeData = useMemo(() => {
    return chartData.map((row) => {
      const prices = sites
        .map((s) => row[s.siteName] as number)
        .filter((p) => p != null);
      return {
        date: row.date,
        min: prices.length > 0 ? Math.min(...prices) : null,
        max: prices.length > 0 ? Math.max(...prices) : null,
        range: prices.length > 0 ? [Math.min(...prices), Math.max(...prices)] : [0, 0],
      };
    });
  }, [chartData, sites]);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const formatPrice = (v: number) => {
    if (v >= 1000) return `${Math.round(v / 1000)}k`;
    return String(v);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'compare', label: '사이트 비교' },
    { key: 'trend', label: '전체 추이' },
    { key: 'range', label: '가격 범위' },
  ];

  if (sites.length === 0) return null;

  return (
    <div className="glass-card rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4.5 w-4.5 text-muted-foreground" />
          <h2 className="text-base font-semibold font-display text-foreground">가격 추이</h2>
        </div>
        {lowestSite && (
          <p className="text-sm text-muted-foreground">
            최저가:{' '}
            <span className="font-semibold text-foreground">{lowestSite.siteName}</span>{' '}
            <span className="font-semibold font-display text-foreground">
              ₩{lowestSite.currentPrice?.toLocaleString()}
            </span>
          </p>
        )}
      </div>

      {/* 사이트별 현재가 카드 */}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(sites.length, 3)}, 1fr)` }}>
        {sites.map((site, i) => (
          <div key={site.siteName} className="rounded-lg bg-secondary/60 p-3.5 space-y-1">
            <p className="text-xs text-muted-foreground">{site.siteName}</p>
            <p className="text-xl font-bold font-display text-foreground">
              ₩{site.currentPrice?.toLocaleString() ?? '—'}
            </p>
            {site.priceChange != null && (
              <div className={`flex items-center gap-1 text-xs font-medium ${site.priceChange <= 0 ? 'text-primary' : 'text-destructive'}`}>
                {site.priceChange <= 0
                  ? <TrendingDown className="h-3 w-3" />
                  : <TrendingUp className="h-3 w-3" />
                }
                {site.priceChange > 0 ? '+' : ''}₩{site.priceChange.toLocaleString()}
              </div>
            )}
            {site.minPrice != null && site.maxPrice != null && (
              <p className="text-xs text-muted-foreground">
                ₩{site.minPrice.toLocaleString()} ~ ₩{site.maxPrice.toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-t-md ${
              activeTab === tab.key
                ? 'text-foreground border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'compare' ? (
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 88%)" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 11, fill: 'hsl(220 10% 46%)' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={formatPrice}
                tick={{ fontSize: 11, fill: 'hsl(220 10% 46%)' }}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip
                labelFormatter={formatDate}
                formatter={(value: number, name: string) => [`₩${value.toLocaleString()}`, name]}
                contentStyle={{
                  background: 'hsl(0 0% 100%)',
                  border: '1px solid hsl(220 14% 88%)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              {sites.map((site, i) => (
                <Line
                  key={site.siteName}
                  type="monotone"
                  dataKey={site.siteName}
                  stroke={SITE_COLORS[i % SITE_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: SITE_COLORS[i % SITE_COLORS.length] }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />
              ))}
            </LineChart>
          ) : activeTab === 'trend' ? (
            <LineChart data={avgData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 88%)" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 11, fill: 'hsl(220 10% 46%)' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={formatPrice}
                tick={{ fontSize: 11, fill: 'hsl(220 10% 46%)' }}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip
                labelFormatter={formatDate}
                formatter={(value: number) => [`₩${value.toLocaleString()}`, '평균']}
                contentStyle={{
                  background: 'hsl(0 0% 100%)',
                  border: '1px solid hsl(220 14% 88%)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="avg"
                stroke="hsl(216 72% 45%)"
                strokeWidth={2}
                dot={{ r: 3, fill: 'hsl(216 72% 45%)' }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            </LineChart>
          ) : (
            <AreaChart data={rangeData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 88%)" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 11, fill: 'hsl(220 10% 46%)' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={formatPrice}
                tick={{ fontSize: 11, fill: 'hsl(220 10% 46%)' }}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip
                labelFormatter={formatDate}
                formatter={(value: number, name: string) => [
                  `₩${value.toLocaleString()}`,
                  name === 'max' ? '최고' : '최저',
                ]}
                contentStyle={{
                  background: 'hsl(0 0% 100%)',
                  border: '1px solid hsl(220 14% 88%)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="max"
                stroke="hsl(216 72% 45%)"
                fill="hsl(216 60% 94%)"
                strokeWidth={1.5}
                connectNulls
              />
              <Area
                type="monotone"
                dataKey="min"
                stroke="hsl(152 55% 40%)"
                fill="hsl(152 55% 40% / 0.1)"
                strokeWidth={1.5}
                connectNulls
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
