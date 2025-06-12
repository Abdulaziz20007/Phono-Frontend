import React, { useState, useEffect } from "react";
import ProductCard from "../Card/ProductCard";
import "./ProductListing.scss";
import { Product, Brand } from "../../../../../api/types";
import { useUser } from "@/context/UserContext";
import { api } from "../../../../../api/api";

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

interface ProductListingProps {
  products: Product[] | undefined;
  brands: Brand[] | undefined;
  favoriteProductIds?: number[];
}

function ProductListing({
  products = [],
  brands = [],
  favoriteProductIds = [],
}: ProductListingProps) {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<number[]>(favoriteProductIds);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  // Update favorites when props change
  useEffect(() => {
    setFavorites(favoriteProductIds);
  }, [favoriteProductIds]);

  // Fetch user's favorites when component mounts or user changes
  useEffect(() => {
    const fetchFavorites = async () => {
      // Skip if not authenticated or already have favorites from props
      if (!user || favoritesLoading || favoriteProductIds.length > 0) return;

      try {
        setFavoritesLoading(true);
        // Get user profile to extract favorite items
        const userProfile = await api.user.getProfile();
        if (userProfile && Array.isArray(userProfile.favourite_items)) {
          const favIds = userProfile.favourite_items.map(
            (fav: any) => fav.product_id
          );
          setFavorites(favIds);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setFavoritesLoading(false);
      }
    };

    fetchFavorites();
  }, [user, favoriteProductIds]);

  // Listen for favorite changes from ProductCard components
  useEffect(() => {
    const handleFavoritesChanged = (event: CustomEvent) => {
      const { productId, isFavorite } = event.detail;

      // Update favorites state based on the event
      setFavorites((prevFavorites) => {
        if (isFavorite && !prevFavorites.includes(productId)) {
          return [...prevFavorites, productId];
        } else if (!isFavorite && prevFavorites.includes(productId)) {
          return prevFavorites.filter((id) => id !== productId);
        }
        return prevFavorites;
      });
    };

    // Add event listener for custom favoritesChanged event
    window.addEventListener(
      "favoritesChanged",
      handleFavoritesChanged as EventListener
    );

    // Clean up event listener
    return () => {
      window.removeEventListener(
        "favoritesChanged",
        handleFavoritesChanged as EventListener
      );
    };
  }, []);

  // Get main image URL from product images array
  const getMainImage = (product: Product): string | undefined => {
    if (!product.images || product.images.length === 0) return undefined;

    // Try to find the main image
    const mainImage = product.images.find((img) => img.is_main);

    // If there's a main image, return its URL, otherwise return the first image's URL
    return mainImage ? mainImage.url : product.images[0].url;
  };

  // Function to get brand and model name (using nested objects if available)
  const getProductTitle = (product: Product): string => {
    if (product.brand && product.model) {
      return `${product.brand.name} ${product.model.name}`;
    }

    // Fallback to using brand_id and model_id with the brands array
    if (!brands || brands.length === 0) return "Unknown Product";

    const brand = brands.find((b) => b.id === product.brand_id);
    if (!brand) return "Unknown Product";

    const model =
      brand.models && brand.models.find((m) => m.id === product.model_id);
    return `${brand.name} ${model ? model.name : "Unknown Model"}`;
  };

  // Function to format price with spaces as thousand separators
  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Check if a product is in the user's favorites
  const isProductFavorite = (productId: number): boolean => {
    return favorites.includes(productId);
  };

  return (
    <div className="product-listing-section">
      <h2 className="product-listing-title">Объявления</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={getProductTitle(product)}
            image={getMainImage(product)}
            memory={`${product.storage} GB`}
            condition={product.is_new ? "Новый" : "Б/у"}
            price={formatPrice(product.price)}
            isNew={product.is_new}
            isFavorite={isProductFavorite(product.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductListing;
