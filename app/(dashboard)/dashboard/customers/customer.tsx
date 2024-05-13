"use client";
import Spinner from "@/components/spinner";
import { columns } from "@/components/tables/customer-tables/columns";
import { CustomerTable } from "@/components/tables/customer-tables/customer-table";
import { useGetCustomers } from "@/hooks/api/useCustomer";
import React from "react";
type paramsProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const Customer = ({ searchParams }: paramsProps) => {
  const page = Number(searchParams) || 1;
  const pageLimit = Number(searchParams) || 10;

  const { data, isFetching } = useGetCustomers({
    limit: 10,
    page: 1,
  });

  return (
    <div>
      {isFetching && <Spinner />}
      {!isFetching && data?.data && (
        <CustomerTable
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

export default Customer;
