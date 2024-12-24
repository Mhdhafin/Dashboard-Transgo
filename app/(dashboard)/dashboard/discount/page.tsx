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
  // const [discount, setDiscount] = useState(0);
  // const { toast } = useToast();
  // const { user } = useUser();

  // useEffect(() => {
  //   const fetchDiscount = async () => {
  //     try {
  //       const response = await fetch(`${API_HOST}/fleets/discount`);
  //       const data = await response.text();
  //       setDiscount(Number(data));
  //     } catch (error) {
  //       console.error("Failed to fetch discount:", error);
  //     }
  //   };

  //   fetchDiscount();
  // });

  // const handleSave = async () => {
  //   try {
  //     const response = await fetch(`${API_HOST}/fleets/discount`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${user?.accessToken}`,
  //       },
  //       body: JSON.stringify({ discount }),
  //     });

  //     if (response.ok) {
  //       toast({
  //         title: "Discount saved",
  //         description: `Discount percentage set to ${discount}%`,
  //       });
  //     } else {
  //       throw new Error("Failed to save discount");
  //     }
  //   } catch (error) {
  //     console.error("Failed to save discount:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to save discount",
  //       variant: "destructive",
  //     });
  //   }
  // };

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