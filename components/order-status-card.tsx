"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Spinner from "./spinner";
import { Activity, Clock3 } from "lucide-react";
import Link from "next/link";
import { useOrdersStatusCount } from "@/hooks/api/useOrder";

const OrderStatusCard = () => {
  const { data: statusCount, isFetching } = useOrdersStatusCount();

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
              pathname: "/dashboard/orders",
              query: { status: "pending" },
            }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock3 />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{`${
                  count?.[0].count ?? "0"
                }`}</div>
              </CardContent>
            </Card>
          </Link>
          <Link
            href={{
              pathname: "/dashboard/orders",
              query: { status: "on_progress" },
            }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  On Progress
                </CardTitle>
                <Activity />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{`${
                  count?.[1].count ?? 0
                }`}</div>
              </CardContent>
            </Card>
          </Link>
        </>
      )}
    </>
  );
};

export default OrderStatusCard;
