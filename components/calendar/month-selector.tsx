"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "../ui/button";

import { MONTHS } from "./utils";
import { useMonthYearState } from "@/hooks/useMonthYearState";

const MonthSelector = () => {
  const { month, handleNextMonth, handlePrevMonth } = useMonthYearState();

  return (
    <div className="flex flex-row gap-1 items-center">
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={handlePrevMonth}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" className="h-8">
        {MONTHS[month - 1]}
      </Button>
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={handleNextMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MonthSelector;
