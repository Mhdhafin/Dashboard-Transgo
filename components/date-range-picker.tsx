"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
interface CalendarDateRangePickerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onDateRangeChange: (range: any) => void;
  dateRange: any;
}

export const CalendarDateRangePicker: React.FC<
  CalendarDateRangePickerProps
> = ({ className, onDateRangeChange, dateRange }) => {
  const [date, setDate] = React.useState<DateRange>(dateRange);

  React.useEffect(() => {
    console.log("init", dateRange);
    setDate(dateRange);
  }, [dateRange]);

  const handleDateChange = (range: any) => {
    console.log("raange", range);
    setDate(range);
    onDateRangeChange(range);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal relative",
              !date && "text-muted-foreground",
            )}
          >
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pilih Tanggal</span>
            )}
            <div className="absolute right-0 ">
              <CalendarIcon className="mr-2 h-4 w-4" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
