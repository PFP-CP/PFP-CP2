"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import styles from "@/styles/my_reservations_styles/reservations_table.module.css"
import { BookedReservation } from "@/types/api_types"
import { cancelBooking } from "@/app/(main_page)/myreservations/actions/cancelBooking"
import { getWilayaName } from "@/data/auth_data/data"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

function cleanupLocalStorageReservation(reservationId: number, postId: string) {
    if (typeof window === 'undefined') return
    const suffix = `_${postId}`
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (!key?.startsWith('pfp_reservations_') || !key.endsWith(suffix)) continue
        try {
            const raw = localStorage.getItem(key)
            if (!raw) continue
            const list: { id: number }[] = JSON.parse(raw)
            const updated = list.filter(r => r.id !== reservationId)
            if (updated.length < list.length) localStorage.setItem(key, JSON.stringify(updated))
        } catch {}
    }
}

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

function BookedReservationRow({
    reservation,
    onCancel,
    isDeleting,
}: {
    reservation: BookedReservation
    onCancel: (id: number, postId: string) => void
    isDeleting: boolean
}) {
    const router = useRouter()
    const [imgError, setImgError] = useState(false)
    const { post } = reservation
    const { seller } = post

    const imageUrl = getFullImageUrl(post.photo)
    const wilayaName = getWilayaName(post.wilaya)

    const fullTitle = post.title || "Property"
    let houseType = fullTitle
    if (fullTitle.toLowerCase().includes(" in ")) {
        houseType = fullTitle.split(/ in /i)[0]
    } else if (fullTitle.includes("-")) {
        houseType = fullTitle.split("-")[0]
    }

    return (
        <tr
            className={`${styles.table_row} ${isDeleting ? styles.row_deleting : ""}`}
            onClick={isDeleting ? undefined : () => router.push(`/post/${post.id}`)}
            style={{ cursor: isDeleting ? "default" : "pointer" }}
        >
            <td className={styles.table_cell}>
                <div className={styles.image_container}>
                    {imageUrl && !imgError ? (
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
                        }}>🏠</div>
                    )}
                </div>
            </td>

            <td className={styles.table_cell}>
                <div className={styles.description}>
                    <h4 className={styles.title}>
                        {houseType}{wilayaName ? ` in ${wilayaName}` : post.wilaya ? ` in ${post.wilaya}` : ""}
                    </h4>
                    <p className={styles.price}>{post.price} DA per night</p>
                    <span className={styles.rating}>{post.rating || "—"} ★</span>
                </div>
            </td>

            <td className={styles.table_cell}>
                <span className={styles.wilaya}>{wilayaName || post.wilaya || "—"}</span>
            </td>

            <td className={styles.table_cell}>
                {seller?.id ? (
                    <Link
                        href={`/profile/${seller.id}`}
                        className={styles.renter_name_link}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {seller.full_name || "—"}
                    </Link>
                ) : (
                    <span className={styles.renter_name}>{seller?.full_name || "—"}</span>
                )}
            </td>

            <td className={styles.table_cell}>
                <span className={styles.mobile}>{seller?.mobile_number || '—'}</span>
            </td>

            <td className={styles.table_cell}>
                <span className={styles.email}>{seller?.email || "—"}</span>
            </td>

            <td className={styles.table_cell}>
                <span className={styles.date}>{formatDate(reservation.arrival_date)}</span>
            </td>

            <td className={styles.table_cell}>
                <span className={styles.date}>{formatDate(reservation.departure_date)}</span>
            </td>

            <td className={styles.table_cell} onClick={(e) => e.stopPropagation()}>
                <button
                    className={styles.cancel_btn}
                    onClick={() => onCancel(reservation.id, reservation.post.id)}
                    disabled={isDeleting}
                >
                    Cancel
                </button>
            </td>
        </tr>
    )
}

function MobileCard({
    reservation,
    onCancel,
    isDeleting,
}: {
    reservation: BookedReservation
    onCancel: (id: number, postId: string) => void
    isDeleting: boolean
}) {
    const [imgError, setImgError] = useState(false)
    const router = useRouter()
    const { post } = reservation
    const { seller } = post

    const imageUrl = getFullImageUrl(post.photo)
    const wilayaName = getWilayaName(post.wilaya) || post.wilaya

    return (
        <div className={`${styles.card} ${isDeleting ? styles.card_deleting : ""}`}>
            <Link href={`/post/${post.id}`} className={styles.card_link}>
                <div className={styles.card_top}>
                    <div className={styles.image_container}>
                        {imageUrl && !imgError ? (
                            <img
                                src={imageUrl}
                                alt={post.title}
                                onError={() => setImgError(true)}
                                className={styles.card_image}
                            />
                        ) : (
                            <div className={styles.image_placeholder}>🏠</div>
                        )}
                    </div>
                    <div className={styles.card_info}>
                        <h4 className={styles.card_title}>{post.title}</h4>
                        <div className={styles.card_meta}>
                            <span className={styles.card_price}>{post.price} DA/night</span>
                            <span className={styles.dot}>·</span>
                            <span className={styles.card_rating}>★ {post.rating || "—"}</span>
                        </div>
                        <span className={styles.card_wilaya}>{wilayaName || "—"}</span>
                    </div>
                </div>

                <div className={styles.card_host}>
                    <span className={styles.host_row}>
                        <span className={styles.host_label}>Host</span>
                        {seller?.id ? (
                            <button
                                className={styles.renter_name_link}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/profile/${seller.id}`) }}
                            >
                                {seller.full_name || "—"}
                            </button>
                        ) : (
                            seller?.full_name || "—"
                        )}
                    </span>
                    <span className={styles.host_row}>
                        <span className={styles.host_label}>Mobile</span>
                        {seller?.mobile_number || "—"}
                    </span>
                    <span className={styles.host_row}>
                        <span className={styles.host_label}>Email</span>
                        {seller?.email || "—"}
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
            <div className={styles.card_cancel}>
                <button
                    className={styles.cancel_btn}
                    onClick={() => onCancel(reservation.id, reservation.post.id)}
                    disabled={isDeleting}
                >
                    Cancel Booking
                </button>
            </div>
        </div>
    )
}

type BookedReservationsTableProps = {
    reservations: BookedReservation[]
    onRefresh: () => void
}

export default function BookedReservationsTable({ reservations, onRefresh }: BookedReservationsTableProps) {
    const router = useRouter()
    const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set())

    const handleCancel = async (id: number, postId: string) => {
        const confirmed = confirm("Are you sure you want to cancel this booking?")
        if (!confirmed) return

        setDeletingIds((prev) => new Set(prev).add(id))
        const result = await cancelBooking(id)

        if (result.success) {
            cleanupLocalStorageReservation(id, postId)
            router.refresh()
        } else {
            console.error("Failed to cancel:", result.error)
            setDeletingIds((prev) => {
                const next = new Set(prev)
                next.delete(id)
                return next
            })
        }
    }

    if (reservations.length === 0) {
        return (
            <div className={styles.empty_state}>
                <p>You have no active bookings.</p>
            </div>
        )
    }

    return (
        <>
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
                            <th className={styles.header_cell}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((reservation) => (
                            <BookedReservationRow
                                key={reservation.id}
                                reservation={reservation}
                                onCancel={handleCancel}
                                isDeleting={deletingIds.has(reservation.id)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.cards_grid}>
                {reservations.map((reservation) => (
                    <MobileCard
                        key={reservation.id}
                        reservation={reservation}
                        onCancel={handleCancel}
                        isDeleting={deletingIds.has(reservation.id)}
                    />
                ))}
            </div>
        </>
    )
}
