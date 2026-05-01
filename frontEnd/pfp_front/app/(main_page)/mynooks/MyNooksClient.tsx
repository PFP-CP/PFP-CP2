'use client'

import { useRouter } from 'next/navigation'
import { Property } from '@/types/api_types'
import { deleteNook } from './actions/getNooks'
import NooksTable from '@/components/my_nooks_components/nooks_table'
import styles from '@/styles/my_nooks_styles/nooks_page.module.css'

export default function MyNooksClient({ initialNooks }: { initialNooks: Property[] }) {
    const router = useRouter()

    const handleDelete = async (id: string) => {
        const confirmed = confirm('Are you sure you want to delete this Nook?')
        if (!confirmed) return
        try {
            await deleteNook(id)
            router.refresh()
        } catch {
            alert('Failed to delete Nook')
        }
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
                    onClick={() => router.push('/mynooks/createpost')}
                >
                    Add new
                </button>
            </div>
            <NooksTable nooks={initialNooks} onRefresh={() => router.refresh()} onDelete={handleDelete} />
        </main>
    )
}
