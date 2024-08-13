"use client";
import BreadCrumb from "@/components/breadcrumb";
import { OwnerForm } from "@/components/forms/owner-form";
import React from "react";
import { useGetDetailOwner } from "@/hooks/api/useOwner";
import { ScrollArea } from "@/components/ui/scroll-area";
import Spinner from "@/components/spinner";

export default function Page({ params }: { params: { ownerId: string } }) {
  const breadcrumbItems = [
    { title: "Owner", link: "/dashboard/owners" },
    { title: "Detail", link: "/dashboard/owners/detail" },
  ];

  const { data, isFetching } = useGetDetailOwner(params.ownerId);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <BreadCrumb items={breadcrumbItems} />
        {isFetching && <Spinner />}
        {!isFetching && data?.data && (
          <OwnerForm
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
