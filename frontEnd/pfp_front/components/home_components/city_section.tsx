import styles from "@/styles/home_styles/city_section.module.css"
import PropertyCard from "./property_card"
import { Property } from "@/types/api_types"

type CitySectionProps = {
    cityName: string;
    properties: Property[];
}

export default function CitySection( {cityName, properties}: CitySectionProps){
    return (
        <section className={styles.city_section}>
            <div className={styles.city_header}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.city_icon}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <h2>{cityName}</h2>
            </div>

            <div className={styles.cards_container}>
                {properties.map((property, index) => (
                    <PropertyCard 
                        key={property.id || index}
                        property={property}
                    />     
                ))}
            </div>
        </section>
    )
}