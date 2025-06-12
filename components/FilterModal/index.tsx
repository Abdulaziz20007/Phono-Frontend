import React, { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  CloseButton,
  FormGroup,
  Label,
  Select,
  ToggleContainer,
  ToggleButton,
  ToggleCircle,
  RadioGroup,
  RadioLabel,
  RadioInput,
  RadioText,
  ActionButtons,
  ResetButton,
  ApplyButton,
  PriceRangeContainer,
  PriceInput,
} from "./FilterModal.style";
import {
  FilterModalProps,
  FilterState,
  Brand,
  FilterOption,
  Color,
} from "./types";
import { ColorPicker } from "./components";
import { api } from "../../api/api";

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters,
  homepageData,
}) => {
  const defaultFilterState: FilterState = {
    region: "",
    topAdsOnly: false,
    condition: "",
    brand: "",
    model: "",
    memory: "",
    color: "",
    priceForm: "",
    priceTo: "",
  };

  const [filters, setFilters] = useState<FilterState>(
    initialFilters || defaultFilterState
  );

  const [brands, setBrands] = useState<Brand[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [memoryOptions, setMemoryOptions] = useState<FilterOption[]>([]);
  const [colorOptions, setColorOptions] = useState<Color[]>([]);
  const [models, setModels] = useState<FilterOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  const loadFilterData = async () => {
    if (!isOpen) return;

    setIsLoading(true);
    try {
      // Always fetch fresh data when the modal is opened
      const data = await api.home.getData();

      // Handle brands
      if (data.brands && Array.isArray(data.brands) && data.brands.length > 0) {
        const formattedBrands = data.brands.map((brand) => ({
          id: String(brand.id),
          name: brand.name,
          models: Array.isArray(brand.models)
            ? brand.models.map((model) => ({
                id: String(model.id),
                name: model.name,
              }))
            : [],
        }));
        setBrands(formattedBrands);
      } else {
        setBrands([]);
      }

      // Handle regions
      if (data.regions && Array.isArray(data.regions)) {
        setRegions(data.regions);
      } else {
        setRegions([]);
      }

      // Handle colors
      if (data.colors && Array.isArray(data.colors)) {
        const formattedColors = data.colors.map((color) => ({
          id: color.id,
          name: color.name,
          value: color.hex,
        }));
        setColorOptions(formattedColors);
      } else {
        setColorOptions([]);
      }

      // Set memory options (hardcoded)
      setMemoryOptions([
        { id: "16", name: "16 GB" },
        { id: "32", name: "32 GB" },
        { id: "64", name: "64 GB" },
        { id: "128", name: "128 GB" },
        { id: "256", name: "256 GB" },
        { id: "512", name: "512 GB" },
        { id: "1024", name: "1 TB" },
      ]);
    } catch (error) {
      // Silently fail but set empty arrays as fallback
      setBrands([]);
      setRegions([]);
      setColorOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when modal is opened
  useEffect(() => {
    if (isOpen) {
      loadFilterData();
    }
  }, [isOpen]);

  // Update models when brand changes
  useEffect(() => {
    if (filters.brand) {
      const selectedBrand = brands.find((b) => b.id === filters.brand);
      if (selectedBrand && Array.isArray(selectedBrand.models)) {
        setModels(selectedBrand.models);
      } else {
        setModels([]);
      }
    } else {
      setModels([]);
    }
  }, [filters.brand, brands]);

  const handleInputChange = (
    field: keyof FilterState,
    value: string | boolean
  ) => {
    setFilters((prev) => {
      if (field === "brand") {
        return {
          ...prev,
          [field]: value as string,
          model: "", // Reset model when brand changes
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleToggle = () => {
    setFilters((prev) => ({
      ...prev,
      topAdsOnly: !prev.topAdsOnly,
    }));
  };

  const handleReset = () => {
    setFilters(defaultFilterState);
  };

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters({ ...filters });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>Фильтр</h3>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <FormGroup>
          <Label>Регион</Label>
          <Select
            value={filters.region}
            onChange={(e) => handleInputChange("region", e.target.value)}
            disabled={isLoading || !regions.length}
          >
            <option value="">Не указан</option>
            {regions.map((region) => (
              <option key={region.id} value={String(region.id)}>
                {region.name}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <ToggleContainer>
            <Label>Только ТОР объявления</Label>
            <ToggleButton onClick={handleToggle} $active={filters.topAdsOnly}>
              <ToggleCircle $active={filters.topAdsOnly} />
            </ToggleButton>
          </ToggleContainer>
        </FormGroup>

        <FormGroup>
          <Label>Состояние</Label>
          <RadioGroup>
            <RadioLabel>
              <RadioInput
                type="radio"
                name="condition"
                checked={filters.condition === "new"}
                onChange={() => handleInputChange("condition", "new")}
              />
              <RadioText>Новый</RadioText>
            </RadioLabel>
            <RadioLabel>
              <RadioInput
                type="radio"
                name="condition"
                checked={filters.condition === "used"}
                onChange={() => handleInputChange("condition", "used")}
              />
              <RadioText>Б/У</RadioText>
            </RadioLabel>
          </RadioGroup>
        </FormGroup>

        <FormGroup>
          <Label>Бренд</Label>
          <Select
            value={filters.brand}
            onChange={(e) => handleInputChange("brand", e.target.value)}
            disabled={isLoading || !brands.length}
          >
            <option value="">Выбрать</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </Select>
        </FormGroup>

        {filters.brand && (
          <FormGroup>
            <Label>Модель</Label>
            <Select
              value={filters.model}
              onChange={(e) => handleInputChange("model", e.target.value)}
              disabled={!models.length}
            >
              <option value="">Выбрать модель</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </Select>
          </FormGroup>
        )}

        <FormGroup>
          <Label>Память</Label>
          <Select
            value={filters.memory}
            onChange={(e) => handleInputChange("memory", e.target.value)}
            disabled={isLoading}
          >
            <option value="">Не указан</option>
            {memoryOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Цвет</Label>
          <ColorPicker
            colors={colorOptions}
            selectedColor={filters.color}
            onSelectColor={(colorId: string) =>
              handleInputChange("color", colorId)
            }
          />
        </FormGroup>

        <FormGroup>
          <Label>Цена</Label>
          <PriceRangeContainer>
            <PriceInput
              type="number"
              placeholder="От"
              value={filters.priceForm}
              onChange={(e) => handleInputChange("priceForm", e.target.value)}
            />
            <span>-</span>
            <PriceInput
              type="number"
              placeholder="До"
              value={filters.priceTo}
              onChange={(e) => handleInputChange("priceTo", e.target.value)}
            />
          </PriceRangeContainer>
        </FormGroup>

        <ActionButtons>
          <ResetButton onClick={handleReset}>Сбросить</ResetButton>
          <ApplyButton onClick={handleApply}>Применить</ApplyButton>
        </ActionButtons>
      </ModalContent>
    </ModalOverlay>
  );
};

export default FilterModal;
