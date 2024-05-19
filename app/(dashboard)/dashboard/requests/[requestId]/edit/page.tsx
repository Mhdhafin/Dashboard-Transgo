"use client";
import BreadCrumb from "@/components/breadcrumb";
import { RequestForm } from "@/components/forms/request-form";
import Spinner from "@/components/spinner";
import { useGetDetailRequest } from "@/hooks/api/useRequest";
import React from "react";

export default function Page({ params }: { params: { requestId: string } }) {
  const breadcrumbItems = [
    { title: "Requests", link: "/dashboard/requests" },
    { title: "Edit", link: "/dashboard/requests/edit" },
  ];

  const { data, isFetching } = useGetDetailRequest(params?.requestId);

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      {isFetching && <Spinner />}
      {!isFetching && data?.data && (
        <RequestForm initialData={data?.data} isEdit />
      )}
    </div>
  );
}
