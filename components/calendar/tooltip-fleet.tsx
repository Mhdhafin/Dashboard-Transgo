import React from "react";
import { HoverCardContent } from "../ui/hover-card";
import { formatRupiah } from "@/lib/utils";

const TooltipFleet = () => {
  return (
    <HoverCardContent className="w-full h-[108px] p-0">
      <div className="flex flex-row gap-[16px]">
        <div className="size-[100px]">
          <img
            className="w-full h-full rounded-lg object-contain"
            src="https://images.unsplash.com/photo-1515569067071-ec3b51335dd0?q=80&w=2738&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
        </div>
        <div className="flex flex-col gap-[10px]">
          <p className="text-[18px] font-semibold leading-5">
            Lamborghini Huracán
          </p>
          <div className="flex flex-col">
            <p className="text-[14px] font-semibold leading-5">{`${formatRupiah(
              100000,
            )}/ hari`}</p>
            <p className="text-[14px] font-normal leading-5">Garasi TransGo</p>
          </div>
        </div>
      </div>
    </HoverCardContent>
  );
};

export default TooltipFleet;
