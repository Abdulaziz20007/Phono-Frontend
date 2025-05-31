// app/profile/components/AdsTab/index.tsx
import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { Ad } from "../../types";
import AdCard from "./AdCard";
import AdsSearchFilter from "./AdsSearchFilter"; // Bu komponentni ham yaratish kerak

interface AdsTabProps {
  ads: Ad[];
  onToggleFavorite: (adId: string) => void;
}

const AdsContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const AdListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(250px, 1fr)
  ); // Responsiv grid
  gap: 20px;
  margin-top: 20px;
`;

export default function AdsTab({ ads, onToggleFavorite }: AdsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  // Filter uchun state ham qo'shilishi mumkin

  const filteredAds = useMemo(() => {
    if (!searchTerm) return ads;
    return ads.filter((ad) =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ads, searchTerm]);

  return (
    <AdsContainer>
      <AdsSearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFilterClick={() => console.log("Filter clicked")} // Filter logikasi
      />
      <AdListGrid>
        {filteredAds.map((ad) => (
          <AdCard key={ad.id} ad={ad} onToggleFavorite={onToggleFavorite} />
        ))}
        {filteredAds.length === 0 && (
          <p>По вашему запросу ничего не найдено.</p>
        )}
      </AdListGrid>
    </AdsContainer>
  );
}
