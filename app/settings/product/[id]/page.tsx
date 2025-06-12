"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss";
import { FiHeart, FiMessageSquare, FiPhone, FiSend } from "react-icons/fi";
import { api, Product as ProductType, Comment } from "../../../../api/api";

// interface for the product data from api
interface ProductImage {
  id: number;
  url: string;
  product_id: number;
  is_main: boolean;
}

interface Brand {
  id: number;
  name: string;
  logo: string;
}

interface Model {
  id: number;
  name: string;
  brand_id: number;
}

interface Address {
  id: number;
  address: string;
  lat: string;
  long: string;
}

interface AdditionalPhone {
  id: number;
  phone: string;
}

interface UserProduct {
  id: number;
  title: string;
  images: { id: number; url: string }[];
}

interface User {
  id: number;
  name: string;
  surname: string;
  avatar: string | null;
  addresses: Address[];
  additional_phones: AdditionalPhone[];
  emails: any[];
  products: UserProduct[];
}

interface Product {
  id: number;
  user_id: number;
  title: string;
  description: string;
  year: number;
  brand_id: number;
  model_id: number;
  custom_model: string | null;
  color_id: number;
  price: number;
  floor_price: boolean;
  currency_id: number;
  is_new: boolean;
  has_document: boolean;
  address_id: number;
  phone_id: number;
  storage: number;
  ram: number;
  views: number;
  is_archived: boolean;
  is_sold: boolean;
  is_checked: boolean;
  admin_id: number | null;
  top_expire_date: string;
  images: ProductImage[];
  brand: Brand;
  model: Model;
  user: User;
  comments?: Comment[];
}

const ProductPage = () => {
  const params = useParams();
  // fix linter error with optional chaining
  const id = params?.id as string;
  const [product, setProduct] = useState<ProductType | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<ProductType[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "comments">(
    "description"
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  // get main image url or first image if no main image is set
  const getMainImageUrl = (images: ProductImage[]): string => {
    const mainImage = images.find((img) => img.is_main);
    return mainImage ? mainImage.url : images[0]?.url || "";
  };

  // function to fetch product data
  const fetchProductData = async (productId: string) => {
    setLoading(true);
    try {
      const productData = await api.product.getById(productId);
      setProduct(productData);

      // Initialize comments from product data
      if (productData.comments) {
        setComments(productData.comments);
      }

      // fetch recommended products
      await fetchRecommendedProducts(productData);
    } catch (err) {
      console.error("error fetching product data:", err);
      setError("произошла ошибка при загрузке товара");
    } finally {
      setLoading(false);
    }
  };

  // function to fetch recommended products
  const fetchRecommendedProducts = async (productData: ProductType) => {
    try {
      // check if user has other products (more than 4)
      const userProducts = productData?.user?.products || [];

      // filter out current product from user's products
      const otherUserProducts = userProducts.filter(
        (p) => p.id !== productData.id
      );

      if (otherUserProducts.length >= 4) {
        // use the user's other products (first 4)
        // fetch full product details for each user product to ensure we have complete data
        const userProductDetails = await Promise.all(
          otherUserProducts.slice(0, 4).map((p) => api.product.getById(p.id))
        );
        setRecommendedProducts(userProductDetails);
      } else {
        // fetch general products
        const allProducts = await api.product.getAll(8);
        // filter out current product and user's products
        const filteredProducts = allProducts
          .filter((p) => p.id !== productData.id)
          .filter((p) => !userProducts.some((up) => up.id === p.id));
        setRecommendedProducts(filteredProducts.slice(0, 4));
      }
    } catch (err) {
      console.error("error fetching recommended products:", err);
      // if error occurs, just show empty recommendations
      setRecommendedProducts([]);
    }
  };

  // handle submitting a new comment
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !id || submittingComment || !isAuthenticated)
      return;

    setSubmittingComment(true);
    try {
      const comment = await api.comment.addComment({
        product_id: Number(id),
        text: newComment.trim(),
      });

      // Add the new comment to the list
      setComments((prev) => [comment, ...prev]);

      // Add comment to product data too to keep it in sync
      if (product && product.comments) {
        setProduct({
          ...product,
          comments: [comment, ...product.comments],
        });
      }

      setNewComment("");
    } catch (err) {
      console.error("error posting comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductData(id);
    }
  }, [id]);

  const toggleFavorite = () => {
    setFavorite(!favorite);
  };

  // format price with spaces for thousands
  const formatPrice = (price?: number): string => {
    if (price === undefined || price === null) {
      return "0";
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Format time since comment was posted
  const formatCommentDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "только что";
    if (diffMins < 60) return `${diffMins} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays < 7) return `${diffDays} д. назад`;

    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>загрузка...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.error}>
        <p>{error || "произошла ошибка при загрузке товара"}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/">главная</Link> &gt; <span>объявления</span>
      </div>

      <div className={styles.productSection}>
        <div className={styles.galleryContainer}>
          <div className={styles.mainImage}>
            {product?.images && product.images.length > 0 && (
              <img
                src={product.images[activeImage]?.url}
                alt={product.title}
                className={styles.productMainImage}
              />
            )}
            <div className={styles.galleryNavigation}>
              <button
                className={styles.navButton}
                aria-label="Previous image"
                onClick={() =>
                  setActiveImage((prev) =>
                    prev === 0 ? (product?.images?.length || 1) - 1 : prev - 1
                  )
                }
              >
                &lt;
              </button>
              <button
                className={styles.navButton}
                aria-label="Next image"
                onClick={() =>
                  setActiveImage((prev) =>
                    prev === (product?.images?.length || 1) - 1 ? 0 : prev + 1
                  )
                }
              >
                &gt;
              </button>
            </div>
          </div>
          <div className={styles.thumbnails}>
            {product?.images?.map((img, index) => (
              <div
                key={img.id}
                className={`${styles.thumbnail} ${
                  activeImage === index ? styles.active : ""
                }`}
                onClick={() => setActiveImage(index)}
              >
                <img src={img.url} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.productInfo}>
          <div className={styles.titleRow}>
            <h1 className={styles.productTitle}>{product.title}</h1>
            <button
              className={`${styles.favoriteButton} ${
                favorite ? styles.active : ""
              }`}
              onClick={toggleFavorite}
              aria-label={
                favorite ? "убрать из избранного" : "добавить в избранное"
              }
            >
              <FiHeart />
            </button>
          </div>

          <div className={styles.priceSection}>
            <div className={styles.price}>{formatPrice(product.price)} UZS</div>
            {!product.floor_price && (
              <span className={styles.bargainTag}>торг есть</span>
            )}
          </div>

          <div className={styles.location}>
            <div className={styles.locationText}>
              {product?.user?.addresses?.[0]?.address || "Адрес не указан"}
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.messageButton}>
              <FiMessageSquare /> написать
            </button>
            <button className={styles.phoneButton}>
              <FiPhone /> показать номер
            </button>
          </div>

          <div className={styles.detailsSection}>
            <div className={styles.detailRow}>
              <div className={styles.detailName}>Состояние</div>
              <div className={styles.detailValue}>
                {product.is_new ? "Новый" : "Б/у"}
              </div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailName}>Бренд</div>
              <div className={styles.detailValue}>
                {product?.brand?.name || "Не указан"}
              </div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailName}>Модель</div>
              <div className={styles.detailValue}>
                {product.custom_model || product?.model?.name || "Не указана"}
              </div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailName}>Память</div>
              <div className={styles.detailValue}>{product.storage} GB</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailName}>Оперативная память</div>
              <div className={styles.detailValue}>{product.ram} GB</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailName}>Год выпуска</div>
              <div className={styles.detailValue}>{product.year}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailName}>Документы</div>
              <div className={styles.detailValue}>
                {product.has_document ? "Есть" : "Нет"}
              </div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailName}>Просмотров</div>
              <div className={styles.detailValue}>{product.views}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.descriptionSection}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "description" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("description")}
          >
            описание
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "comments" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("comments")}
          >
            комментарии ({comments.length})
          </button>
        </div>

        {activeTab === "description" && (
          <div className={styles.descriptionContent}>
            <p>{product.description}</p>
          </div>
        )}

        {activeTab === "comments" && (
          <div className={styles.commentsSection}>
            {isAuthenticated ? (
              <form
                className={styles.commentForm}
                onSubmit={handleCommentSubmit}
              >
                <textarea
                  className={styles.commentInput}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Напишите свой комментарий..."
                  rows={3}
                />
                <button
                  type="submit"
                  className={styles.commentSubmit}
                  disabled={!newComment.trim() || submittingComment}
                >
                  <FiSend /> Отправить
                </button>
              </form>
            ) : (
              <div className={styles.authPrompt}>
                <p>
                  Чтобы оставить комментарий, пожалуйста,{" "}
                  <Link href="/auth">войдите</Link> в свой аккаунт
                </p>
              </div>
            )}

            <div className={styles.commentsList}>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className={styles.commentItem}>
                    <div className={styles.commentHeader}>
                      <div className={styles.commentUser}>
                        {comment.user?.avatar ? (
                          <img
                            src={comment.user.avatar}
                            alt={`${comment.user.name} ${comment.user.surname}`}
                            className={styles.commentAvatar}
                          />
                        ) : (
                          <div className={styles.defaultCommentAvatar}>
                            {comment.user?.name?.charAt(0) || ""}
                          </div>
                        )}
                        <div className={styles.commentUserInfo}>
                          <span className={styles.commentUserName}>
                            {comment.user?.name} {comment.user?.surname}
                          </span>
                          <span className={styles.commentDate}>
                            {formatCommentDate(comment.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.commentText}>{comment.text}</div>
                  </div>
                ))
              ) : (
                <div className={styles.noComments}>
                  Пока нет комментариев. Будьте первым, кто оставит комментарий!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={styles.sellerSection}>
        <h2 className={styles.sectionTitle}>продавец</h2>
        <div className={styles.sellerInfo}>
          <div className={styles.sellerAvatar}>
            {product?.user?.avatar ? (
              <img
                src={product.user.avatar}
                alt={`${product.user.name} ${product.user.surname}`}
              />
            ) : (
              <div className={styles.defaultAvatar}>
                {product?.user?.name?.charAt(0) || ""}
              </div>
            )}
          </div>
          <div className={styles.sellerDetails}>
            <h3>
              {product?.user?.name || ""} {product?.user?.surname || ""}
            </h3>
            <p>
              Другие объявления продавца: {product?.user?.products?.length || 0}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.recommendedSection}>
        <h2 className={styles.recommendedTitle}>вам может понравиться</h2>
        <div className={styles.recommendedProducts}>
          {recommendedProducts.length > 0 ? (
            recommendedProducts.map((item) => (
              <Link
                href={`/product/${item.id}`}
                key={item.id}
                className={styles.recommendedCard}
              >
                <div className={styles.recommendedImageContainer}>
                  <img
                    src={
                      item.images && item.images.length > 0
                        ? getMainImageUrl(item.images)
                        : "/images/placeholder-phone1.jpg"
                    } // use existing placeholder image
                    alt={item.title}
                    className={styles.recommendedImage}
                  />
                  <button
                    className={`${styles.recommendedFavoriteButton}`}
                    aria-label="Add to favorites"
                    onClick={(e) => {
                      e.preventDefault();
                      // add favorite functionality here if needed
                    }}
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
                        fill="#CCCCCC"
                      />
                    </svg>
                  </button>
                </div>
                <div className={styles.recommendedInfo}>
                  <h3 className={styles.recommendedTitle}>
                    {item.title || "неизвестный товар"}
                  </h3>
                  <div className={styles.recommendedDetails}>
                    <span className={styles.detailLabel}>Состояние:</span>
                    <span className={styles.detailValue}>
                      {item.is_new ? "Новый" : "Б/у"}
                    </span>
                  </div>
                  <div className={styles.recommendedDetails}>
                    <span className={styles.detailLabel}>Память:</span>
                    <span className={styles.detailValue}>
                      {item.storage || 0} GB
                    </span>
                  </div>
                  <div className={styles.recommendedPrice}>
                    {formatPrice(item.price)} UZS
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>нет рекомендуемых товаров</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
