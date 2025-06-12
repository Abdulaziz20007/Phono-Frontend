// app/profile/components/SettingsTab/EmailSection.tsx
import React, { useState } from "react";
import styled from "styled-components";
import { UserRegisteredEmail } from "../../types";
import {
  FaTrash,
  FaPlus,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaExclamationCircle,
  FaEdit,
} from "react-icons/fa";
import {
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  Input,
  Button,
} from "../../components/ui/SharedComponents"; // Shared styled components
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";

interface EmailSectionProps {
  emails: UserRegisteredEmail[];
  onAdd: (newEmail: string) => void;
  onDelete: (emailId: number) => void;
  onEdit?: (emailId: number, newEmail: string) => void; // Add optional edit function
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
  color: #e53935;
  cursor: pointer;
  font-size: 1.1em;
  margin-left: 8px;
  &:hover {
    color: #c62828;
  }
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: #2196f3; /* Ko'k */
  cursor: pointer;
  font-size: 1.1em;
  &:hover {
    color: #1565c0;
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

const EmailInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
`;

const StatusIcon = styled.span`
  color: ${(props) => props.color};
  display: flex;
  align-items: center;
`;

const StatusText = styled.span<{ $isActive: boolean }>`
  font-size: 0.8em;
  color: ${(props) => (props.$isActive ? "#4caf50" : "#ff9800")};
  margin-left: 5px;
`;

const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 12px;
  border-radius: 4px;
  margin: 10px 0;
  font-size: 0.9em;
`;

// --- Add Email Modal ---
interface AddEmailModalProps {
  onClose: () => void;
  onAdd: (email: string) => void;
}

const AddEmailModal: React.FC<AddEmailModalProps> = ({ onClose, onAdd }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const isValidEmail = (email: string) => {
    // Oddiy email validatsiyasi
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    if (isValidEmail(email)) {
      try {
        await onAdd(email);
        setMessage(
          "verification link has been sent to your email. please check your inbox and verify your email."
        );
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "failed to add email"
        );
      }
    } else {
      setMessage("please enter a valid email address.");
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
        {message && <SuccessMessage>{message}</SuccessMessage>}
        <Button $primary onClick={handleSubmit}>
          Добавить
        </Button>
      </ModalContent>
    </ModalBackdrop>
  );
};

// --- Edit Email Modal ---
interface EditEmailModalProps {
  email: UserRegisteredEmail;
  onClose: () => void;
  onEdit: (emailId: number, email: string) => void;
}

const EditEmailModal: React.FC<EditEmailModalProps> = ({
  email,
  onClose,
  onEdit,
}) => {
  const [newEmail, setNewEmail] = useState(email.email);
  const [message, setMessage] = useState("");

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    if (isValidEmail(newEmail)) {
      try {
        await onEdit(email.id, newEmail);
        setMessage(
          "verification link has been sent to your new email. please check your inbox and verify your email."
        );
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "failed to edit email"
        );
      }
    } else {
      setMessage("please enter a valid email address.");
    }
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
        <h2>Изменить почту</h2>
        <Input
          type="email"
          placeholder="Введите новый E-mail"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        {message && <SuccessMessage>{message}</SuccessMessage>}
        <Button $primary onClick={handleSubmit}>
          Сохранить
        </Button>
      </ModalContent>
    </ModalBackdrop>
  );
};

export default function EmailSection({
  emails,
  onAdd,
  onDelete,
  onEdit,
}: EmailSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<UserRegisteredEmail | null>(
    null
  );
  const [itemToEdit, setItemToEdit] = useState<UserRegisteredEmail | null>(
    null
  );

  const handleAddEmailClick = () => {
    setShowAddModal(true);
  };

  const handleAddEmail = async (email: string) => {
    await onAdd(email);
    setShowAddModal(false);
  };

  const handleEditClick = (email: UserRegisteredEmail) => {
    setItemToEdit(email);
    setShowEditModal(true);
  };

  const handleEditEmail = async (emailId: number, newEmail: string) => {
    if (onEdit) {
      await onEdit(emailId, newEmail);
      setShowEditModal(false);
      setItemToEdit(null);
    }
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
              <EmailInfo>
                <span>{email.email}</span>
                {email.is_active ? (
                  <StatusIcon color="#4caf50">
                    <FaCheckCircle />
                    <StatusText $isActive={true}>активный</StatusText>
                  </StatusIcon>
                ) : (
                  <StatusIcon color="#ff9800">
                    <FaExclamationCircle />
                    <StatusText $isActive={false}>неактивный</StatusText>
                  </StatusIcon>
                )}
              </EmailInfo>
              <ButtonGroup>
                {onEdit && (
                  <EditButton onClick={() => handleEditClick(email)}>
                    <FaEdit />
                  </EditButton>
                )}
                <DeleteButton onClick={() => handleDeleteClick(email)}>
                  <FaTrash />
                </DeleteButton>
              </ButtonGroup>
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
          onAdd={handleAddEmail}
        />
      )}
      {showEditModal && itemToEdit && onEdit && (
        <EditEmailModal
          email={itemToEdit}
          onClose={() => {
            setShowEditModal(false);
            setItemToEdit(null);
          }}
          onEdit={handleEditEmail}
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
