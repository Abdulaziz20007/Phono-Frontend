"use client";

import React, { useState } from "react";
import "./ProductCard.scss";

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

  const defaultImage = "/images/default-phone.jpg";

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={image || defaultImage}
          alt={title}
          className="product-image"
        />
        <button
          className={`favorite-button ${favorite ? "active" : ""}`}
          onClick={toggleFavorite}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
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
  );
}

export default ProductCard;
