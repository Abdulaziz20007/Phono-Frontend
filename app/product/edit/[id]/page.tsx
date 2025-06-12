"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styled from "styled-components";
import {
  getProductById,
  api,
  deleteProductImage,
  setMainProductImage,
} from "@/api/api";
import Header from "@/components/Header/Header";
import ProductForm, { ProductFormData } from "../../components/ProductForm";
import { useUser } from "@/context/UserContext";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 18px;
`;

const ErrorContainer = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #e0e0e0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #d0d0d0;
  }
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

const AuthCheckText = styled.div`
  text-align: center;
`;

const ProductEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<ProductFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState<string>("");
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated - now with client-only rendering
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        console.log("Checking authentication...");
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.log("No token found, redirecting to auth page");
          if (isMounted) {
            router.push("/auth");
          }
          return;
        }

        console.log("Token found, verifying with API...");
        await api.user.me();
        console.log("Authentication successful");
        if (isMounted) {
          setIsAuthenticated(true);
          setIsAuthChecking(false);
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        if (isMounted) {
          router.push("/auth");
        }
      }
    };

    // Only run on client-side to prevent hydration issues
    if (typeof window !== "undefined") {
      checkAuth();
    }

    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    // Only fetch product if authenticated
    if (!isAuthenticated || isAuthChecking) {
      console.log(
        "Not fetching product yet. isAuthenticated:",
        isAuthenticated,
        "isAuthChecking:",
        isAuthChecking
      );
      return;
    }

    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const fetchProduct = async () => {
      try {
        console.log("Starting product fetch for ID:", productId);
        setLoading(true);
        if (!productId) {
          console.log("No product ID, redirecting");
          router.push("/auth");
          return;
        }

        console.log("Fetching product data from API...");
        const productData = await getProductById(Number(productId));
        console.log("Product data received:", productData);

        if (!isMounted) {
          console.log("Component unmounted, not updating state");
          return;
        }

        // Check if the current user is the owner of this product
        try {
          const currentUser = await api.user.me();
          if (productData.user_id !== currentUser.id) {
            console.log("Unauthorized: Current user is not the product owner");
            if (isMounted) {
              setError("У вас нет прав на редактирование этого объявления");
              router.push("/profile");
            }
            return;
          }
        } catch (userErr) {
          console.error("Error checking user ownership:", userErr);
          if (isMounted) {
            setError("Не удалось проверить права доступа");
            router.push("/profile");
          }
          return;
        }

        // map api data to form data
        const formData: ProductFormData = {
          brand_id: productData.brand_id,
          model_id: productData.model_id,
          brand: productData.brand?.name || "",
          model: productData.model?.name || "",
          releaseYear: productData.year ? String(productData.year) : "",
          photos: productData.images
            ? productData.images.map((img, index) => ({
                preview: img.url,
                isMain: img.is_main || index === 0,
                file: undefined,
                id: img.id, // Store the image ID for deletion or making it main
              }))
            : [],
          description: productData.description || "",
          price: productData.price ? String(productData.price) : "",
          currency: productData.currency_id === 1 ? "usd" : "uzs",
          isNegotiable: Boolean(productData.floor_price),
          condition: productData.is_new ? "new" : "used",
          hasBox: Boolean(productData.has_document),
          color: productData.color_id ? productData.color?.hex || "" : "",
          color_id: productData.color_id,
          region: "", // will be populated from address if available
          region_id: productData.address_id ? undefined : undefined, // would need to map from address
          city: "", // will be populated from address if available
          city_id: productData.address_id,
          phone: "", // would need to map from user phones
          memory: productData.storage ? String(productData.storage) : "",
          ram: productData.ram ? String(productData.ram) : "",
        };

        console.log("Setting product data in state");
        setProduct(formData);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);

        if (retryCount < maxRetries) {
          console.log(
            `Retrying product fetch (${retryCount + 1}/${maxRetries})...`
          );
          retryCount++;
          setTimeout(fetchProduct, 1000); // retry after 1 second
          return;
        }

        if (isMounted) {
          setError(
            "Не удалось загрузить данные продукта. Пожалуйста, попробуйте позже."
          );
        }
      } finally {
        if (isMounted) {
          console.log("Product fetch complete, setting loading to false");
          setLoading(false);
        }
      }
    };

    if (productId) {
      console.log("Product ID exists, starting fetch");
      fetchProduct();
    }

    return () => {
      isMounted = false;
    };
  }, [productId, isAuthenticated, isAuthChecking, router]);

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      setSubmitting(true);
      setLoadingText("Обновление объявления...");
      setError(null);

      // Step 1: Update product data
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
        address_id: formData.city_id ? Number(formData.city_id) : 1, // default to 1 if not selected
        phone_id: 1, // default value since we don't have a way to select it yet
        storage: parseInt(formData.memory) || 0, // same as memory
      };

      console.log("Updating product:", productId, productData);

      await api.product.update(Number(productId), productData);

      // Step 2: Handle image updates
      if (product && formData.photos) {
        setLoadingText("Обновление фотографий...");

        // Track deleted images by comparing original product photos with formData photos
        const originalImageIds = product.photos
          .filter((photo) => photo.id)
          .map((photo) => photo.id);

        const currentImageIds = formData.photos
          .filter((photo) => photo.id)
          .map((photo) => photo.id);

        // Find IDs of images that have been removed
        const deletedImageIds = originalImageIds.filter(
          (id) => id && !currentImageIds.includes(id)
        );

        // Delete removed images
        for (const imageId of deletedImageIds) {
          try {
            console.log(`Deleting image ${imageId}`);
            await deleteProductImage(Number(productId), imageId as number);
          } catch (deleteError) {
            console.error(`Error deleting image ${imageId}:`, deleteError);
            // Continue with other operations even if deletion fails
          }
        }

        // Only upload new photos (those with file property)
        const newPhotos = formData.photos.filter((photo) => photo.file);

        if (newPhotos.length > 0) {
          // Find the main image among new photos
          const mainPhotoIndex = newPhotos.findIndex((photo) => photo.isMain);
          const effectiveMainIndex = mainPhotoIndex >= 0 ? mainPhotoIndex : 0;

          // Upload each new image
          for (let i = 0; i < newPhotos.length; i++) {
            const photo = newPhotos[i];

            try {
              console.log(
                `Uploading new image ${i}, isMain:`,
                i === effectiveMainIndex
              );
              await api.product.uploadProductImage(
                Number(productId),
                photo.file as File,
                i === effectiveMainIndex
              );
            } catch (uploadError) {
              console.error("Error uploading image:", uploadError);
              // Continue with other images even if one fails
            }
          }
        }

        // Handle setting main image for existing photos
        const mainExistingPhoto = formData.photos.find(
          (photo) => !photo.file && photo.isMain && photo.id
        );

        if (
          mainExistingPhoto &&
          mainExistingPhoto.id &&
          !newPhotos.some((p) => p.isMain)
        ) {
          try {
            const imageId = mainExistingPhoto.id;
            console.log(`Setting image ${imageId} as main`);
            // Ensure the ID is a number and not undefined
            await setMainProductImage(Number(productId), imageId as number);
          } catch (setMainError) {
            console.error("Error setting main image:", setMainError);
          }
        }
      }

      // redirect to profile page on success
      router.push("/profile");
    } catch (err) {
      console.error("Error updating product:", err);
      setError(
        "Произошла ошибка при обновлении объявления. Пожалуйста, попробуйте еще раз."
      );
    } finally {
      setSubmitting(false);
      setLoadingText("");
    }
  };

  if (isAuthChecking) {
    return (
      <>
        <Header />
        <PageContainer>
          <LoadingContainer>
            <AuthCheckText>Проверка аутентификации...</AuthCheckText>
          </LoadingContainer>
        </PageContainer>
      </>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  if (loading) {
    return (
      <>
        <Header />
        <PageContainer>
          <LoadingContainer>Загрузка данных продукта...</LoadingContainer>
        </PageContainer>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <PageContainer>
          <ErrorContainer>{error}</ErrorContainer>
          <Button onClick={() => router.back()}>Назад</Button>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Header />
      <PageContainer>
        <PageTitle>Редактировать объявление</PageTitle>
        {product && (
          <ProductForm
            initialData={product}
            onSubmit={handleSubmit}
            isEdit={true}
          />
        )}

        {submitting && (
          <LoadingOverlay>
            <LoadingSpinner />
            <LoadingText>{loadingText}</LoadingText>
          </LoadingOverlay>
        )}
      </PageContainer>
    </>
  );
};

export default ProductEditPage;
