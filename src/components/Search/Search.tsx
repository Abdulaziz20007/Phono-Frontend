"use client";

import React, { useState } from "react";
import "./Search.scss";
import FilterModal from "../FilterModal";
import { FilterState } from "../FilterModal/types";

function Search() {
  const [searchText, setSearchText] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search submit logic here
    console.log("searching for:", searchText);
  };

  const handleFilterClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = (filters: FilterState) => {
    console.log("applied filters:", filters);
    // here you would typically update your search results based on filters
  };

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Type e.g Slots games"
            value={searchText}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button
            type="button"
            className="filter-button"
            onClick={handleFilterClick}
          >
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
        <button type="submit" className="search-button">
          Поиск
        </button>
      </form>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={handleCloseFilterModal}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
}

export default Search;
