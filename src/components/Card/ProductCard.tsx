"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./ProductCard.scss";
import { api } from "../../api/api";
import toast from "react-hot-toast";

interface ProductCardProps {
  id: number;
  title: string;
  image?: string;
  memory: string;
  condition: string;
  price: string;
  isNew?: boolean;
  isFavorite?: boolean;
}

function ProductCard({
  id,
  title,
  image,
  memory,
  condition,
  price,
  isNew = false,
  isFavorite = false,
}: ProductCardProps) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const defaultImage = "/images/default-phone.jpg";

  // Check if the user is authenticated
  const checkAuthentication = () => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("accessToken");
    }
    return false;
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    // Check if user is authenticated
    if (!checkAuthentication()) {
      // Use direct navigation instead of router.push
      toast.error("Пожалуйста, войдите в систему, чтобы добавить в избранное");
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
      return;
    }

    try {
      setIsLoading(true);
      if (favorite) {
        // Remove from favorites
        await api.user.toggleFavorite(id);
        setFavorite(false);
        toast.success("Удалено из избранного");
      } else {
        // Add to favorites
        await api.user.addToFavorites(id);
        setFavorite(true);
        toast.success("Добавлено в избранное");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);

      // Only show error if it's not the "already in favorites" case
      if (
        error instanceof Error &&
        error.message !== "Mahsulot allaqachon sevimlilarda"
      ) {
        toast.error("Не удалось обновить избранное");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/product/${id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-image-container">
          <img
            src={image || defaultImage}
            alt={title}
            className="product-image"
          />
          <button
            className={`favorite-button ${favorite ? "active" : ""} ${
              isLoading ? "loading" : ""
            }`}
            onClick={toggleFavorite}
            disabled={isLoading}
            aria-label={
              favorite ? "убрать из избранного" : "добавить в избранное"
            }
          >
            <svg
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 18L8.55 16.7C3.4 12.1 0 9.1 0 5.4C0 2.4 2.4 0 5.5 0C7.2 0 8.85 0.8 10 2.1C11.15 0.8 12.8 0 14.5 0C17.6 0 20 2.4 20 5.4C20 9.1 16.6 12.1 11.45 16.7L10 18Z"
                fill={favorite ? "#F44336" : "#CCCCCC"}
              />
            </svg>
          </button>
        </div>
        <div className="product-info">
          <h3 className="product-title">{title}</h3>
          <div className="product-details">
            <span className="detail-label">Состояние:</span>
            <span className="detail-value">{condition}</span>
          </div>
          <div className="product-details">
            <span className="detail-label">Память:</span>
            <span className="detail-value">{memory}</span>
          </div>
          <div className="product-price">
            {price} UZS
            {isNew && <span className="new-tag">Торг есть</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
