"use client";
import BreadCrumb from "@/components/breadcrumb";
import { RequestForm } from "@/components/forms/request-form";
import React from "react";

export default function Page() {
  const breadcrumbItems = [
    { title: "Requests Tasks", link: "/dashboard/requests" },
    { title: "Create", link: "/dashboard/requests/create" },
  ];

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <RequestForm initialData={null} isEdit />
    </div>
  );
}
