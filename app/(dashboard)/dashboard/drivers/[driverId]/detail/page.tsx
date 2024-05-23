"use client";
import BreadCrumb from "@/components/breadcrumb";
import { DriverForm } from "@/components/forms/driver-form";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "next/navigation";
import { useGetDetailDriver } from "@/hooks/api/useDriver";
import { ScrollArea } from "@/components/ui/scroll-area";
import Spinner from "@/components/spinner";

export default function Page({ params }: { params: { driverId: string } }) {
  const breadcrumbItems = [
    { title: "Driver", link: "/dashboard/drivers" },
    { title: "Detail", link: "/dashboard/drivers/detail" },
  ];

  const { data, isFetching } = useGetDetailDriver(params.driverId);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <BreadCrumb items={breadcrumbItems} />
        {isFetching && <Spinner />}
        {!isFetching && data?.data && (
          <DriverForm
            categories={[
              { _id: "male", name: "Laki-laki" },
              { _id: "female", name: "Perempuan" },
            ]}
            initialData={{
              ...data?.data,
              file: data?.data?.id_photo
                ? { url: data?.data?.id_photo }
                : undefined,
            }}
            key={null}
          />
        )}
      </div>
    </ScrollArea>
  );
}
