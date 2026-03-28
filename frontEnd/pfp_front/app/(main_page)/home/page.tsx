"use client"

import { useEffect, useState } from "react"
import HeroSection from "@/components/home_components/hero_section"
import CitySection from "@/components/home_components/city_section"
import { api } from "@/lib/api"
import { Property } from "@/types/api_types"

export default function Home() {
    const [properties, setProperties] = useState<Property[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // جلب العقارات عند تحميل الصفحة
    useEffect(() => {
        api.getProperties()
            .then((response) => {
                // إذا كان الرد { success, data } أو مباشرة []
                const data = response.data || response
                setProperties(data)
            })
            .catch((err) => {
                setError(err.message)
                console.error("Error fetching properties:", err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    // عرض حالة التحميل
    if (loading) {
        return (
            <main>
                <HeroSection />
                <div style={{ textAlign: "center", padding: "40px" }}>
                    جاري التحميل...
                </div>
            </main>
        )
    }

    // عرض حالة الخطأ
    if (error) {
        return (
            <main>
                <HeroSection />
                <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
                    حدث خطأ: {error}
                </div>
            </main>
        )
    }

    // دالة لتجميع العقارات حسب الولاية
    const groupPropertiesByWilaya = () => {
        const grouped: Record<string, Property[]> = {}
        
        properties.forEach((property) => {
            const wilaya = property.wilaya
            if (!grouped[wilaya]) {
                grouped[wilaya] = []
            }
            grouped[wilaya].push(property)
        })
        
        return grouped
    }

    const groupedProperties = groupPropertiesByWilaya()

    return (
        <main>
            <HeroSection />
            
            {/* عرض كل ولاية والعقارات التابعة لها */}
            {Object.entries(groupedProperties).map(([wilaya, props]) => (
                <CitySection 
                    key={wilaya}
                    cityName={wilaya}
                    properties={props}
                />
            ))}
        </main>
    )
}