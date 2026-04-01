"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import styles from "@/styles/my_nooks_styles/add_nook_form.module.css";
import Image from "next/image";

export default function AddNookPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: "",
        type: "Apartment",
        location: "",
        wilaya: "Algiers",
        price: "",
        description: "",
        guests: 1,
        bedrooms: 1,
        bathrooms: 1,
        family: true,
        single: true,
        couple: true,
        pets: false,
        smoking: false,
        noise: false,
        features: [] as string[],
        images: [] as string[], 
    });

            const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const priceValue = Number(formData.price);
            
            if (!formData.title || !formData.location || isNaN(priceValue)) {
                alert("الرجاء ملء جميع الحقول الأساسية بشكل صحيح");
                setLoading(false);
                return;
            }


            const payload = {
                title: formData.title,
                country: "Algeria", 
                wilaya: formData.wilaya, 
                price: priceValue,       
                description: formData.description,
                images: formData.images.length > 0 ? formData.images : ["https://via.placeholder.com/400"],
                features: formData.features,
                rules: {
                    smoking: formData.smoking,
                    animals: formData.pets, 
                    noise: formData.noise,
                },
                categories: {
                    family: formData.family,
                    single: formData.single,
                    couple: formData.couple,
                },
            };

            console.log("Sending Payload:", payload); 

            await api.createNook(payload);
            
            alert("تم نشر العقار بنجاح!");
            router.push("/mynooks");
        } catch (error) {
            console.error("Error details:", error);
            const msg = error instanceof Error ? error.message : "حدث خطأ";
            alert(`فشل النشر: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleFeature = (feature: string) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.includes(feature)
                ? prev.features.filter(f => f !== feature)
                : [...prev.features, feature]
        }));
    };

    return (
        <main className={styles.page}>
            <form onSubmit={handleSubmit} className={styles.form_container}>

                <section className={styles.section}>
                    <h3 className={styles.section_title}>Photos</h3>
                    <div className={styles.photos_grid}>
                        <div className={styles.upload_box}>
                            <span>+</span>
                            <p>Click here to upload<br/>up to 10 photos</p>
                        </div>

                        {formData.images.map((img, idx) => (
                            <div key={idx} className={styles.photo_preview}>
                                <Image src={img} alt="Preview" fill style={{objectFit:'cover'}} />
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.section}>
                    <h3 className={styles.section_title}>Type & Categories</h3>
                    <div className={styles.row}>
                        <div className={styles.input_group}>
                            <label>Type</label>
                            <select 
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className={styles.select_input}
                            >
                                <option>Apartment</option>
                                <option>Villa</option>
                                <option>Chalet</option>
                                <option>Studio</option>
                            </select>
                        </div>
                        
                        <div className={styles.categories}>
                            <label>Categories</label>
                            <div className={styles.toggle_group}>
                                {['Family', 'Single', 'Couple'].map(cat => (
                                    <label key={cat} className={styles.toggle_switch}>
                                        <input 
                                            type="checkbox" 
                                            checked={formData[cat.toLowerCase() as keyof typeof formData] as boolean}
                                            onChange={(e) => setFormData({...formData, [cat.toLowerCase()]: e.target.checked})}
                                        />
                                        <span>{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h3 className={styles.section_title}>Location & Pricing</h3>
                    <div className={styles.grid_2}>
                        <input 
                            type="text" 
                            placeholder="Enter full address" 
                            className={styles.text_input}
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                        <select 
                            value={formData.wilaya}
                            onChange={(e) => setFormData({...formData, wilaya: e.target.value})}
                            className={styles.select_input}
                        >
                            <option>Algiers</option>
                            <option>Oran</option>
                            <option>Constantine</option>
                        </select>
                        <input 
                            type="number" 
                            placeholder="Price per night (DA)" 
                            className={styles.text_input}
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                    </div>
                    <div className={styles.counters}>
                        {[
                            { label: "Guests", key: "guests" },
                            { label: "Bedrooms", key: "bedrooms" },
                            { label: "Bathrooms", key: "bathrooms" }
                        ].map(item => (
                            <div key={item.key} className={styles.counter_box}>
                                <span>{item.label}</span>
                                <div className={styles.counter_controls}>
                                    <button type="button" onClick={() => setFormData(prev => ({...prev, [item.key]: Math.max(1, (prev[item.key as keyof typeof prev] as number) - 1)}))}>-</button>
                                    <span>{formData[item.key as keyof typeof formData] as number}</span>
                                    <button type="button" onClick={() => setFormData(prev => ({...prev, [item.key]: (prev[item.key as keyof typeof prev] as number) + 1}))}>+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.section}>
                    <h3 className={styles.section_title}>Rules</h3>
                    <div className={styles.toggle_group}>
                        {['Pets allowed', 'Smoking allowed', 'Noise allowed'].map((rule, idx) => {
                            const key = idx === 0 ? 'pets' : idx === 1 ? 'smoking' : 'noise';
                            return (
                                <label key={rule} className={styles.toggle_switch}>
                                    <input 
                                        type="checkbox"
                                        checked={formData[key as keyof typeof formData] as boolean}
                                        onChange={(e) => setFormData({...formData, [key]: e.target.checked})}
                                    />
                                    <span>{rule}</span>
                                </label>
                            )
                        })}
                    </div>
                </section>

                <section className={styles.section}>
                    <h3 className={styles.section_title}>Features</h3>
                    <div className={styles.features_grid}>
                        {["Wifi", "Pool", "Parking", "Air conditioning", "Kitchen", "Sea view", "Balcony", "Gym"].map(feature => (
                            <button
                                key={feature}
                                type="button"
                                className={`${styles.feature_tag} ${formData.features.includes(feature) ? styles.active : ''}`}
                                onClick={() => toggleFeature(feature)}
                            >
                                {feature}
                            </button>
                        ))}
                    </div>
                </section>

                <section className={styles.section}>
                    <h3 className={styles.section_title}>Description</h3>
                    <textarea 
                        className={styles.textarea}
                        rows={5}
                        placeholder="Write a description of your nook..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </section>

                <button type="submit" className={styles.submit_btn} disabled={loading}>
                    {loading ? "Posting..." : "Post your Nook"}
                </button>
            </form>
        </main>
    );
}