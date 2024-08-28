import React from "react";

import DateRangeSelector from "./date-range-selector";
import MonthSelector from "./month-selector";
import YearSelector from "./year-selector";
import InputSearch from "./input-search";

const YearAndMonthSelector = ({
  withDateRange = false,
  withSearch = false,
}) => {
  return (
    <div className="flex items-center gap-[10px]">
      {withSearch && <InputSearch />}
      {withDateRange && <DateRangeSelector />}
      <MonthSelector />
      <YearSelector />
    </div>
  );
};

export default YearAndMonthSelector;
