"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import styles from "@/styles/home_styles/property_card.module.css"
import { Property } from "@/types/api_types"
import { getWilayaName } from "@/data/auth_data/data"
import { useNavigationLoader } from "@/lib/navigation-loader-context"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

function getFullImageUrl(url: string | null | undefined): string | null {
    if (!url) return null
    if (url.startsWith("http://") || url.startsWith("https://")) return url
    if (url.startsWith("/")) return `${BACKEND_URL}${url}`
    return null
}

type PropertyCardProps = {
    property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const router = useRouter()
    const { startLoading } = useNavigationLoader()
    const [imgError, setImgError] = useState(false)
    const imageUrl = getFullImageUrl(property.primary_image)

    return (
        <div
            className={styles.card}
            onClick={() => { if (property.id) { startLoading(); router.push(`/post/${property.id}`) } }}
            style={{ cursor: property.id ? "pointer" : "default" }}
        >
            <div className={styles.card_image}>
                {imageUrl && !imgError ? (
                    <Image
                        src={imageUrl}
                        alt={property.title}
                        fill
                        className={styles.image}
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className={styles.image_fallback}>
                        <span>🏠</span>
                    </div>
                )}
            </div>
            <div className={styles.card_info}>
                <h3>{(() => { const type = property.title?.split(' in ')[0] || property.title; const w = getWilayaName(property.state); return w ? `${type} in ${w}` : type; })()}</h3>
                <p>{getWilayaName(property.state) || property.state}</p>
                <div className={styles.card_footer}>
                    <span>{property.price} DA / night</span>
                    <span><span className={styles.star}>★</span> {property.average_rating ?? "—"}</span>
                </div>
            </div>
        </div>
    )
}