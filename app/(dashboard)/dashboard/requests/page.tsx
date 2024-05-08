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
import { getRequests } from "@/client/requestClient";
import Request from "./request";
const breadcrumbItems = [{ title: "Requests", link: "/dashboard/requests" }];
type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export const metadata: Metadata = {
  title: "Requests | Transgo",
  description: "Requests page",
};

const page = async ({ searchParams }: paramsProps) => {
  // const session = await getServerSession(authOptions);
  const queryClient = new QueryClient();
  const page = Number(searchParams.page) || 1;

  await queryClient.prefetchQuery({
    queryKey: ["requests"],
    queryFn: getRequests,
  });

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title="Requests" />

          <Link
            href={"/dashboard/requests/create"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Request />
        </HydrationBoundary>
      </div>
    </>
  );
};

export default page;
