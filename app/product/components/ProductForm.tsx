"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ColorPicker from "@/components/FilterModal/components/ColorPicker";
import {
  fetchAppData,
  fetchCitiesByRegion,
  createProduct,
  updateProduct,
  uploadProductImage,
  api,
  Brand,
  Color,
  Region,
  City,
  Model,
} from "@/api/api";

// types
export interface ProductFormData {
  brand_id?: number;
  model_id?: number;
  brand?: string;
  model?: string;
  releaseYear: string;
  photos: {
    file?: File;
    preview: string;
    isMain: boolean;
    id?: number;
  }[];
  description: string;
  price: string;
  currency: string;
  isNegotiable: boolean;
  condition: "new" | "used" | null;
  hasBox: boolean;
  color: string;
  color_id?: number;
  region: string;
  region_id?: number;
  city: string;
  city_id?: number;
  phone: string;
  memory: string;
  ram: string;
}

export interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  isEdit?: boolean;
}

// styled components
export const FormSection = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 15px;
`;

export const InputGroup = styled.div`
  margin-bottom: 15px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #7c4dff;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #7c4dff;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  font-size: 14px;
  resize: vertical;
  outline: none;

  &:focus {
    border-color: #7c4dff;
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
`;

export const RadioInput = styled.input`
  margin-right: 5px;
`;

export const PhotoUploadContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 15px;
`;

export const PhotoUploadBox = styled.div`
  height: 120px;
  border: 1px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: white;

  &:hover {
    border-color: #7c4dff;
  }
`;

export const PhotoPreview = styled.div<{ $imageUrl: string; $isMain: boolean }>`
  height: 120px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  background-image: ${(props) => `url(${props.$imageUrl})`};
  position: relative;
  border: ${(props) => (props.$isMain ? "3px solid #7c4dff" : "none")};
`;

export const RemovePhotoButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

export const SetMainButton = styled.button`
  position: absolute;
  top: 5px;
  left: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 3px 6px;
  font-size: 10px;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

export const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  border: none;

  &:hover {
    opacity: 0.9;
  }
`;

export const PrimaryButton = styled(Button)`
  background-color: #7c4dff;
  color: white;
`;

export const SecondaryButton = styled(Button)`
  background-color: #e0e0e0;
  color: #333;
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;

  &:after {
    content: " ";
    display: block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 3px solid #7c4dff;
    border-color: #7c4dff transparent #7c4dff transparent;
    animation: spin 1.2s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const defaultFormData: ProductFormData = {
  brand_id: undefined,
  model_id: undefined,
  brand: "",
  model: "",
  releaseYear: "",
  photos: [],
  description: "",
  price: "",
  currency: "uzs",
  isNegotiable: false,
  condition: null,
  hasBox: false,
  color: "",
  color_id: undefined,
  region: "",
  region_id: undefined,
  city: "",
  city_id: undefined,
  phone: "",
  memory: "",
  ram: "",
};

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || defaultFormData
  );
  const [selectedColor, setSelectedColor] = useState(
    initialData?.color_id?.toString() || ""
  );
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // api data
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [phones, setPhones] = useState<string[]>([]);
  const [currencies] = useState(["uzs", "usd"]);

  // fetch initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const data = await fetchAppData();

        setBrands(data.brands || []);
        setColors(data.colors || []);
        setRegions(data.regions || []);

        // fetch user data to get phone numbers
        try {
          const userData = await api.user.me();

          // keep track of unique phone numbers to avoid duplicates
          const uniquePhones = new Set<string>();

          // add main phone number
          if (userData.phone) {
            uniquePhones.add(userData.phone);
          }

          // add any additional phones that aren't already in the set
          if (
            userData.additional_phones &&
            userData.additional_phones.length > 0
          ) {
            userData.additional_phones.forEach((phone: { phone: string }) => {
              if (phone.phone) uniquePhones.add(phone.phone);
            });
          }

          if (uniquePhones.size > 0) {
            setPhones(Array.from(uniquePhones));
          } else {
            // fallback if no phones found
            setPhones(["your phone number not found"]);
          }
        } catch (err) {
          console.error("error fetching user data:", err);
          setPhones(["your phone number not found"]);
        }

        // set default values if available
        if (initialData) {
          setFormData(initialData);
          setSelectedColor(initialData.color_id?.toString() || "");

          // load models for selected brand
          if (initialData.brand_id) {
            const selectedBrand = data.brands.find(
              (b) => b.id === initialData.brand_id
            );
            if (selectedBrand && selectedBrand.models) {
              setModels(selectedBrand.models);
            }
          }

          // load cities for selected region
          if (initialData.region_id) {
            const cities = await fetchCitiesByRegion(initialData.region_id);
            setCities(cities);
          }
        }
      } catch (error) {
        console.error("error loading initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [initialData]);

  // load cities when region changes
  useEffect(() => {
    const loadCities = async () => {
      if (formData.region_id) {
        try {
          const cities = await fetchCitiesByRegion(formData.region_id);
          setCities(cities);
        } catch (error) {
          console.error("error loading cities:", error);
        }
      } else {
        setCities([]);
      }
    };

    loadCities();
  }, [formData.region_id]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "brand_id" && value) {
      const brandId = Number(value);
      const selectedBrand = brands.find((b) => b.id === brandId);

      setFormData({
        ...formData,
        brand_id: brandId,
        brand: selectedBrand?.name || "",
        model_id: undefined,
        model: "",
      });

      // load models for selected brand
      if (selectedBrand && selectedBrand.models) {
        setModels(selectedBrand.models);
      }
    } else if (name === "model_id" && value) {
      const modelId = Number(value);
      const selectedModel = models.find((m) => m.id === modelId);

      setFormData({
        ...formData,
        model_id: modelId,
        model: selectedModel?.name || "",
      });
    } else if (name === "region_id" && value) {
      const regionId = Number(value);
      const selectedRegion = regions.find((r) => r.id === regionId);

      setFormData({
        ...formData,
        region_id: regionId,
        region: selectedRegion?.name || "",
        city_id: undefined,
        city: "",
      });
    } else if (name === "city_id" && value) {
      const cityId = Number(value);
      const selectedCity = cities.find((c) => c.id === cityId);

      setFormData({
        ...formData,
        city_id: cityId,
        city: selectedCity?.name || "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleRadioChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleColorSelect = (colorValue: string) => {
    const selectedColorObj = colors.find((c) => c.id.toString() === colorValue);

    setSelectedColor(colorValue);
    setFormData({
      ...formData,
      color: selectedColorObj?.hex || "",
      color_id: selectedColorObj?.id,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      try {
        setUploading(true);

        // Create a local preview URL
        const previewUrl = URL.createObjectURL(file);

        // Determine if this is the first and only image (make it main)
        const isMainImage = formData.photos.length === 0;

        setFormData({
          ...formData,
          photos: [
            ...formData.photos,
            {
              file: file,
              preview: previewUrl,
              isMain: isMainImage,
            },
          ],
        });
      } catch (error) {
        console.error("error handling image:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = [...formData.photos];

    // If removing the main image, set the first remaining image as main
    const wasMain = updatedPhotos[index].isMain;
    updatedPhotos.splice(index, 1);

    if (wasMain && updatedPhotos.length > 0) {
      updatedPhotos[0].isMain = true;
    }

    setFormData({
      ...formData,
      photos: updatedPhotos,
    });
  };

  const handleSetMainPhoto = (index: number) => {
    const updatedPhotos = formData.photos.map((photo, i) => ({
      ...photo,
      isMain: i === index,
    }));

    setFormData({
      ...formData,
      photos: updatedPhotos,
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormSection>
        <InputGroup>
          <Label>Выберите бренд телефона</Label>
          <Select
            name="brand_id"
            value={formData.brand_id || ""}
            onChange={handleInputChange}
          >
            <option value="">Выберите бренд телефона</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </Select>
        </InputGroup>

        <InputGroup>
          <Label>Выберите модель</Label>
          <Select
            name="model_id"
            value={formData.model_id || ""}
            onChange={handleInputChange}
            disabled={!formData.brand_id}
          >
            <option value="">Выберите модель телефона</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </Select>
        </InputGroup>
      </FormSection>

      <FormSection>
        <InputGroup>
          <Label>Год выпуска</Label>
          <Select
            name="releaseYear"
            value={formData.releaseYear}
            onChange={handleInputChange}
          >
            <option value="">Выберите год выпуска</option>
            {Array.from(
              { length: 15 },
              (_, i) => new Date().getFullYear() - i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </InputGroup>
      </FormSection>

      <FormSection>
        <SectionTitle>Добавить фото</SectionTitle>
        <PhotoUploadContainer>
          <PhotoUploadBox>
            <label
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span>Добавить фото</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhotoUpload}
                disabled={uploading}
              />
              {uploading && <small>Загрузка...</small>}
            </label>
          </PhotoUploadBox>

          {formData.photos.map((photo, index) => (
            <PhotoPreview
              key={index}
              $imageUrl={photo.preview}
              $isMain={photo.isMain}
            >
              <RemovePhotoButton onClick={() => handleRemovePhoto(index)}>
                ✕
              </RemovePhotoButton>
              <SetMainButton onClick={() => handleSetMainPhoto(index)}>
                Главная
              </SetMainButton>
            </PhotoPreview>
          ))}

          {/* placeholder boxes */}
          {Array.from({ length: Math.max(0, 7 - formData.photos.length) }).map(
            (_, index) => (
              <PhotoUploadBox key={`empty-${index}`} />
            )
          )}
        </PhotoUploadContainer>
      </FormSection>

      <FormSection>
        <SectionTitle>Описание</SectionTitle>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Напишите что-нибудь..."
          maxLength={5000}
        />
        <div style={{ textAlign: "right", fontSize: "12px", color: "#888" }}>
          Макс 5000 символов
        </div>
      </FormSection>

      <FormSection>
        <SectionTitle>Цена</SectionTitle>
        <InputGroup>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Цена"
          />
        </InputGroup>

        <InputGroup>
          <Select
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency.toUpperCase()}
              </option>
            ))}
          </Select>
        </InputGroup>

        <InputGroup>
          <Label>Цена договорная?</Label>
          <RadioGroup>
            <RadioLabel>
              <RadioInput
                type="radio"
                name="isNegotiable"
                checked={!formData.isNegotiable}
                onChange={() => handleRadioChange("isNegotiable", false)}
              />
              Ждут цену
            </RadioLabel>
            <RadioLabel>
              <RadioInput
                type="radio"
                name="isNegotiable"
                checked={formData.isNegotiable}
                onChange={() => handleRadioChange("isNegotiable", true)}
              />
              Да, договорная
            </RadioLabel>
          </RadioGroup>
        </InputGroup>
      </FormSection>

      <FormSection>
        <SectionTitle>Состояние</SectionTitle>
        <RadioGroup>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="condition"
              checked={formData.condition === "new"}
              onChange={() => handleRadioChange("condition", "new")}
            />
            Новый
          </RadioLabel>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="condition"
              checked={formData.condition === "used"}
              onChange={() => handleRadioChange("condition", "used")}
            />
            Б/у
          </RadioLabel>
        </RadioGroup>
      </FormSection>

      <FormSection>
        <SectionTitle>Коробка с документами</SectionTitle>
        <RadioGroup>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="hasBox"
              checked={formData.hasBox}
              onChange={() => handleRadioChange("hasBox", true)}
            />
            Есть
          </RadioLabel>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="hasBox"
              checked={!formData.hasBox}
              onChange={() => handleRadioChange("hasBox", false)}
            />
            Нет
          </RadioLabel>
        </RadioGroup>
      </FormSection>

      <FormSection>
        <SectionTitle>Цвет телефона</SectionTitle>
        <ColorPicker
          colors={colors.map((color) => ({
            id: color.id,
            name: color.name,
            value: color.hex,
          }))}
          selectedColor={selectedColor}
          onSelectColor={handleColorSelect}
        />
      </FormSection>

      <FormSection>
        <SectionTitle>Адрес продажи</SectionTitle>
        <InputGroup>
          <Label>Выберите регион</Label>
          <Select
            name="region_id"
            value={formData.region_id || ""}
            onChange={handleInputChange}
          >
            <option value="">Выберите регион</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </Select>
        </InputGroup>
      </FormSection>

      <FormSection>
        <SectionTitle>Номер телефона</SectionTitle>
        {phones.map((phone, index) => (
          <RadioGroup key={phone}>
            <RadioLabel>
              <RadioInput
                type="radio"
                name="phone"
                checked={formData.phone === phone}
                onChange={() => handleRadioChange("phone", phone)}
              />
              {phone}
            </RadioLabel>
          </RadioGroup>
        ))}
      </FormSection>

      <FormSection>
        <SectionTitle>Характеристики</SectionTitle>
        <InputGroup>
          <Label>Объем памяти (ГБ)</Label>
          <Select
            name="memory"
            value={formData.memory}
            onChange={handleInputChange}
          >
            <option value="">Выберите объем памяти</option>
            {[16, 32, 64, 128, 256, 512, 1024].map((size) => (
              <option key={size} value={size.toString()}>
                {size} ГБ
              </option>
            ))}
          </Select>
        </InputGroup>

        <InputGroup>
          <Label>Оперативная память (ГБ)</Label>
          <Select name="ram" value={formData.ram} onChange={handleInputChange}>
            <option value="">Выберите объем RAM</option>
            {[1, 2, 3, 4, 6, 8, 12, 16].map((size) => (
              <option key={size} value={size.toString()}>
                {size} ГБ
              </option>
            ))}
          </Select>
        </InputGroup>
      </FormSection>

      <ButtonGroup>
        <SecondaryButton type="button" onClick={() => console.log("preview")}>
          Предпросмотр
        </SecondaryButton>
        <PrimaryButton type="submit">
          {isEdit ? "Сохранить изменения" : "Опубликовать"}
        </PrimaryButton>
      </ButtonGroup>
    </form>
  );
};

export default ProductForm;
