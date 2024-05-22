"use client";
import BreadCrumb from "@/components/breadcrumb";
import { CustomerForm } from "@/components/forms/customer-form";
import Spinner from "@/components/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetDetailCustomer } from "@/hooks/api/useCustomer";
import React from "react";

export default function Page({ params }: { params: { customerId: string } }) {
  const breadcrumbItems = [
    { title: "Customers", link: "/dashboard/customers" },
    { title: "Edit", link: "/dashboard/customers/edit" },
  ];

  const { data, isFetching } = useGetDetailCustomer(params.customerId);
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        {isFetching && <Spinner />}
        {!isFetching && data?.data && (
          <CustomerForm
            categories={[
              { _id: "male", name: "Laki-laki" },
              { _id: "female", name: "Perempuan" },
            ]}
            initialData={{
              ...data?.data,
              file: data?.data?.id_photo
                ? {
                    url: data?.data?.id_photo,
                  }
                : undefined,
            }}
            isEdit
          />
        )}
      </div>
    </ScrollArea>
  );
}
