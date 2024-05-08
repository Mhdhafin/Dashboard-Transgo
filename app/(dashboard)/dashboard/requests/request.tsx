"use client";
import Spinner from "@/components/spinner";
import { columns } from "@/components/tables/request-tables/columns";
import { RequestTable } from "@/components/tables/request-tables/request-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetRequests } from "@/hooks/api/useRequest";
import React from "react";
type paramsProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const Request = ({ searchParams }: paramsProps) => {
  const page = Number(searchParams) || 1;
  const pageLimit = Number(searchParams) || 10;

  const { data, isFetching } = useGetRequests({
    limit: 10,
    page: 1,
    status: "pending",
  });

  console.log("data", data);

  return (
    <div>
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          {isFetching && <Spinner />}
          {!isFetching && data?.data && (
            <RequestTable
              columns={columns}
              data={data?.data.items}
              searchKey="name"
              totalUsers={data?.data?.meta?.total_items}
              pageCount={Math.ceil(data?.data?.meta?.total_items / pageLimit)}
              pageNo={page}
            />
          )}
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          {!isFetching && data?.data && (
            <RequestTable
              columns={columns}
              data={data?.data.items}
              searchKey="name"
              totalUsers={data?.data?.meta?.total_items}
              pageCount={Math.ceil(data?.data?.meta?.total_items / pageLimit)}
              pageNo={page}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Request;
