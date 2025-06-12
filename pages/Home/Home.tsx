"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "../../api/api";
import { Product, Brand, HomepageData } from "../../api/types";
import "./Home.scss";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Categories from "../../components/Categories/Categories";
import Search from "../../components/Search/Search";
import ProductListing from "../../components/ProductListing/ProductListing";

// Force immediate data load on component mount
const useInitialDataLoad = (loadCallback: () => void) => {
  const hasLoaded = useRef(false);

  // Use useLayoutEffect to ensure this runs before render
  useLayoutEffect(() => {
    if (!hasLoaded.current) {
      loadCallback();
      hasLoaded.current = true;
    }
  }, []);
};

function Home() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [favoriteProductIds, setFavoriteProductIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSearchResults, setIsSearchResults] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>("");

  // Store complete homepage data from /web endpoint
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);

  // Track if initial data load has been completed
  const initialDataLoaded = useRef(false);
  // Track if a search is currently in progress
  const isSearching = useRef(false);
  // Track if favorites are being loaded
  const loadingFavorites = useRef(false);

  // Direct API call for initial data
  const loadInitialData = async () => {
    try {
      setLoading(true);
      console.log("Home: Loading initial data from /web endpoint");
      const data = await api.home.getData();
      console.log("Home: Received homepage data", data);

      // Log the exact structure of the critical data for debugging
      console.log(
        "Home: Brands structure:",
        data.brands ? JSON.stringify(data.brands[0]) : "No brands"
      );
      console.log(
        "Home: Regions structure:",
        data.regions ? JSON.stringify(data.regions[0]) : "No regions"
      );
      console.log(
        "Home: Colors structure:",
        data.colors ? JSON.stringify(data.colors[0]) : "No colors"
      );

      // Make sure the data has the expected structure
      if (!data.brands) {
        console.warn("Home: Missing brands in homepage data");
      }
      if (!data.regions) {
        console.warn("Home: Missing regions in homepage data");
      }
      if (!data.colors) {
        console.warn("Home: Missing colors in homepage data");
      }

      setHomepageData(data);
      setProducts(data.products || []);
      setBrands(data.brands || []);
      initialDataLoaded.current = true;
    } catch (error) {
      console.error("Direct load failed:", error);
      setError("Failed to load initial data");
    } finally {
      setLoading(false);
    }
  };

  // Use custom hook to ensure immediate data load
  useInitialDataLoad(loadInitialData);

  // Function to fetch data based on current URL parameters
  const fetchData = async () => {
    // Skip if a search is already in progress to prevent concurrent requests
    if (isSearching.current) {
      return;
    }

    try {
      isSearching.current = true;
      setLoading(true);

      // Get current URL search params directly from window.location
      const currentUrlParams = new URLSearchParams(window.location.search);

      // Generate a search key to avoid duplicate fetches
      const newSearchKey = currentUrlParams.toString();

      // Skip if we've already fetched this exact search
      if (newSearchKey === searchKey) {
        setLoading(false);
        isSearching.current = false;
        return;
      }

      // Update the search key
      setSearchKey(newSearchKey);

      // Check if we have search parameters
      const hasSearchParams =
        currentUrlParams.get("search") ||
        currentUrlParams.get("brand_id") ||
        currentUrlParams.get("top") ||
        currentUrlParams.get("color_id") ||
        currentUrlParams.get("price_from") ||
        currentUrlParams.get("price_to") ||
        currentUrlParams.get("memory") ||
        currentUrlParams.get("ram_from");

      // Ensure we have homepage data for categories/brands before performing search
      if (!homepageData && !initialDataLoaded.current) {
        try {
          const data = await api.home.getData();
          setHomepageData(data);
          setBrands(data.brands || []);
          initialDataLoaded.current = true;
        } catch (homeError) {
          console.error("Error fetching homepage data:", homeError);
          setError("Failed to load homepage data");
          setLoading(false);
          isSearching.current = false;
          return;
        }
      }

      // If search params exist, run search instead of getting homepage data
      if (hasSearchParams) {
        // Search requires a search parameter, even if empty
        const searchQuery: any = {
          search: currentUrlParams.get("search") || "",
        };

        // Convert all parameters to their correct types for the backend
        if (currentUrlParams.get("top"))
          searchQuery.top = currentUrlParams.get("top") === "true";

        // Handle is_new parameter (internal frontend parameter)
        if (currentUrlParams.get("is_new") === "true")
          searchQuery.is_new = true;
        if (currentUrlParams.get("is_new") === "false")
          searchQuery.is_new = false;

        // Convert all numeric IDs and values to numbers
        if (currentUrlParams.get("region_id"))
          searchQuery.region_id = Number(currentUrlParams.get("region_id"));
        if (currentUrlParams.get("brand_id")) {
          searchQuery.brand_id = Number(currentUrlParams.get("brand_id"));
        }
        if (currentUrlParams.get("model_id"))
          searchQuery.model_id = Number(currentUrlParams.get("model_id"));

        // Handle color_id properly (ensure it's a number, not a hex value)
        const colorId = currentUrlParams.get("color_id");
        if (colorId) {
          // Only process if it doesn't start with #
          if (!colorId.startsWith("#")) {
            searchQuery.color_id = Number(colorId);
          }
        }

        // Handle price range
        if (currentUrlParams.get("price_from"))
          searchQuery.price_from = Number(currentUrlParams.get("price_from"));
        if (currentUrlParams.get("price_to"))
          searchQuery.price_to = Number(currentUrlParams.get("price_to"));

        // Handle memory parameters - convert to memory_from/memory_to as needed
        if (currentUrlParams.get("memory")) {
          searchQuery.memory_from = Number(currentUrlParams.get("memory"));
        }
        if (currentUrlParams.get("memory_from"))
          searchQuery.memory_from = Number(currentUrlParams.get("memory_from"));
        if (currentUrlParams.get("memory_to"))
          searchQuery.memory_to = Number(currentUrlParams.get("memory_to"));

        // Handle RAM parameters
        if (currentUrlParams.get("ram_from"))
          searchQuery.ram_from = Number(currentUrlParams.get("ram_from"));
        if (currentUrlParams.get("ram_to"))
          searchQuery.ram_to = Number(currentUrlParams.get("ram_to"));

        // Get search results using POST with JSON body (as per updated backend docs)
        const searchResults = await api.product.search(searchQuery);
        setProducts(searchResults);
        setIsSearchResults(true);

        // We don't need to fetch homepage data again - use what we already have
        // This will prevent the categories from disappearing during search
      } else {
        // Skip if we've already loaded initial data and there's no search params
        if (initialDataLoaded.current && !hasSearchParams) {
          setLoading(false);
          isSearching.current = false;
          return;
        }

        // Get complete homepage data from /web endpoint
        try {
          const data = await api.home.getData();

          // Store the complete data
          setHomepageData(data);

          // Update component state with specific data
          setProducts(data.products || []);
          setBrands(data.brands || []);
          setIsSearchResults(false);
          initialDataLoaded.current = true;
        } catch (homeError) {
          console.error("Error fetching homepage data:", homeError);
          setError("Failed to load homepage data");
        }
      }

      // Check if user is authenticated and fetch favorites
      if (checkAuthentication()) {
        try {
          // Get user profile which contains favourite_items
          const userProfile = await api.user.getProfile();
          if (userProfile && Array.isArray(userProfile.favourite_items)) {
            const favIds = userProfile.favourite_items.map(
              (fav: any) => fav.product_id
            );
            console.log("Fetched favorite product IDs:", favIds);
            setFavoriteProductIds(favIds);
          }
        } catch (favError) {
          console.error("Error fetching user favorites:", favError);
          // Non-critical error, we can still show products without favorite information
        }
      }
    } catch (err) {
      console.error("Error in fetchData:", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
      isSearching.current = false;
      initialDataLoaded.current = true;
    }
  };

  // Check if user is authenticated
  const checkAuthentication = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      setIsAuthenticated(!!token);
      return !!token;
    }
    return false;
  };

  // Fetch user's favorites
  const fetchUserFavorites = async () => {
    if (!checkAuthentication() || loadingFavorites.current) return;

    try {
      loadingFavorites.current = true;
      // Get user profile to extract favorite items
      const userProfile = await api.user.getProfile();
      if (userProfile && Array.isArray(userProfile.favourite_items)) {
        const favoriteIds = userProfile.favourite_items.map(
          (fav: any) => fav.product_id
        );
        setFavoriteProductIds(favoriteIds);
        console.log("Fetched user favorites:", favoriteIds);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      loadingFavorites.current = false;
    }
  };

  // Add listener for favorites changes
  useEffect(() => {
    const handleFavoritesChanged = (event: CustomEvent) => {
      const { productId, isFavorite } = event.detail;

      // Update favorites state based on the event
      setFavoriteProductIds((prevFavoriteIds) => {
        if (isFavorite && !prevFavoriteIds.includes(productId)) {
          return [...prevFavoriteIds, productId];
        } else if (!isFavorite && prevFavoriteIds.includes(productId)) {
          return prevFavoriteIds.filter((id) => id !== productId);
        }
        return prevFavoriteIds;
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

  // Initial data load only once - using normal useEffect as backup
  useEffect(() => {
    if (typeof window !== "undefined" && !initialDataLoaded.current) {
      fetchData();
      // Check authentication and fetch favorites
      const isAuth = checkAuthentication();
      if (isAuth) {
        fetchUserFavorites();
      }
    }
  }, []); // Empty dependency array ensures this only runs once

  // Fetch favorites when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserFavorites();
    } else {
      setFavoriteProductIds([]);
    }
  }, [isAuthenticated]);

  // Check authentication status on mount and when localStorage changes
  useEffect(() => {
    checkAuthentication();

    // Listen for storage events to detect login/logout in other tabs
    const handleStorageChange = () => {
      const wasAuthenticated = isAuthenticated;
      const isAuth = checkAuthentication();

      // If auth status changed, update favorites
      if (wasAuthenticated !== isAuth) {
        if (isAuth) {
          fetchUserFavorites();
        } else {
          setFavoriteProductIds([]);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Handle searchParams changes, but with debouncing to prevent excessive calls
  useEffect(() => {
    if (typeof window !== "undefined" && initialDataLoaded.current) {
      // Only process searchParams changes if we've already loaded initial data
      const timer = setTimeout(() => {
        // Instead of fetching new data from the server, just update the UI based on the current URL
        // This will prevent a page refresh when the URL changes
        const currentUrlParams = new URLSearchParams(window.location.search);
        const newSearchKey = currentUrlParams.toString();

        // Skip if we've already processed this exact search
        if (newSearchKey === searchKey) {
          return;
        }

        // Only fetch data if this is triggered by a browser navigation (back/forward button)
        // For normal searches, the data is already updated by the Search component
        if (isSearchResults) {
          // The Search component has already updated the UI, no need to fetch data again
          return;
        }

        fetchData();
      }, 300); // 300ms debounce

      return () => clearTimeout(timer);
    }
  }, [searchParams]); // React to changes in searchParams, but with debounce

  const handleSearchResults = (results: Product[]) => {
    setProducts(results);
    setIsSearchResults(true);
  };

  // Handler for resetting search and filters
  const handleReset = () => {
    // Don't do anything if a reset is already in progress
    if (isSearching.current) {
      return;
    }

    // Set flag to indicate we're fetching data
    isSearching.current = true;
    setLoading(true);

    // Reset the search key
    setSearchKey("");

    // Reset search results flag
    setIsSearchResults(false);

    // Fetch initial data from /web endpoint
    api.home
      .getData()
      .then((data) => {
        console.log("Home (reset): Received homepage data", {
          hasBrands: !!data.brands,
          brandCount: data.brands?.length || 0,
          hasRegions: !!data.regions,
          regionCount: data.regions?.length || 0,
          hasColors: !!data.colors,
          colorCount: data.colors?.length || 0,
          productCount: data.products?.length || 0,
        });

        setHomepageData(data);
        setProducts(data.products || []);
        setBrands(data.brands || []);
        initialDataLoaded.current = true;
      })
      .catch((error) => {
        console.error("Error fetching homepage data:", error);
        setError("Failed to load homepage data");
      })
      .finally(() => {
        setLoading(false);
        isSearching.current = false;
      });
  };

  // Add navigation state change listener to handle browser back/forward buttons
  useEffect(() => {
    // Handler for popstate events (back/forward buttons)
    const handlePopState = () => {
      if (typeof window !== "undefined" && !isSearching.current) {
        // Re-fetch data based on the new URL parameters
        fetchData();
      }
    };

    // Handler for category filter changes from the Categories component
    const handleCategoryFilterChange = (event: CustomEvent) => {
      if (typeof window !== "undefined" && !isSearching.current) {
        // Re-fetch data based on the new URL parameters
        fetchData();
      }
    };

    // Add event listeners
    window.addEventListener("popstate", handlePopState);
    window.addEventListener(
      "categoryFilterChange",
      handleCategoryFilterChange as EventListener
    );

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener(
        "categoryFilterChange",
        handleCategoryFilterChange as EventListener
      );
    };
  }, []);

  // Handler for category clicks
  const handleCategoryClick = (brandId: number) => {
    // Don't do anything if a search is already in progress
    if (isSearching.current) {
      return;
    }

    // Update URL with the brand filter
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("brand_id", brandId.toString());

    // Update URL without page refresh
    const newUrl = `/?${searchParams.toString()}`;
    window.history.pushState({ path: newUrl }, "", newUrl);

    // Update searchKey to trigger a data fetch
    setSearchKey(searchParams.toString());

    // Fetch data with the new filter
    const searchQuery = {
      search: "",
      brand_id: brandId,
    };

    // Immediately search without going through the fetchData function
    isSearching.current = true;
    setLoading(true);

    api.product
      .search(searchQuery)
      .then((results) => {
        setProducts(results);
        setIsSearchResults(true);

        // Dispatch a custom event to notify Search component of filter changes
        window.dispatchEvent(new Event("popstate"));
      })
      .catch((error) => {
        console.error("Error searching by category:", error);
        setError("Failed to fetch products for this category");
      })
      .finally(() => {
        setLoading(false);
        isSearching.current = false;
      });
  };

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="home-page">
      <Header />
      <main className="main-content">
        <Search
          onSearch={handleSearchResults}
          setLoading={setLoading}
          setError={setError}
          homepageData={homepageData}
          onReset={handleReset}
        />
        <Categories brands={brands} onCategoryClick={handleCategoryClick} />
        <ProductListing
          products={products}
          brands={brands}
          favoriteProductIds={favoriteProductIds}
          isSearchResults={isSearchResults}
          isLoading={loading}
        />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
