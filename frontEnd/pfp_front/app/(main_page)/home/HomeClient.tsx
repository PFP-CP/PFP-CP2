'use client'

import { useEffect, useState } from 'react'
import HeroSection from '@/components/home_components/hero_section'
import CitySection from '@/components/home_components/city_section'
import { Property } from '@/types/api_types'
import styles from './page.module.css'

type Props = {
  recommended: Property[]
  wilayaPosts: Record<string, Property[]>
  wilayaNames: string[]
}

export default function HomeClient({ recommended, wilayaPosts, wilayaNames }: Props) {
  const [displayedText, setDisplayedText] = useState('')
  const [showSubtitle, setShowSubtitle] = useState(false)
  const fullText = "Find your perfect house,\nanywhere, anytime"

  useEffect(() => {
    let i = 0
    const typeWriter = () => {
      if (i < fullText.length) {
        const char = fullText.charAt(i)
        setDisplayedText((prev) => prev + (char === '\n' ? ' ' : char))
        i++
        setTimeout(typeWriter, 50)
      } else {
        setTimeout(() => setShowSubtitle(true), 300)
      }
    }
    const timer = setTimeout(typeWriter, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main>
      <HeroSection displayedText={displayedText} showSubtitle={showSubtitle} fullText={fullText} />
      <div className={styles.container}>
        {recommended.length > 0 && (
          <CitySection cityName="Just for you" properties={recommended} />
        )}
        {wilayaNames.map((name) =>
          (wilayaPosts[name]?.length ?? 0) > 0 ? (
            <CitySection key={name} cityName={name} properties={wilayaPosts[name]} />
          ) : null
        )}
      </div>
    </main>
  )
}
