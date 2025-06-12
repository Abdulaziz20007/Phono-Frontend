// app/profile/components/AdsTab/index.tsx
import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { Ad, ProductStatusTab } from "../../types";
import AdCard from "./AdCard";
import AdsSearchFilter from "./AdsSearchFilter";

interface AdsTabProps {
  ads: Ad[];
  onToggleFavorite: (adId: string) => void;
  refreshAds?: () => void; // Optional refresh function
}

const AdsContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const StatusTabs = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
`;

const StatusTab = styled.div<{ $active: boolean }>`
  padding: 10px 20px;
  cursor: pointer;
  font-weight: ${(props) => (props.$active ? "600" : "normal")};
  color: ${(props) => (props.$active ? "#6a1b9a" : "#333")};
  border-bottom: ${(props) => (props.$active ? "2px solid #6a1b9a" : "none")};
  margin-right: 15px;

  &:hover {
    color: #6a1b9a;
  }
`;

const SectionTitle = styled.h3`
  margin: 20px 0 10px;
  color: #333;
  font-size: 1.1rem;
  font-weight: 500;
`;

const AdListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const EmptyStateMessage = styled.p`
  text-align: center;
  color: #777;
  padding: 30px 0;
  font-size: 1.1em;
`;

export default function AdsTab({
  ads,
  onToggleFavorite,
  refreshAds,
}: AdsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState<ProductStatusTab>("all");

  // Listen for adsUpdated event and refresh ads list
  useEffect(() => {
    const handleAdsUpdated = () => {
      if (refreshAds) {
        refreshAds();
      }
    };

    window.addEventListener("adsUpdated", handleAdsUpdated);

    return () => {
      window.removeEventListener("adsUpdated", handleAdsUpdated);
    };
  }, [refreshAds]);

  // Filter ads by search term and active status
  const filteredAds = useMemo(() => {
    let filtered = [...ads];

    // Filter by search term if provided
    if (searchTerm) {
      filtered = filtered.filter((ad) =>
        ad.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status if not showing all
    if (activeStatus !== "all") {
      filtered = filtered.filter((ad) => ad.status === activeStatus);
    }

    return filtered;
  }, [ads, searchTerm, activeStatus]);

  // Group ads by status for display
  const groupedAds = useMemo(() => {
    return {
      active: ads.filter((ad) => ad.status === "active"),
      waiting: ads.filter((ad) => ad.status === "waiting"),
      deactive: ads.filter((ad) => ad.status === "deactive"),
    };
  }, [ads]);

  const handleTabClick = (status: ProductStatusTab) => {
    setActiveStatus(status);
  };

  const renderProductsByStatus = () => {
    if (activeStatus !== "all") {
      // If a specific tab is selected, only show those products
      const filteredByStatus = filteredAds.filter(
        (ad) => ad.status === activeStatus
      );

      if (filteredByStatus.length === 0) {
        return (
          <EmptyStateMessage>
            В этой категории нет объявлений.
          </EmptyStateMessage>
        );
      }

      return (
        <AdListGrid>
          {filteredByStatus.map((ad) => (
            <AdCard key={ad.id} ad={ad} onToggleFavorite={onToggleFavorite} />
          ))}
        </AdListGrid>
      );
    } else {
      // Show all products grouped by status
      return (
        <>
          <SectionTitle>Активные объявления</SectionTitle>
          {groupedAds.active.length > 0 ? (
            <AdListGrid>
              {groupedAds.active
                .filter(
                  (ad) =>
                    !searchTerm ||
                    ad.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((ad) => (
                  <AdCard
                    key={ad.id}
                    ad={ad}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
            </AdListGrid>
          ) : (
            <EmptyStateMessage>
              У вас нет активных объявлений.
            </EmptyStateMessage>
          )}

          <SectionTitle>Ожидающие проверки</SectionTitle>
          {groupedAds.waiting.length > 0 ? (
            <AdListGrid>
              {groupedAds.waiting
                .filter(
                  (ad) =>
                    !searchTerm ||
                    ad.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((ad) => (
                  <AdCard
                    key={ad.id}
                    ad={ad}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
            </AdListGrid>
          ) : (
            <EmptyStateMessage>
              У вас нет объявлений, ожидающих проверки.
            </EmptyStateMessage>
          )}

          <SectionTitle>Деактивированные объявления</SectionTitle>
          {groupedAds.deactive.length > 0 ? (
            <AdListGrid>
              {groupedAds.deactive
                .filter(
                  (ad) =>
                    !searchTerm ||
                    ad.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((ad) => (
                  <AdCard
                    key={ad.id}
                    ad={ad}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
            </AdListGrid>
          ) : (
            <EmptyStateMessage>
              У вас нет деактивированных объявлений.
            </EmptyStateMessage>
          )}
        </>
      );
    }
  };

  return (
    <AdsContainer>
      <AdsSearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFilterClick={() => console.log("Filter clicked")}
      />

      <StatusTabs>
        <StatusTab
          $active={activeStatus === "all"}
          onClick={() => handleTabClick("all")}
        >
          Все объявления
        </StatusTab>
        <StatusTab
          $active={activeStatus === "active"}
          onClick={() => handleTabClick("active")}
        >
          Активные
        </StatusTab>
        <StatusTab
          $active={activeStatus === "waiting"}
          onClick={() => handleTabClick("waiting")}
        >
          Ожидающие
        </StatusTab>
        <StatusTab
          $active={activeStatus === "deactive"}
          onClick={() => handleTabClick("deactive")}
        >
          Деактивированные
        </StatusTab>
      </StatusTabs>

      {filteredAds.length === 0 && searchTerm ? (
        <EmptyStateMessage>
          По вашему запросу ничего не найдено.
        </EmptyStateMessage>
      ) : (
        renderProductsByStatus()
      )}
    </AdsContainer>
  );
}
