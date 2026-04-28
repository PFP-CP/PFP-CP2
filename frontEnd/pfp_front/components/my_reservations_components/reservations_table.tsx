"use client"

import { useState } from "react"
import Link from "next/link"
import styles from "@/styles/my_reservations_styles/reservations_table.module.css"
import ReservationRow from "./reservation_row"
import { Reservation } from "@/types/api_types"
import { api } from "@/lib/api"
import { getWilayaName } from "@/data/auth_data/data"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

function getFullImageUrl(url: string | null | undefined): string | null {
    if (!url) return null
    if (url.startsWith("http://") || url.startsWith("https://")) return url
    if (url.startsWith("/")) return `${BACKEND_URL}${url}`
    return null
}

function formatDate(dateString: string) {
    try {
        const date = new Date(dateString + "T00:00:00")
        return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
    } catch {
        return dateString
    }
}

function MobileCard({ reservation }: { reservation: Reservation }) {
    const [imgError, setImgError] = useState(false)
    const post = reservation?.post
    const house = post?.House
    const host = reservation?.renter

    const imageUrl = getFullImageUrl(house?.photo)
    const navigationUrl = post?.id ? `/post/${post.id}` : "#"

    const fullTitle = post?.Title || "Property"
    let houseType = fullTitle
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
    const wilayaName = getWilayaName(house?.wilaya)
    const displayTitle = wilayaName ? `${houseType} in ${wilayaName}` : location

    return (
        <div className={styles.card}>
            <Link href={navigationUrl} className={styles.card_link}>
                <div className={styles.card_top}>
                    <div className={styles.image_container}>
                        {imageUrl && !imgError ? (
                            <img
                                src={imageUrl}
                                alt={fullTitle}
                                onError={() => setImgError(true)}
                                className={styles.card_image}
                            />
                        ) : (
                            <div className={styles.image_placeholder}>🏠</div>
                        )}
                    </div>

                    <div className={styles.card_info}>
                        <h4 className={styles.card_title}>{displayTitle}</h4>
                        <div className={styles.card_meta}>
                            <span className={styles.card_price}>{house?.Price ?? "—"} DA/night</span>
                            <span className={styles.dot}>·</span>
                            <span className={styles.card_rating}>★ {house?.rating ?? "—"}</span>
                        </div>
                        <span className={styles.card_wilaya}>{wilayaName || house?.wilaya || "—"}</span>
                    </div>
                </div>

                <div className={styles.card_host}>
                    <span className={styles.host_row}>
                        <span className={styles.host_label}>Host</span>
                        {host?.full_name || "—"}
                    </span>
                    <span className={styles.host_row}>
                        <span className={styles.host_label}>Mobile</span>
                        {host?.phone ? String(host.phone) : "—"}
                    </span>
                    <span className={styles.host_row}>
                        <span className={styles.host_label}>Email</span>
                        {host?.email || "—"}
                    </span>
                </div>

                <div className={styles.card_dates}>
                    <span className={styles.date_item}>
                        <span className={styles.date_label}>Arrival</span>
                        {formatDate(reservation.arrival_date)}
                    </span>
                    <span className={styles.date_arrow}>→</span>
                    <span className={styles.date_item}>
                        <span className={styles.date_label}>Departure</span>
                        {formatDate(reservation.departure_date)}
                    </span>
                </div>
            </Link>
        </div>
    )
}

type ReservationsTableProps = {
    reservations: Reservation[];
    onRefresh: () => void;
}

export default function ReservationsTable({ reservations, onRefresh }: ReservationsTableProps) {
    const handleCancel = async (id: number) => {
        const confirmed = confirm("Are you sure you want to cancel this reservation?")
        if (!confirmed) return

        try {
            await api.deleteReservation(id)
            onRefresh()
        } catch (error) {
            console.error("Failed to cancel:", error)
        }
    }

    if (reservations.length === 0) {
        return (
            <div className={styles.empty_state}>
                <p>No reservations found.</p>
            </div>
        )
    }

    return (
        <>
            {/* Desktop: table */}
            <div className={styles.table_wrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.table_header}>
                            <th className={styles.header_cell}>Photo</th>
                            <th className={styles.header_cell}>Description</th>
                            <th className={styles.header_cell}>Wilaya</th>
                            <th className={styles.header_cell}>Host&apos;s name</th>
                            <th className={styles.header_cell}>Mobile</th>
                            <th className={styles.header_cell}>Email</th>
                            <th className={styles.header_cell}>Arrival Date</th>
                            <th className={styles.header_cell}>Departure Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((reservation) => (
                            <ReservationRow
                                key={reservation.id}
                                reservation={reservation}
                                onCancel={handleCancel}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile: cards */}
            <div className={styles.cards_grid}>
                {reservations.map((reservation) => (
                    <MobileCard key={reservation.id} reservation={reservation} />
                ))}
            </div>
        </>
    )
}
