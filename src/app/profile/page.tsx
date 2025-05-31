// app/profile/page.tsx
"use client";

import { useState } from "react"; // <<<--- QO'SHILDI: useState importi
import styled from "styled-components";
import { useProfileData } from "./hooks/useProfileData";
import UserInfo from "./components/UserInfo";
import ProfileTabs from "./components/ProfileTabs";
import AdsTab from "./components/AdsTab";
import MessagesTab from "./components/MessagesTab"; // Fayl mavjudligini tekshiring
import FavoritesTab from "./components/FavoritesTab"; // Fayl mavjudligini tekshiring
import SettingsTab from "./components/SettingsTab";
import EditProfileModal from "./components/EditProfileModal"; // <<<--- QO'SHILDI: EditProfileModal importi
import { UserProfile } from "./types"; // <<<--- QO'SHILDI: UserProfile tipi (updatedData uchun)

// Placeholder Icons (react-icons kabi kutubxonadan foydalanishingiz mumkin)
import {
  FaUserEdit,
  FaTrash,
  FaPlus,
  FaGlobe,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";

// --- Styled Components (Namuna uchun shu yerda, lekin alohida faylga chiqargan yaxshi) ---
const ProfilePageContainer = styled.div`
  max-width: 960px;
  margin: 20px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9; // Orqa fon rangi
`;

const Breadcrumbs = styled.div`
  font-size: 0.9em;
  color: #777;
  margin-bottom: 15px;
  a {
    color: #555;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ProfileHeader = styled.h1`
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

// --- Modal uchun umumiy stillar ---
export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); // Qoraytirilgan orqa fon
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 25px 30px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  min-width: 350px;
  max-width: 500px;
  position: relative;

  h2 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 1.5em;
    color: #333;
  }
`;

export const ModalCloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #888;
  &:hover {
    color: #555;
  }
`;

export const Input = styled.input`
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
`;

// Button komponenti
export const Button = styled.button<{ $primary?: boolean; $danger?: boolean }>`
  // <<<--- $ belgisini qo'shdik
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  margin-right: 10px;
  background-color: ${(props) =>
    props.$primary // <<<--- $ bilan ishlatamiz
      ? "#6a1b9a"
      : props.$danger // <<<--- $ bilan ishlatamiz
      ? "#e53935"
      : "#eee"};
  color: ${(props) =>
    props.$primary
      ? "white"
      : props.$danger
      ? "white"
      : "#333"}; // <<<--- $ bilan

  &:hover {
    opacity: 0.9;
  }
  &:last-child {
    margin-right: 0;
  }
`;

// Loading component
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  color: #6a1b9a;
  font-size: 32px;
  margin-bottom: 16px;
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

const ErrorContainer = styled.div`
  background-color: #ffebee;
  border: 1px solid #ef9a9a;
  color: #c62828;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  svg {
    margin-right: 10px;
  }
`;

const RetryButton = styled(Button)`
  margin-top: 16px;
`;
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
