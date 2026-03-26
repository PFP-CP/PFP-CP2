import styles from "@/styles/home_styles/hero.module.css"
import Image from "next/image";

export default function HeroSection() {

    return (
        <section className={styles.hero}>
            <div className={styles.hero_content}>
               <h1>Find Your Perfect House</h1>
               <h1>anywhere, anytime</h1>
               <p>Book beautiful homes for holidays, weekends, or long stays.</p>
            </div>

            <div className={styles.hero_image}>
                <Image src="/hero-house.png" alt="House 3D" width={400} height={300}/>
            </div>
        </section>
    )
}