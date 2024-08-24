"use client";

import React from "react";

import { formatRupiah } from "@/lib/utils";

import YearAndMonthSelector from "@/components/calendar/year-and-month-selector";
import { Heading } from "@/components/ui/heading";
import RecapTable from "@/components/tables/recap-tables/recap-table";
import { columns } from "@/components/tables/recap-tables/columns";
import useRecapsStore, { ITotal } from "@/hooks/components/useRecapsStore";
import { useMonthYearState } from "@/hooks/useMonthYearState";
import Spinner from "@/components/spinner";
import dayjs from "dayjs";

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
        <div className="flex flex-row items-center gap-5">
          <Heading title="Recap Pencatatan" />
          <CommissionAmount total={total} />
        </div>
        <YearAndMonthSelector withDateRange />
      </div>

      <RecapTable columns={columns} data={items} total={total} />
    </div>
  );
};

const CommissionAmount = ({ total }: { total: ITotal }) => (
  <div className="rounded-[8px] bg-blue-500 p-[8px_12px]">
    <h4 className="text-[20px] leading-7 font-semibold text-white">
      Komisi : {formatRupiah(total?.commission)}
    </h4>
  </div>
);

export default Page;
