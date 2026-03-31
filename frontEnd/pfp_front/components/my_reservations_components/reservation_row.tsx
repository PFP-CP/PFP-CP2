import Image from "next/image"
import styles from "@/styles/my_reservations_styles/reservations_table.module.css"
import { Reservation } from "@/types/api_types"

type ReservationRowProps = {
    reservation: Reservation;
    onCancel: (id: number) => void;
}

export default function ReservationRow({ reservation, onCancel }: ReservationRowProps) {
    // تنسيق التاريخ
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })
    }

    return (
        <tr className={styles.table_row}>
            {/* الصورة */}
            <td className={styles.table_cell}>
                <div className={styles.image_container}>
                    <Image 
                        src={reservation.property.image} 
                        alt={reservation.property.title} 
                        width={80} 
                        height={60}
                        className={styles.table_image}
                    />
                </div>
            </td>

            {/* الوصف */}
            <td className={styles.table_cell}>
                <div className={styles.description}>
                    <h4 className={styles.title}>{reservation.property.title}</h4>
                    <p className={styles.price}>{reservation.property.price} DA per night</p>
                    <span className={styles.rating}>★ {reservation.property.rating}</span>
                </div>
            </td>

            {/* الولاية */}
            <td className={styles.table_cell}>
                <span className={styles.wilaya}>{reservation.property.wilaya}</span>
            </td>

            {/* اسم المؤجر */}
            <td className={styles.table_cell}>
                <span className={styles.renter_name}>{reservation.renter.name}</span>
            </td>

            {/* الهاتف */}
            <td className={styles.table_cell}>
                <span className={styles.mobile}>{reservation.renter.mobile}</span>
            </td>

            {/* البريد */}
            <td className={styles.table_cell}>
                <span className={styles.email}>{reservation.renter.email}</span>
            </td>

            {/* تاريخ الوصول */}
            <td className={styles.table_cell}>
                <span className={styles.date}>{formatDate(reservation.arrivalDate)}</span>
            </td>

            {/* تاريخ المغادرة */}
            <td className={styles.table_cell}>
                <span className={styles.date}>{formatDate(reservation.departureDate)}</span>
            </td>
        </tr>
    )
}