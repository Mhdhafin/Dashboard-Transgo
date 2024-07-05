"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { cn, formatRupiah } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CalendarDays, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);
dayjs.locale("id");

export const pendingColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Pelanggan</span>
    ),
    cell: ({ row }) => <span>{row.original.customer.name}</span>,
  },
  {
    accessorKey: "fleet",
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Armada</span>
    ),
    cell: ({ row }) => <span>{row.original.fleet.name}</span>,
  },
  {
    accessorKey: "duration",
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Waktu</span>
    ),
    cell: ({ row }) => (
      <HoverCard>
        <HoverCardTrigger className="bg-[#f5f5f5] rounded-full py-1 px-3">
          {row.original.duration} hari
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
            <span className="text-muted-foreground font-normal text-[12px] leading-4">
              Tanggal Pengambilan
            </span>
          </div>
          <div className="pt-1">
            <p className="text-[14px] font-semibold leading-5">
              {dayjs(row.original.start_date).format("dddd, DD MMMM YYYY")}
            </p>
            <p className="text-[14px] font-normal leading-5">
              Jam {dayjs(row.original.start_date).format("H:mm")} WIB
            </p>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
            <span className="text-muted-foreground font-normal text-[12px] leading-4">
              Tanggal Pengembilan
            </span>
          </div>
          <div className="pt-1">
            <p className="text-[14px] font-semibold leading-5">
              {dayjs(row.original.end_date).format("dddd, DD MMMM YYYY")}
            </p>
            <p className="text-[14px] font-normal leading-5">
              Jam {dayjs(row.original.end_date).format("H:mm")} WIB
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    ),
  },
  {
    accessorKey: "total_price",
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">
        Total Harga
      </span>
    ),
    cell: ({ row }) => <span>{formatRupiah(row.original.total_price)}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/orders/${row.original.id}/tinjau`}
        className={cn(buttonVariants({ variant: "main" }))}
        onClick={(e) => e.stopPropagation()}
      >
        Tinjau
      </Link>
    ),
  },
];

export const onProgressColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Pelanggan</span>
    ),
    cell: ({ row }) => <span>{row.original.customer.name}</span>,
  },
  {
    accessorKey: "fleet",
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Armada</span>
    ),
    cell: ({ row }) => <span>{row.original.fleet.name}</span>,
  },
  {
    accessorKey: "duration",
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Waktu</span>
    ),
    cell: ({ row }) => (
      <HoverCard>
        <HoverCardTrigger className="bg-[#f5f5f5] rounded-full py-1 px-3">
          {row.original.duration} hari
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
            <span className="text-muted-foreground font-normal text-[12px] leading-4">
              Tanggal Pengambilan
            </span>
          </div>
          <div className="pt-1">
            <p className="text-[14px] font-semibold leading-5">
              {dayjs(row.original.start_date).format("dddd, DD MMMM YYYY")}
            </p>
            <p className="text-[14px] font-normal leading-5">
              Jam {dayjs(row.original.start_date).format("H:mm")} WIB
            </p>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
            <span className="text-muted-foreground font-normal text-[12px] leading-4">
              Tanggal Pengembilan
            </span>
          </div>
          <div className="pt-1">
            <p className="text-[14px] font-semibold leading-5">
              {dayjs(row.original.end_date).format("dddd, DD MMMM YYYY")}
            </p>
            <p className="text-[14px] font-normal leading-5">
              Jam {dayjs(row.original.end_date).format("H:mm")} WIB
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    ),
  },
  {
    accessorKey: "pic",
    header: () => (
      <HoverCard>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-700">
            Penanggung Jawab
          </span>
          <HoverCardTrigger>
            <Info />
          </HoverCardTrigger>
        </div>
        <HoverCardContent className="w-full" align="start">
          <span className="font-semibold text-xs">
            Ini adalah Penanggung Jawab Pengembalian
          </span>
        </HoverCardContent>
      </HoverCard>
    ),
    cell: ({ row }) => <span>{row.original.end_request.driver.name}</span>,
  },
  {
    accessorKey: "total_price",
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">
        Total Harga
      </span>
    ),
    cell: ({ row }) => <span>{formatRupiah(row.original.total_price)}</span>,
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export const completedColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Pelanggan</span>
    ),
    cell: ({ row }) => <span>{row.original.customer.name}</span>,
  },
  {
    accessorKey: "fleet",
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Armada</span>
    ),
    cell: ({ row }) => <span>{row.original.fleet.name}</span>,
  },
  {
    accessorKey: "duration",
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Waktu</span>
    ),
    cell: ({ row }) => (
      <HoverCard>
        <HoverCardTrigger className="bg-[#f5f5f5] rounded-full py-1 px-3">
          {row.original.duration} hari
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
            <span className="text-muted-foreground font-normal text-[12px] leading-4">
              Tanggal Pengambilan
            </span>
          </div>
          <div className="pt-1">
            <p className="text-[14px] font-semibold leading-5">
              {dayjs(row.original.start_date).format("dddd, DD MMMM YYYY")}
            </p>
            <p className="text-[14px] font-normal leading-5">
              Jam {dayjs(row.original.start_date).format("H:mm")} WIB
            </p>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
            <span className="text-muted-foreground font-normal text-[12px] leading-4">
              Tanggal Pengembilan
            </span>
          </div>
          <div className="pt-1">
            <p className="text-[14px] font-semibold leading-5">
              {dayjs(row.original.end_date).format("dddd, DD MMMM YYYY")}
            </p>
            <p className="text-[14px] font-normal leading-5">
              Jam {dayjs(row.original.end_date).format("H:mm")} WIB
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    ),
  },
  {
    accessorKey: "pic",
    header: () => (
      <HoverCard>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-700">
            Penanggung Jawab
          </span>
          <HoverCardTrigger>
            <Info />
          </HoverCardTrigger>
        </div>
        <HoverCardContent className="w-full" align="start">
          <span className="font-semibold text-xs">
            Ini adalah Penanggung Jawab Pengembalian
          </span>
        </HoverCardContent>
      </HoverCard>
    ),
    cell: ({ row }) => <span>{row.original.end_request.driver.name}</span>,
  },
  {
    accessorKey: "total_price",
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">
        Total Harga
      </span>
    ),
    cell: ({ row }) => <span>{formatRupiah(row.original.total_price)}</span>,
  },
  {
    accessorKey: "status",
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Status</span>
    ),
    cell: ({ row }) => (
      <>
        {row.original.request_status === "pending" ? (
          <div className="bg-red-50 text-red-500 text-xs font-medium flex items-center justify-center px-[10px] py-1 rounded-full">
            Belum Kembali
          </div>
        ) : (
          <div className="bg-green-50 text-green-500 text-xs font-medium flex items-center justify-center px-[10px] py-1 rounded-full">
            Selesai
          </div>
        )}
      </>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
