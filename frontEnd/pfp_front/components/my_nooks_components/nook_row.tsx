import { useState } from "react"
import styles from "@/styles/my_nooks_styles/nooks_table.module.css"
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

type NookRowProps = {
    nook: Property;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onRowClick: (id: string) => void;
}

export default function NookRow({ nook, onEdit, onDelete, onRowClick }: NookRowProps) {
    const [imgError, setImgError] = useState(false)
    const imageUrl = getFullImageUrl(nook.primary_image)

    return (
        <tr className={styles.table_row} onClick={() => onRowClick(nook.id)} style={{ cursor: "pointer" }}>
            {/* الصورة */}
            <td className={styles.table_cell}>
                <div className={styles.image_container}>
                    {imageUrl && !imgError ? (
                        <img
                            src={imageUrl}
                            alt={nook.title}
                            onError={() => setImgError(true)}
                            style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                        />
                    ) : (
                        <div style={{
                            width: "80px", height: "60px",
                            background: "linear-gradient(135deg, #7c5cdb22, #7c5cdb44)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "1.5rem", borderRadius: "6px"
                        }}>
                            🏠
                        </div>
                    )}
                </div>
            </td>

            {/* الوصف */}
            <td className={styles.table_cell}>
                <div className={styles.description}>
                    <h4 className={styles.title}>{(() => { const type = nook.title?.split(' in ')[0] || nook.title; const w = getWilayaName(nook.state); return w ? `${type} in ${w}` : type; })()}</h4>
                    <p className={styles.price}>{nook.price} DA per night</p>
                    <span className={styles.rating}>★ {nook.average_rating ?? "—"}</span>
                </div>
            </td>

            {/* الولاية */}
            <td className={styles.table_cell}>
                <span className={styles.wilaya}>{getWilayaName(nook.state) || nook.state || "—"}</span>
            </td>

            {/* الحالة */}
            <td className={styles.table_cell}>
                <StatusBadge status={(nook.status as "reserved" | "available") || "available"} />
            </td>

            {/* اسم المستأجر */}
            <td className={styles.table_cell}>
                <span className={styles.tenant_name}>
                    {nook.tenant?.name || "-"}
                </span>
            </td>

            {/* الهاتف */}
            <td className={styles.table_cell}>
                <span className={styles.mobile}>
                    {nook.tenant?.mobile || "-"}
                </span>
            </td>

            {/* البريد */}
            <td className={styles.table_cell}>
                <span className={styles.email}>
                    {nook.tenant?.email || "-"}
                </span>
            </td>

            {/* العمليات */}
            <td className={styles.table_cell}>
                <div className={styles.operations}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(nook.id) }}
                        className={styles.operation_btn}
                        title="Edit"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(nook.id) }}
                        className={styles.operation_btn}
                        title="Delete"
                    >
                        🗑️
                    </button>
                </div>
            </td>
        </tr>
    )
}
