"use client";
import BreadCrumb from "@/components/breadcrumb";
import { LocationForm } from "@/components/forms/location-form";
import Spinner from "@/components/spinner";
import { useGetDetailLocation } from "@/hooks/api/useLocation";
import React from "react";

export default function Page({ params }: { params: { locationId: number } }) {
  const breadcrumbItems = [
    { title: "Location", link: "/dashboard/location" },
    { title: "Detail", link: "/dashboard/location/detail" },
  ];

  const { data, isFetching } = useGetDetailLocation(params.locationId);
  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      {isFetching && <Spinner />}
      {!isFetching && data?.data && <LocationForm initialData={data.data} />}
    </div>
  );
}
