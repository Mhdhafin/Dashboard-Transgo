"use client";
import BreadCrumb from "@/components/breadcrumb";
import { DriverForm } from "@/components/forms/driver-form";
import React from "react";

export default function Page() {
  const breadcrumbItems = [
    { title: "Driver", link: "/dashboard/driver" },
    { title: "Create", link: "/dashboard/driver/create" },
  ];

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <DriverForm
        categories={[
          { _id: "male", name: "Male" },
          { _id: "female", name: "Female" },
        ]}
        initialData={null}
        key={null}
      />
    </div>
  );
}
