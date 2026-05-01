import { getReservations } from './actions/getReservations'
import { getMyBookings } from './actions/getMyBookings'
import MyReservationsClient from './MyReservationsClient'
import { redirect } from 'next/navigation'
import { Reservation, BookedReservation } from '@/types/api_types'

export default async function MyReservationsPage() {
    let hostReservations: Reservation[] = []
    let bookedReservations: BookedReservation[] = []

    const [hostResult, bookedResult] = await Promise.allSettled([
        getReservations(),
        getMyBookings(),
    ])

    if (hostResult.status === 'fulfilled') {
        hostReservations = Array.isArray(hostResult.value) ? hostResult.value : []
    } else if (String((hostResult.reason as any)?.message).includes('401')) {
        redirect('/authentication')
    }

    if (bookedResult.status === 'fulfilled') {
        bookedReservations = Array.isArray(bookedResult.value) ? bookedResult.value : []
    } else if (String((bookedResult.reason as any)?.message).includes('401')) {
        redirect('/authentication')
    }

    return <MyReservationsClient hostReservations={hostReservations} bookedReservations={bookedReservations} />
}
