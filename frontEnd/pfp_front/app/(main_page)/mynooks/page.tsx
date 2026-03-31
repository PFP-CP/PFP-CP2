"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Property } from "@/types/api_types"
import NooksTable from "@/components/my_nooks_components/nooks_table"
import styles from "@/styles/my_nooks_styles/nooks_page.module.css"

export default function MyNooksPage() {
    const [nooks, setNooks] = useState<Property[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // جلب بيانات Nooks
    const fetchNooks = async () => {
        try {
            const response = await api.getMyNooks()
            const data = response.data || response
            setNooks(Array.isArray(data) ? data : [])
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch Nooks")
            console.error("Error fetching Nooks:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNooks()
    }, [])

    // عرض حالة التحميل
    if (loading) {
        return (
            <main className={styles.page}>
                <div className={styles.loading}>
                    <h1>Nooks</h1>
                    <p>Loading your Nooks...</p>
                </div>
            </main>
        )
    }

    // عرض حالة الخطأ
    if (error) {
        return (
            <main className={styles.page}>
                <div className={styles.error}>
                    <h1>Nooks</h1>
                    <p className={styles.error_message}>Error: {error}</p>
                    <button onClick={fetchNooks} className={styles.retry_btn}>
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
                    <h1 className={styles.page_title}>Nooks</h1>
                    <p className={styles.subtitle}>
                        Please keep in mind that the list is sorted by Wilaya
                    </p>
                </div>
                <button className={styles.add_new_btn}>
                    Add new
                </button>
            </div>

            <NooksTable nooks={nooks} onRefresh={fetchNooks} />
        </main>
    )
}