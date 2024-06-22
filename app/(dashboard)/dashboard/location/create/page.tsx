"use client";
import BreadCrumb from "@/components/breadcrumb";
import { LocationForm } from "@/components/forms/location-form";
import React from "react";

export default function Page() {
  const breadcrumbItems = [
    { title: "Location", link: "/dashboard/location" },
    { title: "Create", link: "/dashboard/location/create" },
  ];

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <LocationForm initialData={null} isEdit />
    </div>
  );
}
