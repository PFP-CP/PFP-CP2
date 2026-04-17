"use client";

import React, { useState, useEffect } from "react";
import styles from "@/styles/search_styles/search.module.css";
import SearchFilterPanel from "@/components/search_components/search_filter_panel";
import SearchResultsTable from "@/components/search_components/search_results_table";
import { api } from "@/lib/api";
import { SearchCriteria, SearchResult } from "@/types/api_types";

export default function FindRentalsPage() {
  const [criteria, setCriteria] = useState<SearchCriteria>({
    features: [],
    allowed_people: {
      Families: true,
      Couple: true,
      Single: true
    },
    rules: [],
    order_by: "newest"
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.searchProperties(criteria);
      setResults(data);
    } catch (err: any) {
      console.error("Search failed:", err);
      setError(err.message || "Something went wrong during search.");
    } finally {
      setLoading(false);
    }
  };

  // Initial search on load
  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Find Rentals</h1>
      
      {error && (
        <div style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <SearchFilterPanel 
        criteria={criteria} 
        setCriteria={setCriteria} 
        onSearch={handleSearch}
        loading={loading}
      />

      <SearchResultsTable results={results} />
    </div>
  );
}
