"use client";
import BreadCrumb from "@/components/breadcrumb";
import { OwnerForm } from "@/components/forms/owner-form";
import React from "react";

export default function Page() {
  const breadcrumbItems = [
    { title: "Owner", link: "/dashboard/owners" },
    { title: "Create", link: "/dashboard/owners/create" },
  ];

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <OwnerForm
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
