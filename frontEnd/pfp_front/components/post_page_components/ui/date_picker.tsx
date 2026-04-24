'use client'
import { useCallback, useMemo, useRef, useState } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';
import { eachDayOfInterval, format } from 'date-fns';
import style from "@/styles/post_page_styles/date_picker.module.css";
import { PostReservation } from '@/types/api_types';

// Module-level constants — stable references, never recreated
const RANGE_COLORS = ['rgba(34, 14, 103, 1)'];

function buildDisabledDates(reservations: PostReservation[]): Date[] {
  const dates: Date[] = []
  for (const r of reservations) {
    const start = new Date(r.arrival_date + 'T00:00:00')
    const end = new Date(r.departure_date + 'T00:00:00')
    if (start <= end) dates.push(...eachDayOfInterval({ start, end }))
  }
  return dates
}

export default function MyDatePicker({
  setCalendarOpen,
  calendarOpen,
  reservations,
  onConfirm,
}: {
  setCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>
  calendarOpen: boolean
  reservations: PostReservation[]
  onConfirm: (start: Date, end: Date) => void
}) {
  const disabledDates = useMemo(() => buildDisabledDates(reservations), [reservations])

  const [range, setRange] = useState([{ startDate: new Date(), endDate: new Date(), key: 'range' }])
  const [bookDate, setBookDate] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null })
  const [confirmed, setConfirmed] = useState(false)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [focusedRange, setFocusedRange] = useState<[number, number]>([0, 0])
  const [isSelecting, setIsSelecting] = useState(false)
  
  const shownDateRef = useRef(new Date())

  const isPickingStart = focusedRange[1] === 0

  const handleSelect = useCallback((Ranges: any) => {
    const Range = Ranges.range
    if (!Range) return
    setIsSelecting(true)
    setRange([{ startDate: Range.startDate, endDate: Range.endDate, key: 'range' }])
  }, [])

  const handlePreviewChange = useCallback((date: Date | undefined) => {
    setHoverDate(date || null)
  }, [])

  const handleRangeFocusChange = useCallback((focused: [number, number]) => {
    setFocusedRange(focused)
  }, [])

  const handleShownDateChange = useCallback((date: Date) => {
    shownDateRef.current = date
  }, [])

  const handleClose = () => {
    setCalendarOpen(false)
    setHoverDate(null)
    setFocusedRange([0, 0])
    setIsSelecting(false)
  }

  const handleConfirm = () => {
    const start = range[0].startDate
    const end   = range[0].endDate
    setCalendarOpen(false)
    setBookDate({ start, end })
    onConfirm(start, end)
    setRange([{ startDate: new Date(), endDate: new Date(), key: 'range' }])
    setConfirmed(true)
    setHoverDate(null)
    setFocusedRange([0, 0])
    setIsSelecting(false)
  }

  const confirmedArrival = confirmed && bookDate.start ? format(bookDate.start, 'dd/MM/yyyy') : null
  const confirmedDepart  = confirmed && bookDate.end   ? format(bookDate.end,   'dd/MM/yyyy') : null

  let arrivalLabel = confirmedArrival ?? 'Arrival Date'
  let departLabel  = confirmedDepart  ?? 'Depart Date'

  if (calendarOpen) {
    if (!isSelecting && isPickingStart) {
      if (hoverDate) arrivalLabel = format(hoverDate, 'dd/MM/yyyy')
    } else if (isSelecting && !isPickingStart) {
      arrivalLabel = format(range[0].startDate, 'dd/MM/yyyy')
      if (hoverDate) departLabel = format(hoverDate, 'dd/MM/yyyy')
    } else if (isSelecting && isPickingStart) {
      arrivalLabel = format(range[0].startDate, 'dd/MM/yyyy')
      departLabel  = format(range[0].endDate,   'dd/MM/yyyy')
    }
  }

  const arrivalSelected = arrivalLabel !== 'Arrival Date'
  const departSelected  = departLabel  !== 'Depart Date'

  return (
    <div className={style.datepicker_side_container}>
      <div className={style.container}>
        <div
          onClick={() => setCalendarOpen(!calendarOpen)}
          className={`${arrivalSelected ? style.date_container_after_choice : style.date_container_before_choice} ${style.date_container}`}
        >
          {arrivalLabel}
        </div>
        <div
          onClick={() => setCalendarOpen(!calendarOpen)}
          className={`${departSelected ? style.date_container_after_choice : style.date_container_before_choice} ${style.date_container}`}
        >
          {departLabel}
        </div>
      </div>

      {calendarOpen && (
        <>
          <DateRange
            ranges={range}
            onChange={handleSelect}
            onPreviewChange={handlePreviewChange}
            focusedRange={focusedRange}
            onRangeFocusChange={handleRangeFocusChange}
            shownDate={shownDateRef.current}
            onShownDateChange={handleShownDateChange}
            disabledDates={disabledDates}
            minDate={shownDateRef.current}
            rangeColors={RANGE_COLORS}
          />
          <div className={style.buttons_container}>
            <button onClick={handleClose}>Close</button>
            <button onClick={handleConfirm}>Confirm</button>
          </div>
        </>
      )}
    </div>
  )
}
