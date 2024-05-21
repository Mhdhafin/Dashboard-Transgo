import { getCustomers } from "@/client/customerClient";
import BreadCrumb from "@/components/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import Customer from "./customer";
export const metadata: Metadata = {
  title: "Customers | Transgo",
  description: "Customers page",
};

const breadcrumbItems = [{ title: "Customers", link: "/dashboard/customers" }];
export default async function page() {
  const queryClient = new QueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: ["customers"],
  //   queryFn: getCustomers,
  // });

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title="Customers" />
          <Link
            href={"/dashboard/customers/create"}
            className={cn(buttonVariants({ variant: "main" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Customer />
        </HydrationBoundary>
      </div>
    </>
  );
}
