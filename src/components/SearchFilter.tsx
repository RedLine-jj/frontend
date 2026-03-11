import { useMemo } from "react";
import { Filter, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { BrandDto, ModelTypeDto } from "@/types/api";

// --- PROPS ---
interface SearchFilterProps {
  brands: BrandDto[];
  selectedBrandIds: number[];
  onBrandToggle: (brandId: number) => void;
  onClearBrands: () => void;
  modelTypes: ModelTypeDto[];
  selectedTypes: string[];
  onTypeToggle: (typeCode: string) => void;
  onClearTypes: () => void;
}

// --- STYLES ---
const chipBase =
  "inline-flex items-center text-xs font-medium h-7 px-3 rounded-full whitespace-nowrap transition-all duration-200 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";
const chipSelected =
  "bg-primary text-primary-foreground shadow-sm scale-[1.02]";
const chipUnselected =
  "bg-background text-muted-foreground border border-border/80 hover:border-primary/60 hover:text-primary hover:bg-primary/5";

// --- SUB-COMPONENTS ---
function ChipButton({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`${chipBase} ${isSelected ? chipSelected : chipUnselected}`}
    >
      {label}
    </button>
  );
}

function FilterTabPanel({ children }: { children: React.ReactNode }) {
  return <div className="pt-4 space-y-3">{children}</div>;
}

function ChipGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

// --- MAIN COMPONENT ---
export default function SearchFilter({
  brands,
  selectedBrandIds,
  onBrandToggle,
  onClearBrands,
  modelTypes,
  selectedTypes,
  onTypeToggle,
  onClearTypes,
}: SearchFilterProps) {
  const { selectedBrands, unselectedBrands } = useMemo(() => {
    const selected = new Set(selectedBrandIds);
    const selectedBrands: BrandDto[] = [];
    const unselectedBrands: BrandDto[] = [];
    brands.forEach((brand) =>
      selected.has(brand.id)
        ? selectedBrands.push(brand)
        : unselectedBrands.push(brand),
    );
    return { selectedBrands, unselectedBrands };
  }, [brands, selectedBrandIds]);

  const { selectedModelTypes, unselectedModelTypes } = useMemo(() => {
    const selected = new Set(selectedTypes);
    const selectedModelTypes: ModelTypeDto[] = [];
    const unselectedModelTypes: ModelTypeDto[] = [];
    modelTypes.forEach((type) =>
      selected.has(type.code)
        ? selectedModelTypes.push(type)
        : unselectedModelTypes.push(type),
    );
    return { selectedModelTypes, unselectedModelTypes };
  }, [modelTypes, selectedTypes]);

  const totalFilters = selectedBrandIds.length + selectedTypes.length;

  return (
    <Collapsible className="glass-card rounded-xl">
      <div className="p-4">
        <CollapsibleTrigger className="flex items-center justify-between w-full group">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Filter className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold">필터</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {totalFilters === 0
                  ? "전체"
                  : `${totalFilters}개 필터 적용됨`}
              </p>
            </div>
          </div>
          <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
        <Tabs defaultValue="brands" className="px-4 pb-4">
          <TabsList className="grid w-full grid-cols-2 h-9">
            <TabsTrigger value="brands">
              브랜드
              {selectedBrandIds.length > 0 && <Badge className="ml-2 h-4 px-1.5 text-[10px]">{selectedBrandIds.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="types">
              상품 타입
              {selectedTypes.length > 0 && <Badge className="ml-2 h-4 px-1.5 text-[10px]">{selectedTypes.length}</Badge>}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="brands">
            <FilterTabPanel>
              <ChipGroup>
                <ChipButton label="전체" isSelected={selectedBrandIds.length === 0} onClick={onClearBrands} />
                {selectedBrands.map((brand) => (
                  <ChipButton key={brand.id} label={brand.brandNameKo || brand.brandName} isSelected onClick={() => onBrandToggle(brand.id)} />
                ))}
              </ChipGroup>
              {selectedBrands.length > 0 && unselectedBrands.length > 0 && <Separator />}
              <ChipGroup>
                {unselectedBrands.map((brand) => (
                  <ChipButton key={brand.id} label={brand.brandNameKo || brand.brandName} isSelected={false} onClick={() => onBrandToggle(brand.id)} />
                ))}
              </ChipGroup>
            </FilterTabPanel>
          </TabsContent>

          <TabsContent value="types">
            <FilterTabPanel>
              <ChipGroup>
                <ChipButton label="전체" isSelected={selectedTypes.length === 0} onClick={onClearTypes} />
                {selectedModelTypes.map((type) => (
                  <ChipButton key={type.code} label={type.label} isSelected onClick={() => onTypeToggle(type.code)} />
                ))}
              </ChipGroup>
              {selectedModelTypes.length > 0 && unselectedModelTypes.length > 0 && <Separator />}
              <ChipGroup>
                {unselectedModelTypes.map((type) => (
                  <ChipButton key={type.code} label={type.label} isSelected={false} onClick={() => onTypeToggle(type.code)} />
                ))}
              </ChipGroup>
            </FilterTabPanel>
          </TabsContent>
        </Tabs>
      </CollapsibleContent>
    </Collapsible>
  );
}
