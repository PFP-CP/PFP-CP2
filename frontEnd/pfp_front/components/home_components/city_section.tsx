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
                <span>*</span>
                <h2>{cityName}</h2>
            </div>

            <div className={styles.cards_container}>
                {properties.map((property, index) => (
                    <PropertyCard 
                        key={index}
                        property={property}
                    />     
                ))}
            </div>
        </section>
    )
}