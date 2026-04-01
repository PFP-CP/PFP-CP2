"use client"

import { useState } from "react"
import styles from "@/styles/my_nooks_styles/nooks_table.module.css"
import NookRow from "./nook_row"
import { Property } from "@/types/api_types"
import { api } from "@/lib/api"

type NooksTableProps = {
    nooks: Property[];
    onRefresh: () => void;
    onDelete: (id: number) => void;
}

export default function NooksTable({ nooks, onRefresh }: NooksTableProps) {
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const handleEdit = (id: number) => {
        console.log("Edit nook:", id)
        alert("Edit functionality will be added soon!")
    }

    const handleDelete = async (id: number) => {
        const confirmed = confirm("Are you sure you want to delete this Nook?")
        if (!confirmed) return

        setDeletingId(id)
        
        try {
            await api.deleteNook(id)
            onRefresh() 
        } catch (error) {
            console.error("Failed to delete:", error)
            alert("Failed to delete Nook")
        } finally {
            setDeletingId(null)
        }
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
                            onDelete={handleDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}