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
import { RequestTable } from "@/components/tables/request-tables/request-table";
import {
  completedColumns,
  pendingColumns,
} from "@/components/tables/request-tables/columns";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import TabLists from "@/components/TabLists";
import type { Metadata } from "next";

const breadcrumbItems = [
  { title: "Requests Tasks", link: "/dashboard/requests" },
];
type paramsProps = {
  searchParams: {
    [key: string]: string | undefined;
  };
};

export const metadata: Metadata = {
  title: "Requests | Transgo",
  description: "Requests page",
};

const page = async ({ searchParams }: paramsProps) => {
  const session = await getServerSession(authOptions);
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const q = searchParams.q || null;
  const status = searchParams.status ?? "pending";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/requests?status=${status}&page=${page}&limit=${pageLimit}` +
      (q ? `&q=${q}` : ""),
    {
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
    },
  );
  const requestRes = await res.json();

  const lists = [
    {
      name: "Pending",
      value: "pending",
    },
    {
      name: "On Progress",
      value: "on_progress",
    },
    {
      name: "Done",
      value: "done",
    },
  ];

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title="Requests Tasks" />
          {/* hide button - https://qosim-project.atlassian.net/browse/OMT-32?atlOrigin=eyJpIjoiNmY5MzliYmIyYmM1NDYxMjhiNzNjMTMzYjY5NGEzNjYiLCJwIjoiaiJ9  */}
          {/* show button : 01-08 */}
          <Link
            href={"/dashboard/requests/create"}
            className={cn(buttonVariants({ variant: "main" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <Tabs defaultValue={status} className="space-y-4">
          <TabLists lists={lists} />
          <TabsContent value="pending" className="space-y-4">
            <RequestTable
              columns={pendingColumns}
              data={requestRes.items}
              searchKey="name"
              totalUsers={requestRes.meta?.total_items}
              pageCount={Math.ceil(requestRes.meta?.total_items / pageLimit)}
              pageNo={page}
            />
          </TabsContent>
          <TabsContent value="on_progress" className="space-y-4">
            <RequestTable
              columns={completedColumns}
              data={requestRes.items}
              searchKey="name"
              totalUsers={requestRes.meta?.total_items}
              pageCount={Math.ceil(requestRes.meta?.total_items / pageLimit)}
              pageNo={page}
            />
          </TabsContent>
          <TabsContent value="done" className="space-y-4">
            <RequestTable
              columns={completedColumns}
              data={requestRes.items}
              searchKey="name"
              totalUsers={requestRes.meta?.total_items}
              pageCount={Math.ceil(requestRes.meta?.total_items / pageLimit)}
              pageNo={page}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default page;
