// app/profile/page.tsx
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

// Import styled components from the shared file
import {
  ProfilePageContainer,
  Breadcrumbs,
  ProfileHeader,
  LoadingContainer,
  LoadingSpinner,
  ErrorContainer,
  RetryButton,
} from "./components/ui/SharedComponents";

// Placeholder Icons
import {
  FaUserEdit,
  FaPlus,
  FaGlobe,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";

// ProfilePageContainer is now imported from SharedComponents

// Breadcrumbs is now imported from SharedComponents

// ProfileHeader is now imported from SharedComponents

// Modal components are now imported from SharedComponents

// Loading components are now imported from SharedComponents

// --- End of Styled Components ---

export default function ProfilePage() {
  // Local state for tab to ensure immediate updates
  const [localActiveTab, setLocalActiveTab] = useState<ActiveProfileTab>("ads");
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const {
    user,
    ads,
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

  // Check for active tab in sessionStorage and set it
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTab = sessionStorage.getItem(
        "profileActiveTab"
      ) as ActiveProfileTab | null;
      if (storedTab) {
        // Update both the local state and the hook state
        setLocalActiveTab(storedTab);
        setActiveTab(storedTab);
        // Clear it after using
        sessionStorage.removeItem("profileActiveTab");
      } else if (activeTab) {
        // Sync local state with hook state
        setLocalActiveTab(activeTab);
      }
    }
  }, [activeTab, setActiveTab]);

  // Handle tab changes
  const handleTabChange = (tab: ActiveProfileTab) => {
    setLocalActiveTab(tab); // Update local state immediately
    setActiveTab(tab); // Update hook state
  };

  // Handling loading state
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

  // Handling error state
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
              <AdsTab ads={ads} onToggleFavorite={toggleFavoriteAd} />
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
                favoriteAds={ads.filter((ad) => ad.isFavorite)}
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
            onLanguageChange={changeLanguage}
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
