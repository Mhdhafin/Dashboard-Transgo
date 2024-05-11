"use client";
import Spinner from "@/components/spinner";
import { columns } from "@/components/tables/fleet-tables/columns";
import { FleetTable } from "@/components/tables/fleet-tables/fleet-table";
import { useGetFleets } from "@/hooks/api/useFleet";
import React from "react";
type paramsProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const Fleet = ({ searchParams }: paramsProps) => {
  const page = Number(searchParams) || 1;
  const pageLimit = Number(searchParams) || 10;

  const { data, isFetching } = useGetFleets({
    limit: 10,
    page: 1,
  });

  return (
    <div>
      {isFetching && <Spinner />}
      {!isFetching && data?.data && (
        <FleetTable
          columns={columns}
          data={data?.data?.items}
          searchKey="name"
          totalUsers={data?.data?.meta?.total_items}
          pageCount={Math.ceil(data?.data?.meta?.total_items / pageLimit)}
          pageNo={page}
        />
      )}
    </div>
  );
};

export default Fleet;
