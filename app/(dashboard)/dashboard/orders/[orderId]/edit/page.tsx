"use client";
import BreadCrumb from "@/components/breadcrumb";
import { OrderForm } from "@/components/forms/order-form";
import Spinner from "@/components/spinner";
import { useGetDetailOrder } from "@/hooks/api/useOrder";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";

export default function Page({ params }: { params: { orderId: number } }) {
    useEffect(() => { });
    const { isMinimized } = useSidebar();

    const breadcrumbItems = [
        { title: "Pesanan", link: "/dashboard/orders" },
        { title: "Tinjau Pesanan", link: "/dashboard/orders/detail" },
    ];

    const { data, isFetching } = useGetDetailOrder(params.orderId);

    return (
        <div className="flex-1 space-y-4 p-5 pr-0">
            <div className={cn(isMinimized ? "w-[936px]" : "w-[700px]")}>
                <BreadCrumb items={breadcrumbItems} />
            </div>
            {isFetching && <Spinner />}
            {!isFetching && data?.data && <OrderForm initialData={data?.data} />}
        </div>
    );
}
