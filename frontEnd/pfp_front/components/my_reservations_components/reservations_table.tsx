"use client"

import styles from "@/styles/my_reservations_styles/reservations_table.module.css"
import ReservationRow from "./reservation_row"
import { Reservation } from "@/types/api_types"
import { api } from "@/lib/api"

type ReservationsTableProps = {
    reservations: Reservation[];
    onRefresh: () => void;
}

export default function ReservationsTable({ reservations, onRefresh }: ReservationsTableProps) {
    // معالجة الإلغاء (يمكن استخدامه مستقبلاً أو إضافة زر)
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
        <div className={styles.table_wrapper}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.table_header}>
                        <th className={styles.header_cell}>Photo</th>
                        <th className={styles.header_cell}>Description</th>
                        <th className={styles.header_cell}>Wilaya</th>
                        <th className={styles.header_cell}>Renter's name</th>
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
    )
}