"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/UserContext";
import BreadCrumb from "@/components/breadcrumb";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import DiscountTableWrapper from "./discount-table-wrapper";

export default function Page() {
  const breadcrumbItems = [
    { title: "Discount", link: "/dashboard/discount" },
  ];

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title="Discount" />

          <Link
            href={"/dashboard/discount/create"}
            className={cn(buttonVariants({ variant: "main" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah Diskon
          </Link>
        </div>
        <Separator />
        <DiscountTableWrapper />
      </div>
    </>
  );
}