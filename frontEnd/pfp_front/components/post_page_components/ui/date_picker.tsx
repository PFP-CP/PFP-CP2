'use client'
import { useState } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Calendar, DateRange } from 'react-date-range';
import { eachDayOfInterval,format } from 'date-fns';
import style from "@/styles/post_page_styles/date_picker.module.css";

const disabledDates = [
    ...eachDayOfInterval({ start: new Date(1900,1,1), end: new Date() }),
    // ...eachDayOfInterval({ start: new Date(2026, 3, 10), end: new Date(2026, 3, 15) }),
  ]

export default function MyDatePicker({setCalendarOpen,calendarOpen}:{setCalendarOpen:React.Dispatch<React.SetStateAction<boolean>>,calendarOpen:boolean}){
  const [range, setRange] = useState([{
    startDate:new Date(),
    endDate: new Date(),
    key:'range'
  }]);
  const [bookDate, setBookDate] = useState([{...range[0],key:'book_date'}]);
  const [confirmed, setConfirmed] = useState(false);

  const handleSelect = (Range)=>{
    const {startDate, endDate} = Range["range"];
    setRange([{
      startDate:startDate,
      endDate:endDate,
      key:'range'
    }])
    return;
  }

  const handleClose = ()=>{
    setCalendarOpen(false);
  }

  const handleConfirm = ()=>{
    setCalendarOpen(false);
    setBookDate([{...range[0],key:'book_date'}]);
    setRange([{
      startDate:new Date(),
      endDate: new Date(),
      key:'range'
    }])
    setConfirmed(true);
  }


  return(
    <div className={style.datepicker_side_container}>
      <div className={style.container}>
        <div onClick={()=> setCalendarOpen(!calendarOpen)} className={`${bookDate[0].startDate && (calendarOpen || confirmed) ?style.date_container_after_choice:style.date_container_before_choice} ${style.date_container}`}>{bookDate[0].startDate&&(calendarOpen || confirmed)?<>{format(bookDate[0].startDate,"dd/MM/yyyy")}</>:<>Arrival Date</>}</div>  
        <div onClick={()=> setCalendarOpen(!calendarOpen)} className={`${bookDate[0].endDate && (calendarOpen || confirmed) ?style.date_container_after_choice:style.date_container_before_choice} ${style.date_container}`}>{bookDate[0].endDate&&(calendarOpen || confirmed)?<>{format(bookDate[0].endDate,"dd/MM/yyyy")}</>:<>Depart Date</>}</div>  
      </div>
      {calendarOpen&&
        <>
          <DateRange
            ranges={ [...range] }
            onChange={handleSelect}
            disabledDates={[]}
            minDate={new Date()}
            rangeColors={["rgba(34, 14, 103, 1)"]}
            />
          <div className={style.buttons_container}>
            <button onClick={handleClose}>Close</button>
            <button onClick={handleConfirm}>Confirm</button>
          </div>  
        </>
      }
    </div>
  )
}