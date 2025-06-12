"use client";

import { useState, useEffect } from "react";
import { useProfileData } from "./hooks/useProfileData";
import UserInfo from "./components/UserInfo";
import ProfileTabs from "./components/ProfileTabs";
import AdsTab from "./components/AdsTab";
import MessagesTab from "./components/MessagesTab";
import FavoritesTab from "./components/FavoritesTab";
import SettingsTab from "./components/SettingsTab";
import EditProfileModal from "./components/EditProfileModal";
import { UserProfile, ActiveProfileTab } from "./types";

import {
  ProfilePageContainer,
  Breadcrumbs,
  ProfileHeader,
  LoadingContainer,
  LoadingSpinner,
  ErrorContainer,
  RetryButton,
} from "./components/ui/SharedComponents";

import { FaExclamationTriangle, FaSpinner } from "react-icons/fa";

export default function ProfilePage() {
  const [localActiveTab, setLocalActiveTab] = useState<ActiveProfileTab>("ads");
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const {
    user,
    ads,
    favoriteAds,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    updateUserProfileInfo,
    toggleFavoriteAd,
    addPhoneNumber,
    deletePhoneNumber,
    addEmail,
    deleteEmail,
    editEmail,
    addAddress,
    deleteAddress,
    changeLanguage,
    logoutUser,
    refreshProfile,
    refreshAds,
  } = useProfileData();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTab = sessionStorage.getItem(
        "profileActiveTab"
      ) as ActiveProfileTab | null;
      if (storedTab) {
        setLocalActiveTab(storedTab);
        setActiveTab(storedTab);
        sessionStorage.removeItem("profileActiveTab");
      } else if (activeTab) {
        setLocalActiveTab(activeTab);
      }
    }
  }, [activeTab, setActiveTab]);

  const handleTabChange = (tab: ActiveProfileTab) => {
    setLocalActiveTab(tab);
    setActiveTab(tab);
  };

  if (isLoading && !user) {
    return (
      <ProfilePageContainer>
        <LoadingContainer>
          <LoadingSpinner>
            <FaSpinner />
          </LoadingSpinner>
          <div>Загрузка профиля...</div>
        </LoadingContainer>
      </ProfilePageContainer>
    );
  }

  if (error && !user) {
    return (
      <ProfilePageContainer>
        <ErrorContainer>
          <FaExclamationTriangle />
          <div>Ошибка загрузки профиля: {error}</div>
        </ErrorContainer>
        <RetryButton $primary onClick={refreshProfile}>
          Попробовать снова
        </RetryButton>
      </ProfilePageContainer>
    );
  }

  if (!user) {
    return (
      <ProfilePageContainer>
        <ErrorContainer>
          <FaExclamationTriangle />
          <div>
            Не удалось загрузить данные профиля. Пожалуйста, войдите в свой
            аккаунт.
          </div>
        </ErrorContainer>
      </ProfilePageContainer>
    );
  }

  const renderTabContent = () => {
    switch (localActiveTab) {
      case "ads":
        return (
          <>
            {isLoading ? (
              <LoadingContainer>
                <LoadingSpinner>
                  <FaSpinner />
                </LoadingSpinner>
                <div>Загрузка объявлений...</div>
              </LoadingContainer>
            ) : error ? (
              <>
                <ErrorContainer>
                  <FaExclamationTriangle />
                  <div>Ошибка загрузки объявлений: {error}</div>
                </ErrorContainer>
                <RetryButton $primary onClick={refreshAds}>
                  Попробовать снова
                </RetryButton>
              </>
            ) : (
              <AdsTab
                ads={ads}
                onToggleFavorite={toggleFavoriteAd}
                refreshAds={refreshAds}
              />
            )}
          </>
        );
      case "messages":
        return <MessagesTab />;
      case "favorites":
        return (
          <>
            {isLoading ? (
              <LoadingContainer>
                <LoadingSpinner>
                  <FaSpinner />
                </LoadingSpinner>
                <div>Загрузка избранного...</div>
              </LoadingContainer>
            ) : error ? (
              <>
                <ErrorContainer>
                  <FaExclamationTriangle />
                  <div>Ошибка загрузки избранного: {error}</div>
                </ErrorContainer>
                <RetryButton $primary onClick={refreshAds}>
                  Попробовать снова
                </RetryButton>
              </>
            ) : (
              <FavoritesTab
                favoriteAds={favoriteAds}
                onToggleFavorite={toggleFavoriteAd}
              />
            )}
          </>
        );
      case "settings":
        return (
          <SettingsTab
            user={user}
            onAddPhoneNumber={addPhoneNumber}
            onDeletePhoneNumber={deletePhoneNumber}
            onAddEmail={addEmail}
            onDeleteEmail={deleteEmail}
            onEditEmail={editEmail}
            onAddAddress={addAddress}
            onDeleteAddress={deleteAddress}
            onLogout={logoutUser}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ProfilePageContainer>
      <Breadcrumbs>
        <a href="#">Главная</a> → Профиль
      </Breadcrumbs>
      <ProfileHeader>Профиль</ProfileHeader>

      {error && (
        <ErrorContainer>
          <FaExclamationTriangle />
          <div>{error}</div>
        </ErrorContainer>
      )}

      <UserInfo
        user={user}
        onEditClick={() => setIsEditProfileModalOpen(true)}
      />

      <ProfileTabs activeTab={localActiveTab} onTabClick={handleTabChange} />

      {renderTabContent()}

      {isEditProfileModalOpen && user && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditProfileModalOpen(false)}
          onSave={(
            updatedData: Partial<
              Pick<
                UserProfile,
                "name" | "surname" | "dob" | "avatar" | "usernameForDisplay"
              >
            >
          ) => {
            updateUserProfileInfo(updatedData);
            setIsEditProfileModalOpen(false);
          }}
        />
      )}
    </ProfilePageContainer>
  );
}
