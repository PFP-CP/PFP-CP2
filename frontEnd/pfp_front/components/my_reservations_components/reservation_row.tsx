"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "@/styles/my_reservations_styles/reservations_table.module.css"
import { Reservation } from "@/types/api_types"
import { getWilayaName } from "@/data/auth_data/data"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const FALLBACK_IMAGE = "/placeholder-house.jpg"

function getFullImageUrl(url: string | null | undefined): string {
    if (!url) return FALLBACK_IMAGE
    if (url.startsWith("http://") || url.startsWith("https://")) return url
    if (url.startsWith("/")) return `${BACKEND_URL}${url}`
    return FALLBACK_IMAGE
}

type ReservationRowProps = {
    reservation: Reservation;
    onCancel: (id: number) => void;
}

export default function ReservationRow({ reservation, onCancel }: ReservationRowProps) {
    const router = useRouter();
    const [imgError, setImgError] = useState(false);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            })
        } catch {
            return dateString
        }
    }

    // Safe field access with fallbacks
    const post = reservation?.post
    const house = post?.House
    const renter = reservation?.renter

    const fullTitle = post?.Title || "Property"
    let houseType = "Property"
    let location = fullTitle

    if (fullTitle.toLowerCase().includes(" in ")) {
        const parts = fullTitle.split(/ in /i)
        houseType = parts[0]
        location = parts.slice(1).join(" in ")
    } else if (fullTitle.includes("-")) {
        const parts = fullTitle.split("-")
        houseType = parts[0]
        location = parts.slice(1).join("-")
    }

    const imageUrl = getFullImageUrl(house?.photo)
    const navigationUrl = post?.id ? `/post/${post.id}` : "#"

    return (
        <tr
            className={styles.table_row}
            onClick={() => {
                if (navigationUrl !== "#") router.push(navigationUrl)
            }}
            style={{ cursor: navigationUrl !== "#" ? "pointer" : "default" }}
        >
            {/* الصورة */}
            <td className={styles.table_cell}>
                <div className={styles.image_container}>
                    {!imgError ? (
                        <img
                            src={imageUrl}
                            alt={fullTitle}
                            className={styles.table_image}
                            onError={() => setImgError(true)}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        <div style={{
                            width: "100%", height: "100%",
                            background: "linear-gradient(135deg, #7c5cdb22, #7c5cdb44)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "2rem", borderRadius: "8px"
                        }}>
                            🏠
                        </div>
                    )}
                </div>
            </td>

            {/* الوصف */}
            <td className={styles.table_cell}>
                <div className={styles.description}>
                    <h4 className={styles.title}>
                        {houseType}{getWilayaName(house?.wilaya) ? ` in ${getWilayaName(house?.wilaya)}` : location ? ` in ${location}` : ''}
                    </h4>
                    <p className={styles.price}>{house?.Price ?? "—"} DA per night</p>
                    <span className={styles.rating}>
                        {house?.rating ?? "—"} ★
                    </span>
                </div>
            </td>

            {/* الولاية */}
            <td className={styles.table_cell}>
                <span className={styles.wilaya}>{getWilayaName(house?.wilaya) || house?.wilaya || "—"}</span>
            </td>

            {/* اسم المؤجر */}
            <td className={styles.table_cell}>
                <span className={styles.renter_name}>{renter?.full_name || "—"}</span>
            </td>

            {/* الهاتف */}
            <td className={styles.table_cell}>
                <span className={styles.mobile}>{renter?.phone ? String(renter.phone) : "—"}</span>
            </td>

            {/* البريد */}
            <td className={styles.table_cell}>
                <span className={styles.email}>{renter?.email || "—"}</span>
            </td>

            {/* تاريخ الوصول */}
            <td className={styles.table_cell}>
                <span className={styles.date}>{formatDate(reservation.arrival_date)}</span>
            </td>

            {/* تاريخ المغادرة */}
            <td className={styles.table_cell}>
                <span className={styles.date}>{formatDate(reservation.departure_date)}</span>
            </td>
        </tr>
    )
}