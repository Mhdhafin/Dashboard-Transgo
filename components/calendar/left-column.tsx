import React from "react";
import LeftColumnItem from "./left-column-item";

const LeftColumn = () => {
  const vehicles = [
    "Mobil A",
    "Mobil B",
    "Mobil C",
    "Mobil D",
    "Mobil E",
    "Mobil A",
    "Mobil B",
  ];

  return (
    <div className="left-0 sticky z-50 bg-white">
      <div className="sticky left-0 bg-white w-[180px]">
        <div className="top-0 sticky border-b border-r border-neutral-200 h-[50px] flex w-full bg-white z-[3]">
          <p className="flex items-center py-[12px] px-[20px] text-neutral-700 font-medium text-[14px] leading-6">
            Nama Kendaraan
          </p>
        </div>

        {vehicles.map((vehicle, index) => (
          <LeftColumnItem key={index} isLast={index === vehicles.length - 1} />
        ))}
      </div>
    </div>
  );
};

export default LeftColumn;
