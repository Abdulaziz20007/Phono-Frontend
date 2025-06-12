import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Ad } from "../../types";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaShoppingCart,
  FaEllipsisV,
  FaPen,
  FaArchive,
  FaShoppingBag,
  FaStar,
  FaArrowUp,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import {
  archiveProduct,
  unarchiveProduct,
  upgradeProduct,
} from "../../../../api/api";
import toast from "react-hot-toast";

interface AdCardProps {
  ad: Ad;
  onToggleFavorite: (adId: string) => void;
  isOwnProduct?: boolean;
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

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  position: absolute;
  top: 10px;
  right: 10px;
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 36px;
  height: 36px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const MenuDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 48px;
  right: 10px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 15;
  min-width: 180px;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  overflow: hidden;
`;

const MenuItem = styled.button<{ $warning?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  color: ${(props) => (props.$warning ? "#e53935" : "#333")};
  font-size: 0.9em;
  transition: background-color 0.2s;
  gap: 8px;

  &:hover {
    background-color: #f5f5f5;
  }

  &:active {
    background-color: #eeeeee;
  }

  svg {
    margin-right: 8px;
  }
`;

const MenuDivider = styled.div`
  height: 1px;
  background-color: #e0e0e0;
  margin: 4px 0;
`;

const StatusBadge = styled.div<{ $status: "active" | "waiting" | "deactive" }>`
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
    ({ $status }) =>
      $status === "active"
        ? "#e6f4ea" // Green for active
        : $status === "waiting"
        ? "#fff8e1" // Yellow for waiting
        : "#ffebee" // Red for deactive
  };
  color: ${
    ({ $status }) =>
      $status === "active"
        ? "#34a853" // Green for active
        : $status === "waiting"
        ? "#fb8c00" // Orange for waiting
        : "#e53935" // Red for deactive
  };
`;

const StatusIcon = styled.span`
  margin-right: 5px;
  display: flex;
  align-items: center;
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

export default function AdCard({
  ad,
  onToggleFavorite,
  isOwnProduct = true,
}: AdCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEditProduct = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/product/edit/${ad.id}`;
    setIsMenuOpen(false);
  };

  const handleArchiveProduct = async (
    e: React.MouseEvent,
    markAsSold = false
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    try {
      setIsLoading(true);
      await archiveProduct(parseInt(ad.id), markAsSold);

      if (markAsSold) {
        toast.success("Товар помечен как проданный");
      } else {
        toast.success("Товар архивирован");
      }

      // Trigger a refresh of the ads list
      window.dispatchEvent(new CustomEvent("adsUpdated"));
    } catch (error) {
      console.error("Error archiving product:", error);
      toast.error("Не удалось архивировать товар");
    } finally {
      setIsLoading(false);
      setIsMenuOpen(false);
    }
  };

  const handleUnarchiveProduct = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    try {
      setIsLoading(true);
      await unarchiveProduct(parseInt(ad.id));
      toast.success("Товар восстановлен");

      // Trigger a refresh of the ads list
      window.dispatchEvent(new CustomEvent("adsUpdated"));
    } catch (error) {
      console.error("Error unarchiving product:", error);
      toast.error("Не удалось восстановить товар");
    } finally {
      setIsLoading(false);
      setIsMenuOpen(false);
    }
  };

  const handleUpgradeProduct = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    try {
      setIsLoading(true);
      await upgradeProduct(parseInt(ad.id));
      toast.success("Товар продвинут в топ на 7 дней");

      // Trigger a refresh of the ads list
      window.dispatchEvent(new CustomEvent("adsUpdated"));
    } catch (error) {
      console.error("Error upgrading product:", error);

      // Handle specific error for insufficient balance
      if (
        error instanceof Error &&
        error.message &&
        error.message.includes("insufficient")
      ) {
        toast.error("Недостаточно средств на балансе");
      } else {
        toast.error("Не удалось продвинуть товар");
      }
    } finally {
      setIsLoading(false);
      setIsMenuOpen(false);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(ad.id);
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
        <StatusBadge $status={ad.status}>
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

      {isOwnProduct ? (
        // Show product management menu for user's own products
        <>
          <MenuButton onClick={toggleMenu} aria-label="Опции продукта">
            <FaEllipsisV />
          </MenuButton>

          {isMenuOpen && (
            <MenuDropdown $isOpen={isMenuOpen} ref={menuRef}>
              <MenuItem onClick={handleEditProduct}>
                <FaPen size={14} /> Редактировать
              </MenuItem>

              {ad.status !== "deactive" && !ad.is_sold && (
                <MenuItem onClick={(e) => handleArchiveProduct(e)}>
                  <FaArchive size={14} /> Архивировать
                </MenuItem>
              )}

              {!ad.is_sold && (
                <MenuItem onClick={(e) => handleArchiveProduct(e, true)}>
                  <FaShoppingBag size={14} /> Отметить как проданный
                </MenuItem>
              )}

              {(ad.status === "deactive" || ad.is_sold) && (
                <MenuItem onClick={handleUnarchiveProduct}>
                  <FaArrowUp size={14} /> Восстановить
                </MenuItem>
              )}

              <MenuDivider />

              {ad.status === "active" && !ad.is_sold && (
                <MenuItem onClick={handleUpgradeProduct}>
                  <FaStar size={14} /> Поднять в ТОП за 10 000
                </MenuItem>
              )}
            </MenuDropdown>
          )}
        </>
      ) : (
        // Show favorite toggle for other users' products in Favorites tab
        <LikeButton onClick={handleToggleFavorite}>
          {ad.isFavorite ? <FaHeart /> : <FaRegHeart />}
        </LikeButton>
      )}
    </CardContainer>
  );
}
