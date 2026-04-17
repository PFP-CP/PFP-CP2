"use client";

import React, { useState } from "react";
import styles from "@/styles/search_styles/search.module.css";
import { SearchResult } from "@/types/api_types";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getFullImageUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return `${BACKEND_URL}${url}`;
    return null;
}

interface SearchResultsTableProps {
    results: SearchResult[];
}

function SearchResultRow({ result, idx }: { result: SearchResult; idx: number }) {
    const [imgError, setImgError] = useState(false);
    const imageUrl = getFullImageUrl(result.picture);

    return (
        <tr key={idx}>
            <td className={styles.td}>
                {imageUrl && !imgError ? (
                    <img
                        src={imageUrl}
                        alt="Property"
                        onError={() => setImgError(true)}
                        className={styles.propertyPhoto}
                        style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "6px" }}
                    />
                ) : (
                    <div style={{
                        width: "120px", height: "80px",
                        background: "linear-gradient(135deg, #7c5cdb22, #7c5cdb44)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "2rem", borderRadius: "6px"
                    }}>
                        🏠
                    </div>
                )}
            </td>
            <td className={styles.td}>
                <div className={styles.descriptionCell}>
                    <span className={styles.propertyType}>
                        {result.description?.split(".")[0] || "Property"}
                    </span>
                    <p>{result.description}</p>
                    <span className={styles.propertyPrice}>{result.price} DA per night</span>
                    <div className={styles.rating}>
                        <span>{result.rating}</span>
                        <span className={styles.star}>★</span>
                    </div>
                </div>
            </td>
            <td className={styles.td}>{result.wilaya || "—"}</td>
            <td className={styles.td}>{result.renter_name}</td>
            <td className={styles.td}>{result.phone_number || "N/A"}</td>
            <td className={styles.td}>{result.contact}</td>
        </tr>
    );
}

const SearchResultsTable: React.FC<SearchResultsTableProps> = ({ results }) => {
    if (results.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "3rem", color: "#666" }}>
                No results found. Try adjusting your filters.
            </div>
        );
    }

    return (
        <div className={styles.resultsContainer}>
            <p className={styles.sortingNote}>Results shown according to your selected sort order</p>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th}>Photo</th>
                        <th className={styles.th}>Description</th>
                        <th className={styles.th}>Wilaya</th>
                        <th className={styles.th}>Renter&apos;s name</th>
                        <th className={styles.th}>Mobile</th>
                        <th className={styles.th}>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result, idx) => (
                        <SearchResultRow key={idx} result={result} idx={idx} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SearchResultsTable;
