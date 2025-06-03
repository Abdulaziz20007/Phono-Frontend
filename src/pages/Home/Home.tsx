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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.home.getData();
        setProducts(data.products);
        setBrands(data.brands);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
        console.error("Error fetching homepage data:", err);
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
        <ProductListing products={products} brands={brands} />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
