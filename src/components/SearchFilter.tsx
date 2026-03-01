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
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="상품명 또는 브랜드 검색..."
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex gap-1.5">
        {FILTERS.map(f => (
          <Button
            key={f.value}
            variant={filter === f.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
