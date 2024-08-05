import React from "react";

import { HoverCardContent } from "../ui/hover-card";

import { ICalendarData } from "./types";

const TooltipFleet = ({ data }: { data: ICalendarData }) => {
  return (
    <HoverCardContent align="start" className="w-full h-full p-0">
      <div className="flex flex-row items-center gap-[12px]">
        <div className="size-[100px] p-[4px]">
          <img
            className="w-full h-full rounded-lg object-cover"
            src={data.image}
            alt={data.name}
          />
        </div>
        <div className="flex flex-col gap-[10px] mr-[16px]">
          <p className="text-[18px] font-semibold leading-5">{data.name}</p>
          <div className="flex flex-col gap-[2px]">
            <p className="text-[14px] font-semibold leading-5">
              {data.price} / hari
            </p>
            <p className="text-[14px] font-normal leading-5">{data.location}</p>
          </div>
        </div>
      </div>
    </HoverCardContent>
  );
};

export default TooltipFleet;
