"use client";
import BreadCrumb from "@/components/breadcrumb";
import { DiscountForm } from "@/components/forms/discount-form";
import React from "react";

export default function Page() {
    const breadcrumbItems = [
        { title: "Discount", link: "/dashboard/discount" },
        { title: "Create", link: "/dashboard/discount/create" },
    ];

    return (
        <div className="flex-1 space-y-4 p-8">
            <BreadCrumb items={breadcrumbItems} />
            <DiscountForm initialData={null} isEdit />
        </div>
    );
}