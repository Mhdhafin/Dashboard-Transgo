import React from "react";

const LeftColumnItem = ({
  vehicle,
  isLast,
}: {
  vehicle: { name: string };
  isLast: boolean;
}) => {
  return (
    <div
      className={`w-full h-[64px] border-r border-b border-neutral-200 ${
        isLast ? "border-b-0" : ""
      }`}
    >
      <div className="flex flex-col gap-1 py-[11px] px-[20px]">
        <p className="text-neutral-900 font-medium text-[16px] leading-6">
          {vehicle.name}
        </p>
        <p className="text-neutral-700 font-medium text-[14px] leading-[14px]">
          Garasi TransGo
        </p>
      </div>
    </div>
  );
};

export default LeftColumnItem;
