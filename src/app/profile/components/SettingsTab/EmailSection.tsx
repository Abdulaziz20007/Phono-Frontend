// app/profile/components/SettingsTab/EmailSection.tsx
import React, { useState } from "react";
import styled from "styled-components";
import { UserRegisteredEmail } from "../../types";
import { FaTrash, FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  Input,
  Button,
} from "../../components/ui/SharedComponents"; // Shared styled components
import OtpInputModal from "./modals/OtpInputModal";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";

interface EmailSectionProps {
  // <<<--- PROP TIPINI BU YERDA ANIQLAYMIZ
  emails: UserRegisteredEmail[];
  onAdd: (newEmail: string) => void;
  onDelete: (emailId: number) => void; // <<<--- string -> number
}

// --- Styled Components (Section uchun) ---
const SectionCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden; /* To contain header background */
`;

const SectionHeader = styled.div`
  background-color: #f7f7f7;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid #e0e0e0;

  h3 {
    margin: 0;
    font-size: 1.1em;
    color: #333;
  }
`;

const SectionContent = styled.div<{ $isOpen: boolean }>`
  padding: 20px;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
`;

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e53935; /* Qizil */
  cursor: pointer;
  font-size: 1.1em;
  &:hover {
    color: #c62828;
  }
`;

const AddButton = styled.button`
  background: none;
  border: none;
  color: #6a1b9a; /* Binafsha */
  cursor: pointer;
  font-size: 1em;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 0;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;
// --- End of Styled Components ---

// --- Add Email Modal ---
interface AddEmailModalProps {
  onClose: () => void;
  onGetCode: (email: string) => void;
}

const AddEmailModal: React.FC<AddEmailModalProps> = ({
  onClose,
  onGetCode,
}) => {
  const [email, setEmail] = useState("");

  const isValidEmail = (email: string) => {
    // Oddiy email validatsiyasi
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = () => {
    if (isValidEmail(email)) {
      onGetCode(email);
    } else {
      alert("Iltimos, to'g'ri elektron pochta manzilini kiriting.");
    }
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
        <h2>Добавить почту</h2>
        <Input
          type="email"
          placeholder="Введите свой E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button $primary onClick={handleSubmit}>
          Получить код
        </Button>
      </ModalContent>
    </ModalBackdrop>
  );
};
// --- End of Add Email Modal ---

export default function EmailSection({
  emails,
  onAdd,
  onDelete,
}: EmailSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<UserRegisteredEmail | null>(
    null
  );
  const [currentEmail, setCurrentEmail] = useState("");

  const handleAddEmailClick = () => {
    setShowAddModal(true);
  };

  const handleGetCode = (emailValue: string) => {
    setCurrentEmail(emailValue);
    setShowAddModal(false);
    setShowOtpModal(true);
  };

  const handleOtpSubmit = (otp: string) => {
    console.log("OTP Submitted:", otp, "for email:", currentEmail);
    onAdd(currentEmail);
    setShowOtpModal(false);
    setCurrentEmail("");
  };

  const handleDeleteClick = (email: UserRegisteredEmail) => {
    setItemToDelete(email);
  };

  const confirmDeletion = () => {
    if (itemToDelete) {
      onDelete(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  return (
    <SectionCard>
      <SectionHeader onClick={() => setIsOpen(!isOpen)}>
        <h3>Почта</h3>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </SectionHeader>
      <SectionContent $isOpen={isOpen}>
        <ItemList>
          {emails.map((email) => (
            <Item key={email.id}>
              <span>{email.email}</span>
              <DeleteButton onClick={() => handleDeleteClick(email)}>
                <FaTrash />
              </DeleteButton>
            </Item>
          ))}
        </ItemList>
        <AddButton onClick={handleAddEmailClick}>
          <FaPlus /> Добавить почту
        </AddButton>
      </SectionContent>

      {showAddModal && (
        <AddEmailModal
          onClose={() => setShowAddModal(false)}
          onGetCode={handleGetCode}
        />
      )}
      {showOtpModal && (
        <OtpInputModal
          title="Подтвердите почту"
          description={`Мы отправили код на адрес ${currentEmail}`}
          onClose={() => setShowOtpModal(false)}
          onSubmit={handleOtpSubmit}
          digits={6}
        />
      )}
      {itemToDelete && (
        <ConfirmDeleteModal
          itemType="адрес почты"
          itemName={itemToDelete.email}
          onClose={() => setItemToDelete(null)}
          onConfirm={confirmDeletion}
        />
      )}
    </SectionCard>
  );
}
