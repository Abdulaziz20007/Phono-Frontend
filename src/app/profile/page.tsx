// app/profile/page.tsx
"use client";

import { useState } from "react";
import { useProfileData } from "./hooks/useProfileData";
import UserInfo from "./components/UserInfo";
import ProfileTabs from "./components/ProfileTabs";
import AdsTab from "./components/AdsTab";
import MessagesTab from "./components/MessagesTab";
import FavoritesTab from "./components/FavoritesTab";
import SettingsTab from "./components/SettingsTab";
import EditProfileModal from "./components/EditProfileModal";
import { UserProfile } from "./types";

// Import styled components from the shared file
import {
  ProfilePageContainer,
  Breadcrumbs,
  ProfileHeader,
  LoadingContainer,
  LoadingSpinner,
  ErrorContainer,
  RetryButton
} from "./components/ui/SharedComponents";

// Placeholder Icons
import {
  FaUserEdit,
  FaTrash,
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
    addAddress,
    deleteAddress,
    changeLanguage,
    logoutUser,
    deleteUserAccount,
    refreshProfile,
    refreshAds,
  } = useProfileData();

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

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
    switch (activeTab) {
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
            onAddAddress={addAddress}
            onDeleteAddress={deleteAddress}
            onLanguageChange={changeLanguage}
            onLogout={logoutUser}
            onDeleteAccount={deleteUserAccount}
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

      <ProfileTabs activeTab={activeTab} onTabClick={setActiveTab} />

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
