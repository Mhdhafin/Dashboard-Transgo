"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "../ui/button";
import { useMonthYearState } from "@/hooks/useMonthYearState";

const YearSelector = () => {
  const { year, handleNextYear, handlePrevYear } = useMonthYearState();

  return (
    <div className="flex flex-row gap-1 items-center">
      <Button variant="outline" className="size-9 p-0" onClick={handlePrevYear}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" className="h-9">
        {year}
      </Button>
      <Button variant="outline" className="size-9 p-0" onClick={handleNextYear}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default YearSelector;
