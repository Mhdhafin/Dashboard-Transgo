"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { Drivers } from "@/constants/data";

import { formatRupiah } from "@/lib/utils";

import "dayjs/locale/id";
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

export const columns: ColumnDef<Drivers>[] = [
  {
    accessorKey: "date",
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Tanggal</span>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {/* {dayjs().locale("id").format("DD - dddd")} */}
        {row.original.email}
      </span>
    ),
  },
  {
    accessorKey: "fleet",
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Armada</span>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {/* Veloz Matic Hitam 2020 ( B 2025 PVC ) */}
        {row.original.email}
      </span>
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
      !row.original.email ? null : (
        <span className="text-green-500 font-medium text-[12px] leading-5 px-2.5 py-1 rounded-full bg-green-50">
          Lunas
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
      <span className="text-sm font-medium">{row.original.email}</span>
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
      !row.original.email ? null : (
        <span className="bg-[#f5f5f5] font-medium text-[12px] leading-5 rounded-full py-1 px-2.5">
          1 Hari
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
      <span className="text-sm font-medium">{row.original.email}</span>
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
      <span className="text-sm font-medium">{row.original.email}</span>
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
      <span className="text-sm font-bold">{row.original.email}</span>
    ),
  },
];
