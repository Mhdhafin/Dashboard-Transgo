"use client";

import React, { useEffect, useRef } from "react";
import dayjs, { Dayjs } from "dayjs";

import useCalendarViewStore from "@/hooks/components/useCalendarViewStore";

import LeftColumn from "./left-column";
import Header from "./header";
import Spinner from "../spinner";
import Grid from "./grid";
import { useMonthYearState } from "@/hooks/useMonthYearState";

const Calendar = () => {
  const { month, year } = useMonthYearState();

  const { calendarData, isFetching } = useCalendarViewStore({
    month: month.toString(),
    year: year.toString(),
  });

  const now = dayjs();
  const start = now.startOf("month");
  const end = now.endOf("month");
  const dates: Dayjs[] = [];
  const today = dayjs().format("YYYY-MM-DD");

  for (
    let date = start;
    date.isBefore(end) || date.isSame(end, "day");
    date = date.add(1, "day")
  ) {
    dates.push(date);
  }

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const todayColumn = document.querySelector(
      `[data-date='${today}']`,
    ) as HTMLElement;
    if (todayColumn && tableRef.current) {
      const offsetLeft = todayColumn.offsetLeft;
      const containerWidth = tableRef.current.offsetWidth;
      tableRef.current.scrollLeft =
        offsetLeft - containerWidth / 2 + todayColumn.offsetWidth / 2;
    }
  }, [today]);

  if (isFetching) {
    return <Spinner className="w-6 h-6" />;
  }

  return (
    <div
      className="overflow-auto border border-neutral-200 rounded-lg"
      ref={tableRef}
    >
      <div className="min-w-max">
        <div className="flex max-h-[400px]">
          <LeftColumn vehicles={calendarData} />

          <div className="flex-1">
            <Header dates={dates} />
            <Grid dates={dates} data={calendarData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
