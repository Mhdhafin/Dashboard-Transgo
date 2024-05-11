"use client";
import BreadCrumb from "@/components/breadcrumb";
import { RequestForm } from "@/components/forms/request-form";
import { useGetDetailRequest } from "@/hooks/api/useRequest";
import React from "react";

export default function Page({ params }: { params: { requestId: string } }) {
  const breadcrumbItems = [
    { title: "Requests", link: "/dashboard/requests" },
    { title: "Edit", link: "/dashboard/requests/edit" },
  ];

  const { data } = useGetDetailRequest(params?.requestId);

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <RequestForm
        initialData={data?.data}
        type={[
          { id: "delivery", name: "Delivery" },
          { id: "pick_up", name: "Pick Up" },
        ]}
      />
    </div>
  );
}
