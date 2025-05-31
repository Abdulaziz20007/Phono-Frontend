// app/profile/components/SettingsTab/PhoneNumberSection.tsx
import React, { useState } from "react";
import styled from "styled-components";
import { UserAdditionalPhone } from "../../types";
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

// --- Add Phone Number Modal ---
interface AddPhoneNumberModalProps {
  onClose: () => void;
  onGetCode: (phoneNumber: string) => void;
}

interface PhoneNumberSectionProps {
  // <<<--- PROP TIPINI BU YERDA ANIQLAYMIZ
  phoneNumbers: UserAdditionalPhone[];
  onAdd: (newNumber: string) => void;
  onDelete: (phoneId: number) => void; // <<<--- string -> number
}
const AddPhoneNumberModal: React.FC<AddPhoneNumberModalProps> = ({
  onClose,
  onGetCode,
}) => {
  const [number, setNumber] = useState("+998 "); // Default prefix

  const handleSubmit = () => {
    // Oddiy validatsiya (masalan, O'zbekiston raqami uchun 12 ta belgi +998 XX XXX XX XX)
    const cleanedNumber = number.replace(/\s/g, ""); // Bo'shliqlarni olib tashlash
    if (cleanedNumber.length === 13 && cleanedNumber.startsWith("+998")) {
      onGetCode(number); // Asl formatda yuborish (bo'shliqlar bilan)
    } else {
      alert(
        "Iltimos, to'g'ri O'zbekiston telefon raqamini kiriting (masalan, +998 90 123 45 67)."
      );
    }
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
        <h2>Добавить номер</h2>
        <Input
          type="tel"
          placeholder="+998 XX XXX XX XX"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          maxLength={17} // "+998 XX XXX XX XX" uchun (1 + 3 + 2 + 3 + 2 + 2 + 4 bo'shliq)
        />
        <Button $primary onClick={handleSubmit}>
          Получить код
        </Button>
      </ModalContent>
    </ModalBackdrop>
  );
};
// --- End of Add Phone Number Modal ---

export default function PhoneNumberSection({
  phoneNumbers,
  onAdd,
  onDelete,
}: PhoneNumberSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<UserAdditionalPhone | null>(
    null
  );
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState("");

  const handleAddNumberClick = () => {
    setShowAddModal(true);
  };

  const handleGetCode = (number: string) => {
    setCurrentPhoneNumber(number);
    setShowAddModal(false);
    setShowOtpModal(true);
  };

  const handleOtpSubmit = (otp: string) => {
    console.log("OTP Submitted:", otp, "for number:", currentPhoneNumber);
    onAdd(currentPhoneNumber);
    setShowOtpModal(false);
    setCurrentPhoneNumber("");
  };

  const handleDeleteClick = (phone: UserAdditionalPhone) => {
    setItemToDelete(phone);
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
        <h3>Номер телефона</h3>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </SectionHeader>
      <SectionContent $isOpen={isOpen}>
        <ItemList>
          {phoneNumbers.map((phone) => (
            <Item key={phone.id}>
              <span>{phone.phone}</span>
              <DeleteButton onClick={() => handleDeleteClick(phone)}>
                <FaTrash />
              </DeleteButton>
            </Item>
          ))}
        </ItemList>
        <AddButton onClick={handleAddNumberClick}>
          <FaPlus /> Добавить номер
        </AddButton>
      </SectionContent>

      {showAddModal && (
        <AddPhoneNumberModal
          onClose={() => setShowAddModal(false)}
          onGetCode={handleGetCode}
        />
      )}
      {showOtpModal && (
        <OtpInputModal
          title="Подтвердите номер"
          description={`Мы отправили код на номер ${currentPhoneNumber}`}
          onClose={() => setShowOtpModal(false)}
          onSubmit={handleOtpSubmit}
          digits={6}
        />
      )}
      {itemToDelete && (
        <ConfirmDeleteModal
          itemType="номер телефона"
          itemName={itemToDelete.phone}
          onClose={() => setItemToDelete(null)}
          onConfirm={confirmDeletion}
        />
      )}
    </SectionCard>
  );
}
