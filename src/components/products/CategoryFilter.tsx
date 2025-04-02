
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  maxPrice: number;
  onPriceChange: (range: [number, number]) => void;
  showProductTypes?: boolean;
  selectedTypes: string[];
  onTypeChange: (type: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
  priceRange,
  maxPrice,
  onPriceChange,
  showProductTypes = true,
  selectedTypes,
  onTypeChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Filters</h3>
        <div className="border-t border-border"></div>
      </div>

      <Accordion type="multiple" defaultValue={["categories", "price", "type"]}>
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => onCategoryChange(category)}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {showProductTypes && (
          <AccordionItem value="type">
            <AccordionTrigger>Product Type</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {["new", "open-box", "p2p"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={() => onTypeChange(type)}
                    />
                    <Label
                      htmlFor={`type-${type}`}
                      className="text-sm font-normal cursor-pointer capitalize"
                    >
                      {type.replace("-", " ")}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-1">
              <Slider
                defaultValue={priceRange}
                max={maxPrice}
                step={100}
                onValueChange={(values) => onPriceChange(values as [number, number])}
              />
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  ₹{priceRange[0].toLocaleString()}
                </p>
                <p className="text-sm">
                  ₹{priceRange[1].toLocaleString()}
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default CategoryFilter;
