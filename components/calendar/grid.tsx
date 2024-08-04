import React from "react";
import dayjs from "dayjs";

import Tooltip from "./tooltip";

const Grid = ({ dates, data }: { dates: dayjs.Dayjs[] }) => {
  const today = dayjs().format("YYYY-MM-DD");

  const getDayOffset = (date: string) => {
    return dates.findIndex((d) => d.format("YYYY-MM-DD") === date);
  };

  const getTimeOffset = (startTime, endTime) => {
    const start = startTime;
    const end = endTime;
    const totalHours = end.diff(start, "hour", true);
    return totalHours;
  };

  return (
    <>
      {data.map((vehicle, rowIndex) => (
        <div key={rowIndex} className="flex relative">
          {dates.map((date) => {
            const isCurrentDate = date.format("YYYY-MM-DD") === today;
            const isLast = rowIndex === data.length - 1;

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
                    <div className="w-0.5 z-20 h-full bg-blue-600"></div>
                  </div>
                )}
              </div>
            );
          })}
          {vehicle.usage.map((usage, usageIndex) => {
            const startTime = usage.start;
            const endTime = usage.end;
            const startOffset = getDayOffset(startTime.format("YYYY-MM-DD"));
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
                    startOffset * dayWidth + (startTime.hour() / 24) * dayWidth,
                  width: width,
                  height: boxHeight,
                }}
              >
                <Tooltip type="date">
                  <div
                    className="flex p-[10px] cursor-pointer items-center justify-center h-full w-full"
                    onClick={() =>
                      window.open(`/dashboard/orders/${usage.id}/detail`)
                    }
                  >
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
    </>
  );
};

export default Grid;
