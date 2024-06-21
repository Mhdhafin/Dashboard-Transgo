"use client";
import Spinner from "@/components/spinner";
import { columns } from "@/components/tables/driver-tables/columns";
import { DriverTable } from "@/components/tables/driver-tables/driver-table";
import { useGetDrivers } from "@/hooks/api/useDriver";
import { useSearchParams } from "next/navigation";
import React from "react";
type paramsProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const Driver = () => {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const pageLimit = Number(searchParams.get("limit")) || 10;
  const q = searchParams.get("q") || "";

  const { data, isFetching } = useGetDrivers({
    limit: pageLimit,
    page: page,
    q,
  });

  return (
    <>
      {isFetching && <Spinner />}
      {!isFetching && data?.data && (
        <DriverTable
          columns={columns}
          data={data?.data?.items}
          searchKey="name"
          totalUsers={data?.data?.meta?.total_items}
          pageCount={Math.ceil(data?.data?.meta?.total_items / pageLimit)}
          pageNo={page}
        />
      )}
    </>
  );
};

export default Driver;
