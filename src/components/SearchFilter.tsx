import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import type { BrandDto } from '@/types/api';

interface SearchFilterProps {
  brands: BrandDto[];
  selectedBrandId: number | undefined;
  onBrandChange: (brandId: number | undefined) => void;
}

export default function SearchFilter({ brands, selectedBrandId, onBrandChange }: SearchFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div className="flex gap-1 rounded-lg bg-secondary p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onBrandChange(undefined)}
          className={`text-xs h-7 px-3 rounded-md transition-all whitespace-nowrap ${
            selectedBrandId === undefined
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          전체
        </Button>
        {brands.map(brand => (
          <Button
            key={brand.id}
            variant="ghost"
            size="sm"
            onClick={() => onBrandChange(brand.id)}
            className={`text-xs h-7 px-3 rounded-md transition-all whitespace-nowrap ${
              selectedBrandId === brand.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {brand.brandNameKo || brand.brandName}
          </Button>
        ))}
      </div>
    </div>
  );
}
