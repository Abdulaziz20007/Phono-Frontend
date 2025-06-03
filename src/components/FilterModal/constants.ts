import { FilterOption, Brand, MockData, Color } from "./types";

export const mockRegions: FilterOption[] = [
  { id: "1", name: "Ташкент" },
  { id: "2", name: "Самарканд" },
  { id: "3", name: "Бухара" },
  { id: "4", name: "Фергана" },
];

export const mockBrands: Brand[] = [
  {
    id: "1",
    name: "Apple",
    models: [
      { id: "101", name: "iPhone SE" },
      { id: "102", name: "iPhone 13" },
      { id: "103", name: "iPhone 14" },
    ],
  },
  {
    id: "2",
    name: "Xiaomi",
    models: [
      { id: "201", name: "Redmi Note 12" },
      { id: "202", name: "Redmi Note 11" },
      { id: "203", name: "Mi 11" },
    ],
  },
  {
    id: "3",
    name: "Samsung",
    models: [
      { id: "301", name: "Galaxy S23" },
      { id: "302", name: "Galaxy A54" },
      { id: "303", name: "Galaxy Z Flip" },
    ],
  },
];

export const mockMemoryOptions: FilterOption[] = [
  { id: "64", name: "64 ГБ" },
  { id: "128", name: "128 ГБ" },
  { id: "256", name: "256 ГБ" },
  { id: "512", name: "512 ГБ" },
];

export const mockColorOptions: Color[] = [
  { name: "White", value: "#ffff" },
  { name: "Black", value: "#000" },
  { name: "Gray", value: "#EBEBEB" },
  { name: "Green", value: "#40A69F" },
  { name: "Orange", value: "#FFB319" },
  { name: "Pink", value: "#FF4E64" },
  { name: "Purple", value: "#5C33CF" },
  { name: "Blue", value: "#3448F0" },
];

export const mockData: MockData = {
  regions: mockRegions,
  brands: mockBrands,
  memoryOptions: mockMemoryOptions,
  colors: mockColorOptions,
};
