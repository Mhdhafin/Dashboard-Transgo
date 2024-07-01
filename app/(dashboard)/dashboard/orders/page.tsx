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
import {
  completedColumns,
  onProgressColumns,
  pendingColumns,
} from "@/components/tables/order-tables/columns";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import TabLists from "@/components/TabLists";
import type { Metadata } from "next";
import { OrderTable } from "@/components/tables/order-tables/order-table";

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

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/orders?status=${status}&page=${page}&limit=${pageLimit}` +
      (q ? `&q=${q}` : ""),
    {
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
    },
  );
  const orderRes = await res.json();

  const lists = [
    {
      name: "Menunggu",
      value: "pending",
    },
    {
      name: "Sedang Berjalan",
      value: "on_progress",
    },
    {
      name: "Sudah Bayar",
      value: "done",
    },
  ];

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
          <TabLists lists={lists} />
          <TabsContent value="pending" className="space-y-4">
            <OrderTable
              columns={pendingColumns}
              data={orderRes.items}
              searchKey="name"
              totalUsers={orderRes.meta?.total_items}
              pageCount={Math.ceil(orderRes.meta?.total_items / pageLimit)}
              pageNo={page}
            />
          </TabsContent>
          <TabsContent value="on_progress" className="space-y-4">
            <OrderTable
              columns={onProgressColumns}
              data={orderRes.items}
              searchKey="name"
              totalUsers={orderRes.meta?.total_items}
              pageCount={Math.ceil(orderRes.meta?.total_items / pageLimit)}
              pageNo={page}
            />
          </TabsContent>
          <TabsContent value="done" className="space-y-4">
            <OrderTable
              columns={pendingColumns}
              data={orderRes.items}
              searchKey="name"
              totalUsers={orderRes.meta?.total_items}
              pageCount={Math.ceil(orderRes.meta?.total_items / pageLimit)}
              pageNo={page}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default page;
