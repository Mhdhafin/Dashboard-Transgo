"use client";

import React from "react";

import { useMonthYearState } from "@/hooks/useMonthYearState";

import { CalendarDateRangePicker } from "../date-range-picker";

const DateRangeSelector = () => {
  const { dateRange, setDateRange, handleClearDate } = useMonthYearState();

  return (
    <CalendarDateRangePicker
      onDateRangeChange={setDateRange}
      onClearDate={handleClearDate}
      dateRange={dateRange}
      numberOfMonths={1}
      showOutsideDays={false}
      disableNavigation
    />
  );
};

export default DateRangeSelector;
