// app/profile/components/AdsTab/AdCard.tsx
import styled from "styled-components";
import Image from "next/image";
import { Ad } from "../../types";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Like ikonkalari

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

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  }
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

  &:hover {
    opacity: 0.8;
  }
`;

export default function AdCard({ ad, onToggleFavorite }: AdCardProps) {
  return (
    <CardContainer>
      <CardImage
        src={ad.imageUrl || "/images/placeholder-ad.png"}
        alt={ad.title}
        width={300} // Next.js Image uchun kerak
        height={180} // Next.js Image uchun kerak
      />
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
          <LikeButton onClick={() => onToggleFavorite(ad.id)}>
            {ad.isFavorite ? <FaHeart /> : <FaRegHeart />}
          </LikeButton>
        </PriceContainer>
      </CardContent>
    </CardContainer>
  );
}
