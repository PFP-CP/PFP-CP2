import styles from "@/styles/home_styles/hero.module.css"
import Image from "next/image";

type HeroSectionProps = {
    displayedText: string;
    showSubtitle: boolean;
    fullText: string;
};
export default function HeroSection({ displayedText, showSubtitle, fullText }: HeroSectionProps) {

    return (
        <section className={styles.hero}>
            <div className={styles.hero_content}>
               <h1>
                    {displayedText}
                    {/* إظهار المؤشر فقط إذا لم ينتهِ النص بعد */}
                    {displayedText.length < fullText.length && (
                        <span className={styles["typewriter-cursor"]}></span>
                    )}
                </h1>
              <p className={showSubtitle ? styles.visible : ""}>
                    Book beautiful homes for holidays, weekends, or long stays. 
                    Experience the comfort of home with the service of a hotel.
                </p>
            </div>

            <div className={styles.hero_image}>
                <Image 
                    src="/hero-house.png" 
                    alt="Beautiful House" 
                    width={600} 
                    height={400} 
                    priority
                    style={{ objectFit: 'contain' }}
                />
            </div>
        </section>
    )
}