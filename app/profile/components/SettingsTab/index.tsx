// app/profile/components/SettingsTab/index.tsx
import styled from "styled-components";
import {
  UserProfile,
  UserAddress,
  UserRegisteredEmail,
  UserAdditionalPhone,
} from "../../types"; // Tiplarni import qilamiz

import PhoneNumberSection from "./PhoneNumberSection";
import EmailSection from "./EmailSection";
import AddressSection from "./AddressSection";
import AccountActionsSection from "./AccountActionsSection";
import { useProfileData } from "../../hooks/useProfileData"; // <<<--- IMPORT QILAMIZ

interface SettingsTabProps {
  user: UserProfile;
  onAddPhoneNumber: (newNumber: string) => void;
  onDeletePhoneNumber: (phoneId: number) => void;
  onAddEmail: (newEmail: string) => void;
  onDeleteEmail: (emailId: number) => void;
  onEditEmail?: (emailId: number, newEmail: string) => void;
  onAddAddress: (newAddress: Omit<UserAddress, "id" | "user_id">) => void;
  onDeleteAddress: (addressId: number) => void;
  onLogout: () => void;
}
const SettingsContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 0 0 8px 8px; // Tablar bilan birikishi uchun
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export default function SettingsTab({
  user,
  onAddPhoneNumber,
  onDeletePhoneNumber,
  onAddEmail,
  onDeleteEmail,
  onEditEmail,
  onAddAddress,
  onDeleteAddress,
  onLogout,
}: SettingsTabProps) {
  return (
    <SettingsContainer>
      <PhoneNumberSection
        phoneNumbers={user.additional_phones}
        onAdd={onAddPhoneNumber} // Hookdan olingan funksiya
        onDelete={onDeletePhoneNumber} // Hookdan olingan funksiya
      />
      <EmailSection
        emails={user.emails}
        onAdd={onAddEmail}
        onDelete={onDeleteEmail}
        onEdit={onEditEmail}
      />
      <AddressSection
        addresses={user.addresses}
        onAdd={onAddAddress} // Hookdan olingan funksiya
        onDelete={onDeleteAddress} // Hookdan olingan funksiya
      />
      <AccountActionsSection onLogout={onLogout} />
    </SettingsContainer>
  );
}
