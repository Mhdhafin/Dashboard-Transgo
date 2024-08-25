"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { cn, formatRupiah } from "@/lib/utils";

import "dayjs/locale/id";
import { IItems } from "@/hooks/components/useRecapsStore";
import {
  getPaymentStatusLabel,
  getStatusVariant,
} from "@/app/(dashboard)/dashboard/orders/[orderId]/types/order";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CalendarDays } from "lucide-react";
import { Separator } from "@/components/ui/separator";
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

export const columns: ColumnDef<IItems>[] = [
  {
    accessorKey: "date",
    header: () => (
      <span className="text-sm font-bold text-neutral-700">Tanggal</span>
    ),
    size: 105,
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.date
          ? dayjs(row.original.date).locale("id").format("DD - dddd")
          : ""}
      </span>
    ),
  },
  {
    accessorKey: "fleet",
    header: () => (
      <span className="text-sm font-bold text-neutral-700">Armada</span>
    ),
    size: 300,
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.original.fleet?.name}</span>
    ),
  },
  {
    accessorKey: "cashflow",
    meta: {
      centerHeader: true,
    },
    size: 154,
    header: () => (
      <span className="text-sm font-bold text-neutral-700">Arus Pemasukan</span>
    ),
    cell: ({ row }) =>
      row.original.category?.name ? (
        <span
          className={cn(
            row.original.debit_amount ? "text-green-500" : "text-red-500",
            row.original.debit_amount ? "bg-green-50" : "bg-red-50",
            "font-medium text-[12px] leading-5 px-2.5 py-1 rounded-full",
          )}
        >
          {row.original.category.name}
        </span>
      ) : null,
  },
  {
    accessorKey: "status",
    meta: {
      centerHeader: true,
    },
    size: 154,
    header: () => (
      <span className="text-sm font-bold text-neutral-700">Status</span>
    ),
    cell: ({ row }) =>
      row.original.status ? (
        <span
          className={cn(
            getStatusVariant(row.original.status),
            "font-medium text-[12px] leading-5 px-2.5 py-1 rounded-full capitalize",
          )}
        >
          {getPaymentStatusLabel(row.original.status)}
        </span>
      ) : null,
  },
  {
    accessorKey: "customer",
    header: () => (
      <span className="text-sm font-bold text-neutral-700">Pelanggan</span>
    ),
    size: 250,
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original?.user?.name || ""}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: () => (
      <span className="text-sm font-bold text-neutral-700">Keterangan</span>
    ),
    size: 250,
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.description || ""}
      </span>
    ),
  },
  {
    accessorKey: "duration",
    meta: {
      centerHeader: true,
      stickyColumn: true,

      index: 3,
    },
    header: () => (
      <span className="text-sm font-bold text-neutral-700">Waktu</span>
    ),
    size: 154,
    enableSorting: false,
    cell: ({ row }) =>
      row.original.duration ? (
        <span className="bg-[#f5f5f5] font-medium text-[12px] leading-5 rounded-full py-1 px-2.5">
          {row.original.duration} Hari
        </span>
      ) : null,
  },
  {
    accessorKey: "amount_plus",
    meta: {
      centerHeader: true,
      stickyColumn: true,

      index: 2,
    },
    size: 154,
    header: () => (
      <span className="text-sm font-bold text-neutral-700">Debit (+)</span>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.debit_amount
          ? "+ " + formatRupiah(row.original.debit_amount)
          : ""}
      </span>
    ),
  },
  {
    accessorKey: "amount_min",
    meta: {
      centerHeader: true,
      stickyColumn: true,

      index: 1,
    },
    size: 154,
    header: () => (
      <span className="text-sm font-bold text-neutral-700">Kredit (-)</span>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.credit_amount
          ? "- " + formatRupiah(row.original.credit_amount)
          : ""}
      </span>
    ),
  },
  {
    accessorKey: "commission_amount",
    meta: {
      centerHeader: true,
      stickyColumn: true,
      index: 0,
    },
    size: 154,
    header: () => (
      <span className="text-sm font-bold text-neutral-700">
        Perhitungan Komisi
      </span>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.commission
          ? `${row.original.commission < 0 ? "-" : "+"} ` +
            formatRupiah(row.original.commission)
          : ""}
      </span>
    ),
  },
];
