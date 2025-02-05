"use client";
import BreadCrumb from "@/components/breadcrumb";
import { OrderForm } from "@/components/forms/order-form";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";

export default function Page() {
  useEffect(() => {});
  const { isMinimized } = useSidebar();

  const breadcrumbItems = [
    { title: "Pesanan", link: "/dashboard/orders" },
    { title: "Tambah Pesanan", link: "/dashboard/orders/create" },
  ];

  return (
    <div className="flex-1 space-y-4 p-5">
      <BreadCrumb items={breadcrumbItems} />
      <OrderForm initialData={null} isEdit />
    </div>
  );
}
