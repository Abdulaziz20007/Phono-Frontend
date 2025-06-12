"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./ProductCard.scss";
import { api } from "../../api/api";
import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";

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
  const { user } = useUser();

  // Update favorite state when isFavorite prop changes
  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  const defaultImage = "/images/placeholder-product.jpg";

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    // Check if user is authenticated
    if (!user) {
      toast.error("Пожалуйста, войдите в систему, чтобы добавить в избранное");
      return;
    }

    try {
      setIsLoading(true);
      // Optimistically update UI
      setFavorite(!favorite);

      if (favorite) {
        // Remove from favorites - use the consistent API endpoint
        await api.user.removeFavorite(id);
        toast.success("Удалено из избранного");
      } else {
        // Add to favorites - use the consistent API endpoint
        await api.user.addFavorite(id);
        toast.success("Добавлено в избранное");
      }

      // After successful API call, dispatch a custom event to notify parent components
      // This helps keep favorite state in sync across components
      window.dispatchEvent(
        new CustomEvent("favoritesChanged", {
          detail: { productId: id, isFavorite: !favorite },
        })
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);

      // Revert optimistic update on error
      setFavorite(favorite);

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
            {isLoading && <span className="loading-indicator"></span>}
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
