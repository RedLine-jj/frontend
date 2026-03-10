import { useState, useMemo } from 'react';
import { PriceHistoryEntry } from '@/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, BarChart3 } from 'lucide-react';

interface PriceChartProps {
  data: PriceHistoryEntry[];
  listPrice: number;
}

const SITE_COLORS: Record<string, string> = {
  modeman: 'hsl(216 72% 45%)',
  musinsa: 'hsl(220 15% 28%)',
  '29cm': 'hsl(152 55% 40%)',
};

const SITE_LABELS: Record<string, string> = {
  modeman: '모드맨',
  musinsa: '무신사',
  '29cm': '29CM',
};

export default function PriceChart({ data, listPrice }: PriceChartProps) {
  const [view, setView] = useState<'combined' | 'compare' | 'trend'>('combined');

  const sites = useMemo(() => [...new Set(data.map(d => d.site))], [data]);

  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    sites.forEach(site => {
      config[site] = { label: SITE_LABELS[site] || site, color: SITE_COLORS[site] || 'hsl(var(--primary))' };
    });
    return config;
  }, [sites]);

  const combinedData = useMemo(() => {
    const dateMap = new Map<string, Record<string, number | string>>();
    data.forEach(entry => {
      if (!dateMap.has(entry.date)) dateMap.set(entry.date, { date: entry.date });
      dateMap.get(entry.date)![entry.site] = entry.price;
    });
    return Array.from(dateMap.values()).sort((a, b) => (a.date as string).localeCompare(b.date as string));
  }, [data]);

  const stats = useMemo(() => {
    return sites.map(site => {
      const prices = data.filter(d => d.site === site).map(d => d.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const current = prices[prices.length - 1];
      const prev = prices[prices.length - 2] ?? current;
      return { site, label: SITE_LABELS[site], min, max, current, diff: current - prev };
    });
  }, [data, sites]);

  const lowestNow = useMemo(() => {
    const currents = stats.map(s => ({ site: s.label, price: s.current }));
    return currents.reduce((a, b) => a.price < b.price ? a : b);
  }, [stats]);

  const formatPrice = (v: number) => `₩${v.toLocaleString()}`;
  const formatDate = (v: string) => {
    const d = new Date(v);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="glass-card rounded-xl p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold font-display text-foreground">가격 추이</h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">최저가:</span>
          <span className="font-semibold text-success">{lowestNow.site} {formatPrice(lowestNow.price)}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {stats.map(s => (
          <div key={s.site} className="rounded-lg bg-secondary p-3 space-y-1">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className="text-sm font-bold text-foreground">{formatPrice(s.current)}</p>
            <div className="flex items-center gap-1">
              {s.diff < 0 ? (
                <TrendingDown className="h-3 w-3 text-success" />
              ) : s.diff > 0 ? (
                <TrendingUp className="h-3 w-3 text-destructive" />
              ) : null}
              <span className={`text-[10px] font-medium ${s.diff < 0 ? 'text-success' : s.diff > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {s.diff === 0 ? '변동없음' : `${s.diff > 0 ? '+' : ''}${formatPrice(s.diff)}`}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {formatPrice(s.min)} ~ {formatPrice(s.max)}
            </p>
          </div>
        ))}
      </div>

      <Tabs value={view} onValueChange={v => setView(v as any)}>
        <TabsList className="h-8">
          <TabsTrigger value="combined" className="text-xs h-6 px-3">사이트 비교</TabsTrigger>
          <TabsTrigger value="trend" className="text-xs h-6 px-3">전체 추이</TabsTrigger>
          <TabsTrigger value="compare" className="text-xs h-6 px-3">가격 범위</TabsTrigger>
        </TabsList>

        <TabsContent value="combined" className="mt-3">
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <LineChart data={combinedData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 88%)" />
              <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 10, fill: 'hsl(220 10% 46%)' }} />
              <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10, fill: 'hsl(220 10% 46%)' }} domain={['dataMin - 5000', 'dataMax + 5000']} />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatPrice(value as number)} />} />
              {sites.map(site => (
                <Line key={site} type="monotone" dataKey={site} stroke={SITE_COLORS[site]} strokeWidth={2} dot={{ r: 2.5, fill: SITE_COLORS[site] }} activeDot={{ r: 4 }} />
              ))}
            </LineChart>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="trend" className="mt-3">
          <ChartContainer config={{ avg: { label: '평균가', color: 'hsl(var(--primary))' } }} className="h-[220px] w-full">
            <AreaChart
              data={combinedData.map(row => {
                const prices = sites.map(s => (row[s] as number) ?? 0).filter(Boolean);
                return { date: row.date, avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) };
              })}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(216 72% 45%)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(216 72% 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 88%)" />
              <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 10, fill: 'hsl(220 10% 46%)' }} />
              <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10, fill: 'hsl(220 10% 46%)' }} domain={['dataMin - 5000', 'dataMax + 5000']} />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatPrice(value as number)} />} />
              <Area type="monotone" dataKey="avg" stroke="hsl(216 72% 45%)" fill="url(#avgGrad)" strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="compare" className="mt-3">
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <AreaChart data={combinedData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                {sites.map(site => (
                  <linearGradient key={site} id={`grad-${site}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={SITE_COLORS[site]} stopOpacity={0.12} />
                    <stop offset="100%" stopColor={SITE_COLORS[site]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 88%)" />
              <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 10, fill: 'hsl(220 10% 46%)' }} />
              <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10, fill: 'hsl(220 10% 46%)' }} domain={['dataMin - 5000', 'dataMax + 5000']} />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatPrice(value as number)} />} />
              {sites.map(site => (
                <Area key={site} type="monotone" dataKey={site} stroke={SITE_COLORS[site]} fill={`url(#grad-${site})`} strokeWidth={2} />
              ))}
            </AreaChart>
          </ChartContainer>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
