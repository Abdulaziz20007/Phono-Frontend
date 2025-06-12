// app/profile/components/SettingsTab/AddressSection.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { UserAddress } from "../../types";
import {
  FaTrashAlt, // <<<--- O'ZGARTIRILDI: Ikonka
  FaPlus,
  FaChevronDown,
  FaChevronUp,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  Input,
  Button,
} from "../../components/ui/SharedComponents";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import GoogleMapsSelector from "./GoogleMapsSelector";
import { fetchAppData, Region } from "../../../../api/api";

interface AddAddressModalProps {
  onClose: () => void;
  onSave: (addressData: {
    name: string;
    address: string;
    lat: string;
    long: string;
    region_id: number;
  }) => void;
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

const LocationTag = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: #e8f4fd;
  color: #0277bd;
  font-size: 0.8em;
  padding: 2px 6px;
  border-radius: 3px;
  margin-top: 5px;
  gap: 3px;
`;
// --- End of Styled Components ---

// modified addressmodal to include googlempsselector
const AddAddressModal: React.FC<AddAddressModalProps> = ({
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("41.299496");
  const [lng, setLng] = useState("69.240073");
  const [regions, setRegions] = useState<Region[]>([]);
  const [regionId, setRegionId] = useState<number | null>(null);
  const [loadingRegions, setLoadingRegions] = useState(false);

  useEffect(() => {
    setLoadingRegions(true);
    fetchAppData()
      .then((data) => {
        setRegions(data.regions || []);
      })
      .finally(() => setLoadingRegions(false));
  }, []);

  const handleLocationSelect = (latitude: string, longitude: string) => {
    setLat(latitude);
    setLng(longitude);
  };

  const handleSubmit = () => {
    if (name.trim() && address.trim() && lat && lng && regionId !== null) {
      onSave({
        name,
        address,
        lat,
        long: lng,
        region_id: regionId,
      });
    } else {
      alert(
        "пожалуйста, заполните все поля, выберите регион и местоположение на карте."
      );
    }
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
        <h2>добавить адрес</h2>
        <Input
          type="text"
          placeholder="название (например, дом, офис)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <Input
          type="text"
          placeholder="адрес (улица, дом, квартира)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              fontWeight: 500,
              color: "#444",
              marginBottom: 4,
              display: "block",
            }}
          >
            Регион
          </label>
          <select
            value={regionId ?? ""}
            onChange={(e) => setRegionId(Number(e.target.value))}
            disabled={loadingRegions}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          >
            <option value="" disabled>
              {loadingRegions ? "Загрузка регионов..." : "Выберите регион"}
            </option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
        <label
          style={{
            display: "block",
            marginBottom: "10px",
            fontWeight: "500",
            color: "#444",
          }}
        >
          выберите местоположение на карте
        </label>
        <GoogleMapsSelector
          onLocationSelect={handleLocationSelect}
          initialLat={lat}
          initialLng={lng}
        />
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <Button onClick={onClose}>отмена</Button>
          <Button $primary onClick={handleSubmit}>
            сохранить адрес
          </Button>
        </div>
      </ModalContent>
    </ModalBackdrop>
  );
};

interface AddressSectionProps {
  addresses: UserAddress[];
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

  const handleAddAddress = (
    addressData: Omit<UserAddress, "id" | "user_id">
  ) => {
    onAdd(addressData);
    setShowAddModal(false);
  };

  const handleDeleteClick = (addressObject: UserAddress) => {
    // Butun obyektni olamiz
    setItemToDeleteId(addressObject.id);
    setItemToDeleteName(addressObject.name); // yoki addressObject.address
  };

  const handleModalSave = (modalData: {
    name: string;
    address: string;
    lat: string;
    long: string;
    region_id: number;
  }) => {
    onAdd({
      name: modalData.name,
      address: modalData.address,
      lat: modalData.lat,
      long: modalData.long,
      region_id: modalData.region_id,
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
        <h3>адрес</h3>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </SectionHeader>
      <SectionContent $isOpen={isOpen}>
        {" "}
        <ItemList>
          {addresses.map((addr) => (
            <Item key={addr.id}>
              <AddressDetails>
                <strong>{addr.name}</strong>
                <span>{addr.address}</span>
                <LocationTag>
                  <FaMapMarkerAlt size={10} /> координаты:{" "}
                  {parseFloat(addr.lat).toFixed(4)},{" "}
                  {parseFloat(addr.long).toFixed(4)}
                </LocationTag>
              </AddressDetails>
              <AddressDeleteButton onClick={() => handleDeleteClick(addr)}>
                {" "}
                <FaTrashAlt />
              </AddressDeleteButton>
            </Item>
          ))}
        </ItemList>
        <AddAddressStyledButton onClick={() => setShowAddModal(true)}>
          {" "}
          <FaPlus /> добавить адрес
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
