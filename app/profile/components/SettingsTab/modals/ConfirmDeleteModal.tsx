// app/profile/components/SettingsTab/modals/ConfirmDeleteModal.tsx
import React from "react";
import styled from "styled-components";
import {
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  Button,
} from "../../../components/ui/SharedComponents"; // Shared styled components

interface ConfirmDeleteModalProps {
  itemType: string; // "номер телефона", "email", "адрес"
  itemName?: string; // O'chirilayotgan elementning nomi (ixtiyoriy, masalan, telefon raqami)
  onClose: () => void;
  onConfirm: () => void;
}

const ModalMessage = styled.p`
  margin-bottom: 20px;
  color: #555;
  font-size: 1em;
  line-height: 1.5;
`;

const ItemNameToDelete = styled.strong`
  color: #333;
  word-break: break-word; // Agar uzun bo'lsa
`;

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  itemType,
  itemName,
  onClose,
  onConfirm,
}) => {
  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
        <h2>Удалить {itemType}?</h2>
        <ModalMessage>
          Вы действительно хотите удалить этот {itemType}
          {itemName && (
            <>
              : <ItemNameToDelete>{itemName}</ItemNameToDelete>
            </>
          )}
          ?
        </ModalMessage>
        <div style={{ marginTop: "25px", textAlign: "right" }}>
          <Button onClick={onClose}>Отмена</Button>
          <Button $danger onClick={onConfirm}>
            Удалить
          </Button>
        </div>
      </ModalContent>
    </ModalBackdrop>
  );
};

export default ConfirmDeleteModal;
