"use client";

import React from "react";

import YearAndMonthSelector from "@/components/calendar/year-and-month-selector";
import { Heading } from "@/components/ui/heading";
import { columns } from "@/components/tables/recap-tables/columns";
import useRecapsStore from "@/hooks/components/useRecapsStore";
import { useMonthYearState } from "@/hooks/useMonthYearState";
import Spinner from "@/components/spinner";
import dayjs from "dayjs";
import RecapTable from "@/components/tables/recap-tables/recap-table";

const Page = () => {
  const { month, year, dateRange } = useMonthYearState();

  const { items, total, isFetching } = useRecapsStore({
    month: month,
    year: year,
    ...(dateRange?.from &&
      dateRange?.to && {
        start_date: dayjs(dateRange.from).format("YYYY-MM-DD"),
        end_date: dayjs(dateRange.to).format("YYYY-MM-DD"),
      }),
  });

  if (isFetching) {
    return <Spinner className="mt-6" />;
  }

  return (
    <div className="flex-1 space-y-5 p-4 md:p-8 pt-6">
      <div className="flex flex-row items-center justify-between">
        <Heading title="Recap Pencatatan" />
        <YearAndMonthSelector withDateRange />
      </div>

      <RecapTable columns={columns} data={items} total={total} />
    </div>
  );
};

export default Page;
