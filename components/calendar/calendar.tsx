"use client";

import React, { useEffect, useRef } from "react";
import dayjs, { Dayjs } from "dayjs";

import LeftColumn from "./left-column";
import Header from "./header";

import "dayjs/locale/id";
import Tooltip from "./tooltip";

const Calendar = () => {
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

  const vehicles = [
    "Mobil A",
    "Mobil B",
    "Mobil C",
    "Mobil D",
    "Mobil E",
    "Mobil A",
    "Mobil E",
  ];

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
    <div
      className="overflow-auto border border-neutral-200 rounded-lg"
      ref={tableRef}
    >
      <div className="min-w-max">
        <div className="flex max-h-[400px]">
          <LeftColumn />

          <div className="flex-1">
            <Header dates={dates} />
            <div>
              {vehicles.map((_, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {dates.map((date) => {
                    const isCurrentDate = date.format("YYYY-MM-DD") === today;
                    const isLast = rowIndex === vehicles.length - 1;

                    return (
                      <div
                        key={date.format("YYYY-MM-DD")}
                        className={`border-r last:border-r-0 border-b border-gray-300 first:border-l-0 h-[64px] p-[12px] w-16 ${
                          isLast ? "border-b-0" : ""
                        }`}
                      >
                        <Tooltip type="date">
                          <div className="size-[40px] bg-red-100 rounded-lg" />
                        </Tooltip>

                        {/* {isCurrentDate && (
                          <div className="z-50 top-0 w-0.5 h-full bg-blue-600"></div>
                        )} */}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
