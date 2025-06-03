import React from "react";
import ProductCard from "../Card/ProductCard";
import "./ProductListing.scss";
import { Product, Brand } from "../../api/types";

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
}

function ProductListing({ products = [], brands = [] }: ProductListingProps) {
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
          />
        ))}
      </div>
    </div>
  );
}

export default ProductListing;
