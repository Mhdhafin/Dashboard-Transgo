import React from "react";
import dayjs, { Dayjs } from "dayjs";

import Tooltip from "./tooltip";
import { ORDER_STATUS } from "./utils";
import { ICalendarData } from "./types";

const Grid = ({
  dates,
  data,
}: {
  dates: dayjs.Dayjs[];
  data: ICalendarData[];
}) => {
  const today = dayjs().format("YYYY-MM-DD");

  const getDayOffset = (date: string) => {
    return dates.findIndex((d) => d.format("YYYY-MM-DD") === date);
  };

  const getTimeOffset = (startTime: Dayjs, endTime: Dayjs) => {
    const start = startTime;
    const end = endTime;
    const totalHours = end.diff(start, "hour", true);
    return totalHours;
  };

  const handleOrderClick = (orderStatus: string, orderId: string | number) => {
    const url = ["pending", "waiting"].includes(orderStatus)
      ? `/dashboard/orders/${orderId}/preview`
      : `/dashboard/orders/${orderId}/detail`;

    window.open(url);
  };

  return (
    <>
      {data.map((vehicle, rowIndex) => (
        <div key={rowIndex} className="flex relative">
          {dates.map((date, colIndex) => {
            const isCurrentDate = date.format("YYYY-MM-DD") === today;
            const isLastRow = rowIndex === data.length - 1;
            const isLastColumn = colIndex === dates.length - 1;

            return (
              <div
                key={date.format("YYYY-MM-DD")}
                className={`relative border-gray-300 first:border-l-0 h-[64px] p-[12px] w-16 ${
                  isLastRow ? "border-b-0" : "border-b"
                } ${isCurrentDate ? "bg-neutral-50" : ""} ${
                  isLastColumn ? "border-r-0" : "border-r"
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
          {vehicle.usage.map((usage, usageIndex: number) => {
            const startTime = usage.start;
            const endTime = usage.end;
            const startOffset = getDayOffset(startTime.format("YYYY-MM-DD"));
            const endOffset = getDayOffset(endTime.format("YYYY-MM-DD"));

            const totalHours = getTimeOffset(startTime, endTime);
            const dayWidth = 64;
            const boxHeight = 40;

            let width;
            if (startOffset === -1) {
              return;
            } else if (endOffset === -1) {
              const endOfMonth = startTime.endOf("month");
              const hoursInCurrentMonth = endOfMonth.diff(
                startTime,
                "hour",
                true,
              );
              width = (hoursInCurrentMonth / 24) * dayWidth;
            } else {
              width = (totalHours / 24) * dayWidth;
            }

            return (
              <div
                className={`absolute rounded-lg ${ORDER_STATUS[
                  usage.orderStatus
                ]?.bgColor} ${ORDER_STATUS[usage.orderStatus]?.border} `}
                key={usageIndex}
                style={{
                  top: 12,
                  left:
                    startOffset * dayWidth + (startTime.hour() / 24) * dayWidth,
                  width: width,
                  height: boxHeight,
                }}
              >
                <Tooltip type="date" data={usage}>
                  <div
                    className="flex p-[10px] cursor-pointer items-center justify-center h-full w-full"
                    onClick={() =>
                      handleOrderClick(usage.orderStatus, usage.id)
                    }
                  >
                    <span
                      className={`truncate leading-5 font-medium text-[12px] ${ORDER_STATUS[
                        usage.orderStatus || "pending"
                      ]?.color}`}
                    >
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
