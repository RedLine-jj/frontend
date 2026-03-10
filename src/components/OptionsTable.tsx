import { SiteOptions } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { ExternalLink, ChevronDown, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface OptionsTableProps {
  siteOptions: SiteOptions[];
  selectable?: boolean;
  selectedIds?: string[];
  onToggle?: (optionId: string) => void;
}

export default function OptionsTable({ siteOptions, selectable, selectedIds = [], onToggle }: OptionsTableProps) {
  const [expandedLabel, setExpandedLabel] = useState<string | null>(null);

  const allLabels = Array.from(
    new Set(siteOptions.flatMap(s => s.options.map(o => o.displayLabel)))
  );

  return (
    <div className="space-y-1.5">
      {allLabels.map((label) => {
        const isExpanded = expandedLabel === label;
        const sitesForLabel = siteOptions.map(sg => ({
          ...sg,
          option: sg.options.find(o => o.displayLabel === label),
        }));
        const availableSites = sitesForLabel.filter(s => s.option?.status === 'AVAILABLE').length;
        const totalSites = sitesForLabel.filter(s => s.option).length;

        return (
          <div key={label} className="rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setExpandedLabel(isExpanded ? null : label)}
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {selectable && (
                  <Checkbox
                    checked={sitesForLabel.some(s => s.option && selectedIds.includes(s.option.optionId))}
                    onCheckedChange={() => {
                      sitesForLabel.forEach(s => {
                        if (s.option) onToggle?.(s.option.optionId);
                      });
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <span className="font-semibold font-display text-sm text-foreground">{label}</span>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-medium ${availableSites > 0 ? 'status-available' : 'status-soldout'}`}
                >
                  {availableSites}/{totalSites} 사이트
                </Badge>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-border"
                >
                  <div className="divide-y divide-border">
                    {sitesForLabel.map(({ site, siteLabel, siteUrl, option }) => {
                      if (!option) return null;
                      return (
                        <div key={site} className="flex items-center justify-between px-4 py-2 hover:bg-secondary/30 transition-colors">
                          <div className="flex items-center gap-2">
                            {selectable && (
                              <Checkbox
                                checked={selectedIds.includes(option.optionId)}
                                onCheckedChange={() => onToggle?.(option.optionId)}
                              />
                            )}
                            <Store className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm text-foreground">{siteLabel}</span>
                            <Badge
                              variant="outline"
                              className={`text-[9px] ${option.status === 'AVAILABLE' ? 'status-available' : 'status-soldout'}`}
                            >
                              {option.status === 'AVAILABLE' ? '재고' : '품절'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-sm font-medium text-foreground cursor-help">₩{option.price.toLocaleString()}</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">ID: {option.optionId}</p>
                              </TooltipContent>
                            </Tooltip>
                            <a
                              href={siteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
