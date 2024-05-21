import BreadCrumb from "@/components/breadcrumb";
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
import { getFleets } from "@/client/fleetClient";
import Fleet from "./fleet";

const breadcrumbItems = [{ title: "Fleets", link: "/dashboard/fleets" }];
type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export const metadata: Metadata = {
  title: "Fleets | Transgo",
  description: "Fleets page",
};

const page = async ({ searchParams }: paramsProps) => {
  // const session = await getServerSession(authOptions);
  const queryClient = new QueryClient();
  const page = Number(searchParams.page) || 1;

  await queryClient.prefetchQuery({
    queryKey: ["fleets"],
    queryFn: getFleets,
  });

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title="Fleets" />

          <Link
            href={"/dashboard/fleets/create"}
            className={cn(buttonVariants({ variant: "main" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Fleet />
        </HydrationBoundary>
      </div>
    </>
  );
};

export default page;
