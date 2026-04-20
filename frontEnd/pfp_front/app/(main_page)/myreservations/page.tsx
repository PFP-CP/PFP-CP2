"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Reservation } from "@/types/api_types"
import { getReservations } from "./actions/getReservations"
import ReservationsTable from "@/components/my_reservations_components/reservations_table"
import styles from "@/styles/my_reservations_styles/reservations_page.module.css"
import Loading from "@/components/loading"

export default function MyReservationsPage() {
    const router = useRouter()
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isUnauthorized, setIsUnauthorized] = useState(false)

    const fetchReservations = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await getReservations()
            const data = Array.isArray(response) ? response : []
            setReservations(data)
        } catch (err: any) {
            const msg: string = err?.message || "Failed to fetch reservations"
            if (
                err?.status === 401 ||
                msg.toLowerCase().includes("unauthorized") ||
                msg.includes("401")
            ) {
                setIsUnauthorized(true)
            } else {
                setError(msg)
            }
            console.error("Error fetching reservations:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReservations()
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

    if (error) {
        return (
            <main className={styles.page}>
                <div className={styles.header}>
                    <div className={styles.title_section}>
                        <h1 className={styles.page_title}>Reservations</h1>
                    </div>
                </div>
                <div className={styles.error}>
                    <p className={styles.error_message}>Error: {error}</p>
                    <button onClick={fetchReservations} className={styles.retry_btn}>
                        Retry
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

            <ReservationsTable reservations={reservations} onRefresh={fetchReservations} />
        </main>
    )
}