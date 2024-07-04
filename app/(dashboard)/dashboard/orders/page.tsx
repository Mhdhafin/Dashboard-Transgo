import BreadCrumb from "@/components/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Tabs } from "@/components/ui/tabs";
import type { Metadata } from "next";
import OrderTableWrapper from "./order-table-wrapper";

const breadcrumbItems = [{ title: "Pesanan", link: "/dashboard/orders" }];
type paramsProps = {
  searchParams: {
    [key: string]: string | undefined;
  };
};

export const metadata: Metadata = {
  title: "Pesanan | Transgo",
  description: "Requests page",
};

const page = async ({ searchParams }: paramsProps) => {
  const session = await getServerSession(authOptions);
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const q = searchParams.q || null;
  const status = searchParams.status ?? "pending";
  const startDate = searchParams.start_date || "";
  const endDate = searchParams.end_date || "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/orders?status=${status}&page=${page}&limit=${pageLimit}` +
      (q ? `&q=${q}` : "") +
      (startDate ? `&start_date=${startDate}` : "") +
      (endDate ? `&end_date=${endDate}` : ""),
    {
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
    },
  );
  const orderRes = await res.json();
  console.log("res", orderRes);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title="Pesanan" />

          <Link
            href={"/dashboard/orders/create"}
            className={cn(buttonVariants({ variant: "main" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah Pesanan
          </Link>
        </div>
        <Separator />
        <Tabs defaultValue={status} className="space-y-4">
          <OrderTableWrapper
            orderRes={orderRes}
            status={status}
            pageLimit={pageLimit}
            page={page}
          />
        </Tabs>
      </div>
    </>
  );
};

export default page;
