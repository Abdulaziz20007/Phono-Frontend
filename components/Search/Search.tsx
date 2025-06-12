"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./Search.scss";
import FilterModal from "../FilterModal";
import { FilterState } from "../FilterModal/types";
import { api } from "../../api/api";
import { HomepageData } from "../../api/types";

interface SearchProps {
  onSearch: (products: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  homepageData?: HomepageData | null;
  onReset?: () => void;
}

function Search({
  onSearch,
  setLoading,
  setError,
  homepageData,
  onReset,
}: SearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearchComplete = useRef(false);
  const isSearching = useRef(false);
  const lastSearchQuery = useRef("");

  const [searchText, setSearchText] = useState(
    searchParams?.get("search") || ""
  );
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    region: searchParams?.get("region_id") || "",
    topAdsOnly: searchParams?.get("top") === "true",
    condition:
      searchParams?.get("is_new") === "true"
        ? "new"
        : searchParams?.get("is_new") === "false"
        ? "used"
        : "",
    brand: searchParams?.get("brand_id") || "",
    model: searchParams?.get("model_id") || "",
    memory: searchParams?.get("memory") || "",
    color: searchParams?.get("color_id") || "",
    priceForm: searchParams?.get("price_from") || "",
    priceTo: searchParams?.get("price_to") || "",
  });

  // Check URL parameters to update active filters when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);

      // Only update if there are actual changes
      const newFilters = {
        region: urlParams.get("region_id") || "",
        topAdsOnly: urlParams.get("top") === "true",
        condition:
          urlParams.get("is_new") === "true"
            ? "new"
            : urlParams.get("is_new") === "false"
            ? "used"
            : "",
        brand: urlParams.get("brand_id") || "",
        model: urlParams.get("model_id") || "",
        memory: urlParams.get("memory") || "",
        color: urlParams.get("color_id") || "",
        priceForm: urlParams.get("price_from") || "",
        priceTo: urlParams.get("price_to") || "",
      };

      // Update search text from URL if it exists
      const searchTextFromUrl = urlParams.get("search") || "";
      if (searchTextFromUrl !== searchText) {
        setSearchText(searchTextFromUrl);
      }

      // Check if filters have changed
      const filtersChanged =
        JSON.stringify(newFilters) !== JSON.stringify(activeFilters);
      if (filtersChanged) {
        setActiveFilters(newFilters);
      }
    }
  }, [searchParams]); // Re-run when searchParams change

  // Skip initial search - we'll let the Home component handle initial data loading
  useEffect(() => {
    initialSearchComplete.current = true;
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior which would refresh the page
    performSearch();
  };

  const handleFilterClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
    performSearch(filters);
  };

  const handleResetClick = () => {
    // Clear search text
    setSearchText("");

    // Reset active filters
    setActiveFilters({
      region: "",
      topAdsOnly: false,
      condition: "",
      brand: "",
      model: "",
      memory: "",
      color: "",
      priceForm: "",
      priceTo: "",
    });

    // Reset URL without triggering navigation
    window.history.pushState({}, "", "/");

    // Call the onReset callback to let the parent component reset its state
    if (onReset) {
      onReset();
    }

    // Reset the lastSearchQuery to prevent skipping the next search
    lastSearchQuery.current = "";
  };

  const performSearch = async (filters: FilterState = activeFilters) => {
    // Don't search if there's no query or filters
    if (!searchText && !Object.values(filters).some((val) => val)) {
      return;
    }

    // Don't search if another search is in progress
    if (isSearching.current) {
      return;
    }

    try {
      isSearching.current = true;
      setLoading(true);

      // Build search params for the backend (with proper types)
      const searchParams: any = {
        search: searchText || "", // Ensure search is included even if empty
      };

      // Convert string IDs to numbers for backend
      if (filters.region) searchParams.region_id = Number(filters.region);
      if (filters.topAdsOnly) searchParams.top = true;

      // Note: is_new is a frontend-only parameter - we don't send it to backend
      if (filters.condition === "new") searchParams.is_new = true;
      if (filters.condition === "used") searchParams.is_new = false;

      if (filters.brand) searchParams.brand_id = Number(filters.brand);
      if (filters.model) searchParams.model_id = Number(filters.model);

      // Handle memory as memory_from parameter
      if (filters.memory) {
        const memoryValue = Number(filters.memory);
        searchParams.memory_from = memoryValue;
      }

      // Handle color as a numeric ID
      if (filters.color) searchParams.color_id = Number(filters.color);

      // Handle price range
      if (filters.priceForm)
        searchParams.price_from = Number(filters.priceForm);
      if (filters.priceTo) searchParams.price_to = Number(filters.priceTo);

      // Create a query string to check for duplicate searches
      const queryString = JSON.stringify(searchParams);

      // Skip if this is the same search we just performed
      if (queryString === lastSearchQuery.current) {
        setLoading(false);
        isSearching.current = false;
        return;
      }

      // Update last search query
      lastSearchQuery.current = queryString;

      // Create URL parameters for display in the URL bar (not sent to backend)
      const urlParams = new URLSearchParams();
      Object.entries({
        search: searchText,
        region_id: filters.region || undefined,
        top: filters.topAdsOnly ? "true" : undefined,
        is_new: filters.condition
          ? filters.condition === "new"
            ? "true"
            : "false"
          : undefined,
        brand_id: filters.brand || undefined,
        model_id: filters.model || undefined,
        memory: filters.memory || undefined,
        color_id: filters.color || undefined,
        price_from: filters.priceForm || undefined,
        price_to: filters.priceTo || undefined,
      }).forEach(([key, value]) => {
        if (value) {
          if (!(key === "color_id" && value.toString().startsWith("#"))) {
            urlParams.set(key, value as string);
          }
        }
      });

      // Update URL without causing navigation/refresh
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.pushState({ path: newUrl }, "", newUrl);

      // Execute search using POST with JSON body
      const results = await api.product.search(searchParams);

      // Update components with search results without page refresh
      onSearch(results);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
      isSearching.current = false;
    }
  };

  // Count active filters
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  // Determine if there are active filters or search from the current URL
  const hasActiveSearch = () => {
    if (searchText) return true;

    // Check if any filter is active
    if (Object.values(activeFilters).some((value) => !!value)) return true;

    // If nothing is set in component state, check URL directly
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      return Array.from(urlParams.keys()).length > 0;
    }

    return false;
  };

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Введите например S22 Ultra"
            value={searchText}
            onChange={handleSearchChange}
            className="search-input"
          />
          <div className="search-buttons">
            {hasActiveSearch() && (
              <button
                type="button"
                className="reset-button"
                onClick={handleResetClick}
                aria-label="Reset search and filters"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.7 3.3C12.3 2.9 11.7 2.9 11.3 3.3L8 6.6L4.7 3.3C4.3 2.9 3.7 2.9 3.3 3.3C2.9 3.7 2.9 4.3 3.3 4.7L6.6 8L3.3 11.3C2.9 11.7 2.9 12.3 3.3 12.7C3.7 13.1 4.3 13.1 4.7 12.7L8 9.4L11.3 12.7C11.7 13.1 12.3 13.1 12.7 12.7C13.1 12.3 13.1 11.7 12.7 11.3L9.4 8L12.7 4.7C13.1 4.3 13.1 3.7 12.7 3.3Z"
                    fill="#333"
                  />
                </svg>
              </button>
            )}
            <button
              type="button"
              className="filter-button"
              onClick={handleFilterClick}
            >
              {activeFilterCount > 0 && (
                <span className="filter-count">{activeFilterCount}</span>
              )}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.33331 1.33331H14.6666L9.33331 7.60665V12.6666L6.66665 14V7.60665L1.33331 1.33331Z"
                  stroke="#333"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <button type="submit" className="search-button">
          Поиск
        </button>
      </form>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={handleCloseFilterModal}
        onApplyFilters={handleApplyFilters}
        initialFilters={activeFilters}
        homepageData={homepageData}
      />
    </div>
  );
}

export default Search;
