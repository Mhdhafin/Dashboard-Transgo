"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Spinner from "./spinner";
import { Activity, Clock3 } from "lucide-react";
import { useStatusCount } from "@/hooks/api/useStatusCount";

const StatusCard = () => {
  const { data: statusCount, isFetching } = useStatusCount();

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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock3 />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{`${
                count?.pending ?? "0"
              }`}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Progress</CardTitle>
              <Activity />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{`${
                count.on_progress ?? 0
              }`}</div>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};

export default StatusCard;
