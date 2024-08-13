"use client";
import Spinner from "@/components/spinner";
import { columns } from "@/components/tables/owner-tables/columns";
import { OwnerTable } from "@/components/tables/owner-tables/owner-table";
import { useGetOwners } from "@/hooks/api/useOwner";
import { useSearchParams } from "next/navigation";
import React from "react";

const Owner = () => {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const pageLimit = Number(searchParams.get("limit")) || 10;
  const q = searchParams.get("q") || "";

  const { data, isFetching } = useGetOwners({
    limit: pageLimit,
    page: page,
    q,
  });

  return (
    <>
      {isFetching && <Spinner />}
      {!isFetching && data?.data && (
        <OwnerTable
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

export default Owner;
