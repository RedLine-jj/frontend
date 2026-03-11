import * as React from "react";
import { Check, PlusCircle, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
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
  onClearAll: () => void;
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
  onClearAll,
}: SearchFilterProps) {
  const [isBrandPopoverOpen, setBrandPopoverOpen] = React.useState(false);
  const [isTypePopoverOpen, setTypePopoverOpen] = React.useState(false);

  const selectedBrandValues = new Set(selectedBrandIds);
  const selectedTypeValues = new Set(selectedTypes);

  return (
    <div className="flex items-center gap-2">
      {/* --- Brand Filter --- */}
      <Popover open={isBrandPopoverOpen} onOpenChange={setBrandPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="border-dashed">
            <PlusCircle className="mr-2 h-4 w-4" />
            브랜드
            {selectedBrandValues.size > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {selectedBrandValues.size}
                </Badge>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="브랜드 검색..." />
            <CommandList>
              <CommandEmpty>결과가 없습니다.</CommandEmpty>
              <CommandGroup>
                {brands.map((brand) => {
                  const isSelected = selectedBrandValues.has(brand.id);
                  return (
                    <CommandItem
                      key={brand.id}
                      onSelect={() => {
                        onBrandToggle(brand.id);
                      }}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible",
                        )}
                      >
                        <Check className={cn("h-4 w-4")} />
                      </div>
                      <span>{brand.brandNameKo || brand.brandName}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
            {selectedBrandValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={onClearBrands}
                    className="justify-center text-center"
                  >
                    선택 초기화
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      {/* --- Type Filter --- */}
      <Popover open={isTypePopoverOpen} onOpenChange={setTypePopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="border-dashed">
            <PlusCircle className="mr-2 h-4 w-4" />
            상품 타입
            {selectedTypeValues.size > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {selectedTypeValues.size}
                </Badge>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="타입 검색..." />
            <CommandList>
              <CommandEmpty>결과가 없습니다.</CommandEmpty>
              <CommandGroup>
                {modelTypes.map((type) => {
                  const isSelected = selectedTypeValues.has(type.code);
                  return (
                    <CommandItem
                      key={type.code}
                      onSelect={() => {
                        onTypeToggle(type.code);
                      }}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible",
                        )}
                      >
                        <Check className={cn("h-4 w-4")} />
                      </div>
                      <span>{type.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
            {selectedTypeValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={onClearTypes}
                    className="justify-center text-center"
                  >
                    선택 초기화
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      {/* --- Clear All Button --- */}
      {(selectedBrandValues.size > 0 || selectedTypeValues.size > 0) && (
        <Button
          variant="ghost"
          onClick={onClearAll}
          className="h-8 px-2 lg:px-3"
        >
          초기화
          <X className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
