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
  console.log("search", searchParams);
  const page = Number(searchParams) || 1;
  const pageLimit = Number(searchParams) || 10;
  const [tab, setTab] = useState("pending");

  const { data: pendingData, isFetching: isFetchingPendingData } =
    useGetRequests(
      {
        limit: 30,
        page: page,
        status: "pending",
      },
      {
        enabled: tab === "pending",
      },
      "pending",
    );

  const { data: onProgressData, isFetching: isFetchingOnProgressData } =
    useGetRequests(
      {
        limit: pageLimit,
        page: page,
        status: "on_progress",
      },
      { enabled: tab === "on_progress" },
      "on_progress",
    );

  const { data: completedData, isFetching: isFetchingCompletedData } =
    useGetRequests(
      {
        limit: pageLimit,
        page: page,
        status: "done",
      },
      { enabled: tab === "done" },
      "done",
    );

  return (
    <div>
      <Tabs defaultValue={tab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" onClick={() => setTab("pending")}>
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="on_progress"
            onClick={() => setTab("on_progress")}
          >
            On Progress
          </TabsTrigger>
          <TabsTrigger value="done" onClick={() => setTab("done")}>
            Done
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="space-y-4">
          {isFetchingPendingData && <Spinner />}
          {!isFetchingPendingData &&
            !isFetchingOnProgressData &&
            pendingData?.data && (
              <RequestTable
                columns={columns}
                data={pendingData?.data?.items}
                searchKey="customer.name"
                totalUsers={pendingData?.data?.meta?.total_items}
                pageCount={Math.ceil(
                  pendingData?.data?.meta?.total_items / pageLimit,
                )}
                pageNo={page}
              />
            )}
        </TabsContent>
        <TabsContent value="on_progress" className="space-y-4">
          {isFetchingOnProgressData && <Spinner />}
          {!isFetchingOnProgressData && onProgressData?.data && (
            <RequestTable
              columns={columns}
              data={onProgressData?.data?.items}
              searchKey="customer.name"
              totalUsers={onProgressData?.data?.meta?.total_items}
              pageCount={Math.ceil(
                onProgressData?.data?.meta?.total_items / pageLimit,
              )}
              pageNo={page}
            />
          )}
        </TabsContent>
        <TabsContent value="done" className="space-y-4">
          {!isFetchingCompletedData && completedData?.data && (
            <RequestTable
              columns={columns}
              data={completedData?.data.items}
              searchKey="customer.name"
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
