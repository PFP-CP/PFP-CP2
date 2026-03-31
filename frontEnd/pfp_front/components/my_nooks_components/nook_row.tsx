import Image from "next/image"
import styles from "@/styles/my_nooks_styles/nooks_table.module.css"
import StatusBadge from "./status_badge"
import { Property } from "@/types/api_types"

type NookRowProps = {
    nook: Property;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function NookRow({ nook, onEdit, onDelete }: NookRowProps) {
    return (
        <tr className={styles.table_row}>
            {/* الصورة */}
            <td className={styles.table_cell}>
                <div className={styles.image_container}>
                    <Image 
                        src={nook.image} 
                        alt={nook.title} 
                        width={80} 
                        height={60}
                        className={styles.table_image}
                    />
                </div>
            </td>

            {/* الوصف */}
            <td className={styles.table_cell}>
                <div className={styles.description}>
                    <h4 className={styles.title}>{nook.title}</h4>
                    <p className={styles.price}>{nook.price} DA per night</p>
                    <span className={styles.rating}>★ {nook.rating}</span>
                </div>
            </td>

            {/* الولاية */}
            <td className={styles.table_cell}>
                <span className={styles.wilaya}>{nook.wilaya}</span>
            </td>

            {/* الحالة */}
            <td className={styles.table_cell}>
                <StatusBadge status={nook.status as "reserved" | "available"} />
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
            </td>
        </tr>
    )
}