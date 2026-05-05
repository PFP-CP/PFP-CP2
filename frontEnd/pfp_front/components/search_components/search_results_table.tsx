"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "@/styles/search_styles/search.module.css";
import { SearchResult } from "@/types/api_types";
import { getWilayaName } from "@/data/auth_data/data";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getFullImageUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return `${BACKEND_URL}${url}`;
    return null;
}

function SearchResultCard({ result }: { result: SearchResult }) {
    const [imgError, setImgError] = useState(false);
    const imageUrl = getFullImageUrl(result.picture);
    const wilayaName = getWilayaName(result.wilaya) || result.wilaya || "—";
    const displayTitle = result.title || wilayaName;

    return (
        <div className={styles.card}>
            <div className={styles.cardImage}>
                {imageUrl && !imgError ? (
                    <img
                        src={imageUrl}
                        alt="Property"
                        className={styles.cardImg}
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className={styles.cardImgFallback}>🏠</div>
                )}
            </div>

            <div className={styles.cardBody}>
                <p className={styles.cardTitle}>
                    <Link href={`/post/${result.id}`} className={styles.cardTitleLink}>{displayTitle}</Link>
                </p>
                <p className={styles.cardLocation}>{wilayaName}</p>

                <div className={styles.cardMeta}>
                    <span className={styles.cardPrice}>{result.price} DA / night</span>
                    <span className={styles.cardRating}>
                        <span className={styles.star}>★</span>
                        {result.rating ?? "—"}
                    </span>
                </div>
            </div>

            <div className={styles.cardFooter}>
                {result.renter_id ? (
                    <Link
                        href={`/profile/${result.renter_id}`}
                        className={styles.hostLink}
                    >
                        {result.renter_name}
                    </Link>
                ) : (
                    <span className={styles.hostLink} style={{ cursor: "default", color: "#888" }}>
                        {result.renter_name}
                    </span>
                )}
            </div>
        </div>
    );
}

const SearchResultsTable: React.FC<{ results: SearchResult[] }> = ({ results }) => {
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
            <div className={styles.cardsGrid}>
                {results.map((result) => (
                    <SearchResultCard key={result.id} result={result} />
                ))}
            </div>
        </div>
    );
};

export default SearchResultsTable;
