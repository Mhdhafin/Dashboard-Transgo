"use client";

import React, { useEffect, useRef } from "react";
import dayjs, { Dayjs } from "dayjs";

import useCalendarViewStore from "@/hooks/components/useCalendarViewStore";

import LeftColumn from "./left-column";
import Header from "./header";
import Tooltip from "./tooltip";
import Spinner from "../spinner";

const Calendar = () => {
  const { calendarData, isFetching } = useCalendarViewStore({
    month: "08",
    year: "2024",
  });

  const now = dayjs();
  const start = now.startOf("month");
  const end = now.endOf("month");
  const dates: Dayjs[] = [];
  const today = dayjs().format("YYYY-MM-DD");

  console.log("🚀 ~ Calendar ~ calendarData:", calendarData);

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

  const getDayOffset = (date: string) => {
    return dates.findIndex((d) => d.format("YYYY-MM-DD") === date);
  };

  const getTimeOffset = (startTime, endTime) => {
    const start = startTime;
    const end = endTime;
    const totalHours = end.diff(start, "hour", true);
    return totalHours;
  };

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
            <div>
              {calendarData.map((vehicle, rowIndex) => (
                <div key={rowIndex} className="flex relative">
                  {dates.map((date) => {
                    const isCurrentDate = date.format("YYYY-MM-DD") === today;
                    const isLast = rowIndex === calendarData.length - 1;

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
                    const startTime = usage.start;
                    const endTime = usage.end;
                    const startOffset = getDayOffset(
                      startTime.format("YYYY-MM-DD"),
                    );
                    // const endOffset = getDayOffset(
                    //   endTime.format("YYYY-MM-DD"),
                    // );
                    const totalHours = getTimeOffset(startTime, endTime);
                    const dayWidth = 64;
                    const boxHeight = 40;
                    // const totalDays = endOffset - startOffset + 1;
                    const width = (totalHours / 24) * dayWidth;

                    return (
                      <div
                        className="absolute hover:border hover:border-green-900 bg-green-200 rounded-lg"
                        key={usageIndex}
                        style={{
                          top: 12,
                          left:
                            startOffset * dayWidth +
                            (startTime.hour() / 24) * dayWidth,
                          width: width,
                          height: boxHeight,
                        }}
                      >
                        <Tooltip type="date">
                          <div className="flex p-[10px] items-center justify-center h-full w-full">
                            <span className="truncate leading-5 font-medium text-[12px] text-green-900">
                              {usage.title}
                            </span>
                          </div>
                        </Tooltip>
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
