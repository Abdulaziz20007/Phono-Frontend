// app/profile/components/SettingsTab/AccountActionsSection.tsx
import React, { useState } from "react";
import styled from "styled-components";
import { FaSignOutAlt } from "react-icons/fa";
import {
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  Button,
} from "../../components/ui/SharedComponents";
// ConfirmDeleteModal o'rniga umumiyroq ConfirmActionModal ishlatamiz

interface AccountActionsSectionProps {
  onLogout: () => void;
}

// --- Confirm Action Modal (Logout va Delete Account uchun umumiy) ---
const ConfirmActionModal: React.FC<{
  title: string;
  message: string;
  confirmButtonText: string;
  isDangerAction?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({
  title,
  message,
  confirmButtonText,
  isDangerAction,
  onClose,
  onConfirm,
}) => {
  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
        <h2>{title}</h2>
        <p>{message}</p>
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <Button onClick={onClose}>Отмена</Button>
          <Button
            onClick={onConfirm}
            $danger={isDangerAction}
            $primary={!isDangerAction}
          >
            {confirmButtonText}
          </Button>
        </div>
      </ModalContent>
    </ModalBackdrop>
  );
};
// --- End of Confirm Action Modal ---

const ActionButton = styled.button<{ $danger?: boolean }>`
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 10px;
  border: 1px solid ${(props) => (props.$danger ? "#e53935" : "#d0d0d0")};
  background-color: white;
  color: ${(props) => (props.$danger ? "#e53935" : "#333")};
  font-size: 1em;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Matn chapga */
  gap: 10px;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: ${(props) => (props.$danger ? "#ffebee" : "#f9f9f9")};
    border-color: ${(props) => (props.$danger ? "#d32f2f" : "#b0b0b0")};
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ActionsContainer = styled.div`
  padding: 10px 0;
`;

export default function AccountActionsSection({
  onLogout,
}: AccountActionsSectionProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    onLogout();
    setShowLogoutModal(false);
  };

  return (
    <ActionsContainer>
      {" "}
      <ActionButton onClick={() => setShowLogoutModal(true)}>
        <FaSignOutAlt /> Выйти с аккаунта
      </ActionButton>
      {showLogoutModal && (
        <ConfirmActionModal
          title="Выйти с аккаунта?"
          message="Вы действительно хотите выйти со своего аккаунта?"
          confirmButtonText="Выйти"
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </ActionsContainer>
  );
}
