"use client"

import { useState } from "react"
import Link from "next/link"
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
    const { startLoading } = useNavigationLoader()
    const [imgError, setImgError] = useState(false)
    const imageUrl = getFullImageUrl(property.primary_image)
    const type = property.title?.split(' in ')[0] || property.title
    const w = getWilayaName(property.state)
    const titleText = w ? `${type} in ${w}` : type

    return (
        <div className={styles.card}>
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
                {property.id ? (
                    <Link href={`/post/${property.id}`} className={styles.card_title_link} onClick={startLoading}>
                        <h3>{titleText}</h3>
                    </Link>
                ) : (
                    <h3>{titleText}</h3>
                )}
                <p>{getWilayaName(property.state) || property.state}</p>
                <div className={styles.card_footer}>
                    <span>{property.price} DA / night</span>
                    <span><span className={styles.star}>★</span> {property.average_rating ?? "—"}</span>
                </div>
            </div>
        </div>
    )
}
