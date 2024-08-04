import React from "react";
import { Metadata } from "next";

import BreadCrumb from "@/components/breadcrumb";
import MonthSelector from "@/components/calendar/month-selector";
import YearSelector from "@/components/calendar/year-selector";
import Calendar from "@/components/calendar/calendar";
import { Heading } from "@/components/ui/heading";

const BREAD_CRUMB_ITEMS = [{ title: "Calendar", link: "/dashboard/calendar" }];

export const metadata: Metadata = {
  title: "Calendar | Transgo",
  description: "Calendar page",
};

const page = () => {
  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={BREAD_CRUMB_ITEMS} />
      <div className="flex flex-row items-center justify-between">
        <Heading title="Calendar" />
        <div className="flex items-center gap-[10px]">
          <MonthSelector />
          <YearSelector />
        </div>
      </div>
      <Calendar />
    </div>
  );
};

export default page;
