import React from "react";
import { Brand } from "../../api/types";
import "./Categories.scss";

interface CategoriesProps {
  brands: Brand[] | undefined;
}

function Categories({ brands = [] }: CategoriesProps) {
  const allCategories = brands
    ? [
        ...brands.map((brand) => ({
          id: brand.id,
          name: brand.name,
          icon: brand.logo,
        })),
      ]
    : [];

  return (
    <div className="categories-section">
      <h2 className="categories-title">Категории</h2>
      <div className="categories-grid">
        {allCategories.map((category) => (
          <div key={category.id} className="category-item">
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
