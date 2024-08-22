import React from "react";

import DateRangeSelector from "./date-range-selector";
import MonthSelector from "./month-selector";
import YearSelector from "./year-selector";

const YearAndMonthSelector = ({ withDateRange = false }) => {
  return (
    <div className="flex items-center gap-[10px]">
      {withDateRange && <DateRangeSelector />}
      <MonthSelector />
      <YearSelector />
    </div>
  );
};

export default YearAndMonthSelector;
