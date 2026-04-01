"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Property } from "@/types/api_types"
import NooksTable from "@/components/my_nooks_components/nooks_table"
import styles from "@/styles/my_nooks_styles/nooks_page.module.css"

export default function MyNooksPage() {
    const router = useRouter()
    
    const [nooks, setNooks] = useState<Property[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)


    const fetchNooks = async () => {
        try {
            setLoading(true)
            const response = await api.getMyNooks()
 
            const data = Array.isArray(response) ? response : []
            
            setNooks(data)
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch Nooks")
            console.error("Error fetching Nooks:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        const confirmed = confirm("Are you sure you want to delete this Nook?")
        if (!confirmed) return

        try {
            await api.deleteNook(id)
            await fetchNooks()
        } catch (error) {
            console.error("Failed to delete:", error)
            alert("Failed to delete Nook")
        }
    }

    useEffect(() => {
        fetchNooks()
    }, [])

    if (loading) {
        return (
            <main className={styles.page}>
                <div className={styles.loading}>Loading your Nooks...</div>
            </main>
        )
    }

    if (error) {
        return (
            <main className={styles.page}>
                <div className={styles.error}>
                    <h1>My Nooks</h1>
                    <p className={styles.error_message}>Error: {error}</p>
                    <button onClick={fetchNooks} className={styles.retry_btn}>Retry</button>
                </div>
            </main>
        )
    }

    return (
        <main className={styles.page}>
            <div className={styles.header}>
                <div className={styles.title_section}>
                    <h1 className={styles.page_title}>My Nooks</h1>
                    <p className={styles.subtitle}>Manage your properties and reservations</p>
                </div>
                <button 
                    className={styles.add_new_btn}
                    onClick={() => router.push("/mynooks/add")}
                >
                    Add new
                </button>
            </div>

            <NooksTable 
                nooks={nooks} 
                onRefresh={fetchNooks}
                onDelete={handleDelete} 
            />
        </main>
    )
}