"use client";
import BreadCrumb from "@/components/breadcrumb";
import { DriverForm } from "@/components/forms/driver-form";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "next/navigation";
import { useGetDetailDriver } from "@/hooks/api/useDriver";

export default function Page({ params }: { params: { driverId: string } }) {
  const breadcrumbItems = [
    { title: "Driver", link: "/dashboard/driver" },
    { title: "Edit", link: "/dashboard/driver/edit" },
  ];

  // const { driverId } = useParams();

  const { data, isFetching } = useGetDetailDriver(params.driverId);
  console.log("data", data);

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      {isFetching && <h1>loadingg</h1>}
      {!isFetching && data?.data && (
        <DriverForm
          categories={[
            { _id: "male", name: "Male" },
            { _id: "female", name: "Female" },
          ]}
          initialData={data?.data}
          key={null}
        />
      )}
    </div>
  );
}
