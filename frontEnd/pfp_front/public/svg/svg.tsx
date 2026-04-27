import style from '@/styles/post_page_styles/showcase.module.css'

// ── Rating ────────────────────────────────────────────────────────────────────

export const STAR_LOGO = <svg width="27" height="27" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l7.1-1.01L12 2z" fill="black"/>
</svg>

export const STAR_LOGO_SMALL = <svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l7.1-1.01L12 2z" fill="black"/>
</svg>

export const START_LOGO_X_SMALL = <svg width="10" height="10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l7.1-1.01L12 2z" fill="black" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
</svg>

// ── UI Controls ───────────────────────────────────────────────────────────────

export const LEAVE_TAB = <svg viewBox="0 0 24 24" width={24} height={24}>
  <line x1="7" y1="7" x2="17" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  <line x1="17" y1="7" x2="7" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
</svg>

export const LEAVE_TAB_WHITE = <svg viewBox="0 0 24 24" width={24} height={24}>
  <line x1="7" y1="7" x2="17" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  <line x1="17" y1="7" x2="7" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
</svg>

export const CONFIRM = <svg width="33" height="20" viewBox="0 0 33 20" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 11 L12 16 L24 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
</svg>

export const LEAVE_ARROW = <svg width="18" height="16" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 7H1M1 7L7 13M1 7L7 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

// ── Post Actions ──────────────────────────────────────────────────────────────

export const SAVE_LOGO_ACTIVE = <svg className={style.save_active} width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.38571 1.5C4.20759 1.5 1.5 4.368 1.5 8.09282C1.5 10.6624 2.49697 12.8258 3.81827 14.6178C5.13504 16.4037 6.83388 17.9028 8.36968 19.1574L11.0195 21.3222C11.3097 21.5593 11.6903 21.5593 11.9805 21.3222L14.6303 19.1574C16.1661 17.9028 17.865 16.4037 19.1817 14.6178C20.503 12.8258 21.5 10.6624 21.5 8.09282C21.5 4.368 18.7924 1.5 15.6143 1.5C13.976 1.5 12.5345 2.42709 11.5 3.62667C10.4655 2.42709 9.02397 1.5 7.38571 1.5Z" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

export const SAVE_LOGO_INACTIVE = <svg className={style.save_inactive} width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.38571 1.5C4.20759 1.5 1.5 4.368 1.5 8.09282C1.5 10.6624 2.49697 12.8258 3.81827 14.6178C5.13504 16.4037 6.83388 17.9028 8.36968 19.1574L11.0195 21.3222C11.3097 21.5593 11.6903 21.5593 11.9805 21.3222L14.6303 19.1574C16.1661 17.9028 17.865 16.4037 19.1817 14.6178C20.503 12.8258 21.5 10.6624 21.5 8.09282C21.5 4.368 18.7924 1.5 15.6143 1.5C13.976 1.5 12.5345 2.42709 11.5 3.62667C10.4655 2.42709 9.02397 1.5 7.38571 1.5Z" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

export const COPY_LINK_LOGO = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
</svg>

export const TITLE_LOGO = <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M18.3333 19.8333V28.3333C18.3333 28.7753 18.5089 29.1992 18.8215 29.5118C19.134 29.8243 19.558 29.9999 20 29.9999C20.442 29.9999 20.8659 29.8243 21.1785 29.5118C21.4911 29.1992 21.6667 28.7753 21.6667 28.3333V19.8333C23.6901 19.4202 25.488 18.2706 26.712 16.6073C27.9359 14.9439 28.4987 12.8854 28.2911 10.8307C28.0836 8.77605 27.1205 6.87164 25.5886 5.4867C24.0567 4.10176 22.0651 3.33496 20 3.33496C17.9349 3.33496 15.9433 4.10176 14.4114 5.4867C12.8795 6.87164 11.9164 8.77605 11.7089 10.8307C11.5013 12.8854 12.064 14.9439 13.288 16.6073C14.512 18.2706 16.3099 19.4202 18.3333 19.8333ZM27.0167 24.0333C26.7978 23.9873 26.572 23.9849 26.3522 24.0262C26.1324 24.0675 25.9229 24.1517 25.7356 24.2739C25.5484 24.3962 25.387 24.5541 25.2608 24.7388C25.1346 24.9234 25.046 25.1311 25 25.3499C24.954 25.5688 24.9516 25.7946 24.9929 26.0144C25.0342 26.2342 25.1184 26.4437 25.2407 26.6309C25.3629 26.8182 25.5209 26.9796 25.7055 27.1058C25.8901 27.232 26.0978 27.3206 26.3167 27.3666C30.1 28.1166 31.6667 29.4666 31.6667 29.9999C31.6667 30.9666 27.5833 33.3333 20 33.3333C12.4167 33.3333 8.33333 30.9666 8.33333 29.9999C8.33333 29.4666 9.9 28.1166 13.6833 27.2999C13.9022 27.254 14.1099 27.1653 14.2945 27.0391C14.4791 26.9129 14.6371 26.7515 14.7593 26.5643C14.8816 26.377 14.9658 26.1675 15.0071 25.9477C15.0484 25.7279 15.046 25.5021 15 25.2833C14.954 25.0644 14.8654 24.8567 14.7392 24.6721C14.613 24.4875 14.4516 24.3295 14.2644 24.2073C14.0771 24.085 13.8676 24.0008 13.6478 23.9595C13.428 23.9182 13.2022 23.9206 12.9833 23.9666C7.91667 25.1333 5 27.3166 5 29.9999C5 34.3833 12.55 36.6666 20 36.6666C27.45 36.6666 35 34.3833 35 29.9999C35 27.3166 32.0833 25.1333 27.0167 24.0333Z" fill="#010006"/>
</svg>

// ── Amenity Icons ─────────────────────────────────────────────────────────────

export const parking = <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="3" width="18" height="18" rx="2"/>
  <path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>
</svg>

export const wifi = <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
  <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
  <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
  <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/>
</svg>

export const kitchen = <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
  <path d="M7 2v20"/>
  <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
</svg>

export const fridge = <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="2" width="16" height="20" rx="2"/>
  <line x1="4" y1="10" x2="20" y2="10"/>
  <line x1="9" y1="6" x2="9" y2="8"/>
  <line x1="9" y1="13" x2="9" y2="17"/>
</svg>

export const microwave = <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="6" width="20" height="12" rx="2"/>
  <rect x="4" y="8" width="11" height="8" rx="1"/>
  <line x1="18" y1="9" x2="18" y2="9.01"/>
  <line x1="18" y1="12" x2="18" y2="12.01"/>
  <line x1="18" y1="15" x2="18" y2="15.01"/>
</svg>

export const stove = <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="4" width="20" height="16" rx="2"/>
  <circle cx="8.5" cy="10.5" r="2"/>
  <circle cx="15.5" cy="10.5" r="2"/>
  <circle cx="8.5" cy="17" r="1"/>
  <circle cx="15.5" cy="17" r="1"/>
  <line x1="6" y1="6" x2="18" y2="6"/>
</svg>

export const oven = <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="3" width="20" height="19" rx="2"/>
  <rect x="5" y="9" width="14" height="10" rx="1"/>
  <circle cx="8" cy="6" r="0.8" fill="currentColor" stroke="none"/>
  <circle cx="12" cy="6" r="0.8" fill="currentColor" stroke="none"/>
  <circle cx="16" cy="6" r="0.8" fill="currentColor" stroke="none"/>
</svg>

export const dishes = <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="9"/>
  <circle cx="12" cy="12" r="5"/>
</svg>

export const air_conditioning = <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="5" width="20" height="8" rx="2"/>
  <path d="M9 17H5a2 2 0 0 0-2 2v2h18v-2a2 2 0 0 0-2-2h-4"/>
  <path d="M9 13v4"/>
  <path d="M15 13v4"/>
  <line x1="7" y1="9" x2="7" y2="9.01"/>
  <line x1="12" y1="9" x2="17" y2="9"/>
</svg>

export const heating = <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
</svg>

export const cleaning_products = <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 4h4v4H9z"/>
  <path d="M9 8l-2 2v10a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V10l-2-2"/>
  <line x1="9" y1="13" x2="13" y2="13"/>
  <path d="M13 4h3"/>
  <path d="M14.5 3v3"/>
</svg>

export const washing_machine = <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="20" height="20" rx="2"/>
  <circle cx="12" cy="13" r="5"/>
  <circle cx="8" cy="6" r="0.8" fill="currentColor" stroke="none"/>
  <circle cx="16" cy="6" r="0.8" fill="currentColor" stroke="none"/>
  <path d="M10 11a3 3 0 0 1 4 0"/>
</svg>

export const pool = <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5s2.5 2 5 2 2.5-2 5-2 2.5 2 2.5 2"/>
  <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 2.5 2"/>
  <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 2.5 2"/>
</svg>

export const television = <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="7" width="20" height="13" rx="2"/>
  <path d="M17 2l-5 5-5-5"/>
</svg>

export const sea_view = <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="6" r="3"/>
  <path d="M12 2v1m0 6v1M8 6H7m9 0h-1M9.5 3.5l-.7-.7m6.4.7.7-.7"/>
  <path d="M2 15c1.5 0 2.5 1 4 1s2.5-1 4-1 2.5 1 4 1 2.5-1 4-1"/>
  <path d="M2 19c1.5 0 2.5 1 4 1s2.5-1 4-1 2.5 1 4 1 2.5-1 4-1"/>
</svg>

export const freezer = <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="2" width="16" height="20" rx="2"/>
  <line x1="4" y1="10" x2="20" y2="10"/>
  <line x1="12" y1="13" x2="12" y2="19"/>
  <line x1="9" y1="14.5" x2="15" y2="17.5"/>
  <line x1="15" y1="14.5" x2="9" y2="17.5"/>
</svg>

// ── Feature icon map (keys match backend feature strings exactly) ─────────────

export const FEATURE_ICONS: Record<string, { icon: JSX.Element; label: string }> = {
  'Pool':               { icon: pool,             label: 'Pool' },
  'Wifi':               { icon: wifi,             label: 'Wifi' },
  'Heating':            { icon: heating,          label: 'Heating' },
  'Air Conditioning':   { icon: air_conditioning, label: 'Air Conditioning' },
  'Television':         { icon: television,       label: 'Television' },
  'Kitchen':            { icon: kitchen,          label: 'Kitchen' },
  'Microwave':          { icon: microwave,        label: 'Microwave' },
  'Fridge':             { icon: fridge,           label: 'Fridge' },
  'Washing machine':    { icon: washing_machine,  label: 'Washing machine' },
  'Cleaning products':  { icon: cleaning_products,label: 'Cleaning products' },
  'Sea view':           { icon: sea_view,         label: 'Sea view' },
  'Parking':            { icon: parking,          label: 'Parking' },
  'Dishes':             { icon: dishes,           label: 'Dishes' },
  'Freezer':            { icon: freezer,          label: 'Freezer' },
  'Stove':              { icon: stove,            label: 'Stove' },
  'Oven':               { icon: oven,             label: 'Oven' },
}
