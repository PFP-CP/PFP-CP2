"use client"

import { useRouter } from "next/navigation"
import styles from "@/styles/my_nooks_styles/nooks_table.module.css"
import NookRow from "./nook_row"
import { Property } from "@/types/api_types"

type NooksTableProps = {
    nooks: Property[];
    onRefresh: () => void;
    onDelete: (id: string) => void;
}

export default function NooksTable({ nooks, onDelete }: NooksTableProps) {
    const router = useRouter()

    const handleEdit = (id: string) => {
        router.push(`/mynooks/createpost?edit=${id}`)
    }

    if (nooks.length === 0) {
        return (
            <div className={styles.empty_state}>
                <p>No Nooks found. Add your first Nook!</p>
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
                        <th className={styles.header_cell}>Status</th>
                        <th className={styles.header_cell}>Tenant's name</th>
                        <th className={styles.header_cell}>Mobile</th>
                        <th className={styles.header_cell}>Email</th>
                        <th className={styles.header_cell}>Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {nooks.map((nook) => (
                        <NookRow
                            key={nook.id}
                            nook={nook}
                            onEdit={handleEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}
