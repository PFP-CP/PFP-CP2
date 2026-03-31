"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Reservation } from "@/types/api_types"
import ReservationsTable from "@/components/my_reservations_components/reservations_table"
import styles from "@/styles/my_reservations_styles/reservations_page.module.css"

export default function MyReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // جلب بيانات الحجوزات
    const fetchReservations = async () => {
        try {
            const response = await api.getMyReservations()
            const data = response.data || response
            setReservations(Array.isArray(data) ? data : [])
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch reservations")
            console.error("Error fetching reservations:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReservations()
    }, [])

    // عرض حالة التحميل
    if (loading) {
        return (
            <main className={styles.page}>
                <div className={styles.loading}>
                    <h1>Reservations</h1>
                    <p>Loading your reservations...</p>
                </div>
            </main>
        )
    }

    // عرض حالة الخطأ
    if (error) {
        return (
            <main className={styles.page}>
                <div className={styles.error}>
                    <h1>Reservations</h1>
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
                        Please keep in mind that the list is sorted by check-in date
                    </p>
                </div>
            </div>

            <ReservationsTable reservations={reservations} onRefresh={fetchReservations} />
        </main>
    )
}