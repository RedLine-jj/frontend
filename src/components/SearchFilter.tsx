import { Filter } from 'lucide-react';
import type { BrandDto } from '@/types/api';

interface SearchFilterProps {
  brands: BrandDto[];
  selectedBrandId: number | undefined;
  onBrandChange: (brandId: number | undefined) => void;
}

const chipBase = [
  'inline-flex items-center text-xs font-medium h-8 px-4 rounded-full',
  'whitespace-nowrap transition-all duration-200 ease-out cursor-pointer',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
].join(' ');

const chipSelected = [
  'bg-primary text-primary-foreground',
  'shadow-[0_2px_8px_hsl(216_72%_45%/0.3)]',
  'scale-[1.03]',
].join(' ');

const chipUnselected = [
  'bg-transparent text-muted-foreground',
  'border border-border/60',
  'hover:border-primary/40 hover:text-primary hover:bg-primary/5',
].join(' ');

export default function SearchFilter({ brands, selectedBrandId, onBrandChange }: SearchFilterProps) {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 mt-0.5">
          <Filter className="h-4 w-4 text-primary" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onBrandChange(undefined)}
            className={`${chipBase} ${selectedBrandId === undefined ? chipSelected : chipUnselected}`}
          >
            전체
          </button>
          {brands.map(brand => (
            <button
              key={brand.id}
              onClick={() => onBrandChange(brand.id)}
              className={`${chipBase} ${selectedBrandId === brand.id ? chipSelected : chipUnselected}`}
            >
              {brand.brandNameKo || brand.brandName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
