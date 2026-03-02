import { SiteOptions } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { ExternalLink, Store } from 'lucide-react';
import { motion } from 'framer-motion';

interface OptionsTableProps {
  siteOptions: SiteOptions[];
  selectable?: boolean;
  selectedIds?: string[];
  onToggle?: (optionId: string) => void;
}

export default function OptionsTable({ siteOptions, selectable, selectedIds = [], onToggle }: OptionsTableProps) {
  return (
    <div className="space-y-4">
      {siteOptions.map((siteGroup, idx) => {
        const availableCount = siteGroup.options.filter(o => o.status === 'AVAILABLE').length;
        const soldOutCount = siteGroup.options.filter(o => o.status === 'SOLD_OUT').length;

        return (
          <motion.div
            key={siteGroup.site}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className="rounded-xl border border-border/50 glass-card overflow-hidden"
          >
            {/* Site Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-secondary/20">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold font-display">{siteGroup.siteLabel}</span>
                <div className="flex gap-1.5 ml-2">
                  {availableCount > 0 && (
                    <Badge variant="outline" className="status-available text-[9px] font-semibold px-1.5 py-0">
                      {availableCount} 재고
                    </Badge>
                  )}
                  {soldOutCount > 0 && (
                    <Badge variant="outline" className="status-soldout text-[9px] font-semibold px-1.5 py-0">
                      {soldOutCount} 품절
                    </Badge>
                  )}
                </div>
              </div>
              <a
                href={siteGroup.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                사이트 방문 <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Options Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    {selectable && <TableHead className="w-10" />}
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">사이즈/옵션</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">상태</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground text-right">가격</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {siteGroup.options.map(opt => (
                    <TableRow key={opt.optionId} className="border-border/30 hover:bg-secondary/30 transition-colors">
                      {selectable && (
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(opt.optionId)}
                            onCheckedChange={() => onToggle?.(opt.optionId)}
                            className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help font-semibold font-display text-sm">{opt.displayLabel}</span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-popover border-border">
                            <p className="text-xs text-popover-foreground">ID: {opt.optionId}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold ${opt.status === 'AVAILABLE' ? 'status-available' : 'status-soldout'}`}
                        >
                          {opt.status === 'AVAILABLE' ? '재고 있음' : '품절'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-sm">₩{opt.price.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
