'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import styles from '@/styles/navigation_loader.module.css'

interface NavigationLoaderContextType {
    startLoading: () => void
}

const NavigationLoaderContext = createContext<NavigationLoaderContextType>({
    startLoading: () => {},
})

export function useNavigationLoader() {
    return useContext(NavigationLoaderContext)
}

export function NavigationLoaderProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(false)
    }, [pathname])

    // handle <a> tag clicks
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

    return (
        <NavigationLoaderContext.Provider value={{ startLoading: () => setLoading(true) }}>
            {children}
            {loading && (
                <div className={styles.container}>
                    <div className={styles.spinner} />
                </div>
            )}
        </NavigationLoaderContext.Provider>
    )
}
