"use client";

import React from "react";
import styles from "@/styles/search_styles/search.module.css";
import { SearchCriteria } from "@/types/api_types";
import { FEATURES, PROPERTY_TYPES, wilayas, SEARCH_FEATURES } from "@/data/auth_data/data";

interface SearchFilterPanelProps {
  criteria: SearchCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<SearchCriteria>>;
  onSearch: () => void;
  loading: boolean;
}

const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({
  criteria,
  setCriteria,
  onSearch,
  loading
}) => {
  const toggleItem = (list: string[] | undefined, item: string, key: keyof SearchCriteria) => {
    const newList = list || [];
    const updated = newList.includes(item)
      ? newList.filter((i) => i !== item)
      : [...newList, item];
    setCriteria((prev) => ({ ...prev, [key]: updated }));
  };

  const handleInputChange = (key: keyof SearchCriteria, value: string | number) => {
    setCriteria((prev) => ({ ...prev, [key]: value === "" ? undefined : value }));
  };

  return (
    <div className={styles.filterPanel}>
      <div className={styles.filterGrid}>
        {/* Type Selection */}
        <div className={styles.filterSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Type</span>
            <span className={styles.subLabel}>(you can choose only one)</span>
          </div>
          <div className={styles.chipContainer}>
            {PROPERTY_TYPES.map((type) => (
              <div
                key={type}
                className={`${styles.chip} ${criteria.house_type === type ? styles.chipActive : ""}`}
                onClick={() => setCriteria(prev => ({ ...prev, house_type: criteria.house_type === type ? undefined : type }))}
              >
                {type}
              </div>
            ))}
          </div>
        </div>

        {/* Wilaya Selection */}
        <div className={styles.filterSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Wilaya</span>
          </div>
          <select
            className={styles.selectInput}
            value={criteria.wilaya || ""}
            onChange={(e) => handleInputChange("wilaya", e.target.value)}
          >
            <option value="">Select Wilaya</option>
            {wilayas.map((w) => (
              <option key={w.code} value={w.code}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ratings Section */}
        <div className={styles.filterSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Renter's rating</span>
          </div>
          <div className={styles.inputPair}>
            <input
              type="number"
              placeholder="Min"
              className={styles.textInput}
              min={0}
              max={5}
              value={criteria.renter_rating ?? ""}
              onChange={(e) => handleInputChange("renter_rating", parseFloat(e.target.value))}
            />
            <input
              type="number"
              placeholder="Max"
              className={styles.textInput}
              min={0}
              max={5}
              value={criteria.max_renter_rating ?? ""}
              onChange={(e) => handleInputChange("max_renter_rating", parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className={styles.filterSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Nook's rating</span>
          </div>
          <div className={styles.inputPair}>
            <input
              type="number"
              placeholder="Min"
              className={styles.textInput}
              min={0}
              max={5}
              value={criteria.post_rating ?? ""}
              onChange={(e) => handleInputChange("post_rating", parseFloat(e.target.value))}
            />
            <input
              type="number"
              placeholder="Max"
              className={styles.textInput}
              min={0}
              max={5}
              value={criteria.max_post_rating ?? ""}
              onChange={(e) => handleInputChange("max_post_rating", parseFloat(e.target.value))}
            />
          </div>
        </div>

        {/* Price per night */}
        <div className={styles.filterSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Price per night</span>
          </div>
          <div className={styles.inputPair}>
            <input
              type="number"
              placeholder="Min"
              className={styles.textInput}
              value={criteria.min_price || ""}
              onChange={(e) => handleInputChange("min_price", parseInt(e.target.value))}
            />
            <input
              type="number"
              placeholder="Max"
              className={styles.textInput}
              value={criteria.max_price || ""}
              onChange={(e) => handleInputChange("max_price", parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Number of tenants */}
        <div className={styles.filterSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Number of tenants</span>
          </div>
          <input
            type="number"
            placeholder="max"
            className={styles.textInput}
            value={criteria.number_of_rooms || ""}
            onChange={(e) => handleInputChange("number_of_rooms", parseInt(e.target.value))}
          />
        </div>

        {/* Categories */}
        <div className={styles.filterSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Categories</span>
            <span className={styles.subLabel}>(select allowed guest types)</span>
          </div>
          <div className={styles.chipContainer}>
            {(["Families", "Single", "Couple"] as const).map((cat) => (
              <div
                key={cat}
                className={`${styles.chip} ${criteria.allowed_people?.[cat] ? styles.chipActive : ""}`}
                onClick={() => setCriteria(prev => ({
                  ...prev,
                  allowed_people: {
                    ...prev.allowed_people!,
                    [cat]: !prev.allowed_people?.[cat]
                  }
                }))}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className={styles.filterSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Rules</span>
          </div>
          <div className={styles.chipContainer}>
            {["Animals", "Smoking", "Noise"].map((rule) => (
              <div
                key={rule}
                className={`${styles.chip} ${criteria.rules?.includes(rule) ? styles.chipActive : ""}`}
                onClick={() => toggleItem(criteria.rules, rule, "rules")}
              >
                {rule}
              </div>
            ))}
          </div>
        </div>

        {/* Sorting Section */}
        <div className={styles.filterSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Sort results by</span>
          </div>
          <select
            className={styles.selectInput}
            value={criteria.order_by || "newest"}
            onChange={(e) => handleInputChange("order_by", e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_asc">Rating: Low to High</option>
            <option value="rating_desc">Rating: High to Low</option>
          </select>
        </div>
      </div>

      {/* Features Grid */}
      <div className={styles.filterSection} style={{ marginTop: "2.5rem" }}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Features</span>
        </div>
        <div className={styles.chipContainer}>
          {SEARCH_FEATURES.map((feature) => (
            <div
              key={feature}
              className={`${styles.chip} ${criteria.features?.includes(feature) ? styles.chipActive : ""}`}
              onClick={() => toggleItem(criteria.features, feature, "features")}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.searchButtonContainer}>
        <button className={styles.searchButton} onClick={onSearch} disabled={loading}>
          {loading ? (
            "Searching..."
          ) : (
            <>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Find Rentals
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchFilterPanel;
