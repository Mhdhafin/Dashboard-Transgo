"use client";
import Spinner from "@/components/spinner";
import { columns } from "@/components/tables/fleet-tables/columns";
import { FleetTable } from "@/components/tables/fleet-tables/fleet-table";
import { useGetFleets } from "@/hooks/api/useFleet";
import { useSearchParams } from "next/navigation";
import React from "react";

const Fleet = () => {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const pageLimit = Number(searchParams.get('limit')) || 10;
  const q = searchParams.get('q') || '';

  const { data, isFetching } = useGetFleets({
    limit: pageLimit,
    page: page,
    q,
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
