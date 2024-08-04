"use client";

import React, { useEffect, useRef } from "react";
import dayjs, { Dayjs } from "dayjs";

import LeftColumn from "./left-column";
import Header from "./header";

import "dayjs/locale/id";

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
    {
      name: "Mobil A",
      location: "Jakarta",
      usage: [],
    },
    {
      name: "Mobil B",
      location: "Surabaya",
      usage: [
        { start: "2024-08-04T08:00", end: "2024-08-05T12:30" },
        { start: "2024-08-07T09:00", end: "2024-08-08T14:00" },
      ],
    },
    {
      name: "Mobil C",
      location: "Bandung",
      usage: [],
    },
    {
      name: "Mobil D",
      location: "Medan",
      usage: [],
    },
    {
      name: "Mobil E",
      location: "Jakarta",
      usage: [],
    },
    {
      name: "Mobil F",
      location: "Makasar",
      usage: [
        { start: "2024-08-04T08:00", end: "2024-08-05T12:30" },
        { start: "2024-08-07T09:00", end: "2024-08-08T14:00" },
      ],
    },
    {
      name: "Mobil G",
      location: "Aceh",
      usage: [
        { start: "2024-08-04T08:00", end: "2024-08-05T12:30" },
        { start: "2024-08-07T09:00", end: "2024-08-08T14:00" },
      ],
    },
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

  const getDayOffset = (date: string) => {
    return dates.findIndex((d) => d.format("YYYY-MM-DD") === date);
  };

  const getTimeOffset = (startTime: Dayjs, endTime: Dayjs) => {
    const start = dayjs(startTime);
    const end = dayjs(endTime);
    const totalHours = end.diff(start, "hour", true);
    return totalHours;
  };

  return (
    <div
      className="overflow-auto border border-neutral-200 rounded-lg"
      ref={tableRef}
    >
      <div className="min-w-max">
        <div className="flex max-h-[400px]">
          <LeftColumn vehicles={vehicles} />

          <div className="flex-1">
            <Header dates={dates} />
            <div>
              {vehicles.map((vehicle, rowIndex) => (
                <div key={rowIndex} className="flex relative">
                  {dates.map((date) => {
                    const isCurrentDate = date.format("YYYY-MM-DD") === today;
                    const isLast = rowIndex === vehicles.length - 1;

                    return (
                      <div
                        key={date.format("YYYY-MM-DD")}
                        className={`relative border-r last:border-r-0 border-b border-gray-300 first:border-l-0 h-[64px] p-[12px] w-16 ${
                          isLast ? "border-b-0" : ""
                        }`}
                        data-date={date.format("YYYY-MM-DD")}
                      >
                        {isCurrentDate && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-0.5 h-full bg-blue-600"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {vehicle.usage.map((usage, usageIndex) => {
                    const startOffset = getDayOffset(usage.start.split("T")[0]);
                    const endOffset = getDayOffset(usage.end.split("T")[0]);
                    const startTime = dayjs(usage.start);
                    const endTime = dayjs(usage.end);
                    const totalHours = getTimeOffset(startTime, endTime);
                    const dayWidth = 64;
                    const boxHeight = 40;
                    const totalDays = endOffset - startOffset + 1;
                    const width =
                      (totalDays - 1) * dayWidth + (totalHours / 24) * dayWidth;

                    return (
                      <div
                        key={usageIndex}
                        className="absolute bg-green-200 rounded-lg"
                        style={{
                          top: 12,
                          left:
                            startOffset * dayWidth +
                            (startTime.hour() / 24) * dayWidth,
                          width: width,
                          height: boxHeight,
                        }}
                      >
                        <div className="flex items-center justify-center h-full">
                          {vehicle.name}
                        </div>
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
