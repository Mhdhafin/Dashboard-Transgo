"use client";
import React from "react";
import { TabsList, TabsTrigger } from "./ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const TabLists = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );
  return (
    <TabsList>
      <TabsTrigger
        value="pending"
        onClick={() => {
          router.push(pathname + "?" + createQueryString("status", "pending"));
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
  );
};

export default TabLists;
