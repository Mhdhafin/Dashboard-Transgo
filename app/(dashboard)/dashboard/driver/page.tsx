import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/driver-tables/columns";
import { DriverTable } from "@/components/tables/driver-tables/driver-table";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getDrivers } from "@/client/driverClient";
import Driver from "./driver";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const breadcrumbItems = [{ title: "Driver", link: "/dashboard/driver" }];
type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export const metadata: Metadata = {
  title: "Driver | Transgo",
  description: "Driver page",
};

const page = async ({ searchParams }: paramsProps) => {
  // const session = await getServerSession(authOptions);
  const queryClient = new QueryClient();
  const page = Number(searchParams.page) || 1;

  await queryClient.prefetchQuery({
    queryKey: ["drivers"],
    queryFn: getDrivers,
  });

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Driver(${100})`} />

          <Link
            href={"/dashboard/driver/new"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Driver />
        </HydrationBoundary>
      </div>
    </>
  );
};

export default page;
