'use client'

import { useRef } from 'react'
import styles from "@/styles/home_styles/city_section.module.css"
import PropertyCard from "./property_card"
import { Property } from "@/types/api_types"

type CitySectionProps = {
    cityName: string;
    properties: Property[];
}

export default function CitySection({ cityName, properties }: CitySectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (dir: 'left' | 'right') => {
        if (!scrollRef.current) return
        scrollRef.current.scrollBy({ left: dir === 'left' ? -304 : 304, behavior: 'smooth' })
    }

    return (
        <section className={styles.city_section}>
            <div className={styles.city_header}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.city_icon}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <h2>{cityName}</h2>
                <div className={styles.arrow_group}>
                    <button className={styles.arrow_btn} onClick={() => scroll('left')} aria-label="Scroll left">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <button className={styles.arrow_btn} onClick={() => scroll('right')} aria-label="Scroll right">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className={styles.cards_container} ref={scrollRef}>
                {properties.map((property, index) => (
                    <div key={property.id || index} className={styles.slide}>
                        <PropertyCard property={property} />
                    </div>
                ))}
            </div>
        </section>
    )
}
