import BreadCrumb from "@/components/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { CustomerTable } from "@/components/tables/customer-tables/customer-table";
import { columns } from "@/components/tables/customer-tables/columns";

export const metadata: Metadata = {
  title: "Customers | Transgo",
  description: "Customers page",
};

type paramsProps = {
  searchParams: {
    [key: string]: string | undefined;
  };
};

const breadcrumbItems = [{ title: "Customers", link: "/dashboard/customers" }];

export default async function page({ searchParams }: paramsProps) {
  const session = await getServerSession(authOptions);
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const q = searchParams.q || null;


  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/customers?page=${page}&limit=${pageLimit}` +
      (q ? `&q=${q}` : ""),
    {
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
    },
  );
  const customerRes = await res.json();
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
        <CustomerTable
          columns={columns}
          data={customerRes.items}
          searchKey="name"
          totalUsers={customerRes.meta?.total_items}
          pageCount={Math.ceil(customerRes.meta?.total_items / pageLimit)}
          pageNo={page}
        />
      </div>
    </>
  );
}
