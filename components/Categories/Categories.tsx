import React from "react";
import { Brand } from "../../api/types";
import "./Categories.scss";
import { useRouter } from "next/navigation";

interface CategoriesProps {
  brands: Brand[] | undefined;
  onCategoryClick?: (brandId: number) => void;
}

function Categories({ brands = [], onCategoryClick }: CategoriesProps) {
  const router = useRouter();

  const allCategories = brands
    ? [
        ...brands.map((brand) => ({
          id: brand.id,
          name: brand.name,
          icon: brand.logo,
        })),
      ]
    : [];

  const handleCategoryClick = (brandId: number) => {
    // If there's a callback provided, use it (this allows parent to handle search)
    if (onCategoryClick) {
      onCategoryClick(brandId);
      return;
    }

    // Otherwise, update the URL without refreshing the page
    const searchParams = new URLSearchParams();
    searchParams.set("brand_id", brandId.toString());

    // Use history API to update URL without page refresh
    const newUrl = `/?${searchParams.toString()}`;
    window.history.pushState({ path: newUrl }, "", newUrl);

    // Dispatch a custom event to notify the app of the filter change
    window.dispatchEvent(
      new CustomEvent("categoryFilterChange", {
        detail: { brandId },
      })
    );

    // Also trigger a popstate event to update the Search component
    window.dispatchEvent(new Event("popstate"));
  };

  return (
    <div className="categories-section">
      <h2 className="categories-title">Категории</h2>
      <div className="categories-grid">
        {allCategories.map((category) => (
          <div
            key={category.id}
            className="category-item"
            onClick={() => handleCategoryClick(category.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleCategoryClick(category.id);
              }
            }}
          >
            <div className="category-icon-container">
              <img
                src={category.icon}
                alt={category.name}
                className="category-icon"
              />
            </div>
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
