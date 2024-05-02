"use client";
import { getDrivers } from "@/client/driverClient";
import { columns } from "@/components/tables/driver-tables/columns";
import { DriverTable } from "@/components/tables/driver-tables/driver-table";
import { useGetDriver } from "@/hooks/api/useDriver";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React from "react";

const Driver = () => {
  const { data: session } = useSession();

  const { data, isFetching } = useGetDriver({
    limit: 10,
    page: 1,
  });
  console.log(data);

  return (
    <div>
      {isFetching && <h1>loadinggg</h1>}
      {!isFetching && (
        <DriverTable
          columns={columns}
          data={data?.data?.items}
          searchKey="name"
        />
      )}
    </div>
  );
};

export default Driver;
