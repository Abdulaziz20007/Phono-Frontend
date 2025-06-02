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
  ResetColor,
  ActionButtons,
  ResetButton,
  ApplyButton,
} from "./FilterModal.style";
import {
  FilterModalProps,
  FilterState,
  Brand,
  FilterOption,
  Color,
} from "./types";
import { mockData } from "./constants";
import { ColorPicker } from "./components";

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
}) => {
  const initialFilterState: FilterState = {
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
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [regions, setRegions] = useState<FilterOption[]>([]);
  const [memoryOptions, setMemoryOptions] = useState<FilterOption[]>([]);
  const [colorOptions, setColorOptions] = useState<Color[]>([]);
  const [models, setModels] = useState<FilterOption[]>([]);
  const [isLoading, setIsLoading] = useState({
    regions: true,
    brands: true,
    memory: true,
    colors: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setRegions(mockData.regions);
        setBrands(mockData.brands);
        setMemoryOptions(mockData.memoryOptions);
        setColorOptions(mockData.colors); // Assuming colors exist in mockData

        setIsLoading({
          regions: false,
          brands: false,
          memory: false,
          colors: false,
        });
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (filters.brand) {
      const selectedBrand = brands.find((b) => b.id === filters.brand);
      setModels(selectedBrand?.models || []);
      setFilters((prev) => ({ ...prev, model: "" }));
    } else {
      setModels([]);
    }
  }, [filters.brand, brands]);

  const handleInputChange = (
    field: keyof FilterState,
    value: string | boolean
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleToggle = () => {
    setFilters((prev) => ({
      ...prev,
      topAdsOnly: !prev.topAdsOnly,
    }));
  };

  const handleReset = () => {
    setFilters(initialFilterState);
  };

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters(filters);
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
            disabled={isLoading.regions}
          >
            <option value="">Не указан</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <ToggleContainer>
            <Label>Только ТОР объявления</Label>
            <ToggleButton onClick={handleToggle} active={filters.topAdsOnly}>
              <ToggleCircle active={filters.topAdsOnly} />
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
            disabled={isLoading.brands}
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
            disabled={isLoading.memory}
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
            onSelectColor={(colorValue) =>
              handleInputChange("color", colorValue)
            }
          />
         
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
