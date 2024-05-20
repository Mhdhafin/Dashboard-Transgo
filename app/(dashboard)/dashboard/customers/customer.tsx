"use client";
import Spinner from "@/components/spinner";
import { columns } from "@/components/tables/customer-tables/columns";
import { CustomerTable } from "@/components/tables/customer-tables/customer-table";
import { useGetCustomers } from "@/hooks/api/useCustomer";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React from "react";
type paramsProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const Customer = () => {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const pageLimit = Number(searchParams.get('limit')) || 10;
  const q = searchParams.get('q') || '';

  const { data, isFetching } = useGetCustomers({
    limit: pageLimit,
    page: page,
    q,
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
