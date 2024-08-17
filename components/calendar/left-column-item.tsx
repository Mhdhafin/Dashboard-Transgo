import React from "react";

import Tooltip from "./tooltip";

import { ICalendarData } from "./types";

const WrapperColumnItem = ({
  children,
  isLast,
}: {
  children?: React.ReactNode;
  isLast: boolean;
}) => {
  return (
    <div
      className={`w-full h-[64px] border-r border-b border-neutral-200 ${
        isLast ? "border-b-0" : ""
      }`}
    >
      {children}
    </div>
  );
};

const LeftColumnItem = ({
  vehicle,
  isLast,
}: {
  vehicle: ICalendarData;
  isLast: boolean;
}) => {
  if (vehicle.id === "") {
    return <WrapperColumnItem isLast={isLast} />;
  }

  return (
    <Tooltip type="fleet" data={vehicle}>
      <WrapperColumnItem isLast={isLast}>
        <div className="flex flex-col gap-1 py-[11px] px-[20px]">
          <p className="text-neutral-900 font-medium truncate text-[16px] leading-6">
            {vehicle.name}
          </p>
          <p className="text-neutral-700 font-medium text-[14px] leading-[14px] truncate">
            {vehicle.location}
          </p>
        </div>
      </WrapperColumnItem>
    </Tooltip>
  );
};

export default LeftColumnItem;
