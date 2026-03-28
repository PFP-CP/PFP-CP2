import Image from "next/image"
import styles from "@/styles/home_styles/property_card.module.css"
import { Property } from "@/types/api_types"

type PropertyCardProps = {
    property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.card_image}>
                <Image 
                    src={property.image} 
                    alt={property.title} 
                    width={300} 
                    height={200}
                />
            </div>
            <div className={styles.card_info}>
                <h3>{property.title}</h3>
                <p>{property.wilaya}</p>
                <div className={styles.card_footer}>
                    <span>{property.price} DA per night</span>
                    <span>★ {property.rating}</span>
                </div>
            </div>
        </div>
    )
}