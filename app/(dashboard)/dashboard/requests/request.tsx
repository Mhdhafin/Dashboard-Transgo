"use client";
import Spinner from "@/components/spinner";
import {
  completedColumns,
  pendingColumns,
} from "@/components/tables/request-tables/columns";
import { RequestTable } from "@/components/tables/request-tables/request-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetRequests } from "@/hooks/api/useRequest";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";

const Request = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const page = Number(searchParams.get("page")) || 1;
  const pageLimit = Number(searchParams.get("limit")) || 10;
  const q = searchParams.get("q") || "";

  const defaultTab = searchParams.get("status") ?? "pending";

  const { data: pendingData, isFetching: isFetchingPendingData } =
    useGetRequests(
      {
        limit: pageLimit,
        page: page,
        q: q,
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
        q: q,
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
        q: q,
        status: "done",
      },
      { enabled: defaultTab === "done" },
      "done",
    );

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  return (
    <div>
      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList>
          <TabsTrigger
            value="pending"
            onClick={() => {
              router.push(
                pathname + "?" + createQueryString("status", "pending"),
              );
            }}
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="on_progress"
            onClick={() => {
              router.push(
                pathname + "?" + createQueryString("status", "on_progress"),
              );
            }}
          >
            On Progress
          </TabsTrigger>
          <TabsTrigger
            value="done"
            onClick={() => {
              router.push(pathname + "?" + createQueryString("status", "done"));
            }}
          >
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
