import React, { useState, ChangeEvent } from "react";
import styled from "styled-components";
import Image from "next/image";
import { UserProfile } from "../types";
import {
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  Input,
  Button,
} from "../components/ui/SharedComponents";
import { FaUpload } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface EditProfileModalProps {
  user: UserProfile;
  onClose: () => void;
  onSave: (
    updatedData: Partial<
      Pick<
        UserProfile,
        "name" | "surname" | "currency_id" | "is_active" | "avatar"
      >
    >
  ) => void;
}

const FormField = styled.div`
  margin-bottom: 15px;
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #444;
  }
`;

const AvatarUploadContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const AvatarPreview = styled(Image)`
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
`;

const UploadButtonLabel = styled.label`
  display: inline-flex;
  align-items: center;
  padding: 8px 15px;
  background-color: #f0f0f0;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  gap: 8px;

  &:hover {
    background-color: #e7e7e7;
  }

  input[type="file"] {
    display: none;
  }
`;

export default function EditProfileModal({
  user,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] = useState(user.name || "");
  const [surname, setSurname] = useState(user.surname || "");
  const [currencyId, setCurrencyId] = useState<number>(user.currency_id);
  const [isActive, setIsActive] = useState<boolean>(user.is_active);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(
    user.avatar || "/images/default-avatar.png"
  );

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const updatedData: any = {
      name,
      surname,
      currency_id: currencyId,
      is_active: isActive,
    };
    if (avatarFile) {
      updatedData.avatar = avatarFile;
    }
    try {
      await onSave(updatedData);
      toast.success("профиль успешно обновлен");
      onClose();
    } catch (error) {
      toast.error("ошибка при сохранении профиля");
    }
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
        <h2>Редактировать профиль</h2>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar
        />

        <AvatarUploadContainer>
          <AvatarPreview
            src={avatarPreviewUrl}
            alt="Avatar"
            width={80}
            height={80}
          />
          <UploadButtonLabel>
            <FaUpload /> загрузить
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </UploadButtonLabel>
        </AvatarUploadContainer>

        <FormField>
          <label htmlFor="profileName">имя</label>
          <Input
            id="profileName"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
        </FormField>
        <FormField>
          <label htmlFor="profileSurname">фамилия</label>
          <Input
            id="profileSurname"
            value={surname}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSurname(e.target.value)
            }
          />
        </FormField>

        <div style={{ marginTop: "25px", textAlign: "right" }}>
          <Button onClick={onClose}>Отмена</Button>
          <Button $primary onClick={handleSave}>
            Сохранить
          </Button>
        </div>
      </ModalContent>
    </ModalBackdrop>
  );
}
