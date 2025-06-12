"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import ProductForm, { ProductFormData } from "../components/ProductForm";
import { createProduct, api } from "@/api/api";
import Header from "@/components/Header/Header";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const ErrorAlert = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #7c4dff;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  position: absolute;
  top: 60%;
  color: white;
  text-align: center;
  width: 100%;
  font-size: 16px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 18px;
`;

const ProductCreatePage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          router.push("/auth");
          return;
        }

        await api.user.me();
        setIsAuthenticated(true);
      } catch (err) {
        console.error("authentication check failed:", err);
        router.push("/auth");
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      setLoading(true);
      setError(null);

      // Prepare product data for API
      const productData = {
        title: `${formData.brand} ${formData.model}`,
        description: formData.description,
        price: parseInt(formData.price),
        currency_id: formData.currency === "usd" ? 1 : 2,
        brand_id: formData.brand_id,
        model_id: formData.model_id,
        color_id: formData.color_id,
        memory: parseInt(formData.memory) || 0,
        ram: parseInt(formData.ram) || 0,
        year: parseInt(formData.releaseYear),
        category_id: 1, // assuming 1 for phones
        // Add back the required fields
        floor_price: formData.isNegotiable,
        is_new: formData.condition === "new",
        has_document: formData.hasBox,
        address_id: formData.city_id || 1, // default to 1 if not selected
        phone_id: 1, // default value since we don't have a way to select it yet
        storage: parseInt(formData.memory) || 0, // same as memory
      };

      console.log("creating product:", productData);
      const createdProduct = await api.product.create(productData);

      // If product was created and has photos to upload
      if (createdProduct && createdProduct.id && formData.photos.length > 0) {
        setLoadingText("загрузка фотографий...");

        // Find the main image among new photos
        const mainPhotoIndex = formData.photos.findIndex(
          (photo) => photo.isMain
        );
        const effectiveMainIndex = mainPhotoIndex >= 0 ? mainPhotoIndex : 0;

        // Upload each new image
        for (let i = 0; i < formData.photos.length; i++) {
          const photo = formData.photos[i];
          if (!photo.file) continue;

          try {
            // Use the api method instead of direct fetch
            await api.product.uploadProductImage(
              createdProduct.id,
              photo.file,
              i === effectiveMainIndex
            );
          } catch (uploadError) {
            console.error("error uploading image:", uploadError);
            // Continue with other images even if one fails
          }
        }
      }

      // redirect to profile page on success
      router.push("/profile");
    } catch (err) {
      console.error("error creating product:", err);
      setError(
        "произошла ошибка при создании объявления. пожалуйста, попробуйте еще раз."
      );
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  // Display loading state or redirect while checking authentication
  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <PageContainer>
          <LoadingContainer>Проверка аутентификации...</LoadingContainer>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Header />
      <PageContainer>
        <PageTitle>Создать объявление</PageTitle>

        {error && <ErrorAlert>{error}</ErrorAlert>}

        <ProductForm onSubmit={handleSubmit} isEdit={false} />

        {loading && (
          <LoadingOverlay>
            <LoadingSpinner />
            <LoadingText>{loadingText}</LoadingText>
          </LoadingOverlay>
        )}
      </PageContainer>
    </>
  );
};

export default ProductCreatePage;
