"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { api } from "@/lib/api";
import { Property, User } from "@/types/api_types";
import styles from "@/styles/my_nooks_styles/seller_profile.module.css"; // سننشئ هذا الملف لاحقاً
import PropertyCard from "@/components/home_components/property_card"; // إعادة استخدام بطاقة العقار

// واجهة لبيانات البروفايل (يمكن إضافتها لـ api_types.ts)
interface SellerProfile {
    user: User;
    stats: {
        reviewsCount: number;
        nooksCount: number;
        reservationsCount: number;
    };
    properties: Property[];
}

export default function SellerProfilePage() {
    const params = useParams();
    const sellerId = params.seller_id as string;
    
    const [profile, setProfile] = useState<SellerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const fetchProfile = async () => {
            try {
                // مثال: const response = await fetch(`/api/Mynook/profile/${sellerId}`);
                // للتجربة سنستخدم بيانات وهمية حتى يجهز الـ API
                setTimeout(() => {
                    setProfile({
                        user: {
                            id: 1,
                            name: "Seddh benmati",
                            email: "seddhbenmati99@gmail.com",
                            role: "owner",
                            createdAt: "",
                            phone: "0779587185",
                            avatar: "./" 
                        },
                        stats: {
                            reviewsCount: 32,
                            nooksCount: 8,
                            reservationsCount: 150
                        },
                        properties: [
                            
                        ]
                    });
                    setLoading(false);
                }, 1000);
            } catch (err) {
                setError("فشل تحميل البروفايل");
                setLoading(false);
            }
        };

        if (sellerId) fetchProfile();
    }, [sellerId]);

    if (loading) return <div className={styles.loading}>جاري التحميل...</div>;
    if (error || !profile) return <div className={styles.error}>{error}</div>;

    // تجميع العقارات حسب الولاية (نفس المنطق السابق)
    const groupedProperties = profile.properties.reduce((acc, prop) => {
        if (!acc[prop.state]) acc[prop.state] = [];
        acc[prop.state].push(prop);
        return acc;
    }, {} as Record<string, Property[]>);

    return (
        <main className={styles.page}>
            {/* قسم معلومات البائع */}
            <section className={styles.profile_header}>
                <div className={styles.avatar_container}>
                    <Image 
                        src={profile.user.avatar || "/default-avatar.png"} 
                        alt={profile.user.name}
                        width={120}
                        height={120}
                        className={styles.avatar}
                    />
                    <div className={styles.rating_badge}>★ {profile.stats.reviewsCount} Reviews</div>
                </div>
                
                <div className={styles.info}>
                    <h1 className={styles.name}>{profile.user.name}</h1>
                    <p className={styles.role}>Host since {new Date(profile.user.createdAt).getFullYear()}</p>
                    
                    <div className={styles.contact_info}>
                        <span> {profile.user.email}</span>
                        <span> {profile.user.phone}</span>
                    </div>
                </div>

                <div className={styles.stats_grid}>
                    <div className={styles.stat_box}>
                        <span className={styles.stat_value}>{profile.stats.nooksCount}</span>
                        <span className={styles.stat_label}>Nooks</span>
                    </div>
                    <div className={styles.stat_box}>
                        <span className={styles.stat_value}>{profile.stats.reservationsCount}</span>
                        <span className={styles.stat_label}>Reservations</span>
                    </div>
                    <div className={styles.stat_box}>
                        <span className={styles.stat_value}>{profile.stats.reviewsCount}</span>
                        <span className={styles.stat_label}>Reviews</span>
                    </div>
                </div>
            </section>

            {/* عرض العقارات حسب الولاية */}
            <section className={styles.properties_section}>
                {Object.entries(groupedProperties).map(([wilaya, props]) => (
                    <div key={wilaya} className={styles.city_group}>
                        <h2 className={styles.city_title}>📍 {wilaya}</h2>
                        <div className={styles.cards_grid}>
                            {props.map((prop) => (
                                <PropertyCard key={prop.id} property={prop} />
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );
}