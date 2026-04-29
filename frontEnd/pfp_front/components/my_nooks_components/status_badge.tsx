import styles from "@/styles/my_nooks_styles/status_badge.module.css"

type StatusBadgeProps = {
    status: "reserved" | "available" | "reserved-today";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const cls =
        status === "reserved-today" ? styles.reserved_today : styles[status]
    const label = status === "available" ? "Not reserved" : "Reserved"
    return (
        <span className={`${styles.badge} ${cls}`}>
            {label}
        </span>
    )
}