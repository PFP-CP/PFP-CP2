'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Property } from "@/types/api_types"
import PropertyCard from "@/components/home_components/property_card"

export default function MyFavoritesPage() {
    const router = useRouter()

    const [favorites, setFavorites] = useState<Property[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isUnauthorized, setIsUnauthorized] = useState(false)

    const fetchFavorites = async () => {
        try {
            setLoading(true)
            const data = await api.getFavorites()
            setFavorites(data)
            setError(null)
        } catch (err: unknown) {
            const msg: string = (err as Error)?.message || "Failed to fetch Favorites"
            if (
                err?.status === 401 ||
                msg.toLowerCase().includes("unauthorized") ||
                msg.includes("401")
            ) {
                setIsUnauthorized(true)
            } else {
                setError(msg)
            }
            console.error("Error fetching Favorites:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFavorites()
    }, [])

    if (loading) {
        return (
            <main>
                <div style={{ textAlign: "center", padding: "60px 20px", fontSize: "1.2rem", color: "#666" }}>
                    Loading your Favorites...
                </div>
            </main>
        )
    }

    if (isUnauthorized) {
        return (
            <main>
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "1rem" }}>
                        You must be logged in to view your favorites.
                    </p>
                    <button
                        onClick={() => router.push("/authentication")}
                        style={{ marginTop: '15px', padding: '10px 20px', background: '#7c5cdb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        Go to Login
                    </button>
                </div>
            </main>
        )
    }

    if (error) {
        return (
            <main>
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#dc3545" }}>
                    <h3>Error loading favorites</h3>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ marginTop: '15px', padding: '10px 20px', background: '#7c5cdb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        Retry
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>My Favorites</h1>
                {favorites.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {favorites.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: "center", padding: "60px 20px", color: "#666" }}>
                        No favorites yet. Start exploring properties!
                    </div>
                )}
            </div>
        </main>
    )
}