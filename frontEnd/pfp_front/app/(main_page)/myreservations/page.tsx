"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Reservation, BookedReservation } from "@/types/api_types"
import { getReservations } from "./actions/getReservations"
import { getMyBookings } from "./actions/getMyBookings"
import ReservationsTable from "@/components/my_reservations_components/reservations_table"
import BookedReservationsTable from "@/components/my_reservations_components/booked_reservations_table"
import styles from "@/styles/my_reservations_styles/reservations_page.module.css"
import Loading from "@/components/loading"

export default function MyReservationsPage() {
    const router = useRouter()

    const [hostReservations, setHostReservations] = useState<Reservation[]>([])
    const [bookedReservations, setBookedReservations] = useState<BookedReservation[]>([])
    const [loading, setLoading] = useState(true)
    const [hostError, setHostError] = useState<string | null>(null)
    const [bookedError, setBookedError] = useState<string | null>(null)
    const [isUnauthorized, setIsUnauthorized] = useState(false)

    const fetchAll = async () => {
        setLoading(true)
        setHostError(null)
        setBookedError(null)

        const [hostResult, bookedResult] = await Promise.allSettled([
            getReservations(),
            getMyBookings(),
        ])

        let unauthorized = false

        if (hostResult.status === "fulfilled") {
            setHostReservations(Array.isArray(hostResult.value) ? hostResult.value : [])
        } else {
            const msg: string = (hostResult.reason as any)?.message || ""
            if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
                unauthorized = true
            } else {
                setHostError(msg || "Failed to fetch reservations on your listings")
            }
        }

        if (bookedResult.status === "fulfilled") {
            setBookedReservations(Array.isArray(bookedResult.value) ? bookedResult.value : [])
        } else {
            const msg: string = (bookedResult.reason as any)?.message || ""
            if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
                unauthorized = true
            } else {
                setBookedError(msg || "Failed to fetch your bookings")
            }
        }

        if (unauthorized) setIsUnauthorized(true)
        setLoading(false)
    }

    useEffect(() => {
        fetchAll()
    }, [])

    if (loading) return <Loading text="Loading your reservations..." />

    if (isUnauthorized) {
        return (
            <main className={styles.page}>
                <div className={styles.header}>
                    <div className={styles.title_section}>
                        <h1 className={styles.page_title}>Reservations</h1>
                    </div>
                </div>
                <div className={styles.error} style={{ textAlign: "center", padding: "60px 20px" }}>
                    <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "1rem" }}>
                        You must be logged in to view your reservations.
                    </p>
                    <button
                        onClick={() => router.push("/login")}
                        className={styles.retry_btn}
                        style={{ background: "#7c5cdb" }}
                    >
                        Go to Login
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main className={styles.page}>
            <div className={styles.header}>
                <div className={styles.title_section}>
                    <h1 className={styles.page_title}>Reservations</h1>
                    <p className={styles.subtitle}>
                        Please keep in mind that the list is sorted by most recent reservation
                    </p>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.section_title}>Reservations on Your Listings</h2>
                {hostError ? (
                    <div className={styles.error}>
                        <p className={styles.error_message}>Error: {hostError}</p>
                        <button onClick={fetchAll} className={styles.retry_btn}>Retry</button>
                    </div>
                ) : (
                    <ReservationsTable reservations={hostReservations} onRefresh={fetchAll} />
                )}
            </div>

            <div className={styles.section}>
                <h2 className={styles.section_title}>Your Bookings</h2>
                {bookedError ? (
                    <div className={styles.error}>
                        <p className={styles.error_message}>Error: {bookedError}</p>
                        <button onClick={fetchAll} className={styles.retry_btn}>Retry</button>
                    </div>
                ) : (
                    <BookedReservationsTable reservations={bookedReservations} onRefresh={fetchAll} />
                )}
            </div>
        </main>
    )
}
