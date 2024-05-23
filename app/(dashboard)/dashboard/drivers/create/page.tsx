"use client";
import BreadCrumb from "@/components/breadcrumb";
import { DriverForm } from "@/components/forms/driver-form";
import React from "react";

export default function Page() {
  const breadcrumbItems = [
    { title: "Driver", link: "/dashboard/drivers" },
    { title: "Create", link: "/dashboard/drivers/create" },
  ];

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <DriverForm
        categories={[
          { _id: "male", name: "Laki-laki" },
          { _id: "female", name: "Perempuan" },
        ]}
        initialData={null}
        isEdit
      />
    </div>
  );
}
