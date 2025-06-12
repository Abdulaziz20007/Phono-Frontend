"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { Ad } from "../../types";
import AdCard from "../AdsTab/AdCard";
import { Product } from "../../../../api/types";
import { FaSpinner } from "react-icons/fa";

interface FavoritesTabProps {
  favoriteAds: Ad[];
  onToggleFavorite: (adId: string) => Promise<void>;
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
  margin-top: 0;
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
    status: "active",
    is_archived: false,
    is_checked: true,
    is_sold: false,
  };
};

export default function FavoritesTab({
  favoriteAds,
  onToggleFavorite,
}: FavoritesTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          <AdCard
            key={ad.id}
            ad={ad}
            onToggleFavorite={onToggleFavorite}
            isOwnProduct={false}
          />
        ))}
      </AdListGrid>
    </FavoritesContainer>
  );
}
