"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import styles from "@/styles/my_nooks_styles/nooks_table.module.css"
import NookRow from "./nook_row"
import StatusBadge from "./status_badge"
import { Property } from "@/types/api_types"
import { getWilayaName } from "@/data/auth_data/data"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

function getFullImageUrl(url: string | null | undefined): string | null {
    if (!url) return null
    if (url.startsWith("http://") || url.startsWith("https://")) return url
    if (url.startsWith("/")) return `${BACKEND_URL}${url}`
    return null
}

type NooksTableProps = {
    nooks: Property[];
    onRefresh: () => void;
    onDelete: (id: string) => void;
}

function MobileCard({ nook, onEdit, onDelete }: { nook: Property; onEdit: (id: string) => void; onDelete: (id: string) => void }) {
    const [imgError, setImgError] = useState(false)
    const imageUrl = getFullImageUrl(nook.primary_image)
    const type = nook.title?.split(' in ')[0] || nook.title
    const wilayaName = getWilayaName(nook.state)
    const displayTitle = wilayaName ? `${type} in ${wilayaName}` : type

    return (
        <div className={styles.card}>
            <Link href={`/post/${nook.id}`} className={styles.card_link}>
                <div className={styles.card_top}>
                    <div className={styles.image_container}>
                        {imageUrl && !imgError ? (
                            <img
                                src={imageUrl}
                                alt={nook.title}
                                onError={() => setImgError(true)}
                                className={styles.card_image}
                            />
                        ) : (
                            <div className={styles.image_placeholder}>🏠</div>
                        )}
                    </div>

                    <div className={styles.card_info}>
                        <h4 className={styles.card_title}>{displayTitle}</h4>
                        <div className={styles.card_meta}>
                            <span className={styles.card_price}>{nook.price} DA/night</span>
                            <span className={styles.dot}>·</span>
                            <span className={styles.card_rating}>★ {nook.average_rating ?? "—"}</span>
                        </div>
                    </div>

                    <div className={styles.badge_col}>
                        <StatusBadge status={(nook.status as "reserved" | "available" | "reserved-today") || "available"} />
                    </div>
                </div>

                <div className={styles.card_tenant}>
                    <span className={styles.tenant_row}>
                        <span className={styles.tenant_label}>Tenant</span>
                        {nook.tenant?.name && nook.tenant?.id ? (
                            <Link href={`/profile/${nook.tenant.id}`} className={styles.tenant_name_link} onClick={e => e.stopPropagation()}>
                                {nook.tenant.name}
                            </Link>
                        ) : (nook.tenant?.name || "—")}
                    </span>
                    <span className={styles.tenant_row}>
                        <span className={styles.tenant_label}>Mobile</span>
                        {nook.tenant?.mobile || "—"}
                    </span>
                    <span className={styles.tenant_row}>
                        <span className={styles.tenant_label}>Email</span>
                        {nook.tenant?.email || "—"}
                    </span>
                </div>
            </Link>

            <div className={styles.card_actions}>
                <button
                    onClick={() => onEdit(nook.id)}
                    className={styles.operation_btn}
                    title="Edit"
                >
                    ✏️
                </button>
                <button
                    onClick={() => onDelete(nook.id)}
                    className={styles.operation_btn}
                    title="Delete"
                >
                    🗑️
                </button>
            </div>
        </div>
    )
}

export default function NooksTable({ nooks, onDelete }: NooksTableProps) {
    const router = useRouter()

    const handleEdit = (id: string) => {
        router.push(`/mynooks/createpost?edit=${id}`)
    }

    const handleRowClick = (id: string) => {
        router.push(`/post/${id}`)
    }

    if (nooks.length === 0) {
        return (
            <div className={styles.empty_state}>
                <p>No Nooks found. Add your first Nook!</p>
            </div>
        )
    }

    return (
        <>
            {/* Desktop: table */}
            <div className={styles.table_wrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.table_header}>
                            <th className={styles.header_cell}>Photo</th>
                            <th className={styles.header_cell}>Description</th>
                            <th className={styles.header_cell}>Wilaya</th>
                            <th className={styles.header_cell}>Status</th>
                            <th className={styles.header_cell}>Tenant&apos;s name</th>
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
                                onRowClick={handleRowClick}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile: cards */}
            <div className={styles.cards_grid}>
                {nooks.map((nook) => (
                    <MobileCard
                        key={nook.id}
                        nook={nook}
                        onEdit={handleEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </>
    )
}
