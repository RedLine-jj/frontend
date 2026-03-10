import { useMemo } from "react";
import { Filter, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import type { BrandDto } from "@/types/api";

interface SearchFilterProps {
  brands: BrandDto[];
  selectedBrandIds: number[];
  onBrandToggle: (brandId: number) => void;
  onClearBrands: () => void;
}

const chipBase =
  "inline-flex items-center text-xs font-medium h-8 px-4 rounded-full whitespace-nowrap transition-all duration-200 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

const chipSelected =
  "bg-primary text-primary-foreground shadow-[0_2px_8px_hsl(216_72%_45%/0.3)] scale-[1.03]";

const chipUnselected =
  "bg-transparent text-muted-foreground border border-border/60 hover:border-primary/40 hover:text-primary hover:bg-primary/5";

function BrandChip({
  brand,
  isSelected,
  onClick,
}: {
  brand: BrandDto;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`${chipBase} ${isSelected ? chipSelected : chipUnselected}`}
    >
      {brand.brandNameKo || brand.brandName}
    </button>
  );
}

export default function SearchFilter({
  brands,
  selectedBrandIds,
  onBrandToggle,
  onClearBrands,
}: SearchFilterProps) {
  const { selectedBrands, unselectedBrands } = useMemo(() => {
    const selected = new Set(selectedBrandIds);
    const selectedBrands: BrandDto[] = [];
    const unselectedBrands: BrandDto[] = [];
    brands.forEach((brand) => {
      if (selected.has(brand.id)) {
        selectedBrands.push(brand);
      } else {
        unselectedBrands.push(brand);
      }
    });
    return { selectedBrands, unselectedBrands };
  }, [brands, selectedBrandIds]);

  return (
    <Collapsible className="glass-card rounded-xl">
      <div className="p-4">
        <CollapsibleTrigger className="flex items-center justify-between w-full group">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Filter className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold">브랜드 필터</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedBrandIds.length === 0
                  ? "전체 브랜드"
                  : `${selectedBrandIds.length}개 브랜드 선택됨`}
              </p>
            </div>
          </div>
          <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
        <div className="px-4 pb-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onClearBrands}
              className={`${chipBase} ${
                selectedBrandIds.length === 0 ? chipSelected : chipUnselected
              }`}
            >
              전체
            </button>
            {selectedBrands.map((brand) => (
              <BrandChip
                key={brand.id}
                brand={brand}
                isSelected
                onClick={() => onBrandToggle(brand.id)}
              />
            ))}
          </div>

          {selectedBrands.length > 0 && unselectedBrands.length > 0 && (
            <Separator />
          )}

          <div className="flex flex-wrap gap-2">
            {unselectedBrands.map((brand) => (
              <BrandChip
                key={brand.id}
                brand={brand}
                isSelected={false}
                onClick={() => onBrandToggle(brand.id)}
              />
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
