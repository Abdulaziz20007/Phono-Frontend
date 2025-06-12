import React from "react";
import { HomepageData } from "../../api/types";

export interface FilterOption {
  id: string;
  name: string;
}

export interface Brand extends FilterOption {
  models: FilterOption[];
}

export interface Color {
  id: number;
  name: string;
  value: string;
}

export interface FilterState {
  region: string;
  topAdsOnly: boolean;
  condition: string;
  brand: string;
  model: string;
  memory: string;
  color: string;
  priceForm: string;
  priceTo: string;
}

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: FilterState) => void;
  initialFilters?: FilterState;
  homepageData?: HomepageData | null;
}

export interface MockData {
  regions: FilterOption[];
  brands: Brand[];
  memoryOptions: FilterOption[];
  colors: Color[];
}

export interface SearchInputContainerProps {
  children: React.ReactNode;
}

export type BrandType = "apple" | "samsung" | "huawei" | "xiaomi" | "";
export type ConditionType = "new" | "used" | "refurbished" | "";

export interface FilterQuery {
  brand?: string;
  model?: string;
  priceFrom?: number;
  priceTo?: number;
  condition?: string;
  color?: string;
  region?: string;
  topAdsOnly?: boolean;
  memory?: string;
  page?: number;
  limit?: number;
}

export interface ColorOptionProps {
  selected: boolean;
}
