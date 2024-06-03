"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import styles from './Calendar.module.css';
import 'react-calendar/dist/Calendar.css';

const ScheduleCalendar = ({date,setDate}:{date:Date,setDate:any}) => {

  const onChange = (date: any) => {
    setDate(date);
  };

  const minDate = new Date(2024, 0, 1); // January 1, 2023
  const maxDate = new Date(2024, 11, 31); // December 31, 2023

  return (
    <div className={styles.calendarContainer}>
      <Calendar
        onChange={onChange}
        value={date}
        view="month"
        maxDetail="month"
        minDate={minDate}
        maxDate={maxDate}
        next2Label={null}
        prev2Label={null}
        className={styles.reactCalendar}
      />
    </div>
  );
};

export default ScheduleCalendar;
