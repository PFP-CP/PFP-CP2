import { getSavedPosts } from '@/app/(main_page)/(post)/post/[id]/actions/getPost'
import { Property } from '@/types/api_types'
import PropertyCard from '@/components/home_components/property_card'
import styles from '@/styles/my_favorites_styles/favorites_page.module.css'
import { redirect } from 'next/navigation'

export default async function MyFavoritesPage() {
    let favorites: Property[] = []
    try {
        favorites = await getSavedPosts() as Property[]
        console.log(favorites);
    } catch (err: any) {
        if (String(err?.message).includes('401')) redirect('/authentication')
    }

    return (
        <main className={styles.page}>
            <div className={styles.header}>
                <div className={styles.title_section}>
                    <h1 className={styles.page_title}>My Favorites</h1>
                </div>
            </div>
            {favorites.length > 0 ? (
                <div className={styles.grid}>
                    {favorites.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            ) : (
                <div className={styles.empty}>
                    No favorites yet. Start exploring properties!
                </div>
            )}
        </main>
    )
}
