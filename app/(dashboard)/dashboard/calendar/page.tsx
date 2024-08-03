import React from "react";
import { Metadata } from "next";

import BreadCrumb from "@/components/breadcrumb";
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
      <Heading title="Calendar" />
    </div>
  );
};

export default page;
