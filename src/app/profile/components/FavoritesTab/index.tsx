// app/profile/components/FavoritesTab/index.tsx
import React from "react";
import styled from "styled-components";
import { Ad } from "../../types"; // Ad tipini import qilamiz
import AdCard from "../AdsTab/AdCard"; // Mavjud AdCard komponentini qayta ishlatamiz

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

export default function FavoritesTab({
  favoriteAds,
  onToggleFavorite,
}: FavoritesTabProps) {
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
          <AdCard key={ad.id} ad={ad} onToggleFavorite={onToggleFavorite} />
        ))}
      </AdListGrid>
    </FavoritesContainer>
  );
}
