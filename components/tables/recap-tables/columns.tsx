"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { formatRupiah } from "@/lib/utils";

import "dayjs/locale/id";
import { IItems } from "@/hooks/components/useRecapsStore";
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

export const columns: ColumnDef<IItems>[] = [
  {
    accessorKey: "date",
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Tanggal</span>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {dayjs(row.original.date).locale("id").format("DD - dddd")}
      </span>
    ),
  },
  {
    accessorKey: "fleet",
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Armada</span>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.original.fleet?.name}</span>
    ),
  },
  {
    accessorKey: "cashflow",
    meta: {
      centerHeader: true,
    },
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">
        Arus Pemasukan
      </span>
    ),
    cell: ({ row }) =>
      !row.original.email ? null : (
        <span className="text-green-500 font-medium text-[12px] leading-5 px-2.5 py-1 rounded-full bg-green-50">
          Pemasukan Tambahan
        </span>
      ),
  },
  {
    accessorKey: "status",
    meta: {
      centerHeader: true,
    },
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Status</span>
    ),
    cell: ({ row }) =>
      !row.original.status ? null : (
        <span className="text-green-500 font-medium text-[12px] leading-5 px-2.5 py-1 rounded-full bg-green-50 capitalize">
          {row.original.status}
        </span>
      ),
  },
  {
    accessorKey: "customer",
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Pelanggan</span>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "explain",
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Keterangan</span>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.description || "-"}
      </span>
    ),
  },
  {
    accessorKey: "duration",
    meta: {
      centerHeader: true,
      stickyColumn: true,
    },
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Waktu</span>
    ),
    enableSorting: false,
    cell: ({ row }) =>
      !row.original.duration ? null : (
        <span className="bg-[#f5f5f5] font-medium text-[12px] leading-5 rounded-full py-1 px-2.5">
          {row.original.duration} Hari
        </span>
      ),
  },
  {
    accessorKey: "amount_plus",
    meta: {
      centerHeader: true,
      stickyColumn: true,
    },
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Debit (+)</span>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.debit_amount
          ? formatRupiah(row.original.debit_amount)
          : ""}
      </span>
    ),
  },
  {
    accessorKey: "amount_min",
    meta: {
      centerHeader: true,
      stickyColumn: true,
    },
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Kredit (-)</span>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.credit_amount
          ? formatRupiah(row.original.credit_amount)
          : ""}
      </span>
    ),
  },
  {
    accessorKey: "commission_amount",
    meta: {
      centerHeader: true,
      stickyColumn: true,
    },
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">
        Perhitungan Komisi
      </span>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-bold">
        {formatRupiah(row.original.commission)}
      </span>
    ),
  },
];
