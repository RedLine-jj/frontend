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
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && <TableHead className="w-10" />}
            <TableHead>사이즈/옵션</TableHead>
            <TableHead>상태</TableHead>
            <TableHead className="text-right">가격</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {options.map(opt => (
            <TableRow key={opt.optionId}>
              {selectable && (
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(opt.optionId)}
                    onCheckedChange={() => onToggle?.(opt.optionId)}
                  />
                </TableCell>
              )}
              <TableCell>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help font-medium">{opt.displayLabel}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">ID: {opt.optionId}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={opt.status === 'AVAILABLE' ? 'status-available' : 'status-soldout'}
                >
                  {opt.status === 'AVAILABLE' ? '재고 있음' : '품절'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">₩{opt.price.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
