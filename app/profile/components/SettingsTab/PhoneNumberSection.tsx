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
  color: #e53935;
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
  onAdd: (phoneNumber: string) => void;
}

interface PhoneNumberSectionProps {
  // <<<--- PROP TIPINI BU YERDA ANIQLAYMIZ
  phoneNumbers: UserAdditionalPhone[];
  onAdd: (newNumber: string) => void;
  onDelete: (phoneId: number) => void; // <<<--- string -> number
}
const AddPhoneNumberModal: React.FC<AddPhoneNumberModalProps> = ({
  onClose,
  onAdd,
}) => {
  const [number, setNumber] = useState("+998 "); // Default prefix

  const handleSubmit = () => {
    // validate phone number format for uzbekistan numbers
    const cleanedNumber = number.replace(/\s/g, ""); // remove spaces
    if (cleanedNumber.length === 13 && cleanedNumber.startsWith("+998")) {
      // phone number is valid
      onAdd(number);
      onClose();
    } else {
      alert(
        "iltimos, to'g'ri o'zbekiston telefon raqamini kiriting (masalan, +998 90 123 45 67)."
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
          Добавить
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
  const [itemToDelete, setItemToDelete] = useState<UserAdditionalPhone | null>(
    null
  );

  const handleAddNumberClick = () => {
    setShowAddModal(true);
  };

  const handleAddNumber = (number: string) => {
    onAdd(number);
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
          onAdd={handleAddNumber}
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
