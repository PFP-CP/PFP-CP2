'use client'

import { useEffect, useState } from "react"
import { getSavedPosts } from "@/app/(main_page)/(post)/post/[id]/actions/getPost"
import { Property } from "@/types/api_types"
import PropertyCard from "@/components/home_components/property_card"
import Loading from "@/components/loading"
import styles from "@/styles/my_favorites_styles/favorites_page.module.css"

export default function MyFavoritesPage() {
    const [favorites, setFavorites] = useState<Property[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getSavedPosts().then((data) => {
            setFavorites(data as Property[])
            setLoading(false)
        })
    }, [])

    if (loading) return <Loading text="Loading your Favorites..." />

    return (
        <main className={styles.page}>
            <div className={styles.header}>
                <div className={styles.title_section}>
                    <h1 className={styles.page_title}>My Favorites</h1>
                </div>
            </div>
            {favorites.length > 0 ? (
                <div className={styles.grid}>
                    {favorites.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            ) : (
                <div className={styles.empty}>
                    No favorites yet. Start exploring properties!
                </div>
            )}
        </main>
    )
}