"use client";

// app/profile/components/FavoritesTab/index.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Ad } from "../../types"; // Ad tipini import qilamiz
import AdCard from "../AdsTab/AdCard"; // Mavjud AdCard komponentini qayta ishlatamiz
import { api } from "../../../../api/api";
import { Product } from "../../../../api/types";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

interface FavoritesTabProps {
  favoriteAds: Ad[];
  onToggleFavorite: (adId: string) => void; // Bu ham kerak bo'ladi
}

const FavoritesContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-height: 200px;
`;

const AdListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 0; // Chunki SearchFilter yo'q
`;

const NoFavoritesText = styled.p`
  text-align: center;
  color: #777;
  font-size: 1.1em;
  padding: 50px 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;

  svg {
    animation: spin 1s linear infinite;
    font-size: 2rem;
    color: #6a1b9a;
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

const ErrorContainer = styled.div`
  text-align: center;
  color: #e53935;
  padding: 20px;
`;

// Helper function to convert Product to Ad
const convertProductToAd = (product: Product): Ad => {
  let imageUrl = "/images/placeholder-phone.jpg";
  if (product.images && product.images.length > 0) {
    const mainImage = product.images.find((img) => img.is_main);
    imageUrl = mainImage ? mainImage.url : product.images[0].url;
  }

  return {
    id: product.id.toString(),
    title: product.title,
    imageUrl,
    condition: product.is_new ? "Новый" : "Б/У",
    memory: `${product.storage} GB`,
    price: product.price,
    currency: product.currency_id === 1 ? "UZS" : "USD",
    isFavorite: true,
    tags: product.floor_price ? ["Торг есть"] : [],
  };
};

export default function FavoritesTab() {
  const [favoriteAds, setFavoriteAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const products = await api.user.getFavouriteItems();
      const ads = products.map(convertProductToAd);
      setFavoriteAds(ads);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("Не удалось загрузить избранные объявления");
      toast.error("Не удалось загрузить избранные объявления");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (adId: string) => {
    try {
      await api.user.toggleFavorite(parseInt(adId));
      // Remove the ad from the list after unfavoriting
      setFavoriteAds((prevAds) => prevAds.filter((ad) => ad.id !== adId));
      toast.success("Объявление удалено из избранного");
    } catch (err) {
      console.error("Error toggling favorite:", err);
      toast.error("Не удалось обновить избранное");
    }
  };

  if (isLoading) {
    return (
      <FavoritesContainer>
        <LoadingContainer>
          <FaSpinner />
        </LoadingContainer>
      </FavoritesContainer>
    );
  }

  if (error) {
    return (
      <FavoritesContainer>
        <ErrorContainer>
          <p>{error}</p>
        </ErrorContainer>
      </FavoritesContainer>
    );
  }

  if (favoriteAds.length === 0) {
    return (
      <FavoritesContainer>
        <NoFavoritesText>У вас пока нет избранных объявлений.</NoFavoritesText>
      </FavoritesContainer>
    );
  }

  return (
    <FavoritesContainer>
      <AdListGrid>
        {favoriteAds.map((ad) => (
          <AdCard key={ad.id} ad={ad} onToggleFavorite={handleToggleFavorite} />
        ))}
      </AdListGrid>
    </FavoritesContainer>
  );
}
