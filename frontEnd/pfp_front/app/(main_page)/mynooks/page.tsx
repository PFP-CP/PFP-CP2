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
    const [isUnauthorized, setIsUnauthorized] = useState(false)

    const fetchNooks = async () => {
        try {
            setLoading(true)
            const response = await api.getMyNooksDash()
            const data = Array.isArray(response) ? response : []
            setNooks(data)
            setError(null)
        } catch (err: any) {
            const msg: string = err?.message || "Failed to fetch Nooks"
            if (
                err?.status === 401 ||
                msg.toLowerCase().includes("unauthorized") ||
                msg.includes("401")
            ) {
                setIsUnauthorized(true)
            } else {
                setError(msg)
            }
            console.error("Error fetching Nooks:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
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
                <div className={styles.header}>
                    <div className={styles.title_section}>
                        <h1 className={styles.page_title}>My Nooks</h1>
                    </div>
                </div>
                <div className={styles.loading}>Loading your Nooks...</div>
            </main>
        )
    }

    if (isUnauthorized) {
        return (
            <main className={styles.page}>
                <div className={styles.header}>
                    <div className={styles.title_section}>
                        <h1 className={styles.page_title}>My Nooks</h1>
                    </div>
                </div>
                <div className={styles.error} style={{ textAlign: "center", padding: "60px 20px" }}>
                    <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "1rem" }}>
                        You must be logged in to view your nooks.
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