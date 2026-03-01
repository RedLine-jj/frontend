import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchFilterProps {
  query: string;
  filter: string;
  onQueryChange: (q: string) => void;
  onFilterChange: (f: string) => void;
}

const FILTERS = [
  { value: '', label: '전체' },
  { value: 'in_stock', label: '재고 있음' },
  { value: 'sold_out', label: '품절 포함' },
];

export default function SearchFilter({ query, filter, onQueryChange, onFilterChange }: SearchFilterProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="상품명 또는 브랜드 검색..."
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          className="pl-10 h-10 bg-secondary/50 border-border/60 text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-primary/20"
        />
      </div>
      <div className="flex gap-1.5 rounded-lg bg-secondary/50 p-1">
        {FILTERS.map(f => (
          <Button
            key={f.value}
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange(f.value)}
            className={`text-xs font-medium rounded-md transition-all ${
              filter === f.value
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            {f.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
