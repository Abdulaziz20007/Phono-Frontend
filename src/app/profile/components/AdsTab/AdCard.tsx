// app/profile/components/AdsTab/AdCard.tsx
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { Ad } from "../../types";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Like ikonkalari
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaShoppingCart,
} from "react-icons/fa"; // Status icons

interface AdCardProps {
  ad: Ad;
  onToggleFavorite: (adId: string) => void;
}

const CardContainer = styled.div`
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  }
`;

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  flex-grow: 1;
`;

const CardImage = styled(Image)`
  width: 100%;
  height: 180px; // Rasm balandligi
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.h4`
  font-size: 1.1em;
  margin: 0 0 8px 0;
  color: #333;
  // Agar uzun bo'lsa, qisqartirish
  // white-space: nowrap;
  // overflow: hidden;
  // text-overflow: ellipsis;
`;

const InfoText = styled.p`
  font-size: 0.9em;
  color: #666;
  margin: 3px 0;
  span {
    font-weight: 500;
    color: #444;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

const Price = styled.span`
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
`;

const Tag = styled.span`
  background-color: #e6f4ea; // Yashil rang "Торг есть" uchun
  color: #34a853;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: 500;
`;

const SoldOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
`;

const SoldBadge = styled.div`
  background-color: #e53935;
  color: white;
  padding: 5px 15px;
  border-radius: 4px;
  font-size: 1.2em;
  font-weight: bold;
  transform: rotate(-15deg);
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  color: #e53935; // Qizil
  cursor: pointer;
  font-size: 1.5em;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  position: absolute;
  top: 10px;
  right: 10px;

  &:hover {
    opacity: 0.8;
  }
`;

const StatusBadge = styled.div<{ status: "active" | "waiting" | "deactive" }>`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: 500;
  background-color: ${
    ({ status }) =>
      status === "active"
        ? "#e6f4ea" // Green for active
        : status === "waiting"
        ? "#fff8e1" // Yellow for waiting
        : "#ffebee" // Red for deactive
  };
  color: ${
    ({ status }) =>
      status === "active"
        ? "#34a853" // Green for active
        : status === "waiting"
        ? "#fb8c00" // Orange for waiting
        : "#e53935" // Red for deactive
  };
`;

const StatusIcon = styled.span`
  margin-right: 5px;
  display: flex;
  align-items: center;
`;

export default function AdCard({ ad, onToggleFavorite }: AdCardProps) {
  // Function to get status label and icon
  const getStatusInfo = () => {
    if (ad.is_sold) {
      return {
        label: "Продано",
        icon: <FaShoppingCart size={12} />,
      };
    }

    switch (ad.status) {
      case "active":
        return {
          label: "Активно",
          icon: <FaCheckCircle size={12} />,
        };
      case "waiting":
        return {
          label: "На проверке",
          icon: <FaClock size={12} />,
        };
      case "deactive":
        return {
          label: "Деактивировано",
          icon: <FaTimesCircle size={12} />,
        };
      default:
        return {
          label: "Активно",
          icon: <FaCheckCircle size={12} />,
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <CardContainer>
      <CardLink href={`/product/${ad.id}`}>
        <CardImage
          src={ad.imageUrl || "/images/placeholder-ad.png"}
          alt={ad.title}
          width={300} // Next.js Image uchun kerak
          height={180} // Next.js Image uchun kerak
        />
        {ad.is_sold && (
          <SoldOverlay>
            <SoldBadge>ПРОДАНО</SoldBadge>
          </SoldOverlay>
        )}
        <StatusBadge status={ad.status}>
          <StatusIcon>{statusInfo.icon}</StatusIcon>
          {statusInfo.label}
        </StatusBadge>
        <CardContent>
          <div>
            <Title>{ad.title}</Title>
            <InfoText>
              Состояние: <span>{ad.condition}</span>
            </InfoText>
            <InfoText>
              Память: <span>{ad.memory}</span>
            </InfoText>
          </div>
          <PriceContainer>
            <Price>
              {ad.price.toLocaleString("ru-RU")} {ad.currency}
            </Price>
            {ad.tags && ad.tags.includes("Торг есть") && <Tag>Торг есть</Tag>}
          </PriceContainer>
        </CardContent>
      </CardLink>
      <LikeButton
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite(ad.id);
        }}
      >
        {ad.isFavorite ? <FaHeart /> : <FaRegHeart />}
      </LikeButton>
    </CardContainer>
  );
}
