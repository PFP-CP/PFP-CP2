"use client"

import { useEffect, useState } from "react"
import HeroSection from "@/components/home_components/hero_section"
import CitySection from "@/components/home_components/city_section"
import { api } from "@/lib/api"
import { Property } from "@/types/api_types"
import styles from "./page.module.css"
import Loading from "@/components/loading"
import { getWilayaName } from "@/data/auth_data/data"

export default function Home() {
    const [properties, setProperties] = useState<Property[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [displayedText, setDisplayedText] = useState("");
    const [showSubtitle, setShowSubtitle] = useState(false);
    const fullText = "Find your perfect house,\nanywhere, anytime";

    useEffect(() => {
    let i = 0;
    const speed = 50; 

    const typeWriter = () => {
            if (i < fullText.length) {
                const currentChar = fullText.charAt(i);
                
                if (currentChar === '\n') {
                    setDisplayedText((prev) => prev + " "); 
                } else {
                    setDisplayedText((prev) => prev + currentChar);
                }
                
                i++;
                setTimeout(typeWriter, speed);
            } else {
                setTimeout(() => setShowSubtitle(true), 300);
            }
        };

        const timer = setTimeout(typeWriter, 500);
        return () => clearTimeout(timer);
    }, []);

   useEffect(() => {
        api.getMainPageProperties()
            .then((response) => {
                const data = Array.isArray(response) ? response : (response as any).data || [];
                
                setProperties(data);
            })
            .catch((err) => {
                setError(err.message || "Failed to get data")
                console.error("Error fetching properties:", err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    if (loading) return <Loading text="Loading..." />

    if (error) {
        return (
            <main>
                <HeroSection 
                    displayedText={displayedText} 
                    showSubtitle={showSubtitle} 
                    fullText={fullText}
                />
                <div className={styles.error}>
                    <h3>عذراً، حدث خطأ غير متوقع</h3>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className={styles.retryButton}
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </main>
        )
    }

    const groupPropertiesByWilaya = () => {
        const grouped: Record<string, Property[]> = {}
        
        properties.forEach((property) => {
            const wilaya = getWilayaName(property.state) || property.state
            if (!grouped[wilaya]) {
                grouped[wilaya] = []
            }
            grouped[wilaya].push(property)
        })
        
        return grouped;
    }

    const groupedProperties = groupPropertiesByWilaya()

    return (
        <main>
            <HeroSection 
                displayedText={displayedText} 
                showSubtitle={showSubtitle} 
                fullText={fullText}
            />
            
            <div className={styles.container}>
                {Object.entries(groupedProperties).length > 0 ? (
                    Object.entries(groupedProperties).map(([wilaya, props]) => (
                        <CitySection 
                            key={wilaya}
                            cityName={wilaya}
                            properties={props}
                        />
                    ))
                ) : (
                    <div className={styles.noProperties}>
                        لا توجد عقارات متاحة حالياً.
                    </div>
                )}
            </div>
        </main>
    )
}