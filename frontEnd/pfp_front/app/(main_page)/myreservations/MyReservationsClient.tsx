'use client'

import { useRouter } from 'next/navigation'
import { Reservation, BookedReservation } from '@/types/api_types'
import ReservationsTable from '@/components/my_reservations_components/reservations_table'
import BookedReservationsTable from '@/components/my_reservations_components/booked_reservations_table'
import styles from '@/styles/my_reservations_styles/reservations_page.module.css'

type Props = {
    hostReservations: Reservation[]
    bookedReservations: BookedReservation[]
}

export default function MyReservationsClient({ hostReservations, bookedReservations }: Props) {
    const router = useRouter()

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
                <ReservationsTable reservations={hostReservations} onRefresh={() => router.refresh()} />
            </div>

            <div className={styles.section}>
                <h2 className={styles.section_title}>Your Bookings</h2>
                <BookedReservationsTable reservations={bookedReservations} onRefresh={() => router.refresh()} />
            </div>
        </main>
    )
}
