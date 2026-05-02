'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import styles from '@/styles/navigation_loader.module.css'

export default function NavigationLoader() {
    const pathname = usePathname()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(false)
    }, [pathname])

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const anchor = (e.target as Element).closest('a')
            if (!anchor) return
            const href = anchor.getAttribute('href')
            if (!href || !href.startsWith('/') || href === pathname) return
            setLoading(true)
        }
        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [pathname])

    if (!loading) return null

    return (
        <div className={styles.container}>
            <div className={styles.spinner} />
        </div>
    )
}
