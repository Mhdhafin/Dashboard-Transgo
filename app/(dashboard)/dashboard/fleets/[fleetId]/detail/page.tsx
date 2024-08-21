"use client";

import React from "react";

import { useGetDetailFleet } from "@/hooks/api/useFleet";

import BreadCrumb from "@/components/breadcrumb";
import { FleetForm } from "@/components/forms/fleet-form";
import Spinner from "@/components/spinner";
import CashFlowTable from "@/components/tables/cash-flow-tables/cash-flow-table";
import { columns } from "@/components/tables/cash-flow-tables/columns";

export default function Page({ params }: { params: { fleetId: number } }) {
  const breadcrumbItems = [
    { title: "Fleets", link: "/dashboard/fleets" },
    { title: "Detail", link: "/dashboard/fleets/detail" },
  ];

  const { data, isFetching } = useGetDetailFleet(params.fleetId);

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      {isFetching && <Spinner />}
      {!isFetching && data?.data && (
        <FleetForm
          initialData={data.data}
          key={null}
          type={[
            { id: "motorcycle", name: "Motor" },
            { id: "car", name: "Mobil" },
          ]}
        />
      )}

      <CashFlowTable
        columns={columns}
        data={[
          {
            id: 1,
            name: "",
            status: "",
            email: "",
            date_of_birth: "",
            nik: "",
            role: "",
            id_photo: "",
            gender: "",
            phone_number: "",
            emergency_phone_number: "",
          },
        ]}
        pageCount={0}
      />
    </div>
  );
}
