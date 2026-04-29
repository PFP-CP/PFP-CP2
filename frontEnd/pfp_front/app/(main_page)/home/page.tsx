"use client"

import { useEffect, useState } from "react"
import HeroSection from "@/components/home_components/hero_section"
import CitySection from "@/components/home_components/city_section"
import { Property } from "@/types/api_types"
import styles from "./page.module.css"
import Loading from "@/components/loading"
import { getRecommendedPosts, getPostsByWilaya } from "./actions"

const WILAYAS = [
  { code: "16", name: "Algiers" },
  { code: "31", name: "Oran" },
  { code: "09", name: "Blida" },
];

export default function Home() {
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [wilayaPosts, setWilayaPosts] = useState<Record<string, Property[]>>({});
  const [loading, setLoading] = useState(true);

  const [displayedText, setDisplayedText] = useState("");
  const [showSubtitle, setShowSubtitle] = useState(false);
  const fullText = "Find your perfect house,\nanywhere, anytime";

  useEffect(() => {
    let i = 0;
    const typeWriter = () => {
      if (i < fullText.length) {
        const char = fullText.charAt(i);
        setDisplayedText((prev) => prev + (char === '\n' ? " " : char));
        i++;
        setTimeout(typeWriter, 50);
      } else {
        setTimeout(() => setShowSubtitle(true), 300);
      }
    };
    const timer = setTimeout(typeWriter, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    Promise.all([
      getRecommendedPosts(),
      ...WILAYAS.map((w) => getPostsByWilaya(w.code)),
    ]).then(([rec, ...results]) => {
      setRecommended(rec);
      const map: Record<string, Property[]> = {};
      WILAYAS.forEach((w, i) => { map[w.name] = results[i]; });
      setWilayaPosts(map);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading..." />;

  return (
    <main>
      <HeroSection
        displayedText={displayedText}
        showSubtitle={showSubtitle}
        fullText={fullText}
      />
      <div className={styles.container}>
        {recommended.length > 0 && (
          <CitySection cityName="Just for you" properties={recommended} />
        )}
        {WILAYAS.map(({ name }) =>
          (wilayaPosts[name]?.length ?? 0) > 0 ? (
            <CitySection key={name} cityName={name} properties={wilayaPosts[name]} />
          ) : null
        )}
      </div>
    </main>
  );
}
