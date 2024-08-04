"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useInView } from "react-intersection-observer";

import useCalendarViewStore from "@/hooks/components/useCalendarViewStore";

import LeftColumn from "./left-column";
import Header from "./header";
import Spinner from "../spinner";
import Grid from "./grid";
import { useMonthYearState } from "@/hooks/useMonthYearState";
import { ScrollArea } from "../ui/scroll-area";

const Calendar = () => {
  const { month, year } = useMonthYearState();
  const [pageParam, setPageParam] = useState("1");

  const {
    calendarData,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useCalendarViewStore({
    month: month.toString(),
    year: year.toString(),
    page: pageParam,
  });

  useEffect(() => {
    setPageParam("1");
  }, [month, year]);

  // const { ref, inView } = useInView();

  // useEffect(() => {
  //   if (inView && hasNextPage) {
  //     fetchNextPage();
  //   }
  // }, [inView, hasNextPage, fetchNextPage]);

  const observer = useRef();
  const lastItemRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer && observer.current && observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage],
  );

  const now = dayjs(`${year}-${month}-01`);
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

  return (
    <ScrollArea
      className="border border-neutral-200 rounded-lg h-[calc(100vh-220px)]"
      ref={tableRef}
    >
      <div className="flex max-h-screen">
        <LeftColumn vehicles={calendarData} />

        <div className="flex-1">
          <Header dates={dates} />
          <Grid dates={dates} data={calendarData} />
          <div ref={lastItemRef} className="h-1" />
        </div>
      </div>
    </ScrollArea>
  );
};

export default Calendar;
