import { ProductOption } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';

interface OptionsTableProps {
  options: ProductOption[];
  selectable?: boolean;
  selectedIds?: string[];
  onToggle?: (optionId: string) => void;
}

export default function OptionsTable({ options, selectable, selectedIds = [], onToggle }: OptionsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/50 glass-card">
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
          {options.map(opt => (
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
  );
}
