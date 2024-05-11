"use client";
import Spinner from "@/components/spinner";
import { columns } from "@/components/tables/request-tables/columns";
import { RequestTable } from "@/components/tables/request-tables/request-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetRequests } from "@/hooks/api/useRequest";
import React, { useState } from "react";
type paramsProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const Request = ({ searchParams }: paramsProps) => {
  const page = Number(searchParams) || 1;
  const pageLimit = Number(searchParams) || 10;
  const [tab, setTab] = useState("active");

  const { data, isFetching } = useGetRequests(
    {
      limit: 10,
      page: 1,
      status: "pending",
    },
    {
      enabled: tab === "active",
    },
    "pending",
  );

  const { data: onProgressData, isFetching: isFetchingOnProgressData } =
    useGetRequests(
      {
        limit: 10,
        page: 1,
        status: "on_progress",
      },
      { enabled: tab === "active" },
      "on_progress",
    );

  const { data: completedData, isFetching: isFetchingCompletedData } =
    useGetRequests(
      {
        limit: 10,
        page: 1,
        status: "done",
      },
      { enabled: tab === "completed" },
      "done",
    );

  const concatData = [].concat(data?.data?.items, onProgressData?.data?.items);

  return (
    <div>
      <Tabs defaultValue={tab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" onClick={() => setTab("active")}>
            Active
          </TabsTrigger>
          <TabsTrigger value="completed" onClick={() => setTab("completed")}>
            Completed
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          {isFetching && isFetchingOnProgressData && <Spinner />}
          {!isFetching &&
            !isFetchingOnProgressData &&
            onProgressData?.data &&
            data?.data && (
              <RequestTable
                columns={columns}
                data={concatData}
                searchKey="name"
                totalUsers={data?.data?.meta?.total_items}
                pageCount={Math.ceil(data?.data?.meta?.total_items / pageLimit)}
                pageNo={page}
              />
            )}
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          {!isFetchingCompletedData && completedData?.data && (
            <RequestTable
              columns={columns}
              data={completedData?.data.items}
              searchKey="name"
              totalUsers={completedData?.data?.meta?.total_items}
              pageCount={Math.ceil(
                completedData?.data?.meta?.total_items / pageLimit,
              )}
              pageNo={page}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Request;
