import styles from "@/styles/my_nooks_styles/status_badge.module.css"

type StatusBadgeProps = {
    status: "reserved" | "available";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span className={`${styles.badge} ${styles[status]}`}>
            {status === "reserved" ? "Reserved" : "Not reserved"}
        </span>
    )
}