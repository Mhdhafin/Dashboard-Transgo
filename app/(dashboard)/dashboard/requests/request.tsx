"use client";
import Spinner from "@/components/spinner";
import {
  completedColumns,
  pendingColumns,
} from "@/components/tables/request-tables/columns";
import { RequestTable } from "@/components/tables/request-tables/request-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetRequests } from "@/hooks/api/useRequest";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
type paramsProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const Request = ({ searchParams }: paramsProps) => {
  const params = useSearchParams();
  const page = Number(searchParams) || 1;
  const pageLimit = Number(searchParams) || 10;
  const [tab, setTab] = useState("pending");
  const defaultTab = params.get("status") ?? tab;

  const { data: pendingData, isFetching: isFetchingPendingData } =
    useGetRequests(
      {
        limit: 30,
        page: page,
        status: "pending",
      },
      {
        enabled: defaultTab === "pending",
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
      { enabled: defaultTab === "on_progress" },
      "on_progress",
    );

  const { data: completedData, isFetching: isFetchingCompletedData } =
    useGetRequests(
      {
        limit: pageLimit,
        page: page,
        status: "done",
      },
      { enabled: defaultTab === "done" },
      "done",
    );

  return (
    <div>
      <Tabs defaultValue={defaultTab} className="space-y-4">
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
          {!isFetchingPendingData && pendingData?.data && (
            <RequestTable
              columns={pendingColumns}
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
              columns={completedColumns}
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
          {isFetchingCompletedData && <Spinner />}
          {!isFetchingCompletedData && completedData?.data && (
            <RequestTable
              columns={completedColumns}
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
