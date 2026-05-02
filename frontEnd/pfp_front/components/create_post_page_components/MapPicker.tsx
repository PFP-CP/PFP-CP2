'use client'
import { useEffect, useRef, useState } from 'react'
import style from '@/styles/create_post_page_styles/map_picker.module.css'

interface PickedLocation {
  lat: number
  lng: number
  wilaya: string
  wilayaCode: string
  baladia: string
  country: string
  display: string
}

interface Props {
  onConfirm: (loc: PickedLocation) => void
  onClose: () => void
}

// Dynamically imported — Leaflet must not run on the server
export default function MapPicker({ onConfirm, onClose }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [picked, setPicked] = useState<PickedLocation | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!mapRef.current) return
    let cancelled = false

    import('leaflet').then((L) => {
      if (cancelled || !mapRef.current) return
      // Guard against Strict Mode double-invoke
      if ((mapRef.current as any)._leaflet_id) return

      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!).setView([28.0339, 1.6596], 5)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      map.on('click', async (e: any) => {
        if (cancelled) return
        const { lat, lng } = e.latlng

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng])
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(map)
        }

        setLoading(true)
        setPicked(null)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          )
          const data = await res.json()
          const addr = data.address ?? {}
          const wilaya = addr.state ?? addr.province ?? addr.region ?? ''
          const isoMatch = (addr['ISO3166-2-lvl4'] ?? '').match(/^DZ-(\d+)$/i)
          const wilayaCode = isoMatch ? isoMatch[1].padStart(2, '0') : ''
          const baladia = addr.city ?? addr.town ?? addr.village ?? addr.county ?? ''
          const country = addr.country ?? ''
          const display = data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
          if (!cancelled) setPicked({ lat, lng, wilaya, wilayaCode, baladia, country, display })
        } catch {
          if (!cancelled) setPicked({ lat, lng, wilaya: '', wilayaCode: '', baladia: '', country: '', display: `${lat.toFixed(5)}, ${lng.toFixed(5)}` })
        } finally {
          if (!cancelled) setLoading(false)
        }
      })

      leafletMap.current = map
    })

    return () => {
      cancelled = true
      leafletMap.current?.remove()
      leafletMap.current = null
      markerRef.current = null
    }
  }, [])

  return (
    <div className={style.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={style.modal}>
        <div className={style.modal_header}>
          <span>Pick a location</span>
          <button type="button" className={style.close_btn} onClick={onClose}>✕</button>
        </div>
        <div ref={mapRef} className={style.map} />
        <div className={style.modal_footer}>
          {loading && <span className={style.address_text}>Fetching address…</span>}
          {!loading && picked && (
            <span className={style.address_text} title={picked.display}>
              {[picked.baladia, picked.wilaya, picked.country].filter(Boolean).join(', ')}
            </span>
          )}
          {!loading && !picked && (
            <span className={style.address_hint}>Click anywhere on the map to drop a pin</span>
          )}
          <div className={style.footer_buttons}>
            <button type="button" className={style.cancel_btn} onClick={onClose}>Cancel</button>
            <button
              type="button"
              className={style.confirm_btn}
              disabled={!picked}
              onClick={() => picked && onConfirm(picked)}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
