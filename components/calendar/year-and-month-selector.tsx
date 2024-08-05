import React from "react";

import MonthSelector from "./month-selector";
import YearSelector from "./year-selector";

const YearAndMonthSelector = () => {
  return (
    <div className="flex items-center gap-[10px]">
      <MonthSelector />
      <YearSelector />
    </div>
  );
};

export default YearAndMonthSelector;
