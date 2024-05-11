"use client";
import Spinner from "@/components/spinner";
import { columns } from "@/components/tables/driver-tables/columns";
import { DriverTable } from "@/components/tables/driver-tables/driver-table";
import { useGetDrivers } from "@/hooks/api/useDriver";
import React from "react";
type paramsProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const Driver = ({ searchParams }: paramsProps) => {
  const page = Number(searchParams) || 1;
  const pageLimit = Number(searchParams) || 10;

  const { data, isFetching } = useGetDrivers({
    limit: 10,
    page: 1,
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
