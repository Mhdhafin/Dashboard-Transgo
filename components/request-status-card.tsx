"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Spinner from "./spinner";
import { Activity, Clock3 } from "lucide-react";
import { useRequestsStatusCount } from "@/hooks/api/useRequest";
import Link from "next/link";

const RequestStatusCard = () => {
  const { data: statusCount, isFetching } = useRequestsStatusCount();

  const count = statusCount?.data;

  return (
    <>
      {isFetching && (
        <div className="absolute w-full">
          <Spinner />
        </div>
      )}
      {!isFetching && count && (
        <>
          <Link
            href={{
              pathname: "/dashboard/requests",
              query: { status: "pending" },
            }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Task Pending
                </CardTitle>
                <Clock3 />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{`${
                  count?.pending ?? "0"
                }`}</div>
              </CardContent>
            </Card>
          </Link>
          <Link
            href={{
              pathname: "/dashboard/requests",
              query: { status: "on_progress" },
            }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Task On Progress
                </CardTitle>
                <Activity />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{`${
                  count.on_progress ?? 0
                }`}</div>
              </CardContent>
            </Card>
          </Link>
        </>
      )}
    </>
  );
};

export default RequestStatusCard;
