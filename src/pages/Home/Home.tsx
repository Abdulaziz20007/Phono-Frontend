"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../api/api";
import { Product, Brand } from "../../api/types";
import "./Home.scss";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Categories from "../../components/Categories/Categories";
import Search from "../../components/Search/Search";
import ProductListing from "../../components/ProductListing/ProductListing";

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [favoriteProductIds, setFavoriteProductIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuthentication = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        setIsAuthenticated(!!token);
        return !!token;
      }
      return false;
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.home.getData();
        setProducts(data.products);
        setBrands(data.brands);

        // Check if user is authenticated and fetch favorites
        if (checkAuthentication()) {
          try {
            // First try to get user profile which contains favorite_items
            const userProfile = await api.user.getProfile();
            if (userProfile && Array.isArray(userProfile.favourite_items)) {
              const favIds = userProfile.favourite_items.map(
                (fav: any) => fav.product_id
              );
              setFavoriteProductIds(favIds);
            }
          } catch (favError) {
            console.error("Error fetching user favorites:", favError);
            // Non-critical error, we can still show products without favorite information
          }
        }
      } catch (err) {
        setError("Failed to fetch data");
        console.error("Error fetching homepage data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      fetchData();
    }
  }, []);

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="home-page">
      <Header />
      <main className="main-content">
        <Search />
        <Categories brands={brands} />
        <ProductListing
          products={products}
          brands={brands}
          favoriteProductIds={favoriteProductIds}
          isAuthenticated={isAuthenticated}
        />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
