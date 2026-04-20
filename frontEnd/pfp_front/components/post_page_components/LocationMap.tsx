'use client'
import { useEffect, useRef } from 'react'
import style from '@/styles/post_page_styles/location_map.module.css'

interface Props {
  lat: number
  lng: number
  onClose: () => void
}

export default function LocationMap({ lat, lng, onClose }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current) return
    let cancelled = false

    import('leaflet').then((L) => {
      if (cancelled || !mapRef.current) return
      if ((mapRef.current as any)._leaflet_id) return

      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!).setView([lat, lng], 14)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      L.marker([lat, lng]).addTo(map)

      leafletMap.current = map
    })

    return () => {
      cancelled = true
      leafletMap.current?.remove()
      leafletMap.current = null
    }
  }, [lat, lng])

  return (
    <div className={style.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={style.modal}>
        <div className={style.modal_header}>
          <span>Location</span>
          <button type="button" className={style.close_btn} onClick={onClose}>✕</button>
        </div>
        <div ref={mapRef} className={style.map} />
      </div>
    </div>
  )
}
