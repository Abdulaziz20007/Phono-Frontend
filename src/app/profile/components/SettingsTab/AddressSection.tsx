// app/profile/components/SettingsTab/AddressSection.tsx
import React, { useState } from "react";
import styled from "styled-components";
import { UserAddress } from "../../types";
import {
  FaTrashAlt, // <<<--- O'ZGARTIRILDI: Ikonka
  FaPlus,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import {
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  Input,
  Button,
} from "../../components/ui/SharedComponents";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";

interface AddAddressModalProps {
  onClose: () => void;
  // onSave faqat modal ichidan keladigan ma'lumotlarni qabul qilishi kerak
  onSave: (addressData: { name: string; address: string }) => void;
}

// AddressSectionProps ichida onAdd tipi
// interface AddressSectionProps {
//   addresses: UserAddress[];
//   onAdd: (newAddressData: Omit<UserAddress, "id" | "user_id">) => void; // Bu SettingsTabProps'ga mos bo'lishi kerak
//   onDelete: (addressId: number) => void;
// }

// // AddAddressModal ning prop tipi
// interface AddAddressModalProps {
//   // <<<--- Yangi interfeys yoki mavjudini o'zgartirish
//   onClose: () => void;
//   onSave: (
//     addressData: Omit<UserAddress, "id" | "user_id" | "lat" | "long">
//   ) => void; // Yoki faqat name va address
// }

// --- Styled Components ---
const SectionCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
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
  // <<<--- $isOpen transient prop
  padding: 20px;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
`;

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
`;

const Item = styled.li`
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const AddressDetails = styled.div`
  strong {
    display: block;
    margin-bottom: 3px;
    color: #333;
  }
  span {
    color: #666;
    font-size: 0.9em;
  }
`;

const AddressDeleteButton = styled.button`
  // <<<--- YANGI STIL YOKI O'ZGARTIRILGAN
  background: none;
  border: 1px solid #ccc; // Ramka
  color: #555; // Qora rang
  cursor: pointer;
  font-size: 0.9em; // Ikonka o'lchami uchun
  padding: 5px 7px; // Ikonka atrofida joy
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1; // Ikonkani vertikal markazlash uchun

  &:hover {
    background-color: #f0f0f0;
    border-color: #bbb;
  }
`;

const AddAddressStyledButton = styled.button`
  // <<<--- YANGI STIL
  background-color: #f7f7f7;
  border: 1px solid #ddd;
  color: #555;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.95em;
  font-weight: 500;
  display: inline-flex; // Ikonka bilan birga joylashish uchun
  align-items: center;
  gap: 6px;

  &:hover {
    background-color: #e9e9e9;
    border-color: #ccc;
  }
`;
// --- End of Styled Components ---

// AddAddressModal o'zgarishsiz (faqat Button $primary bo'lishi mumkin)
const AddAddressModal: React.FC<AddAddressModalProps> = ({
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = () => {
    if (name.trim() && address.trim()) {
      onSave({ name, address });
    } else {
      alert("Iltimos, barcha kerakli maydonlarni to'ldiring.");
    }
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
        <h2>Добавить адрес</h2>
        <Input
          type="text"
          placeholder="Название (например, Дом, Офис)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Адрес (улица, дом, квартира)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Button $primary onClick={handleSubmit}>
          {" "}
          {/* <<<--- $primary */}
          Сохранить адрес
        </Button>
      </ModalContent>
    </ModalBackdrop>
  );
};

interface AddressSectionProps {
  addresses: UserAddress[];
  // onAdd propining tipi SettingsTabProps'dagi onAddAddress tipiga mos kelishi kerak
  onAdd: (newAddressData: Omit<UserAddress, "id" | "user_id">) => void;
  onDelete: (addressId: number) => void;
}

export default function AddressSection({
  addresses,
  onAdd,
  onDelete,
}: AddressSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<number | null>(null); // Faqat ID ni saqlaymiz
  const [itemToDeleteName, setItemToDeleteName] = useState<string>(""); // O'chiriladigan nomni saqlaymiz

  const handleAddAddress = (addressData: Omit<UserAddress, "id">) => {
    onAdd(addressData);
    setShowAddModal(false);
  };

  const handleDeleteClick = (addressObject: UserAddress) => {
    // Butun obyektni olamiz
    setItemToDeleteId(addressObject.id);
    setItemToDeleteName(addressObject.name); // yoki addressObject.address
  };

  const handleModalSave = (modalData: { name: string; address: string }) => {
    // Bu yerda modalData'ni onAdd kutayotgan formatga o'tkazamiz
    // lat va long uchun default qiymatlar yoki boshqa logika qo'shilishi mumkin
    onAdd({
      name: modalData.name,
      address: modalData.address,
      // lat va long ni ixtiyoriy qilib qo'yamiz, useProfileData da null bo'ladi
    });
    setShowAddModal(false);
  };

  const confirmDeletion = () => {
    if (itemToDeleteId) {
      onDelete(itemToDeleteId);
      setItemToDeleteId(null);
      setItemToDeleteName("");
    }
  };

  return (
    <SectionCard>
      <SectionHeader onClick={() => setIsOpen(!isOpen)}>
        <h3>Адрес</h3>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </SectionHeader>
      <SectionContent $isOpen={isOpen}>
        {" "}
        {/* <<<--- $isOpen */}
        <ItemList>
          {addresses.map((addr) => (
            <Item key={addr.id}>
              <AddressDetails>
                <strong>{addr.name}</strong>
                <span>{addr.address}</span>
              </AddressDetails>
              <AddressDeleteButton onClick={() => handleDeleteClick(addr)}>
                {" "}
                {/* <<<--- O'ZGARTIRILDI */}
                <FaTrashAlt /> {/* <<<--- O'ZGARTIRILDI */}
              </AddressDeleteButton>
            </Item>
          ))}
        </ItemList>
        <AddAddressStyledButton onClick={() => setShowAddModal(true)}>
          {" "}
          {/* <<<--- O'ZGARTIRILDI */}
          <FaPlus /> Добавить адрес
        </AddAddressStyledButton>
      </SectionContent>

      {showAddModal && (
        <AddAddressModal
          onClose={() => setShowAddModal(false)}
          onSave={handleModalSave}
        />
      )}
      {itemToDeleteId && (
        <ConfirmDeleteModal
          itemType="адрес"
          itemName={itemToDeleteName} // O'chiriladigan manzil nomini ko'rsatamiz
          onClose={() => {
            setItemToDeleteId(null);
            setItemToDeleteName("");
          }}
          onConfirm={confirmDeletion}
        />
      )}
    </SectionCard>
  );
}
