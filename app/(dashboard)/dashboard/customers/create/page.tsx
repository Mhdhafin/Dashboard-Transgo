"use client";
import BreadCrumb from "@/components/breadcrumb";
import { CustomerForm } from "@/components/forms/customer-form";
import React from "react";

export default function Page() {
  const breadcrumbItems = [
    { title: "Customers", link: "/dashboard/customers" },
    { title: "Create", link: "/dashboard/customers/create" },
  ];

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <CustomerForm
        categories={[
          { _id: "male", name: "Laki-laki" },
          { _id: "female", name: "Perempuan" },
        ]}
        initialData={null}
        key={null}
        isEdit
      />
    </div>
  );
}
